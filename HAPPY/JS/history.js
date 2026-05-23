
function toggleYearlyActivity() {
    // 1. Inversion de l'état
    showYearlyActivity = !showYearlyActivity;
    
    // 2. Sauvegarde (On force en String pour être sûr du comportement de getItem)
    setItem('showYearlyActivity', String(showYearlyActivity));
    
    // 3. Log de contrôle pour debug
    console.log("Activité annuelle :", showYearlyActivity);

    // 4. Rafraîchissement
    if (typeof renderRecords === 'function') {
        renderRecords(); 
    } else {
        // Si tu es sur la page dashboard ou calendrier au moment du clic
        renderAll(); 
    }
}

function renderRecords() {
   const recordsContainer = document.getElementById('records-list');
    const historyContainer = document.getElementById('monthly-history-list');
    const display = document.getElementById('historyMonthDisplay');
    
    recordsContainer.innerHTML = '';
    historyContainer.innerHTML = '';

    // --- 1. Remplissage du Select de filtre ---
    const filterSelect = document.getElementById('historyFilter');
    if (filterSelect) {
        let opts = `<option value="all">Tout voir</option>`;
        store.profiles.forEach(p => {
            const isSelected = currentHistoryFilter == p.id ? 'selected' : '';
            opts += `<option value="${p.id}" ${isSelected} style="color:${p.color}">${p.title}</option>`;
        });
        filterSelect.innerHTML = opts;
    }

    if (store.profiles.length === 0) {
        recordsContainer.innerHTML = '<div style="color:gray;text-align:center">Aucun profil.</div>';
        return;
    }

    // --- AJOUT DU BOUTON DE CONTRÔLE GÉNÉRAL ---
    recordsContainer.innerHTML = `
        <div onclick="toggleYearlyActivity()" style="margin-bottom:15px; text-align:right; font-size:0.7rem; color:var(--primary); cursor:pointer; font-weight:bold; text-transform:uppercase;">
            <i class="fa-solid ${showYearlyActivity ? 'fa-eye-slash' : 'fa-eye'}"></i> 
            ${showYearlyActivity ? 'Masquer' : 'Afficher'} l'activité annuelle
        </div>
    `;

    // --- 2. Section Records (Top 3) + Heatmap Annuelle ---
    const currentYear = new Date().getFullYear();

    store.profiles.forEach(p => {
        const freq = parseFloat(p.frequency || 1);
        const color = p.color || 'var(--text)';
        const events = store.events.filter(e => e.profileId === p.id && !e.isBonus).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        let recordsHtml = '';

        // --- Logique Records (Streaks/Intervals) ---
        if (p.type === 'good' || p.type === 'sport') {
            let streaks = [];
            if (events.length > 0) {
                let currentStreak = 1;
                let lastTime = new Date(events[0].date).getTime();
                let endDate = events[0].date;
                for (let i = 1; i < events.length; i++) {
                    const time = new Date(events[i].date).getTime();
                    if ((time - lastTime) / (3600 * 1000) < 72 * freq) {
                        if (new Date(lastTime).toDateString() !== new Date(time).toDateString()) currentStreak++;
                    } else {
                        streaks.push({ count: currentStreak, end: endDate });
                        currentStreak = 1;
                    }
                    lastTime = time;
                    endDate = events[i].date;
                }
                streaks.push({ count: currentStreak, end: endDate });
            }
            const top3 = streaks.sort((a, b) => b.count - a.count).slice(0, 3);
            recordsHtml = top3.length > 0 ? top3.map((s, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; padding:6px 0; ${idx < top3.length - 1 ? 'border-bottom:1px solid var(--grid-line);' : ''}">
                    <span style="width:50px; flex-shrink:0;"><i class="fa-solid fa-trophy" style="color:${idx === 0 ? 'var(--gold)' : (idx === 1 ? '#c0c0c0' : '#cd7f32')}"></i> #${idx+1}</span>
                    <span style="flex-grow:1; text-align:center; font-weight:bold;">${s.count} fois</span>
                    <span style="width:80px; flex-shrink:0; text-align:right; opacity:0.6;">${new Date(s.end).toLocaleDateString()}</span>
                </div>`).join('') : '<div style="font-size:0.8rem; opacity:0.5;">Aucune série</div>';
        } else {
            let intervals = [];
            if (events.length > 0) {
                const timestamps = events.map(e => new Date(e.date).getTime());
                let points = [...timestamps, Date.now()];
                points.sort((a, b) => a - b);
                for (let i = 0; i < points.length - 1; i++) {
                    let diffDays = (points[i+1] - points[i]) / (1000 * 3600 * 24);
                    if (diffDays > 0.01) intervals.push({ days: diffDays, end: points[i+1] });
                }
            }
            const top3Bad = intervals.sort((a, b) => b.days - a.days).slice(0, 3);
            recordsHtml = top3Bad.length > 0 ? top3Bad.map((s, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; padding:6px 0; ${idx < top3Bad.length - 1 ? 'border-bottom:1px solid var(--grid-line);' : ''}">
                    <span style="width:50px; flex-shrink:0;"><i class="fa-solid fa-crown" style="color:${idx === 0 ? 'var(--gold)' : (idx === 1 ? '#c0c0c0' : '#cd7f32')}"></i> #${idx+1}</span>
                    <span style="flex-grow:1; text-align:center; font-weight:bold;">${s.days.toFixed(1)} j</span>
                    <span style="width:80px; flex-shrink:0; text-align:right; opacity:0.6;">${(Date.now() - s.end) < 2000 ? 'En cours' : new Date(s.end).toLocaleDateString()}</span>
                </div>`).join('') : '<div style="font-size:0.8rem; opacity:0.5;">En attente...</div>';
        }

        // --- GÉNÉRATION DE LA HEATMAP MINIATURE ---
let yearlySectionHtml = "";
if (showYearlyActivity) {
    const pEventsYear = store.events.filter(e => {
        // On garde : le bon profil + la bonne année + UNIQUEMENT ce qui n'est PAS bonus
        return e.profileId === p.id && 
               e.date.startsWith(currentYear.toString()) && 
               e.isBonus !== true; 
    });

    const counts = {};
    pEventsYear.forEach(e => { 
        const d = e.date.split('T')[0]; 
        counts[d] = (counts[d] || 0) + 1; 
    });

    pEventsYear.forEach(e => { const d = e.date.split('T')[0]; counts[d] = (counts[d] || 0) + 1; });
            let heatmapDotsHtml = '';
            let curDate = new Date(currentYear, 0, 1);
            while (curDate.getFullYear() === currentYear) {
                const dStr = curDate.toISOString().split('T')[0];
                const count = counts[dStr] || 0;
                const size = count === 0 ? 3 : Math.min(8, 4 + (count * 1));
                const opacity = count === 0 ? 0.1 : 0.4 + Math.min(0.6, count * 0.2);
                heatmapDotsHtml += `
                    <div style="width:10px; height:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <div style="width:${size}px; height:${size}px; border-radius:50%; background:${count > 0 ? p.color : 'var(--text)'}; opacity:${opacity};"></div>
                    </div>`;
                curDate.setDate(curDate.getDate() + 1);
            }

            yearlySectionHtml = `
                <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--grid-line); cursor:pointer;" onclick="showYearlyProfileDetail(${p.id}, ${currentYear})">
                    <div style="color:var(--text-dim); margin-bottom:5px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.65rem;">Activité ${currentYear}</span>
                        <span style="color:var(--primary); font-weight:bold; font-size:0.7rem;">Voir annuel <i class="fa-solid fa-chevron-right" style="font-size:0.5rem;"></i></span>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:1px; background:rgba(0,0,0,0.1); padding:5px; border-radius:8px;">
                        ${heatmapDotsHtml}
                    </div>
                </div>`;
        }

        recordsContainer.innerHTML += `
            <div class="record-card" style="border-left: 4px solid ${color}; background:var(--surface); padding:12px; margin-bottom:15px; border-radius:12px;">
                <div style="cursor:pointer;" onclick="showStatsModal(${p.id})">
                    <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-weight:bold;">
                            <i class="fa-solid fa-chart-line" style="opacity:0.3; margin-right:5px;"></i>
                            <span>${p.title}</span>
                        </div>
                        <div style="color:var(--primary); font-weight:bold; font-size:0.7rem;">
                            Graphique <i class="fa-solid fa-chevron-right" style="font-size:0.5rem;"></i>
                        </div>
                    </div>
                    ${recordsHtml}
                </div>
                ${yearlySectionHtml}
            </div>`;
    });

    // --- 3. Section Historique Mensuel ---
    // (Le reste de ton code historique reste identique)
    const currentMonthLabel = historyNavDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    display.innerText = currentMonthLabel.charAt(0).toUpperCase() + currentMonthLabel.slice(1);
    
    let monthEvents = store.events.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === historyNavDate.getMonth() && d.getFullYear() === historyNavDate.getFullYear();
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (currentHistoryFilter !== 'all') {
        monthEvents = monthEvents.filter(e => e.profileId == currentHistoryFilter);
    }

    if (monthEvents.length === 0) {
        historyContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim);">Aucun enregistrement.</div>`;
    } else {
        monthEvents.forEach(e => {
            const p = store.profiles.find(prof => prof.id === e.profileId);
            if (!p) return;
            let date = new Date(e.date);
            const dayLabel = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
            const timeLabel = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            
            let specsHtml = "";
            if (e.specifics && Object.keys(e.specifics).length > 0) {
                const detailsStr = Object.entries(e.specifics).filter(([k, v]) => v && k !== 'LastClaimed').map(([k, v]) => `<span style="color:${p.color}">${k}:</span> ${v}`).join(' | ');
                if (detailsStr) specsHtml = `<div style="margin:10px 0 0 0; padding:8px; background:rgba(0,0,0,0.15); border-radius:8px; font-size:0.75rem; border-left:2px solid ${p.color}; text-align:left;"><div style="opacity:0.8; font-size:0.7rem;">${detailsStr}</div></div>`;
            }

            const editButtonHtml = !e.isBonus ? `
    <button onclick="editEvent(${e.id})" class="btn-edit-history" title="Modifier" style="background:none; border:none; color:var(--primary); cursor:pointer; font-size:0.9rem; padding:0 5px;">
        <i class="fa-solid fa-pen-to-square"></i>
    </button>` : '';

historyContainer.innerHTML += `
    <div class="history-item-card ${e.isBonus ? 'bonus-card' : ''}" style="border-left-color: ${p.color};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="font-weight:bold; font-size:0.95rem; margin-bottom:4px;">
                <span style="text-transform:capitalize;">${dayLabel}</span> 
                <span style="color:var(--text-dim); font-weight:normal; margin-left:5px;">${p.title.toUpperCase()}</span>
            </div>
            
            ${editButtonHtml}
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:1.1rem; font-weight:bold;">${timeLabel}</div>
            <div class="xp-text-display" style="font-size:0.85rem; font-weight:bold; color:${e.xp >= 0 ? 'var(--secondary)' : 'var(--error)'}">
                ${e.xp >= 0 ? '+' : ''}${Math.round(e.xp)} XP
            </div>
        </div>
        ${specsHtml}
    </div>`;
        });
    }
}
    
    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        document.getElementById('monthDisplay').innerText = navDate.toLocaleDateString('fr-FR', {month:'long', year:'numeric'});
        grid.innerHTML = '';
        const year = navDate.getFullYear(), month = navDate.getMonth();
        const daysInMonth = new Date(year, month+1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); 
        const padding = firstDay === 0 ? 6 : firstDay - 1;
        for(let i=0; i<padding; i++) grid.innerHTML += '<div class="day-cell" style="border:none; background:transparent"></div>';

for(let i=1; i<=daysInMonth; i++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;
    const daysEvents = store.events.filter(e => e.date.startsWith(dateStr));
    
    let tags = '';
    // On ne prend que les 2 premiers événements
    const visibleEvents = daysEvents.slice(0, 2);
    
    visibleEvents.forEach(e => {
        const p = store.profiles.find(prof => prof.id === e.profileId);
        if(p) {
            // Tronquer le titre à 8 caractères pour éviter de casser la cellule
            const shortTitle = p.title.length > 8 ? p.title.substring(0, 7) + '..' : p.title;
            tags += `<div class="event-tag" style="background:${p.color || '#fff'}">${shortTitle}</div>`;
        }
    });

    // Si plus de 2 événements, on ajoute l'indicateur
    if (daysEvents.length > 2) {
        tags += `<div style="font-size: 0.55rem; color: var(--text-dim); text-align: center; margin-top: 2px;">
                    <i class="fa-solid fa-ellipsis"></i> voir +
                 </div>`;
    }

    grid.innerHTML += `
        <div class="day-cell ${isToday?'today':''}" onclick="showDayDetails('${dateStr}')">
            <div style="margin-bottom:2px; color:var(--text-dim); font-size:0.7rem;">${i}</div>
            <div class="event-container">${tags}</div>
        </div>`;
}
    }

function changeMonth(offset) {
    if (calendarMode === 'year') {
        // En mode annuel, on change l'année entière
        navDate.setFullYear(navDate.getFullYear() + offset);
    } else {
        // En mode mensuel, on garde le comportement normal (changement de mois/année fluide)
        navDate.setMonth(navDate.getMonth() + offset);
    }
    renderCalendar();
}
function changeHistoryMonth(offset) {
    historyNavDate.setMonth(historyNavDate.getMonth() + offset);
    renderRecords(); // On rafraîchit tout l'onglet
}


function changeHistoryFilter(val) {
    currentHistoryFilter = val;
    renderRecords();
}
function showEventDetails(eventId) {
    const e = store.events.find(ev => ev.id === eventId);
    if(!e) return;
    let details = `<p><strong>Commentaire:</strong> ${e.comment || 'Aucun'}</p>`;
    if(e.specifics) {
        for(let [k, v] of Object.entries(e.specifics)) {
            details += `<p><strong>${k}:</strong> ${v}</p>`;
        }
    }
    showModal("Détails de l'entrée", details);
}
function showDayDetails(dateStr) {
    const dayEvents = store.events.filter(e => e.date.startsWith(dateStr));
    const formattedDate = new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    
    if (dayEvents.length === 0) {
        showModal(formattedDate, "Aucun événement enregistré ce jour.");
        return;
    }

    let html = `<div style="display:flex; flex-direction:column; gap:15px; text-align:left;">`;
    
    dayEvents.forEach(e => {
        const p = store.profiles.find(prof => prof.id === e.profileId);
        if(!p) return;

        const timeStr = new Date(e.date).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});

        // Génération du bloc specifics identique au dashboard/history
        let specsHtml = "";
        if (e.specifics && Object.keys(e.specifics).length > 0) {
            const detailsStr = Object.entries(e.specifics)
                .filter(([k, v]) => v)
                .map(([k, v]) => `<span style="color:${p.color}">${k}:</span> ${v}`)
                .join(' | ');
            
            if (detailsStr) {
                specsHtml = `
                    <div style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; font-size: 0.75rem; border-left: 2px solid ${p.color};">
                        <div style="opacity:0.8; font-size:0.7rem;">${detailsStr}</div>
                    </div>`;
            }
        }

        html += `
            <div style="border-left:4px solid ${p.color}; padding:10px; background:var(--surface); border-radius:8px; border:1px solid var(--grid-line);">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <strong style="color:${p.color}">${p.title}</strong>
                    <small style="opacity:0.6">${timeStr}</small>
                </div>
                ${e.comment ? `<p style="margin:5px 0; font-size:0.85rem; font-style:italic;">"${e.comment}"</p>` : ''}
                ${specsHtml}
            </div>
        `;
    });
    
    html += `</div>`;
    showModal(`Journée du ${formattedDate}`, html);
}
function showStatsModal(profileId) {
    const p = store.profiles.find(p => p.id === profileId);
    if (!p) return;

    // On définit le mode par défaut UNIQUEMENT à l'ouverture
    const numericFields = (p.noteFields || []).filter(f => ['number', 'counter', 'slider'].includes(f.type));
    statsViewMode = numericFields.length > 0 ? 'data' : 'activity';

    statsMonth = new Date().getMonth();
    statsYear = new Date().getFullYear();
    renderStatsModalContent(profileId);
}

function changeStatsMonth(profileId, offset) {
    statsMonth += offset;
    if (statsMonth > 11) { statsMonth = 0; statsYear++; }
    else if (statsMonth < 0) { statsMonth = 11; statsYear--; }
    renderStatsModalContent(profileId);
}
function changeStatsYear(profileId, offset) {
    statsYear += offset;
    renderStatsModalContent(profileId);
}
function changeStatsMonth(profileId, offset) {
    statsMonth += offset;
    if (statsMonth > 11) { 
        statsMonth = 0; 
        statsYear++; 
    } else if (statsMonth < 0) { 
        statsMonth = 11; 
        statsYear--; 
    }
    renderStatsModalContent(profileId);
}

function renderStatsModalContent(profileId) {
    const p = store.profiles.find(p => p.id === profileId);
    if (!p) return;

    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const numericFields = (p.noteFields || []).filter(f => ['number', 'counter', 'slider'].includes(f.type));
const hasNumericData = numericFields.length > 0;
    const LINE_COLORS = ['#4fc3f7', '#ff5252', '#ffeb3b', '#69f0ae', '#b388ff', '#ffab40', '#18ffff'];
    
    // --- MODIFICATION ICI : PRIORITÉ AU GRAPHIQUE ---
    // Si on a des champs numériques, on force 'data', sinon 'activity'
    //statsViewMode = hasNumericData ? 'data' : 'activity';

    let chartHtml = "";
    let navHtml = "";
    let displayDatasets = []; 
    let filteredEvents = [];

if (statsViewMode === 'data') {
    const daysInMonth = new Date(statsYear, statsMonth + 1, 0).getDate();
    filteredEvents = store.events.filter(e => {
        const d = new Date(e.date);
        return e.profileId === profileId && 
               d.getFullYear() === statsYear && 
               d.getMonth() === statsMonth && 
               e.isBonus !== true; // Exclusion Bonus
    });

        numericFields.forEach((field, idx) => {
            const dailyData = new Array(daysInMonth).fill(0);
            let hasData = false;
            filteredEvents.forEach(e => {
                if (e.specifics && e.specifics[field.label]) {
                    const dayIdx = new Date(e.date).getDate() - 1;
                    const val = String(e.specifics[field.label]).split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v)).reduce((a, b) => a + b, 0);
                    dailyData[dayIdx] += val;
                    hasData = true;
                }
            });
            if (hasData) {
                displayDatasets.push({ label: field.label, data: dailyData.map(v => v === 0 ? null : v), color: LINE_COLORS[idx % LINE_COLORS.length] });
            }
        });
        chartHtml = generateMultiLineChart(displayDatasets, daysInMonth);

        navHtml = `
            <button onclick="changeStatsMonth(${profileId}, -1)" class="btn-action"><i class="fa-solid fa-chevron-left"></i></button>
            <strong style="color:var(--text)">${months[statsMonth]} ${statsYear}</strong>
            <button onclick="changeStatsMonth(${profileId}, 1)" class="btn-action"><i class="fa-solid fa-chevron-right"></i></button>
        `;
    } else {
        filteredEvents = store.events.filter(e => {
            const d = new Date(e.date);
            return e.profileId === profileId && !e.isBonus && d.getFullYear() === statsYear;
        });
        const counts = new Array(12).fill(0);
        filteredEvents.forEach(e => counts[new Date(e.date).getMonth()]++);
        const maxCount = Math.max(...counts, 1);

        chartHtml = `<div style="display:flex; align-items:flex-end; height:120px; gap:4px; padding-bottom:20px; border-bottom:1px solid var(--grid-line);">`;
        counts.forEach((c, i) => {
            const h = (c / maxCount) * 100;
            chartHtml += `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%;">
                    ${c > 0 ? `<span style="font-size:0.6rem; font-weight:bold; margin-bottom:2px; color:${p.color}">${c}</span>` : ''}
                    <div style="width:100%; height:${h}%; background:${c > 0 ? p.color : 'var(--surface)'}; opacity:0.7; border-radius:2px; margin-top:auto;"></div>
                    <span style="font-size:0.55rem; margin-top:5px; opacity:0.5; color:var(--text)">${months[i][0]}</span>
                </div>`;
        });
        chartHtml += `</div>`;

        navHtml = `
            <button onclick="changeStatsYear(${profileId}, -1)" class="btn-action"><i class="fa-solid fa-chevron-left"></i></button>
            <strong style="color:var(--text)">${statsYear}</strong>
            <button onclick="changeStatsYear(${profileId}, 1)" class="btn-action"><i class="fa-solid fa-chevron-right"></i></button>
        `;
    }

    let switchBtnHtml = hasNumericData ? `
        <div onclick="toggleStatsViewMode(${profileId})" style="font-size:0.7rem; color:var(--primary); cursor:pointer; text-transform:uppercase; margin-top:8px; font-weight:bold; text-align:center;">
            <i class="fa-solid fa-repeat"></i> Voir ${statsViewMode === 'activity' ? 'les données' : 'l\'activité'}
        </div>` : "";

    let html = `
        <div style="text-align:center; margin-bottom:10px;">
            <div style="display:flex; justify-content:center; align-items:center; gap:15px;">${navHtml}</div>
            ${switchBtnHtml}
        </div>
        <div id="capture-stats-area" style="padding:15px; background:var(--surface); border-radius:16px; border:1px solid var(--grid-line); color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; gap:20px;">
                <h3 style="margin:0; color:${p.color}; font-size:1.1rem;">${p.title}</h3>
                <div style="text-align:right;">
                    <div style="font-size:0.8rem; font-weight:bold; color:inherit;">${statsViewMode === 'data' ? months[statsMonth] + ' ' + statsYear : statsYear}</div>
                    <div style="font-size:0.5rem; opacity:0.4; text-transform:uppercase; color:inherit;">HabitMaster</div>
                </div>
            </div>

            <div style="background:var(--surface2); border-radius:16px; padding:15px; margin-bottom:15px; border:1px solid var(--grid-line);">
                <div style="font-size:0.7rem; font-weight:bold; opacity:0.5; margin-bottom:10px; text-transform:uppercase; color:inherit;">
                    ${statsViewMode === 'data' ? 'Évolution des données' : 'Activité mensuelle'}
                </div>
                ${chartHtml}
                ${statsViewMode === 'data' && displayDatasets.length > 0 ? `<div style="display:flex; flex-wrap:wrap; gap:10px; border-top:1px solid var(--grid-line); padding-top:10px;">
                    ${displayDatasets.map((ds) => `<div style="font-size:0.65rem; display:flex; align-items:center; gap:4px; color:inherit;"><span style="width:8px; height:8px; border-radius:50%; background:${ds.color};"></span> ${ds.label}</div>`).join('')}
                </div>` : ''}
            </div>

            <div style="background:var(--surface2); border-radius:16px; padding:15px; border:1px solid var(--grid-line); color:inherit;">
                <div style="font-weight:bold; margin-bottom:8px; font-size:0.85rem; color:inherit;"><i class="fa-solid fa-medal" style="color:var(--gold)"></i> Records globaux</div>

                <div style="color:inherit;">${calculateTop3Html(store.events.filter(e => e.profileId === profileId && !e.isBonus), p)}</div>
            </div>

            <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                <div style="font-size:0.5rem; opacity:0.3; color:inherit;">polocrafting.fr</div>
            </div>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
            <button class="btn-buy" style="background:var(--primary); color:#000; font-weight:bold; padding:15px;" onclick="downloadStatsImage('${p.title.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-camera"></i> Partager les stats
            </button>
        </div>
    `;

    document.getElementById('mConfirmBtn').style.display = 'none';
    document.getElementById('mBody').innerHTML = html;
    document.getElementById('customModal').style.display = 'flex';
}
function generateLineChart(label, data, color) {
    const validPoints = data.map((v, i) => v !== null ? {x: i, y: v} : null).filter(p => p !== null);
    if (validPoints.length < 1) return "";

    const minVal = Math.min(...validPoints.map(p => p.y)) * 0.9;
    const maxVal = Math.max(...validPoints.map(p => p.y)) * 1.1;
    const range = maxVal - minVal || 1;

    // Dimensions SVG
    const width = 300;
    const height = 60;
    const padding = 5;

    // Conversion des points en coordonnées SVG
    const points = validPoints.map(p => {
        const x = (p.x / 11) * (width - padding * 2) + padding;
        const y = height - ((p.y - minVal) / range * (height - padding * 2) + padding);
        return `${x},${y}`;
    }).join(' ');

    return `
    <div style="background:var(--surface2); border-radius:12px; padding:12px; margin-bottom:12px; border:1px solid var(--grid-line);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
            <span style="font-size:0.75rem; font-weight:bold; opacity:0.8;">Évolution : ${label}</span>
            <span style="font-size:0.7rem; color:${color}; font-weight:bold;">Avg: ${validPoints[validPoints.length-1].y.toFixed(1)}</span>
        </div>
        <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:80px; overflow:visible;">
            <line x1="0" y1="${height}" x2="${width}" y2="${height}" stroke="var(--grid-line)" stroke-width="1" />
            <polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            ${validPoints.map(p => {
                const x = (p.x / 11) * (width - padding * 2) + padding;
                const y = height - ((p.y - minVal) / range * (height - padding * 2) + padding);
                return `<circle cx="${x}" cy="${y}" r="3" fill="var(--bg)" stroke="${color}" stroke-width="2" />`;
            }).join('')}
        </svg>
    </div>`;
}

function calculateTop3Html(events, p) {
    const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    let streaks = [];
    if (sorted.length > 0) {
        let current = 1;
        let last = new Date(sorted[0].date).getTime();
        const freq = p.frequency || 1;
        for (let i = 1; i < sorted.length; i++) {
            const time = new Date(sorted[i].date).getTime();
            if ((time - last) / (3600 * 1000) < 72 * freq) {
                if (new Date(last).toDateString() !== new Date(time).toDateString()) current++;
            } else {
                streaks.push(current);
                current = 1;
            }
            last = time;
        }
        streaks.push(current);
    }
    const top = streaks.sort((a, b) => b - a).slice(0, 3);
    if (top.length === 0) return `<div style="opacity:0.5; font-size:0.75rem;">Aucune série enregistrée.</div>`;
    
    return top.map((s, i) => `
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:5px 0; border-bottom:1px solid var(--grid-line);">
            <span>#${i+1} Record</span>
            <strong>${s} séries</strong>
        </div>
    `).join('');
}


function generateMultiLineChart(datasets, numPoints) {
    if (datasets.length === 0) return `<div style="height:100px; display:flex; align-items:center; justify-content:center; opacity:0.3; font-size:0.8rem;">Aucune donnée ce mois-ci</div>`;

    const width = 300, height = 130, paddingLeft = 10, paddingOther = 5;
    const allValues = datasets.flatMap(d => d.data).filter(v => v !== null);
    
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    
    // Marges pour que les points ne collent pas aux bords
    const displayMin = minVal * 0.9;
    const displayMax = maxVal * 1.1;
    const range = displayMax - displayMin || 1;

    let svgContent = "";
    datasets.forEach(ds => {
        let pathData = "";
        ds.data.forEach((v, i) => {
            if (v !== null) {
                const x = (i / (numPoints - 1)) * (width - paddingLeft - paddingOther) + paddingLeft;
                const y = height - ((v - displayMin) / range * (height - paddingOther * 2) + paddingOther);
                pathData += (pathData === "" ? "M " : " L ") + `${x},${y}`;
                svgContent += `<circle cx="${x}" cy="${y}" r="2.5" fill="${ds.color}" />`;
            }
        });
        svgContent = `<path d="${pathData}" fill="none" stroke="${ds.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />` + svgContent;
    });

    return `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:160px; overflow:visible;">
        <line x1="${paddingLeft}" y1="${height-paddingOther}" x2="${width-paddingOther}" y2="${height-paddingOther}" stroke="var(--grid-line)" stroke-width="1" />
        
        <line x1="${paddingLeft}" y1="${paddingOther}" x2="${paddingLeft}" y2="${height-paddingOther}" stroke="var(--grid-line)" stroke-width="1" />
        
        ${svgContent}
        
        <text x="${paddingLeft}" y="${height+12}" font-size="8" fill="var(--text-dim)" text-anchor="middle">1</text>
        <text x="${width-paddingOther}" y="${height+12}" font-size="8" fill="var(--text-dim)" text-anchor="end">${numPoints}</text>
        
        <text x="${paddingLeft-5}" y="${height-paddingOther}" font-size="8" fill="var(--text-dim)" text-anchor="end" alignment-baseline="middle">${Math.round(minVal)}</text>
        <text x="${paddingLeft-5}" y="${paddingOther}" font-size="8" fill="var(--text-dim)" text-anchor="end" alignment-baseline="middle">${Math.round(maxVal)}</text>
    </svg>`;
}

function toggleCalendarMode() {
    calendarMode = (calendarMode === 'month') ? 'year' : 'month';
    // Sauvegarde immédiate
    setItem('calendarMode', calendarMode);
    
    const btn = document.getElementById('calendarModeToggle');
    btn.innerHTML = calendarMode === 'month' ? 
        '<i class="fa-solid fa-repeat"></i> Mode Annuel' : 
        '<i class="fa-solid fa-repeat"></i> Mode Mensuel';
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    const display = document.getElementById('monthDisplay');
    const year = navDate.getFullYear();

    if (calendarMode === 'month') {
        // --- MODE MENSUEL ACTUEL ---
        display.innerText = navDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        container.innerHTML = '<div class="calendar-grid" id="calendarGrid"></div>';
        const grid = document.getElementById('calendarGrid');
        const month = navDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const padding = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < padding; i++) grid.innerHTML += '<div class="day-cell" style="border:none; background:transparent"></div>';

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const daysEvents = store.events.filter(e => e.date.startsWith(dateStr));
            let tags = daysEvents.slice(0, 2).map(e => {
                const p = store.profiles.find(prof => prof.id === e.profileId);
                return p ? `<div class="event-tag" style="background:${p.color}">${p.title.substring(0, 8)}</div>` : '';
            }).join('');
            if (daysEvents.length > 2) tags += `<div style="font-size:0.5rem; opacity:0.5; text-align:center;">...</div>`;

            grid.innerHTML += `
                <div class="day-cell ${isToday ? 'today' : ''}" onclick="showDayDetails('${dateStr}')">
                    <div style="font-size:0.7rem; opacity:0.6;">${i}</div>
                    <div class="event-container">${tags}</div>
                </div>`;
        }
    } else {
        // --- MODE ANNUEL (HEATMAP) ---
        display.innerText = `Année ${year}`;
        let html = `<div class='annnalclass' style="display:flex; flex-direction:column; gap:5px; padding-bottom:70px;">`;

store.profiles.forEach(p => {
const pEvents = store.events.filter(e => 
    e.profileId === p.id && 
    e.date.startsWith(year.toString()) && 
    e.isBonus !== true
);

    const counts = {};
    pEvents.forEach(e => {
        const d = e.date.split('T')[0];
        counts[d] = (counts[d] || 0) + 1;
    });

    html += `
    <div class="year-profile-card" onclick="showYearlyProfileDetail(${p.id}, ${year})" style="cursor:pointer;">
        <div style="font-size:0.85rem; font-weight:bold; margin-bottom:10px; color:${p.color}; display:flex; justify-content:space-between; align-items:center;">
            <span><i class="fa-solid fa-chart-line" style="margin-right:8px;"></i>${p.title}</span>
            <span style="font-size:0.7rem; opacity:0.5;">Voir détails <i class="fa-solid fa-chevron-right"></i></span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(11px, 1fr)); gap:2px;">`;
            
    let cur = new Date(year, 0, 1);
    while (cur.getFullYear() === year) {
        const dStr = cur.toISOString().split('T')[0];
        const count = counts[dStr] || 0; // Utilise maintenant le counts filtré
        const size = count === 0 ? 4 : Math.min(10, 5 + (count * 1.5));
        const opacity = count === 0 ? 0.1 : 0.4 + Math.min(0.6, count * 0.2);

        html += `<div title="${dStr} : ${count}" style="width:11px; height:11px; display:flex; align-items:center; justify-content:center;">
                    <div style="width:${size}px; height:${size}px; border-radius:50%; background:${count > 0 ? p.color : 'var(--text)'}; opacity:${opacity};"></div>
                 </div>`;
        cur.setDate(cur.getDate() + 1);
    }
    html += `</div></div>`;
});

        html += `</div>`;
        container.innerHTML = html;
    }
}

function showYearlyProfileDetail(profileId, year) {
    const p = store.profiles.find(prof => prof.id === profileId);
    if (!p) return;

    const pEvents = store.events.filter(e => e.profileId === p.id && e.date.startsWith(year.toString()));
    const counts = {};
    pEvents.forEach(e => { counts[e.date.split('T')[0]] = (counts[e.date.split('T')[0]] || 0) + 1; });

    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    let fullCalendarHtml = "";

    for (let m = 0; m < 12; m++) {
        let monthDaysHtml = "";
        const daysInMonth = new Date(year, m + 1, 0).getDate();

        for (let d = 1; d <= 31; d++) {
            if (d <= daysInMonth) {
                const dStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const count = counts[dStr] || 0;
                
                // Calcul du design strictement identique au planning
                const size = count === 0 ? 3 : Math.min(10, 4 + (count * 1.5));
                const opacity = count === 0 ? 0.15 : 0.5 + Math.min(0.5, count * 0.2);
                const color = count > 0 ? p.color : 'var(--text-dim)';
                
                // LARGEUR RÉDUITE ICI : 12px au lieu de 18px
                monthDaysHtml += `
                    <div style="width:12px; height:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <div style="width:${size}px; height:${size}px; border-radius:50%; background:${color}; opacity:${opacity};"></div>
                    </div>`;
            } else {
                monthDaysHtml += `<div style="width:12px; height:12px; flex-shrink:0;"></div>`;
            }
        }

        fullCalendarHtml += `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                <div style="width:25px; font-size:0.55rem; opacity:0.5; font-weight:bold; color:var(--text);">${monthNames[m]}</div>
                <div style="display:flex; gap:1px;">${monthDaysHtml}</div>
            </div>`;
    }

    const html = `
        <div id="capture-area" style="padding:20px; background:var(--surface); border-radius:16px; color:var(--text); border:1px solid var(--grid-line); width:fit-content; margin:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; gap:20px;">
                <h3 style="color:${p.color}; margin:0; font-size:1.1rem;">${p.title}</h3>
                <div style="text-align:right;">
                    <div style="font-size:0.8rem; font-weight:bold;">${year}</div>
                    <div style="font-size:0.5rem; opacity:0.4; text-transform:uppercase;">HabitMaster</div>
                </div>
            </div>
            
            <div class="chart-scroll-container-detail" style="overflow-x:auto; padding-bottom:10px;">
                <div style="min-width:430px;"> <div style="display:flex; margin-left:33px; margin-bottom:5px; gap:1px;">
                        ${Array.from({length:31}, (_, i) => `<div style="width:12px; text-align:center; font-size:0.45rem; opacity:0.3;">${i+1}</div>`).join('')}
                    </div>
                    ${fullCalendarHtml}
                </div>
            </div>

            <div style="margin-top:15px; padding-top:10px; border-top:1px solid var(--grid-line); display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:0.7rem;">
                    <span style="opacity:0.5;">Total annuel :</span> <b style="color:${p.color}">${pEvents.length}</b>
                </div>
                <div style="font-size:0.55rem; opacity:0.3;">polocrafting.fr</div>
            </div>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
            <button class="btn-buy" style="background:var(--primary); color:#000; height:40px; font-weight:bold;" onclick="downloadHeatmap('${p.title.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-camera"></i> Partager les stats
            </button>

        </div>
    `;

    showModal(`Records Annuels`, html);
}

async function downloadHeatmap(title) {
    const area = document.getElementById('capture-area');
    if (!area) return;

    try {
        showToast("Génération de l'image haute qualité...");

        // 1. Cloner l'élément pour ne pas perturber l'affichage utilisateur
        const clone = area.cloneNode(true);
        
        // 2. Forcer le style du clone pour la capture (largeur fixe, pas de scroll)
        Object.assign(clone.style, {
            position: "absolute",
            top: "-9999px",
            left: "0",
            width: "auto", // Largeur confortable pour la capture
            height: "auto",
            overflow: "visible"
        });
        
        // On force l'affichage du conteneur de scroll dans le clone
        const scrollContainer = clone.querySelector('.chart-scroll-container-detail');
        if(scrollContainer) {
            scrollContainer.style.overflow = "visible";
            scrollContainer.style.width = "auto";
        }

        document.body.appendChild(clone);

        // 3. Capturer le clone
        const canvas = await html2canvas(clone, {
            backgroundColor: "#121212", // Fond sombre par défaut si var echoue
            scale: 2, // Retina ready
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        // 4. Nettoyage et téléchargement
        document.body.removeChild(clone);
        
        const link = document.createElement('a');
        link.download = `HabitMaster-${title}-${new Date().getFullYear()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        showToast("Image enregistrée !");
    } catch (err) {
        console.error(err);
        showToast("Erreur de capture");
    }
}

// Fonction de partage simple (texte)
function copyStatsToClipboard(title, count, year) {
    const text = `📊 HabitMaster : J'ai complété "${title}" ${count} fois en ${year} ! 🔥`;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Stats copiées !");
    });
}

async function downloadStatsImage(title) {
    const area = document.getElementById('capture-stats-area');
    if (!area) return;

    try {
        showToast("Capture des statistiques...");
        const clone = area.cloneNode(true);
        
        // --- RÉCUPÉRATION DES COULEURS RÉELLES DU THÈME ---
        const style = window.getComputedStyle(area);
        const computedTextColor = style.color;
        const computedBgColor = style.backgroundColor;
        const computedBorderColor = style.borderColor;

        Object.assign(clone.style, {
            position: "absolute",
            top: "-9999px",
            left: "0",
            width: "400px",
            height: "auto",
            color: computedTextColor,       // Applique la vraie couleur de texte
            backgroundColor: computedBgColor, // Applique la vraie couleur de fond
            borderColor: computedBorderColor,
            borderRadius: "16px"
        });

        // Forcer la couleur calculée sur tous les descendants pour éviter le texte noir
        clone.querySelectorAll('*').forEach(el => {
            const s = window.getComputedStyle(el);
            // Si l'élément utilise une variable, on lui injecte sa valeur calculée
            if (el.style.color.includes('var') || !el.style.color) {
                el.style.color = window.getComputedStyle(document.getElementById('capture-stats-area')).color;
            }
        });

        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
            backgroundColor: computedBgColor, // Utilise la couleur exacte du thème
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        document.body.removeChild(clone);
        
        const link = document.createElement('a');
        link.download = `HabitMaster-Stats-${title}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        showToast("Image prête !");
    } catch (err) {
        console.error(err);
        showToast("Erreur de capture");
    }
}


function toggleStatsViewMode(profileId) {
    // On inverse simplement entre 'activity' et 'data'
    statsViewMode = (statsViewMode === 'activity') ? 'data' : 'activity';
    
    // On relance le rendu de la modale
    renderStatsModalContent(profileId);
}
let currentEditSetIndex = 0; // Index partagé pour la navigation sport

function editEvent(eventId) {
    const event = store.events.find(e => e.id === eventId);
    if (!event) return;
    const profile = store.profiles.find(p => p.id === event.profileId);
    if (!profile) return;

    let html = "";

    // ============================================================
    // 1. INTERFACE SPORT (NAVIGATION SÉRIES + CSV)
    // ============================================================
    if (profile.type === 'sport') {
        const nbSets = parseInt(event.specifics?.["NB Séries"] || 1);
        if (currentEditSetIndex >= nbSets) currentEditSetIndex = 0;

        const hasPrev = currentEditSetIndex > 0;
        const hasNext = currentEditSetIndex < nbSets - 1;

        html = `<div class="modal-sport-container">
            <div class="chrono-header-grid" style="background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px;">
                <div class="side-controls"><div style="opacity:0.3;"><i class="fa-solid fa-lock"></i></div></div>
                <div class="chrono-main-zone">
                    <div class="chrono-time" style="color:var(--text-dim); font-size: 2.2rem;">${event.specifics?.Durée || '--:--:--'}</div>
                    <div class="nav-row-compact">
                        <button class="btn-nav-set ${hasPrev ? 'enabled' : 'disabled'}" onclick="changeEditSet(${eventId}, -1)">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <span class="chrono-label-serie">SÉRIE ${currentEditSetIndex + 1} / ${nbSets}</span>
                        <button class="btn-nav-set ${hasNext ? 'enabled' : 'disabled'}" onclick="changeEditSet(${eventId}, 1)">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="scroll-content">`;

        let fields = profile.noteFields || (profile.noteTitles ? profile.noteTitles.map(t => ({label:t, type:'text'})) : []);
        fields.forEach((f, idx) => {
            const inputId = `edit-input-${idx}`;
            const valuesArray = (event.specifics[f.label] || "").split(',').map(s => s.trim());
            const currentVal = valuesArray[currentEditSetIndex] || (f.type === 'counter' ? "0" : "");

            html += `<div class="input-box ${f.type === 'counter' ? 'counter-wrapper' : ''}">
                <span class="input-label">${f.label}</span>`;
            
            if (f.type === 'counter' || f.type === 'number') {
                html += `
                <div class="counter-controls">
                    <button onclick="updateEditFieldCSV(${eventId}, '${f.label}', -1, '${inputId}')" class="btn-counter">-</button>
                    <input type="number" id="${inputId}" value="${currentVal}" oninput="saveEditFieldCSV(${eventId}, '${f.label}', this.value)" class="input-counter">
                    <button onclick="updateEditFieldCSV(${eventId}, '${f.label}', 1, '${inputId}')" class="btn-counter">+</button>
                </div>`;
            } else {
                html += `<input type="text" id="${inputId}" value="${currentVal}" oninput="saveEditFieldCSV(${eventId}, '${f.label}', this.value)" class="input-text-simple">`;
            }
            html += `</div>`;
        });
        html += `</div></div>`; // Fermeture scroll-content et container
    } 
    // ============================================================
    // 2. INTERFACE STANDARD (GOOD/BAD)
    // ============================================================
    else {
        html = `<div class="standard-modal-layout" style="padding:10px;">`;
        let fields = profile.noteFields || (profile.noteTitles ? profile.noteTitles.map(t => ({label:t, type:'text'})) : []);
        
        fields.forEach((f, idx) => {
            const inputId = `edit-input-${idx}`;
            const displayId = `val-edit-${idx}`;
            const savedVal = event.specifics ? event.specifics[f.label] : null;

            if (f.type === 'number' || f.type === 'counter') {
                html += `<div class="input-box counter-wrapper">
                    <span class="input-label">${f.label}</span>
                    <div class="counter-controls">
                        <button onclick="updateModalInput('${inputId}', -1)" class="btn-counter">-</button>
                        <input type="number" id="${inputId}" class="custom-note-input input-counter" data-label="${f.label}" data-type="${f.type}" value="${savedVal || 0}">
                        <button onclick="updateModalInput('${inputId}', 1)" class="btn-counter">+</button>
                    </div>
                </div>`;
            } else if (f.type === 'slider') {
                html += `<div class="input-box slider-wrapper">
                    <div class="slider-header"><label class="input-label">${f.label}</label><span id="${displayId}" class="slider-value-display">${savedVal || '—'}</span></div>
                    <input type="range" id="${inputId}" class="custom-note-input ${!savedVal?'slider-untouched':''} custom-range" data-label="${f.label}" data-type="slider" min="${f.min||1}" max="${f.max||10}" value="${savedVal||5}" oninput="onSliderInteraction(this, '${displayId}')">
                </div>`;
            } else if (f.type === 'checkbox') {
                html += `<div class="input-box"><label class="checkbox-label"><input type="checkbox" class="custom-note-input" data-label="${f.label}" data-type="checkbox" ${savedVal==="Oui"?'checked':''}> <span class="input-label">${f.label}</span></label></div>`;
            } else {
                html += `<div class="input-box"><label class="input-label-block">${f.label}</label><input type="text" class="custom-note-input input-text-simple" data-label="${f.label}" data-type="text" value="${savedVal || ''}"></div>`;
            }
        });
        html += `</div>`;
    }

    // ============================================================
    // 3. ZONE DE COMMENTAIRE (COMMUNE À TOUS)
    // ============================================================
    html += `
    <div style="padding: 0 10px 10px 10px;">
        <label class="input-label-block" style="font-size:0.7rem; opacity:0.6;">Commentaire global</label>
        <textarea id="editMainComment" class="textarea-notes" style="width:100%; min-height:80px; box-sizing:border-box;">${event.comment || ""}</textarea>
    </div>`;

    showModal(`Modifier : ${profile.title}`, html, () => {
        // Sauvegarde du commentaire commun
        event.comment = document.getElementById('editMainComment').value;

        // Sauvegarde des champs spécifiques pour Good/Bad
        if (profile.type !== 'sport') {
            document.querySelectorAll('.custom-note-input').forEach(input => {
                const label = input.dataset.label;
                const type = input.dataset.type;
                if (type === 'slider' && input.classList.contains('slider-untouched')) return;
                if (type === 'checkbox') { event.specifics[label] = input.checked ? "Oui" : null; return; }
                if (input.value && input.value.trim() !== "") event.specifics[label] = input.value;
            });
        }
        
        save();
        renderRecords();
    });
}

// --- Fonctions Support ---
function changeEditSet(eventId, dir) { currentEditSetIndex += dir; editEvent(eventId); }

function saveEditFieldCSV(eventId, label, newValue) {
    const event = store.events.find(e => e.id === eventId);
    const nbSets = parseInt(event.specifics?.["NB Séries"] || 1);
    let values = (event.specifics[label] || "").split(',').map(s => s.trim());
    while(values.length < nbSets) values.push("0");
    values[currentEditSetIndex] = newValue;
    event.specifics[label] = values.join(', ');
}

function updateEditFieldCSV(eventId, label, change, inputId) {
    const input = document.getElementById(inputId);
    let val = (parseFloat(input.value) || 0) + change;
    if (val < 0) val = 0;
    input.value = val;
    saveEditFieldCSV(eventId, label, val.toString());
}