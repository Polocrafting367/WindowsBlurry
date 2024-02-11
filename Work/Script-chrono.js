
window.addEventListener('message', function(event) {

    // Vérifiez que le message provient de la page mère
    if (event.source !== window.parent) return;

    // Effectuez des actions en fonction du message reçu
    //if (event.data === 'NouvelleIframeCréée') {

        // Vérifiez si vous n'êtes pas déjà en pause avant d'exécuter pauseResumeChrono
        if (!isPaused) {
            // Exécutez la fonction spécifique (maFonction)
            pauseResumeChrono();
        } 

          if (event.data === 'SupprimerCookie') {
        // Supprimez le cookie spécifique à cette iframe
        localStorage.removeItem(lieu); // Remplacez 'lieu' par le nom du cookie de l'iframe
    }
    }
);




// Récupérer la valeur du paramètre "lieu" de l'URL
var lieu = getURLParameter('lieu');

// Utiliser la variable "lieu" comme nécessaire dans votre code



 document.addEventListener('DOMContentLoaded', init);

    function init() {
        restoreChronoData();



        // Vous pouvez ajouter d'autres initialisations ici
    }


function getURLParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}



function restoreChronoData() {


    // Récupérer les données du localStorage
    const savedData = localStorage.getItem(lieu);


    if (savedData) {
        // Parser les données JSON
        const chronoData = JSON.parse(savedData);

        // Restaurer les variables
        isPaused = chronoData.isPaused;
        startTime = chronoData.startTime;
        pauseStartTime = chronoData.pauseStartTime;
        totalPauseDuration = chronoData.totalPauseDuration;
        elapsedTime = chronoData.elapsedTime;


        const zoneTexte = document.getElementById('zone-texte');
        if (chronoData.texteZone) {
            zoneTexte.value = chronoData.texteZone;
        }


        const listItem = document.querySelector('.active-chrono');
        listItem.classList.remove('paused', 'STOP');
        const pauseResumeButton = listItem.querySelector('.modal-button[onclick="pauseResumeChrono()"]');


            if (isPaused) {        
            const pauseDuration = new Date().getTime() - pauseStartTime;
            totalPauseDuration += pauseDuration; // Ajouter la durée de la pause à la durée totale
            startTime += pauseDuration;
            pauseStartTime = new Date().getTime();
            clearInterval(interval);
            listItem.classList.add('paused');
            pauseResumeButton.textContent = 'Reprendre';
            pauseResumeButton.style.backgroundColor = 'green';
            document.querySelector('.chrono-status').textContent = 'En pause';
            document.querySelector('.chrono-status').style.color = 'yellow';


}

        const currentTime = new Date().getTime();
        elapsedTime = currentTime - startTime ;
        displayTime(elapsedTime);
        interval = setInterval(updateChrono, 1000);




    } else {
        elapsedTime = 0;
        isPaused = false;
                startTime = new Date().getTime() - elapsedTime;
        pauseStartTime = 0;
        totalPauseDuration = 0;

 let interval;



        const listItem = document.querySelector('.active-chrono');
        listItem.classList.remove('paused', 'STOP');
        document.querySelector('.chrono-status').textContent = 'En cours';


        interval = setInterval(updateChrono, 1000);



            const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime
  
    };

    localStorage.setItem(lieu, JSON.stringify(chronoData));


               
    }


}


    function updateChrono() {
        if (!isPaused) {
            const currentTime = new Date().getTime();
            elapsedTime = currentTime - startTime;
            displayTime(elapsedTime);



        }
        
    }


interval = setInterval(updateChrono, 1000);



    // ... (votre code existant)

    function pauseResumeChrono() {
        const listItem = document.querySelector('.active-chrono');
        const pauseResumeButton = listItem.querySelector('.modal-button[onclick="pauseResumeChrono()"]');

        if (!isPaused) {
            isPaused = true;
            listItem.classList.add('paused');


            pauseStartTime = new Date().getTime();
            clearInterval(interval);

            const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime
 
    };

    localStorage.setItem(lieu, JSON.stringify(chronoData));

     


            // Modifier le bouton pour afficher "Reprendre"
            pauseResumeButton.textContent = 'Reprendre';
            pauseResumeButton.style.backgroundColor = 'green';
            document.querySelector('.chrono-status').textContent = 'En pause';
            document.querySelector('.chrono-status').style.color = 'yellow';

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



            const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime

    };

    localStorage.setItem(lieu, JSON.stringify(chronoData));

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


            const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime

    };

    localStorage.setItem(lieu, JSON.stringify(chronoData));



        listItem.classList.add('STOP');

        document.querySelector('.chrono-status').textContent = 'Fini';
        document.querySelector('.chrono-status').style.color = 'white';
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
                localStorage.removeItem(lieu);
            }, 100);
        }
    }
}


function cancelChrono() {
    // Afficher une boîte de dialogue de confirmation
    var confirmation = confirm("Voulez vous vraiment fermer le chrono ?");

    // Vérifier la réponse de l'utilisateur
    if (confirmation) {
        // Si l'utilisateur clique sur "OK", envoyer l'événement et supprimer l'élément localStorage
        sendEventToParent('fermer', lieu);
        localStorage.removeItem(lieu);

        // Afficher un message de validation

    } 
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



const zoneTexte = document.getElementById('zone-texte');

// Ajoutez un gestionnaire d'événements pour l'événement 'input'
zoneTexte.addEventListener('input', function() {
    // Mettez à jour la propriété texteZone dans l'objet chronoData
                const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime

    };
    chronoData.texteZone = zoneTexte.value;

    // Mettez à jour les données dans le localStorage
    localStorage.setItem(lieu, JSON.stringify(chronoData));

});