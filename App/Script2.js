let chronoWorker = new Worker('chrono-worker.js');


function ouvrirModal(event, nomLieu) {

chronoWorker.postMessage('start');

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
enregistrerButton.onclick = function (event) {
    toggleSave(pauseButton, nomLieu, event);
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

chronoWorker.postMessage('stop');

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
        listItem.classList.remove('STOP');
// Update the timer display every second

chronoWorker.postMessage('start');
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

    // Mettre en pause le worker du chrono
    chronoWorker.postMessage('pause');

    const listItem = event.target.closest('li');
    listItem.classList.add('STOP');

    // Stop the timer
    const timer = timers[nomLieu];
    timer.isPaused = !timer.isPaused;

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
listItem.classList.remove('STOP');
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
chronoWorker.postMessage('stop');
        const listItem = event.target.closest('li');
        const placeCard = listItem.querySelector('.place-card');
        const pastilleSpan = placeCard.querySelector('.pastille');
        pastilleSpan.textContent = pastilleSpan.textContent.replace('Actif - ', '');
listItem.classList.remove('STOP');
listItem.classList.remove('paused');
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
