

// Limiter le nombre de chunks stockés dans le localStorage
function cleanUpLocalStorage(maxChunks = 100) {
    const storedChunks = Object.keys(localStorage);
    if (storedChunks.length > maxChunks) {
        const excess = storedChunks.length - maxChunks;
        for (let i = 0; i < excess; i++) {
            const chunkKey = storedChunks[i];
            localStorage.removeItem(chunkKey);  // Supprimer les chunks les plus anciens
        }
    }
}

