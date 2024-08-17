function checkDateTimeInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlDateTime = urlParams.get('time');

    if (!urlDateTime) {
        alert("Pas de données de sécurité. Veuillez vous reconnecter.");
        window.location.href = '../log/index.html';
        return;
    }

    // Obtenez la date et l'heure actuelles de l'ordinateur
    const now = new Date();
    const currentDateTimeString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Comparer l'heure actuelle avec l'heure dans l'URL
    if (urlDateTime !== currentDateTimeString) {
        alert("Sécurité compromise. Veuillez vous reconnecter.");
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
                        ${data.interventionsList.map(intervention => `<p>${intervention}</p>`).join('')}
                    </div>
                `;
                userSection.appendChild(userDiv);

            } catch (error) {
                console.error(`Erreur lors de la récupération des interventions pour ${user.username}:`, error);
            }
        }
    }
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
            const result = await updateResponse.json();  // Assurez-vous de traiter la réponse JSON
            if (result.success) {
                feedback.textContent = 'Mot de passe modifié avec succès!';
                fetchUsers(); // Recharger les utilisateurs
            } else {
                feedback.textContent = result.error || 'Erreur lors de la modification du mot de passe.';
            }
        } else {
            throw new Error('La mise à jour du serveur a échoué');
        }
    } catch (error) {
        console.error('Erreur:', error);
        feedback.textContent = 'Erreur lors de la modification du mot de passe: ' + error.message;
    }
}

async function creerUtilisateur() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('createPassword').value; // Vous devriez envisager de hasher ce mot de passe côté serveur pour la sécurité
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
                feedback.textContent = 'Nouvel utilisateur créé avec succès!';
                fetchUsers(); // Mise à jour de la liste des utilisateurs
            } else {
                feedback.textContent = result.error || 'Erreur lors de la création de l’utilisateur.';
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
    // Appel AJAX pour générer et télécharger le fichier CSV consolidé
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "generer_interventions.php", true);
    xhr.responseType = "blob"; // Assurez-vous que la réponse est traitée comme un fichier binaire
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Récupère le nom de fichier à partir de l'en-tête Content-Disposition
            var disposition = xhr.getResponseHeader('Content-Disposition');
            var filename = "";
            if (disposition && disposition.indexOf('filename=') !== -1) {
                var matches = disposition.match(/filename="([^"]+)"/);
                if (matches != null && matches[1]) {
                    filename = matches[1];
                }
            } else {
                // Valeur par défaut si le nom n'est pas défini
                filename = "interventions_consolidées.csv";
            }

            var a = document.createElement('a');
            var url = window.URL.createObjectURL(xhr.response);
            a.href = url;
            a.download = filename; // Utiliser le nom de fichier récupéré
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert("Erreur lors de la génération du fichier.");
        }
    };
    xhr.onerror = function() {
        alert("Erreur réseau ou serveur non disponible.");
    };
    xhr.send();
}
