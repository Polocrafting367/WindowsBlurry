

function chargerIframesDepuisLocalStorage() {
    // Récupérer la liste des lieux depuis le localStorage
    const listeEnregistree = JSON.parse(localStorage.getItem('maListe')) || [];

    // Parcourir la liste des lieux et ouvrir une iframe pour chacun
    for (const lieu of listeEnregistree) {
        ouvrirIframe(lieu);
        ouvrirBranchesPourLieu(lieu);
    }

    // Ouvrir l'onglet "Créer" par défaut si la liste est vide
    if (listeEnregistree.length === 0) {
        openTab('creer');
           const chronoButton = document.getElementById('ChronoButton');
    const currentAnnimValue = chronoButton.getAttribute('annim');
    const newAnnimValue = 'true' ;
    chronoButton.setAttribute('annim', newAnnimValue);


    }
}


function ouvrirBranchesPourLieu(lieu) {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxItems = lieuxList.querySelectorAll('.place-card');

    // Parcourir la liste des lieux pour trouver celui correspondant à l'iframe
    for (const lieuItem of lieuxItems) {
        const lieuName = lieuItem.querySelector('.pastille').getAttribute('data-texte');

        if (lieu === lieuName) {
            // Ouvrir les branches jusqu'à cet élément
            let parent = lieuItem.parentElement;
            while (parent && parent !== lieuxList) {
                if (parent.tagName === 'UL') {
                    parent.style.display = 'block';
                }
                parent = parent.parentElement;
            }
            break; // Sortir de la boucle dès qu'on trouve le lieu correspondant
        }
    }
}

setTimeout(chargerIframesDepuisLocalStorage, 100);




function ajouterInformationsSupplementaires(data) {
    const parties = data.split('-').map(partie => partie.trim());
    const id = generateUniqueId();
    return { id, date: parties[0], temps: parties[1], zoneTexte1: parties[2], zoneTexte2: parties[3], zoneTexte3: parties[4], zoneTexte4: parties[5], zoneTexte5: parties[6],  zoneTexte6: parties[7]};
}

window.addEventListener('message', function(event) {
    // Vérifier si l'origine du message est autorisée, si nécessaire
    // if (event.origin !== 'http://exemple.com') return;

    const iframeData = event.data;

if (iframeData.type === 'enregistrement') {


    const enregistrementsDiv = document.getElementById('enregistrements');
    let enregistrements = JSON.parse(localStorage.getItem('enregistrements')) || [];

    // Ajouter le nouvel enregistrement à las liste
    enregistrements.push(ajouterInformationsSupplementaires(iframeData.data));


    // Mettre à jour le stockage local avec la liste mise à jour
    localStorage.setItem('enregistrements', JSON.stringify(enregistrements));

    // Mettre à jour le contenu de la div en utilisant les enregistrements

    
    const tabulValue = localStorage.getItem('TABUL');
if (tabulValue === "true") {
    // Code à exécuter si TABUL est égal à true
} else {
setTimeout(function () {
    openTab('interventions');
}, 100);


} 
}
 else if (iframeData.type === 'fermer') {
        // Recherche de l'iframe à l'intérieur de laquelle l'événement a été déclenché
const iframeId = `iframe-${iframeData.data.replace(/\s+/g, '-')}`;


const iframeASupprimer = document.getElementById(iframeId);


    const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${iframeData.data}`);
if (boutonLancerChrono) {
    boutonLancerChrono.classList.remove('non-cliquable');

    // Changer l'image du bouton
    const imageChrono = boutonLancerChrono.querySelector('img');
    if (imageChrono) {
        imageChrono.src = 'chrono.png'; // Remplacez 'nouvelle_image.png' par le chemin de votre nouvelle image
        imageChrono.alt = 'Nouvelle icône chrono'; // Remplacez 'Nouvelle icône chrono' par le nouvel texte alternatif
    }

    // Modifier le contenu de l'attribut "onclick" et mettre en surbrillance le chrono actif
boutonLancerChrono.setAttribute('onclick', `ouvrirIframe('${iframeData.data.replace(/-/g, ' ')}')`);
}

        if (iframeASupprimer) {
            // Vérifier l'existence de la pastille avant de mettre à jour
            supprimerRestolieu(iframeData.data);

            const groupeContainer = iframeASupprimer.parentNode;

            if (groupeContainer) {
 

                // Supprimer le conteneur
                groupeContainer.remove();

                nombreChronosActifs--;
                const chronoButton = document.getElementById('ChronoButton');
                chronoButton.textContent = `${nombreChronosActifs} Chrono${nombreChronosActifs !== 1 ? 's' : ''}`;

                // Supprimer l'iframe
                iframeASupprimer.remove();
            } 
        } 
    }
});


let searchActive = false; // Variable pour suivre l'état de la recherche

// Importez la bibliothèque "unorm" si elle n'est pas déjà incluse dans votre projet
// Exemple : <script src="https://unpkg.com/unorm@1.4.1"></script>

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


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



let isChronosActif = true; // Variable pour suivre l'état actuel


function Restolieu(nomLieu) {
    // Récupérer la liste actuelle depuis le localStorage
    let listeEnregistree = JSON.parse(localStorage.getItem('maListe')) || [];

    // Vérifier si le lieu existe déjà dans la liste
    if (!listeEnregistree.includes(nomLieu)) {
        // Ajouter le nouveau lieu à la liste
        listeEnregistree.push(nomLieu);

        // Enregistrer la liste mise à jour dans le localStorage
        localStorage.setItem('maListe', JSON.stringify(listeEnregistree));

    } else {

    }
}

function supprimerRestolieu(lieuASupprimer) {
    // Vérifier si iframeData.data est un tableau

    let listeEnregistree = JSON.parse(localStorage.getItem('maListe')) || [];

    // Vérifier si le lieu existe dans la liste
    let index = listeEnregistree.indexOf(lieuASupprimer);
    if (index !== -1) {
        // Supprimer le lieu de la liste
        listeEnregistree.splice(index, 1);

        // Enregistrer la liste mise à jour dans le localStorage
        localStorage.setItem('maListe', JSON.stringify(listeEnregistree));


    } else {

    }
}

function getUsernameFromUrl() {
    // Extraction de l'utilisateur à partir de l'URL et décodage des caractères encodés en URL (ex: %20 pour espace)
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    return user ? decodeURIComponent(user) : null; // Décodage des caractères encodés
}

function getInterventions() {
    const username = getUsernameFromUrl();
    
    if (!username) {
        document.getElementById('enregistrements').innerText = 'Utilisateur non trouvé dans l\'URL.';
        return;
    }

    // Création du nom de fichier CSV en ajoutant ".csv" à l'utilisateur
    const csvUrl = `user/${username}.csv`;
    
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du fichier CSV.');
            }
            return response.text();
        })
        .then(csvData => {
            displayInterventions(csvData);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des interventions:', error);
            document.getElementById('enregistrements').innerText = 'Erreur lors de la récupération des interventions.';
        });
}

function displayInterventions(csvData) {
    const container = document.getElementById('enregistrements');
    container.innerHTML = ''; // Nettoyer le conteneur

    const lines = csvData.split('\n');
    if (lines.length === 0 || lines[0].trim() === '') {
        container.innerText = 'Aucune intervention enregistrée.';
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.border = '1';

    const headerRow = document.createElement('tr');
    const headers = lines[0].split(';'); // Supposons que le séparateur soit ";"
    
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.innerText = headerText;
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    // Afficher chaque ligne du CSV
    for (let i = 1; i < lines.length; i++) {
        const row = document.createElement('tr');
        const cells = lines[i].split(';');

        if (cells.length !== headers.length) continue; // Sauter les lignes mal formées

        cells.forEach(cellText => {
            const cell = document.createElement('td');
            cell.innerText = cellText;
            row.appendChild(cell);
        });

        table.appendChild(row);
    }

    container.appendChild(table);
}