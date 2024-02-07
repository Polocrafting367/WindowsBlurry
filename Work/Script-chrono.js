
window.addEventListener('message', function(event) {
    // Vérifiez que le message provient de la page mère
    if (event.source !== window.parent) return;

    // Effectuez des actions en fonction du message reçu
    if (event.data === 'NouvelleIframeCréée') {
        // Vérifiez si vous n'êtes pas déjà en pause avant d'exécuter pauseResumeChrono
        if (!isPaused) {
            // Exécutez la fonction spécifique (maFonction)
            pauseResumeChrono();
        } else {

        }
    }
});



// Récupérer la valeur du paramètre "lieu" de l'URL
var lieu = getURLParameter('lieu');

// Utiliser la variable "lieu" comme nécessaire dans votre code



 document.addEventListener('DOMContentLoaded', init);

    function init() {
        startChrono()


        // Vous pouvez ajouter d'autres initialisations ici
    }


function getURLParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

    let isPaused = false;
    let startTime;
    let pauseStartTime = 0;
    let elapsedTime = 0;
    let interval;

    function startChrono(place) {
    

        const listItem = document.querySelector('.active-chrono');
        listItem.classList.remove('paused', 'STOP');
        document.querySelector('.chrono-status').textContent = 'En cours';
        isPaused = false;
        startTime = new Date().getTime() - elapsedTime;
        interval = setInterval(updateChrono, 1000);
               
    }

    function updateChrono() {
        if (!isPaused) {
            const currentTime = new Date().getTime();
            elapsedTime = currentTime - startTime;
            displayTime(elapsedTime);
        }
    }

    let totalPauseDuration = 0;

    // ... (votre code existant)

    function pauseResumeChrono() {
        const listItem = document.querySelector('.active-chrono');
        const pauseResumeButton = listItem.querySelector('.modal-button[onclick="pauseResumeChrono()"]');

        if (!isPaused) {
            isPaused = true;
            listItem.classList.add('paused');
document.querySelector('.chrono-status').textContent = 'En pause';
document.querySelector('.chrono-status').style.color = 'yellow';

            pauseStartTime = new Date().getTime();
            clearInterval(interval);

            // Modifier le bouton pour afficher "Reprendre"
            pauseResumeButton.textContent = 'Reprendre';
            pauseResumeButton.style.backgroundColor = 'green';

            // Afficher un log
      
        } else {
            isPaused = false;
            listItem.classList.remove('paused');
            listItem.classList.remove('STOP');
            document.querySelector('.chrono-status').textContent = 'En cours';
            document.querySelector('.chrono-status').style.color = 'limegreen';
            const pauseDuration = new Date().getTime() - pauseStartTime;
            totalPauseDuration += pauseDuration; // Ajouter la durée de la pause à la durée totale
            startTime += pauseDuration;
            interval = setInterval(updateChrono, 1000);

            // Modifier le bouton pour afficher "Pause"
            pauseResumeButton.textContent = 'Pause';
            pauseResumeButton.style.backgroundColor = 'yellow';

            // Afficher un log
  
        }
    }


function saveRecord() {
            const listItem = document.querySelector('.active-chrono');
        const pauseResumeButton = listItem.querySelector('.modal-button[onclick="pauseResumeChrono()"]');
     if (isPaused === false) {
            isPaused = true;

            pauseStartTime = new Date().getTime();
            clearInterval(interval);
         
        }

        listItem.classList.add('STOP');

        document.querySelector('.chrono-status').textContent = 'Fini';
        document.querySelector('.chrono-status').style.color = 'red';
        pauseResumeButton.textContent = 'Reprendre';
        pauseResumeButton.style.backgroundColor = 'green';

    const zoneTexte = document.getElementById('zone-texte');
    if (zoneTexte.value.trim() === '') {
        alert('Veuillez saisir quelque chose avant d\'enregistrer.');
                   
        
   
    } else {
             
        const confirmation = window.confirm('Voulez-vous vraiment enregistrer et supprimer cet enregistrement ?');
        if (confirmation) {
            const tempsAffiche = document.getElementById('chrono').textContent;
            const currentDate = new Date();

            // Formater la date en JJ/MM/AAAA
            const formattedDate = `${pad(currentDate.getDate())}/${pad(currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`;

            // Construire la chaîne d'enregistrement avec la date
            const enregistrement = `${formattedDate} - ${tempsAffiche} - ${lieu} - ${zoneTexte.value.trim()}`;

            // Envoyer les données à la page parente
            sendEventToParent('enregistrement', enregistrement);

            setTimeout(() => {
                sendEventToParent('fermer', lieu);
            }, 100);
        }
    }
}


    function cancelChrono() {
sendEventToParent('fermer', lieu);
    }

    function displayTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const formattedTime = `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
        document.getElementById('chrono').textContent = formattedTime;
    }

    function pad(number) {
        return number < 10 ? `0${number}` : number;
    }


    function sendEventToParent(eventType, eventData) {
    const message = {
        type: eventType,
        data: eventData
    };

    // Envoyer le message à la fenêtre parente
    window.parent.postMessage(message, '*');
}


