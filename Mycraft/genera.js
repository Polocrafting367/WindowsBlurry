
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

function createAirBlock(x, y, z) {
    return {
        position: new THREE.Vector3(x, y, z),
        isAirBlock: true  // Marquer comme un bloc d'air
    };
}



function generateChunk(chunkX, chunkZ) {
    const chunkGroup = new THREE.Group();
    const blocks = {};

    for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
            const worldX = chunkX * chunkSize + x;
            const worldZ = chunkZ * chunkSize + z;

            // Générer des blocs d'air de la couche 0 à 60 sans les ajouter à la scène
            for (let y = 0; y < 60; y++) {
                const airBlock = createAirBlock(worldX, y, worldZ);  // On ne l'ajoute pas à la scène, juste dans la structure de données
                blocks[`${worldX},${y},${worldZ}`] = airBlock;
            }

            // Générer la hauteur du terrain avec le bruit de Perlin
            const terrainHeight = getTerrainHeightAt(worldX, worldZ) + hauteurMonde;  // Calculer la hauteur du terrain

            // Remplacer les blocs d'air par des blocs réels (dirt et grass) jusqu'à la hauteur du terrain
            for (let y = 0; y <= terrainHeight; y++) {
                const texture = (y === terrainHeight) ? grassTexture : dirtTexture;  // Si on est au sommet, on utilise de l'herbe, sinon de la terre
                addBlockToChunk(chunkGroup, worldX, y, worldZ, texture, blocks);
            }

            // Générer des structures (arbres, plantes, etc.)
            generateStructures(worldX, terrainHeight, worldZ, chunkGroup, blocks);
        }
    }

    // Ajouter le chunk généré à la scène
    scene.add(chunkGroup);
    generatedChunks.set(`${chunkX},${chunkZ}`, { group: chunkGroup, blocks });
}



function generateStructures(worldX, terrainHeight, worldZ, chunkGroup, blocks) {
    if (terrainHeight > 0) {  // Ne générer des structures que sur la surface
        if (Math.random() < 1 / treeregularity) {
            generateModel3D(treeModel, 'treeModel', worldX, terrainHeight, worldZ, textures['wood'], chunkGroup);
        }
        if (Math.random() < 1 / fleurregularity) {
            generateModel3D(fleurModel, 'plantModel', worldX, terrainHeight + 1, worldZ, textures['fleur'], chunkGroup);
        }
        if (Math.random() < 1 / seedregularity) {
            generateModel3D(plantModel, 'plantModel', worldX, terrainHeight + 1, worldZ, textures['seed'], chunkGroup);
        }
    }
}

function generateAndReplaceModel(modelType, model, worldX, worldY, worldZ, textures, chunkGroup, blocks) {
    const modelHeight = model.length;

    for (let y = 0; y < modelHeight; y++) {
        const layer = model[y];

        for (let z = 0; z < layer.length; z++) {
            for (let x = 0; x < layer[z].length; x++) {
                const blockType = layer[z][x];

                if (blockType !== 0) {
                    const blockKey = `${worldX + x},${worldY + y},${worldZ + z}`;
                    const texture = textures[blockType];

                    if (!blocks[blockKey]) {
                        const isCollidable = (blockType === 'wood');
                        const block = createBlock(worldX + x, worldY + y, worldZ + z, texture, isCollidable);
                        chunkGroup.add(block);
                        blocks[blockKey] = block;

                        // Mettre à jour la visibilité des faces
                        updateBlockVisibility(block, blocks);
                    }
                }
            }
        }
    }
}


function addBlockToChunk(chunkGroup, x, y, z, texture, blocks, isCollidable = false, isVisible = true) {
    const blockKey = `${x},${y},${z}`;
    const airBlock = blocks[blockKey];

    if (airBlock && airBlock.isAirBlock) {
        blocks[blockKey] = null;  // Supprimer le bloc d'air de la mémoire

        const block = createBlock(x, y, z, texture, isCollidable, isVisible);
        chunkGroup.add(block);
        blocks[blockKey] = block;


        updateBlockVisibility(block, blocks);
    } else {
    }
}

function initializePlayerPosition() {
    const playerX = Math.floor(camera.position.x);
    const playerZ = Math.floor(camera.position.z);
    
    // Récupérer la hauteur du terrain à la position du joueur
    const terrainHeight = getTerrainHeightAt(playerX, playerZ) + hauteurMonde;
    
    // Placer le joueur légèrement au-dessus du terrain
    camera.position.set(playerX, terrainHeight + 1, playerZ);
}


function createBlock(x, y, z, texture, isCollidable = false, isVisible = true) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Assurer que chaque face a un matériau
    const materials = [
        new THREE.MeshLambertMaterial({ map: texture }), // Droite
        new THREE.MeshLambertMaterial({ map: texture }), // Gauche
        new THREE.MeshLambertMaterial({ map: texture }), // Haut
        new THREE.MeshLambertMaterial({ map: texture }), // Bas
        new THREE.MeshLambertMaterial({ map: texture }), // Avant
        new THREE.MeshLambertMaterial({ map: texture })  // Arrière
    ];

    const block = new THREE.Mesh(geometry, materials);
    block.position.set(x, y, z);

    block.userData = { isCollidable };
    block.visible = isVisible;

    return block;
}


function addBlockToChunk(chunkGroup, x, y, z, texture, blocks, isCollidable = false) {
    const blockKey = `${x},${y},${z}`;
    const airBlock = blocks[blockKey];

    if (airBlock && airBlock.isAirBlock) {
        // Supprimer le bloc d'air de la mémoire
        blocks[blockKey] = null;

        // Créer le bloc réel
        const block = createBlock(x, y, z, texture, isCollidable, true);
        chunkGroup.add(block);
        blocks[blockKey] = block;

        // Mettre à jour la visibilité des faces du bloc
        updateBlockVisibility(block, blocks);
    }
}


function updateBlockVisibility(block, blocks) {
    if (!block || !block.material) return;

    const directions = [
        { dx: 1, dy: 0, dz: 0, face: 0 },  // Droite
        { dx: -1, dy: 0, dz: 0, face: 1 }, // Gauche
        { dx: 0, dy: 1, dz: 0, face: 2 },  // Haut
        { dx: 0, dy: -1, dz: 0, face: 3 }, // Bas
        { dx: 0, dz: 1, dz: 0, face: 4 },  // Avant
        { dx: 0, dz: -1, dz: 0, face: 5 }  // Arrière
    ];

    let hasVisibleFaces = false;

    directions.forEach(dir => {
        const neighborKey = `${block.position.x + dir.dx},${block.position.y + dir.dy},${block.position.z + dir.dz}`;
        const neighborBlock = blocks[neighborKey];

        // Si le voisin est un bloc d'air ou inexistant, on rend la face visible
        if (!neighborBlock || neighborBlock.isAirBlock) {
            block.material[dir.face].visible = true;
            hasVisibleFaces = true;
        } else {
            block.material[dir.face].visible = false;
        }
    });

    // Si aucune face n'est visible, le bloc devient invisible
    block.visible = hasVisibleFaces;
}


function getDirections() {
    return [
        { dx: 1, dy: 0, dz: 0 },  // Droite
        { dx: -1, dy: 0, dz: 0 }, // Gauche
        { dx: 0, dy: 1, dz: 0 },  // Haut
        { dx: 0, dy: -1, dz: 0 }, // Bas
        { dx: 0, dz: 1, dz: 0 },  // Avant
        { dx: 0, dz: -1, dz: 0 }  // Arrière
    ];
}

function generateModel3D(model, modelType, posX, posY, posZ, texture, chunkGroup) {
    const modelHeight = model.length;

    for (let y = 0; y < modelHeight; y++) {
        const layer = model[y];

        for (let z = 0; z < layer.length; z++) {
            for (let x = 0; x < layer[z].length; x++) {
                const blockType = layer[z][x];

                if (blockType !== 0) { // Si le bloc n'est pas vide
                    const isCollidable = blockType === 'wood';  // Collidable si bois
                    const blockTexture = textures[blockType];   // Récupérer la texture du bloc

                    // Créer le bloc et l'ajouter au chunk
                    const block = createBlock(posX + x, posY + y, posZ + z, blockTexture, false, isCollidable);
                    chunkGroup.add(block);
                }
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


const generatedChunks = new Map();  // Utilisez une Map pour stocker les chunks générés

// Fonction pour convertir la position en coordonnées de chunk
function getChunkCoordinates(x, z) {
    const chunkX = Math.floor(x / chunkSize);
    const chunkZ = Math.floor(z / chunkSize);
    return `${chunkX},${chunkZ}`;
}

let lastChunkX, lastChunkZ;

function generateAirBlocks(chunkSize, worldX, worldZ) {
    const airBlocks = {};
    for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
            for (let y = 0; y < 60; y++) {  // Générer les blocs d'air jusqu'à 60 de hauteur
                airBlocks[`${worldX + x},${y},${worldZ + z}`] = createAirBlock(worldX + x, y, worldZ + z);
            }
        }
    }
    return airBlocks;
}


function generateChunk(chunkX, chunkZ) {
    const chunkGroup = new THREE.Group();
    const blocks = {};

    for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
            const worldX = chunkX * chunkSize + x;
            const worldZ = chunkZ * chunkSize + z;

            // Générer des blocs d'air de la couche 0 à maxBlockHeight
            for (let y = 0; y < maxBlockHeight; y++) {
                const airBlock = createAirBlock(worldX, y, worldZ);
                blocks[`${worldX},${y},${worldZ}`] = airBlock;
            }

            // Générer la hauteur du terrain et remplacer les blocs d'air
            const terrainHeight = getTerrainHeightAt(worldX, worldZ) + hauteurMonde;
            for (let y = 0; y <= terrainHeight; y++) {
                const texture = (y === terrainHeight) ? grassTexture : dirtTexture;
                addBlockToChunk(chunkGroup, worldX, y, worldZ, texture, blocks, true);
            }

            // Générer des structures (arbres, plantes, etc.)
            generateStructures(worldX, terrainHeight, worldZ, chunkGroup, blocks);
        }
    }

    scene.add(chunkGroup);
    generatedChunks.set(`${chunkX},${chunkZ}`, { group: chunkGroup, blocks });
}


function addInvisibleCubeToGroup(chunkGroup, x, y, z, texture, blocks) {
    const directions = [
        { dx: 1, dy: 0, dz: 0 },  // Face droite
        { dx: -1, dy: 0, dz: 0 }, // Face gauche
        { dx: 0, dy: 1, dz: 0 },  // Face du haut
        { dx: 0, dy: -1, dz: 0 }, // Face du bas
        { dx: 0, dz: 1, dz: 0 },  // Face avant
        { dx: 0, dz: -1, dz: 0 }  // Face arrière
    ];

    const invisibleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const invisibleCube = new THREE.Mesh(invisibleGeometry, invisibleMaterial);
    invisibleCube.position.set(x, y, z);

    chunkGroup.add(invisibleCube);  // Ajouter les blocs invisibles pour calculer la visibilité
    blocks[`${x},${y},${z}`] = invisibleCube;

    // Vérifiez si le bloc a une face touchant l'air ou un bloc invisible
    let isExposed = false;
    for (const dir of directions) {
        const neighborKey = `${x + dir.dx},${y + dir.dy},${z + dir.dz}`;
        if (!blocks[neighborKey]) {
            isExposed = true;
            break;
        }
    }

    if (isExposed) {
        const visibleGeometry = new THREE.BoxGeometry(1, 1, 1);
        const visibleCube = new THREE.Mesh(visibleGeometry, new THREE.MeshLambertMaterial({ map: texture }));
        visibleCube.position.set(x, y, z);
        chunkGroup.add(visibleCube);  // Afficher le cube s'il est exposé à l'air
    }
}

function updateAdjacentBlocks(block, blocks) {
    const directions = getDirections();

    directions.forEach(dir => {
        const neighborKey = `${block.position.x + dir.dx},${block.position.y + dir.dy},${block.position.z + dir.dz}`;
        const neighborBlock = blocks[neighborKey];

        if (neighborBlock) {
            updateBlockVisibility(neighborBlock, blocks);
        }
    });
}

function checkBlockExposure(block, blocks) {
    const directions = [
        { dx: 1, dy: 0, dz: 0 },  // Droite
        { dx: -1, dy: 0, dz: 0 }, // Gauche
        { dx: 0, dy: 1, dz: 0 },  // Haut
        { dx: 0, dy: -1, dz: 0 }, // Bas
        { dx: 0, dz: 1, dz: 0 },  // Avant
        { dx: 0, dz: -1, dz: 0 }  // Arrière
    ];

    // Vérifier chaque face du bloc
    return directions.some(dir => {
        const neighborKey = `${block.position.x + dir.dx},${block.position.y + dir.dy},${block.position.z + dir.dz}`;
        const neighborBlock = blocks[neighborKey];

        // Si un des voisins est un bloc d'air ou inexistant, la face est exposée
        return !neighborBlock || neighborBlock.isAirBlock;
    });
}

function generateChunksAroundPlayer() {
    const playerX = Math.floor(camera.position.x / chunkSize);
    const playerZ = Math.floor(camera.position.z / chunkSize);

    const visibleChunks = new Set();

    for (let dx = -chunkDistance; dx <= chunkDistance; dx++) {
        for (let dz = -chunkDistance; dz <= chunkDistance; dz++) {
            const chunkX = playerX + dx;
            const chunkZ = playerZ + dz;
            const chunkKey = `${chunkX},${chunkZ}`;
            visibleChunks.add(chunkKey);

            // Générer ou afficher les chunks
            if (!generatedChunks.has(chunkKey)) {
                generateChunk(chunkX, chunkZ);
            }
        }
    }

    // Masquer les chunks en dehors du champ de vision
    for (const [chunkKey, chunkData] of generatedChunks) {
        if (!visibleChunks.has(chunkKey)) {
            hideChunk(chunkData.group);
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

function addCubeToGroup(chunkGroup, x, y, z, texture, blocks, isInvisible = false) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    let material;
    if (isInvisible) {
        material = new THREE.MeshBasicMaterial({ visible: false });  // Matériau invisible
    } else {
        material = new THREE.MeshLambertMaterial({ map: texture });
    }
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);

    chunkGroup.add(cube);
    blocks[`${x},${y},${z}`] = cube;  // Stocker le bloc dans la collection

    if (!isInvisible) {
        updateVisibleFaces(cube, blocks);  // Mettre à jour les faces visibles
    }
}

function updateVisibleFaces(block, blocks) {
    const directions = [
        { dx: 1, dy: 0, dz: 0 },  // Droite
        { dx: -1, dy: 0, dz: 0 }, // Gauche
        { dx: 0, dy: 1, dz: 0 },  // Haut
        { dx: 0, dy: -1, dz: 0 }, // Bas
        { dx: 0, dz: 1, dz: 0 },  // Avant
        { dx: 0, dz: -1, dz: 0 }  // Arrière
    ];

    const material = block.material;  // Matériau du bloc
    block.visible = false;  // Cacher toutes les faces par défaut

    directions.forEach(dir => {
        const neighborKey = `${block.position.x + dir.dx},${block.position.y + dir.dy},${block.position.z + dir.dz}`;
        if (!blocks[neighborKey] || !blocks[neighborKey].visible) {
            block.visible = true;  // Rendre visible si une face est exposée à l'air ou un bloc invisible
        }
    });
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







// Exemple d'appel de la fonction

// Fonction pour obtenir la hauteur du terrain
function getTerrainHeightAt(x, z) {
    // Un exemple simple d'utilisation du bruit de Perlin pour générer une hauteur de terrain
    let noiseValue = (noise.simplex2(x / scale, z / scale) + 1) / 2;
    return Math.floor(noiseValue * maxHeight);  // Ajustez `maxHeight` à la hauteur maximale du terrain
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

initializePlayerPosition()