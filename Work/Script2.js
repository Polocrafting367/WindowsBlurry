


function chargerIframesDepuisLocalStorage() {
    // Récupérer la liste des lieux depuis le localStorage
    const listeEnregistree = JSON.parse(localStorage.getItem('maListe')) || [];

    // Parcourir la liste des lieux et ouvrir une iframe pour chacun
    for (const lieu of listeEnregistree) {

        ouvrirIframe(lieu);

    }
}

setTimeout(chargerIframesDepuisLocalStorage, 100);


function ouvrirIframe(nomLieu) {




    // Vérifier si une iframe avec la pastille "Actif - " existe déjà
    const pastille = document.getElementById(`pastille-${nomLieu}`);
    
    if (pastille && pastille.innerHTML.trim() === `Actif - ${nomLieu}`) {
   
        return;
    }
    // Créez une nouvelle iframe
    const iframe = document.createElement('iframe');

    // Définissez le nom de l'iframe en lien avec le lieu
    iframe.name = `iframe-${nomLieu}`;

    // Concaténer le nom du lieu à l'URL
    iframe.src = `chrono.html?lieu=${nomLieu}`;

    const iframeContainer = document.getElementById(`iframe-container-${nomLieu}`);


Restolieu(nomLieu);



    if (pastille) {
        // Ajoutez "Actif - " suivi du nom du lieu au contenu de la pastille
        pastille.innerHTML = `Actif - ${nomLieu}`;
        pastille.dataset.active = "true"; // Marquer la pastille comme active
    }
 
    if (iframeContainer) {
        // Effacer le contenu existant
        iframeContainer.innerHTML = '';

        // Ajouter l'iframe à l'élément parent
        iframeContainer.appendChild(iframe);

        // Envoyez un message à toutes les iframes imbriquées
        var iframesImbriquées = document.querySelectorAll('iframe');
        for (var i = 0; i < iframesImbriquées.length; i++) {
            if (iframesImbriquées[i] !== iframe) {
                iframesImbriquées[i].contentWindow.postMessage('NouvelleIframeCréée', '*');

            }
        }
    } else {
        console.error(`Le conteneur iframe-container-${nomLieu} n'a pas été trouvé.`);
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
 

    // Cibler l'élément iframe-container par le nom contenu dans iframeData.data
  var iframeASupprimer = document.querySelector(`iframe[name="iframe-${iframeData.data}"]`);
  const pastille = document.getElementById(`pastille-${iframeData.data}`);
  pastille.innerHTML = `${iframeData.data}`;

  supprimerRestolieu(iframeData.data)

    if (iframeASupprimer) {
        // Supprimer l'iframe
        iframeASupprimer.remove();
    } else {
        console.error(`L'iframe avec le nom ${iframeData.data} n'a pas été trouvé.`);
    }
}

});



function searchLieu() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const lieuxList = document.getElementById('lieux-list');
    const lieuxItems = lieuxList.getElementsByTagName('li');

    // Parcourir la liste des lieux
    for (let i = 0; i < lieuxItems.length; i++) {
        const lieuName = lieuxItems[i].innerText.toLowerCase();

        // Utiliser une expression régulière pour chercher le terme de recherche n'importe où dans le texte
        const regex = new RegExp(searchTerm, 'i');
        
        if (lieuName.match(regex)) {
            // Afficher l'élément trouvé
            lieuxItems[i].style.display = 'block';
            lieuxItems[i].classList.add('active');
        } else {
            // Cacher les éléments qui ne correspondent pas
            lieuxItems[i].style.display = 'none';
            lieuxItems[i].classList.remove('active');
        }
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