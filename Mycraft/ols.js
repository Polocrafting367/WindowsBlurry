const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // Activer les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Type d'ombre (soft shadows pour plus de douceur)
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
light.castShadow = true;  // Permettre � la lumi�re de projeter des ombres

// Configurer la taille et la r�solution des ombres
light.shadow.mapSize.width = 1024;  // R�solution de la texture des ombres
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;  // Ajuster la distance minimale de projection
light.shadow.camera.far = 50;    // Ajuster la distance maximale de projection


// Cr�er la sc�ne, la cam�ra et le moteur de rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Cr�er le contr�le du joueur � la premi�re personne (PointerLockControls)
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());
scene.add(light);

// Forcer le verrouillage de la souris d�s le chargement de la page
controls.lock();

// Variables de mouvement
var moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
var moveUp = false, moveDown = false;  // Nouvelles variables pour le d�placement vertical
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();




// Positionner la cam�ra l�g�rement au-dessus du sol
camera.position.y = 1.8;


document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Fonction d'animation
let prevTime = performance.now();
function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

        // D�placer la cam�ra horizontalement
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        // D�placer la cam�ra verticalement
        if (moveUp) camera.position.y += verticalSpeed * delta;
        if (moveDown) camera.position.y -= verticalSpeed * delta;

        // G�n�rer les chunks autour du joueur
        generateChunksAroundPlayer();

        prevTime = time;
    }

    renderer.render(scene, camera);
}
animate();

// Redimensionner la sc�ne quand la fen�tre change de taille
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// R�introduire les �l�ments de contr�le
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

// Quand l'utilisateur clique n'importe o� sur la page, verrouiller le pointeur
document.addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    instructions.style.display = 'none';  // Masquer le message de d�marrage
    blocker.style.display = 'none';
});

controls.addEventListener('unlock', () => {
    blocker.style.display = 'block';  // R�afficher le message si le contr�le est d�sactiv�
    instructions.style.display = '';
});


// Cr�er un ciel avec un d�grad� de bleu
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

// D�finir les couleurs et les param�tres du ciel
const uniforms = {
  topColor: { value: new THREE.Color(0x87CEEB) }, // Bleu clair en haut
  bottomColor: { value: new THREE.Color(0x1E90FF) }, // Bleu plus fonc� en bas
  offset: { value: 33 },
  exponent: { value: 0.6 }
};

// Cr�er la g�om�trie de la sph�re (pour le ciel)
const skyGeo = new THREE.SphereGeometry(500, 32, 15);
const skyMat = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: uniforms,
  side: THREE.BackSide
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);


function createCube(x, y, z, texture) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = texture ? new THREE.MeshLambertMaterial({ map: texture }) : new THREE.MeshLambertMaterial({ color: 0x888888 });
    const cube = new THREE.Mesh(geometry, material);
    
    // Configurer les ombres
    cube.castShadow = true;    // Le cube projette des ombres
    cube.receiveShadow = true;  // Le cube re�oit des ombres
    
    cube.position.set(x, y, z);
    scene.add(cube);
}



function generateChunk(chunkX, chunkZ) {
    const minGroundLevel = 1;  // La couche de terre minimale sous chaque bloc d'herbe
    const chunkGroup = new THREE.Group();  // Cr�er un groupe pour le chunk
    const blocks = {};  // Stocker les positions des blocs du chunk

    for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
            // Calculer la position r�elle dans le monde
            const worldX = chunkX * chunkSize + x;
            const worldZ = chunkZ * chunkSize + z;

            // G�n�rer la hauteur � partir du bruit
            let height = Math.floor(noise.simplex2(worldX / scale, worldZ / scale) * maxHeight);
            if (height < minGroundLevel) height = minGroundLevel;

            // Stocker chaque bloc pour v�rifier les voisins
            for (let y = 0; y < height; y++) {
                const key = `${worldX},${y},${worldZ}`;
                blocks[key] = true;
            }

            // V�rifier les blocs voisins pour les faces visibles
            addVisibleCubeToGroup(chunkGroup, worldX, height, worldZ, grassTexture, blocks);

            // Ajouter des couches de terre sous l'herbe
            for (let y = 0; y < height; y++) {
                addVisibleCubeToGroup(chunkGroup, worldX, y, worldZ, dirtTexture, blocks);  // Blocs de terre
            }
        }
    }

    // Ajouter le chunk au groupe et � la sc�ne
    scene.add(chunkGroup);
    
    // Sauvegarder le groupe dans generatedChunks
    const chunkKey = `${chunkX},${chunkZ}`;
    generatedChunks.set(chunkKey, chunkGroup);
}



// Limiter le nombre de chunks stock�s dans le localStorage
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


const generatedChunks = new Map();  // Utilisez une Map pour stocker les chunks g�n�r�s

// Fonction pour convertir la position en coordonn�es de chunk
function getChunkCoordinates(x, z) {
    const chunkX = Math.floor(x / chunkSize);
    const chunkZ = Math.floor(z / chunkSize);
    return `${chunkX},${chunkZ}`;
}

let lastChunkX, lastChunkZ;

function generateChunksAroundPlayer() {
    const playerX = Math.floor(camera.position.x / chunkSize);
    const playerZ = Math.floor(camera.position.z / chunkSize);

    // V�rifier si le joueur a chang� de chunk avant de g�n�rer
    if (playerX === lastChunkX && playerZ === lastChunkZ) {
        return;  // Ne rien faire si le joueur n'a pas chang� de chunk
    }

    lastChunkX = playerX;
    lastChunkZ = playerZ;

    const visibleChunks = new Set();

    // G�n�rer les chunks visibles autour du joueur
    for (let dx = -chunkDistance; dx <= chunkDistance; dx++) {
        for (let dz = -chunkDistance; dz <= chunkDistance; dz++) {
            const chunkX = playerX + dx;
            const chunkZ = playerZ + dz;
            const chunkKey = `${chunkX},${chunkZ}`;
            visibleChunks.add(chunkKey);

            if (!generatedChunks.has(chunkKey)) {
                const storedChunk = localStorage.getItem(chunkKey);
                if (storedChunk) {
                    const chunkData = JSON.parse(storedChunk);
                    regenerateChunkFromData(chunkX, chunkZ, chunkData);
                } else {
                    generateChunk(chunkX, chunkZ);  // G�n�rer un nouveau chunk
                }
            } else {
                // Si le chunk est d�j� g�n�r�, simplement le rendre visible
                showChunk(generatedChunks.get(chunkKey));
            }
        }
    }

    // Masquer les chunks qui ne sont plus visibles
    for (const [chunkKey, chunkGroup] of generatedChunks) {
        if (!visibleChunks.has(chunkKey)) {
            hideChunk(chunkGroup);
        }
    }

    cleanUpLocalStorage();
}



// Fonction pour r�g�n�rer un chunk � partir des donn�es sauvegard�es
function regenerateChunkFromData(chunkX, chunkZ, chunkData) {
    for (const block of chunkData) {
        // Cr�er la couche d'herbe en haut
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

// Fonction pour masquer ou supprimer un chunk
// Fonction pour masquer ou supprimer un chunk
function hideChunk(chunkGroup) {
    if (chunkGroup) {
        chunkGroup.visible = false;  // Masquer tout le groupe
    }
}

function createChunkGroup() {
    const chunkGroup = new THREE.Group();  // Cr�er un groupe de cubes
    return chunkGroup;
}

function addCubeToGroup(chunkGroup, x, y, z, texture) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    chunkGroup.add(cube);  // Ajouter le cube au groupe
}

function showChunk(chunkGroup) {
    if (chunkGroup) {
        chunkGroup.visible = true;  // Afficher le groupe
    }
}

function addVisibleCubeToGroup(chunkGroup, x, y, z, texture, blocks) {
    const directions = [
        { dx: 1, dy: 0, dz: 0 },  // Face droite
        { dx: -1, dy: 0, dz: 0 }, // Face gauche
        { dx: 0, dy: 1, dz: 0 },  // Face du haut
        { dx: 0, dy: -1, dz: 0 }, // Face du bas
        { dx: 0, dy: 0, dz: 1 },  // Face avant
        { dx: 0, dy: 0, dz: -1 }  // Face arri�re
    ];

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);

    // V�rifier chaque face
    directions.forEach(dir => {
        const neighborKey = `${x + dir.dx},${y + dir.dy},${z + dir.dz}`;
        if (!blocks[neighborKey]) {
            chunkGroup.add(cube);  // Ajouter le cube � la sc�ne si la face est visible
        }
    });
}
