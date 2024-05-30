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
        return square;
    }

    function moveSquare(square) {
        function frame() {
            const now = Date.now();
            let posX = parseFloat(square.style.left) + square.velocityX;
            let posY = parseFloat(square.style.top) + square.velocityY;

            let bounced = checkBoundariesCollision(square, posX, posY);
            bounced = checkWallCollisions(square, now) || bounced;

            if (!bounced) {
                square.style.left = `${posX}px`;
                square.style.top = `${posY}px`;
            }

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
                requestAnimationFrame(frame);
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
            }, 3000);
        }, 0);
    }
    function freezeSquare(square) {
        square.frozen = true;
        const wallWidth = 5;
        const wallHeight = 5;
        createWalls(square, wallWidth, wallHeight);
        cube.removeChild(square);
        const newSquare = createSquare(++globalBounces);
        moveSquare(newSquare);
    }

    function createWalls(square, wallWidth, wallHeight) {
        const posX = parseFloat(square.style.left);
        const posY = parseFloat(square.style.top);
        const width = square.offsetWidth;
        const height = square.offsetHeight;

        const positions = [
            { x: 0, y: -wallHeight, width: width, height: wallHeight }, // Mur du haut
            { x: 0, y: height, width: width, height: wallHeight }, // Mur du bas
            { x: -wallWidth, y: 0, width: wallWidth, height: height }, // Mur gauche
            { x: width, y: 0, width: wallWidth, height: height } // Mur droit
        ];

        positions.forEach(pos => {
            const wall = document.createElement('div');
            wall.classList.add('wall');
            wall.style.left = `${posX + pos.x}px`;
            wall.style.top = `${posY + pos.y}px`;
            wall.style.width = `${pos.width}px`;
            wall.style.height = `${pos.height}px`;
            cube.appendChild(wall);
        });
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

    function checkWallCollisions(square, now) {
        let bounced = false;
        document.querySelectorAll('.wall').forEach(wall => {
            if (isColliding(square, wall) && (square.lastCollidedWall !== wall || now - square.lastCollisionTime > 200)) {
                handleCollision(square, wall);
                square.lastCollidedWall = wall;
                square.lastCollisionTime = now;
                bounced = true;
            }
        });
        return bounced;
    }

    function isColliding(square1, square2) {
        const rect1 = square1.getBoundingClientRect();
        const rect2 = square2.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }

    function handleCollision(movingSquare, wall) {
        const movingRect = movingSquare.getBoundingClientRect();
        const wallRect = wall.getBoundingClientRect();

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
        if (movingSquare.bounces > -1) {
            movingSquare.bounces--;
            
        }
    }

    function updateSquareColor(square) {
        const maxBounces = 10; // Valeur maximale de rebonds pour la couleur verte
        const minBounces = -10; // Valeur minimale de rebonds pour la couleur rouge

        let greenToBlueRatio;
        if (square.bounces >= 0) {
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
