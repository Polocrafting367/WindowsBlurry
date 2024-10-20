function ouvrirModalModifierLieu(nomLieuActuel) {
    const modal = document.getElementById('modifierLieuModal');
    modal.style.display = 'block';
changerTheme('style');
    // Charger l'arborescence des lieux ici
    const arborescenceLieux = document.getElementById('arborescenceLieux');
    arborescenceLieux.innerHTML = ''; // Vider la liste
const listeEnregistree = JSON.parse(getPrefixedItem('maListe')) || [];

parcourirArborescenceSansPreconfiguration(arborescence, arborescenceLieux, '', 0, nomLieuActuel, listeEnregistree);

}

function fermerModalModifierLieu() {
    const modal = document.getElementById('modifierLieuModal');
    modal.style.display = 'none';
}

function parcourirArborescenceSansPreconfiguration(arbre, parent, cheminParent = '', niveau = 0, nomLieuActuel, listeEnregistree = []) {

    
    for (const lieu in arbre) {
        const cheminComplet = cheminParent + (cheminParent ? ' > ' : '') + lieu;
        const nomLieuBrut = lieu.trim();
        const nomLieuPourJS = lieu.trim().replace(/'/g, "\\'");

        const lieuItem = document.createElement('li');
        const icon = (Object.keys(arbre[lieu]).length > 0) ? '▶' : ' ';
        const displayStyle = (niveau === 0) ? 'block' : 'none';

        let buttonHTML = '';
        if (nomLieuBrut === nomLieuActuel || listeEnregistree.includes(nomLieuBrut)) {
            // Si c'est le lieu actuel ou s'il est dans la liste enregistrée, désactiver le bouton
            const message = nomLieuBrut === nomLieuActuel ? 'Lieu actuel' : 'Lieu bloqué';
            buttonHTML = `<button disabled style="margin-left: 10px;">⛔</button>`;
        } else {
            // Sinon, afficher le bouton de sélection
            buttonHTML = `<button onclick="choisirLieu('${nomLieuPourJS}', '${nomLieuActuel}')" style="margin-left: 10px;">👆</button>`;
        }

        lieuItem.innerHTML = `
            <div class="place-card level-${niveau}" onclick="toggleNiveau(this, ${niveau})">
                <span class="pastille" data-texte="${nomLieuBrut}" style="display:${displayStyle}">${icon} ${nomLieuBrut}</span>
                ${buttonHTML}
            </div>`;
        parent.appendChild(lieuItem);

        if (Object.keys(arbre[lieu]).length > 0) {
            const sousLieuxList = document.createElement('ul');
            sousLieuxList.style.display = 'none';
            lieuItem.appendChild(sousLieuxList);
            parcourirArborescenceSansPreconfiguration(arbre[lieu], sousLieuxList, cheminComplet, niveau + 1, nomLieuActuel, listeEnregistree);
        }
    }
}


function searchLieu2(arbre) {
    const clearButton2 = document.getElementById('clearButton2');  // Bouton de nettoyage de la seconde barre de recherche
    const searchInput2 = document.getElementById('searchInput2');  // Champ de texte de la seconde barre de recherche
    const searchTerm2 = normalizeString(searchInput2.value.toLowerCase());

    const arborescenceLieux = document.getElementById('arborescenceLieux');  // L'élément contenant la liste des lieux dans la modal
    const lieuxItems2 = arborescenceLieux.querySelectorAll('li');  // Tous les éléments `li` de la liste des lieux

    // Afficher ou masquer le bouton de nettoyage en fonction de la valeur de la recherche
    clearButton2.style.display = searchInput2.value.trim() !== '' ? 'block' : 'none';

    // Parcourir la liste des lieux
    for (let i = 0; i < lieuxItems2.length; i++) {
        const lieuItem2 = lieuxItems2[i];
        const placeCard2 = lieuItem2.querySelector('.place-card');

        if (placeCard2) {
            const placeCardText2 = normalizeString(placeCard2.innerText.toLowerCase());
            const matchesSearch2 = placeCardText2.includes(searchTerm2);

            // Masquer ou afficher la place-card en fonction de la correspondance
            placeCard2.style.display = matchesSearch2 ? 'block' : 'none';
        }

        const lieuName2 = normalizeString(lieuItem2.innerText.toLowerCase());
        const searchTerms2 = searchTerm2.split(/\s+/);
        const matchesSearch2 = searchTerms2.every(term => lieuName2.includes(term));

        if (matchesSearch2) {
            // Afficher l'élément trouvé
            lieuItem2.style.display = 'block';
            lieuItem2.classList.add('active');

            // Ouvrir les branches jusqu'à cet élément
            let parent2 = lieuItem2.parentElement;
            while (parent2 && parent2 !== arborescenceLieux) {
                if (parent2.tagName === 'UL') {
                    parent2.style.display = 'block';
                }
                parent2 = parent2.parentElement;
            }
        } else {
            // Cacher les éléments qui ne correspondent pas
            lieuItem2.style.display = 'none';
            lieuItem2.classList.remove('active');
        }
    }

    // Refermer toutes les branches si la zone de recherche est vide
    if (searchTerm2 === '') {
        const allBranches2 = arborescenceLieux.querySelectorAll('ul');
        allBranches2.forEach(branch => {
            branch.style.display = 'none';
        });
    }
}

function clearSearchInput2() {
    const searchInput2 = document.getElementById('searchInput2');
    searchInput2.value = '';

    // Cacher le bouton après avoir effacé la zone de texte
    const clearButton2 = document.getElementById('clearButton2');

    searchLieu2();  // Relancer la recherche avec une zone de texte vide
}


function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Supprimer les accents
}


function choisirLieu(nomLieu, nomLieuActuel) {
    // Fermer la modal
    fermerModalModifierLieu();

    // Convertir le nom actuel en un format d'ID valide
    const iframeId = `iframe-${convertToIdFormat(nomLieuActuel)}`;
    // Sélectionner l'iframe cible
    const iframe = document.getElementById(iframeId);

    if (!iframe) {
        console.error("Iframe introuvable avec l'ID:", iframeId);
    } else {

        // Vérifiez si l'iframe est accessible
        if (iframe.contentWindow) {
            // Envoyer un message à l'iframe avec le nom du lieu
            iframe.contentWindow.postMessage({
                type: 'Rename',
                lieu: nomLieu
            }, '*');  // Le second paramètre '*' peut être remplacé par le domaine cible pour plus de sécurité
        } 
    }
}

function convertToIdFormat(str) {

    // Si vos IDs sont sensibles à la casse, supprimez la conversion en minuscules
    return str.trim().replace(/\s+/g, '_');

}
