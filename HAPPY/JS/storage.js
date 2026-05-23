let statsViewMode = 'activity';
let statsMonth = new Date().getMonth();
let calendarMode = 'month';
let showYearlyActivity = true;
let isAppReady = false;
let isLocalForced = false;
try {
    const s = localStorage.getItem('pt_settings');
    if (s) isLocalForced = JSON.parse(s).forceLocal || false;
} catch(e) {}

// 2. Récupération des identifiants stockés (hm_cloud_auth)
let authData = { user: null, pass: null };
try {
    const a = localStorage.getItem('hm_cloud_auth');
    if (a) authData = JSON.parse(a);
} catch(e) {}

// 3. DÉFINITION DE L'UTILISATEUR (La logique cruciale)
// Priorité :
// - Si Mode Local Forcé => NULL (On coupe tout)
// - Sinon : On regarde l'URL. Si pas d'URL, on regarde le localStorage (authData).
const urlUser = new URLSearchParams(window.location.search).get('user');

// C'est ICI que ça se joue :
let user = isLocalForced ? null : (urlUser || authData.user || null);
let pass = isLocalForced ? null : (authData.pass || null);

// Initialisation des variables de stockage
let cache = {};
let modifiedKeys = new Set();

// Nouvelle fonction pour se connecter via l'interface
async function handleCloudConnect() {
    const userInput = document.getElementById('cloud-user').value.trim();
    const passInput = document.getElementById('cloud-pass').value.trim();

    if (!userInput || !passInput) {
        showToast("Identifiants manquants", "error");
        return;
    }

    try {
        // On demande au serveur de vérifier le mot de passe
        const response = await fetch('./auth.php', {
            method: 'POST',
            body: JSON.stringify({ user: userInput, pass: passInput }),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.success) {
            // Si OK, on enregistre et on recharge
            user = userInput;
            pass = passInput;
            localStorage.setItem('hm_cloud_auth', JSON.stringify({ user, pass }));
            
            showModal("Connexion réussie", `Bienvenue ${user}. Chargement de vos données...`, () => {
                location.reload();
            });
        } else {
            showModal("Erreur", "Mot de passe incorrect pour le niveau BASIC.");
        }
    } catch (e) {
        console.error("Erreur auth", e);
        showToast("Erreur de connexion au serveur d'authentification", "error");
    }
}

function handleCloudLogout() {
    localStorage.removeItem('hm_cloud_auth');
    location.href = window.location.pathname; // Recharge sans les params URL
}

// Mise à jour de syncToPhp pour inclure le mot de passe (sécurité PHP)
async function syncToPhp() {
    if (!user || modifiedKeys.size === 0) return;
    const dataToSend = {};
    modifiedKeys.forEach(key => {
        let val = cache[key];
        dataToSend[key] = (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
    });

    try {
        await fetch('./save.php', {
            method: 'POST',
            body: JSON.stringify({ user, pass, data: dataToSend }), // Envoi du pass
            headers: { 'Content-Type': 'application/json' }
        });
        modifiedKeys.clear();
    } catch (e) { console.error("Erreur synchro", e); }
}
function setItem(key, value) {
    if (user) {
        cache[key] = value;
        modifiedKeys.add(key);
    } else {
        localStorage.setItem(key, value);
    }
}

function getItem(key) {
    if (user) {
        return cache[key] === undefined ? null : cache[key];
    } else {
        return localStorage.getItem(key);
    }
}

function removeItem(key) {
    if (user) {
        cache[key] = null; // Marqué pour suppression côté PHP
        modifiedKeys.add(key);
    } else {
        localStorage.removeItem(key);
    }
}


async function init() {
    // --- A. UI CONNEXION ---
    if (user) {
        // On cache le formulaire de connexion
        const loginForm = document.getElementById('login-form-fields');
        if (loginForm) loginForm.style.display = 'none';

        // On affiche le statut connecté
        const loggedStatus = document.getElementById('logged-status');
        if (loggedStatus) {
            loggedStatus.style.display = 'block';
            const spanUser = document.getElementById('display-username');
            if (spanUser) spanUser.innerText = user;
            
            // Si l'utilisateur vient de l'URL, on verrouille le bouton déconnexion
            if (typeof urlUser !== 'undefined' && urlUser) { 
                 const btn = loggedStatus.querySelector('button');
                 if(btn) btn.style.display = 'none';
                 loggedStatus.innerHTML += '<div style="font-size:0.6rem; color:var(--text-dim); margin-top:5px;">🔒 Session URL</div>';
            }
        }
    }

    // --- B. CHARGEMENT CLOUD (Prioritaire) ---
    if (user) {
        try {
            console.log("Tentative connexion Cloud pour :", user);
            // AJOUT : &t=Date.now() pour empêcher le navigateur de garder une vieille version en cache
            const response = await fetch(`./load.php?user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass || '')}&t=${Date.now()}`);
            if (response.ok) {
                cache = await response.json();
                console.log("✅ Données chargées :", cache);
            }
        } catch (e) { console.error("Erreur Load PHP:", e); }
    }

    // --- C. CHARGEMENT DES DONNÉES (Via getItem qui choisit Cache ou LocalStorage) ---

// 1. Paramètres (Pas de changement majeur ici)
    habit_view_mode = getItem('habit_view_mode') || 'grid';
    if (typeof toggleView === 'function') toggleView(habit_view_mode);
    
    calendarMode = getItem('calendarMode') || 'month';
    const rawYearly = getItem('showYearlyActivity');
    showYearlyActivity = (rawYearly !== 'false' && rawYearly !== false);
    
    const savedPro = getItem('habit_pro_mode');
    store.isProMode = (savedPro === 'true' || savedPro === true);

    // 2. PROFILS (Check plus robuste)
    const rawProfiles = getItem('hm_v6_profiles');
    if (rawProfiles && rawProfiles !== "undefined" && rawProfiles !== "null") {
        try {
            const parsed = typeof rawProfiles === 'string' ? JSON.parse(rawProfiles) : rawProfiles;
            // Sécurité : On ne remplace que si c'est un tableau valide
            if (Array.isArray(parsed)) {
                store.profiles = parsed;
            }
        } catch(e) { console.error("Erreur parsing profils", e); }
    }

    // 3. XP & COINS (Correction du bug du "0")
    const rawXp = getItem('hm_v6_xp');
    // On vérifie que ce n'est pas null ou undefined. "0" ou 0 est accepté.
    if (rawXp !== null && rawXp !== undefined) {
        store.xp = parseInt(rawXp);
    }

    const rawCoins = getItem('hm_v6_coins');
    if (rawCoins !== null && rawCoins !== undefined) {
        store.coins = parseInt(rawCoins);
    }

    // 4. INVENTAIRE & SESSIONS
    const rawInv = getItem('hm_v6_inv');
    if (rawInv) {
        store.inventory = typeof rawInv === 'string' ? JSON.parse(rawInv) : rawInv;
    }
    
    const rawSessions = getItem('hm_v6_sessions');
    if (rawSessions) {
        store.activeSessions = typeof rawSessions === 'string' ? JSON.parse(rawSessions) : rawSessions;
    }

    // 5. EVENTS & THEME
    store.events = loadAllEvents();
    
    const savedTheme = getItem('hm_v6_theme');
    if (savedTheme) store.activeTheme = savedTheme;
    if (typeof applyTheme === 'function') applyTheme(store.activeTheme);

    // --- D. RENDU ET DÉVERROUILLAGE ---

    // Messages... (identique)
    setInterval(() => {
    updateDashboardTimers(); // Met à jour les chiffres des chronos (rapide, ne détruit pas les boutons)
    // checkAutoPenalties(); // Ne le mets pas toutes les secondes, c'est trop lourd !
}, 1000);

    setInterval(() => {
    checkAutoPenalties();
}, 60000);
    // Nettoyage données par défaut
    store.profiles.forEach(p => {
        if (p.badgeIndex === undefined) p.badgeIndex = 0;
        if (p.strikes === undefined) p.strikes = 0;
    });

    updateRanks();
    renderAll();
    syncLocalModeUI();
    applyProMode();

    // === LE MOMENT CRUCIAL ===
    // Tout est chargé. On autorise enfin les sauvegardes.
    isAppReady = true; 
    console.log("🚀 Application prête. Sauvegardes activées.");
    trackVisit("Habitude");
    // Lancement Synchro Auto
    if (user) {
        setTimeout(() => {
            setInterval(syncToPhp, 2000);
        }, 1000);
    }
}
function save() {
    // SÉCURITÉ CRITIQUE :
    // Si l'application n'a pas fini de charger, on INTERDIT la sauvegarde
    // pour ne pas écraser les données du serveur avec des variables vides.
    if (!isAppReady) {
        console.warn("⚠️ Tentative de sauvegarde bloquée : L'application charge encore.");
        return;
    }

    console.log("💾 Sauvegarde en cours...");

    setItem('hm_v6_profiles', JSON.stringify(store.profiles));
    saveEventsByMonth(store.events); // Ta fonction existante
    
    // On convertit en String pour éviter les bugs de types
    setItem('hm_v6_xp', String(store.xp));
    setItem('hm_v6_coins', String(store.coins));
    setItem('hm_v6_inv', JSON.stringify(store.inventory));
    setItem('hm_v6_theme', store.activeTheme);
    
    renderHeader();
}

function saveSessions() {
    setItem('hm_v6_sessions', JSON.stringify(store.activeSessions));
}
function loadAllEvents() {
    let allEvents = [];
    
    // 1. Migration ancien format
    const legacyData = getItem('hm_v6_events');
    if (legacyData) {
        try {
            const parsed = typeof legacyData === 'string' ? JSON.parse(legacyData) : legacyData;
            if (Array.isArray(parsed)) allEvents = parsed;
        } catch (e) { console.error(e); }
    }

    // 2. Charger par mois
    // Correction : On boucle sur les clés du cache si user, sinon sur localStorage
    const keys = user ? Object.keys(cache) : Object.keys(localStorage);

    keys.forEach(key => {
        if (key.startsWith('hm_v6_ev_')) {
            try {
                const rawData = getItem(key);
                const chunk = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                if (Array.isArray(chunk)) {
                    allEvents = allEvents.concat(chunk);
                }
            } catch (e) { console.error("Erreur mois " + key, e); }
        }
    });

    const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());
    return uniqueEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
}
function saveEventsByMonth(events) {
    if (!Array.isArray(events)) return;

    // 1. Regroupement par mois (ex: "2026_01")
    const buckets = {};
    events.forEach(e => {
        const d = new Date(e.date);
        // Clé : hm_v6_ev_AAAA_MM
        const key = `hm_v6_ev_${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}`;
        
        if (!buckets[key]) buckets[key] = [];
        buckets[key].push(e);
    });

    // 2. Sauvegarde de chaque mois individuellement
    Object.keys(buckets).forEach(key => {
        setItem(key, JSON.stringify(buckets[key]));
    });

    // 3. Nettoyage : Si on a migré, on supprime le gros fichier unique pour éviter les conflits
    if (getItem('hm_v6_events')) {
        removeItem('hm_v6_events');
    }
}
function importData(input) {
    const file = input.files[0];
    if(!file) return;

    // Reset de l'input pour permettre de réimporter le même fichier si besoin
    input.value = '';

    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            console.log("📂 Lecture du fichier...");
            const json = JSON.parse(e.target.result);

            // 1. VÉRIFICATION : Est-ce que le fichier contient des profils ?
            if (!json.profiles || !Array.isArray(json.profiles)) {
                showModal("Erreur", "Fichier invalide : Aucun profil trouvé.");
                return;
            }

            console.log(`✅ Trouvé : ${json.profiles.length} profils et ${json.events ? json.events.length : 0} événements.`);

            // 2. MAPPING MANUEL (On force les données au bon endroit)
            // On ne fait pas "store = json" pour éviter d'écraser des méthodes, on remplit champ par champ.
            
            store.profiles = json.profiles;
            store.events = json.events || []; 
            store.xp = json.xp || 0;
            store.coins = json.coins || 0;
            
            // Gestion de l'inventaire (Ton JSON a "inventory" ET "inv", on privilégie inventory)
            store.inventory = json.inventory || json.inv || {
                jokers: 0, confetti: 0, ownedThemes: ['default'],
                potionXP: 0, insurance: 0, eraser: 0, freeze: 0
            };

            store.activeTheme = json.activeTheme || 'default';
            
            // Sessions actives (optionnel)
            store.activeSessions = json.activeSessions || {};

            // 3. NETTOYAGE PRÉALABLE (Pour éviter les doublons d'anciens mois)
            // On supprime physiquement les clés d'événements
            if (user) {
                // En mode Cloud, on nettoie le cache
                Object.keys(cache).forEach(k => {
                    if(k.startsWith('hm_v6_ev_')) delete cache[k];
                });
            } else {
                // En mode Local, on nettoie le localStorage
                Object.keys(localStorage).forEach(k => {
                    if(k.startsWith('hm_v6_ev_')) localStorage.removeItem(k);
                });
            }

            // 4. SAUVEGARDE LOCALE / CACHE
            // C'est cette étape qui découpe store.events en mois (hm_v6_ev_2026_01...)
            console.log("💾 Sauvegarde en cours...");
            save(); 

            // --- VÉRIFICATION IMMÉDIATE ---
            // On vérifie si la sauvegarde a bien écrit quelque chose
            const checkProfiles = getItem('hm_v6_profiles');
            console.log("🔍 Vérification post-sauvegarde (Profils) :", checkProfiles);
            
            if (!checkProfiles || checkProfiles === "[]") {
                showModal("Erreur Critique", "L'importation a échoué : La sauvegarde refuse d'écrire les profils.");
                return;
            }

            // 5. SYNCHRONISATION CLOUD (Si connecté)
            if (user) {
                // On force l'ajout des clés importantes dans la liste d'envoi
                const keysToSync = [
                    'hm_v6_profiles', 'hm_v6_xp', 'hm_v6_coins', 
                    'hm_v6_inv', 'hm_v6_theme', 'habit_view_mode',
                    'hm_v6_sessions'
                ];
                
                keysToSync.forEach(k => modifiedKeys.add(k));

                // On ajoute toutes les clés d'événements présentes dans le cache
                Object.keys(cache).forEach(k => {
                    if (k.startsWith('hm_v6_ev_')) modifiedKeys.add(k);
                });

                showToast("Synchronisation vers le serveur...", "info", 4000);
                await syncToPhp(); 
            }

            showModal("Succès", `Importation réussie !\n${json.profiles.length} profils chargés.`, () => {
                location.reload(); 
            });

        } catch(err) {
            console.error("ERREUR IMPORT :", err);
            showModal("Erreur", "Impossible de lire le fichier JSON.");
        }
    };
    reader.readAsText(file);
}
function exportData() {
    // Création de la date formatée
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // 2026-01-30
    const timeStr = now.getHours() + 'h' + now.getMinutes().toString().padStart(2, '0');
    
    const dataStr = JSON.stringify(store);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `habitmaster_backup_${dateStr}_${timeStr}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast("Exportation réussie", "gain");
}

function syncLocalModeUI() {
    // On utilise getItem car ce réglage est dans ta logique de stockage habituelle
    const rawSettings = localStorage.getItem('pt_settings');
    if (rawSettings) {
        // Sécurité : si rawSettings est déjà un objet (via Cloud), on ne parse pas
        const settings = typeof rawSettings === 'string' ? JSON.parse(rawSettings) : rawSettings;
        const isLocal = settings.forceLocal || false;
        const toggle = document.getElementById('localModeToggle');
        if (toggle) toggle.checked = isLocal;
    }
}

function toggleLocalMode(isLocal) {
    const settings = { forceLocal: isLocal };
    
    // CORRECTION : localStorage avec un 'S' majuscule
    // On utilise localStorage en direct ici car ce réglage doit être lisible 
    // par ton script de chargement (le IIFE) AVANT que getItem ne soit défini.
    localStorage.setItem('pt_settings', JSON.stringify(settings));
    
    const msg = isLocal ? "Mode local activé (Fichiers JS/CSS locaux)" : "Mode distant activé (Fichiers polocrafting.fr)";
    showToast(msg, 'gain');
    
    setTimeout(() => {
        showModal("Changement de source", "Recharger la page pour appliquer les nouveaux scripts ?", () => {
            location.reload();
        });
    }, 1000);
}