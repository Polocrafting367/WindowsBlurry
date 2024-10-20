document.addEventListener("DOMContentLoaded", function () {
    chargerLieuxPersonnalises();
    chargerLieux();
    afficherEnregistrements();

let restt = getPrefixedItem('currentTab');

setTimeout(function () {
    if (restt !== null && restt !== undefined && restt.trim() !== '') {
        openTab(restt);

    } 
}, 100);


    var savedTheme = getPrefixedItem('theme');

    // Si un thème est sauvegardé, appliquez-le
    if (savedTheme) {
               changerTheme(savedTheme);
    }


        const tabulValue = getPrefixedItem('TABUL');

    // Vérifier si "TABUL" est défini dans le localStorage
    if (tabulValue !== null) {
        // Mettre à jour l'état du switch en fonction de la valeur de "TABUL"
        const tabulSlider = document.getElementById('tabulSlider');
        tabulSlider.checked = tabulValue === 'true'; // Convertir la chaîne en booléen
    }
});


if (!getPrefixedItem('lieuxEnregistres')) {
    setPrefixedItem('lieuxEnregistres', JSON.stringify([]));
}

function closeMM() {
    const modal = document.getElementById('dataModal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("L'élément dataModal n'a pas été trouvé dans le DOM.");
    }
}


function afficherEnregistrements() {
    const enregistrementsDiv = document.getElementById('enregistrements');
    
    // Effacer le contenu existant
    enregistrementsDiv.innerHTML = '';

    const enregistrementsString = getPrefixedItem('enregistrements');

    try {
        let enregistrements = JSON.parse(enregistrementsString);

        // Regrouper les enregistrements par ID
        const enregistrementsGroupes = {};
        enregistrements.forEach(enregistrement => {
            if (!enregistrementsGroupes[enregistrement.id]) {
                enregistrementsGroupes[enregistrement.id] = [];
            }
            enregistrementsGroupes[enregistrement.id].push(enregistrement);
        });

        // Afficher les enregistrements groupés
        for (const [id, groupeEnregistrements] of Object.entries(enregistrementsGroupes)) {
            const groupeDiv = document.createElement('div');
            groupeDiv.className = 'groupe-enregistrements';
            groupeDiv.id = `groupe-${id}`;

            // Ajouter un titre ou une indication pour chaque groupe
            const titreGroupe = document.createElement('h3');
            groupeDiv.appendChild(titreGroupe);

            // Calculer le nombre de techniciens dans le groupe
            const techniciensDejaAjoutes = groupeEnregistrements.filter(enreg => enreg.Tech);

            // Afficher les interventions dans le groupe
            groupeEnregistrements.forEach((enregistrement, index) => {
                const enregistrementDiv = document.createElement('div');
                enregistrementDiv.className = "AFregis"; // Ajouter la classe à l'enregistrementDiv

                // Afficher la première intervention avec tous les détails
                if (index === 0) {
                    titreGroupe.textContent = `${enregistrement.zoneTexte1}`;

                    let enregistrementTexte = `${enregistrement.date} - ${enregistrement.zoneTexte2}`;
                    enregistrementDiv.textContent = enregistrementTexte;

                    // Afficher tous les techniciens sous l'intervention principale avec leur temps et un bouton "Supprimer"
                    techniciensDejaAjoutes.forEach((techEnregistrement) => {
                        const techDiv = document.createElement('div');
                        techDiv.style.display = 'flex';
                        techDiv.style.alignItems = 'center';

                        // Créer le bouton "Supprimer"
                        const boutonSupprimerTech = document.createElement('button');
                        boutonSupprimerTech.textContent = 'Supprimer';
                        boutonSupprimerTech.className = 'button-supprimer'; // Ajouter la classe de style
                        boutonSupprimerTech.style.marginRight = '10px'; // Ajouter une marge à droite pour séparer le bouton du texte
                        boutonSupprimerTech.addEventListener('click', () => {
                            const confirmation = window.confirm(`Êtes-vous sûr de vouloir supprimer le technicien ${techEnregistrement.Tech} ?`);
                            if (confirmation) {
                                const indexASupprimer = enregistrements.findIndex(e => comparerEnregistrements(e, techEnregistrement));
                                if (indexASupprimer !== -1) {
                                    enregistrements.splice(indexASupprimer, 1);
                                    setPrefixedItem('enregistrements', JSON.stringify(enregistrements));
                                    afficherEnregistrements();
                                }
                            }
                        });

                        // Ajouter le bouton avant le texte du technicien
                        techDiv.appendChild(boutonSupprimerTech);

                        // Créer le texte pour le temps et le nom du technicien
                        const techText = document.createElement('span');
                        techText.textContent = `${techEnregistrement.temps} - ${techEnregistrement.Tech}`;

                        // Ajouter le texte au conteneur
                        techDiv.appendChild(techText);

                        enregistrementDiv.appendChild(techDiv);
                    });

                    const boutonsDiv = document.createElement('div');
                    boutonsDiv.style.display = 'flex'; // Utiliser flexbox pour aligner les boutons sur une ligne

                    // Bouton "+ Tech." pour ajouter un technicien supplémentaire
                    const boutonAjouterTechnicien = document.createElement('button');
                    boutonAjouterTechnicien.textContent = '+ Tech.';
                    boutonAjouterTechnicien.className = 'button-tech'; // Ajouter la classe de style
                    boutonAjouterTechnicien.style.marginRight = '5px'; // Ajouter une marge à droite pour séparer les boutons
                    boutonAjouterTechnicien.addEventListener('click', () => {
                        const techniciensDejaAjoutes = groupeEnregistrements.map(enreg => enreg.Tech).filter(tech => tech);
                        afficherModalTechniciens(enregistrement, techniciensDejaAjoutes);
                    });

                    boutonsDiv.appendChild(boutonAjouterTechnicien);

                    // Afficher le bouton "Restaurer" uniquement s'il n'y a qu'un seul technicien
                    if (techniciensDejaAjoutes.length === 1) {
                        const boutonRestaurer = document.createElement('button');
                        boutonRestaurer.textContent = 'Restaurer';
                        boutonRestaurer.className = 'button-restaurer'; // Ajouter la classe de style
                        boutonRestaurer.style.marginRight = '5px'; // Ajouter une marge à droite pour séparer les boutons
                        boutonRestaurer.addEventListener('click', () => {
                            // Logique de restauration
                            relancer(
                                enregistrement.zoneTexte1,
                                enregistrement.temps,
                                enregistrement.zoneTexte2,
                                enregistrement.zoneTexte3,
                                enregistrement.zoneTexte4,
                                enregistrement.zoneTexte5,
                                enregistrement.zoneTexte6
                            );

                            // Supprimer automatiquement l'intervention après restauration
                            const indexASupprimer = enregistrements.findIndex(e => comparerEnregistrements(e, enregistrement));
                            if (indexASupprimer !== -1) {
                                enregistrements.splice(indexASupprimer, 1);
                                setPrefixedItem('enregistrements', JSON.stringify(enregistrements));
                                afficherEnregistrements();
                            }
                        });

                        boutonsDiv.appendChild(boutonRestaurer);
                    }

                    enregistrementDiv.appendChild(boutonsDiv);
                }

                groupeDiv.appendChild(enregistrementDiv);
            });

            enregistrementsDiv.appendChild(groupeDiv);
        }
    } catch (error) {
    }
}





function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}



function afficherModalTechniciens(enregistrement, techniciensExclus = []) {
    // Récupérer le nom de l'utilisateur dans l'URL (par exemple, "?user=NomUtilisateur")
    const urlParams = new URLSearchParams(window.location.search);
    const utilisateurExclu = urlParams.get('user');

    // Charger les techniciens depuis le fichier JSON
    fetch('../users.json')
        .then(response => response.json())
        .then(data => {
            // Créer et afficher la modal
            const modalDiv = document.createElement('div');
            modalDiv.className = 'modal';
            modalDiv.style.display = 'block'; // Afficher la modal
            modalDiv.innerHTML = `
                <div class="modal-content">
                    <span class="close-button" onclick="fermerModal(this)">&times;</span>
                    <h2>Sélectionnez un technicien supplémentaire</h2>
                    <label for="technicienSelect">Technicien :</label>
                    <select id="technicienSelect"></select>
                    
                    <h3>Temps passé</h3>
                    <div class="temps-selection">
                        <label for="joursSelect">J:</label>
                        <select id="joursSelect"></select>
                        <label for="heuresSelect">H:</label>
                        <select id="heuresSelect"></select>
                        <label for="minutesSelect">M:</label>
                        <select id="minutesSelect"></select>
                        <label for="secondesSelect">S:</label>
                        <select id="secondesSelect"></select>
                    </div>
                    
                    <button id="ajouterTechnicienButton">Ajouter</button>
                </div>
            `;

            // Remplir la liste déroulante avec les techniciens (exclure "Gestion", l'utilisateur de l'URL et les techniciens déjà ajoutés)
            const technicienSelect = modalDiv.querySelector('#technicienSelect');
            for (const [nom, hash] of Object.entries(data)) {
                if (nom !== "Gestion" &&  !techniciensExclus.includes(nom)) { // Exclure "Gestion", l'utilisateur et les techniciens déjà ajoutés
                    const option = document.createElement('option');
                    option.value = hash;
                    option.textContent = nom;
                    technicienSelect.appendChild(option);
                }
            }

            // Extraire les jours, heures, minutes et secondes du temps de l'enregistrement (ex : "5j 5h 32m 2s")
            const regexTemps = /(?:(\d+)j)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
            const match = regexTemps.exec(enregistrement.temps);

            let joursParDefaut = 0, heuresParDefaut = 0, minutesParDefaut = 0, secondesParDefaut = 0;
            if (match) {
                joursParDefaut = parseInt(match[1], 10) || 0; // Jours
                heuresParDefaut = parseInt(match[2], 10) || 0; // Heures
                minutesParDefaut = parseInt(match[3], 10) || 0; // Minutes
                secondesParDefaut = parseInt(match[4], 10) || 0; // Secondes
            }

            // Remplir la liste des jours avec la valeur par défaut
            const joursSelect = modalDiv.querySelector('#joursSelect');
            for (let i = 0; i <= 30; i++) { // Sélection de 0 à 30 jours
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === joursParDefaut) option.selected = true; // Sélectionner les jours par défaut
                joursSelect.appendChild(option);
            }

            // Remplir la liste des heures avec la valeur par défaut
            const heuresSelect = modalDiv.querySelector('#heuresSelect');
            for (let i = 0; i <= 23; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === heuresParDefaut) option.selected = true; // Sélectionner l'heure par défaut
                heuresSelect.appendChild(option);
            }

            // Remplir la liste des minutes avec la valeur par défaut
            const minutesSelect = modalDiv.querySelector('#minutesSelect');
            for (let i = 0; i < 60; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i.toString().padStart(2, '0'); // Ajouter un zéro au début si nécessaire
                if (i === minutesParDefaut) option.selected = true; // Sélectionner les minutes par défaut
                minutesSelect.appendChild(option);
            }

            // Remplir la liste des secondes avec la valeur par défaut
            const secondesSelect = modalDiv.querySelector('#secondesSelect');
            for (let i = 0; i < 60; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i.toString().padStart(2, '0'); // Ajouter un zéro au début si nécessaire
                if (i === secondesParDefaut) option.selected = true; // Sélectionner les secondes par défaut
                secondesSelect.appendChild(option);
            }

            // Gestionnaire pour le bouton "Ajouter"
            modalDiv.querySelector('#ajouterTechnicienButton').addEventListener('click', () => {
                const selectedTechnicianName = technicienSelect.options[technicienSelect.selectedIndex].text;
                const jours = parseInt(joursSelect.value, 10);
                const heures = parseInt(heuresSelect.value, 10);
                const minutes = parseInt(minutesSelect.value, 10);
                const secondes = parseInt(secondesSelect.value, 10);

                // Construire la chaîne de temps en omettant les parties à 0 sauf pour les secondes
                let nouveauTemps = '';
                if (jours > 0) {
                    nouveauTemps += `${jours}j `;
                }
                if (heures > 0 || nouveauTemps) { // Inclure les heures si elles sont non nulles ou si les jours sont déjà présents
                    nouveauTemps += `${heures}h `;
                }
                if (minutes > 0 || nouveauTemps) { // Inclure les minutes si elles sont non nulles ou si les jours ou les heures sont déjà présents
                    nouveauTemps += `${minutes}m `;
                }
                // Toujours inclure les secondes, même si elles sont égales à 0
                nouveauTemps += `${secondes}s`;

                // Créer la duplication de l'intervention avec l'ajout du technicien et du nouveau temps
                const newEnregistrement = {
                    ...enregistrement,
                    Tech: selectedTechnicianName, // Ajout du nom du technicien
                    temps: nouveauTemps.trim() // Remplacer l'ancien temps par le nouveau, en supprimant les espaces de fin
                };

                // Ajouter l'enregistrement dupliqué dans localStorage
                const enregistrementsString = getPrefixedItem('enregistrements');
                let enregistrements = JSON.parse(enregistrementsString) || [];
                enregistrements.push(newEnregistrement);
                setPrefixedItem('enregistrements', JSON.stringify(enregistrements));

                // Mettre à jour l'affichage
                afficherEnregistrements();

                // Fermer la modal
                fermerModal(modalDiv);
            });

            document.body.appendChild(modalDiv);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des techniciens:', error);
        });
}





function fermerModal(buttonElement) {
    // Remonter au parent ayant la classe 'modal'
    const modalElement = buttonElement.closest('.modal');
    
    if (modalElement && modalElement.parentNode) {
        modalElement.style.display = 'none';
        modalElement.parentNode.removeChild(modalElement); // Assurez-vous que modalElement est bien un enfant de son parent
    } 
}




function relancer(nomLieu, temps, liste1, liste2, Text1, Text2, arret) {


    // Ensuite, vous pouvez exécuter votre logique pour ouvrir l'iframe
    ouvrirIframe(nomLieu, temps, liste1, liste2, Text1, Text2, arret);
}



function creerFenetreModale(enregistrement) {
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal');


    return modalDiv;
}

function creerInputAvecLabel(labelText, inputType, valeurInitiale) {
    const label = document.createElement('label');
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = inputType;
    input.value = valeurInitiale;

    return { label, input };
}


function mettreAJourEnregistrement(enregistrement, date, temps, zoneTexte1, zoneTexte2, zoneTexte3) {
  

    // Récupérer le tableau d'enregistrements depuis le stockage local
    const enregistrementsString = getPrefixedItem('enregistrements');
    let enregistrements = JSON.parse(enregistrementsString);

    // Vérifier si enregistrements est défini
    if (!enregistrements) {
        enregistrements = [];
    }

    // Mettre à jour l'enregistrement spécifique dans le tableau
    const indexAUpdater = enregistrements.findIndex(e => comparerEnregistrements(e, enregistrement));

    if (indexAUpdater !== -1) {
        enregistrements[indexAUpdater].date = date;
        enregistrements[indexAUpdater].temps = temps;
        enregistrements[indexAUpdater].zoneTexte1 = zoneTexte1;
        enregistrements[indexAUpdater].zoneTexte2 = zoneTexte2;
        enregistrements[indexAUpdater].zoneTexte3 = zoneTexte3;


        // Réenregistrer le tableau mis à jour dans le stockage local
        setPrefixedItem('enregistrements', JSON.stringify(enregistrements));
      
    } 


}

function creerBoutonValider(callbackValider, callbackAnnuler) {
    const boutonValider = document.createElement('button');
    boutonValider.textContent = 'Valider';
    boutonValider.addEventListener('click', callbackValider);
    
    // Create Cancel button
    const boutonAnnuler = document.createElement('button');
    boutonAnnuler.textContent = 'Annuler';
    boutonAnnuler.addEventListener('click', callbackAnnuler);
    boutonAnnuler.id = 'dell';


   return { boutonValider, boutonAnnuler };
}



function mettreAJourAffichage() {

    afficherEnregistrements();
    
    var angleCouleur = getPrefixedItem('angleCouleur');;
    if (angleCouleur !== null) {
        changerCouleur(angleCouleur);
    }
}




function comparerEnregistrements(enregistrement1, enregistrement2) {
    return (
        enregistrement1.date === enregistrement2.date &&
        enregistrement1.temps === enregistrement2.temps &&
        enregistrement1.zoneTexte1 === enregistrement2.zoneTexte1 &&
        enregistrement1.zoneTexte2 === enregistrement2.zoneTexte2 &&
        enregistrement1.zoneTexte3 === enregistrement2.zoneTexte3
    );
}


function getCurrentTime() {
    // Implémentez ici la logique pour obtenir le temps actuel
    // Vous pouvez utiliser la classe Date de JavaScript ou une bibliothèque externe
    const now = new Date();
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`;
}

let timers = {};
let lieuxState = {};

let globalPauseState = false;

        function formatTime(time) {
    return time < 10 ? '0' + time : time;
}




function openTab(tabName) {
    const chronoButton = document.getElementById('ChronoButton');
    const currentAnnimValue = chronoButton.getAttribute('annim');
    const newAnnimValue = 'false';
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
  tabbuttons = document.getElementsByClassName("tab-button_u");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }
    // Afficher l'onglet sélectionné
    document.getElementById(tabName + "Tab").style.display = "block";

    // Ajouter la classe "active" au bouton correspondant
    document.getElementById(tabName + "Button").classList.add("active");

    // Stocker l'onglet actuel dans le localStorage
    setPrefixedItem('currentTab', tabName);

    // Appeler afficherEnregistrements si le tabName est "interventions"
    if (tabName === "interventions") {
        setTimeout(function () {
            afficherEnregistrements();
        }, 100);
    }
   if (tabName === "camera") {
        setTimeout(function () {
             startCamera();
        }, 100);
    }
     if (tabName !== "camera") {
        setTimeout(function () {
            stopCamera();
        }, 100);
    }
    var angleCouleur = getPrefixedItem('angleCouleur');
    if (angleCouleur !== null) {
        changerCouleur(angleCouleur);
    }
}


function ajouterLieu() {
    const nouveauLieuInput = document.getElementById('nouveauLieu');
    const nouveauLieu = nouveauLieuInput.value.trim();

    if (nouveauLieu !== '') {
        // Ajouter le nouveau lieu à localStorage
        const lieuxEnregistres = getPrefixedItem('lieuxEnregistres') || '';
        const nouveauxLieux = lieuxEnregistres + ',' + nouveauLieu;
        setPrefixedItem('lieuxEnregistres', nouveauxLieux);

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

    
    const lieuxEnregistres = getPrefixedItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

    const lieuxList = document.getElementById('lieux-list');

    for (const lieuEnregistre of lieuxEnregistresArray) {

        ajouterLieuEnHaut(lieuEnregistre);
        mettreAJourListeDeroulante(lieuEnregistre)
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



// Appeler cette fonction pour exporter vers le serveur
function exportServ() {
    exportInterventions('server');
}

// Appeler cette fonction pour télécharger localement
function exportToTxt() {
    exportInterventions('local');
}

// Fonction pour convertir les dates au format YYYYMMDD
function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const [day, month, year] = dateStr.split('/').map(part => part.padStart(2, '0'));
    return `${year}${month}${day}`;
}


function convertToHours(timeStr, applyMinTime = false) {
    if (!timeStr) return "0";
    
    // Regex pour capturer les heures (hh) et minutes (mm) sous la forme hh:mm
    const regex = /(\d{2}):(\d{2})/;
    const matches = timeStr.match(regex);

    let hours = 0;

    if (matches) {
        const hh = parseInt(matches[1], 10); // Extraction des heures
        const mm = parseInt(matches[2], 10); // Extraction des minutes
        
        // Conversion : heures + (minutes converties en fraction d'heure)
        hours = hh + (mm / 60);
    }

    // Si applyMinTime est vrai, on applique la règle du minimum de 1 minute
    if (applyMinTime) {
        const minHours = 1 / 60; // 1 minute = 1/60 d'heure
        return Math.max(hours, minHours).toFixed(3);
    }

    return hours.toFixed(3); // Pas de minimum appliqué
}

exportInterventions = function(exportType) {
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const enregistrementsString = getPrefixedItem('enregistrements');

    if (!enregistrementsString) {
        alert("Aucun enregistrement trouvé.");
        return;
    }

    let enregistrements;
    try {
        enregistrements = JSON.parse(enregistrementsString);
    } catch (e) {
        alert("Erreur lors du parsing des enregistrements.");
        return;
    }

    const url = new URL(window.location.href);
    const user = decodeURIComponent(url.searchParams.get('user')) || "Utilisateur inconnu";
    
    // Ajout d'un timestamp pour récupérer le fichier JSON de manière unique
    const timestamp = new Date().getTime();
    const jsonFileUrl = `user/${user}.json?timestamp=${timestamp}`;

    fetch(jsonFileUrl)
        .then(response => response.json())
        .then(jsonData => {
            // Traitement du JSON récupéré si nécessaire
            console.log("Données JSON récupérées :", jsonData);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération du fichier JSON :", error);
        });

    let csvContent = "Date intervention;Désignation machine;Type de panne;Cause;Résumé intervention;Durée arrêt (h);Personnel;Nombre d'heures;Heure de fin;\n";

    enregistrements.forEach(record => {
        if (record) {

            const dateIntervention = record.date ? formatDate(record.date) : "N/A";
            const designationMachine = record.zoneTexte1 || "N/A";
            const typeDePanne = record.zoneTexte4 || "N/A";
            const cause = record.zoneTexte5 || "N/A";
            const resumeIntervention = record.zoneTexte2 || "N/A";
            const dureeArret = record.zoneTexte6 ? convertToHours(record.zoneTexte6) : "0";
            const nombreHeures = record.temps ? convertToHours(record.temps, true) : "0"; 
            const HeurDébut = record.heureEnregistrement || "N/A";

            // Vérifier si l'enregistrement a un technicien spécifique
            const personnel = record.Tech ? record.Tech : user;

            // Construction de la ligne CSV
            csvContent += `${dateIntervention};${designationMachine};${typeDePanne};${cause};${resumeIntervention};${dureeArret};${personnel};${nombreHeures};${HeurDébut}\n`;
        }
    });

    const bom = "\uFEFF";
    const finalContent = bom + csvContent;

    if (exportType === 'server') {
        const formData = new FormData();
        formData.append("user", user);
        formData.append("csvContent", finalContent);

        fetch("save_interventions.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                removePrefixedItem('enregistrements');
                alert("Les interventions ont été enregistrées sur le serveur et supprimées localement.");
                location.reload();
            } else {
                alert("Erreur lors de l'enregistrement sur le serveur : " + data.error);
            }
        })
        .catch(error => {
            alert("Erreur lors de l'envoi au serveur.");
        });
    } else if (exportType === 'local') {
        const fileName = `${currentDate}_${user}_${enregistrements.length}_inter.csv`;
        const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
        const urlBlob = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


function supprimerLieu() {
    const lieuxDropdown = document.getElementById('lieuxDropdown');
    const selectedLieu = lieuxDropdown.value;

    if (selectedLieu) {
        // Ajoutez une confirmation avant de supprimer
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce lieu ?");
        
        if (confirmation) {
            // Supprimez l'élément sélectionné des cookies
            const lieuxEnregistres = getPrefixedItem('lieuxEnregistres') || '';
            
            // Convertir la chaîne en tableau en supprimant les espaces vides
            const lieuxEnregistresArray = lieuxEnregistres.split(',').filter(lieu => lieu.trim() !== '' && lieu !== "[]");

            const indexToRemove = lieuxEnregistresArray.indexOf(selectedLieu);

            if (indexToRemove !== -1) {
                lieuxEnregistresArray.splice(indexToRemove, 1);
                setPrefixedItem('lieuxEnregistres', lieuxEnregistresArray.join(','));

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


// Fonction pour basculer l'état du slider et mettre à jour le paramètre "TABUL"
function toggleTabul() {
    const tabulSlider = document.getElementById('tabulSlider');
    const tabulValue = tabulSlider.checked;


    setPrefixedItem('TABUL', tabulValue ? 'true' : 'false');
   
}



