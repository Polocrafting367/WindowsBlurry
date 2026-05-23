function processTrigger(profileId, comment, specifics) {
    const now = new Date();
    const profile = store.profiles.find(p => p.id === profileId);
    if (!profile) return;

    const freq = parseFloat(profile.frequency || 1);
    const history = store.events.filter(e => e.profileId === profileId).sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastEvent = history[0];

    profile.strikes = parseInt(profile.strikes) || 0;

    // --- GESTION DES OBJETS AUTOMATIQUES ---
    
    // 1. Potion XP (x2)
    let xpMultiplier = 1;
    if (store.inventory.potionXP > 0) {
        store.inventory.potionXP--;
        xpMultiplier = 2;
        showToast("Potion XP utilisée ! (XP x2)", "gain");
    }

    // 2. Confettis (Visuel uniquement)
    if (store.inventory.confetti > 0 && (profile.type === 'good' || profile.type === 'sport')) {
        store.inventory.confetti--;
        spawnConfetti(); // Déclenche l'animation
    }

    let basePts = 0;
    let msg = "";

    // ============================================================
    // TYPE: GOOD & SPORT
    // ============================================================
    if (profile.type === 'good' || profile.type === 'sport') {
        const limitHeart = 48 * freq;
        const limitDead = 72 * freq;
        const hoursSince = lastEvent ? getEffectiveElapsedHours(new Date(lastEvent.date)) : 0;

        if (lastEvent && hoursSince >= limitDead) {
            basePts = 20 * freq;
            msg = "Série perdue... Nouveau départ !";
            profile.heartLostInStreak = false; 
        } 
        else if (lastEvent && hoursSince >= limitHeart) {
            if (profile.heartLostInStreak === true) {
                msg = "Retard validé (Pénalité déjà payée)";
                basePts = 10 * freq;
            } 
            else {
                // 3. Assurance Vie (Protection contre perte de coeur)
                if (store.inventory.insurance > 0) {
                    store.inventory.insurance--;
                    msg = "Assurance : Cœur sauvé !";
                } else {
                    profile.strikes = profile.strikes + 1; 
                    profile.heartLostInStreak = true; 
                    msg = "Validé en retard : -1 ❤️";
                    
                    if (profile.strikes >= 3) {
                        if (profile.badgeIndex > 0) profile.badgeIndex--;
                        profile.strikes = 0;
                        profile.heartLostInStreak = false; 
                        msg = "3 Strikes : RÉTROGRADÉ !";
                    }
                }
                basePts = 10 * freq;
            }
        } 
        else {
            profile.heartLostInStreak = false; 
            const virtualHistory = [{date: now.toISOString()}, ...history];
            let streakVal = calculateDailyStreak(virtualHistory, freq);

            const streakBonus = Math.min(100, streakVal * 5);
            basePts = (20 + streakBonus) * freq;
            msg = `Série validée ! 🔥`;
            
            if (profile.badgeIndex < RANKS.length - 1) {
                if (streakVal >= RANKS[profile.badgeIndex + 1].threshold) {
                    profile.badgeIndex++;
                    profile.strikes = 0; 
                    msg += " -> PROMOTION !";
                    spawnConfetti();
                }
            }
        }
    }
    
    // ============================================================
    // TYPE: BAD
    // ============================================================
    else {
        const lastDate = lastEvent ? new Date(lastEvent.date) : new Date(profile.createdAt || Date.now());
        const hoursSince = (now - lastDate) / (3600 * 1000);
        const daysSince = Math.floor(hoursSince / 24);

        if (daysSince >= 1) {
            const ptsPerDay = Math.round(10 / freq);
            const autoBonus = daysSince * ptsPerDay;
            store.xp += autoBonus;
            store.coins += Math.round(autoBonus * 0.5);
            showToast(`+${autoBonus} XP récupérés avant l'incident`, 'gain');
        }

        // 4. Joker (Protection contre incident)
        if (store.inventory.joker > 0) {
            store.inventory.joker--;
            basePts = 0;
            msg = "Joker utilisé : Chute annulée !";
        } 
        else if (store.inventory.insurance > 0) {
            store.inventory.insurance--;
            basePts = 0;
            msg = "Assurance : Crash évité";
        } else {
            profile.strikes = profile.strikes + 1;
            msg = daysSince < 1 ? "Chute immédiate !" : `Incident (${daysSince}j tenus)`;
            
            if (profile.strikes >= 3) {
                if (profile.badgeIndex > 0) profile.badgeIndex--;
                profile.strikes = 0;
                msg = "RÉTROGRADÉ !";
            }
        }
    }

    // ============================================================
    // FINALISATION
    // ============================================================
    const info = getLevelInfo(store.xp);
    let finalPts = basePts * xpMultiplier;
    let coinBonus = 1 + (Math.floor(info.level / 10) * 0.05);

    store.events.push({
        id: Date.now(),
        profileId,
        date: now.toISOString(),
        xp: finalPts,
        comment: comment || "",
        specifics: specifics || {}
    });

    store.xp += finalPts;
    if (store.xp < 0) store.xp = 0;
    if (finalPts > 0) store.coins += Math.round(finalPts * coinBonus);

    save(); 
    renderAll(); 
// On n'affiche le toast que si le message existe ET que le mode PRO est désactivé
if (msg) {
    // Si mode PRO : on affiche juste le msg. Sinon : XP + msg.
    const toastText = store.isProMode ? msg : `${finalPts >= 0 ? '+' : ''}${Math.round(finalPts)} XP : ${msg}`;
    
    showToast(toastText, finalPts >= 0 ? 'gain' : 'loss');
}
}
function triggerEvent(profileId) {
    const now = new Date();
    const profile = store.profiles.find(p => p.id === profileId);
    if (!profile) return;

    // --- LOGIQUE COMMUNE : Check Anti-spam (15 min) ---
    // On cherche le dernier événement (hors bonus/récompense) pour ce profil
    const lastEvent = store.events
        .filter(e => e.profileId === profileId && !e.isBonus)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (lastEvent) {
        const diffMin = (now - new Date(lastEvent.date)) / (1000 * 60);
        const waitLimit = 15; // Ta nouvelle limite en minutes

        if (diffMin < waitLimit) {
            const remaining = Math.ceil(waitLimit - diffMin);
            showToast(`Trop tôt ! Attends encore ${remaining} min.`, 'loss');
            return; 
        }
    }

    // ============================================================
    // 1. LOGIQUE SPORT (AVEC SÉRIES & PAUSE)
    // ============================================================
    if (profile.type === 'sport') {
        // Init Session si n'existe pas
        if (!store.activeSessions[profileId]) {
            store.activeSessions[profileId] = { 
                startTime: Date.now(), 
                currentSetIndex: 0, 
                timerState: 'running', 
                pauseStartTime: null,  
                totalPausedTime: 0,    
                sets: [{}],         
                comment: "" 
            };
            saveSessions();
            renderDashboard();
        }
        
        renderSportSessionUI(profileId);
        return;
    }
    
    // ============================================================
    // 2. LOGIQUE STANDARD (Good/Bad)
    // ============================================================
    let html = `<div class="standard-modal-layout">
        <div class="input-box">
            <label class="input-label-block">Commentaire global</label>
            <textarea id="mainComment" placeholder="..." class="input-text-simple" style="min-height:50px; border:none; border-bottom:1px solid var(--grid-line);"></textarea>
        </div>`;

    let fields = profile.noteFields || [];
    if (fields.length === 0 && profile.noteTitles) {
        fields = profile.noteTitles.map(t => ({ label: t, type: 'text' }));
    }

    if (fields.length > 0) {
        fields.forEach((f, idx) => {
            const inputId = `custom-input-${idx}`;
            const displayId = `val-${idx}`;
            const defaultVal = f.min || 0;
            
            if (f.type === 'number' || f.type === 'counter') {
                html += `
                <div class="input-box counter-wrapper">
                    <span class="input-label">${f.label}</span>
                    <div class="counter-controls">
                        <button onclick="updateModalInput('${inputId}', -1)" class="btn-counter">-</button>
                        <input type="number" id="${inputId}" class="custom-note-input input-counter" data-label="${f.label}" data-type="${f.type}" value="${defaultVal}">
                        <button onclick="updateModalInput('${inputId}', 1)" class="btn-counter">+</button>
                    </div>
                </div>`;
            } else if (f.type === 'slider') {
                const min = parseInt(f.min || 1);
                const max = parseInt(f.max || 10);
                const mid = Math.ceil((min + max) / 2);

                html += `
                <div class="input-box slider-wrapper">
                    <div class="slider-header">
                        <label class="input-label">${f.label}</label>
                        <span id="${displayId}" class="slider-value-display">—</span>
                    </div>
                    <div class="slider-container">
                        <span class="slider-bound">${min}</span>
                        <input type="range" id="${inputId}" class="custom-note-input slider-untouched custom-range" 
                            data-label="${f.label}" data-type="slider"
                            min="${min}" max="${max}" value="${mid}" 
                            oninput="onSliderInteraction(this, '${displayId}')">
                        <span class="slider-bound">${max}</span>
                    </div>
                </div>`;
            } else if (f.type === 'checkbox') {
                 html += `
                 <div class="input-box">
                    <label class="checkbox-label">
                        <input type="checkbox" class="custom-note-input custom-checkbox" data-label="${f.label}" data-type="checkbox">
                        <span class="input-label">${f.label}</span>
                    </label>
                 </div>`;
            } else {
                html += `
                <div class="input-box">
                    <label class="input-label-block">${f.label}</label>
                    <input type="text" class="custom-note-input input-text-simple" data-label="${f.label}" data-type="text">
                </div>`;
            }
        });
    }
    html += `</div>`;

    showModal(profile.type === 'good' ? "Valider l'action" : "Déclarer l'incident", html, () => {
        const comment = document.getElementById('mainComment').value;
        const specifics = {};

        document.querySelectorAll('.custom-note-input').forEach(input => {
            const label = input.dataset.label;
            const type = input.dataset.type;
            let val = input.value;
            if (type === 'slider' && input.classList.contains('slider-untouched')) return;
            if (type === 'checkbox') { if (!input.checked) return; val = "Oui"; }
            if (val && val.trim() !== "") specifics[label] = val;
        });

        processTrigger(profileId, comment, specifics);
    });
}
function executeTrigger(profileId, now, basePts, xpMultiplier, msg, profile) {
    const info = getLevelInfo(store.xp);
    let finalPts = basePts * xpMultiplier;

    // Bonus de Coins : +5% par tranche de 10 niveaux
    let coinBonus = 1 + (Math.floor(info.level / 10) * 0.05);

    store.events.push({
        id: Date.now(),
        profileId,
        date: now.toISOString(),
        xp: finalPts
    });

    store.xp += finalPts;
    if (store.xp < 0) store.xp = 0;
    if (finalPts > 0) store.coins += Math.round(finalPts * coinBonus);

    save();
    if (msg) showToast(`${finalPts > 0 ? '+' : ''}${Math.round(finalPts)} XP : ${msg}`, finalPts >= 0 ? 'gain' : 'loss');
    renderAll();
}
function checkAutoPenalties() {
    let changed = false;
    const now = new Date();

    store.profiles.forEach(p => {
        // Cette logique ne concerne que Good et Sport (Bad est manuel)
        if (p.type === 'bad') return;

        const freq = parseFloat(p.frequency || 1);
        const limitHeart = 48 * freq; // Seuil de perte de cœur
        const limitDead = 72 * freq;  // Seuil de mort (optionnel, ici on gère le cœur)

        // Récupération dernier event
        const history = store.events.filter(e => e.profileId === p.id).sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastEvent = history[0];

        if (lastEvent) {
            const hoursSince = getEffectiveElapsedHours(new Date(lastEvent.date));

            // SI le temps est dépassé (>= 48h) ET qu'on est pas encore "Mort" (< 72h)
            // ET que le cœur n'a pas encore été débité pour cette série
            if (hoursSince >= limitHeart && hoursSince < limitDead && !p.heartLostInStreak) {
                
                // 1. On applique le Strike
                p.strikes = (parseInt(p.strikes) || 0) + 1;
                p.heartLostInStreak = true; // IMPORTANT : Marque que la pénalité est payée
                changed = true;
                
                showToast(`Temps écoulé pour ${p.title} : -1 ❤️`, 'loss');

                // 2. Vérification Rétrogradation immédiate
                if (p.strikes >= 3) {
                    if (p.badgeIndex > 0) p.badgeIndex--;
                    p.strikes = 0;
                    p.heartLostInStreak = false; // Reset car on change de niveau
                    showToast(`${p.title} : 3 Strikes -> RÉTROGRADÉ !`, 'loss');
                }
            }
        }
    });

    // Si on a touché aux données, on sauvegarde et on rafraîchit l'écran
    if (changed) {
        save();
        renderAll();
    }
}
function updateRanks() {
    let changed = false;
    const now = new Date();

    store.profiles.forEach(p => {
        // Mémorise l'ancien rang
        const oldIndex = p.badgeIndex;

        const events = store.events.filter(e => e.profileId === p.id).sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastTime = events[0] ? new Date(events[0].date).getTime() : new Date(p.createdAt || Date.now()).getTime();
        const diffDays = getEffectiveElapsedHours(lastTime) / 24;
        
        let valueToCompare = 0;

        if (p.type === 'sport') {
            valueToCompare = calculateDailyStreak(events, p.frequency || 1);
        } else if (p.type === 'good') {
            let currentStreak = 0;
            if (events.length > 0) {
                let tempLast = now.getTime();
                const limitBreak = 48 * (p.frequency || 1);
                for (let e of events) {
                    let t = new Date(e.date).getTime();
                    if ((tempLast - t) / (3600 * 1000) < limitBreak) {
                        currentStreak++;
                        tempLast = t;
                    } else break;
                }
            }
            valueToCompare = currentStreak;
        } else {
            // BAD
            valueToCompare = diffDays;
        }

        // Logique de montée en grade
        while (p.badgeIndex < RANKS.length - 1) {
            const nextRank = RANKS[p.badgeIndex + 1];
            if (valueToCompare >= nextRank.threshold) {
                p.badgeIndex++;
                p.strikes = 0;
                changed = true;
            } else {
                break;
            }
        }

        // === NOUVEAU : DÉTECTION PASSAGE DE NIVEAU ===
        if (p.badgeIndex > oldIndex) {
            const newRankName = RANKS[p.badgeIndex].name;
            spawnGoldConfetti();
            // Durée de 6 secondes (6000ms) pour bien lire
            showToast(`Niveau supérieur pour ${p.title} !<br>Maintenant <strong style="color:#ffd700">${newRankName}</strong>`, 'gold', 7000);
        }
    });

    if (changed) save();
}
    // --- HELPERS ---
    function getLevelInfo(xp) {
        let lvl = 1; let cost = 200; let tempXp = xp;
        while (tempXp >= cost) { tempXp -= cost; lvl++; cost += 200; }
        return { level: lvl, current: tempXp, max: cost };
    }
    function calculateDailyStreak(events, freq = 1) {
    if (!events || events.length === 0) return 0;

    // 1. Tri par date (du plus récent au plus vieux)
    const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 2. Vérification "Est-ce que je suis mort AUJOURD'HUI ?"
    // Si le dernier événement remonte à plus de 72h, la série est perdue d'office.
    const lastEventDate = new Date(sortedEvents[0].date);
    const hoursSinceLast = (new Date() - lastEventDate) / (1000 * 3600);
    if (hoursSinceLast >= 72 * freq) return 0;

    let streak = 0;
    let lastProcessedDate = null; // Pour gérer les doublons de jours

    // 3. Boucle sur l'historique
    for (let i = 0; i < sortedEvents.length; i++) {
        const currentEventDate = new Date(sortedEvents[i].date);
        
        // On ignore les heures pour comparer les "jours" calendaires afin d'éviter
        // d'incrémenter le compteur si on fait 2 fois du sport le même jour.
        const currentDayStr = currentEventDate.toDateString();

        if (currentDayStr === lastProcessedDate) {
            continue; // Même jour, on passe (on ne compte pas double)
        }

        // S'il y a un événement précédent (donc plus récent dans la boucle), on compare l'écart
        if (lastProcessedDate !== null) {
            // On récupère l'événement précédent dans la boucle (le jour d'après chronologiquement)
            // Note: Comme on skip les doublons, il faut retrouver le "valid" précédent.
            // Pour simplifier : on compare currentEventDate avec la date qui a permis d'incrémenter streak juste avant.
            // Mais ici, une approche plus simple est de regarder l'écart avec le PRECEDENT itéré valide.
        }
        
        // --- Simplification Robuste ---
        // On va comparer cet événement (i) avec le suivant (i+1) pour savoir si la chaîne continue.
        // Mais comme on veut compter 1 pour le premier groupe, faisons autrement :
        
        streak++;
        lastProcessedDate = currentDayStr;

        // Regardons le PROCHAIN événement pour voir si la chaîne casse
        if (i < sortedEvents.length - 1) {
            const nextEventDate = new Date(sortedEvents[i+1].date);
            const diffHours = (currentEventDate - nextEventDate) / (1000 * 3600);

            // C'EST ICI LA CLÉ : Si l'écart dépasse 72h (limite Mort), la chaîne s'arrête.
            // Sinon (même si c'est 48h ou 50h), ça continue car c'est "sauvable" par un cœur.
            if (diffHours >= 72 * freq) {
                break; // Rupture de la chaîne
            }
        }
    }
    
    return streak;
}



function openContactModal(titre) {
    currentAppTitle = titre || "Defaut";
    
    // 1. Vérifier si la modale existe déjà
    let modal = document.getElementById('contact-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contact-modal';
        modal.className = 'modal-overlay'; 
        modal.style.display = 'none';
        
        // Structure HTML (Classes mises à jour : modal-btn confirm/cancel)
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px; width: 90%;">
                <h3 style="margin-top:0; color:white;"><i class="fas fa-paper-plane"></i> Envoyer une remarque</h3>
                
                <label style="font-size:0.8rem; color:#FFF;">Objet :</label>
                <select id="contact-type" class="modal-input" style="width:100%; margin-bottom:10px; padding:10px; background:#333; color:white; border:1px solid #555; border-radius:4px;">
                    <option value="bug">🐛 Bug / Erreur</option>
                    <option value="idee">💡 Idée / Amélioration</option>
                    <option value="remarque">📝 Remarque</option>
                    <option value="autre">📂 Autre</option>
                </select>

                <label style="font-size:0.8rem; color:#aaa;">Message :</label>
                <textarea id="contact-message" rows="5" class="modal-input" style="width:100%; margin-bottom:10px; padding:10px; background:#333; color:white; border:1px solid #555; border-radius:4px;" placeholder="Décrivez votre problème ou votre idée..."></textarea>

                <label style="font-size:0.8rem; color:#aaa;">Contact (Optionnel) :</label>
                <input type="text" id="contact-info" class="modal-input" style="width:100%; margin-bottom:20px; padding:10px; background:#333; color:white; border:1px solid #555; border-radius:4px;" placeholder="NOM/Email">

                <div style="display:flex; gap:10px;">
                    <button class="modal-btn cancel" onclick="closeContactModal()" style="flex:1; padding:10px; border-radius:4px; border:none; background:#c0392b; color:white; cursor:pointer;">Annuler</button>
                    <button class="modal-btn confirm" onclick="sendContactData()" style="flex:1; padding:10px; border-radius:4px; border:none; background:#2ecc71; color:white; cursor:pointer;">Envoyer</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 2. Réinitialiser les champs
    const typeSelect = document.getElementById('contact-type');
    const msgInput = document.getElementById('contact-message');
    const infoInput = document.getElementById('contact-info');
    
    if(typeSelect) typeSelect.value = 'bug';
    if(msgInput) msgInput.value = '';
    if(infoInput) infoInput.value = '';

    // 3. Afficher
    modal.style.display = 'flex';
}
function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.style.display = 'none';
}
async function sendContactData() {
    const type = document.getElementById('contact-type').value;
    const message = document.getElementById('contact-message').value;
    const contact = document.getElementById('contact-info').value;

    if (!message.trim()) {
        alert("Veuillez écrire un message.");
        return;
    }

    const btn = document.querySelector('#contact-modal .confirm'); 
    let originalText = "Envoyer";
    
    if(btn) {
        originalText = btn.textContent;
        btn.textContent = "Envoi...";
        btn.disabled = true;
        btn.style.opacity = "0.7";
    }

    // Récupération de l'ID appareil stocké par le tracker
    const deviceId = localStorage.getItem('app_device_id') || 'Inconnu';

    const payload = {
        appTitle: currentAppTitle,
        type: type,
        message: message,
        contact: contact,
        deviceId: deviceId, // Ajout de l'ID appareil
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    };

    try {
        const response = await fetch('/contact_save.php', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Erreur réseau");

        const result = await response.json();

        if (result.success) {
            alert("Message envoyé avec succès ! Merci.");
            closeContactModal();
        } else {
            alert("Erreur serveur : " + (result.message || "Erreur inconnue"));
        }
    } catch (e) {
        console.error("Erreur Fetch:", e);
        alert("Impossible de contacter le serveur.");
    } finally {
        if(btn) {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
        }
    }
}


function trackVisit(pageName = "Accueil") {
    // 1. Générer ou récupérer un ID Appareil unique
    let deviceId = localStorage.getItem('app_device_id');
    if (!deviceId) {
        deviceId = 'dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('app_device_id', deviceId);
    }

    // 2. Envoyer les données
    fetch('/track.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            deviceId: deviceId,
            page: pageName
        })
    }).catch(e => console.log("Tracking error", e));
}

