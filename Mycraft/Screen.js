function animate() {
    const currentTime = performance.now();
    fpsCounter++;
    requestAnimationFrame(animate);

    // Mise à jour des FPS
    if (currentTime - lastTime >= 1000) {
        document.getElementById('fps').innerText = fpsCounter;
        fpsCounter = 0;  // Réinitialiser le compteur
        lastTime = currentTime;
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
        velocity.x -= velocity.x * 1.0 * delta;
        velocity.z -= velocity.z * 1.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

        // Gérer le mouvement vertical (vol ou chute)
        if (isFlying) {
            if (moveUp) velocityY = verticalSpeed;  // Monter
            else if (moveDown) velocityY = -verticalSpeed;  // Descendre
            else velocityY = 0;  // Aucun mouvement vertical
        } else {
            if (!isOnGround) velocityY -= gravity * delta;  // Appliquer la gravité si on ne vole pas
        }

        // Mettre à jour les chunks
for (const [chunkKey, chunkData] of generatedChunks) {
    const chunkGroup = chunkData.group;
    if (chunkGroup && chunkGroup.children) {
        for (let i = 0; i < chunkGroup.children.length; i++) {
            const block = chunkGroup.children[i];

            // Masquer le bloc si aucune face n'est exposée à l'air
            if (isBlockExposedToAir(block, chunkData.blocks)) {
                block.visible = true;
            } else {
                block.visible = false;
            }
        }
    }
}


        // Appliquer la gravité ou régler la position verticale du joueur
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

        // Mise à jour de la distance de visibilité et génération de nouveaux chunks
        updateVisibilityDistance();
        generateChunksAroundPlayer();

        // Appliquer le mouvement en X et Z
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        prevTime = time;
    }

    // Rendu de la scène
    renderer.render(scene, camera);
}

animate();

// Redimensionner la scène quand la fenêtre change de taille
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});



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

function isBlockExposedToAir(block, blocks) {
    const directions = [
        { dx: 1, dy: 0, dz: 0 },  // Droite
        { dx: -1, dy: 0, dz: 0 }, // Gauche
        { dx: 0, dy: 1, dz: 0 },  // Haut
        { dx: 0, dy: -1, dz: 0 }, // Bas
        { dx: 0, dz: 1, dz: 0 },  // Avant
        { dx: 0, dz: -1, dz: 0 }  // Arrière
    ];

    // Vérifie si une des faces du bloc est adjacente à un bloc d'air
    return directions.some(dir => {
        const neighborKey = `${block.position.x + dir.dx},${block.position.y + dir.dy},${block.position.z + dir.dz}`;
        const neighborBlock = blocks[neighborKey];

        // Un bloc est exposé si son voisin est un bloc d'air ou s'il n'y a pas de voisin
        return !neighborBlock || neighborBlock.isAirBlock;
    });
}


function isBlockInFrustum(block, camera, blocks, margin = bordurecam) {
    const frustum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4();

    // Mettre à jour la matrice de la caméra
    camera.updateMatrixWorld();
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    // Ajuster la marge pour le frustum
    frustum.planes.forEach(plane => {
        plane.constant -= margin;
    });

    // Vérifie si le bloc est dans le champ de la caméra
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(block.matrixWorld);

    if (frustum.containsPoint(position)) {
        // Si le bloc est dans le frustum, vérifier si au moins une de ses faces est exposée à l'air
        return isBlockExposedToAir(block, blocks);
    }

    return false;
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
