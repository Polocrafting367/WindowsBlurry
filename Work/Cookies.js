

function supprimerTousLesCookies() {
    // Demandez une confirmation avant de supprimer tous les cookies
   const confirmation = window.confirm(
  "Êtes-vous sûr de vouloir supprimer tous les cookies ?\nLes interventions, lieux personnalisés, chronos en court seront supprimés"
);

    if (confirmation) {
        // Supprimez le cookie 'lieuxEnregistres'
        localStorage.removeItem('lieuxEnregistres');

        // Supprimez le cookie 'enregistrements'
        localStorage.removeItem('enregistrements');
        localStorage.removeItem('maListe');
 localStorage.removeItem('angleCouleur');

        localStorage.removeItem("cookieAccepted");

const chronosContainer = document.getElementById('chronosContainer');
parcourirArborescenceEtCreerIframes(arborescence, chronosContainer);

        const iframesImbriquées = document.querySelectorAll('iframe');

        for (let i = 0; i < iframesImbriquées.length; i++) {
            iframesImbriquées[i].contentWindow.postMessage('SupprimerCookie', '*');
        }

localStorage.removeItem('maListe');





        alert("Tous les cookies ont été supprimés");
        // Rafraîchissez la page ou mettez à jour l'affichage des enregistrements
        location.reload();

        // Affichez un message après la suppression des cookies

    }
}
function supprimerchronos() {


    const confirmation = window.confirm("Êtes-vous sûr de vouloir stopper tous les chronos?");

    if (confirmation) {
        const iframesImbriquées = document.querySelectorAll('iframe');

        for (let i = 0; i < iframesImbriquées.length; i++) {
            iframesImbriquées[i].contentWindow.postMessage('SupprimerCookie', '*');
        }

localStorage.removeItem('maListe');

        alert("Tous les chronos ont été stoppés");
        location.reload();
    }
}


function supprimerchronosHARD() {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir stopper tous les chronos?");

   if (confirmation) {
    
const chronosContainer = document.getElementById('chronosContainer');
parcourirArborescenceEtCreerIframes(arborescence, chronosContainer);

        const iframesImbriquées = document.querySelectorAll('iframe');

        for (let i = 0; i < iframesImbriquées.length; i++) {
            iframesImbriquées[i].contentWindow.postMessage('SupprimerCookie', '*');
        }

localStorage.removeItem('maListe');

        alert("Tous les chronos ont été stoppés");
        location.reload();

    }
}


function deleteCookies() {
    // Demander une confirmation avant de supprimer tous les enregistrements
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer tous les enregistrements ?");

    if (confirmation) {
        // Supprimer tous les enregistrements dans localStorage
        localStorage.removeItem('enregistrements');
        // Rafraîchir ou mettre à jour l'affichage des enregistrements


        alert("Tous les enregistrements ont été supprimés");

                location.reload();
    }
}



    function openWebsite() {
        var overlay = document.getElementById("overlay");
        var modal = document.getElementById("tutorialModal");

        // Ferme la modal et cache le fond gris semi-transparent
        overlay.style.display = "none";
        modal.style.display = "none";

        // Insérez ici le code pour rediriger vers le site web
    }

        function handleCookieChange() {
        var cookieCheckbox = document.getElementById("Cookies");
        var accessButton = document.getElementById("accessButton");
        var overlay = document.getElementById("overlay");
        var modal = document.getElementById("tutorialModal");

        // Enregistre l'état de la case à cocher dans le localStorage
        localStorage.setItem("cookieAccepted", cookieCheckbox.checked);

        // Active/désactive le bouton en fonction de l'état de la case à cocher
        if (cookieCheckbox.checked) {
            accessButton.classList.remove('disabled-button');
            accessButton.classList.add('green-button');
        } else {
            accessButton.classList.add('disabled-button');
            accessButton.classList.remove('green-button');
        }
    }