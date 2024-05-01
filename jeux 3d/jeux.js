let scene, camera, renderer;
let character;
let enemies = [];
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;
let speed = 0; // Vitesse initiale
const maxSpeed = 0.7; // Vitesse maximale
const accelerationFactor = 1.01; // Facteur d'accélération exponentielle
const decelerationFactor = 0.95; // Facteur de décélération exponentielle
const breackFactor = 0.7; // Facteur de décélération exponentielle
let prevTime = performance.now();
let frameCount = 0;
let fpsElement = document.getElementById('fps');
let coordinatesElement = document.getElementById('coordinates');
let accelerationElement = document.getElementById('acceleration');
let probaennemy = 0.02; // Vitesse initiale
let chronoRunning = false;
let startTime;
let endTime;

const TILE_SIZE = 5;
function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 60);
    const initialCameraPosition = new THREE.Vector3(0, 10, -10);
    camera.position.copy(initialCameraPosition);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Création du personnage avec texture personnalisée
    const characterTexture = new THREE.TextureLoader().load('perso.png');
    const characterMaterial = new THREE.MeshBasicMaterial({ map: characterTexture });
    const characterGeometry = new THREE.BoxGeometry(1, 2, 1); // Dimensions du personnage
    character = new THREE.Mesh(characterGeometry, characterMaterial);
    character.position.set(25, 0, -20);
    scene.add(character);

    // Gestion des événements clavier
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Charger la configuration de la scène à partir du fichier texte
    loadSceneFromFile('scene.txt', () => {
        const playerPosition = character.position;
        animate(); // Démarrer l'animation une fois que la scène est chargée et les ennemis sont placés
    });

    // Redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


function loadSceneFromFile(filename, onLoadCallback) {
    const loader = new THREE.FileLoader();
    loader.load(
        filename,
        (data) => {
            const lines = data.split('\n');
            const numRows = lines.length;
            const numCols = lines[0].trim().length;

            for (let i = 0; i < numRows; i++) {
                const line = lines[i].trim();
                for (let j = 0; j < numCols; j++) {
                    const symbol = line.charAt(j);
                    let object;

                    switch (symbol) {

                        case 'T': // Terrain
                            const terrainTexture = new THREE.TextureLoader().load('terrain.jpg');
                            const terrainMaterial = new THREE.MeshBasicMaterial({ map: terrainTexture });
                            const terrainGeometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(terrainGeometry, terrainMaterial);
                            object.rotation.x = -Math.PI / 2; // Aligner la texture de sol avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                          break;
                            case 'B': // Immeuble grand (type 'building')
                                const buildingTextureBig = new THREE.TextureLoader().load('building_big.png');
                                const buildingMaterialBig = new THREE.MeshBasicMaterial({ map: buildingTextureBig });
                                const buildingGeometryBig = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE * 2, TILE_SIZE);
                                object = new THREE.Mesh(buildingGeometryBig, buildingMaterialBig);
                                object.userData.type = 'building'; // Définir le type de l'objet comme "building"
                                break;

                            case 'A': // Immeuble de fin (type 'END')
                                const buildingTexturefinish = new THREE.TextureLoader().load('building_finish.png');
                                const buildingMaterialfinish = new THREE.MeshBasicMaterial({ map: buildingTexturefinish });
                                const buildingGeometryfinish = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE * 2, TILE_SIZE);
                                object = new THREE.Mesh(buildingGeometryfinish, buildingMaterialfinish);
                                object.userData.type = 'END'; // Définir le type de l'objet comme "END"
                                break;

                        case 'b': // Immeuble petit
                            const buildingTextureSmall = new THREE.TextureLoader().load('building_small.png');
                            const buildingMaterialSmall = new THREE.MeshBasicMaterial({ map: buildingTextureSmall });
                            const buildingGeometrySmall = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
                            object = new THREE.Mesh(buildingGeometrySmall, buildingMaterialSmall);
                            object.userData.type = 'building'; // Définir le type de l'objet comme "building"
                            break;
                        case '-': // Route horizontale
                            const roadTextureHorizontal = new THREE.TextureLoader().load('0.png');
                            const roadMaterialHorizontal = new THREE.MeshBasicMaterial({ map: roadTextureHorizontal, transparent: true });
                            const roadGeometryHorizontal = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryHorizontal, roadMaterialHorizontal);
                            object.rotation.x = -Math.PI / 2; // Aligner la route avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;
                        case '1': // Route verticale
                            const roadTextureVertical = new THREE.TextureLoader().load('1.png');
                            const roadMaterialVertical = new THREE.MeshBasicMaterial({ map: roadTextureVertical, transparent: true });
                            const roadGeometryVertical = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryVertical, roadMaterialVertical);
                            object.rotation.x = -Math.PI / 2; // Aligner la route avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;
                        case '2': // Croisement de routes
                            const roadTextureCross = new THREE.TextureLoader().load('2.png');
                            const roadMaterialCross = new THREE.MeshBasicMaterial({ map: roadTextureCross, transparent: true });
                            const roadGeometryCross = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryCross, roadMaterialCross);
                            object.rotation.x = -Math.PI / 2; // Aligner le croisement avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;
                        case '3': // Croisement de routes
                            const roadTextureCrossspire = new THREE.TextureLoader().load('3.png');
                            const roadMaterialCrossspire = new THREE.MeshBasicMaterial({ map: roadTextureCrossspire, transparent: true });
                            const roadGeometryCrossspire = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryCrossspire, roadMaterialCrossspire);
                            object.rotation.x = -Math.PI / 2; // Aligner le croisement avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;
                        case '4': // Croisement de routes
                            const roadTextureCrossfaur = new THREE.TextureLoader().load('4.png');
                            const roadMaterialCrossfaur = new THREE.MeshBasicMaterial({ map: roadTextureCrossfaur, transparent: true });
                            const roadGeometryCrossfaur = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryCrossfaur, roadMaterialCrossfaur);
                            object.rotation.x = -Math.PI / 2; // Aligner le croisement avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;
                       case '5': // Croisement de routes
                            const roadTextureCrossfive= new THREE.TextureLoader().load('5.png');
                            const roadMaterialCrossfive = new THREE.MeshBasicMaterial({ map: roadTextureCrossfive, transparent: true });
                            const roadGeometryCrossfive = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryCrossfive, roadMaterialCrossfive);
                            object.rotation.x = -Math.PI / 2; // Aligner le croisement avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;

                        case '6': // Croisement de routes
                            const roadTextureCrosssix= new THREE.TextureLoader().load('6.png');
                            const roadMaterialCrosssix = new THREE.MeshBasicMaterial({ map: roadTextureCrosssix, transparent: true });
                            const roadGeometryCrosssix = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryCrosssix, roadMaterialCrosssix);
                            object.rotation.x = -Math.PI / 2; // Aligner le croisement avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;
              case '7': // Croisement de routes
                            const roadTextureCrossseven= new THREE.TextureLoader().load('7.png');
                            const roadMaterialCrossseven = new THREE.MeshBasicMaterial({ map: roadTextureCrossseven, transparent: true });
                            const roadGeometryCrossseven = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                            object = new THREE.Mesh(roadGeometryCrossseven, roadMaterialCrossseven);
                            object.rotation.x = -Math.PI / 2; // Aligner le croisement avec le sol
                            if (Math.random() <= probaennemy) { // 20% de probabilité
                                const enemy = createEnemy(j * TILE_SIZE + TILE_SIZE / 2, -i * TILE_SIZE - TILE_SIZE / 2);
                                enemies.push(enemy);

                            }
                            break;
                        default:
                            continue;
                    }

                    if (object) {
                        object.position.set(j * TILE_SIZE, 0, -i * TILE_SIZE); // Position basée sur la ligne et la colonne
                        scene.add(object);
                    }
                }
            }
            if (onLoadCallback) {
                onLoadCallback(); // Appeler la fonction de rappel une fois la scène chargée
            }

        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (err) => {
            console.error('Error loading file:', err);
        }
    );
}


function createEnemy(x, z) {
    const enemyTextures = [
        'alien_texture.png',
        'car_texture.png',
        'cat_texture.png',
        'dolphin_texture.png'
    ];

    // Sélection aléatoire d'une texture parmi le tableau enemyTextures
    const randomTexturePath = enemyTextures[Math.floor(Math.random() * enemyTextures.length)];

    const texture = new THREE.TextureLoader().load(randomTexturePath);
    const material = new THREE.MeshBasicMaterial({ map: texture , transparent: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const enemy = new THREE.Mesh(geometry, material);
    enemy.position.set(x, 0, z);
    scene.add(enemy);
    enemies.push(enemy);
    return enemy;
}

function startChrono() {
    startTime = performance.now();
    chronoRunning = true;
}

// Fonction pour arrêter le chronomètre
function stopChrono() {
    endTime = performance.now();
    chronoRunning = false;
    const elapsedTime = (endTime - startTime) / 1000; // Durée en secondes
}




function detectCollisions() {
    const playerBoundingBox = new THREE.Box3().setFromObject(character);

    // Vérifier les collisions avec les ennemis
    for (const enemy of enemies) {
        const enemyBoundingBox = new THREE.Box3().setFromObject(enemy);
        if (playerBoundingBox.intersectsBox(enemyBoundingBox)) {
            // Réduire la vitesse lorsque le joueur touche un ennemi
            speed = 0; // Arrêter le joueur
            // Ici, vous pouvez ajouter d'autres logiques comme la perte de vie
            return; // Sortir de la fonction dès qu'une collision avec un ennemi est détectée
        }
    }

    // Vérifier les collisions avec les objets de la scène
    for (const object of scene.children) {
        const objectBoundingBox = new THREE.Box3().setFromObject(object);

        if (playerBoundingBox.intersectsBox(objectBoundingBox)) {
            if (object.userData.type === 'building') {
                speed = 0;
                // Le joueur a touché un bâtiment de type 'building'
                
            } else if (object.userData.type === 'END') {
                // Le joueur a touché l'objet de fin
                stopChrono()
                 // Arrêter le chronomètre
                // Autres actions à effectuer lorsque le joueur atteint l'objet de fin
                return; // Sortir de la fonction dès qu'une collision avec l'objet de fin est détectée
            }
        }
    }
}










function updateEnemies() {
    const playerPosition = character.position;
    const maxDistance = 25; // Distance maximale à laquelle les ennemis peuvent se rapprocher du joueur

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        // Calculer la distance entre l'ennemi et le joueur
        const distanceToPlayer = enemy.position.distanceTo(playerPosition);

        // Vérifier si l'ennemi est à moins de la distance maximale
        if (distanceToPlayer <= maxDistance) {
            // Calculer la direction vers le joueur
            const directionToPlayer = new THREE.Vector3().copy(playerPosition).sub(enemy.position).normalize();

            // Ajuster la position de l'ennemi pour se déplacer vers le joueur
            const enemySpeed = 0.01; // Vitesse de déplacement de l'ennemi
            const enemyMovement = directionToPlayer.multiplyScalar(enemySpeed);
            enemy.position.add(enemyMovement);
        }
    }
}


// Fonction pour sauvegarder le meilleur temps dans le localStorage
function saveBestTime(timeInSeconds) {
    const bestTime = localStorage.getItem('bestTime');

    if (!bestTime || timeInSeconds < bestTime) {
        localStorage.setItem('bestTime', timeInSeconds);
    }
}

// Fonction pour récupérer et afficher le meilleur temps à l'écran
function displayBestTime() {
    const bestTime = localStorage.getItem('bestTime');

    if (bestTime) {
        const bestTimeDisplay = document.getElementById('bestTimeDisplay');
        bestTimeDisplay.textContent = `Meilleur temps : ${bestTime.toFixed(1)} secondes`;
    }
}

// Fonction pour afficher l'écran figé et le meilleur temps à la fin du jeu
function showEndScreen(timeInSeconds) {
    const overlay = document.getElementById('overlay');
    const bestTimeDisplay = document.getElementById('bestTimeDisplay');

    overlay.style.display = 'block';
    saveBestTime(timeInSeconds); // Enregistrer le meilleur temps
    displayBestTime(); // Afficher le meilleur temps
}

// Fonction pour redémarrer le jeu lors du clic sur le bouton "Recommencer"
function restartGame() {
    location.reload(); // Recharger la page pour recommencer le jeu
}


function animate() {
    requestAnimationFrame(animate);



    detectCollisions(); // Détection des collisions avec les ennemis

    updateEnemies(); // Mettre à jour le mouvement des ennemis vers le joueur

    const rotationSpeed = 0.05;

// Fonction pour mettre à jour et afficher le chronomètre à l'écran
function updateChronoDisplay(timeInSeconds) {
    const chronoDisplay = document.getElementById('chronoDisplay');
    chronoDisplay.textContent = `Temps écoulé : ${timeInSeconds.toFixed(1)} secondes`;
}

// Dans la fonction animate(), mettez à jour l'affichage du chronomètre si le chrono est en cours
if (chronoRunning) {
    const currentTime = performance.now();
    const elapsedTimeSeconds = (currentTime - startTime) / 1000;
    updateChronoDisplay(elapsedTimeSeconds);
}

    // Gestion du mouvement en fonction des touches enfoncées
    const moveDirection = new THREE.Vector3(0, 0, -1); // Direction de base (avancer)

    if (rotateLeft) {
        character.rotation.y += rotationSpeed;
    }
    if (rotateRight) {
        character.rotation.y -= rotationSpeed;
    }

    // Mise à jour de la direction en fonction de la rotation du personnage
    moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), character.rotation.y);

    if (moveForward) {
        accelerate(); // Accélération vers l'avant
    } else if (moveBackward) {
        breack(); // Décélération vers l'arrière
    } else {
        decelerate();
    }

    // Calcul du déplacement en fonction de la vitesse actuelle
    const delta = moveDirection.clone().multiplyScalar(speed);
    character.position.add(delta);

    // Mise à jour de l'affichage de la position du joueur

    // Mise à jour de la caméra en suivant le personnage
    const cameraDistance = 20;
    const cameraAngleRadians = 30 * (Math.PI / 180);
    const tanCameraAngle = Math.tan(cameraAngleRadians);
    const cameraOffset = new THREE.Vector3(
        cameraDistance * Math.sin(character.rotation.y),
        cameraDistance * tanCameraAngle,
        cameraDistance * Math.cos(character.rotation.y)
    );
    const targetCameraPosition = new THREE.Vector3().copy(character.position).add(cameraOffset);
    camera.position.copy(targetCameraPosition);
    camera.lookAt(character.position);

    // Mise à jour de l'affichage de la vitesse du joueur


    const characterPosition = character.position;

    // Déclarer les variables characterX et characterZ
    let characterX, characterZ;

    // Récupérer l'élément HTML de l'image du carré vert
    const characterMarker = document.getElementById('characterMarker');

     if (characterMarker) {
        // Calculer les coordonnées de l'écran en fonction de la position du personnage
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculer characterX et characterZ en fonction de characterPosition
        const characterX = -characterPosition.x + 245; // Position horizontale (à droite)
        const characterY = characterPosition.z +285 ; // Position verticale (en haut)

        // Mettre à jour la position de l'image du carré vert
        characterMarker.style.top = `${characterY}px`; // Position verticale (top)
        characterMarker.style.right = `${characterX}px`; // Position horizontale (right)
    }
        renderer.render(scene, camera);


}


function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveForward = true;
            break;
        case 'ArrowDown':
            moveBackward = true;
            break;
        case 'ArrowLeft':
            rotateLeft = true;
            break;
        case 'ArrowRight':
            rotateRight = true;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveForward = false;
            break;
        case 'ArrowDown':
            moveBackward = false;
            break;
        case 'ArrowLeft':
            rotateLeft = false;
            break;
        case 'ArrowRight':
            rotateRight = false;
            break;
    }
}
function accelerate() {
    if (speed < maxSpeed) {
        if (Math.abs(speed) < 0.01) {
            speed = 0.1;
            if (chronoRunning === false) {
                startChrono(); // Démarrer le chronomètre lorsque le mouvement commence
            }
        }
        speed *= accelerationFactor;
        if (speed > maxSpeed) {
            speed = maxSpeed;
        }
    }
}


function decelerate() {

    if (speed > 0) {
        speed *= decelerationFactor; // Décélération exponentielle
    } 
}
function breack() {

    if (speed > -0.5) {
        speed *= breackFactor; // Décélération exponentielle
    } 
}

init(); // Initialisation de la scène