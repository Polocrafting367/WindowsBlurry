 const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // Activer les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Utiliser des ombres douces
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Ajouter une lumière ambiante qui éclaire uniformément toute la scène
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // Lumière blanche douce
scene.add(ambientLight);

// Ajouter une lumière directionnelle pour générer des ombres aux intersections
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 80, 30);
directionalLight.castShadow = true;  // Permettre à la lumière de projeter des ombres
scene.add(directionalLight);

// Configurer la caméra de la lumière pour les ombres douces
directionalLight.shadow.mapSize.width = 0;
directionalLight.shadow.mapSize.height = 0;
directionalLight.shadow.camera.near = 0;
directionalLight.shadow.camera.far = 0;

// Limiter la zone d'ombre à une petite région autour des cubes
directionalLight.shadow.camera.left = -0;
directionalLight.shadow.camera.right = 0;
directionalLight.shadow.camera.top = 0;
directionalLight.shadow.camera.bottom = -0;

let fpsCounter = 0;
let lastTime = performance.now();
// Créer la scène, la caméra et le moteur de rendu
const camera = new THREE.PerspectiveCamera(anglecam, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


document.getElementById("anglecamValue").innerText = anglecam;  // Affichage de l'angle actuel

// Fonction pour mettre à jour l'angle de la caméra via l'input utilisateur
anglecamInput.addEventListener("input", function() {
    anglecam = parseInt(this.value);  // Récupérer la nouvelle valeur
    camera.fov = anglecam;  // Mettre à jour l'angle de la caméra
    camera.updateProjectionMatrix();  // Mettre à jour la matrice de projection
    document.getElementById("anglecamValue").innerText = anglecam;  // Mettre à jour l'affichage de l'angle
});
// Créer le contrôle du joueur à la première personne (PointerLockControls)
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());


// Variables de mouvement
var moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
var moveUp = false, moveDown = false;  // Nouvelles variables pour le déplacement vertical
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();




// Positionner la caméra légèrement au-dessus du sol
camera.position.y = 1.8;

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Fonction d'animation
let prevTime = performance.now();

function animate() {
        const currentTime = performance.now();
    fpsCounter++;
    requestAnimationFrame(animate);

if (currentTime - lastTime >= 1000) {
        document.getElementById('fps').innerText = fpsCounter;  // Mettez à jour l'affichage des FPS
        fpsCounter = 0;  // Réinitialiser le compteur
        lastTime = currentTime;  // Mettre à jour le dernier temps
    }

    if (controls.isLocked === true) {


   const playerX = Math.floor(camera.position.x);
        const playerY = Math.floor(camera.position.y);
        const playerZ = Math.floor(camera.position.z);
        
        // Calculer les coordonnées du chunk
        const chunkX = Math.floor(playerX / chunkSize);
        const chunkZ = Math.floor(playerZ / chunkSize);
        
        // Mettre à jour le DOM avec les nouvelles coordonnées
        document.getElementById("playerX").innerText = playerX;
        document.getElementById("playerY").innerText = playerY;
        document.getElementById("playerZ").innerText = playerZ;
        document.getElementById("chunkX").innerText = chunkX;
        document.getElementById("chunkZ").innerText = chunkZ;

        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        // Gérer le mouvement horizontal
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

        if (isFlying) {
            // En mode vol, contrôle de la vitesse verticale avec les touches
            if (moveUp) velocityY = verticalSpeed;  // Monter si Espace est appuyé
            else if (moveDown) velocityY = -verticalSpeed;  // Descendre si Shift est appuyé
            else velocityY = 0;  // Arrêter le mouvement vertical si aucune touche n'est appuyée
        } else {
            // Appliquer la gravité si on ne vole pas
            if (!isOnGround) {
                velocityY -= gravity * delta;
            }
        }

for (const [chunkKey, chunkData] of generatedChunks) {
    const chunkGroup = chunkData.group;
    if (chunkGroup && chunkGroup.children) {  // Vérifiez que chunkGroup et children existent
        for (let i = 0; i < chunkGroup.children.length; i++) {
            const block = chunkGroup.children[i];

            if (isBlockInFrustum(block, camera)) {
                block.visible = true;  // Afficher le bloc s'il est dans le champ de vision
            } else {
                block.visible = false;  // Masquer le bloc s'il est hors du champ de vision
            }
        }
    } else {
        console.warn(`Chunk ${chunkKey} n'a pas de groupe ou de blocs`);  // Avertissement si chunkGroup ou children est manquant
    }
}


        // Mettre à jour la position en Y
        camera.position.y += velocityY * delta;

        const blockBelow = checkBlockBelowPlayer();
        if (blockBelow && !isFlying && camera.position.y <= blockBelow.height + playerHeight) {
            camera.position.y = blockBelow.height + playerHeight;
            velocityY = 0;
            isOnGround = true;
            isJumping = false;
        } else if (!isFlying) {
            isOnGround = false;
        }

       updateVisibilityDistance();
        generateChunksAroundPlayer();

        // Appliquer le mouvement en X et Z
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        prevTime = time;
    }

    renderer.render(scene, camera);
}
animate();

// Redimensionner la scène quand la fenêtre change de taille
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


function checkBlockBelowPlayer() {
    const playerX = Math.floor(camera.position.x);
    const playerZ = Math.floor(camera.position.z);

    let highestBlock = null;
    let highestY = -Infinity;  // Commencer avec une valeur très basse

    // Vérifier dans les chunks générés
    for (const [chunkKey, chunkData] of generatedChunks) {
        const chunkGroup = chunkData.group;
        if (chunkGroup && chunkGroup.children) {  // Vérifiez que chunkGroup et children existent
            for (let i = 0; i < chunkGroup.children.length; i++) {
                const cube = chunkGroup.children[i];
                if (cube.position.x === playerX && cube.position.z === playerZ && cube.position.y > highestY) {
                    highestY = cube.position.y;
                    highestBlock = { x: playerX, y: cube.position.y, z: playerZ, height: cube.position.y };
                }
            }
        }
    }

    return highestBlock;
}



const collidableBlocks = ['wood', 'leaf']; // Exemple de blocs non traversables

function checkCollision(x, y, z) {
    const chunkX = Math.floor(x / chunkSize);
    const chunkZ = Math.floor(z / chunkSize);
    const chunkKey = `${chunkX},${chunkZ}`;
    
    if (generatedChunks.has(chunkKey)) {
        const chunkGroup = generatedChunks.get(chunkKey);

        for (let i = 0; i < chunkGroup.children.length; i++) {
            const cube = chunkGroup.children[i];
            const cubeMin = cube.position.clone().subScalar(0.5);
            const cubeMax = cube.position.clone().addScalar(0.5);

            // Vérifier si le bloc fait partie des blocs collidables
            if (collidableBlocks.includes(cube.userData.type) &&
                x >= cubeMin.x && x <= cubeMax.x &&
                y >= cubeMin.y && y <= cubeMax.y &&
                z >= cubeMin.z && z <= cubeMax.z) {
                return true; // Collision détectée
            }
        }
    }
    return false;
}

// Réintroduire les éléments de contrôle
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

// Quand l'utilisateur clique n'importe où sur la page, verrouiller le pointeur
document.addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    instructions.style.display = 'none';  // Masquer le message de démarrage
    blocker.style.display = 'none';
});

controls.addEventListener('unlock', () => {
    blocker.style.display = 'block';  // Réafficher le message si le contrôle est désactivé
    instructions.style.display = '';
});


// Créer un ciel avec un dégradé de bleu
const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;
  varying vec3 vWorldPosition;

  void main() {
    float h = normalize(vWorldPosition + offset).y;
    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
  }
`;

// Définir les couleurs et les paramètres du ciel
const uniforms = {
  topColor: { value: new THREE.Color(0x87CEEB) }, // Bleu clair en haut
  bottomColor: { value: new THREE.Color(0x1E90FF) }, // Bleu plus foncé en bas
  offset: { value: 33 },
  exponent: { value: 0.6 }
};

// Créer la géométrie de la sphère (pour le ciel)
const skyGeo = new THREE.SphereGeometry(500, 32, 15);
const skyMat = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: uniforms,
  side: THREE.BackSide
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);


function createCube(x, y, z, texture, isCollidable = false) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Utiliser la transparence pour les textures de feuilles et graines
    const material = new THREE.MeshLambertMaterial({ 
        map: texture, 
        transparent: true,   // Activer la transparence
        alphaTest: 0.5       // Alpha test pour les feuilles et graines
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);

    if (isCollidable) {
        cube.userData.collidable = true; // Marquer le bloc comme non traversable
    }

    return cube;  // Retourner le cube pour l'ajouter au chunk
}


function generateChunk(chunkX, chunkZ) {
    const minGroundLevel = 1;
    const chunkGroup = new THREE.Group(); // Groupe pour les blocs et les arbres dans ce chunk
    const blocks = {};  // Contiendra tous les blocs du chunk

    for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
            const worldX = chunkX * chunkSize + x;
            const worldZ = chunkZ * chunkSize + z;

            // Générer la hauteur avec le bruit de Perlin
            let noiseValue = (noise.simplex2(worldX / scale, worldZ / scale) + 1) / 2;
            let height = (Math.floor(noiseValue * maxHeight))+hauteurMonde;
            if (height < minGroundLevel) height = minGroundLevel;

            // Ajouter le bloc du dessus (le bloc d'herbe à la position 'height')
            addVisibleCubeToGroup(chunkGroup, worldX, height, worldZ, grassTexture, blocks);

            // Vérifiez si le bloc a été ajouté

            // Ajouter des arbres, fleurs, ou graines selon les probabilités
            if (Math.random() < 1 / treeregularity) {
                const terrainHeight = getTerrainHeightAt(worldX, worldZ);  // Obtenir la hauteur du terrain
                generateModel3D(treeModel, 'treeModel', worldX, (terrainHeight - 1)+hauteurMonde, worldZ, textures, chunkGroup);
            }

            if (Math.random() < 1 / fleurregularity) {
                const terrainHeight = getTerrainHeightAt(worldX, worldZ);
                generateModel3D(fleurModel, 'plantModel', worldX, (terrainHeight + 1)+hauteurMonde, worldZ, textures['fleur'], chunkGroup);
            }

            if (Math.random() < 1 / seedregularity) {
                const terrainHeight = getTerrainHeightAt(worldX, worldZ);
                generateModel3D(plantModel, 'plantModel', worldX, (terrainHeight + 1)+hauteurMonde, worldZ, textures['seed'], chunkGroup);
            }
        }
    }

    // Ajouter le groupe de ce chunk à la scène
    scene.add(chunkGroup);

    // Stocker ce chunk et ses blocs dans la map
    const chunkKey = `${chunkX},${chunkZ}`;
generatedChunks.set(chunkKey, { group: chunkGroup, blocks });
}



function updateChunkVisibility() {
    // Parcourir tous les chunks générés
    for (const [chunkKey, chunkGroup] of generatedChunks) {
        // Parcourir tous les blocs dans chaque chunk
        for (let i = 0; i < chunkGroup.children.length; i++) {
            const block = chunkGroup.children[i];

            // Masquer tous les blocs sauf les plus hauts
            if (isTopBlock(block, chunkGroup)) {
                block.visible = true;  // Afficher le bloc s'il est le plus haut
            } else {
                block.visible = false;  // Masquer les autres blocs
            }
        }
    }
}

function isTopBlock(block, chunkGroup) {
    const blockX = block.position.x;
    const blockZ = block.position.z;
    let highestY = -Infinity;
    let topBlock = null;

    // Parcourir tous les blocs pour trouver le plus haut à ces coordonnées (x, z)
    for (let i = 0; i < chunkGroup.children.length; i++) {
        const otherBlock = chunkGroup.children[i];
        if (otherBlock.position.x === blockX && otherBlock.position.z === blockZ) {
            if (otherBlock.position.y > highestY) {
                highestY = otherBlock.position.y;
                topBlock = otherBlock;
            }
        }
    }

    // Vérifier si ce bloc est le plus haut
    return block === topBlock;
}


function checkGround() {
    const blockBelow = checkBlockBelowPlayer();
    
    if (blockBelow) {
        const playerY = camera.position.y;
        
        // Si la position Y de la caméra est proche du bloc en dessous, on considère que le joueur est au sol
        if (playerY <= blockBelow.height + playerHeight) {
            return true;  // Le joueur est au sol
        }
    }
    
    return false;  // Le joueur n'est pas au sol
}


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


const generatedChunks = new Map();  // Utilisez une Map pour stocker les chunks générés

// Fonction pour convertir la position en coordonnées de chunk
function getChunkCoordinates(x, z) {
    const chunkX = Math.floor(x / chunkSize);
    const chunkZ = Math.floor(z / chunkSize);
    return `${chunkX},${chunkZ}`;
}

let lastChunkX, lastChunkZ;


function generateChunksAroundPlayer() {
    const playerX = Math.floor(camera.position.x / chunkSize);
    const playerZ = Math.floor(camera.position.z / chunkSize);

    const visibleChunks = new Set();

    // Générer des chunks autour du joueur dans la distance définie
    for (let dx = -chunkDistance; dx <= chunkDistance; dx++) {
        for (let dz = -chunkDistance; dz <= chunkDistance; dz++) {
            const chunkX = playerX + dx;
            const chunkZ = playerZ + dz;
            const chunkKey = `${chunkX},${chunkZ}`;
            visibleChunks.add(chunkKey);

            // Générer ou afficher les chunks si non déjà générés
            if (!generatedChunks.has(chunkKey)) {
                generateChunk(chunkX, chunkZ);
            } else {
                showChunk(generatedChunks.get(chunkKey));  // Assurez-vous de les rendre visibles
            }
        }
    }

    // Masquer les chunks qui ne sont plus dans le champ de vision
    for (const [chunkKey, chunkData] of generatedChunks) {
        const chunkGroup = chunkData.group;
        const [chunkX, chunkZ] = chunkKey.split(',').map(Number);
        const distanceX = Math.abs(chunkX - playerX);
        const distanceZ = Math.abs(chunkZ - playerZ);

        // Si le chunk est en dehors de la portée, le masquer
        if (distanceX > chunkDistance || distanceZ > chunkDistance) {
            hideChunk(chunkGroup);
        } else {
            showChunk(chunkData); // Rendre visible si c'est dans la portée
        }
    }
}




        generateChunksAroundPlayer();

function hideChunk(chunkGroup) {
    if (chunkGroup) {
        chunkGroup.visible = false;  // Masquer le chunk
    }
}

function showChunk(chunkData) {
    const chunkGroup = chunkData.group;
    if (chunkGroup) {
        chunkGroup.visible = true;  // Rendre le chunk visible
    }
}





// Fonction pour régénérer un chunk à partir des données sauvegardées
function regenerateChunkFromData(chunkX, chunkZ, chunkData) {
    for (const block of chunkData) {
        // Créer la couche d'herbe en haut
        createCube(block.x, block.height, block.z, grassTexture);

        // Ajouter des couches de terre sous l'herbe
        for (let y = 0; y < block.height; y++) {
            createCube(block.x, y, block.z, dirtTexture);
        }
    }

    // Ajouter le chunk dans la map
    const chunkKey = `${chunkX},${chunkZ}`;
    generatedChunks.set(chunkKey, chunkData);
}



function createChunkGroup() {
    const chunkGroup = new THREE.Group();  // Créer un groupe de cubes
    return chunkGroup;
}

function addCubeToGroup(chunkGroup, x, y, z, texture) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    chunkGroup.add(cube);  // Ajouter le cube au groupe
}




function addVisibleCubeToGroup(chunkGroup, x, y, z, texture, blocks) {
    const directions = [
        { dx: 1, dy: 0, dz: 0 },  // Face droite
        { dx: -1, dy: 0, dz: 0 }, // Face gauche
        { dx: 0, dy: 1, dz: 0 },  // Face du haut
        { dx: 0, dy: -1, dz: 0 }, // Face du bas
        { dx: 0, dy: 0, dz: 1 },  // Face avant
        { dx: 0, dy: 0, dz: -1 }  // Face arrière
    ];

    const grassMaterials = [
        new THREE.MeshLambertMaterial({ map: grassSideTexture }),  // Droite
        new THREE.MeshLambertMaterial({ map: grassSideTexture }),  // Gauche
        new THREE.MeshLambertMaterial({ map: grassTexture }),      // Dessus
        new THREE.MeshLambertMaterial({ map: dirtTexture }),       // Dessous
        new THREE.MeshLambertMaterial({ map: grassSideTexture }),  // Devant
        new THREE.MeshLambertMaterial({ map: grassSideTexture })   // Derrière
    ];

    const dirtMaterial = new THREE.MeshLambertMaterial({ map: dirtTexture });

    // Créer un tableau de matériaux pour chaque bloc
    const materials = texture === grassTexture ? grassMaterials : [dirtMaterial, dirtMaterial, dirtMaterial, dirtMaterial, dirtMaterial, dirtMaterial];

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(x, y, z);

    // Vérifier si au moins une face est exposée
    let isExposed = false;

    for (const dir of directions) {
        const neighborKey = `${x + dir.dx},${y + dir.dy},${z + dir.dz}`;
        if (!blocks[neighborKey]) {
            isExposed = true;
            break;  // Une face est exposée, inutile de continuer
        }
    }

    if (isExposed) {
        chunkGroup.add(cube);  // Ajouter le cube uniquement s'il a une face exposée
    }

    // Stocker le bloc pour pouvoir vérifier ses voisins plus tard
    blocks[`${x},${y},${z}`] = cube;
}





function isBlockInFrustum(block, camera, margin = bordurecam) {
    const frustum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4();

    camera.updateMatrixWorld();
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    // Augmenter légèrement la zone de détection
    frustum.planes.forEach(plane => {
        plane.constant -= margin;  // Ajuster la marge pour éviter la disparition des arbres
    });

    const position = new THREE.Vector3();
    position.setFromMatrixPosition(block.matrixWorld);

    return frustum.containsPoint(position);
}



function updateVisibilityDistance() {
    const playerX = camera.position.x;
    const playerY = camera.position.y;
    const playerZ = camera.position.z;

    // Calculer la distance de visibilité en fonction de la hauteur et de la position horizontale
    let baseDistance = mediumDistance;  // Distance de base pour les blocs proches
    let heightFactor = playerY / 10;  // Facteur basé sur la hauteur du joueur
    let positionFactor = Math.sqrt(playerX * playerX + playerZ * playerZ) / 50;  // Ajuste selon la distance horizontale

    // Ajuster la distance visible des blocs en fonction de la hauteur et de la position du joueur
    mediumDistance = baseDistance + heightFactor * 10 + positionFactor * 20;  // Ajuste ce facteur selon les besoins
}

function generateModel3D(model, modelType, positionX, positionY, positionZ, texture, chunkGroup) {
    const modelHeight = model.length;

    for (let y = 0; y < modelHeight; y++) {
        const layer = model[y];

        for (let z = 0; z < layer.length; z++) {
            for (let x = 0; x < layer[z].length; x++) {
                const blockType = layer[z][x];

                if (blockType !== 0) { // Si le bloc n'est pas vide
                    let texture = textures[blockType]; // Récupérer la bonne texture (wood ou leaf)

                    if (modelType === 'treeModel') {
                        // Créer et ajouter le cube d'arbre au chunk
                        const treeCube = createCube(positionX + x, positionY + y, positionZ + z, texture, blockType === 'wood');
                        chunkGroup.add(treeCube);  // Ajouter le cube de l'arbre au chunk
                    }

                    if (modelType === 'plantModel') {
                        // Créer et ajouter la graine ou fleur (en fonction de la texture) au chunk
                        const plant = createSeed(positionX, positionY, positionZ, texture);
                        chunkGroup.add(plant);
                    }
                }
            }
        }
    }
}




// Exemple d'appel de la fonction

// Fonction pour obtenir la hauteur du terrain
function getTerrainHeightAt(x, z) {
    // Ici, un exemple simple basé sur le bruit de Perlin
    let noiseValue = (noise.simplex2(x / scale, z / scale) + 1) / 2;
    return Math.floor(noiseValue * maxHeight);
}

function createSeed(x, y, z, texture) {
    const group = new THREE.Group();  // Un groupe pour les deux plans

    // Créer le premier plan, tourné de 45 degrés
    const geometry1 = new THREE.PlaneGeometry(1, 1);
    const material1 = new THREE.MeshLambertMaterial({ 
        map: texture, 
        transparent: true,  // Activer la transparence
        alphaTest: 0.5,     // Test alpha pour éviter les artefacts
        side: THREE.DoubleSide  // Rendre la texture visible des deux côtés
    });
    const plane1 = new THREE.Mesh(geometry1, material1);
    plane1.position.set(0, 0, 0);  // Collé au sol (y = 0)
    plane1.rotation.y = Math.PI / 4;  // Tourner de 45 degrés
    group.add(plane1);  // Ajouter au groupe

    // Créer le deuxième plan, tourné de -45 degrés
    const geometry2 = new THREE.PlaneGeometry(1, 1);
    const material2 = new THREE.MeshLambertMaterial({ 
        map: texture, 
        transparent: true,  
        alphaTest: 0.5,
        side: THREE.DoubleSide  // Rendre la texture visible des deux côtés
    });
    const plane2 = new THREE.Mesh(geometry2, material2);
    plane2.position.set(0, 0, 0);  // Collé au sol (y = 0)
    plane2.rotation.y = -Math.PI / 4;  // Tourner de -45 degrés
    group.add(plane2);  // Ajouter au groupe

    // Positionner le groupe à l'emplacement du bloc
    group.position.set(x, y, z);

    return group;  // Retourner le groupe contenant les deux plans
}


function breakBlock() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera); // Centre de l'écran

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const targetBlock = intersects[0].object;
        const blockPos = targetBlock.position.clone();

        // Trouver le chunk contenant ce bloc
        const chunkKey = getChunkCoordinates(blockPos.x, blockPos.z);
        if (generatedChunks.has(chunkKey)) {
            const chunkData = generatedChunks.get(chunkKey);
            const chunkGroup = chunkData.group;
            const blocks = chunkData.blocks;

            // Supprimer le bloc du groupe et du tableau blocks
            chunkGroup.remove(targetBlock);
            const blockKey = `${blockPos.x},${blockPos.y},${blockPos.z}`;
            delete blocks[blockKey];

            // Supprimer le bloc de la scène
            scene.remove(targetBlock);

            // Afficher le bloc en dessous en fonction de la hauteur
            const blockBelowPos = blockPos.clone().add(new THREE.Vector3(0, -1, 0));
            if (blockBelowPos.y >= 0) {
                let textureToUse = stoneTexture;  // Par défaut, utiliser 'stone'
                
                if (blockBelowPos.y >= 6) {
                    textureToUse = dirtTexture;  // Utiliser 'dirt' pour les hauteurs >= 6
                }

                // Créer et ajouter le nouveau bloc en dessous
                const newBlockBelow = createCube(blockBelowPos.x, blockBelowPos.y, blockBelowPos.z, textureToUse, true);
                scene.add(newBlockBelow);
                chunkGroup.add(newBlockBelow);
                blocks[`${blockBelowPos.x},${blockBelowPos.y},${blockBelowPos.z}`] = newBlockBelow;

                // Si le bloc est sous terre (en dessous de la surface)
                if (blockBelowPos.y < 6) {
                    fillAdjacentBlocks(blockBelowPos, textureToUse, chunkGroup, blocks);  // Remplir les côtés et le dessous
                }
            }

            // Mettre à jour les blocs adjacents
            updateAdjacentBlocks(blockPos);
        }
    }
}

function fillAdjacentBlocks(blockPos, texture, chunkGroup, blocks) {
    const directions = [
        new THREE.Vector3(1, 0, 0),  // Droite
        new THREE.Vector3(-1, 0, 0), // Gauche
        new THREE.Vector3(0, 0, 1),  // Avant
        new THREE.Vector3(0, 0, -1), // Arrière
        new THREE.Vector3(0, -1, 0)  // Dessous
    ];

    directions.forEach(dir => {
        const neighborPos = blockPos.clone().add(dir);
        const blockKey = `${neighborPos.x},${neighborPos.y},${neighborPos.z}`;

        // Si le bloc adjacent n'existe pas encore, créer et ajouter le bloc
        if (!blocks[blockKey]) {
            const newBlock = createCube(neighborPos.x, neighborPos.y, neighborPos.z, texture, true);
            scene.add(newBlock);
            chunkGroup.add(newBlock);
            blocks[blockKey] = newBlock;
        }
    });
}




function placeBlock() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera); // Centre de l'écran

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const targetBlock = intersects[0].object;
        const blockPos = targetBlock.position.clone();
        const normal = intersects[0].face.normal; // Normal de la face touchée

        // Calculer la nouvelle position pour le bloc à poser, y compris sur le sol
        const newBlockPos = blockPos.add(normal);

        // Créer et ajouter le nouveau bloc au sol ou sur un autre bloc
        const newBlock = createCube(newBlockPos.x, newBlockPos.y, newBlockPos.z, stoneTexture, true);
        scene.add(newBlock);

        updateAdjacentBlocks(newBlockPos);  // Mettre à jour les blocs adjacents pour la visibilité
    }
}



function updateAdjacentBlocks(position) {
    const directions = [
        new THREE.Vector3(1, 0, 0),  // Droite
        new THREE.Vector3(-1, 0, 0), // Gauche
        new THREE.Vector3(0, 1, 0),  // Haut
        new THREE.Vector3(0, -1, 0), // Bas (y compris les blocs du sol)
        new THREE.Vector3(0, 0, 1),  // Avant
        new THREE.Vector3(0, 0, -1)  // Arrière
    ];

    directions.forEach(dir => {
        const neighborPos = position.clone().add(dir);
        const neighborBlock = findBlockAt(neighborPos);

        // Si le bloc adjacent existe, mettre à jour sa visibilité
        if (neighborBlock) {
            const isExposed = checkBlockExposure(neighborBlock);
            neighborBlock.visible = isExposed;
        }
    });
}


function findBlockAt(position) {
    // Parcourir tous les blocs de la scène pour trouver celui à la position donnée
    for (let i = 0; i < scene.children.length; i++) {
        const obj = scene.children[i];
        if (obj.position.equals(position)) {
            return obj;
        }
    }
    return null;
}

function checkBlockExposure(block) {
    const directions = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1)
    ];

    // Si au moins une des faces est exposée (pas de bloc adjacent), le bloc est visible
    return directions.some(dir => !findBlockAt(block.position.clone().add(dir)));
}



//Qualité

// Obtenez l'élément du slider de qualité
let qualityInput = document.getElementById("quality");

// Initialisez la qualité de rendu
let quality = parseInt(qualityInput.value);

// Fonction pour ajuster la qualité de rendu
function adjustRenderingQuality(quality) {
    let width, height;

    // Définir la taille d'affichage et la résolution interne en fonction de la qualité
    switch (quality) {
        case 1: // Basse
            width = Math.floor(window.innerWidth); // Largeur complète de la fenêtre
            height = Math.floor(window.innerHeight); // Hauteur complète de la fenêtre
            renderer.setPixelRatio(window.devicePixelRatio * 0.3); // Réduction de la résolution
            renderer.antialias = false; // Désactiver l'anti-aliasing
            break;
        case 2: // Moyenne
            width = Math.floor(window.innerWidth); // Largeur complète de la fenêtre
            height = Math.floor(window.innerHeight); // Hauteur complète de la fenêtre
            renderer.setPixelRatio(window.devicePixelRatio * 0.5); // Augmentation de la résolution
            renderer.antialias = true; // Activer l'anti-aliasing
            break;
        case 3: // Haute
            width = Math.floor(window.innerWidth); // Largeur complète de la fenêtre
            height = Math.floor(window.innerHeight); // Hauteur complète de la fenêtre
            renderer.setPixelRatio(window.devicePixelRatio * 0.7); // Augmentation de la résolution
            renderer.antialias = true; // Activer l'anti-aliasing
            break;
        case 4: // Ultra
            width = Math.floor(window.innerWidth); // Largeur complète de la fenêtre
            height = Math.floor(window.innerHeight); // Hauteur complète de la fenêtre
            renderer.setPixelRatio(window.devicePixelRatio); // Résolution normale
            renderer.antialias = true; // Activer l'anti-aliasing
            break;
    }

    // Ajuster la taille du renderer
    renderer.setSize(width, height);
    
    // Ajuster le style CSS pour le canvas
    renderer.domElement.style.width = "100%"; // Largeur à 100%
    renderer.domElement.style.height = "100%"; // Hauteur à 100%

    camera.aspect = width / height; // Ajuster le rapport d'aspect de la caméra
    camera.updateProjectionMatrix(); // Mettre à jour la matrice de projection
}

// Écoutez les changements du slider de qualité
qualityInput.addEventListener("input", function() {
    quality = parseInt(this.value);
    document.getElementById("qualityValue").innerText = quality;
    
    // Ajustez la qualité de rendu
    adjustRenderingQuality(quality);
});

// Afficher la valeur initiale dans le formulaire
document.getElementById("qualityValue").innerText = quality;

// Ajustez la qualité de rendu au démarrage
adjustRenderingQuality(quality);

// Redimensionner le canvas et le renderer lorsque la fenêtre change de taille
window.addEventListener('resize', () => {
    adjustRenderingQuality(quality); // Réappliquez la qualité de rendu actuelle
});

// Initialiser le renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Ajouter le canvas au document
