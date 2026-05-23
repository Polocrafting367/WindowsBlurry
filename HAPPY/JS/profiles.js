    function createProfile() { saveProfile(); }
    function editProfile(id) {
    const p = store.profiles.find(p => p.id === id);
    if(!p) return;
    editingProfileId = id;
    document.getElementById('newProfileTitle').value = p.title;
    document.getElementById('newProfileFreq').value = p.frequency || 1;
    document.getElementById('newProfileColor').value = p.color;
selectType(p.type || 'good');    
    document.getElementById('noteInputsList').innerHTML = '';

    // CORRECTION ICI : Priorité au nouveau format (noteFields), sinon fallback sur l'ancien (noteTitles)
    if (p.noteFields && p.noteFields.length > 0) {
        p.noteFields.forEach(f => addNoteField(f));
    } else if (p.noteTitles && p.noteTitles.length > 0) {
        // Conversion à la volée pour l'ancien format
        p.noteTitles.forEach(t => addNoteField({ label: t, type: 'text' }));
    }

    document.getElementById('formTitle').innerText = "Modifier Suivi";
    document.getElementById('btnSaveProfile').innerHTML = '<i class="fa-solid fa-save"></i> Enregistrer';
    document.getElementById('btnCancelEdit').style.display = 'inline-block';
    document.querySelector('.settings-form').scrollIntoView({ behavior: 'smooth' });
}
function saveProfile() {
    const title = document.getElementById('newProfileTitle').value;
    const color = document.getElementById('newProfileColor').value;
    const freq = document.getElementById('newProfileFreq').value;
    
    // Construction du tableau des champs personnalisés
    const noteFields = [];
    document.querySelectorAll('.note-field-config').forEach(div => {
        const label = div.querySelector('.field-label').value;
        if(label) {
            noteFields.push({
                label: label,
                type: div.querySelector('.field-type').value,
                min: div.querySelector('.field-min').value, // Sauvegarde du Min
                max: div.querySelector('.field-max').value  // Sauvegarde du Max
            });
        }
    });

    if(!title) return;

    if (editingProfileId) {
        const p = store.profiles.find(p => p.id === editingProfileId);
        if(p) {
            p.title = title; p.color = color; p.frequency = freq;
            p.type = selectedType; 
            p.noteFields = noteFields; 
            delete p.noteTitles; // Nettoyage vieux format
            showToast("Profil modifié !", 'gain');
        }
        editingProfileId = null;
    } else {
        store.profiles.push({ 
            id: Date.now(), 
            title, color, type: selectedType, frequency: freq,
            createdAt: new Date().toISOString(), 
            badgeIndex: 0, strikes: 0,
            noteFields: noteFields 
        });
        showToast("Profil créé !", 'gain');
    }
    save();
    document.getElementById('noteInputsList').innerHTML = ''; 
    cancelEdit();
    renderAll();
}
    function deleteProfile(id) {
        showModal("Supprimer", "Voulez-vous vraiment supprimer ce suivi ?", () => {
            store.profiles = store.profiles.filter(p => p.id !== id);
            store.events = store.events.filter(e => e.profileId !== id);
            if(editingProfileId === id) cancelEdit();
            save(); renderSettingsList();
        });
    }

       function cancelEdit() {
        editingProfileId = null;
        document.getElementById('newProfileTitle').value = '';
        document.getElementById('newProfileFreq').value = '1'; // Reset
        document.getElementById('btnSaveProfile').innerHTML = '<i class="fa-solid fa-check"></i> Créer';
        document.getElementById('formTitle').innerText = "Nouveau Suivi";
        document.getElementById('btnCancelEdit').style.display = 'none';
        selectType('good'); // Reset
        pickAutoColor();
    }

function renderSettingsList() {
    const list = document.getElementById('profilesList');
    list.innerHTML = '';
    
    store.profiles.forEach((p, index) => {
        // Détermine si on est au début ou à la fin pour cacher les flèches inutiles
        const isFirst = index === 0;
        const isLast = index === store.profiles.length - 1;
        
        // Style des boutons flèches
        const arrowStyle = "background:var(--surface2); border:1px solid var(--grid-line); color:var(--text); width:28px; height:28px; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; margin-right:2px;";
        const hiddenArrow = "visibility:hidden;"; // Pour garder l'alignement même si caché

        list.innerHTML += `
        <div style="padding:10px; border-bottom:1px solid var(--grid-line); display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:10px; overflow:hidden;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <button onclick="moveProfile(${p.id}, -1)" style="${arrowStyle} ${isFirst ? hiddenArrow : ''}" title="Monter">
                        <i class="fa-solid fa-chevron-up" style="font-size:0.7rem"></i>
                    </button>
                    <button onclick="moveProfile(${p.id}, 1)" style="${arrowStyle} ${isLast ? hiddenArrow : ''}" title="Descendre">
                        <i class="fa-solid fa-chevron-down" style="font-size:0.7rem"></i>
                    </button>
                </div>
                
                <span style="color:${p.color}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">● ${p.title} <span style="font-size:0.8em; opacity:0.6">(${p.frequency || 1}j)</span></span>
            </div>

            <div style="display:flex; align-items:center; flex-shrink:0;">
                <button onclick="editProfile(${p.id})" style="color:var(--text); background:none; border:none; cursor:pointer; margin-right:10px; padding:5px;"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteProfile(${p.id})" style="color:var(--error); background:none; border:none; cursor:pointer; padding:5px;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`;
    });
}
function moveProfile(id, direction) {
    const index = store.profiles.findIndex(p => p.id === id);
    if (index === -1) return;

    const newIndex = index + direction;

    // Vérification des limites (ne peut pas monter si 1er, ni descendre si dernier)
    if (newIndex < 0 || newIndex >= store.profiles.length) return;

    // Échange de position dans le tableau
    [store.profiles[index], store.profiles[newIndex]] = [store.profiles[newIndex], store.profiles[index]];

    save(); // Sauvegarde le nouvel ordre
    renderSettingsList(); // Met à jour la liste des réglages
    renderDashboard(); // Met à jour l'écran principal immédiatement
}
function selectType(t) {
    selectedType = t;
    document.getElementById('opt-good').classList.toggle('selected', t === 'good');
    document.getElementById('opt-bad').classList.toggle('selected', t === 'bad');
    document.getElementById('opt-sport').classList.toggle('selected', t === 'sport');
    pickAutoColor();
}
function pickAutoColor() {
    const goodColors = ['#03dac6', '#4caf50', '#bb86fc', '#2196f3', '#009688', '#8bc34a', '#673ab7'];
    const badColors = ['#cf6679', '#ff5722', '#f44336', '#e91e63', '#607d8b', '#795548', '#ff9800'];
    const sportColors = ['#ff9100', '#ffea00', '#00e5ff', '#76ff03']; // Couleurs dynamiques pour le sport
    
    let palette = goodColors;
    if (selectedType === 'bad') palette = badColors;
    if (selectedType === 'sport') palette = sportColors;

    const usedColors = store.profiles.map(p => p.color.toLowerCase());
    let picked = palette.find(c => !usedColors.includes(c));
    if (!picked) picked = palette[Math.floor(Math.random() * palette.length)];
    document.getElementById('newProfileColor').value = picked;
}

function addNoteField(data = null) {
    const container = document.getElementById('noteInputsList');
    const id = Date.now() + Math.random(); 
    
    const label = data ? data.label : "";
    const type = data ? data.type : "text";
    const min = data && data.min ? data.min : 0; // Par défaut 0 pour compteur
    const max = data && data.max ? data.max : 10;

    const div = document.createElement('div');
    div.className = "note-field-config";
    div.style = "background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; border:1px solid var(--grid-line);";

    div.innerHTML = `
        <div style="display:flex; gap:5px; margin-bottom:5px;">
            <input type="text" class="field-label" value="${label}" placeholder="Titre (ex: Tache 3 :)" style="flex:1; background:var(--bg); color:var(--text); border:1px solid var(--grid-line); padding:5px; border-radius:4px;">
            <select class="field-type" onchange="toggleFieldOptions('${id}', this.value)" style="background:var(--bg); color:var(--text); border:1px solid var(--grid-line); border-radius:4px; width:80px;">
                <option value="text" ${type === 'text' ? 'selected' : ''}>Texte</option>
                <option value="number" ${type === 'number' ? 'selected' : ''}>Nombre</option>
                <option value="checkbox" ${type === 'checkbox' ? 'selected' : ''}>Case</option>
                <option value="slider" ${type === 'slider' ? 'selected' : ''}>Slider</option>
       </select>
            <button onclick="this.closest('.note-field-config').remove()" style="background:var(--error); color:white; border:none; border-radius:4px; width:30px; cursor:pointer;">×</button>
        </div>
        
        <div id="opts-${id}" style="display:${(type === 'slider' || type === 'counter') ? 'flex' : 'none'}; gap:10px; font-size:0.8rem; align-items:center; margin-top:5px;">
            <span>Min: <input type="number" class="field-min" value="${min}" style="width:40px; padding:2px; background:var(--bg); color:var(--text); border:1px solid var(--grid-line);"></span>
            <span>Max (ou pas): <input type="number" class="field-max" value="${max}" style="width:40px; padding:2px; background:var(--bg); color:var(--text); border:1px solid var(--grid-line);"></span>
        </div>
    `;
    container.appendChild(div);
}
function toggleFieldOptions(id, type) {
    const el = document.getElementById(`opts-${id}`);
    if(el) el.style.display = (type === 'slider') ? 'flex' : 'none';
}
