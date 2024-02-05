// Initialiser lieuxEnregistres dans localStorage si ce n'est pas déjà fait
if (!localStorage.getItem('lieuxEnregistres')) {
    localStorage.setItem('lieuxEnregistres', JSON.stringify([]));
}


let timers = {};
let lieuxState = {};

let globalPauseState = false;

        function formatTime(time) {
    return time < 10 ? '0' + time : time;
}
document.addEventListener("DOMContentLoaded", function () {
    chargerLieux();
    afficherEnregistrements();
    setDefaultTab();
});



function chargerLieux() {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxDropdown = document.getElementById('lieuxDropdown');

    // Charger les lieux enregistrés dans le localStorage
    const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

    lieuxList.innerHTML = '';

    lieuxEnregistresArray.forEach(nomLieu => {
        // Vérifier si l'élément n'est pas vide et n'est pas "["
        if (nomLieu.trim() !== '' && nomLieu !== '[]') {
            const lieuItem = document.createElement('li');
            lieuItem.innerHTML = `<div class="place-card" onclick="ouvrirModal(event, '${nomLieu}')">
                                    <span class="pastille" id="pastille-${nomLieu}"></span>${nomLieu}
                                </div>`;
            lieuxList.appendChild(lieuItem);

            // Ajoutez le lieu à la liste déroulante
            const option = document.createElement('option');
            option.value = nomLieu;
            option.textContent = nomLieu;
            lieuxDropdown.appendChild(option);
        }
    });

    // Charger les lieux à partir du fichier JSON
    const randomParam = Math.random(); // Ajouter un paramètre aléatoire
    const url = `lieux.json?random=${randomParam}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(nomLieu => {
                if (!lieuxEnregistresArray.includes(nomLieu) && nomLieu !== '[') {
                    // Vérifier si l'élément n'est pas "["
                    const lieuItem = document.createElement('li');
                    lieuItem.innerHTML = `<div class="place-card" onclick="ouvrirModal(event, '${nomLieu}')">
                                            <span class="pastille" id="pastille-${nomLieu}"></span>${nomLieu}
                                         </div>`;
                    lieuxList.appendChild(lieuItem);
                }
            });
        })
        .catch(error => console.error('Erreur de chargement des lieux', error));
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
            const lieuxEnregistresArray = lieuxEnregistres.split(',').filter(lieu => lieu.trim() !== '');

            const indexToRemove = lieuxEnregistresArray.indexOf(selectedLieu);

            if (indexToRemove !== -1) {
                lieuxEnregistresArray.splice(indexToRemove, 1);
                localStorage.setItem('lieuxEnregistres', lieuxEnregistresArray.join(','));

                // Rechargez la liste des lieux
                chargerLieux();

                // Mettez à jour la liste déroulante
                mettreAJourListeDeroulante(localStorage.getItem('lieuxEnregistres') || '');
            }
        }
    }
}






function afficherEnregistrements() {
    const enregistrementsDiv = document.getElementById('enregistrements');
    const enregistrements = localStorage.getItem('enregistrements');

    if (enregistrements) {
        enregistrementsDiv.innerHTML = enregistrements;
    }
}
function setDefaultTab() {
    // Ouvrir l'onglet "Créer" par défaut
    openTab('creer');
}

function openTab(tabName) {
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
        mettreAJourListeDeroulante(nouveauxLieux);

    }

    // Effacer le champ de saisie
    nouveauLieuInput.value = '';
}

function ajouterLieuEnHaut(nouveauLieu) {
    const lieuxList = document.getElementById('lieux-list');

    // Créer un nouvel élément li
    const lieuItem = document.createElement('li');
    lieuItem.innerHTML = `<div class="place-card" onclick="ouvrirModal(event, '${nouveauLieu}')">
                            <span class="pastille" id="pastille-${nouveauLieu}"></span>${nouveauLieu}
                         </div>`;

    // Insérer l'élément en haut de la liste lieux-list
    lieuxList.prepend(lieuItem);
}


function mettreAJourListeDeroulante(lieuxEnregistres) {
    const lieuxDropdown = document.getElementById('lieuxDropdown');

    // Effacer la liste déroulante actuelle
    lieuxDropdown.innerHTML = '';

    // Convertir la chaîne en tableau en supprimant les espaces vides
    const lieuxEnregistresArray = lieuxEnregistres.split(',').filter(lieu => lieu.trim() !== '');

    lieuxEnregistresArray.forEach(nomLieu => {
        // Ajouter seulement si le lieu n'est pas "[ ]"
        if (nomLieu !== "[]") {
            const option = document.createElement('option');
            option.value = nomLieu;
            option.textContent = nomLieu;
            lieuxDropdown.appendChild(option);
        }
    });
}




function supprimerTousLesCookies() {
    // Demandez une confirmation avant de supprimer tous les cookies
   const confirmation = window.confirm(
  "Êtes-vous sûr de vouloir supprimer tous les cookies ?\nLes interventions et lieux personnalisés seront supprimés"
);

    if (confirmation) {
        // Supprimez le cookie 'lieuxEnregistres'
        localStorage.removeItem('lieuxEnregistres');

        // Supprimez le cookie 'enregistrements'
        localStorage.removeItem('enregistrements');

        // Rafraîchissez la page ou mettez à jour l'affichage des enregistrements
        location.reload();

        // Affichez un message après la suppression des cookies
        alert("Tous les cookies ont été supprimés");
    }
}


function ouvrirModal(event, nomLieu) {



    // Vérifiez si un chrono est déjà en cours pour ce lieu
    if (lieuxState[nomLieu] && lieuxState[nomLieu].isRunning) {
        alert('Un chrono est déjà en cours pour ce lieu.');
        return;
    }

    lieuxState[nomLieu] = {
        isRunning: true,
        // ... autres propriétés que vous souhaitez suivre ...
    };

const placeDetails = document.createElement('div');
placeDetails.classList.add('place-details');  // Ajouter une classe unique
placeDetails.style.display = 'flex'; // Définir la disposition flex

// Créer une div pour contenir les boutons et les aligner en ligne
const boutonsDiv = document.createElement('div');
boutonsDiv.style.display = 'flex'; // Définir la disposition flex pour les boutons
boutonsDiv.style.marginTop = '10px'; // Ajouter un espace au-dessus des boutons (ajustez selon vos besoins)

    // Find the corresponding list item
    const listItem = event.target.closest('li');
    const placeCard = listItem.querySelector('.place-card');
    const pastilleSpan = placeCard.querySelector('.pastille');

    // Ajoutez " - actif" à l'ancien texte
    pastilleSpan.textContent = pastilleSpan.textContent + 'Actif - ';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');


  // Ajouter une classe unique

    const chronoStatus = document.createElement('div');
    chronoStatus.classList.add('chrono-status');  // Ajouter une classe unique


    const chrono = document.createElement('div');
    chrono.id = 'chrono';
    chrono.textContent = '00:00:00';

    const zoneTexte = document.createElement('textarea');
    zoneTexte.id = 'zone-texte';
    zoneTexte.placeholder = 'Saisissez quelque chose...';

const annulerButton = document.createElement('button');
annulerButton.textContent = 'Annuler';
annulerButton.classList.add('modal-button');  // Ajoutez une classe
annulerButton.onclick = annuler;
annulerButton.style.width = '100%';  // Ajoutez cette ligne pour définir la largeur à 100%

const pauseButton = document.createElement('button');
pauseButton.textContent = 'Pause';
pauseButton.classList.add('modal-button');  // Ajoutez une classe
pauseButton.style.backgroundColor = 'yellow';
pauseButton.style.color = 'black';
pauseButton.onclick = function () {
    togglePause(pauseButton, nomLieu);
};
pauseButton.style.width = '100%';  // Ajoutez cette ligne pour définir la largeur à 100%

const enregistrerButton = document.createElement('button');
enregistrerButton.textContent = 'Enregistrer';
enregistrerButton.classList.add('modal-button');  // Ajoutez une classe
enregistrerButton.style.backgroundColor = 'red';
enregistrerButton.style.color = 'black';
enregistrerButton.onclick = function () {
    toggleSave(pauseButton, nomLieu);
};
enregistrerButton.style.width = '100%';  // Ajoutez cette ligne pour définir la largeur à 100%


modalContent.setAttribute('data-nom-lieu', nomLieu);
    // Append elements to placeDetails
boutonsDiv.appendChild(annulerButton);
boutonsDiv.appendChild(pauseButton);
boutonsDiv.appendChild(enregistrerButton);

placeDetails.appendChild(chronoStatus);
placeDetails.appendChild(chrono);
placeDetails.appendChild(zoneTexte);
placeDetails.appendChild(boutonsDiv); // Ajouter la div des boutons à placeDetails



    // Append elements to modalContent
    modalContent.appendChild(placeDetails);


    listItem.appendChild(modalContent);

    // Clear previous content
    zoneTexte.value = '';
listItem.classList.add('active-chrono');
    // Create a basic timer
  let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let timerInterval;

    timers[nomLieu] = {
        timerInterval: timerInterval,
        isPaused: false,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    // Update the timer display every second
 timerInterval = setInterval(() => {
        if (!timers[nomLieu].isPaused) {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            if (minutes === 60) {
                hours++;
                minutes = 0;
            }

            chrono.textContent = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);
        }
    }, 1000);

    // Update the timer status
    chronoStatus.textContent = 'En cours';
    chronoStatus.style.color = 'limegreen';

    // Function to format time as '00'

    // Store the interval ID and pause state in a data attribute
    timers[nomLieu] = {
        timerInterval: timerInterval,
        isPaused: false,
        chronoStatus: chronoStatus,
        chrono: chrono
    };

}


// Déclarez timerInterval en tant que variable globale

let timerInterval; // Déclarez timerInterval en tant que variable globale

// ... (le reste de votre code) ...

function togglePause(button, nomLieu) {
        const timer = timers[nomLieu];

     if (!timer.isPaused && !globalPauseState) {
        // Enregistrez la durée écoulée avant la pause
        timer.elapsedTime = {
            hours: timer.hours,
            minutes: timer.minutes,
            seconds: timer.seconds
        };

        // Pause the timer
        clearInterval(timerInterval);

        // Update the timer status
        timer.chronoStatus.textContent = 'En pause';
        timer.chronoStatus.style.color = 'yellow';

        // Change the button text to "Reprendre"
        button.textContent = 'Reprendre';
        button.style.backgroundColor = 'green';
        button.style.color = 'White';
                const listItem = event.target.closest('li');
        listItem.classList.add('paused');
    } else {
        // Reprendre le timer avec la durée écoulée avant la pause
  // Reprendre le timer avec la durée écoulée avant la pause
        const listItem = event.target.closest('li');
        listItem.classList.remove('paused');
// Update the timer display every second


        // Update the timer status
        timer.chronoStatus.textContent = 'En cours';
        timer.chronoStatus.style.color = 'limegreen';

        // Change the button text back to "Pause"
        button.textContent = 'Pause';
        button.style.backgroundColor = 'yellow';
        button.style.color = 'Black';
    }

    // Inversez l'état de pause
    timer.isPaused = !timer.isPaused;
}




function toggleSave(button, nomLieu) {
    const modalContent = event.target.closest('.modal-content');

    // Stop the timer
    const timer = timers[nomLieu];
    timer.isPaused = !timer.isPaused;
    clearInterval(timer.timerInterval);

    // Update the timer status
    const chronoStatus = modalContent.querySelector('.chrono-status');
    chronoStatus.textContent = 'Fini';
    chronoStatus.style.color = 'red';

    // Retrieve the text from the textarea
    const zoneTexte = modalContent.querySelector('#zone-texte');
    const texteEnregistre = zoneTexte.value;

    // Check if the textarea is not empty
    if (texteEnregistre.trim() !== "") {
        // Get the current date
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

        // Ask for confirmation before clearing the textarea
        const confirmation = window.confirm(`Voulez-vous vraiment enregistrer le texte du ${formattedDate} ?\nCela effacera le contenu actuel.`);

        if (confirmation) {
            // Display the pastille and recorded information
            const enregistrementsDiv = document.getElementById('enregistrements');
            const tempsEnregistre = timer.chrono.textContent;
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            const enregistrementTexte = `${formattedDate} - ${tempsEnregistre} - ${nomLieu} - ${texteEnregistre}`;
            enregistrementsDiv.innerHTML += `<p>${enregistrementTexte}</p>`;

            // Save the information to localStorage
            sauvegarderEnregistrement(enregistrementTexte);

            // Remove the "Actif - " text from the pastille
            const listItem = event.target.closest('li');
            const placeCard = listItem.querySelector('.place-card');
            const pastilleSpan = placeCard.querySelector('.pastille');
            pastilleSpan.textContent = pastilleSpan.textContent.replace('Actif - ', '');
            listItem.classList.remove('active-chrono');
            fermerModal(modalContent);

                lieuxState[nomLieu] = {
        isRunning: false,
        // ... autres propriétés que vous souhaitez suivre ...
    };
        }
    } else {
        // Show a message if the textarea is empty
        alert("Le contenu est vide. Veuillez entrer du texte avant d'enregistrer.");
    }

    // Reset the button styles
    button.textContent = 'Reprendre';
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
}

function sauvegarderEnregistrement(enregistrement) {
    const enregistrementsDiv = document.getElementById('enregistrements');
    const enregistrements = localStorage.getItem('enregistrements') || "";
    const nouvelEnregistrement = `${enregistrements}${enregistrement}<br>`;
    localStorage.setItem('enregistrements', nouvelEnregistrement);
}


function annuler() {
    // Afficher la confirmation
    const confirmation = window.confirm('Êtes-vous sûr de vouloir annuler ?');

    // Si l'utilisateur clique sur "OK" dans la confirmation, fermer la modal
    if (confirmation) {
   const modalContent = event.target.closest('.modal-content');
        const nomLieu = modalContent.getAttribute('data-nom-lieu');

        const listItem = event.target.closest('li');
        const placeCard = listItem.querySelector('.place-card');
        const pastilleSpan = placeCard.querySelector('.pastille');
        pastilleSpan.textContent = pastilleSpan.textContent.replace('Actif - ', '');

        fermerModal(modalContent);
listItem.classList.remove('active-chrono');
        lieuxState[nomLieu] = {
            isRunning: false,
            // ... autres propriétés que vous souhaitez suivre ...
        };
    }
    // Sinon, ne rien faire
}

function fermerModal(modalContent) {

    // Clear the interval when closing the modal
    const nomLieu = modalContent.getAttribute('data-nom-lieu');

    // Remove the modal content from its parent
    modalContent.parentNode.removeChild(modalContent);
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
        location.reload();

        alert("Tous les enregistrements ont été supprimés");
    }
}


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
        window.addEventListener('beforeunload', function (event) {
            // Votre logique de sauvegarde ou l'alerte ici
            var confirmationMessage = "Les crhono ne seront pas sauvegarder. Êtes-vous sûr de vouloir actualiser/quitter la page ?";
            
            // Standard pour la plupart des navigateurs
            if (typeof event === 'undefined') {
                event = window.event;
            }
            
            if (event) {
                event.returnValue = confirmationMessage;
            }
            
            return confirmationMessage;
        });


let isChronosActif = true; // Variable pour suivre l'état actuel

function toggleChronosState() {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxItems = lieuxList.getElementsByTagName('li');
    const searchInput = document.getElementById('searchInput');

    if (isChronosActif) {
        // Mettre à jour la valeur de la zone de recherche avec "Actif"
        searchInput.value = 'actif';

        // Parcourir la liste des lieux
        for (let i = 0; i < lieuxItems.length; i++) {
            const lieuName = lieuxItems[i].innerText.toLowerCase();

            // Vérifier si le lieu contient "Actif" dans son nom
            if (lieuName.includes('actif')) {
                // Afficher l'élément
                lieuxItems[i].style.display = 'block';
                lieuxItems[i].classList.add('active');
            } else {
                // Cacher les éléments qui ne contiennent pas "Actif"
                lieuxItems[i].style.display = 'none';
                lieuxItems[i].classList.remove('active');
            }
        }

        // Mettre à jour le texte du bouton
        document.getElementById('toggleButton').innerText = 'Retour';

    } else {
        // Réinitialiser la recherche
        searchInput.value = '';

        // Afficher tous les éléments
        for (let i = 0; i < lieuxItems.length; i++) {
            lieuxItems[i].style.display = 'block';
            lieuxItems[i].classList.remove('active');
        }

        // Mettre à jour le texte du bouton
        document.getElementById('toggleButton').innerText = 'Chronos Actif';
    }

    // Inverser l'état
    isChronosActif = !isChronosActif;
}

function adjustSearchInputWidth() {
    const toggleButton = document.getElementById('toggleButton');
    const searchInput = document.getElementById('searchInput');

    // Obtenir la largeur du bouton
    const buttonWidth = toggleButton.offsetWidth;

    // Ajuster la marge gauche et la largeur du searchInput en fonction de la largeur du bouton
    searchInput.style.marginLeft = `${buttonWidth + 5}px`; // Ajouter 5px d'espacement
    searchInput.style.width = `calc(100% - ${buttonWidth + 10}px)`; // Ajouter 8px pour l'espacement et les bordures
}

// Appeler la fonction pour ajuster la largeur initiale
adjustSearchInputWidth();

// Ajouter également un écouteur d'événement sur le redimensionnement de la fenêtre (si nécessaire)
window.addEventListener('resize', adjustSearchInputWidth);
