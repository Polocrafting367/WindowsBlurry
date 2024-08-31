const tileSize = 100;
let mapElement;
let mapData; // Déclaré globalement

let playerX = 0;
let playerY = 0;

let velocityX = 0;
let velocityY = 0;
const acceleration = 0.9;
const maxSpeed = 25;
const friction = 0.9;

let loadedTiles = {}; // Pour suivre les tuiles déjà chargées
let gameStarted = false;
let startTime;
let tilesX = 5; // Nombre de tuiles visibles sur l'axe X
let tilesY = 5;  // Nombre de tuiles visibles sur l'axe Y

let enemies = []; // Liste pour stocker les ennemis générés

// Déclarer keysPressed globalement
const keysPressed = {};

fetch('scene.txt')
    .then(response => response.text())
    .then(text => {
        mapData = text.split('\n').map(line => line.trim());
        initializeMap(mapData);
    })
    .catch(error => console.error('Erreur de chargement de la map:', error));

function startGame() {
    if (!gameStarted) {
        startTime = Date.now();
        gameStarted = true;
        updateTimer();
    }
}

function updateTimer() {
    if (!gameStarted) return;

    const currentTime = Date.now();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    
    const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
    const seconds = String(timeElapsed % 60).padStart(2, '0');
    
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    
    requestAnimationFrame(updateTimer); // Continue updating the timer
}

window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    startGame(); // Démarrer le jeu au premier mouvement
});

window.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

function initializeMap(mapData) {
    mapElement = document.getElementById('map');
    
    const mapWidth = mapData[0].length * tileSize;
    const mapHeight = mapData.length * tileSize;

    mapElement.style.width = `${mapWidth}px`;
    mapElement.style.height = `${mapHeight}px`;

    // Initialiser playerElement ici
    let playerElement = document.getElementById('player');

    // Trouver la position initiale du joueur
    mapData.forEach((row, y) => {
        row.split('').forEach((tile, x) => {
            if (tile === 'X') {
                playerX = x * tileSize;
                playerY = y * tileSize;
                centerCameraOnPlayer();
            }
        });
    });

    loadVisibleTiles(); // Charger les tuiles visibles initiales
    requestAnimationFrame(updateMovement);
}


let visibleTiles = {}; // Pour suivre les tuiles actuellement visibles


let spawnedEnemies = {}; // Pour suivre les tuiles où les ennemis ont déjà été générés

let checkedTiles = {};  // Pour garder une trace des tuiles déjà vérifiées

function loadVisibleTiles() {
    const container = document.getElementById('game-container');
    const startX = Math.max(0, Math.floor(playerX / tileSize) - tilesX);
    const startY = Math.max(0, Math.floor(playerY / tileSize) - tilesY);
    const endX = Math.min(mapData[0].length, Math.ceil(playerX / tileSize) + tilesX);
    const endY = Math.min(mapData.length, Math.ceil(playerY / tileSize) + tilesY);

    let newVisibleTiles = {}; // Pour les nouvelles tuiles visibles

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const tileKey = `${x},${y}`;
            newVisibleTiles[tileKey] = true; // Marquer cette tuile comme visible

            const tile = mapData[y][x];  // Définir `tile` ici

            if (!loadedTiles[tileKey]) {
                const img = document.createElement('img');
                img.src = getTileImage(tile);
                img.style.top = `${y * tileSize}px`;
                img.style.left = `${x * tileSize}px`;
                img.dataset.tileKey = tileKey; // Stocker la clé pour un accès facile
                mapElement.appendChild(img);
                loadedTiles[tileKey] = img; // Stocker l'élément DOM pour le déchargement
            }

            // Vérifier si la tuile a déjà été vérifiée pour un ennemi
            if (!checkedTiles[tileKey] && 
                (tile === '-' || tile === '1' || tile === '2' || tile === '3' ||
                 tile === '4' || tile === '5' || tile === '6' || tile === '7')) {

                // Probabilité de faire apparaître un ennemi sur cette tuile
                if (Math.random() < 0.03) {  // 10% de chance
                    spawnEnemy(x, y);
                    spawnedEnemies[tileKey] = true; // Marquer la tuile comme ayant un ennemi
                }

                checkedTiles[tileKey] = true; // Marquer la tuile comme vérifiée
            }
        }
    }

    // Supprimer les tuiles qui ne sont plus visibles
    for (const key in visibleTiles) {
        if (!newVisibleTiles[key]) {
            const img = loadedTiles[key];
            if (img) {
                mapElement.removeChild(img);
                delete loadedTiles[key]; // Supprimer de la liste des tuiles chargées
            }
        }
    }

    // Mettre à jour la liste des tuiles visibles
    visibleTiles = newVisibleTiles;
}

function spawnEnemy(x, y) {
    const enemyTypes = [
        { text: "+10", color: "red", timeChange: 10, probability: 0.05 },
        { text: "+3s", color: "red", timeChange: 5, probability: 0.1 },
        { text: "+2s", color: "red", timeChange: 2, probability: 0.2 },
        { text: "-1s", color: "red", timeChange: -1, probability: 0.3 },
        { text: "-2s", color: "limegreen", timeChange: -2, probability: 0.2 },
        { text: "-3s", color: "limegreen", timeChange: -3, probability: 0.1 },
        { text: "-4s", color: "limegreen", timeChange: -4, probability: 0.05 }
    ];

    // Tirer au sort l'ennemi en fonction de la probabilité
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < enemyTypes.length; i++) {
        cumulativeProbability += enemyTypes[i].probability;
        if (random < cumulativeProbability) {
            const enemy = enemyTypes[i];
            
            const enemyElement = document.createElement('div');
            enemyElement.textContent = enemy.text;
            enemyElement.style.color = enemy.color;
            enemyElement.style.fontFamily = "'Press Start 2P', cursive";
            enemyElement.style.fontSize = "30px";
            enemyElement.style.position = "absolute";
            enemyElement.style.top = `${y * tileSize}px`;
            enemyElement.style.left = `${x * tileSize}px`;

            enemyElement.dataset.timeChange = enemy.timeChange;

            mapElement.appendChild(enemyElement);
            enemies.push(enemyElement);
            break;
        }
    }
}


function checkFinish(x, y) {
    const halfTileSize = tileSize / 2;
    const centerX = x + halfTileSize;
    const centerY = y + halfTileSize;
    const mapX = Math.floor(centerX / tileSize);
    const mapY = Math.floor(centerY / tileSize);

    if (mapY >= 0 && mapY < mapData.length && mapX >= 0 && mapX < mapData[0].length) {
        return mapData[mapY][mapX] === 'A';
    }
    return false;
}


function updateMovement() {
    let accelerationX = 0;
    let accelerationY = 0;

    const leftPressed = keysPressed['ArrowLeft'] || keysPressed['a'];
    const rightPressed = keysPressed['ArrowRight'] || keysPressed['d'];
    const upPressed = keysPressed['ArrowUp'] || keysPressed['w'];
    const downPressed = keysPressed['ArrowDown'] || keysPressed['s'];

    if (leftPressed) {
        accelerationX = -acceleration;
    } else if (rightPressed) {
        accelerationX = acceleration;
    } else {
        accelerationX = 0;
    }

    if (upPressed) {
        accelerationY = -acceleration;
    } else if (downPressed) {
        accelerationY = acceleration;
    } else {
        accelerationY = 0;
    }

    velocityX += accelerationX;
    velocityY += accelerationY;

    velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, velocityX));
    velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, velocityY));

    let newX = playerX + velocityX;
    let newY = playerY + velocityY;

    if (isCollision(newX, playerY)) {
        velocityX = 0;
        newX = playerX;
    }

    if (isCollision(playerX, newY)) {
        velocityY = 0;
        newY = playerY;
    }

    velocityX *= friction;
    velocityY *= friction;

    if (checkBounds(newX, newY)) {
        playerX = newX;
        playerY = newY;
        centerCameraOnPlayer();
    }

    // Vérifier la collision avec un ennemi
    checkEnemyCollision();

    // Vérifier la collision avec la tuile 'A' (fin du jeu)
    if (checkFinish(playerX, playerY)) {
        endGame();
        return;
    }

    loadVisibleTiles(); // Charger dynamiquement les nouvelles tuiles visibles

    requestAnimationFrame(updateMovement);
}

function checkEnemyCollision() {
        let playerElement = document.getElementById('player');

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const rect1 = playerElement.getBoundingClientRect();
        const rect2 = enemy.getBoundingClientRect();

        const overlap = !(rect1.right < rect2.left || 
                         rect1.left > rect2.right || 
                         rect1.bottom < rect2.top || 
                         rect1.top > rect2.bottom);

        if (overlap) {
            adjustTime(parseInt(enemy.dataset.timeChange, 10));
            mapElement.removeChild(enemy);
            enemies.splice(i, 1);
            i--; // Adjust index after removal
        }
    }
}

function adjustTime(seconds) {
    startTime -= seconds * 1000; // Adjust the start time to reflect the time change
}

function endGame() {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // Temps en secondes
    const gameBar = document.getElementById('game-bar');
    const textElement = document.getElementById('text');

    if (timeTaken < 40) {
        gameBar.style.backgroundColor = "blue";
        textElement.textContent = "Wow, je suis à l'heure !";
    } else {
        gameBar.style.backgroundColor = "red";
        textElement.textContent = "Et merde, je suis en retard !";
    }

    // Afficher le temps final
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${Math.floor(timeTaken / 60).toString().padStart(2, '0')}:${Math.floor(timeTaken % 60).toString().padStart(2, '0')}`;
    
    // Afficher le message au centre de l'écran
    const continueMessage = document.createElement('div');
    continueMessage.textContent = "Appuyez sur 'A' pour continuer";
    continueMessage.style.position = "absolute";
    continueMessage.style.top = "25%";
    continueMessage.style.left = "50%";
    continueMessage.style.transform = "translate(-50%, -50%)";
    continueMessage.style.color = "white";
    continueMessage.style.fontFamily = "'Press Start 2P', cursive";
    continueMessage.style.fontSize = "24px";
    continueMessage.style.textAlign = "center";
    document.body.appendChild(continueMessage);

    // Écouter la touche "A" pour rediriger vers LV2.html
    window.addEventListener('keydown', function(event) {
        if (event.key === 'a' || event.key === 'A') {
            window.location.href = 'LV2.html';
        }
    });

    // Arrêter le jeu
    velocityX = 0;
    velocityY = 0;
    gameStarted = false;
}


function getTileImage(tile) {
    switch (tile) {
        case 'T': return 'terrain.jpg';
        case '-': return '0.png';
        case '1': return '1.png';
        case '2': return '2.png';
        case '3': return '3.png';
        case '4': return '4.png';
        case '5': return '5.png';
        case '6': return '6.png';
        case '7': return '7.png';
        case '8': return '8.png';
        case '9': return '9.png';
        case 'O': return 'O.png';
        case 'P': return 'P.png';
        case 'Q': return 'Q.png';
        case 'R': return 'R.png';
        case 'S': return 'S.png';
        case 'Z': return 'Z.png';
        case 'L': return 'L.png';
        case 'M': return 'M.png';
        case 'H': return 'H.png';
        case 'B': return 'building_big.png';
        case 'b': return 'building_small.png';
        case 'A': return 'building_finish.png';
        case 'X': return '0.png';
        default: return 'terrain.jpg';
    }
}



function centerCameraOnPlayer() {
    const container = document.getElementById('game-container');
    const mapWidth = mapElement.offsetWidth;
    const mapHeight = mapElement.offsetHeight;

    const playerCenterX = playerX + tileSize / 2;
    const playerCenterY = playerY + tileSize / 2;

    const containerCenterX = container.clientWidth / 2;
    const containerCenterY = container.clientHeight / 2;

    let newMapLeft = containerCenterX - playerCenterX;
    let newMapTop = containerCenterY - playerCenterY;

    newMapLeft = Math.max(container.clientWidth - mapWidth, Math.min(0, newMapLeft));
    newMapTop = Math.max(container.clientHeight - mapHeight, Math.min(0, newMapTop));

    mapElement.style.left = `${newMapLeft}px`;
    mapElement.style.top = `${newMapTop}px`;
}

function isCollision(x, y) {
    const halfTileSize = tileSize / 2;
    const centerX = x + halfTileSize;
    const centerY = y + halfTileSize;
    const mapX = Math.floor(centerX / tileSize);
    const mapY = Math.floor(centerY / tileSize);

    if (mapY >= 0 && mapY < mapData.length && mapX >= 0 && mapX < mapData[0].length) {
        const tile = mapData[mapY][mapX];
        return tile === 'b' || tile === 'B' || tile === '8' || tile === '9' || tile === 'O' || tile === 'P'|| tile === 'Q' || tile === 'R' || tile === 'S' || tile === 'Z';
    }
    return false;
}

function checkBounds(x, y) {
    const mapWidth = mapElement.offsetWidth;
    const mapHeight = mapElement.offsetHeight;

    const withinXBounds = x >= 0 && x <= (mapWidth - tileSize);
    const withinYBounds = y >= 0 && y <= (mapHeight - tileSize);

    return withinXBounds && withinYBounds;
}
