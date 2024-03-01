

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

    function loadPageInIframe(url) {
        var iframeContainer = document.getElementById("iframeContainer");
        iframeContainer.innerHTML = '<iframe id="TUTORIEL" src="' + url + '"></iframe>';
    }
    // Fonction pour gérer le changement d'état du bouton de cookie
    function handleCookieChange() {
        var cookieCheckbox = document.getElementById("Cookies");
        var accessButton = document.getElementById("accessButton");
        var overlay = document.getElementById("overlay");
        var modal = document.getElementById("tutorialModal");

        // Enregistre l'état de la case à cocher dans le localStorage
        localStorage.setItem("cookieAccepted", cookieCheckbox.checked);

        // Active/désactive le bouton en fonction de l'état de la case à cocher
        if (cookieCheckbox.checked) {
            accessButton.classList.remove('disabled-button');
            accessButton.classList.add('green-button');
        } else {
            accessButton.classList.add('disabled-button');
            accessButton.classList.remove('green-button');
        }
    }

    // Fonction pour ouvrir le site web
    function openWebsite() {
        var overlay = document.getElementById("overlay");
        var modal = document.getElementById("tutorialModal");

        // Ferme la modal et cache le fond gris semi-transparent
        overlay.style.display = "none";
        modal.style.display = "none";

        // Insérez ici le code pour rediriger vers le site web
    }

    // Fonction pour afficher la modal
    function showModal() {
                                loadPageInIframe("tuto.html");
        var overlay = document.getElementById("overlay");
        var modal = document.getElementById("tutorialModal");

        // Affiche le fond gris semi-transparent et la modal
        overlay.style.display = "block";
        modal.style.display = "block";
    }

    // Vérifie l'état de la case à cocher au chargement de la page
    document.addEventListener('DOMContentLoaded', function () {
        var cookieCheckbox = document.getElementById("Cookies");
        var accessButton = document.getElementById("accessButton");

        // Récupère l'état enregistré dans le localStorage
        var cookieAccepted = localStorage.getItem("cookieAccepted");

        // Initialise l'état de la case à cocher et le bouton en fonction du localStorage
        if (cookieAccepted === "true") {
            cookieCheckbox.checked = true;
            accessButton.classList.remove('disabled-button');
            accessButton.classList.add('green-button');
            openWebsite()


        }

        // Affiche la modal si la case à cocher n'est pas cochée
        if (!cookieCheckbox.checked) {
            showModal();


        }
    });

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
    boutonLancerChrono.setAttribute('onclick', `ouvrirIframe('${iframeData.data.replace(/\s+/g, '-')}')`);
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