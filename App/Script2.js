

function ouvrirModal(event, nomLieu) {
    let pauseButton;
    let elapsedTime = { hours: 0, minutes: 0, seconds: 0 };
    let initialTime;
    let chrono;

    // Assurez-vous que timers est un tableau
    if (!Array.isArray(timers)) {
        timers = [];
    }

    timer = timers.find(t => t.nomLieu === nomLieu);

    if (!timer) {
        timer = {
            nomLieu: nomLieu,
            timerInterval: null,
            isPaused: false,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        timers.push(timer);
    }

 initialTime = new Date();
    // Vérifiez si un chrono est déjà en cours pour ce lieu
    if (lieuxState[nomLieu] && lieuxState[nomLieu].isRunning) {
        alert('Un chrono est déjà en cours pour ce lieu.');
        return;
    }


    lieuxState[nomLieu] = {
        isRunning: true,
        // ... autres propriétés que vous souhaitez suivre ...
    };


  const startDate = new Date();
    localStorage.setItem(`startTime_${nomLieu}`, startDate.toISOString());
console.log("enregistrement",startDate);



const placeDetails = document.createElement('div');
placeDetails.classList.add('place-details');  // Ajouter une classe unique
placeDetails.style.display = 'flex'; // Définir la disposition flex

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

chrono = document.createElement('div');
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

 pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    pauseButton.classList.add('modal-button');
    pauseButton.style.backgroundColor = 'yellow';
    pauseButton.style.color = 'black';
pauseButton.onclick = function () {
    togglePause(pauseButton, nomLieu, timer);
};
    pauseButton.style.width = '100%';

    boutonsDiv.appendChild(pauseButton);

const enregistrerButton = document.createElement('button');
enregistrerButton.textContent = 'Enregistrer';
enregistrerButton.classList.add('modal-button');  // Ajoutez une classe
enregistrerButton.style.backgroundColor = 'red';
enregistrerButton.style.color = 'black';
enregistrerButton.onclick = function (event) {
    toggleSave(pauseButton, nomLieu, event, timer);
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
     timer.timerInterval = setInterval(() => {
            if (!timer.isPaused) {
                timer.seconds++;
                if (timer.seconds === 60) {
                    timer.minutes++;
                    timer.seconds = 0;
                }
                if (timer.minutes === 60) {
                    timer.hours++;
                    timer.minutes = 0;
                }

                // Utilisez la variable globale chrono ici
                chrono.textContent = formatTime(timer.hours) + ':' + formatTime(timer.minutes) + ':' + formatTime(timer.seconds);
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


function togglePause(button, nomLieu, timer) {
    timer = Object.values(timers).find(t => t.nomLieu === nomLieu);

    // Assurez-vous que timer et chrono sont définis
    if (timer && timer.chrono) {
        if (!timer.isPaused && !globalPauseState) {
            // Enregistrez le temps initial
            timer.initialTime = new Date();

            // Initialisez le temps écoulé à zéro
            timer.elapsedTime = { hours: 0, minutes: 0, seconds: 0 };

            // Pause the timer
            clearInterval(timer.timerInterval);

            // Update the timer status
            timer.chronoStatus.textContent = 'En pause';
            timer.chronoStatus.style.color = 'yellow';

            // Change the button text to "Reprendre"
            button.textContent = 'Reprendre';
            button.style.backgroundColor = 'green';
            button.style.color = 'White';

            const listItem = button.closest('li');
            listItem.classList.add('paused');
        } else {
        // Reprendre le timer avec la durée écoulée avant la pause
        timer.initialTime = new Date();
        timer.initialTime.setHours(timer.initialTime.getHours() - timer.elapsedTime.hours);
        timer.initialTime.setMinutes(timer.initialTime.getMinutes() - timer.elapsedTime.minutes);
        timer.initialTime.setSeconds(timer.initialTime.getSeconds() - timer.elapsedTime.seconds);

        // Réinitialisez le temps écoulé à zéro
        timer.elapsedTime = { hours: 0, minutes: 0, seconds: 0 };

        // Reprendre le timer avec la durée écoulée avant la pause
        const listItem = button.closest('li');
        listItem.classList.remove('paused');
        listItem.classList.remove('STOP');

        // Update the timer display every second

            if (timer.chrono.textContent) {
               timer.chronoStatus.textContent = formatTime(timer.hours) + ':' + formatTime(timer.minutes) + ':' + formatTime(timer.seconds);

            }

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
}}


function calculateElapsedTime(startTime) {
    const now = new Date();
    const elapsedTime = now - startTime;

    const hours = Math.floor(elapsedTime / (60 * 60 * 1000));
    const minutes = Math.floor((elapsedTime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);

    return { hours, minutes, seconds };
}


function toggleSave(button, nomLieu, event, timer) {
    const modalContent = event.target.closest('.modal-content');

    // Mettre en pause le worker du chrono


    const listItem = event.target.closest('li');
    listItem.classList.add('STOP');

    // Stop the timer

    clearInterval(timer.timerInterval);

        elapsedTime = {
        hours: timer.hours,
        minutes: timer.minutes,
        seconds: timer.seconds
    };

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
            const tempsEnregistre = chrono.textContent;

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
        const lieuName = lieuxItems[i].textContent.toLowerCase();


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
