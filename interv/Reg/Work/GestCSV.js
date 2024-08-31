function getUsernameFromUrl() {
    // Extraction de l'utilisateur à partir de l'URL et décodage des caractères encodés en URL (ex: %20 pour espace)
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    return user ? decodeURIComponent(user) : null; // Décodage des caractères encodés
}

function getInterventions() {
    const username = getUsernameFromUrl();
    
    if (!username) {
        document.getElementById('enregistrements').innerText = 'Utilisateur non trouvé dans l\'URL.';
        return;
    }

    // Création du nom de fichier CSV en ajoutant ".csv" à l'utilisateur
    const csvUrl = `user/${username}.csv`;
    
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du fichier CSV.');
            }
            return response.text();
        })
        .then(csvData => {
            displayInterventions(csvData);
        })
        .catch(error => {
            document.getElementById('enregistrements').innerText = 'Erreur lors de la récupération des interventions.';
        });
}

function displayInterventions(csvData) {
    const container = document.getElementById('enregistrements');
    container.innerHTML = ''; // Nettoyer le conteneur

    const lines = csvData.split('\n');
    if (lines.length === 0 || lines[0].trim() === '') {
        container.innerText = 'Aucune intervention enregistrée.';
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.border = '1';

    const headerRow = document.createElement('tr');
    const headers = lines[0].split(';'); // Supposons que le séparateur soit ";"
    
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.innerText = headerText;
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    // Afficher chaque ligne du CSV
    for (let i = 1; i < lines.length; i++) {
        const row = document.createElement('tr');
        const cells = lines[i].split(';');

        if (cells.length !== headers.length) continue; // Sauter les lignes mal formées

        cells.forEach(cellText => {
            const cell = document.createElement('td');
            cell.innerText = cellText;
            row.appendChild(cell);
        });

        table.appendChild(row);
    }

    container.appendChild(table);
}


function ajouterInformationsSupplementaires(data) {
    // Récupérer le paramètre "user" depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user') || 'Utilisateur inconnu'; // Valeur par défaut si "user" n'est pas présent

    const parties = data.split('-').map(partie => partie.trim());
    const id = generateUniqueId();

    // Obtenir l'heure actuelle au format HH:mm:ss
    const maintenant = new Date();
    const heureEnregistrement = `${maintenant.getHours().toString().padStart(2, '0')}:${maintenant.getMinutes().toString().padStart(2, '0')}:${maintenant.getSeconds().toString().padStart(2, '0')}`;

    // Retourner l'objet avec toutes les informations, y compris "Tech" pour l'utilisateur et l'heure d'enregistrement
    return { 
        id, 
        date: parties[0], 
        temps: parties[1], 
        zoneTexte1: parties[2], 
        zoneTexte2: parties[3], 
        zoneTexte3: parties[4], 
        zoneTexte4: parties[5], 
        zoneTexte5: parties[6],  
        zoneTexte6: parties[7],
        Tech: user, // Ajouter l'utilisateur comme technicien
        heureEnregistrement // Ajouter l'heure d'enregistrement
    };
}



let searchActive = false; // Variable pour suivre l'état de la recherche

// Importez la bibliothèque "unorm" si elle n'est pas déjà incluse dans votre projet
// Exemple : <script src="https://unpkg.com/unorm@1.4.1"></script>

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}



let isChronosActif = true; // Variable pour suivre l'état actuel



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

    // Ajout du BOM UTF-8
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
                location.reload(); // Actualiser la page après envoi réussi au serveur
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

