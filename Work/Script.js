document.addEventListener("DOMContentLoaded", function () {
    chargerLieuxPersonnalises();
    chargerLieux();
    setDefaultTab();
});


if (!localStorage.getItem('lieuxEnregistres')) {
    localStorage.setItem('lieuxEnregistres', JSON.stringify([]));
}


let timers = {};
let lieuxState = {};

let globalPauseState = false;

        function formatTime(time) {
    return time < 10 ? '0' + time : time;
}


function supprimerLieu() {
    const lieuxDropdown = document.getElementById('lieuxDropdown');
    const selectedLieu = lieuxDropdown.value;

    if (selectedLieu) {
        // Ajoutez une confirmation avant de supprimer
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce lieu ?");
        
        if (confirmation) {
            // Supprimez l'élément sélectionné des cookies
            const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
            
            // Convertir la chaîne en tableau en supprimant les espaces vides
            const lieuxEnregistresArray = lieuxEnregistres.split(',').filter(lieu => lieu.trim() !== '' && lieu !== "[]");

            const indexToRemove = lieuxEnregistresArray.indexOf(selectedLieu);

            if (indexToRemove !== -1) {
                lieuxEnregistresArray.splice(indexToRemove, 1);
                localStorage.setItem('lieuxEnregistres', lieuxEnregistresArray.join(','));

                // Effacer la liste déroulante actuelle
                lieuxDropdown.innerHTML = '';

                lieuxEnregistresArray.forEach(nomLieu => {
                    const option = document.createElement('option');
                    option.value = nomLieu;
                    option.textContent = nomLieu;
                    lieuxDropdown.appendChild(option);
                });

                // Supprimer l'élément correspondant dans la liste lieux-list
                const lieuxList = document.getElementById('lieux-list');
                const lieuItemToRemove = document.querySelector(`[data-texte="${selectedLieu}"]`).parentNode.parentNode;
                lieuxList.removeChild(lieuItemToRemove);
            }
        }
    }
}







function setDefaultTab() {

    openTab('Chrono');

}

function openTab(tabName) {

   const chronoButton = document.getElementById('ChronoButton');
    const currentAnnimValue = chronoButton.getAttribute('annim');
    const newAnnimValue = 'false' ;
    chronoButton.setAttribute('annim', newAnnimValue);



    var i, tabcontent, tabbuttons;

    // Cacher tous les onglets
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Retirer la classe "active" de tous les boutons
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    // Afficher l'onglet sélectionné
    document.getElementById(tabName + "Tab").style.display = "block";

    // Ajouter la classe "active" au bouton correspondant
    document.getElementById(tabName + "Button").classList.add("active");
}


function ajouterLieu() {
    const nouveauLieuInput = document.getElementById('nouveauLieu');
    const nouveauLieu = nouveauLieuInput.value.trim();

    if (nouveauLieu !== '') {
        // Ajouter le nouveau lieu à localStorage
        const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
        const nouveauxLieux = lieuxEnregistres + ',' + nouveauLieu;
        localStorage.setItem('lieuxEnregistres', nouveauxLieux);

        // Ajouter le nouveau lieu en haut de la liste lieux-list
        ajouterLieuEnHaut(nouveauLieu);


        // Mettre à jour la liste déroulante
        mettreAJourListeDeroulante(nouveauLieu);

    }

    // Effacer le champ de saisie
    nouveauLieuInput.value = '';
}

function ajouterLieuEnHaut(nouveauLieu) {
    const lieuxList = document.getElementById('lieux-list');

    // Exclure les lieux vides
    if (nouveauLieu.trim() !== '' && nouveauLieu !== "[]") {
        // Créer un nouvel élément li
        const lieuItem = document.createElement('li');
        lieuItem.innerHTML = `
            <div class="place-card level" >
                <span class="pastille" data-texte="${nouveauLieu}" style="display:block"> ${nouveauLieu}</span>
                <button id="lancer-chrono-btn-${nouveauLieu}" data-lieu="${nouveauLieu}" onclick="ouvrirIframe('${nouveauLieu}')" style="width: 40px; height: 41px; position: absolute; top: -12px; right: -12px; border-radius: 8px; display: block;">
                    <img src="chrono.png" alt="Icône chrono" style="width: 20px; height: 20px; position: absolute; bottom: 10px; right: 9px;">
                </button>
                <div class="iframe-container" id="iframe-container-${nouveauLieu}"></div>
            </div>`;

        // Insérer l'élément en haut de la liste lieux-list
        lieuxList.prepend(lieuItem);
    }
}


function mettreAJourListeDeroulante(nouveauLieu) {
    const lieuxDropdown = document.getElementById('lieuxDropdown');

    // Vérifier si nouveauLieu est différent de "[]"
    if (nouveauLieu.trim() !== '' && nouveauLieu !== "[]") {
        // Ajouter le nouvel élément à la liste déroulante
        const option = document.createElement('option');
        option.value = nouveauLieu;
        option.textContent = nouveauLieu;
        lieuxDropdown.appendChild(option);
    }
}


function chargerLieuxPersonnalises() {
    console.log('Chargement des lieux personnalisés...');
    
    const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

    const lieuxList = document.getElementById('lieux-list');

    for (const lieuEnregistre of lieuxEnregistresArray) {
        console.log(lieuEnregistre);
        ajouterLieuEnHaut(lieuEnregistre);
        mettreAJourListeDeroulante(lieuEnregistre)
    }
}




function supprimerTousLesCookies() {
    // Demandez une confirmation avant de supprimer tous les cookies
   const confirmation = window.confirm(
  "Êtes-vous sûr de vouloir supprimer tous les cookies ?\nLes interventions, lieux personnalisés, chronos en court seront supprimés"
);

    if (confirmation) {
        // Supprimez le cookie 'lieuxEnregistres'
        localStorage.removeItem('lieuxEnregistres');

        // Supprimez le cookie 'enregistrements'
        localStorage.removeItem('enregistrements');
        localStorage.removeItem('maListe');


const chronosContainer = document.getElementById('chronosContainer');
parcourirArborescenceEtCreerIframes(arborescence, chronosContainer);

        const iframesImbriquées = document.querySelectorAll('iframe');

        for (let i = 0; i < iframesImbriquées.length; i++) {
            iframesImbriquées[i].contentWindow.postMessage('SupprimerCookie', '*');
        }

localStorage.removeItem('maListe');





        alert("Tous les cookies ont été supprimés");
        // Rafraîchissez la page ou mettez à jour l'affichage des enregistrements
        location.reload();

        // Affichez un message après la suppression des cookies

    }
}
function supprimerchronos() {


    const confirmation = window.confirm("Êtes-vous sûr de vouloir stopper tous les chronos?");

    if (confirmation) {
        const iframesImbriquées = document.querySelectorAll('iframe');

        for (let i = 0; i < iframesImbriquées.length; i++) {
            iframesImbriquées[i].contentWindow.postMessage('SupprimerCookie', '*');
        }

localStorage.removeItem('maListe');

        alert("Tous les chronos ont été stoppés");
        location.reload();
    }
}


function supprimerchronosHARD() {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir stopper tous les chronos?");

   if (confirmation) {
    
const chronosContainer = document.getElementById('chronosContainer');
parcourirArborescenceEtCreerIframes(arborescence, chronosContainer);

        const iframesImbriquées = document.querySelectorAll('iframe');

        for (let i = 0; i < iframesImbriquées.length; i++) {
            iframesImbriquées[i].contentWindow.postMessage('SupprimerCookie', '*');
        }

localStorage.removeItem('maListe');

        alert("Tous les chronos ont été stoppés");
        location.reload();

    }
}


function parcourirArborescenceEtCreerIframes(arbre, parent) {
    for (const lieu in arbre) {
        const iframeContainer = document.createElement('div');
        const iframe = document.createElement('iframe');
        const nomLieu = lieu.toLowerCase().replace(/\s+/g, '-');

        iframe.id = `iframe-${nomLieu}`;
        iframe.src = `chrono.html?lieu=${lieu}`;

        iframeContainer.appendChild(iframe);
        parent.appendChild(iframeContainer);

        if (Object.keys(arbre[lieu]).length > 0) {
            parcourirArborescenceEtCreerIframes(arbre[lieu], iframeContainer);
        }
    }
}

function exportToTxt() {
    const enregistrementsDiv = document.getElementById('enregistrements');
    const enregistrementsData = enregistrementsDiv.innerText;

    // Créer un objet Date pour obtenir la date d'aujourd'hui
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    // Générer le contenu du fichier texte avec la date et les enregistrements
    const fileContent = `Export du ${formattedDate}\n\n${enregistrementsData}`;

    // Créer un objet Blob pour le contenu du fichier
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Créer un objet URL pour le Blob
    const url = URL.createObjectURL(blob);

    // Créer un élément de lien pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = `export_${formattedDate}.txt`;

    // Ajouter le lien à la page et déclencher le téléchargement
    document.body.appendChild(link);
    link.click();

    // Retirer le lien de la page une fois le téléchargement terminé
    document.body.removeChild(link);
}



function deleteCookies() {
    // Demander une confirmation avant de supprimer tous les enregistrements
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer tous les enregistrements ?");

    if (confirmation) {
        // Supprimer tous les enregistrements dans localStorage
        localStorage.removeItem('enregistrements');

        // Rafraîchir ou mettre à jour l'affichage des enregistrements


        alert("Tous les enregistrements ont été supprimés");

                location.reload();
    }
}
