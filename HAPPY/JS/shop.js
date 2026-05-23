
function renderRewards() {
    // 1. Rendu des Rangs
    const legendGrid = document.getElementById('badgeLegendGrid');
    legendGrid.innerHTML = RANKS.map(r => `
        <div class="reward-card rank-info">
            <span class="item-icon"><i class="${r.icon}" style="color:${r.color}"></i></span>
            <strong>${r.name}</strong>
            <div class="item-cost" style="margin-top:auto; color:var(--text-dim)">${r.threshold}j</div>
        </div>
    `).join('');

    // 2. Rendu de la Boutique d'objets (NOUVEAU)
    // Dans renderRewards, remplacez la section correspondante par :
// 2. Rendu de la Boutique d'objets
const shopGrid = document.querySelector('.shop-grid');
if (shopGrid) {
    shopGrid.innerHTML = Object.entries(SHOP_ITEMS).map(([id, item]) => {
        const count = store.inventory[id] || 0;
        const isOwned = count > 0;

        // --- GESTION DU STOCK ET DES BOUTONS ---
        let actionBtn = '';
        let stockDisplay = '';

        if (isOwned) {
            // Affichage du stock (ton souhait)
            stockDisplay = `<div style="font-size:0.7rem; color:var(--secondary); margin-top:5px; font-weight:bold;">Stock: ${count} ${item.single ? '(Auto)' : ''}</div>`;

            // Boutons d'actions spécifiques
            if (id === 'eraser') {
                actionBtn = `<button class="btn-apply" onclick="useEraser()" style="margin-top:5px; background:#f4a261; color:white">Utiliser</button>`;
            } else if (id === 'freeze') {
                actionBtn = `<button class="btn-apply" onclick="useFreeze()" style="margin-top:5px; background:#a2d2ff; color:#003366">Utiliser</button>`;
            } else if (id === 'goldBadge') {
                const isActive = store.inventory.showGoldBadge;
                actionBtn = `<button class="btn-apply" onclick="toggleGoldBadge()" style="margin-top:5px; border-color:#ffd700">${isActive ? 'Désactiver' : 'Activer'}</button>`;
            }
        }

        return `
        <div class="reward-card unlocked" style="border-color:${item.color};">
            <span class="item-icon"><i class="fa-solid ${item.icon}" style="color:var(--text)"></i></span>
            <strong>${item.name}</strong>
            <p style="font-size:0.75rem; color:var(--text-dim); margin-bottom:5px;">${item.desc}</p>
            <div style="font-size:0.65rem; font-weight:bold; color:${item.single ? '#ffb74d' : '#81c784'}; margin-bottom:10px;">
                <i class="fa-solid ${item.single ? 'fa-bolt' : 'fa-infinity'}"></i> 
                ${item.single ? 'USAGE UNIQUE' : 'PERMANENT'}
            </div>
            <div class="item-cost"><i class="fa-solid fa-coins"></i> ${item.cost}</div>
            <button class="btn-buy" onclick="buyItem('${id}', ${item.cost})">Acheter</button>
            ${stockDisplay}
            ${actionBtn}
        </div>
    `;
    }).join('');
}

    // 3. Rendu des Thèmes
    const tGrid = document.getElementById('themeGrid');
    tGrid.innerHTML = '';
    const userLevelInfo = getLevelInfo(store.xp);
    const owned = store.inventory.ownedThemes || ['default'];

    for (const [key, t] of Object.entries(THEMES)) {
        const isUnlockedByLevel = userLevelInfo.level >= t.lvl;
        const isOwned = owned.includes(key);
        const isActive = store.activeTheme === key;

        let cardClass = 'locked',
            content = '';

        if (isActive) {
            cardClass = 'active-theme owned';
            content = `<div style="color:var(--primary); font-size:0.8rem; margin-top:auto;"><i class="fa-solid fa-check"></i> Actif</div>`;
        } else if (isOwned) {
            cardClass = 'owned';
            content = `<button class="btn-apply" onclick="applyTheme('${key}')">Appliquer</button>`;
        } else if (isUnlockedByLevel) {
            cardClass = 'unlocked';
            content = `
                <div class="item-cost"><i class="fa-solid fa-coins"></i> ${t.cost}</div>
                <button class="btn-buy" onclick="buyItem('theme', ${t.cost}, '${key}')">Acheter</button>
            `;
        } else {
            content = `<div class="item-cost" style="color:var(--text-dim)">Niv. ${t.lvl}</div>`;
        }

        tGrid.innerHTML += `
            <div class="reward-card ${cardClass}">
                <div style="width:100%; height:30px; background:${t.bg}; border:1px solid ${t.prim}; margin-bottom:10px; border-radius:4px;"></div>
                <strong>${t.name}</strong>
                ${content}
            </div>
        `;
    }
}

function buyItem(type, cost, key = null) {

    if (type !== 'theme' && SHOP_ITEMS[type] && !SHOP_ITEMS[type].single && store.inventory[type] > 0) {
        showToast("Vous possédez déjà cet objet permanent !", 'loss');
        return;
    }

    if (store.coins >= cost) {
        const processBuy = () => {
            store.coins -= cost;
            if (type === 'theme' && key) {
                store.inventory.ownedThemes.push(key);
                showToast(`Thème ${THEMES[key].name} débloqué !`, 'gain');
            } else {
                // Gestion dynamique des consommables
                store.inventory[type] = (store.inventory[type] || 0) + 1;
                showToast(`${SHOP_ITEMS[type].name} acheté !`, 'gain');
            }
            save();
            renderHeader();
            renderRewards();
        };

        let label = type === 'theme' ? `le thème ${THEMES[key].name}` : `l'objet ${SHOP_ITEMS[type].name}`;
        showModal("Confirmer l'achat", `Acheter ${label} pour ${cost} Coins ?`, processBuy);
    } else {
        showToast("Pas assez de Coins !", 'loss');
    }
}


function claimReward(profileId, days, pts) {
    const profile = store.profiles.find(p => p.id === profileId);
    if (!profile) return;

    const history = store.events
        .filter(e => e.profileId === profileId && !e.isBonus)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastEvent = history[0];

    // Mise à jour de l'index de réclamation
    // On le met sur le profil ET sur l'event pour une double sécurité
    profile.lastClaimed = days; 
    if (lastEvent) {
        if (!lastEvent.specifics) lastEvent.specifics = {};
        lastEvent.specifics[`LastClaimed`] = days;
    }

    // Création de l'événement de bonus
    const rewardDate = new Date();
    rewardDate.setMinutes(rewardDate.getMinutes()); 

    store.events.push({
        id: Date.now() + Math.floor(Math.random() * 1000), // ID unique garanti
        profileId: profileId,
        date: rewardDate.toISOString(), 
        xp: pts,
        isBonus: true, 
        specifics: { "Gagne": `${pts}xp (Bonus)` }
    });

    // Mise à jour du store
    store.xp += pts;
    store.coins += Math.round(pts * 0.5);
    
    // Sauvegarde et rafraîchissement complet
    save();
    
    // Si mode pro, on adapte le message (comme vu précédemment)
    const toastMsg = store.isProMode ? "Récompense récupérée" : `+${pts} XP récoltés !`;
    showToast(toastMsg, 'gain');

    // On force le rendu pour faire disparaître le bouton immédiatement
    renderAll();
}
function toggleInventory() {
    const fullInv = document.getElementById('fullInventory');
    const isHidden = fullInv.style.display === 'none';
    fullInv.style.display = isHidden ? 'block' : 'none';
    renderHeader(); // Pour mettre à jour l'icône du bouton
}
function toggleGoldBadge() {
    if (store.inventory.goldBadge > 0) {
        store.inventory.showGoldBadge = !store.inventory.showGoldBadge;
        save();
        renderAll();
        showToast(store.inventory.showGoldBadge ? "Aura dorée activée" : "Aura dorée masquée", 'gain');
    }
}
function useEraser() {
    if (store.inventory.eraser <= 0) return;

    const eligibleProfiles = store.profiles.filter(p => 
        store.events.some(e => e.profileId === p.id)
    );

    if (eligibleProfiles.length === 0) {
        showToast("Aucun enregistrement à supprimer.", "loss");
        return;
    }

    selectedProfileToErase = null; // Reset de la sélection

    let html = `<p style="margin-bottom:15px; font-size:0.9rem;">Sélectionnez le profil à corriger :</p>`;
    html += `<div id="eraserProfileList" style="display:flex; flex-direction:column; gap:8px;">`;
    
    eligibleProfiles.forEach(p => {
        html += `
            <button class="btn-action eraser-select-btn" id="eraser-btn-${p.id}" 
                    style="background:var(--surface); border:1px solid var(--grid-line); color:var(--text); text-align:left; justify-content:flex-start;" 
                    onclick="selectProfileForEraser('${p.id}')">
                ● ${p.title}
            </button>`;
    });
    html += `</div>`;

    // On affiche la modale avec le bouton "Confirmer" (callback)
    showModal("Utiliser Gomme", html, () => {
        if (!selectedProfileToErase) {
            showToast("Veuillez sélectionner un profil", "loss");
            return;
        }
        executeEraser();
    });
}

// 1. Étape de sélection (visuelle)
function selectProfileForEraser(profileId) {
    selectedProfileToErase = profileId;
    
    // Reset du style de tous les boutons de la liste
    document.querySelectorAll('.eraser-select-btn').forEach(btn => {
        btn.style.borderColor = 'var(--grid-line)';
        btn.style.background = 'var(--surface)';
    });

    // Mise en avant du bouton sélectionné
    const activeBtn = document.getElementById(`eraser-btn-${profileId}`);
    const profile = store.profiles.find(p => p.id == profileId);
    activeBtn.style.borderColor = profile.color;
    activeBtn.style.background = `${profile.color}33`;
}

// 2. Étape de validation définitive
function executeEraser() {
    const targetId = Number(selectedProfileToErase);
    const lastIndex = store.events.findLastIndex(e => e.profileId === targetId);

    if (lastIndex !== -1) {
        const event = store.events[lastIndex];
        const xpToSubtract = event.xp || 0;

        // Retrait XP et Coins
        store.xp = Math.max(0, store.xp - xpToSubtract);
        if (xpToSubtract > 0) store.coins = Math.max(0, store.coins - xpToSubtract);
        
        // Suppression et consommation
        store.events.splice(lastIndex, 1);
        store.inventory.eraser--;

        save();
        renderAll();
        showToast("Enregistrement annulé avec succès !", "gain");
    }
}
function useFreeze() {
    if (store.inventory.freeze > 0) {
        showModal("Activer la Pause", "Tes séries seront gelées pendant 48h. Prêt ?", () => {
            const realEnd = new Date();
            realEnd.setHours(realEnd.getHours() + 72); // Stockage réel de 72h
            
            store.inventory.freezeUntil = realEnd.toISOString();
            store.inventory.freeze--;
            
            save();
            renderAll();
            showToast("Mode Pause activé (48h)", "gain");
        });
    }
}
function getEffectiveElapsedHours(fromDate) {
    const now = new Date();
    const start = new Date(fromDate);
    const freezeUntil = store.inventory.freezeUntil ? new Date(store.inventory.freezeUntil) : null;

    // Protection réelle : si on est dans la fenêtre des 72h, le temps ne s'écoule pas
    if (freezeUntil && now < freezeUntil) {
        return 0; 
    }
    
    // Si la pause est expirée (après 72h), on nettoie proprement
    if (freezeUntil && now >= freezeUntil) {
        store.inventory.freezeUntil = null;
        save();
    }
    
    return (now - start) / (3600 * 1000);
}
function renderFreezeStatus() {
    const statusContainer = document.getElementById('freeze-status');
    if (!statusContainer) return;

    const now = new Date();
    const freezeUntil = store.inventory.freezeUntil ? new Date(store.inventory.freezeUntil) : null;

    if (freezeUntil && now < freezeUntil) {
        // --- LOGIQUE D'AFFICHAGE (Cible 48h pour l'utilisateur) ---
        // On calcule la date d'activation (Fin réelle - 72h)
        const activationDate = new Date(freezeUntil.getTime() - (72 * 3600 * 1000));
        const visibleEnd = new Date(activationDate.getTime() + (48 * 3600 * 1000));

        if (now < visibleEnd) {
            const diffMs = visibleEnd - now;
            const hours = Math.floor(diffMs / (3600 * 1000));
            const minutes = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
            const minFormatted = minutes < 10 ? '0' + minutes : minutes;

statusContainer.innerHTML = `
    <div class="status-pause">
        <i class="fa-solid fa-icicles"></i> PAUSE ACTIF, Fin : <span class="time-highlight">${hours}h${minFormatted}</span>
    </div>
`;
        } else {
            // Après 48h, on cache le bandeau mais le mode reste actif en secret (jusqu'à 72h)
            statusContainer.innerHTML = '';
        }

        // --- FORCE L'APPLICATION DU THÈME GIVRE ---
        // On vérifie si le thème actuel est déjà le thème frozen (via la couleur primary)
        if (document.documentElement.style.getPropertyValue('--primary').trim() !== THEMES.frozen.prim) {
            applyTheme(store.activeTheme);
        }

    } else {
        // --- LOGIQUE D'EXPIRATION (Après 72h) ---
        statusContainer.innerHTML = '';
        
        if (freezeUntil && now >= freezeUntil) {
            store.inventory.freezeUntil = null;
            save();
            // On rétablit le thème choisi par l'utilisateur
            applyTheme(store.activeTheme);
            showToast("Mode Pause terminé. Le temps reprend son cours.", "gain");
        }
    }
}

