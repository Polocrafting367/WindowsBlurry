window.onload = async function () {
    // 1. Initialiser le fond et le message (Léger)
    displayTitleAndMessage();

    // 2. Séquence de chargement des fenêtres (Prioritaire -> Secondaire)
    // On attend un court instant après le fond pour laisser souffler le navigateur
    await new Promise(r => setTimeout(r, 100));

    // Priorité 1 : Fenêtre de Bienvenue
    await createIframe('windowsett-if', 'LV.html', `height: calc(100% - 30px); width: 400px; transform: translateY(15px);`);

    // Priorité 2 : Mes Projets
    await createIframe('window-content', 'Galerie.html', 'width: 99.5%; height: 99.5%;');

    // Priorité 3 : Paint Net (Gros morceau)
    await createIframe('bggene-content', '/MasterPaint/', 'width: 99.5%; height: 99.5%;');

    // Priorité 4 : Pointeuse
    await createIframe('window2-content', 'BD', 'width: 99%; height: 99.5%;');

    trackVisit('INDEXpolocrafting');
};

// Fonction pour créer et insérer une iframe avec des styles personnalisés avec retour de Promise
function createIframe(containerClass, srcUrl, style) {
    return new Promise((resolve) => {
        const containers = document.getElementsByClassName(containerClass);
        if (containers.length === 0) return resolve();

        let loadedCount = 0;
        Array.from(containers).forEach(container => {
            const iframe = document.createElement('iframe');
            iframe.src = srcUrl;
            iframe.className = 'transparent-iframe';
            iframe.style.cssText = style;

            // On résout après que l'iframe soit chargée
            iframe.onload = () => {
                loadedCount++;
                if (loadedCount === containers.length) resolve();
            };

            // Sécurité en cas d'erreur
            iframe.onerror = () => {
                loadedCount++;
                if (loadedCount === containers.length) resolve();
            };

            container.appendChild(iframe);
        });
    });
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
    bgg.style.position = 'absolute';
    bgg.style.top = '0';
    bgg.style.left = '0';
    bgg.style.width = '100%';
    bgg.style.height = '100%';
    bgg.style.zIndex = '-1';
    bgg.style.border = 'none';
    document.body.appendChild(bgg);
}
    const bodyElement = document.body;

if (textParam === "404" || textParam === "403" || textParam === "500") {
    // Mise à jour pour le titre et le message en cas d'erreur
    titleElement.textContent = repParam || ("Erreur " + textParam);
    if (textParam === "404") {
        messageElement.innerHTML = "Le Fichier est introuvable ou incorrect";
    } else if (textParam === "403") {
        messageElement.innerHTML = "Accès à cette ressource est interdit";
    } else {
        messageElement.innerHTML = "Une erreur serveur interne est survenue";
    }
    
    // Rendre le texte en gras
    titleElement.style.fontWeight = 'bold';
    messageElement.style.fontWeight = 'bold';
    
    messageElement.style.color = 'pink'; 
    messageElement.innerHTML += '<br>' + titleElement.textContent;
    bgg.src = 'bgE.html';


    // Changer le fond du body pour un dégradé rouge
} else if (textParam) {
    // Si textParam a une valeur autre que 404
    titleElement.textContent = repParam;
    messageElement.innerHTML = textParam;
    
    // Rendre le texte en gras
    titleElement.style.fontWeight = 'bold';
    messageElement.style.fontWeight = 'bold';
    
    messageElement.style.color = 'White'; 
    messageElement.innerHTML += '<br>' + titleElement.textContent;
    bgg.src = 'bgP.html';


    
} else {
    // Message de bienvenue par défaut
    titleElement.textContent = 'Trouvez en dessous mes projets.';
    messageElement.innerHTML = 'Bienvenue sur mon site !';
        
    // Rendre le texte en gras
    titleElement.style.fontWeight = 'bold';
    messageElement.style.fontWeight = 'bold';
    
    titleElement.style.color = 'white';
    bgg.src = 'bgOK.html';
    messageElement.innerHTML += '<br>' + titleElement.textContent;
}



}



        // Optionnel : Redimensionner automatiquement le canevas avec le redimensionnement de la fenêtre
        window.addEventListener('resize', resizeCanvas);

        function resizeCanvas() {
            const canvas = document.getElementById('defaultCanvas0');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Initial resize pour prendre tout l'écran
        resizeCanvas();
        displayTitleAndMessage();


// Retarder l'exécution de history.pushState de 1 seconde
setTimeout(() => {
    //history.pushState({}, '', '/');
}, 300); // 1000 ms = 1 seconde


