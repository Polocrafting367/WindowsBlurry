window.onload = function() {
    // Fonction pour obtenir les paramètres de l'URL
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        if (queryString) {
            const pairs = queryString.substring(1).split("&");
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i].split("=");
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
        }
        return params;
    }

    // Obtenez les paramètres de l'URL
    const params = getUrlParams();

    // Vérifiez si le paramètre 'user' est présent
    if (!params.user) {
        // Si le paramètre 'user' est absent, rediriger ou afficher un message
        alert("Nom d'utilisateur manquant dans l'URL !");
        window.location.href = '../log/index.html';
    } 
};


function searchLieu(arbre) {


    const clearButton = document.getElementById('clearButton');

    const searchInput = document.getElementById('searchInput');
    const searchTerm = normalizeString(searchInput.value.toLowerCase());

    const lieuxList = document.getElementById('lieux-list');
    const lieuxItems = lieuxList.querySelectorAll('li');

clearButton.style.display = searchInput.value.trim() !== '' ? 'block' : 'none';

    // Parcourir la liste des lieux
    for (let i = 0; i < lieuxItems.length; i++) {
        const lieuItem = lieuxItems[i];
        const placeCard = lieuItem.querySelector('.place-card');

        if (placeCard) {
            const placeCardText = normalizeString(placeCard.innerText.toLowerCase());
            const matchesSearch = placeCardText.includes(searchTerm);

            // Masquer ou afficher la place-card en fonction de la correspondance
            placeCard.style.display = matchesSearch ? 'block' : 'none';
        }

        const lieuName = normalizeString(lieuItem.innerText.toLowerCase());
        const searchTerms = searchTerm.split(/\s+/);
        const matchesSearch = searchTerms.every(term => lieuName.includes(term));

        if (matchesSearch) {
            // Afficher l'élément trouvé
            lieuItem.style.display = 'block';
            lieuItem.classList.add('active');

            // Ouvrir les branches jusqu'à cet élément
            let parent = lieuItem.parentElement;
            while (parent && parent !== lieuxList) {
                if (parent.tagName === 'UL') {
                    parent.style.display = 'block';
                }
                parent = parent.parentElement;
            }
        } else {
            // Cacher les éléments qui ne correspondent pas
            lieuItem.style.display = 'none';
            lieuItem.classList.remove('active');
        }
    }

    // Refermer toutes les branches si la zone de recherche est vide
    if (searchTerm === '') {
        const allBranches = lieuxList.querySelectorAll('ul');
        allBranches.forEach(branch => {
            branch.style.display = 'none';
        });
    }
}


function clearSearchInput() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';

    // Cacher le bouton après avoir effacé la zone de texte
    const clearButton = document.getElementById('clearButton');
    clearButton.style.display = 'none';
searchLieu()
}

function chargerLieux() {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxEnregistres = getPrefixedItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

function parcourirArborescence(arbre, parent, cheminParent = '', niveau = 0) {
    for (const lieu in arbre) {
        const cheminComplet = cheminParent + (cheminParent ? ' > ' : '') + lieu;
        const nomLieuBrut = lieu.trim();
        const nomLieuPourJS = lieu.trim().replace(/'/g, "\\'");

        const lieuItem = document.createElement('li');
        const icon = (Object.keys(arbre[lieu]).length > 0) ? '▶' : ' ';
        const displayStyle = (niveau === 0) ? 'block' : 'none';

        // Créer le bouton principal pour lancer le chrono avec une icône
        let buttonsHTML = `
            <button id="lancer-chrono-btn-${nomLieuBrut}" data-lieu="${nomLieuBrut}" onclick="ouvrirIframe('${nomLieuPourJS}')" style="width: 40px; height: 41px; position: absolute; top: -12px; right: -12px; border-radius: 8px; display: block;">
                <img src="chrono.png" alt="Icône chrono" style="width: 20px; height: 20px; position: absolute; bottom: 10px; right: 9px;">
            </button>`;

        // Initialiser la hauteur par défaut de la place-card
        let placeCardHeight = 28;  // Hauteur par défaut sans boutons supplémentaires

        // Vérifier s'il y a des préconfigurations pour ce lieu
        if (preConfigurations[nomLieuBrut]) {
            // Créer un conteneur pour les boutons avec flexbox sans retour à la ligne
            buttonsHTML += `<div style="display: flex; flex-wrap: nowrap; gap: 10px; position: absolute; top: 34px; right: -11px; white-space: nowrap; overflow-x: auto;">`;

            preConfigurations[nomLieuBrut].forEach((config, index) => {
                // Ajouter un bouton pour chaque préconfiguration avec le titre
                buttonsHTML += `
                    <button id="relancer-preconf-btn-${nomLieuBrut}-${index}" data-lieu="${nomLieuBrut}" onclick="relancerPreconfiguration('${nomLieuBrut}', ${index})" 
                        style="padding: 10px 15px; min-width: 75px; height: auto; border-radius: 8px; background-color: rgb(64, 191, 121); text-align: center;">
                        ${config.titre}
                    </button>`;
            });

            buttonsHTML += `</div>`; // Fermeture du conteneur flexbox

            // Augmenter la hauteur de la carte si des boutons sont présents
            placeCardHeight = 67; // Hauteur augmentée pour accueillir les boutons
        }

        lieuItem.innerHTML = `
            <div class="place-card level-${niveau}" onclick="toggleNiveau(this, ${niveau})" style="min-height: ${placeCardHeight}px;">
                <span class="pastille" data-texte="${nomLieuBrut}" style="display:${displayStyle}">${icon} ${nomLieuBrut}</span>
                ${buttonsHTML}
                <div class="iframe-container" id="iframe-container-${nomLieuBrut}"></div>
            </div>`;
        parent.appendChild(lieuItem);

        if (Object.keys(arbre[lieu]).length > 0) {
            const sousLieuxList = document.createElement('ul');
            sousLieuxList.style.display = 'none';
            lieuItem.appendChild(sousLieuxList);
            parcourirArborescence(arbre[lieu], sousLieuxList, cheminComplet, niveau + 1);
        }
    }
}

parcourirArborescence(arborescence, lieuxList);


}

function relancerPreconfiguration(nomLieu, index) {
    const config = preConfigurations[nomLieu][index];
    if (config) {
        // Lancer la préconfiguration avec les valeurs stockées

        ouvrirIframe(nomLieu, config.temps, config.Text1,  config.Text2,config.liste1, config.liste2,  config.arret);
    } 
}


function toggleNiveau(element, niveau) {
    const ulElement = element.nextElementSibling;
    if (ulElement) {
        ulElement.style.display = (ulElement.style.display === 'none' || ulElement.style.display === '') ? 'block' : 'none';
        const iconElement = element.querySelector('.pastille');
        const texteElement = iconElement.getAttribute('data-texte');
        iconElement.innerHTML = (ulElement.style.display === 'none') ? '▶ ' + texteElement : '▼ ' + texteElement;

        const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${texteElement}`);
        if (boutonLancerChrono && element.classList.contains('non-cliquable')) {
            boutonLancerChrono.disabled = true;
        }

        if (ulElement.style.display === 'block') {
            const sousNiveaux = ulElement.querySelectorAll('.pastille');
            sousNiveaux.forEach(sousNiveau => {
                sousNiveau.style.display = 'block';
                const ulSousNiveau = sousNiveau.nextElementSibling;
                if (ulSousNiveau) {
                    ulSousNiveau.style.display = 'none';
                }
            });
        }
    }
}

let nombreChronosActifs = 0;
