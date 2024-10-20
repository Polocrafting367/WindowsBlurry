function loadTextures(texturePaths) {
    const loader = new THREE.TextureLoader();
    const textures = {};

    // Charger et configurer chaque texture automatiquement
    texturePaths.forEach((path) => {
        const textureName = path.split('/').pop().split('.')[0]; // Extraire le nom du fichier sans l'extension
        textures[textureName] = loader.load(path, function(texture) {
            texture.magFilter = THREE.NearestFilter; // Appliquer le filtrage pixelisé
            texture.minFilter = THREE.NearestFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            // Si c'est une texture avec transparence (comme 'leaf' ou 'seed'), activer la transparence
            if (textureName === 'leaf' || textureName === 'seed') {
                texture.transparent = true; // Activer la transparence
                texture.alphaTest = 0.5; // Définir un seuil alpha pour éviter les artefacts de transparence
            }
        });
    });

    return textures; // Retourner un objet contenant toutes les textures
}


// Exemple d'utilisation avec vos textures actuelles
const texturePaths = [
    'Textures/grass.png',   // Texture d'herbe (dessus)
    'Textures/dirt.png',    // Texture de terre (dessous)
    'Textures/grass1.png',  // Texture d'herbe pour les côtés
        'Textures/wood.png',    // Texture de terre (dessous)
    'Textures/leaf.png',  // Texture d'herbe pour les côtés
        'Textures/seed.png',  // Texture d'herbe pour les côtés
        'Textures/fleur.png',  // Texture d'herbe pour les côtés
        'Textures/stone.png',  // Texture d'herbe pour les côtés

];

const textures = loadTextures(texturePaths);

const grassTexture = textures.grass;
const dirtTexture = textures.dirt;
const grassSideTexture = textures.grass1;
const woodTexture = textures.wood;
const leafTexture = textures.leaf;
const seedTexture = textures.seed;
const fleurTexture = textures.fleur;
const stoneTexture = textures.stone;



