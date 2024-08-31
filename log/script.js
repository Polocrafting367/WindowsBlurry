function checkDateTimeInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlDateTime = urlParams.get('time');

    if (!urlDateTime) {
        alert("Erreur, Merci de vous connecter.");
        window.location.href = '../log/index.html';
        return;
    }

    // Parse the URL dateTime
    const [datePart, timePart] = urlDateTime.split('_');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    // Créez un objet Date à partir de la date et l'heure de l'URL
    const urlDate = new Date(year, month - 1, day, hours, minutes, seconds);

    // Obtenez la date et l'heure actuelles de l'ordinateur
    const now = new Date();

    // Calculer la différence en millisecondes entre les deux dates
    const diffMs = Math.abs(now - urlDate);
    const diffMinutes = diffMs / (1000 * 60); // Convertir la différence en minutes

    // Vérifiez si la différence est supérieure à 1 minute
    if (diffMinutes > 1) {
        alert("Temps de connextion dépassé. Veuillez vous reconnecter.");
        window.location.href = '../log/index.html';
    }
}

// Appeler la fonction lors du chargement de la page
checkDateTimeInURL();


async function fetchUsers() {
    try {
        const response = await fetch('users.json');
        const data = await response.json();
        const users = Object.keys(data).map(key => ({
            username: key,
            password: data[key]
        }));
        displayUsers(users);
        populateUserSelect(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
}

async function displayUsers(users) {
    const userSection = document.getElementById('userSection');
    userSection.innerHTML = '';

    // Pour chaque utilisateur, nous allons vérifier s'il a des interventions
    for (let user of users) {
        if (user.username !== "Gestion") {
            try {
                const response = await fetch(`check_interventions.php?user=${user.username}`);
                const data = await response.json();

                // Ajouter la section utilisateur
                const userDiv = document.createElement('div');
                userDiv.className = 'user-window';
                userDiv.innerHTML = `
                    <h2>${user.username}</h2>
                    <p>${data.interventions} interventions depuis le dernier export</p>
                    <button onclick="toggleInterventions('${user.username}')">Voir interventions</button>
                    <div id="${user.username}-interventions" style="display:none;">
                        ${generateInterventionTable(data.interventionsList)}
                    </div>
                `;
                userSection.appendChild(userDiv);

            } catch (error) {
                console.error(`Erreur lors de la récupération des interventions pour ${user.username}:`, error);
            }
        }
    }
}

function generateInterventionTable(interventions) {
    if (!interventions || interventions.length === 0) {
        return '<p>Aucune intervention trouvée.</p>';
    }

    let tableHTML = `
        <table class="intervention-table">
            <thead>
                <tr>
                    <th>Date intervention</th>
                    <th>Désignation machine</th>
                    <th>Type de panne</th>
                    <th>Cause</th>
                    <th>Résumé intervention</th>
                    <th>Durée arrêt (h)</th>
                    <th>Personnel</th>
                    <th>Nombre d'heures</th>
                </tr>
            </thead>
            <tbody>
    `;

    interventions.forEach(intervention => {
        const cells = intervention.split(','); // Séparation par virgules
        tableHTML += '<tr>';
        cells.forEach(cell => {
            tableHTML += `<td>${cell.trim()}</td>`; // Suppression des espaces superflus
        });
        tableHTML += '</tr>';
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    return tableHTML;
}

function toggleInterventions(username) {
    const div = document.getElementById(`${username}-interventions`);
    div.style.display = div.style.display === 'none' ? 'block' : 'none';
}


function populateUserSelect(users) {
    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '';
    users.forEach(user => {
        if (user.username !== "Gestion") {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            userSelect.appendChild(option);
        }
    });
}

function populateUserSelect(users) {
    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '';
    users.forEach(user => {
        if (user.username !== "Gestion") {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            userSelect.appendChild(option);
        }
    });
}

async function modifierMotDePasse() {
    const confirmation = window.confirm("Modifier le mot de passe ?");
    if (!confirmation) return; // Annule l'action si l'utilisateur clique sur "Annuler"

    const username = document.getElementById('userSelect').value;
    const newPassword = document.getElementById('newPassword').value;
    const feedback = document.getElementById('feedback');

    try {
        const updateResponse = await fetch('manageUsers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'modify', username: username, password: newPassword })
        });

        if (updateResponse.ok) {
            const result = await updateResponse.json();
            if (result.success) {
                feedback.textContent = 'Mot de passe modifié!';
                fetchUsers(); // Recharger les utilisateurs
            } else {
                feedback.textContent = result.error || 'Erreur lors de la modification';
            }
        } else {
            throw new Error('La mise à jour du serveur a échoué');
        }
    } catch (error) {
        console.error('Erreur:', error);
        feedback.textContent = 'Erreur lors de la modification: ' + error.message;
    }
}


async function creerUtilisateur() {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir créer?");
    if (!confirmation) return; // Annule l'action si l'utilisateur clique sur "Annuler"

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('createPassword').value;
    const feedback = document.getElementById('feedback');

    try {
        const response = await fetch('manageUsers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create', username: username, password: password })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                feedback.textContent = 'Nouvel utilisateur créé !';
                fetchUsers(); // Mise à jour de la liste des utilisateurs
            } else {
                feedback.textContent = result.error || 'Erreur lors de la création.';
            }
        } else {
            throw new Error('Échec de la communication avec le serveur');
        }
    } catch (error) {
        console.error('Erreur:', error);
        feedback.textContent = 'Erreur lors de la création de l’utilisateur: ' + error.message;
    }
}

async function supprimerUtilisateur() {
      const confirmation = window.confirm("Vraiment supprimé ? cela n'efface pas les dernière inter et les archives");
    if (!confirmation) return; // Annule l'action si l'utilisateur clique sur "Annuler"

    const username = document.getElementById('userSelect').value;
    const feedback = document.getElementById('feedback');

    try {
        const response = await fetch('manageUsers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', username: username })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                feedback.textContent = 'Utilisateur supprimé avec succès!';
                fetchUsers(); // Mise à jour de la liste des utilisateurs
            } else {
                feedback.textContent = result.error || 'Erreur lors de la suppression de l’utilisateur.';
            }
        } else {
            throw new Error('Échec de la communication avec le serveur');
        }
    } catch (error) {
        console.error('Erreur:', error);
        feedback.textContent = 'Erreur lors de la suppression de l’utilisateur: ' + error.message;
    }
}


// Initialisation
fetchUsers();

function genererInterventions() {

     window.location.href = 'interventions.php'; // URL du script PHP
}
function genererInterventionstest() {

     window.location.href = 'interventionstest.php'; // URL du script PHP
}