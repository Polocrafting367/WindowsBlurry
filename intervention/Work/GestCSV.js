function getUsernameFromUrl() {
    // Extraction de l'utilisateur à partir de l'URL et décodage des caractères encodés en URL (ex: %20 pour espace)
    const urlParams = new URLSearchParams(window.location.search);

    const user = urlParams.get('user');

    return user ? decodeURIComponent(user) : null; // Décodage des caractères encodés


}
function getinterFromUrl() {
    // Extraction de l'utilisateur à partir de l'URL et décodage des caractères encodés en URL (ex: %20 pour espace)
    const urlParams = new URLSearchParams(window.location.search);


        const inter = urlParams.get('inter');

    return inter ? decodeURIComponent(inter) : null; // Décodage des caractères encodés


}


function displayUsernameAndLogout() {
    const username = getUsernameFromUrl();
        const interAc = getinterFromUrl();

    if (username) {
        // Afficher le nom de l'utilisateur dans l'élément avec l'ID "user-info"
        document.getElementById('user-info').innerHTML = `
            <h3>Bienvenue, ${username}</h3>
        `;
    } else {

        openTab('interventions');

setTimeout(function() {
    document.getElementById('enregistrements').innerHTML = `
        <p>Une erreur s'est produite, merci de vous reconnecter.</p>
        <button onclick="window.location.href='../index.html'">Reconnecter</button>
    `;
    changerCouleur(0);
}, 300); // 1000 millisecondes = 1 seconde



        // Liste des éléments à supprimer
        const elementsToRemove = [
            ...document.getElementsByClassName('buttons-container'),
            ...document.getElementsByClassName('tab'),

            document.getElementById('creerTab'),
            document.getElementById('ChronoTab'),
            document.getElementById('parametresTab'),
            document.getElementById('tutorialModal'),
            document.querySelector("button[onclick='exportServ()']")
        ];

        // Parcourir et supprimer les éléments s'ils existent
        elementsToRemove.forEach(element => {

            if (element) element.remove();

        });

        // Ouvrir l'onglet 'parametres' et l'iframe 'Test'

        // Ajouter le message d'erreur et le bouton de déconnexion à la div 'enregistrements'

    }
             if (interAc) {
        // Afficher le nom de l'utilisateur dans l'élément avec l'ID "user-info"
           // Appel de la fonction ouvrirIframe avec la valeur extraite
        Restolieu(interAc);
setTimeout(function() {
    openTab('Chrono')
}, 100); 
setTimeout(function() {
    window.location.href = "index.html?&user=" + username
}, 200); 
    }
}

// Appeler cette fonction au chargement de la page
window.onload = function() {
    displayUsernameAndLogout();
};


function getInterventions() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    console.log(username);

    // Ajoutez un timestamp à l'URL pour éviter la mise en cache
    const url = `user/${username}.csv?timestamp=${new Date().getTime()}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                alert("Aucune donnée à afficher");
                throw new Error('Erreur lors du chargement du fichier CSV');
            }
            return response.text();
        })
        .then(data => {
            if (!data.trim()) {
                // Vérifie si le fichier est vide
                alert("Aucune donnée à afficher");
                return;
            }
            openNewTabWithTable(data);
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
}
     function openNewTabWithTable(data) {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

    // Construire le contenu HTML du tableau
    const rows = data.split('\n');
    let htmlContent = `<h1>Interventions de ${username}</h1><table>`;
    
    rows.forEach((row, index) => {
        const cols = row.split(';'); // Séparateur utilisé dans les données
        htmlContent += '<tr>';
        cols.forEach(col => {
            if (index === 0) {
                htmlContent += `<th>${col}</th>`;
            } else {
                htmlContent += `<td>${col}</td>`;
            }
        });
        htmlContent += '</tr>';
    });
    
    htmlContent += '</table>';

    // Récupérer l'élément modalContent
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) {
        console.error("L'élément modalContent n'a pas été trouvé dans le DOM.");
        return;
    }
    modalContent.innerHTML = htmlContent;

    // Afficher la modale
    const modal = document.getElementById('dataModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("L'élément dataModal n'a pas été trouvé dans le DOM.");
    }

    // Fermer la modale lorsque l'utilisateur clique sur "X"
    const closeModal = document.querySelector('.modal .close');
    if (closeModal) {
        closeModal.onclick = function() {
            modal.style.display = 'none';
        };
    }

    // Fermer la modale si l'utilisateur clique en dehors de celle-ci
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}



function ajouterInformationsSupplementaires(data) {
    // Récupérer le paramètre "user" depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user') || 'Utilisateur inconnu'; // Valeur par défaut si "user" n'est pas présent

    const parties = data.split('_').map(partie => partie.trim());
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


function convertToHours(timeStr) {
    if (!timeStr) return 0;
    
    // Regex pour capturer les heures et minutes
    const regex = /(\d{1,2}):(\d{2})/;
    const matches = timeStr.match(regex);

    if (matches) {
        const hh = parseInt(matches[1], 10); // Extraction des heures
        const mm = parseInt(matches[2], 10); // Extraction des minutes
        
        // Conversion : heures + (minutes converties en fraction d'heure)
        return hh + mm / 60;
    }

    return 0; // Si le format est invalide, on retourne 0
}


function convertToHourssnd(timeString) {
    // Variables pour stocker les valeurs extraites
    let days = 0, hours = 0, minutes = 0, seconds = 0;

    // Regex pour capturer les jours, heures, minutes et secondes (meilleure gestion des espaces)
    const regex = /(?:(\d+)j)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
    const match = timeString.match(regex);

    if (match) {
        // Si les valeurs existent, les convertir en nombres, sinon 0
        days = match[1] ? parseInt(match[1]) : 0;
        hours = match[2] ? parseInt(match[2]) : 0;
        minutes = match[3] ? parseInt(match[3]) : 0;
        seconds = match[4] ? parseInt(match[4]) : 0;
    }

    // Conversion en heures
    let totalHours = (days * 24) + hours + (minutes / 60) + (seconds / 3600);

    // Si le total est inférieur à 1 minute, on considère que c'est au moins 1 minute
    if (totalHours < 1 / 60) {
        totalHours = 1 / 60; // correspond à 1 minute, soit environ 0.0167 heures
    }

    return totalHours.toFixed(3); // Limite à 3 décimales pour l'affichage
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

    let csvContent = "Date intervention;Désignation machine;Type de panne;Cause;Résumé intervention;Durée arrêt (h);Personnel;Nombre d'heures;Heure de fin\n";

    enregistrements.forEach(record => {
        if (record) {

            const dateIntervention = record.date ? formatDate(record.date) : "N/A";
            const designationMachine = record.zoneTexte1 || "N/A";
            const typeDePanne = record.zoneTexte4 || "N/A";
            const cause = record.zoneTexte5 || "N/A";
            const resumeIntervention = record.zoneTexte2 || "N/A";
const dureeArret = record.zoneTexte6 ? convertToHours(record.zoneTexte6) : "N/A";
const nombreHeures = record.temps ? convertToHourssnd(record.temps) : "N/A"; 
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

function exportBRUTTxt() {
    // Récupérer l'enregistrement
    const enregistrements = getPrefixedItem('enregistrements');

    if (!enregistrements) {
        console.error('Aucun enregistrement trouvé');
        return;
    }

    // Conversion en JSON si ce n'est pas déjà fait
    const parsedEnregistrements = JSON.parse(enregistrements);

    // Transformer chaque enregistrement en une chaîne formatée
    const contenuFormate = parsedEnregistrements.map(enregistrement => {
        return `ID: ${enregistrement.id}\n` +
               `Date: ${enregistrement.date}\n` +
               `Temps: ${enregistrement.temps}\n` +
               `Lieu: ${enregistrement.zoneTexte1}\n` +
               `Résumé: ${enregistrement.zoneTexte2}\n` +
               `Pièce (non utilisé): ${enregistrement.zoneTexte3}\n` +
               `Type panne: ${enregistrement.zoneTexte4}\n` +
               `Cause panne: ${enregistrement.zoneTexte5}\n` +
               `Temps arrêts: ${enregistrement.zoneTexte6}\n` +
               `Technicien: ${enregistrement.Tech}\n` +
               `Heure d'Enregistrement: ${enregistrement.heureEnregistrement}\n` +
               `---------------------------------\n`; // Séparateur entre chaque enregistrement
    }).join("\n"); // Joindre tous les enregistrements avec une nouvelle ligne entre eux

    // Créer un Blob avec le contenu formaté
    const blob = new Blob([contenuFormate], { type: 'text/plain' });

    // Créer un lien temporaire pour télécharger le fichier
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enregistrements.txt'; // Nom du fichier
    document.body.appendChild(a);
    a.click();

    // Nettoyer le lien temporaire
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
