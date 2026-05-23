
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


document.addEventListener('keyup', onKeyUp);

document.addEventListener('keydown', onKeyDown);
