


function chargerIframesDepuisLocalStorage() {
    // Récupérer la liste des lieux depuis le localStorage
    const listeEnregistree = JSON.parse(localStorage.getItem('maListe')) || [];

    // Parcourir la liste des lieux et ouvrir une iframe pour chacun
    for (const lieu of listeEnregistree) {

        ouvrirIframe(lieu);
        ouvrirBranchesPourLieu(lieu);
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


function showNotification(message, nomLieu) {
    const notificationOptions = {
        body: message,
        icon: 'bloc-notes.png' // Remplacez par le chemin de votre icône
    };

    // Vérifiez si les notifications sont supportées par le navigateur
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                const notification = new Notification('Chrono en cours', notificationOptions);

                // Ajouter un gestionnaire d'événements pour rediriger vers la page
                notification.addEventListener('click', function () {
                    // Rediriger vers la page souhaitée
                    window.focus(); // Assure que la fenêtre est au premier plan
                    toggleChronosState();

                    // Mettre à jour le texte de la zone de texte avec le lieu
                    const searchInput = document.getElementById('searchInput');
                    if (searchInput) {
                        searchInput.value = nomLieu;
                        // Appeler la fonction de recherche
                        searchLieu();
                    } else {
                        // Gérer le cas où l'élément searchInput n'est pas trouvé
                        console.error("L'élément searchInput n'a pas été trouvé.");
                    }
                });
            }
        });
    }
}






window.addEventListener('message', function(event) {
    // Vérifier si l'origine du message est autorisée, si nécessaire
    // if (event.origin !== 'http://exemple.com') return;

    const iframeData = event.data;

    if (iframeData.type === 'enregistrement') {
                // Les données de l'iframe sont dans event.data
        
        // Faites quelque chose avec les données, par exemple, enregistrez-les
 const enregistrementsDiv = document.getElementById('enregistrements');
const enregistrements = localStorage.getItem('enregistrements') || '';
const nouvelEnregistrement = `${enregistrements}${iframeData.data}<br>`; // Accédez à la propriété 'data'
localStorage.setItem('enregistrements', nouvelEnregistrement);




        enregistrementsDiv.innerHTML = '';


afficherEnregistrements();

   
   } else if (iframeData.type === 'fermer') {
    // Faire quelque chose avec les données de fermeture
 
    var iframeASupprimer = document.querySelector(`iframe[name="iframe-${iframeData.data}"]`);
    const pastille = document.getElementById(`pastille-${iframeData.data}`);

    // Vérifier l'existence de la pastille avant de mettre à jour
   
        supprimerRestolieu(iframeData.data);
    

    if (iframeASupprimer) {
        // Supprimer l'iframe
        iframeASupprimer.remove();
    } else {
        console.error(`L'iframe avec le nom ${iframeData.data} n'a pas été trouvé.`);
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
    const searchInput = document.getElementById('searchInput');
    const searchTerm = normalizeString(searchInput.value.toLowerCase());

    const lieuxList = document.getElementById('lieux-list');
    const lieuxItems = lieuxList.querySelectorAll('li');

    // Parcourir la liste des lieux
    for (let i = 0; i < lieuxItems.length; i++) {
        const lieuItem = lieuxItems[i];
        const lieuName = normalizeString(lieuItem.innerText.toLowerCase());
        const regex = new RegExp(searchTerm, 'i');
        const matchesSearch = lieuName.match(regex);

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