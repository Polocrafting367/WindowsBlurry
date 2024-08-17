const typeInput = document.getElementById("typeInput");
const causeInput = document.getElementById("causeInput");
const typeList = document.getElementById("typeList");
const causeList = document.getElementById("causeList");

lieuData.types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    typeList.appendChild(option);
});

lieuData.causes.forEach(cause => {
    const option = document.createElement("option");
    option.value = cause;
    causeList.appendChild(option);
});

// Utiliser les valeurs de typeInput et causeInput dans le reste du code


var isPaused;
var startTime;
var pauseStartTime;
var totalPauseDuration;
var elapsedTime;
var interval; // Déclarer interval au niveau global


const tempsArretsInput = document.getElementById("tempsArretsInput");

// Ajouter un gestionnaire d'événements pour détecter les modifications de la valeur
tempsArretsInput.addEventListener('input', function() {
    // Mettre à jour la valeur du temps d'arrêt dans le localStorage
    updateLocalStorage();
});



var lieu = getURLParameter('lieu');

    const temps = getURLParameter('temps');


// Utiliser la variable "lieu" comme nécessaire dans votre code



 document.addEventListener('DOMContentLoaded', init);

 function init() {
    // Récupérer le temps de l'URL


    // Vérifier s'il y a des données dans le localStorage
    const savedData = localStorage.getItem(lieu);

    // Si des données sont présentes dans le localStorage
    if (savedData) {
      
        // Restaurer les données du chrono
        restoreChronoData(0);
    } else {
        

const temps = getURLParameter('temps');
const liste1 = getURLParameter('Text1');
const liste2 = getURLParameter('Text2');
const Text1 = getURLParameter('liste1');
const Text2 = getURLParameter('liste2');
const tempbox = getURLParameter('arret');


if (temps !== "") {

        const tempsActuel = new Date().getTime();
        elapsedTime = 0;
        isPaused = false;
        startTime = tempsActuel - convertirTempsEnMillisecondes(temps);
        pauseStartTime = 0;
        totalPauseDuration = 0;
        zoneTexte.value = Text1;
        zonePieces.value =Text2;
        typeDropdown.value = liste1;
        causeDropdown.value = liste2;
        tempsArretsInput.value = tempbox;

        // Créer l'objet chronoData avec les valeurs initiales
        const chronoData = {
            isPaused: isPaused,
            startTime: startTime,
            pauseStartTime: pauseStartTime,
            totalPauseDuration: totalPauseDuration,
            elapsedTime: elapsedTime,
            texteZone: zoneTexte.value,
            piecesSortie: zonePieces.value,
            type: typeDropdown.value,
            cause: causeDropdown.value,
            arret: tempsArretsInput.value 
        };

        // Enregistrer les données du chrono dans le localStorage
        localStorage.setItem(lieu, JSON.stringify(chronoData));

} else {



            const tempsActuel = new Date().getTime();
        elapsedTime = 0;
        isPaused = false;
        startTime = tempsActuel;
        pauseStartTime = 0;
        totalPauseDuration = 0;
        zoneTexte.value = '';
        zonePieces.value = '';

        // Créer l'objet chronoData avec les valeurs initiales
        const chronoData = {
            isPaused: isPaused,
            startTime: startTime,
            pauseStartTime: pauseStartTime,
            totalPauseDuration: totalPauseDuration,
            elapsedTime: elapsedTime,
            texteZone: '',
            piecesSortie: '',
            type: '',
            cause: '',
            arret: ''
        };

        // Enregistrer les données du chrono dans le localStorage
        localStorage.setItem(lieu, JSON.stringify(chronoData));
}

        // Si aucun temps n'est présent dans l'URL, initialiser les données du chrono avec les valeurs de l'URL

    }
}



function convertirTempsEnMillisecondes(temps) {
    const regex = /(\d+)([jhrsm])/g;
    let match;
    let tempsEnMillisecondes = 0;

    while ((match = regex.exec(temps)) !== null) {
        const valeur = parseInt(match[1], 10);
        const unite = match[2];

        switch (unite) {
            case 'j':
                tempsEnMillisecondes += valeur * 24 * 60 * 60 * 1000;
                break;
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



function restoreChronoData(differenceTemps) {
   

    // Récupérer les données du localStorage
    var savedData = localStorage.getItem(lieu);

    // Récupérer les valeurs des paramètres de l'URL
    const tempsURL = getURLParameter('temps');
    const liste1URL = getURLParameter('liste1');
    const liste2URL = getURLParameter('liste2');
    const Text1URL = getURLParameter('Text1');
    const Text2URL = getURLParameter('Text2');
    const arretURL = getURLParameter('arret');

    if (savedData || differenceTemps) {
        // Parser les données JSON
        var chronoData = JSON.parse(savedData);

        if (chronoData) {

            // Restaurer les variables du chrono à partir du localStorage
            isPaused = chronoData.isPaused;
            startTime = chronoData.startTime;
            pauseStartTime = chronoData.pauseStartTime;
            totalPauseDuration = chronoData.totalPauseDuration;
            elapsedTime = chronoData.elapsedTime;

            var zoneTexte = document.getElementById('zone-texte');
            if (chronoData.texteZone) {
                zoneTexte.value = chronoData.texteZone;
            }

            var zonePieces = document.getElementById('zone-pieces');
            if (chronoData.piecesSortie) {
                zonePieces.value = chronoData.piecesSortie;
            }

            var typeDropdown = document.getElementById("typeDropdown");
            var causeDropdown = document.getElementById("causeDropdown");
            const tempsArretsInput = document.getElementById("tempsArretsInput");
            if (chronoData.type) {
                typeDropdown.value = chronoData.type;
            }

            if (chronoData.cause) {
                causeDropdown.value = chronoData.cause;
            }

            // Si des valeurs sont présentes dans l'URL, les utiliser pour restaurer les données du chrono
            if (tempsURL !== '') {
                elapsedTime = convertirTempsEnMillisecondes(tempsURL);
                startTime = new Date().getTime() - elapsedTime;
                displayTime(elapsedTime);
            }

            if (!isPaused) {
                const currentTime = new Date().getTime();
                elapsedTime = currentTime - startTime;
                displayTime(elapsedTime);
            }

            if (liste1URL) {
                typeDropdown.value = liste1URL;
            }

            if (liste2URL) {
                causeDropdown.value = liste2URL;
            }

            if (Text1URL) {
                zoneTexte.value = Text1URL;
            }

            if (Text2URL) {
                zonePieces.value = Text2URL;
            }
            
 
   if (chronoData.arret) {
                tempsArretsInput.value = chronoData.arret;
            }

    localStorage.setItem(lieu, JSON.stringify(chronoData));
            // Si le chrono est en pause, mettre à jour l'affichage en conséquence
            if (isPaused) {
                var currentTime = new Date().getTime();
                var pauseDuration = currentTime - pauseStartTime;
                totalPauseDuration += pauseDuration;
                startTime += pauseDuration;
                pauseStartTime = currentTime;
                clearInterval(interval);
                var listItem = document.querySelector('.active-chrono');
                listItem.classList.add('paused');
                var pauseResumeButton = listItem.querySelector('.modal-button[onclick="pauseResumeChrono()"]');
                pauseResumeButton.textContent = 'Reprendre';
                pauseResumeButton.style.backgroundColor = 'green';
                document.querySelector('.chrono-status').textContent = 'En pause';
                document.querySelector('.chrono-status').style.color = 'yellow';
                displayTime(elapsedTime);
            } 
        }
    } else {
        // Si aucune donnée n'est présente dans le localStorage et aucune valeur n'est présente dans l'URL,
        // initialiser les données du chrono avec les valeurs de l'URL
        const tempsActuel = new Date().getTime();
        elapsedTime = 0;
        isPaused = false;
        startTime = tempsActuel;
        pauseStartTime = 0;
        totalPauseDuration = 0; // Initialiser la durée totale de pause à 0

        // Récupérer les données du localStorage
        const savedData = localStorage.getItem(lieu);

        // Si aucune donnée n'est présente dans le localStorage et aucune valeur n'est présente dans l'URL,
        // initialiser les données du chrono avec les valeurs de l'URL
        if (!savedData && temps === '') {
            // Initialiser les données du chrono avec les valeurs de l'URL
            zoneTexte.value = '';
            zonePieces.value = '';
            typeDropdown.value = '';
            causeDropdown.value = '';
            tempsArretsInput.value = '';
        }

        if (savedData) {
            // Restaurer les données du chrono
            restoreChronoData(0);
        } else {
            // Si aucune donnée n'est présente dans le localStorage, initialiser les données du chrono avec les valeurs de l'URL

            if (tempsURL !== '') {
                const tempsActuel = new Date().getTime();
                elapsedTime = 0;
                isPaused = false;
                startTime = tempsActuel - convertirTempsEnMillisecondes(tempsURL);
                pauseStartTime = 0;
                totalPauseDuration = 0;
                zoneTexte.value = Text1URL;
                zonePieces.value = Text2URL;
                typeDropdown.value = liste1URL;
                causeDropdown.value = liste2URL;
                tempsArretsInput.value = arretURL;

                // Créer l'objet chronoData avec les valeurs initiales
                const chronoData = {
                    isPaused: isPaused,
                    startTime: startTime,
                    pauseStartTime: pauseStartTime,
                    totalPauseDuration: totalPauseDuration,
                    elapsedTime: elapsedTime,
                    texteZone: zoneTexte.value,
                    piecesSortie: zonePieces.value,
                    type: typeDropdown.value,
                    cause: causeDropdown.value,
                    arret: tempsArretsInput.value
                };

                // Enregistrer les données du chrono dans le localStorage
                localStorage.setItem(lieu, JSON.stringify(chronoData));
            } else {
                const tempsActuel = new Date().getTime();
                elapsedTime = 0;
                isPaused = false;
                startTime = tempsActuel;
                pauseStartTime = 0;
                totalPauseDuration = 0;
                zoneTexte.value = '';
                zonePieces.value = '';
                tempsArretsInput.value = '';

                // Créer l'objet chronoData avec les valeurs initiales
                const chronoData = {
                    isPaused: isPaused,
                    startTime: startTime,
                    pauseStartTime: pauseStartTime,
                    totalPauseDuration: totalPauseDuration,
                    elapsedTime: elapsedTime,
                    texteZone: '',
                    piecesSortie: '',
                    type: '',
                    cause: '',
                    arret: ''
                };

                // Enregistrer les données du chrono dans le localStorage
                localStorage.setItem(lieu, JSON.stringify(chronoData));
            }
        }
    }

    function convertirTempsEnMillisecondes(temps) {
        const regex = /(\d+)([jhrsm])/g;
        let match;
        let tempsEnMillisecondes = 0;

        while ((match = regex.exec(temps)) !== null) {
            const valeur = parseInt(match[1], 10);
            const unite = match[2];

            switch (unite) {
                case 'j':
                    tempsEnMillisecondes += valeur * 24 * 60 * 60 * 1000;
                    break;
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
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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


function pauseResumeChrono() {
    const listItem = document.querySelector('.active-chrono');
    const pauseResumeButton = listItem.querySelector('.modal-button[onclick="pauseResumeChrono()"]');
      const tempsArretInput = document.getElementById("tempsArretsInput");
    const tempsArretValue = tempsArretInput.value;


    if (!isPaused) {
        isPaused = true;
        listItem.classList.add('paused');
        pauseStartTime = new Date().getTime();
        clearInterval(interval);

        // Ajouter les valeurs de type et de cause
        const typeDropdown = document.getElementById("typeDropdown");
        const causeDropdown = document.getElementById("causeDropdown");
        const typeValue = typeDropdown.value;
        const causeValue = causeDropdown.value;
         const arretValue = tempsArretsInput.value;
    const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime,
        texteZone: zoneTexte.value,
        piecesSortie: zonePieces.value,
        type: typeValue,
        cause: causeValue,
        arret: arretValue
    };

        localStorage.setItem(lieu, JSON.stringify(chronoData));

        // Modifier le bouton pour afficher "Reprendre"
        pauseResumeButton.textContent = 'Reprendre';
        pauseResumeButton.style.backgroundColor = 'green';
        document.querySelector('.chrono-status').textContent = 'En pause';
        document.querySelector('.chrono-status').style.color = 'yellow';
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

        // Ajouter les valeurs de type et de cause
        const typeDropdown = document.getElementById("typeDropdown");
        const causeDropdown = document.getElementById("causeDropdown");
        const typeValue = typeDropdown.value;
        const causeValue = causeDropdown.value;
        const arretValue = tempsArretsInput.value;
    const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime,
        texteZone: zoneTexte.value,
        piecesSortie: zonePieces.value,
        type: typeValue,
        cause: causeValue,
         arret: arretValue
    };



        // Modifier le bouton pour afficher "Pause"
        pauseResumeButton.textContent = 'Pause';
        pauseResumeButton.style.backgroundColor = 'yellow';

        localStorage.setItem(lieu, JSON.stringify(chronoData));

        // Afficher un log
    }
}

function saveRecord() {
    const listItem = document.querySelector('.active-chrono');
    const pauseResumeButton = listItem.querySelector('.modal-button[onclick="pauseResumeChrono()"]');
    const tempsArretInput = document.getElementById("tempsArretsInput");
    const tempsArretValue = tempsArretInput.value;

    // Vérifier si la chronologie est en pause
    if (isPaused === false) {
        isPaused = true;
        pauseStartTime = new Date().getTime();
        clearInterval(interval);
    }

    // Récupérer les valeurs des listes déroulantes de type et de cause
    const typeValue = document.getElementById('typeDropdown').value;
    const causeValue = document.getElementById('causeDropdown').value;
    const arretValue = document.getElementById('tempsArretsInput').value;

    // Récupérer les valeurs des champs de texte
    const zoneTexteValue = zoneTexte.value.trim();
    const zonePiecesValue = zonePieces.value.trim();

    // Vérifier si les champs obligatoires sont renseignés
    if (zoneTexteValue === '' || typeValue.trim() === '' || causeValue.trim() === '') {
        // Afficher un message d'erreur et empêcher l'enregistrement
        alert('Veuillez remplir tous les champs obligatoires (Texte, Type, Cause) avant d\'enregistrer.');
        // Passer la chronologie en mode "paused"

        listItem.classList.add('STOP');
        document.querySelector('.chrono-status').textContent = 'Fini';
        document.querySelector('.chrono-status').style.color = 'white';
        pauseResumeButton.textContent = 'Reprendre';
        pauseResumeButton.style.backgroundColor = 'green';
        isPaused = true;
        pauseStartTime = new Date().getTime();
        clearInterval(interval);
        // Ajouter les valeurs de type et de cause
        const typeDropdown = document.getElementById("typeDropdown");
        const causeDropdown = document.getElementById("causeDropdown");
        const typeValue = typeDropdown.value;
        const causeValue = causeDropdown.value;
    const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime,
        texteZone: zoneTexte.value,
        piecesSortie: zonePieces.value,
        type: typeValue,
        cause: causeValue,
        arret: arretValue
    };

        localStorage.setItem(lieu, JSON.stringify(chronoData));
        return;
    }

    // Créer l'objet chronoData avec les données de la chronologie et les informations de type et de cause
    const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime,
        texteZone: zoneTexteValue,
        piecesSortie: zonePiecesValue,
        type: typeValue,
        cause: causeValue,
        arret: arretValue
    };

    localStorage.setItem(lieu, JSON.stringify(chronoData));

    // Marquer la chronologie comme STOP
    listItem.classList.add('STOP');
    document.querySelector('.chrono-status').textContent = 'Fini';
    document.querySelector('.chrono-status').style.color = 'white';
    pauseResumeButton.textContent = 'Reprendre';
    pauseResumeButton.style.backgroundColor = 'green';

    // Si les valeurs nécessaires sont renseignées, procéder à l'enregistrement
    const tempsAffiche = document.getElementById('chrono').textContent;
    const currentDate = new Date();

    const formattedDate = `${pad(currentDate.getDate())}/${pad(currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`;
    const enregistrement = `${formattedDate} - ${tempsAffiche} - ${lieu} - ${zoneTexteValue} - ${zonePiecesValue} - ${typeValue} - ${causeValue} - ${tempsArretValue}`;
    console.log(enregistrement);

    sendEventToParent('enregistrement', enregistrement);

    setTimeout(() => {
        sendEventToParent('fermer', lieu);
        localStorage.removeItem(lieu);

    }, 100);
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
// Variables globales pour stocker les valeurs des zones de texte et des listes déroulantes
let texteZoneValue = '';
let piecesSortieValue = '';
let typeValue = '';
let causeValue = '';
let arretValue = '';


// Fonction pour mettre à jour les données dans le localStorage avec les valeurs actuelles
function updateLocalStorage() {

    // Récupérer les valeurs actuelles des listes déroulantes
 typeValue = typeDropdown.value;
    causeValue = causeDropdown.value;
    texteZoneValue = zoneTexte.value;
    piecesSortieValue = zonePieces.value;
    const arretValue = tempsArretsInput.value;


    const chronoData = {
        isPaused: isPaused,
        startTime: startTime,
        pauseStartTime: pauseStartTime,
        totalPauseDuration: totalPauseDuration,
        elapsedTime: elapsedTime,
        texteZone: texteZoneValue,
        piecesSortie: piecesSortieValue,
        type: typeValue,
        cause: causeValue,
        arret: arretValue // Ajouter la valeur de tempsArretsInput dans l'objet chronoData
    };

    localStorage.setItem(lieu, JSON.stringify(chronoData));
}


// Gestionnaire d'événements pour la première zone de texte (texteZone)
zoneTexte.addEventListener('input', function() {
    texteZoneValue = zoneTexte.value;
    updateLocalStorage();
});

// Gestionnaire d'événements pour la deuxième zone de texte (zonePieces)
zonePieces.addEventListener('input', function() {
    piecesSortieValue = zonePieces.value;
    updateLocalStorage();
});




// Fonction de validation pour vérifier si la valeur sélectionnée est encore présente dans les données
function validateDropdownSelection(dropdown, data) {
    const selectedValue = dropdown.value;
    if (!data.includes(selectedValue)) {
        // Si la valeur sélectionnée n'est plus dans les données, réinitialiser la sélection
        dropdown.value = '';
    }
}

// Exemple d'utilisation après chaque actualisation ou changement
window.addEventListener('load', function() {
    validateDropdownSelection(typeDropdown, lieuData.types);
    validateDropdownSelection(causeDropdown, lieuData.causes);
});

typeDropdown.addEventListener('change', function() {
    console.log("héo")
    typeValue = typeDropdown.value;
    updateLocalStorage();
    validateDropdownSelection(typeDropdown, lieuData.types); // Validation après changement
});

causeDropdown.addEventListener('change', function() {
    causeValue = causeDropdown.value;
    updateLocalStorage();
    validateDropdownSelection(causeDropdown, lieuData.causes); // Validation après changement
});
