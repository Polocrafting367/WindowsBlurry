function ouvrirIframe(nomLieu) {
    const iframe = document.createElement('iframe');
    
    // Concaténer le nom du lieu à l'URL
    iframe.src = `chrono.html?lieu=${nomLieu}`;

    const iframeContainer = document.getElementById(`iframe-container-${nomLieu}`);
    
    if (iframeContainer) {
        // Effacer le contenu existant
        iframeContainer.innerHTML = '';

        // Donner à l'élément parent la hauteur de 100%

        // Ajouter l'iframe à l'élément parent
        iframeContainer.appendChild(iframe);
    } else {
        console.error(`Le conteneur iframe-container-${nomLieu} n'a pas été trouvé.`);
    }
}
