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
                        boutonSupprimerTech.textContent = '🗑️';
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
    const urlParams = new URLSearchParams(window.location.search);
    const utilisateurExclu = urlParams.get('user');

    fetch('../XbGv89Lm.json')
        .then(response => response.json())
        .then(data => {
            const modalDiv = document.createElement('div');
            modalDiv.className = 'modal';
            modalDiv.style.display = 'block';
            modalDiv.innerHTML = `
                <div class="modal-content">
                    <span class="close-button" onclick="fermerModal(this)">&times;</span>
                    <h2>Sélectionnez un technicien supplémentaire</h2>
                    <label for="technicienSelect">Technicien :</label>
                    <select id="technicienSelect"></select>
                    
                    <h3>Temps passé</h3>
                    <div class="temps-selection">
                        <label for="joursInput">Jours :</label>
                        <input type="number" id="joursInput" min="0" max="30" value="0">
                        <label for="tempsInput">&nbsp;&nbsp;&nbsp;Heure/Minute :</label>
                        <input type="time" id="tempsInput" min="00:00" max="23:59" value="00:01">
                    </div>
                    <br>
                    <button id="ajouterTechnicienButton">Ajouter</button>
                </div>
            `;

            const technicienSelect = modalDiv.querySelector('#technicienSelect');
            for (const [nom, hash] of Object.entries(data)) {
                if (nom !== "Gestion" && !techniciensExclus.includes(nom)) {
                    const option = document.createElement('option');
                    option.value = hash;
                    option.textContent = nom;
                    technicienSelect.appendChild(option);
                }
            }

            // Extraire les jours, heures, minutes et secondes depuis enregistrement.temps
            const regexTemps = /(?:(\d+)j)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
            const match = regexTemps.exec(enregistrement.temps);

            let joursParDefaut = 0, heuresParDefaut = 0, minutesParDefaut = 0;
            if (match) {
                joursParDefaut = parseInt(match[1], 10) || 0;
                heuresParDefaut = parseInt(match[2], 10) || 0;
                minutesParDefaut = parseInt(match[3], 10) || 0;
            }

            // Définir les valeurs par défaut pour les jours et le temps (heures:minutes)
            const joursInput = modalDiv.querySelector('#joursInput');
            const tempsInput = modalDiv.querySelector('#tempsInput');

            joursInput.value = joursParDefaut;
            tempsInput.value = `${heuresParDefaut.toString().padStart(2, '0')}:${minutesParDefaut.toString().padStart(2, '0')}`;

            modalDiv.querySelector('#ajouterTechnicienButton').addEventListener('click', () => {
                const selectedTechnicianName = technicienSelect.options[technicienSelect.selectedIndex].text;
                const jours = parseInt(joursInput.value, 10) || 0;
                const [heures, minutes] = tempsInput.value.split(':').map(Number);

                let nouveauTemps = '';
                if (jours > 0) nouveauTemps += `${jours}j `;
                if (heures > 0 || nouveauTemps) nouveauTemps += `${heures}h `;
                if (minutes > 0 || nouveauTemps) nouveauTemps += `${minutes}m`;
                if (!nouveauTemps) nouveauTemps = '0s';

                const newEnregistrement = {
                    ...enregistrement,
                    Tech: selectedTechnicianName,
                    temps: nouveauTemps.trim()
                };

                const enregistrementsString = getPrefixedItem('enregistrements');
                let enregistrements = JSON.parse(enregistrementsString) || [];
                enregistrements.push(newEnregistrement);
                setPrefixedItem('enregistrements', JSON.stringify(enregistrements));

                afficherEnregistrements();
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
