
function changerTheme(theme) {
    var themeLink = document.getElementById('themeLink');
    themeLink.href = theme + '.css';

    // Vérifiez si le thème a changé par rapport à la valeur actuelle dans le stockage local
    if (theme !== localStorage.getItem('theme')) {
        // Mettez à jour le thème dans le stockage local
        localStorage.setItem('theme', theme);
        
        // Rechargez la page pour appliquer le nouveau thème
        location.reload(true);
    }

    var angleSauvegarde = localStorage.getItem('angleCouleur');
    if (angleSauvegarde !== null) {
        changerCouleur(angleSauvegarde);
                document.getElementById('colorSlider').value = angleSauvegarde;

    }



}
function changerCouleur(angle) {
    // Convertir l'angle en couleur (HSL)
    var couleur = 'hsl(' + angle + ', 100%, 50%)';

    localStorage.setItem('angleCouleur', angle);

    // Convertir la couleur HSL en RGB
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

    // Mettre à jour la couleur des tab-buttons et de tous les boutons de la page
    var luminositeFoncee = 'hsl(' + angle + ', 100%, 20%)'; // Ajustez la luminosité pour le tab-button inactif (foncé)
    var luminositeClaire = 'hsl(' + angle + ', 100%, 40%)'; // Ajustez la luminosité pour le tab-button actif (clair)
var luminositeButt = 'hsl(' + angle + ', 50%, 50%)';

    var tousLesBoutons = document.querySelectorAll('button');
    tousLesBoutons.forEach(function(bouton) {
        bouton.style.backgroundColor = luminositeButt;
    });

    var tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(function(tabButton) {
        if (tabButton.classList.contains('active')) {
            tabButton.style.backgroundColor = luminositeClaire;
        } else {
            tabButton.style.backgroundColor = luminositeFoncee;
        }
    });
}


     function supprimerCouleurs() {
                    localStorage.removeItem('angleCouleur');
location.reload(true);

        }

    function loadPageInIframe(url) {
        var iframeContainer = document.getElementById("iframeContainer");
        iframeContainer.innerHTML = '<iframe id="TUTORIEL" src="' + url + '"></iframe>';
    }
    // Fonction pour gérer le changement d'état du bouton de cookie


    // Fonction pour ouvrir le site web


    // Fonction pour afficher la modal
    function showModal() {
                                loadPageInIframe("tuto.html");
        var overlay = document.getElementById("overlay");
        var modal = document.getElementById("tutorialModal");

        // Affiche le fond gris semi-transparent et la modal
        overlay.style.display = "block";
        modal.style.display = "block";
    }

    // Vérifie l'état de la case à cocher au chargement de la page
    document.addEventListener('DOMContentLoaded', function () {
        var cookieCheckbox = document.getElementById("Cookies");
        var accessButton = document.getElementById("accessButton");

        // Récupère l'état enregistré dans le localStorage
        var cookieAccepted = localStorage.getItem("cookieAccepted");

        // Initialise l'état de la case à cocher et le bouton en fonction du localStorage
        if (cookieAccepted === "true") {
            cookieCheckbox.checked = true;
            accessButton.classList.remove('disabled-button');
            accessButton.classList.add('green-button');
            openWebsite()


        }


    });
