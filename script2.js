/**
 * Script d'orchestration du Launcher Polocrafting
 * Optimisé pour le chargement en cascade et la suppression du scintillement.
 */

// On utilise DomContentLoaded pour un démarrage ultra-rapide sans attendre les images/assets
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // 1. Initialisation immédiate du fond et de l'état (Feedback instantané)
    displayTitleAndMessage();
    resizeCanvas();

    // 2. Chargement en "Cascade" (Staggered Parallel)
    staggeredLoad('windowsett-if', 'LV.html', `height: calc(100% - 30px); width: 400px; transform: translateY(15px);`, 50);
    staggeredLoad('window-content', 'Galerie.html', 'width: 99.5%; height: 99.5%;', 300);
    staggeredLoad('bggene-content', '/MasterPaint/', 'width: 99.5%; height: 99.5%;', 600);
    staggeredLoad('window2-content', 'BD', 'width: 99%; height: 99.5%;', 800);

    // Tracking
    setTimeout(() => trackVisit('INDEXpolocrafting'), 1000);

    // 3. Nettoyage de l'URL (Arrive après le début du chargement pour laisser le temps au JS de lire les params)
    setTimeout(() => {
        if (window.location.search) {
            // On remplace l'URL actuelle par l'URL sans paramètres pour rester propre
            history.replaceState(null, '', window.location.pathname);
            console.log("URL nettoyée avec succès.");
        }
    }, 1200);
}

/**
 * Charge une iframe après un certain délai sans bloquer le reste
 */
function staggeredLoad(containerClass, srcUrl, style, delay) {
    setTimeout(() => {
        const containers = document.getElementsByClassName(containerClass);
        Array.from(containers).forEach(container => {
            if (container.querySelector('iframe')) return; 

            const iframe = document.createElement('iframe');
            iframe.src = srcUrl;
            iframe.className = 'transparent-iframe';
            iframe.style.cssText = style;
            iframe.style.opacity = '0'; 
            iframe.style.transition = 'opacity 0.5s ease-in-out';
            
            iframe.onload = () => { iframe.style.opacity = '1'; };
            container.appendChild(iframe);
        });
    }, delay);
}

function displayTitleAndMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const textParam = urlParams.get('Text');
    const repParam = urlParams.get('Rep');
    const titleElement = document.getElementById('titrefn');
    const messageElement = document.getElementById('messagefn');
    
    let bgg = document.getElementById('backgg');

    if (!bgg) {
        bgg = document.createElement('iframe');
        bgg.id = 'backgg';
        bgg.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:-1; border:none; background: transparent;";
        document.body.appendChild(bgg);
    }

    if (textParam === "404" || textParam === "403" || textParam === "500") {
        titleElement.textContent = repParam || ("Erreur " + textParam);
        messageElement.innerHTML = getErrorMessage(textParam);
        titleElement.style.fontWeight = 'bold';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.color = 'pink'; 
        messageElement.innerHTML += '<br>' + titleElement.textContent;
        
        if (bgg.src !== window.location.origin + '/bgE.html') {
            bgg.src = 'bgE.html';
        }
    } else if (textParam) {
        titleElement.textContent = repParam;
        messageElement.innerHTML = textParam;
        titleElement.style.fontWeight = 'bold';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.color = 'White'; 
        messageElement.innerHTML += '<br>' + titleElement.textContent;
        bgg.src = 'bgP.html';
    } else {
        titleElement.textContent = 'Trouvez en dessous mes projets.';
        messageElement.innerHTML = 'Bienvenue sur mon site !';
        titleElement.style.fontWeight = 'bold';
        messageElement.style.fontWeight = 'bold';
        titleElement.style.color = 'white';
        bgg.src = 'bgOK.html';
        messageElement.innerHTML += '<br>' + titleElement.textContent;
    }
}

function getErrorMessage(code) {
    switch(code) {
        case "404": return "Le Fichier est introuvable ou incorrect";
        case "403": return "Accès à cette ressource est interdit";
        default: return "Une erreur serveur interne est survenue";
    }
}

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
    const canvas = document.getElementById('defaultCanvas0');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
resizeCanvas();
