      window.onload = function() {
            createIframe('bggene-content', 'illu', 'width: 99%; height: 99.5%;');
            createIframe('window2-content', 'BD', 'width: 99%; height: 99.5%;');
            createIframe('windowsett-if', 'LV.html', `height: calc(100% - 30px); width: 400px; transform: translateY(-15px);`);
            createIframe('window-content', 'Galerie.html', 'width: 99.5%; height: 99.5%;');
            trackVisit('INDEXpolocrafting')
        };



        // Fonction pour créer et insérer une iframe avec des styles personnalisés dans les conteneurs spécifiés
        function createIframe(containerClass, srcUrl, style) {
            const containers = document.getElementsByClassName(containerClass);
            Array.from(containers).forEach(container => {
                const iframe = document.createElement('iframe');
                iframe.src = srcUrl;
                iframe.className = 'transparent-iframe';
                iframe.style.cssText = style;
                container.appendChild(iframe);
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

if (textParam === "404") {
    // Mise à jour pour le titre et le message en cas d'erreur 404
    titleElement.textContent = "Erreur 404";
    messageElement.innerHTML = "Le Fichier est introuvable ou incorrect";
    
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


