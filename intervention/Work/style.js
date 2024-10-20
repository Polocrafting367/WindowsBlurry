function getStoragePrefix() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    return username ? `${username}_` : '';
}
function setPrefixedItem(key, value) {
    const prefix = getStoragePrefix();
    localStorage.setItem(prefix + key, value);
}

function getPrefixedItem(key) {
    const prefix = getStoragePrefix();
    return localStorage.getItem(prefix + key);
}

function removePrefixedItem(key) {
    const prefix = getStoragePrefix();
    localStorage.removeItem(prefix + key);
    
}

let restt = getPrefixedItem('currentTab');


function changerTheme(theme) {
    var themeLink = document.getElementById('themeLink');
    themeLink.href = theme + '.css';

    // Vérifiez si le thème a changé par rapport à la valeur actuelle dans le stockage local
    if (theme !== getPrefixedItem('theme')) {
        // Mettez à jour le thème dans le stockage local
        setPrefixedItem('theme', theme);
        
        // Rechargez la page pour appliquer le nouveau thème
        location.reload(true);
    }

    var angleSauvegarde = getPrefixedItem('angleCouleur');
    if (angleSauvegarde !== null) {
        changerCouleur(angleSauvegarde);
                document.getElementById('colorSlider').value = angleSauvegarde;

    }



}
function changerCouleur(angle) {
    // Récupérer la luminosité depuis le stockage ou utiliser 50 par défaut
    var luminosite = getPrefixedItem('luminositeCouleur') || 50;

    // Convertir l'angle en couleur (HSL) en fonction de la luminosité
    var couleur = 'hsl(' + angle + ', 100%, ' + luminosite + '%)';

    // Enregistrer l'angle de couleur dans le stockage
    setPrefixedItem('angleCouleur', angle);

    // Mettre à jour immédiatement la couleur des boutons
    var luminositeButt = 'hsl(' + angle + ', 50%, ' + luminosite + '%)';
    var tousLesBoutons = document.querySelectorAll('button');
    var couleurTexteBoutons = luminosite < 75 ? '#fff' : '#000'; // Texte blanc si la luminosité est < 50, noir sinon

    tousLesBoutons.forEach(function(bouton) {
        bouton.style.backgroundColor = luminositeButt;
        bouton.style.color = couleurTexteBoutons; // Mettre à jour la couleur du texte des boutons
    });

    // Ajuster la couleur des tab-buttons immédiatement
    var luminositeFoncee = 'hsl(' + angle + ', 100%, ' + Math.max(luminosite - 30, 0) + '%)';
    var luminositeClaire = 'hsl(' + angle + ', 100%, ' + Math.max(luminosite - 10, 0) + '%)';
    var tabButtons = document.querySelectorAll('.tab-button, .tab-button_u');
    tabButtons.forEach(function(tabButton) {
        if (tabButton.classList.contains('active')) {
            tabButton.style.backgroundColor = luminositeClaire;
        } else {
            tabButton.style.backgroundColor = luminositeFoncee;
        }
    });

    // Mettre à jour la luminosité du background du body
    var bgLuminosite = Math.min(Math.max(luminosite, 0), 75); // Contrainte pour la luminosité entre 0 et 75
    var bodyBackgroundColor;

    if (bgLuminosite == 0) {
        bodyBackgroundColor = 'hsl(0, 0%, 15%)'; // Gris foncé si luminosité est à 0
    } else if (bgLuminosite >= 50) {
        bodyBackgroundColor = 'hsl(0, 0%, 100%)'; // Blanc si luminosité est à 75 ou plus
    } else {
        // Interpolation linéaire pour la luminosité du fond entre gris foncé et blanc
        var percentage = (bgLuminosite / 50) * 85 + 15; // Va de 15% à 100%
        bodyBackgroundColor = 'hsl(0, 0%, ' + percentage + '%)'; // Couleur grise progressive
    }

    document.body.style.backgroundColor = bodyBackgroundColor;

    // Convertir la couleur HSL en RGB pour d'autres éléments si nécessaire
    var tempElement = document.createElement('div');
    tempElement.style.color = couleur;
    document.body.appendChild(tempElement);
    var rgbColor = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);

    // Ajouter l'opacité à la couleur RGB
    var couleurAvecTransparence = 'rgba' + rgbColor.substring(3, rgbColor.length - 1) + ', 0.4)';

    // Mettre à jour la couleur du conteneur avec transparence
    var containers = document.querySelectorAll('.container');
    containers.forEach(function(container) {
        container.style.backgroundColor = couleurAvecTransparence;
    });

    // Ajuster la couleur du texte en fonction de la luminosité
    var couleurTexte = luminosite < 50 ? '#fff' : '#000'; // Texte blanc si la luminosité est basse, noir si élevée
    document.body.style.color = couleurTexte;
}



function changerCouleurAvecLuminosite() {
    var angle = getPrefixedItem('angleCouleur') || 0;
    
    // Récupérer la luminosité actuelle du slider
    var luminosite = document.getElementById('sliderLuminosite').value;

    // Enregistrer la luminosité dans le stockage
    setPrefixedItem('luminositeCouleur', luminosite);

    // Appliquer les changements de couleur en fonction de l'angle et de la luminosité
    changerCouleur(angle);
}


     function supprimerCouleurs() {
                    removePrefixedItem('angleCouleur');
                                        removePrefixedItem('luminositeCouleur');

location.reload(true);

        }

    function loadPageInIframe(url) {
        var iframeContainer = document.getElementById("iframeContainer");
        iframeContainer.innerHTML = '<iframe id="TUTORIEL" src="' + url + '"></iframe>';
    }
    // Fonction pour gérer le changement d'état du bouton de cookie


    // Fonction pour ouvrir le site web


// Vérifie si c'est la première visite
function checkFirstVisit() {
    const firstVisit = getPrefixedItem('premiereVisite');
    if (!firstVisit) {
        // Si la première visite n'est pas encore enregistrée, affiche la modal
        showModal();
    }
}

// Affiche la modal pour le tutoriel
function showModal() {
    loadPageInIframe("tuto/index.html"); // Charger la page du tutoriel dans l'iframe
    var overlay = document.getElementById("overlay");
    var modal = document.getElementById("tutorialModal");

    // Affiche le fond gris semi-transparent et la modal
    overlay.style.display = "block";
    modal.style.display = "block";
}

// Lorsque le bouton "Open Website" est cliqué
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

// Exécuter la vérification de première visite au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    checkFirstVisit(); // Vérifie et affiche la modal si nécessaire
});

    // Vérifie l'état de la case à cocher au chargement de la page
function toggleDeveloppeur() {
    var developpeurSection = document.getElementById('developpeur');
    var toggleButton = document.getElementById('toggleDeveloppeur');

    if (developpeurSection.style.display === "none") {
        developpeurSection.style.display = "block";
        toggleButton.textContent = "Masquer les obtions"; // Change le bouton pour indiquer "fermer"
    } else {
        developpeurSection.style.display = "none";
        toggleButton.textContent = "Afficher les obtions"; // Change le bouton pour indiquer "ouvrir"
    }
}
