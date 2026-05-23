

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
        const chunkData = generatedChunks.get(chunkKey);

        for (let i = 0; i < chunkData.group.children.length; i++) {
            const block = chunkData.group.children[i];
            if (block.userData.isCollidable) {  // Vérifier uniquement les blocs collidables
                const blockMin = block.position.clone().subScalar(0.5);
                const blockMax = block.position.clone().addScalar(0.5);

                if (x >= blockMin.x && x <= blockMax.x &&
                    y >= blockMin.y && y <= blockMax.y &&
                    z >= blockMin.z && z <= blockMax.z) {
                    return true; // Collision détectée
                }
            }
        }
    }
    return false;  // Aucune collision détectée
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

// Initialisez la qualité de rendu
