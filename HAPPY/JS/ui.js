function renderAll() {
    renderHeader();
    renderFreezeStatus();
    renderDashboard();
    renderSettingsList();
    renderRewards();
    renderRecords();
}
function renderHeader() {
    const info = getLevelInfo(store.xp);
    const percent = (info.current / info.max) * 100;
    const isGoldActive = store.inventory.goldBadge > 0 && store.inventory.showGoldBadge;
    
    // --- 1. BARRE XP ---
    const xpBarFill = document.getElementById('xpBar');
    xpBarFill.style.width = `${percent}%`;
    if (isGoldActive) {
        xpBarFill.style.background = 'linear-gradient(90deg, #ffd700, #ffecb3, #ffd700)';
        xpBarFill.style.boxShadow = '0 0 15px #ffd700';
    } else {
        xpBarFill.style.background = 'var(--primary)';
        xpBarFill.style.boxShadow = 'none';
    }
    document.getElementById('xpText').innerText = `${Math.floor(info.current)} / ${info.max} XP`;

    // --- 2. LIGNE PERMANENTE (Niv, Coins, Bouton) ---
    const invRow = document.getElementById('inventoryRow');
    const isOpened = document.getElementById('fullInventory').style.display === 'block';
    
    invRow.innerHTML = `
        <div class="coin-badge">Niv. ${info.level}</div>
        <div class="coin-badge"><i class="fa-solid fa-coins" style="color:var(--gold)"></i> ${store.coins}</div>
        <button class="btn-inventory-toggle" onclick="toggleInventory()" style="margin-left:auto">
            <i class="fa-solid ${isOpened ? 'fa-chevron-up' : 'fa-box-open'}"></i> ${isOpened ? 'Fermer' : 'Inventaire'}
        </button>
    `;

    // --- 3. INVENTAIRE DÉTAILLÉ (LISTE) ---
    const fullInv = document.getElementById('fullInventory');
    fullInv.innerHTML = '';

    // Liste des items à afficher si quantité > 0
    const itemsToShow = [
        { id: 'jokers', name: 'Jokers', icon: 'fa-shield-halved', color: 'var(--gold)' },
        { id: 'eraser', name: 'Gomme', icon: 'fa-eraser', color: '#f4a261', action: 'useEraser()' },
        { id: 'freeze', name: 'Pause', icon: 'fa-icicles', color: '#a2d2ff', action: 'useFreeze()' },
        { id: 'potionXP', name: 'Potion XP', icon: 'fa-flask', color: '#bb86fc' },
        { id: 'insurance', name: 'Assurance', icon: 'fa-user-shield', color: '#03dac6' },
        { id: 'confetti', name: 'Confettis', icon: 'fa-wand-magic-sparkles', color: '#ff00ff' }
    ];

    itemsToShow.forEach(item => {
        const qty = store.inventory[item.id] || 0;
        if (qty > 0) {
            const actionAttr = item.action ? `onclick="${item.action}" style="cursor:pointer;"` : '';
            const actionText = item.action ? '<span style="font-size:0.6rem; margin-left:10px; color:var(--primary)">UTILISER</span>' : '';
            
            fullInv.innerHTML += `
                <div class="inventory-item-row">
                    <div class="coin-badge" ${actionAttr}>
                        <i class="fa-solid ${item.icon}" style="color:${item.color}"></i>
                        <span style="margin-left:8px">${qty}</span>
                        ${actionText}
                    </div>
                    <span class="item-name-label">${item.name}</span>
                </div>
            `;
        }
    });

    // Badge Doré spécial (Toggle)
    if (store.inventory.goldBadge > 0) {
        const isActive = store.inventory.showGoldBadge;
        fullInv.innerHTML += `
            <div class="inventory-item-row">
                <div class="coin-badge" onclick="toggleGoldBadge()" style="cursor:pointer; opacity:${isActive ? 1 : 0.5}">
                    <i class="fa-solid fa-certificate" style="color:#ffd700"></i>
                    <span style="margin-left:8px">${isActive ? 'Actif' : 'Inactif'}</span>
                </div>
                <span class="item-name-label">Aura Dorée</span>
            </div>
        `;
    }

    if (fullInv.innerHTML === '') {
        fullInv.innerHTML = '<div style="font-size:0.7rem; color:var(--text-dim); text-align:center;">Inventaire vide</div>';
    }
}

function renderDashboard() {
    const container = document.getElementById('dashboard-content');

const btnGrid = document.getElementById('btn-view-grid');
    const btnList = document.getElementById('btn-view-list');
    if (btnGrid && btnList) {
        btnGrid.style.color = store.viewMode === 'grid' ? 'var(--primary)' : 'var(--text-dim)';
        btnList.style.color = store.viewMode === 'list' ? 'var(--primary)' : 'var(--text-dim)';
        btnGrid.style.borderColor = store.viewMode === 'grid' ? 'var(--primary)' : 'transparent';
        btnList.style.borderColor = store.viewMode === 'list' ? 'var(--primary)' : 'transparent';
    }

    container.innerHTML = '';

    if (store.profiles.length === 0) {
        container.innerHTML += '<div style="grid-column:1/-1; text-align:center; color:#555">Créez votre premier objectif !</div>';
        return;
    }

    // Application du style de grille ou liste sur le container
if (store.viewMode === 'list') {
        container.className = 'dashboard-list'; // Utilise le style liste du CSS
    } else {
        container.className = 'dashboard-grid'; // Utilise le style grille du CSS
    }

    store.profiles.forEach(p => {
        const isGoldActive = store.inventory.goldBadge > 0 && store.inventory.showGoldBadge;
        const goldStyle = isGoldActive ? 'text-shadow: 0 0 10px #ffd700; color: #ffd700 !important; font-weight: bold;' : '';

        const history = store.events
            .filter(e => e.profileId === p.id && !e.isBonus)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const lastEvent = history[0];
        const now = new Date();
        const freq = parseFloat(p.frequency || 1);

        // --- Logique Récompenses ---
        let claimableHtml = "";
        let hasReward = false;
        if (p.type === 'bad') {
            const refDate = lastEvent ? new Date(lastEvent.date) : new Date(p.createdAt || Date.now());
            const daysSince = Math.floor((now - refDate) / (3600 * 1000 * 24));
            const lastClaimed = parseInt(p.lastClaimed || (lastEvent?.specifics?.LastClaimed || 0));

            if (daysSince - lastClaimed >= 1) {
                hasReward = true;
                const pts = (daysSince - lastClaimed) * Math.round(10/freq);
// Remplace id="clambutt" par id="clambutt-${p.id}"
claimableHtml = `
<div style="${store.viewMode === 'list' ? 'margin:0;' : 'margin-bottom: 12px;'} text-align: center;">
    <button id="clambutt-${p.id}" class="btn-apply" onclick="claimReward(${p.id}, ${daysSince}, ${pts})" style="width:100%; padding:10px; font-size:0.85rem; font-weight:bold; background:linear-gradient(135deg, #ffd700, #ffb800); color:#2c2420; border:2px dashed #b8860b; border-radius:12px; cursor:pointer; animation: pulse 2s infinite; display:flex; align-items:center; justify-content:center; gap:8px;">
        <i class="fa-solid fa-gift"></i> ${store.viewMode === 'list' ? pts : 'Récupérer ' + pts + ' XP'}
    </button>
</div>`;
            }
        }

        // --- Logique Note / Chrono ---
        let lastNoteHtml = "";
        if (!hasReward) {
            const lastManual = history.find(e => e.comment || (e.specifics && Object.keys(e.specifics).length > 0));
            if (lastManual) {
                let specsStr = "";
                if (lastManual.specifics) {
                    specsStr = Object.entries(lastManual.specifics)
                        .filter(([k,v]) => k !== 'LastClaimed' && String(v).trim() !== "")
                        .map(([k,v]) => {
                            const values = String(v).split(',');
                            const displayVal = values.length > 1 ? values[0].trim() + "..." : values[0].trim();
                            return `<span style="color:${p.color}">${k}:</span> ${displayVal}`;
                        })
                        .join(' | ');
                }
                
                if (lastManual.comment || specsStr) {
                    lastNoteHtml = `
                        <div style="margin-top:8px; padding:8px; background:rgba(0,0,0,0.2); border-radius:6px; font-size:0.75rem; border-left:2px solid ${p.color}; text-align:left; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.2;">
                            ${lastManual.comment ? `<i>"${lastManual.comment}"</i> ` : ''}
                            ${specsStr ? `<div style="opacity:0.8; font-size:0.7rem; display:inline;">${specsStr}</div>` : ''}
                        </div>`;
                }
            }
        }

        const activeSession = store.activeSessions[p.id];
        if (activeSession) {
            lastNoteHtml = `<div style="margin-top: 8px; padding: 5px; background: rgba(0,0,0,0.3); border-radius: 8px; text-align: center; border: 1px solid var(--primary);"><div id="dash-timer-${p.id}" style="font-size:1rem; font-family:monospace; color:var(--primary); font-weight:bold;">--:--:--</div></div>`;
        }

        // --- Logique Couleur & Santé ---
        let color = p.color || '#fff';
        let healthy = true;
        let mainDisplayText = "—";
        let subDisplayText = "Nouveau";

        if (lastEvent) {
            const h = getEffectiveElapsedHours(new Date(lastEvent.date));
            if (p.type === 'sport' || p.type === 'good') {
                let currentStreak = calculateDailyStreak(history, freq);
                mainDisplayText = currentStreak;
                const limitWarn = 24 * freq;
                const limitHeart = 48 * freq;
                const limitDead = 72 * freq;

                let timeLeft = 0;
                let nextStageLabel = "";
                let cdColor = "";

                if (h < limitWarn) {
                    subDisplayText = "Séries";
                    color = p.color;
                } else if (h >= limitWarn && h < limitHeart) {
                    timeLeft = limitHeart - h;
                    nextStageLabel = "❤️";
                    color = '#ff9800';
                    cdColor = '#ff9800';
                    subDisplayText = "Retard";
                } else if (h >= limitHeart && h < limitDead) {
                    timeLeft = limitDead - h;
                    nextStageLabel = "Série";
                    color = '#ff5252';
                    cdColor = '#ff5252';
                    subDisplayText = "Cœur perdu";
                } else {
                    healthy = false; 
                    color = 'var(--error)'; 
                    subDisplayText = "Perdu";
                }

                if (healthy && timeLeft > 0 && store.viewMode === 'grid') {
                    const rh = Math.floor(timeLeft);
                    const rm = Math.floor((timeLeft - rh) * 60);
                    subDisplayText += `<br><div class="cooldown-badge" style="${cdColor ? 'color:'+cdColor+'; border-color:'+cdColor : ''}">
                        <i class="fa-solid fa-hourglass-half"></i> ${rh}h ${nextStageLabel}
                    </div>`;
                }
            } else {
                mainDisplayText = h > 24 ? (h/24).toFixed(1)+'j' : Math.floor(h)+'h';
                subDisplayText = "Sans incident";
                if (h < 24 * freq) { healthy = false; color = '#555'; }
            }
        }

        // --- Bouton Action ---
        let btnText = "Terminé", btnIcon = "fa-check", btnBg = healthy ? color : '#fff';
        if (p.type === 'sport' || p.type === 'good') {
             if (p.type === 'sport' && activeSession) { 
                 btnText = "Reprendre"; btnIcon = "fa-play"; btnBg = "var(--primary)"; 
             } else if (p.type === 'sport') { 
                 btnText = "Go"; btnIcon = "fa-dumbbell"; 
             } else {
                 btnText = "OK"; btnIcon = "fa-check";
             }
        } else if (p.type === 'bad') { 
            btnText = "Cédé"; btnIcon = "fa-triangle-exclamation"; 
        }

        const currentRank = RANKS[p.badgeIndex || 0];
        let heartsHtml = '';
        for (let i = 0; i < 3; i++) heartsHtml += (i < (3 - (p.strikes || 0))) ? '<i class="fa-solid fa-heart" style="color:var(--error)"></i>' : '<i class="fa-regular fa-heart" style="color:#555"></i>';

        // --- Rendu Conditionnel ---
        if (store.viewMode === 'list') {
            // VUE LISTE (Compacte)
            container.innerHTML += `
                <div class="profile-card" style="border-left: 4px solid ${color}; background: var(--surface2); display: flex; align-items: center; padding: 10px 15px; min-height: auto; gap: 15px; ${isGoldActive ? 'border: 1px solid rgba(255, 215, 0, 0.4);' : ''}">
                    <div style="width: 40px; text-align: center; font-size: 1.2rem; font-weight: bold; color: ${color}">${mainDisplayText}</div>
                    <div style="flex-grow: 1;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <strong style="${goldStyle} font-size: 0.9rem;">${p.title}</strong>
                            <span style="font-size: 0.7rem; color: ${currentRank.color}; opacity: 0.8;"><i class="${currentRank.icon}"></i></span>
                        </div>
                        <div style="font-size: 0.65rem; opacity: 0.6; text-transform: uppercase;">${subDisplayText}</div>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        ${claimableHtml}
                        <button onclick="triggerEvent(${p.id})" style="background:${btnBg}; color:#000; border:none; width: 40px; height: 40px; border-radius: 50%; cursor:pointer;">
                            <i class="fa-solid ${btnIcon}"></i>
                        </button>
                    </div>
                </div>`;
        } else {
            // VUE GRILLE (Originale)
            container.innerHTML += `
                <div class="profile-card" style="border-top: 4px solid ${color}; background: var(--surface2); display: flex; flex-direction: column; min-height: 330px; ${isGoldActive ? 'border: 1px solid rgba(255, 215, 0, 0.4); box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);' : ''}">
                    <div class="rank-display" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 15px;">
                        <div style="font-size:0.8rem; font-weight:bold; color:${currentRank.color}"><i class="${currentRank.icon}"></i> ${currentRank.name}</div>
                        <div class="strikes-container" style="font-size:0.8rem; display: flex; gap: 3px;">${heartsHtml}</div>
                    </div>
                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; text-align:center;">
                        <strong style="font-size:1.1rem; display:block; margin-bottom:5px; ${goldStyle}">${p.title}</strong>
                        <div class="big-number" style="color:${healthy ? 'var(--text)' : '#666'}; line-height:1;">${mainDisplayText}</div>
                        <div class="unit-label" style="font-size:0.75rem; opacity:0.6; text-transform:uppercase;">${subDisplayText}</div>
                    </div>
                    <div style="margin-top: auto; width: 100%;">
                        ${lastNoteHtml}
                        <div style="margin-top: 10px;">
                            ${claimableHtml}
                            <button class="btn-action" onclick="triggerEvent(${p.id})" style="background:${btnBg}; color:#000; width:100%; border:none; padding:12px; border-radius:10px; font-weight:900; cursor:pointer; text-transform:uppercase; display:flex; justify-content:center; align-items:center; gap:8px;">
                                <i class="fa-solid ${btnIcon}"></i> ${btnText}
                            </button>
                        </div>
                    </div>
                </div>`;
        }
    });
}


    function router(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
        document.getElementById('nav-' + pageId).classList.add('active');
        if(pageId === 'dashboard') renderDashboard();
        if(pageId === 'calendar') renderCalendar();
        if(pageId === 'rewards') renderRewards();
        if(pageId === 'records') renderRecords();
        if(pageId === 'calendar') renderCalendar();
    }
    function applyTheme(key) {
    const isFrozen = store.inventory.freezeUntil && new Date() < new Date(store.inventory.freezeUntil);
    
    // Si on est gelé, on force le thème 'frozen' peu importe la demande
    // Sauf si on est en train d'initialiser ou de sauvegarder le choix de l'utilisateur
    let themeToApply = isFrozen ? 'frozen' : key;
    
    const t = THEMES[themeToApply];
    if (!t) return;

    const r = document.documentElement.style;
    r.setProperty('--bg', t.bg);
    r.setProperty('--surface', t.surf);
    r.setProperty('--surface2', t.surf2 || t.surf); 
    r.setProperty('--primary', t.prim);
    r.setProperty('--secondary', t.sec);
    r.setProperty('--error', t.err);

    const navColor = t.nav || t.surf;
// Ajoute 'E6' à la fin pour ~90% d'opacité (légèrement transparent)
r.setProperty('--cardlate', navColor + 'AA');
r.setProperty('--card-solid', navColor); // Couleur pure sans le AA

    const textColor = getContrastColor(t.bg);
    const isDarkText = textColor === '#1a1a1a';
    
    r.setProperty('--text', textColor);
    r.setProperty('--text-dim', isDarkText ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)');
    r.setProperty('--grid-line', isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');

    // On ne sauvegarde dans le store QUE si ce n'est pas le thème forcé 'frozen'
    if (themeToApply !== 'frozen') {
        store.activeTheme = key;
        save();
        renderRewards();
    }

}

function getContrastColor(hexColor) {
    // Nettoyage au cas où le hex arrive mal formaté
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calcul de la luminance YIQ
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1a1a1a' : '#ffffff';
}
function showModal(title, text, confirmCallback) {
    document.getElementById('mTitle').innerText = title;
    const body = document.getElementById('mBody');
    body.innerHTML = text;
    body.scrollTop = 0; // Réinitialise le scroll en haut à l'ouverture

    const btn = document.getElementById('mConfirmBtn');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.style.display = confirmCallback ? 'inline-block' : 'none';
    newBtn.innerText = "Valider";

    if (confirmCallback) {
        newBtn.onclick = () => {
            confirmCallback();
            closeModal();
        };
    }

    document.getElementById('customModal').style.display = 'flex';
}

function closeModal() {
    const content = document.querySelector('.modal-content');
    content.style.transform = "translateY(100%)";
    content.style.transition = "transform 0.3s ease-in";

    setTimeout(() => {
        document.getElementById('customModal').style.display = 'none';
        content.style.transform = ""; // Reset pour la prochaine ouverture
        content.style.transition = "";
    }, 250);
}

function showToast(msg, type, duration = 3000) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    const color = type === 'gain' ? 'var(--secondary)' : 'var(--error)';
    // Si c'est un type "gold" (spécial niveau), on met du doré
    const finalColor = type === 'gold' ? '#ffd700' : color;
    const icon = type === 'gain' ? '<i class="fa-solid fa-circle-arrow-up"></i>' : (type === 'gold' ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-circle-arrow-down"></i>');
    
    el.className = 'toast'; 
    el.style.borderLeft = `4px solid ${finalColor}`;
    // Si Gold, on force un fond un peu plus sombre pour le contraste
    if(type === 'gold') el.style.background = '#2a2a2a';

    el.innerHTML = `<span style="color:${finalColor}; font-weight:bold;">${icon}</span> ${msg}`;
    container.appendChild(el);
    setTimeout(() => el.remove(), duration);
}
 function spawnConfetti() {
        for(let i=0; i<30; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random()*100 + 'vw';
            c.style.background = `hsl(${Math.random()*360}, 100%, 50%)`;
            c.style.animationDuration = (Math.random()*2+2)+'s';
            document.body.appendChild(c);
            setTimeout(()=>c.remove(), 4000);
        }
    }

function spawnGoldConfetti() {
    const goldColors = ['#FFD700', '#DAA520', '#B8860B', '#FFFACD', '#F0E68C'];
    // J'ai augmenté à 150 pour que ça dure un peu plus longtemps visuellement
    for(let i=0; i<150; i++) { 
        
        // C'est ici le secret : on attend un délai aléatoire entre 0 et 3000ms (3s) avant de créer le confetti
        setTimeout(() => {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random()*100 + 'vw';
            c.style.background = goldColors[Math.floor(Math.random() * goldColors.length)];
            c.style.animationDuration = (Math.random()*3+3)+'s';
            c.style.width = '8px'; 
            c.style.height = '8px';
            document.body.appendChild(c);
            
            // On supprime l'élément après son animation (6s de marge)
            setTimeout(()=>c.remove(), 6000);
            
        }, Math.random() * 3000); // Délai d'apparition aléatoire
    }
}
    
// Fonction utilitaire à mettre dans ton core.js ou storage.js

function showOneTimeMessage(id, text, delay = 1500) {
    const GLOBAL_KEY = 'pt_read_messages'; 

    // 1. Récupération initiale
    let readList = [];
    try {
        const raw = getItem(GLOBAL_KEY);
        // Sécurité : Si c'est déjà un objet (via PHP), on le prend, sinon on parse
        readList = typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
    } catch(e) { readList = []; }

    // Correction majeure : On force le type Array
    if (!Array.isArray(readList)) readList = [];
    if (readList.includes(id)) return;

    setTimeout(() => {
        const popup = document.createElement('div');
        popup.id = 'temp-update-popup'; 
        popup.innerHTML = `
            <span style="margin-right: 15px; font-weight: 500;">${text}</span>
            <button id="btn-popup-ok" class="batch-btn">OK</button>
        `;
        document.body.appendChild(popup);

        setTimeout(() => popup.classList.add('visible'), 10);

        const closeAndSave = () => {
            popup.classList.remove('visible'); 
            try {
                let currentList = [];
                const raw = getItem(GLOBAL_KEY);
                
                // Sécurité identique ici pour éviter l'erreur .includes
                currentList = typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
                if (!Array.isArray(currentList)) currentList = [];

                if (!currentList.includes(id)) {
                    currentList.push(id);
                    // On stocke toujours en String pour la compatibilité localStorage/PHP
                    setItem(GLOBAL_KEY, JSON.stringify(currentList));
                }
            } catch (e) { console.error(e); }

            setTimeout(() => { if (document.body.contains(popup)) popup.remove(); }, 350);
        };

        const autoCloseTimer = setTimeout(closeAndSave, 7000);
        const btn = popup.querySelector('#btn-popup-ok');
        if (btn) {
            btn.onclick = () => {
                clearTimeout(autoCloseTimer);
                closeAndSave();
            };
        }
    }, delay);
}
function updateModalInput(id, change) {
    const input = document.getElementById(id);
    if (!input) return;
    let val = parseFloat(input.value) || 0;
    val += change;
    // On évite les négatifs si c'est un compteur sport, sinon on laisse (optionnel)
    if (input.dataset.type === 'counter' && val < 0) val = 0; 
    input.value = val;
}
// Gestion du slider : passe de "indéfini" à "valeur" dès qu'on touche
function onSliderInteraction(input, displayId) {
    // On retire la classe "gris/intouché", le CSS va remettre la couleur primary
    input.classList.remove('slider-untouched');
    
    // On met à jour le texte avec la valeur
    const display = document.getElementById(displayId);
    if(display) display.innerText = input.value;
}
function updateModalCounter(id, change) {
    const input = document.getElementById(id);
    let val = parseInt(input.value) || 0;
    val += change;
    if (val < 0) val = 0; // Pas de négatif
    input.value = val;
}

function renderSportSessionUI(profileId) {
    const profile = store.profiles.find(p => p.id === profileId);
    const session = store.activeSessions[profileId];
    
    if (!session.sets) { session.sets = [session.fields || {}]; session.currentSetIndex = 0; }
    if (!session.timerState) { session.timerState = 'running'; session.totalPausedTime = 0; }

    const history = store.events
        .filter(e => e.profileId === profileId && !e.isBonus)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastEvent = history[0];

    let timerDisplay = session.timerState === 'ignored' ? "--:--:--" : "00:00:00";
    const isPaused = session.timerState === 'paused';
    const isIgnored = session.timerState === 'ignored';
    
    const hasPrev = session.currentSetIndex > 0;
    const hasNext = session.currentSetIndex < session.sets.length - 1;

    let html = `<div class="modal-sport-container">`;
    
    // --- NOUVEAU HEADER (Inspiré de ton image) ---
    html += `
    <div class="chrono-header-grid" style="background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px;">
        <div class="side-controls">
            <button onclick="toggleSessionPause(${profileId})" class="btn-chrono-ctrl ${isPaused ? 'active' : 'inactive'}" style="width:35px; height:35px; font-size:0.9rem;">
                ${isPaused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>'}
            </button>
            <button onclick="toggleSessionIgnore(${profileId})" class="btn-chrono-ctrl ${isIgnored ? 'active' : 'inactive'}" style="width:35px; height:35px; font-size:0.8rem;">
                ${isIgnored ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>'}
            </button>
        </div>

        <div class="chrono-main-zone">
            <div id="modalChronoDisplay" data-start="${session.startTime}" data-state="${session.timerState}" class="chrono-time" style="color: ${isIgnored ? '#666' : 'var(--primary)'}; font-size: 2.4rem;">
                ${timerDisplay}
            </div>
            <div class="nav-row-compact">
                <button class="btn-nav-set ${hasPrev ? 'enabled' : 'disabled'}" onclick="${hasPrev ? `changeSet(${profileId}, -1)` : ''}">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span class="chrono-label-serie" style="font-size: 0.9rem;">SÉRIE ${session.currentSetIndex + 1}</span>
                <button class="btn-nav-set ${hasNext ? 'enabled' : 'disabled'}" onclick="${hasNext ? `changeSet(${profileId}, 1)` : ''}">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
        <div></div> </div>`;

    // Bouton "Série Suivante" déplacé ici (entre header et contenu)
    html += `
    <button onclick="nextSessionSet(${profileId})" class="btn-next-set-inline">
        <i class="fa-solid fa-plus"></i> Série Suivante
    </button>`;

    // --- CONTENU SCROLLABLE ---
    html += `<div class="scroll-content" >`;
    
    let fields = profile.noteFields || (profile.noteTitles ? profile.noteTitles.map(t => ({label:t, type:'text'})) : []);
    const currentSetData = session.sets[session.currentSetIndex] || {};

    fields.forEach((f, idx) => {
        const inputId = `sess-input-${idx}`;
        let storedVal = currentSetData[f.label] ?? (['number', 'counter', 'slider'].includes(f.type) ? 0 : "");
        
        let lastValInfo = "";
        if (lastEvent?.specifics?.[f.label]) {
            const prevParts = String(lastEvent.specifics[f.label]).split(',').map(s => s.trim());
            const prevForThisSet = prevParts[session.currentSetIndex] || prevParts[prevParts.length-1]; 
            lastValInfo = ` <span class="prev-val-info">(Préc: ${prevForThisSet})</span>`;
        }

        if (f.type === 'counter' || f.type === 'number') {
            html += `
            <div class="input-box counter-wrapper">
                <span class="input-label">${f.label}${lastValInfo}</span>
                <div class="counter-controls">
                    <button onclick="updateSessionField(${profileId}, '${f.label}', -1, '${inputId}')" class="btn-counter">-</button>
                    <input type="number" id="${inputId}" value="${storedVal}" oninput="saveSessionInput(${profileId}, '${f.label}', this.value)" class="input-counter">
                    <button onclick="updateSessionField(${profileId}, '${f.label}', 1, '${inputId}')" class="btn-counter">+</button>
                </div>
            </div>`;
        } else {
            html += `
            <div class="input-box">
                <label class="input-label-block">${f.label}${lastValInfo}</label>
                <input type="text" value="${storedVal}" oninput="saveSessionInput(${profileId}, '${f.label}', this.value)" class="input-text-simple">
            </div>`;
        }
    });

    html += `<textarea id="sess-comment" oninput="store.activeSessions[${profileId}].comment = this.value; saveSessions();" placeholder="Notes..." class="textarea-notes">${session.comment || ''}</textarea>`;
    html += `</div>`; 

    // --- FOOTER FIXE ---
    html += `
    <div class="modal-footer" >
        <div class="footer-btn-group">
            <button onclick="cancelSession(${profileId})" class="btn-cancel"><i class="fa-solid fa-trash"></i> Annuler</button>
            <button onclick="finishSession(${profileId})" class="btn-finish"><i class="fa-solid fa-flag-checkered"></i> Terminer</button>
        </div>
    </div></div>`;

    showModal(profile.title, html, null); 
    const defaultBtn = document.getElementById('mConfirmBtn');
    if(defaultBtn) defaultBtn.style.display = 'none';
}
function updateDashboardTimers() {
    const now = Date.now();
    
    // Fonction utilitaire de formatage
    const formatTime = (ms) => {
        if (ms < 0) ms = 0;
        const diff = Math.floor(ms / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // 1. Dashboard principal & Modale
    for (const [profileId, session] of Object.entries(store.activeSessions)) {
        if (!session.startTime) continue;

        let displayParams = { text: "--:--:--", color: "#666", style: "italic" };

        if (session.timerState === 'ignored') {
            displayParams.text = "--:--:--";
        } else {
            // Calcul du temps écoulé effectif
            // Temps total brut - Temps total déjà pausé - (Temps pause actuelle si en cours)
            let elapsed = now - session.startTime - (session.totalPausedTime || 0);
            
            if (session.timerState === 'paused' && session.pauseStartTime) {
                // Si en pause, on soustrait aussi la durée de la pause en cours
                elapsed -= (now - session.pauseStartTime);
            }

            displayParams.text = formatTime(elapsed);
            displayParams.color = session.timerState === 'paused' ? "var(--text-dim)" : "var(--primary)";
            displayParams.style = "normal";
        }

        // Mise à jour Dashboard
        const dashEl = document.getElementById(`dash-timer-${profileId}`);
        if (dashEl) {
            dashEl.innerText = displayParams.text;
            dashEl.style.color = displayParams.color;
            dashEl.style.fontStyle = displayParams.style;
        }

        // Mise à jour Modale (si ouverte sur ce profil)
        const modalEl = document.getElementById('modalChronoDisplay');
        // On vérifie que la modale correspond bien à ce profil (astuce via le data-start qui sert d'ID unique de session)
        if (modalEl && modalEl.dataset.start == session.startTime) {
            modalEl.innerText = displayParams.text;
            modalEl.style.color = displayParams.color;
        }
    }
}
function toggleSessionPause(pId) {
    const session = store.activeSessions[pId];
    if (session) {
        // Si on est en mode "Ignoré", la pause ne sert à rien, on force le retour en pause normale
        if (session.timerState === 'ignored') {
            session.timerState = 'paused'; 
            session.pauseStartTime = Date.now();
        } 
        else if (session.timerState === 'running') {
            // ON MET EN PAUSE
            session.timerState = 'paused';
            session.pauseStartTime = Date.now();
        } 
        else if (session.timerState === 'paused') {
            // ON REPREND
            const now = Date.now();
            const pauseDuration = now - (session.pauseStartTime || now);
            session.totalPausedTime = (session.totalPausedTime || 0) + pauseDuration;
            session.pauseStartTime = null;
            session.timerState = 'running';
        }
        
        saveSessions();
        renderSportSessionUI(pId);
        updateDashboardTimers();
    }
}
function toggleSessionIgnore(pId) {
    const session = store.activeSessions[pId];
    if (session) {
        if (session.timerState === 'ignored') {
            // On réactive (on le met en pause pour laisser l'utilisateur reprendre quand il veut)
            session.timerState = 'paused';
            session.pauseStartTime = Date.now(); // On considère qu'on entre en pause maintenant
        } else {
            // On ignore
            session.timerState = 'ignored';
            // On ne touche pas aux temps, comme ça si on désignore, on peut recalculer
        }
        saveSessions();
        renderSportSessionUI(pId);
        updateDashboardTimers();
    }
}

function updateSessionField(pId, label, change, inputId) {
    const session = store.activeSessions[pId];
    if(!session) return;
    
    // On cible le set actuel
    if (!session.sets[session.currentSetIndex]) session.sets[session.currentSetIndex] = {};
    const currentSet = session.sets[session.currentSetIndex];

    // Initialise si vide
    if(currentSet[label] === undefined) currentSet[label] = 0;
    
    let val = parseFloat(currentSet[label]) || 0;
    val += change;
    if(val < 0) val = 0;
    
    currentSet[label] = val;
    const el = document.getElementById(inputId);
    if(el) el.value = val;
    saveSessions();
}

function saveSessionInput(pId, label, value) {
    const session = store.activeSessions[pId];
    if(session) {
        if (!session.sets[session.currentSetIndex]) session.sets[session.currentSetIndex] = {};
        session.sets[session.currentSetIndex][label] = value;
        saveSessions();
    }
}

function nextSessionSet(pId) {
    const session = store.activeSessions[pId];
    if (session) {
        // Ajoute un   set vide
        session.sets.push({});
        session.currentSetIndex = session.sets.length - 1;
        saveSessions();
        
        // Rafraîchit l'UI (les champs reviendront à leur valeur par défaut car le nouveau set est vide)
        renderSportSessionUI(pId);
        
        // Petit feedback visuel
        showToast(`Série ${session.currentSetIndex + 1} commencée`, 'gain');
    }
}

function changeSet(pId, dir) {
    const session = store.activeSessions[pId];
    if (session) {
        const newIndex = session.currentSetIndex + dir;
        if (newIndex >= 0 && newIndex < session.sets.length) {
            session.currentSetIndex = newIndex;
            saveSessions();
            renderSportSessionUI(pId);
        }
    }
}

function finishSession(pId) {
    const session = store.activeSessions[pId];
    if(!session) return;

    let durationStr = "Ignoré";

    if (session.timerState !== 'ignored') {
        const now = Date.now();
        let elapsed = now - session.startTime - (session.totalPausedTime || 0);
        
        // Si on finit alors qu'on était en pause, on retire la pause en cours
        if (session.timerState === 'paused' && session.pauseStartTime) {
            elapsed -= (now - session.pauseStartTime);
        }
        
        const diff = Math.floor(Math.max(0, elapsed) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        durationStr = `${h}:${m}:${s}`;
    }

    // Agrégation des séries
    const specifics = {};
    const keys = new Set();
    session.sets.forEach(set => Object.keys(set).forEach(k => keys.add(k)));

    keys.forEach(key => {
        const values = session.sets.map(set => set[key] || 0).join(', ');
        specifics[key] = values;
    });

    specifics['NB Séries'] = session.sets.length;
    specifics['Durée'] = durationStr;
    
    processTrigger(pId, session.comment, specifics);
    delete store.activeSessions[pId];
    saveSessions();
    closeModal();
}
// Annuler la séance (supprime tout)
function cancelSession(pId) {
    showModal("Abandonner la séance ?", "Les données en cours seront définitivement perdues.", () => {
        delete store.activeSessions[pId];
        saveSessions();
        // closeModal() est appelé automatiquement par showModal après le callback
        renderDashboard();
    });
}

function toggleStopwatch() {
    const btn = document.getElementById('chronoBtn');
    const display = document.getElementById('chronoDisplay');
    
    if (stopwatchInterval) {
        // Stop
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        btn.innerHTML = '<i class="fa-solid fa-play"></i> Reprendre';
        btn.style.background = 'var(--primary)';
    } else {
        // Start
        btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        btn.style.background = 'var(--secondary)';
        stopwatchInterval = setInterval(() => {
            stopwatchSeconds++;
            const h = Math.floor(stopwatchSeconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((stopwatchSeconds % 3600) / 60).toString().padStart(2, '0');
            const s = (stopwatchSeconds % 60).toString().padStart(2, '0');
            display.innerText = `${h}:${m}:${s}`;
        }, 1000);
    }
}
function toggleView(mode) {
    store.viewMode = mode;
    setItem('habit_view_mode', mode);

    // On appelle la fonction de sauvegarde standard
    if (typeof save === 'function') save();
    else if (typeof saveStorage === 'function') saveStorage();

    renderDashboard();
}

function toggleProMode(isActive) {
    const urlParams = new URLSearchParams(window.location.search);
    // Si l'URL force le mode PRO, on ne fait rien
    if (urlParams.get('pro') === '1') return; 

    // 1. Mise à jour de l'état global
    store.isProMode = isActive;

    // 2. Sauvegarde (On force en String pour garantir la compatibilité Cloud/Local)
    setItem('habit_pro_mode', String(isActive));

    // 3. Application visuelle (CSS, masquage d'éléments, etc.)
    if (typeof applyProMode === 'function') {
        applyProMode();
    }

    // 4. On déclenche la sauvegarde du store complet
    if (typeof save === 'function') save();
    
    // Log de contrôle
    console.log("Pro Mode basculé :", store.isProMode);
}

function applyProMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const forcePro = urlParams.get('pro') === '1';
    const toggle = document.getElementById('proModeToggle');

    if (forcePro) {
        // PRIORITÉ URL : Mode activé et verrouillé
        store.isProMode = true;
        if (toggle) {
            toggle.checked = true;
            toggle.disabled = true; // Empêche de cliquer
            toggle.parentElement.style.opacity = "0.5"; // Feedback visuel (grisé)
            toggle.parentElement.style.pointerEvents = "none";
        }
    } else {
        // SINON : On utilise la valeur du store (chargée depuis le localStorage)
        if (toggle) {
            toggle.checked = !!store.isProMode;
            toggle.disabled = false;
            toggle.parentElement.style.opacity = "1";
            toggle.parentElement.style.pointerEvents = "auto";
        }
    }

    // Application de la classe CSS
if (store.isProMode) {
        document.body.classList.add('light-theme');
        console.log("☀️ Mode Pro détecté : Thème clair appliqué.");
                document.body.classList.add('pro-mode');

    } else {
        document.body.classList.remove('light-theme');
        console.log("🌑 Mode Standard : Thème sombre par défaut.");
                document.body.classList.remove('pro-mode');

    }
}
