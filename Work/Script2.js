

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
    const enregistrementsDiv = document.getElementById('enregistrements');
    const enregistrements = localStorage.getItem('enregistrements') || '';
    
    // Ajouter le nouvel enregistrement avec le séparateur <hr>
    const separateur = '<hr>';
    const nouvelEnregistrement = `${enregistrements ? separateur : ''}${iframeData.data}`;
    
    localStorage.setItem('enregistrements', `${enregistrements}${nouvelEnregistrement}`);

    // Mettre à jour le contenu de la div en utilisant les enregistrements avec les séparateurs <hr>
    enregistrementsDiv.innerHTML = localStorage.getItem('enregistrements');


afficherEnregistrements();

   
   }else if (iframeData.type === 'fermer') {
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
    const searchInput = document.getElementById('searchInput');
    const searchTerm = normalizeString(searchInput.value.toLowerCase());

    const lieuxList = document.getElementById('lieux-list');
    const lieuxItems = lieuxList.querySelectorAll('li');

    // Parcourir la liste des lieux
    for (let i = 0; i < lieuxItems.length; i++) {
        const lieuItem = lieuxItems[i];
        const lieuName = normalizeString(lieuItem.innerText.toLowerCase());

        // Diviser le terme de recherche en mots clés
        const searchTerms = searchTerm.split(/\s+/);

        // Vérifier si tous les mots clés sont présents dans le nom du lieu
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