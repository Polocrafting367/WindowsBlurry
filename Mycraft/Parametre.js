let bordurecam = -1;
let anglecam = 75;
//vitesses
let speed = 100;        // Vitesse horizontale
let verticalSpeed = 10; // Vitesse verticale (ajustée à une valeur plus lente)

let isFalling = true;  // Indique si le joueur tombe
let playerHeight = 3;
let isJumping = false;
let jumpVelocity = 10; // La vitesse du saut
let gravity = 30;      // La gravité qui attire le joueur vers le sol
let velocityY = 0;     // Vitesse verticale (y) du joueur
let isOnGround = false; // Vérifier si le joueur est au sol
// Vitesse verticale (y) du joueur

// Paramètres du terrain
let closeDistance  = 1; 
let minGroundLevel = 1;  // Hauteur minimale de la terre sous chaque bloc d'herbe
let size = 0;  // Taille du terrain (par exemple, 100x100 blocs)
let scale = 30;  // Echelle du premier bruit (pour les petites variations)
let largeScale = 60;  // Echelle du second bruit (pour les grandes variations)
let maxHeight = 10;  // Hauteur maximale des collines pour le premier bruit
let largeHeightMultiplier = 2;  // Multiplicateur de hauteur du second bruit
let hauteurMonde = 15;  // Hauteur maximale des collines pour le premier bruit

// Chunks générés
let chunkSize = 10;
let chunkDistance = 2;  // Distance de visibilité des chunks (5 chunks autour du joueur)
let mediumDistance   = chunkSize * chunkDistance; 
const treeregularity = 200;  // Plus la valeur est grande, moins il y a d'arbres
const seedregularity = 20;  // Plus la valeur est grande, moins il y a d'arbres
const fleurregularity = 60;  // Plus la valeur est grande, moins il y a d'arbres

let isFlying = false;  // Indique si le joueur vole
let lastSpacePressTime = 0;  // Temps de la dernière pression sur Espace
const doubleTapThreshold = 300;  // Seuil de temps pour détecter un double-tap (300 ms)

document.addEventListener('mousedown', function (event) {
    if (controls.isLocked) {
        if (event.button === 0) {
            // Clic gauche - casser un bloc
            breakBlock();
        } else if (event.button === 2) {
            // Clic droit - poser un bloc
            placeBlock();
        }
    }
});


let onKeyDown = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':  // Espace pour sauter ou monter en vol
            const currentTime = performance.now();
            if (currentTime - lastSpacePressTime <= doubleTapThreshold) {
                // Double tap détecté, activer ou désactiver le vol
                isFlying = !isFlying;
                isFalling = !isFlying;  // Désactiver la gravité si on vole
                velocityY = 0;  // Réinitialiser la vitesse verticale
            } else if (!isFlying && isOnGround) {
                // Saut normal si le joueur est au sol et ne vole pas
                velocityY = jumpVelocity;
                isJumping = true;
                isOnGround = false;
            } else if (isFlying) {
                // Si on vole, appuyer sur Espace fait monter
                moveUp = true;
            }
            lastSpacePressTime = currentTime;
            break;
        case 'ShiftLeft':  // Shift gauche pour descendre en vol
            if (isFlying) {
                moveDown = true;  // Descendre si on vole
            }
            break;
    }
};

let onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
        case 'Space':  // Arrêter de monter en vol quand Espace est relâché
            if (isFlying) {
                moveUp = false;  // Arrêter de monter
            }
            break;
        case 'ShiftLeft':  // Arrêter de descendre quand Shift est relâché
            if (isFlying) {
                moveDown = false;  // Arrêter de descendre
            }
            break;
    }
};


// Obtenir les éléments du formulaire
let bordurecamInput = document.getElementById("bordurecam");
let anglecamInput = document.getElementById("anglecam");
let speedInput = document.getElementById("speed");
let verticalSpeedInput = document.getElementById("verticalSpeed");
let playerHeightInput = document.getElementById("playerHeight");
let jumpVelocityInput = document.getElementById("jumpVelocity");
let gravityInput = document.getElementById("gravity");
let chunkSizeInput = document.getElementById("chunkSize");
let chunkDistanceInput = document.getElementById("chunkDistance");


// Afficher les valeurs initiales dans le formulaire
document.getElementById("bordurecamValue").innerText = bordurecam;
document.getElementById("speedValue").innerText = speed;
document.getElementById("verticalSpeedValue").innerText = verticalSpeed;
document.getElementById("playerHeightValue").innerText = playerHeight;
document.getElementById("jumpVelocityValue").innerText = jumpVelocity;
document.getElementById("gravityValue").innerText = gravity;
document.getElementById("chunkSizeValue").innerText = chunkSize;
document.getElementById("chunkDistanceValue").innerText = chunkDistance;

// Écouter les changements de chaque paramètre
bordurecamInput.addEventListener("input", function() {
    bordurecam = parseFloat(this.value);
    document.getElementById("bordurecamValue").innerText = bordurecam;
});



speedInput.addEventListener("input", function() {
    speed = parseInt(this.value);
    document.getElementById("speedValue").innerText = speed;
});

verticalSpeedInput.addEventListener("input", function() {
    verticalSpeed = parseInt(this.value);
    document.getElementById("verticalSpeedValue").innerText = verticalSpeed;
});

playerHeightInput.addEventListener("input", function() {
    playerHeight = parseFloat(this.value);
    document.getElementById("playerHeightValue").innerText = playerHeight;
});

jumpVelocityInput.addEventListener("input", function() {
    jumpVelocity = parseInt(this.value);
    document.getElementById("jumpVelocityValue").innerText = jumpVelocity;
});

gravityInput.addEventListener("input", function() {
    gravity = parseInt(this.value);
    document.getElementById("gravityValue").innerText = gravity;
});

chunkSizeInput.addEventListener("input", function() {
    chunkSize = parseInt(this.value);
    document.getElementById("chunkSizeValue").innerText = chunkSize;
});

chunkDistanceInput.addEventListener("input", function() {
    chunkDistance = parseInt(this.value);
    document.getElementById("chunkDistanceValue").innerText = chunkDistance;
});


