document.addEventListener('DOMContentLoaded', function() {
    const cube = document.getElementById('cube');
    const posXSlider = document.getElementById('posX');
    const posYSlider = document.getElementById('posY');
    const velocityXSlider = document.getElementById('velocityX');
    const velocityYSlider = document.getElementById('velocityY');
    const freezeTimeSlider = document.getElementById('freezeTime');
    const startBtn = document.getElementById('startBtn');
    const bounceSound = document.getElementById('bounceSound');

    let globalBounces = 1; // Pour augmenter le nombre de rebonds de chaque nouveau carré.
    let walls = []; // Tableau pour stocker les murs

function createSquare(bounces) {
    const square = document.createElement('div');
    square.classList.add('square', 'active');
    square.style.left = `${posXSlider.value}px`;
    square.style.top = `${posYSlider.value}px`;
    square.velocityX = parseFloat(velocityXSlider.value);
    square.velocityY = parseFloat(velocityYSlider.value);
    square.bounces = bounces;
    square.lastCollidedWall = null;
    square.lastCollisionTime = 0;

    cube.appendChild(square);
    square.innerHTML = bounces; // Afficher le nombre de rebonds à l'intérieur du carré.
    updateSquareColor(square);

    // Créer et ajouter les cubes de collision
    const collisionCubes = createCollisionCubes(square);
    collisionCubes.forEach(cube => cube && cube.classList.add('collision-cube'));

    return square;
}

function createCollisionCubes(square) {
    const collisionCubes = [];
    walls.forEach(wall => {
        if (wall.x1 !== undefined && wall.y1 !== undefined && wall.x2 !== undefined && wall.y2 !== undefined) {
            const collisionCube = document.createElement('div');
            collisionCube.classList.add('collision-cube');
            collisionCube.style.left = `${wall.x1}px`;
            collisionCube.style.top = `${wall.y1}px`;
            collisionCube.style.width = `${wall.x2 - wall.x1}px`;
            collisionCube.style.height = `${wall.y2 - wall.y1}px`;
            collisionCubes.push(collisionCube);
            cube.appendChild(collisionCube);
        }
    });
    return collisionCubes;
}


// Lorsque vous ne voulez plus les afficher, vous pouvez les supprimer en parcourant les éléments avec la classe `collision-cube` et en les retirant du DOM.
function removeCollisionCubes() {
    const collisionCubes = document.querySelectorAll('.collision-cube');
    collisionCubes.forEach(cube => cube.remove());
}


function moveSquare(square) {
    const collisionCubes = createCollisionCubes(square); // Créer les cubes de collision

    function frame() {
        const now = Date.now();
        let posX = parseFloat(square.style.left) + square.velocityX;
        let posY = parseFloat(square.style.top) + square.velocityY;

        let bounced = checkBoundariesCollision(square, posX, posY);
        bounced = checkWallCollisions(square, posX, posY) || bounced;

        if (!bounced) {
            square.style.left = `${posX}px`;
            square.style.top = `${posY}px`;
        }

        // Mettre à jour la position et les dimensions de chaque cube de collision
        collisionCubes.forEach(cube => {
            cube.style.left = `${parseFloat(square.style.left)}px`;
            cube.style.top = `${parseFloat(square.style.top)}px`;
            cube.style.width = `${square.offsetWidth}px`;
            cube.style.height = `${square.offsetHeight}px`;
        });

        square.innerHTML = square.bounces; // Mise à jour visuelle du compteur de rebonds.
        updateSquareColor(square);

        // Ajouter la traînée
        createTrail(square);

        if (square.bounces > 0) {
            requestAnimationFrame(frame);
        } else if (!square.frozen) {
            setTimeout(() => {
                freezeSquare(square);
            }, parseFloat(freezeTimeSlider.value));
            square.frozen = true; // Mettre le carré en état gelé
        }
    }
    frame();
}



    function createTrail(square) {
        const trailSquare = document.createElement('div');
        trailSquare.classList.add('square');
        trailSquare.style.left = square.style.left;
        trailSquare.style.top = square.style.top;
        trailSquare.style.opacity = '0.3';
        trailSquare.style.transition = 'opacity 2s';
        trailSquare.innerHTML = '';
        trailSquare.style.boxShadow = square.style.boxShadow; // Copier le box-shadow du carré principal
        cube.appendChild(trailSquare);

        setTimeout(() => {
            trailSquare.style.opacity = '0';
            setTimeout(() => {
                trailSquare.remove();
            }, 000);
        }, 0);
    }

function freezeSquare(square) {
    square.frozen = true;
    // Supprimer la traînée
    const trail = square.parentElement.querySelector('.trail');
    if (trail) {
        trail.parentElement.removeChild(trail);
    }
    // Supprimer le cube de collision
    const collisionCube = square.parentElement.querySelector('.collision-cube');
    if (collisionCube) {
        collisionCube.parentElement.removeChild(collisionCube);
    }
}


    function addWalls(square, wallWidth, wallHeight) {
        const posX = parseFloat(square.style.left);
        const posY = parseFloat(square.style.top);
        const width = square.offsetWidth;
        const height = square.offsetHeight;

        const newWalls = [
            { x1: posX, y1: posY - wallHeight, x2: posX + width, y2: posY }, // Mur du haut
            { x1: posX, y1: posY + height, x2: posX + width, y2: posY + height + wallHeight }, // Mur du bas
            { x1: posX - wallWidth, y1: posY, x2: posX, y2: posY + height }, // Mur gauche
            { x1: posX + width, y1: posY, x2: posX + width + wallWidth, y2: posY + height } // Mur droit
        ];

        walls.push(...newWalls);
    }

    function checkBoundariesCollision(square, posX, posY) {
        let bounced = false;
        if (posX <= 0 || posX >= cube.offsetWidth - square.offsetWidth) {
            square.velocityX *= -1;
            if (square.bounces > 0) {
                square.bounces--;
                playBounceSound();
            }
            bounced = true;
        }
        if (posY <= 0 || posY >= cube.offsetHeight - square.offsetHeight) {
            square.velocityY *= -1;
            if (square.bounces > 0) {
                square.bounces--;
                playBounceSound();
            }
            bounced = true;
        }
        return bounced;
    }

    function checkWallCollisions(square, posX, posY) {
        let bounced = false;
        const squareLeft = posX;
        const squareRight = posX + square.offsetWidth;
        const squareTop = posY;
        const squareBottom = posY + square.offsetHeight;

        for (let wall of walls) {
            const wallLeft = wall.x1;
            const wallRight = wall.x2;
            const wallTop = wall.y1;
            const wallBottom = wall.y2;

            if (squareRight > wallLeft && squareLeft < wallRight && squareBottom > wallTop && squareTop < wallBottom) {
                handleCollision(square, wall);
                bounced = true;
                break;
            }
        }
        return bounced;
    }

function handleCollision(movingSquare, wall) {
    const movingRect = movingSquare.getBoundingClientRect();
    const wallRect = {
        left: wall.x1,
        right: wall.x2,
        top: wall.y1,
        bottom: wall.y2
    };

    // Calculer le chevauchement sur les deux axes
    const overlapX = Math.min(movingRect.right, wallRect.right) - Math.max(movingRect.left, wallRect.left);
    const overlapY = Math.min(movingRect.bottom, wallRect.bottom) - Math.max(movingRect.top, wallRect.top);

    // Inverser la vélocité sur l'axe avec le chevauchement minimum
    if (overlapX < overlapY) {
        movingSquare.velocityX *= -1;
    } else {
        movingSquare.velocityY *= -1;
    }
    playBounceSound();
    // Décrémenter le compteur de rebonds après le rebond
    if (movingSquare.bounces > 0) {
        movingSquare.bounces--;
    }

    // Mettre à jour la position et les dimensions de la zone de collision
    const collisionZone = movingSquare.querySelector('.collision-zone');
    collisionZone.style.left = `${Math.max(movingRect.left, wallRect.left)}px`;
    collisionZone.style.top = `${Math.max(movingRect.top, wallRect.top)}px`;
    collisionZone.style.width = `${overlapX}px`;
    collisionZone.style.height = `${overlapY}px`;
}



    function updateSquareColor(square) {
        const maxBounces = 10; // Valeur maximale de rebonds pour la couleur verte
        const minBounces = -10; // Valeur minimale de rebonds pour la couleur rouge

        let greenToBlueRatio;
        if (square.bounces >= 1) {
            greenToBlueRatio = Math.min(square.bounces / maxBounces, 1);
            const green = Math.floor(255 * (1 - greenToBlueRatio));
            const blue = Math.floor(255 * greenToBlueRatio);
            square.style.boxShadow = `0 0 15px rgb(0, ${green}, ${blue}), 0 0 30px rgb(0, ${green}, ${blue}), 0 0 45px rgb(0, ${green}, ${blue})`;
        } else {
            greenToBlueRatio = Math.max(square.bounces / minBounces, -1);
            const red = Math.floor(255 * (1 + greenToBlueRatio));
            square.style.boxShadow = `0 0 15px rgb(${red}, 0, 0), 0 0 30px rgb(${red}, 0, 0), 0 0 45px rgb(${red}, 0, 0)`;
        }
    }

    function playBounceSound() {
        bounceSound.currentTime = 0;
        bounceSound.play();
    }

    startBtn.addEventListener('click', function() {
        const newSquare = createSquare(globalBounces);
        moveSquare(newSquare);
    });
});
