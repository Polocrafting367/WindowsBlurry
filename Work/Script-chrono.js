var isPaused;
var startTime;
var pauseStartTime;
var totalPauseDuration;
var elapsedTime;
var interval; // Déclarer interval au niveau global


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




var lieu = getURLParameter('lieu');
var theme = getURLParameter('theme'); // Ajout de cette ligne pour récupérer le paramètre "theme"
    const temps = getURLParameter('temps');


// Utiliser la variable "lieu" comme nécessaire dans votre code



 document.addEventListener('DOMContentLoaded', init);
function init() {
    // Récupérer le temps de l'URL
    const temps = getURLParameter('temps');

    const Text1 = getURLParameter('Text1');
    const Text2 = getURLParameter('Text2');
    // Si un temps est présent dans l'URL
    if (temps) {
        // Convertir le temps en millisecondes
        const tempsEnMillisecondes = convertirTempsEnMillisecondes(temps);


        // Calculer la différence entre le temps actuel et le temps extrait
        const differenceTemps = new Date().getTime() - tempsEnMillisecondes;

        // Mettre à jour la variable `startTime` avec le résultat du calcul

        elapsedTime = 0;
        isPaused = false;
        startTime = differenceTemps;
        pauseStartTime = 0;
        totalPauseDuration = 0;

        zoneTexte.value = Text1;
        zonePieces.value = Text2;

        const chronoData = {
            isPaused: isPaused,
            startTime: startTime,
            pauseStartTime: pauseStartTime,
            totalPauseDuration: totalPauseDuration,
            elapsedTime: elapsedTime,
            texteZone: zoneTexte.value,  // Store the value, not the element
            piecesSortie: zonePieces.value,  // Store the value, not the element
        };

        localStorage.setItem(lieu, JSON.stringify(chronoData));

        restoreChronoData(differenceTemps);

    } else {
        // Restaurer les données du chrono sans ajustement de temps
        restoreChronoData(0);
    }
}


function convertirTempsEnMillisecondes(temps) {
    const regex = /(\d+)([hms])/g;
    let match;
    let tempsEnMillisecondes = 0;

    while ((match = regex.exec(temps)) !== null) {
        const valeur = parseInt(match[1], 10);
        const unite = match[2];

        switch (unite) {
            case 'h':
                tempsEnMillisecondes += valeur * 60 * 60 * 1000;
                break;
            case 'm':
                tempsEnMillisecondes += valeur * 60 * 1000;
                break;
            case 's':
                tempsEnMillisecondes += valeur * 1000;
                break;
            default:
                // Ignorer les unités inconnues
                break;
        }
    }

    return tempsEnMillisecondes;

}


function getURLParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
    function changerTheme(st) {
        // Obtenez l'élément link avec l'id "themeLink"
        var themeLink = document.getElementById('themeLink');

        // Modifiez l'attribut href pour charger le fichier CSS du thème sélectionné
        themeLink.href = st + '.css';
    }


function restoreChronoData(differenceTemps)  {

theme = theme + '-chrono';


    changerTheme(theme);
    // Récupérer les données du localStorage
    const savedData = localStorage.getItem(lieu);


    if (savedData || differenceTemps) {
        // Parser les données JSON
        const chronoData = JSON.parse(savedData);

        

if (chronoData ) {
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

        const zonePieces = document.getElementById('zone-pieces');
        if (chronoData.piecesSortie) {
            zonePieces.value = chronoData.piecesSortie;
        }
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
    
    // Vérifier si la chronologie est en pause
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
        elapsedTime: elapsedTime,
        texteZone: zoneTexte.value,
        piecesSortie: zonePieces,
    };

    localStorage.setItem(lieu, JSON.stringify(chronoData));

    // Marquer la chronologie comme STOP
    listItem.classList.add('STOP');
    document.querySelector('.chrono-status').textContent = 'Fini';
    document.querySelector('.chrono-status').style.color = 'white';
    pauseResumeButton.textContent = 'Reprendre';
    pauseResumeButton.style.backgroundColor = 'green';

    // Vérifier si la première zone de texte est vide
    if (zoneTexte.value.trim() === '') {
        alert('Veuillez saisir quelque chose avant d\'enregistrer.');
        return;
    }

    const confirmation = window.confirm('Voulez-vous vraiment enregistrer et supprimer cet enregistrement ?');
    if (confirmation) {
        const tempsAffiche = document.getElementById('chrono').textContent;
        const currentDate = new Date();

        const formattedDate = `${pad(currentDate.getDate())}/${pad(currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`;
        const enregistrement = `${formattedDate} - ${tempsAffiche} - ${lieu} - ${zoneTexte.value.trim()} - ${zonePieces.value.trim()}`;

        sendEventToParent('enregistrement', enregistrement);

        setTimeout(() => {
            sendEventToParent('fermer', lieu);
            localStorage.removeItem(lieu);
        }, 100);
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
    const days = Math.floor(hours / 24);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;

    let formattedTime = '';

    if (days > 0) {
        formattedTime += `${days}j `;
    }
    if (remainingHours > 0 || days > 0) {
        formattedTime += `${pad(remainingHours)}h `;
    }
    if (remainingMinutes > 0 || remainingHours > 0 || days > 0) {
        formattedTime += `${pad(remainingMinutes)}m `;
    }
    if (remainingSeconds > 0 || remainingMinutes > 0 || remainingHours > 0 || days > 0) {
        formattedTime += `${pad(remainingSeconds)}s `;
    }
    if (milliseconds < 1000) {
        formattedTime += `${milliseconds}ms`;
    }

    document.getElementById('chrono').textContent = formattedTime.trim();
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
const zonePieces = document.getElementById('zone-pieces');
let piecesSortie; // Déclaration de piecesSortie au niveau global

// Ajoutez un gestionnaire d'événements pour l'événement 'input' pour la première zone de texte
zoneTexte.addEventListener('input', function() {
    // Mettez à jour la propriété texteZone dans l'objet chronoData
    const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime,
        texteZone: zoneTexte.value,
        piecesSortie: piecesSortie
    };

    // Mettez à jour les données dans le localStorage
    localStorage.setItem(lieu, JSON.stringify(chronoData));
});

// Ajoutez un gestionnaire d'événements pour l'événement 'input' pour la deuxième zone de texte
zonePieces.addEventListener('input', function() {
    // Mettez à jour la propriété piecesSortie dans l'objet chronoData
    piecesSortie = zonePieces.value; // Définissez piecesSortie avec la valeur de la deuxième zone de texte
    const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime,
        piecesSortie: piecesSortie,
        texteZone: zoneTexte.value
    };

    // Mettez à jour les données dans le localStorage
    localStorage.setItem(lieu, JSON.stringify(chronoData));
});
