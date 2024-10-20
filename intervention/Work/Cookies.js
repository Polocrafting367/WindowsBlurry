function supprimerTousLesCookies() {
        const username = getUsernameFromURL(); // Récupérer le nom d'utilisateur depuis l'URL

    const confirmation = window.confirm(
        "Êtes-vous sûr de vouloir supprimer tous les cookies pour l'utilisateur : \n" +username
    );

    if (confirmation) {
        const cookiesToDelete = [
            'lieuxEnregistres', 'angleCouleur', 'luminositeCouleur',
            'theme', 'enregistrements', 'maListe', 'premiereVisite',
            'cookieAccepted', 'AUTOUSER', 'TABUL'
        ];

        localStorage.removeItem('rememberedUser');
                localStorage.removeItem('rememberedPassword');

        cookiesToDelete.forEach(cookie => removePrefixedItem(cookie));
        supprimerToutesLesDonnees(arborescence);
                alert("Tous les cookies ont été supprimer");



        window.location.href='../Log.html'; // Redirige vers la page de connexion
    
    }
}


document.getElementById('unregisterSW').addEventListener('click', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            alert('Service Worker désenregistré avec succès.');
            caches.keys().then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  return caches.delete(cacheName);
                })
              );
            }).then(() => {
              alert('Tous les caches ont été supprimés.');
            });
              const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }




          } else {
            alert('Échec du désenregistrement du Service Worker.');
          }
        });
      }
    }).catch((error) => {
      alert('Erreur lors de la récupération des Service Workers :', error);
    });
  } else {
    alert('une erreur et survenu')
}
});



// Fonction pour parcourir l'arborescence et supprimer les éléments localStorage avec le préfixe utilisateur+lieu
function supprimerToutesLesDonnees(arbre) {
    const username = getUsernameFromURL(); // Récupérer le nom d'utilisateur depuis l'URL
    parcourirEtSupprimer(arbre, username);
}

// Fonction pour parcourir récursivement l'arborescence et supprimer les données localStorage pour chaque lieu
function parcourirEtSupprimer(arbre, username) {
    for (const lieu in arbre) {
        const storageKey = `${lieu}`; // Générer la clé pour chaque lieu
        console.log(getPrefixedItem(storageKey));

        removePrefixedItem(storageKey); // Supprimer l'élément dans localStorage
        console.log(storageKey)
        if (Object.keys(arbre[lieu]).length > 0) {
            parcourirEtSupprimer(arbre[lieu], username); // Appel récursif pour les sous-lieux
        }
    }
}

// Fonction pour récupérer le nom d'utilisateur depuis l'URL
function getUsernameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('user');
}
// Fonction pour compter le nombre total d'iframes à créer dans l'arborescence




function openWebsite() {
    // Enregistre la première visite dans le localStorage pour éviter de réafficher la modal
    setPrefixedItem('premiereVisite', 'true');

    // Cache la modal
    var overlay = document.getElementById("overlay");
    var modal = document.getElementById("tutorialModal");
    overlay.style.display = "none";
    modal.style.display = "none";
    
    // Effectue la redirection ou autre action
    // window.location.href = 'url_du_site_web'; // Rediriger vers une autre page si nécessaire
}

        function handleCookieChange() {
        var cookieCheckbox = document.getElementById("Cookies");
        var accessButton = document.getElementById("accessButton");
        var overlay = document.getElementById("overlay");
        var modal = document.getElementById("tutorialModal");

        // Enregistre l'état de la case à cocher dans le localStorage
        setPrefixedItem("cookieAccepted", cookieCheckbox.checked);

        // Active/désactive le bouton en fonction de l'état de la case à cocher
        if (cookieCheckbox.checked) {
            accessButton.classList.remove('disabled-button');
            accessButton.classList.add('green-button');
        } else {
            accessButton.classList.add('disabled-button');
            accessButton.classList.remove('green-button');
        }
    }




