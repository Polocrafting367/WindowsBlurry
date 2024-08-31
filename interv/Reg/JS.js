let securePasswords = {};

// Charger les utilisateurs depuis le fichier JSON
fetch('users.json')
  .then(response => response.json())
  .then(data => {
    securePasswords = data;

    // Remplir la liste déroulante avec les noms d'utilisateur
    const userSelect = document.getElementById('username');
    for (const username in securePasswords) {
      const option = document.createElement('option');
      option.value = username;
      option.textContent = username;
      userSelect.appendChild(option);
    }

    // Vérifier si un utilisateur est déjà "souvenu"
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser && securePasswords[rememberedUser]) {
      userSelect.value = rememberedUser;
      document.getElementById('password').value = localStorage.getItem('rememberedPassword');
      document.getElementById('remember').checked = true;
    }

    // Gérer le changement de sélection d'utilisateur
    handleUserChange();
  });

// Fonction pour calculer le hachage SHA-256 du mot de passe
function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

// Gérer la sélection d'un nouvel utilisateur
function handleUserChange() {
  const username = document.getElementById('username').value;
  const rememberCheckbox = document.getElementById('remember');

  if (username === 'Gestion') {
    // Désactiver la case à cocher pour l'utilisateur "Gestion"
    rememberCheckbox.checked = false;
    rememberCheckbox.disabled = true;
  } else {
    // Activer la case à cocher pour les autres utilisateurs
    rememberCheckbox.disabled = false;
  }
}

// Écouteur de changement pour la liste déroulante d'utilisateurs
document.getElementById('username').addEventListener('change', handleUserChange);

// Gérer la connexion
document.getElementById('loginBtn').addEventListener('click', function () {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Calcul du hachage du mot de passe saisi
  const hashedPassword = hashPassword(password);
  
  // Vérification des identifiants
  if (securePasswords[username] && securePasswords[username] === hashedPassword) {
    // Gérer "Se souvenir de moi"
    const remember = document.getElementById('remember').checked;
    if (remember && username !== 'Gestion') {
      localStorage.setItem('rememberedUser', username);
      localStorage.setItem('rememberedPassword', password);  // Stocker le mot de passe en clair pour la prochaine utilisation
    } else {
      localStorage.removeItem('rememberedUser');
      localStorage.removeItem('rememberedPassword');
    }

    // Redirection personnalisée en fonction de l'utilisateur
    if (username === 'Gestion') {
      const now = new Date();
      const dateTimeString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      // Encodez la chaîne de date/heure pour une utilisation dans une URL
      const encodedDateTime = encodeURIComponent(dateTimeString);

      // Rediriger vers l'URL avec la date/heure au lieu du nom d'utilisateur
      window.location.href = `/log/Gest.html?time=${encodedDateTime}`;
    } else {
      window.location.href = `/log/Work/index.html?user=${encodeURIComponent(username)}`;
    }
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect");
  }
});
