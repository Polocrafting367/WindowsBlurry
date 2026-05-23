   
        const items = []; 
        const mobs = [];  

const HOSTILE_TYPES = ['zombie', 'creeper'];
    const MOB_WIDTH = 0.6;
    const MOB_DEPTH = 0.6;
    const HOSTILE_DETECT_RANGE = 24;
    const HOSTILE_FREEZE_RANGE = 48;
    window.disableMobAI = false;

    function spawnMob(x, y, z, type) {
    if (typeof type === 'object' && Array.isArray(type)) type = type[Math.floor(Math.random() * type.length)];
    const specs = {
        pig: { body: [0.6, 0.5, 0.9], head: [0.5, 0.5, 0.5], legH: 0.3, legW: 0.2, type: 'quad', hp: 4 },
        cow: { body: [0.7, 0.6, 1.1], head: [0.5, 0.5, 0.5], legH: 0.4, legW: 0.2, type: 'quad', hp: 6 },
        chicken: { body: [0.3, 0.4, 0.4], head: [0.2, 0.3, 0.2], legH: 0.2, legW: 0.1, type: 'biped', hp: 2 },
        villager: { body: [0.4, 0.7, 0.3], head: [0.4, 0.4, 0.4], legH: 0.5, legW: 0.2, type: 'villager', hp: 10 },
        zombie: { body: [0.4, 0.7, 0.3], head: [0.4, 0.4, 0.4], legH: 0.5, legW: 0.2, type: 'zombie', hp: 10 },
        creeper: { body: [0.4, 0.6, 0.25], head: [0.4, 0.4, 0.4], legH: 0.4, legW: 0.2, type: 'creeper', hp: 8 },
        goat: { body: [0.5, 0.55, 0.85], head: [0.45, 0.45, 0.45], legH: 0.35, legW: 0.15, type: 'quad', hp: 5 },
        sheep: { body: [0.6, 0.5, 0.9], head: [0.45, 0.45, 0.45], legH: 0.3, legW: 0.18, type: 'quad', hp: 4 }
    }[type];
    if (!specs) return;

    const group = new THREE.Group();
    const mat = (typeof window.mobTextures !== 'undefined' && window.mobTextures[type]) ? window.mobTextures[type] : new THREE.MeshLambertMaterial({ color: 0x888888 });
    const headMat = (typeof window.mobFaceTextures !== 'undefined' && window.mobFaceTextures[type]) ? window.mobFaceTextures[type] : mat;
    const headFaceOnly = [mat, mat, mat, mat, headMat, mat];
    const armMat = (typeof window.mobArmTextures !== 'undefined' && window.mobArmTextures[type]) ? window.mobArmTextures[type] : mat;

    // Corps (torse, texture dédiée)
    const body = new THREE.Mesh(new THREE.BoxGeometry(...specs.body), mat);
    body.position.y = specs.legH + specs.body[1] / 2;
    group.add(body);

    // Tête : visage uniquement sur la face avant (+Z), le reste = texture corps
    const head = new THREE.Mesh(new THREE.BoxGeometry(...specs.head), headFaceOnly);
    if (specs.type === 'quad') {
        head.position.set(0, specs.legH + specs.body[1], specs.body[2] / 2); // Devant
    } else {
        head.position.set(0, specs.legH + specs.body[1] + specs.head[1] / 2, 0); // Au dessus
    }

    // Détails de la tête (Museaux, cornes, bec)
    if(type === 'pig') {
        const snout = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.1), new THREE.MeshLambertMaterial({color: 0xe6739f}));
        snout.position.set(0, -0.05, 0.25);
        head.add(snout);
    } else if(type === 'cow') {
        const snout = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), new THREE.MeshLambertMaterial({color: 0x606060}));
        snout.position.set(0, -0.1, 0.25);
        head.add(snout);
        const hornMat = new THREE.MeshLambertMaterial({color: 0xdddddd});
        const hL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.05), hornMat);
        hL.position.set(0.2, 0.2, 0.1);
        head.add(hL);
        const hR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.05), hornMat);
        hR.position.set(-0.2, 0.2, 0.1);
        head.add(hR);
    } else if(type === 'goat') {
        const hornMat = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        const hL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.06), hornMat);
        hL.position.set(0.18, 0.15, 0.12);
        head.add(hL);
        const hR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.06), hornMat);
        hR.position.set(-0.18, 0.15, 0.12);
        head.add(hR);
    } else if(type === 'chicken') {
        const beak = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.15), new THREE.MeshLambertMaterial({color: 0xffaa00}));
        beak.position.set(0, 0, 0.15);
        head.add(beak);
        const wattle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.05), new THREE.MeshLambertMaterial({color: 0xff0000}));
        wattle.position.set(0, -0.08, 0.12);
        head.add(wattle);
        
        // Ailes
        const wingGeo = new THREE.BoxGeometry(0.05, 0.2, 0.3);
        const wingL = new THREE.Mesh(wingGeo, mat); wingL.position.set(0.18, 0, 0); body.add(wingL);
        const wingR = new THREE.Mesh(wingGeo, mat); wingR.position.set(-0.18, 0, 0); body.add(wingR);
    } else if(type === 'villager') {
        const nose = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), new THREE.MeshLambertMaterial({color: 0xcc8866}));
        nose.position.set(0, -0.1, 0.25);
        head.add(nose);
        
        // Bras croisés du villageois (texture bras si disponible)
        const arms = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.2), armMat);
        arms.position.set(0, specs.legH + specs.body[1] / 1.5, 0.2);
        group.add(arms);
    }
    group.add(head);

    // Jambes (texture dédiée si disponible, sinon couleur unie ou corps)
    let legMeshes = [];
    const legMatRef = (typeof window.mobLegTextures !== 'undefined' && window.mobLegTextures[type]) ? window.mobLegTextures[type] : ((type === 'villager') ? new THREE.MeshLambertMaterial({color: 0x555555}) : (type === 'zombie' ? new THREE.MeshLambertMaterial({color: 0x333399}) : mat));
    const legGeo = new THREE.BoxGeometry(specs.legW, specs.legH, specs.legW);

    let legPositions = [];
    if (specs.type === 'quad') {
        const dx = specs.body[0]/2 - specs.legW/2;
        const dz = specs.body[2]/2 - specs.legW/2;
        legPositions = [ [dx, dz], [-dx, dz], [dx, -dz], [-dx, -dz] ];
    } else {
        const dx = specs.body[0]/2 - specs.legW/2;
        legPositions = [ [dx, 0], [-dx, 0] ];
    }
    const legMat = (type === 'creeper') ? mat : legMatRef;

    legPositions.forEach(pos => {
        const pivot = new THREE.Group();
        pivot.position.set(pos[0], specs.legH, pos[1]);
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.y = -specs.legH / 2; // La jambe descend sous le pivot
        pivot.add(leg);
        group.add(pivot);
        legMeshes.push(pivot);
    });

    // Bras tendus du Zombie (texture bras)
    if (type === 'zombie') {
        const armGeo = new THREE.BoxGeometry(specs.legW, 0.6, specs.legW);
        for(let i of [-1, 1]) {
            const armPivot = new THREE.Group();
            armPivot.position.set(i * (specs.body[0]/2 + specs.legW/2), specs.legH + specs.body[1], 0);
            const arm = new THREE.Mesh(armGeo, armMat);
            arm.position.y = -0.3;
            armPivot.rotation.x = Math.PI / 2;
            armPivot.add(arm);
            group.add(armPivot);
        }
    }

    group.rotation.y = Math.random() * Math.PI * 2;
    const spawnY = y + 1;
    group.position.set(x, spawnY, z);
    scene.add(group);

    const mobHeight = type === 'creeper' ? 1.7 : ((type === 'villager' || type === 'zombie') ? 1.6 : 1.0);
    mobs.push({
        group, type, hp: specs.hp,
        x, y: spawnY, z, vx: 0, vy: 0, vz: 0,
        targetRotY: group.rotation.y, timer: 0, walkTime: 0, attackCooldown: 0,
        legMeshes, cx: Math.floor(x / chunkSize), cz: Math.floor(z / chunkSize),
        width: MOB_WIDTH, height: mobHeight, depth: MOB_DEPTH,
        fuseTime: 0, isHostile: HOSTILE_TYPES.includes(type)
    });
}
    if (typeof window !== 'undefined') window.spawnMob = spawnMob;

    function createPlayerBipedGroup() {
        const type = 'player';
        const specs = { body: [0.4, 0.7, 0.3], head: [0.4, 0.4, 0.4], legH: 0.5, legW: 0.2 };
        const group = new THREE.Group();
        const mat = (typeof window.mobTextures !== 'undefined' && window.mobTextures[type]) ? window.mobTextures[type] : new THREE.MeshLambertMaterial({ color: 0x4a6fa5 });
        const headMat = (typeof window.mobFaceTextures !== 'undefined' && window.mobFaceTextures[type]) ? window.mobFaceTextures[type] : mat;
        const headFaceOnly = [mat, mat, mat, mat, headMat, mat];
        const armMat = (typeof window.mobArmTextures !== 'undefined' && window.mobArmTextures[type]) ? window.mobArmTextures[type] : mat;
        const body = new THREE.Mesh(new THREE.BoxGeometry(...specs.body), mat);
        body.position.y = specs.legH + specs.body[1] / 2;
        group.add(body);
        const head = new THREE.Mesh(new THREE.BoxGeometry(...specs.head), headFaceOnly);
        head.position.set(0, specs.legH + specs.body[1] + specs.head[1] / 2, 0);
        head.rotation.y = Math.PI;
        group.add(head);
        const legMatRef = (typeof window.mobLegTextures !== 'undefined' && window.mobLegTextures[type]) ? window.mobLegTextures[type] : mat;
        const legGeo = new THREE.BoxGeometry(specs.legW, specs.legH, specs.legW);
        const dx = specs.body[0]/2 - specs.legW/2;
        const legMeshes = [];
        [[dx, 0], [-dx, 0]].forEach(pos => {
            const pivot = new THREE.Group();
            pivot.position.set(pos[0], specs.legH, pos[1]);
            const leg = new THREE.Mesh(legGeo, legMatRef);
            leg.position.y = -specs.legH / 2;
            pivot.add(leg);
            group.add(pivot);
            legMeshes.push(pivot);
        });
        const armPivots = [];
        const armGeo = new THREE.BoxGeometry(specs.legW, 0.6, specs.legW);
        for (let i of [-1, 1]) {
            const armPivot = new THREE.Group();
            armPivot.position.set(i * (specs.body[0]/2 + specs.legW/2), specs.legH + specs.body[1], 0);
            const arm = new THREE.Mesh(armGeo, armMat);
            arm.position.y = -0.3;
            armPivot.rotation.x = Math.PI / 2;
            armPivot.add(arm);
            group.add(armPivot);
            armPivots.push(armPivot);
        }
        group.userData.legMeshes = legMeshes;
        group.userData.armPivots = armPivots;
        return group;
    }
    window.createPlayerBipedGroup = createPlayerBipedGroup;

        /** velocity optionnel : { vx, vy, vz } pour jeter l'objet dans une direction (sinon chute simple vy: 3) */
        function spawnDrop(x, y, z, type, count, velocity) { 
            count = (count != null && count > 0) ? count : 1;
            const mergeRadius = 0.6;
            const hasVel = velocity && (velocity.vx != null || velocity.vy != null || velocity.vz != null);
            if (!hasVel) {
                for (let i = 0; i < items.length; i++) {
                    const it = items[i];
                    if (it.type !== type) continue;
                    const dx = it.x - x, dy = it.y - y, dz = it.z - z;
                    if (dx * dx + dy * dy + dz * dz <= mergeRadius * mergeRadius) {
                        it.count = (it.count || 1) + count;
                        return;
                    }
                }
            }
            const itemScale = 0.3;
            const createPreview = typeof window.createBlockPreviewGeometry === 'function' ? window.createBlockPreviewGeometry : null;
            const geom = createPreview ? createPreview(type, itemScale) : new THREE.BoxGeometry(itemScale, itemScale, itemScale);
            const chunkMat = (typeof window.chunkMaterial !== 'undefined' && window.chunkMaterial) ? window.chunkMaterial : (typeof chunkMaterial !== 'undefined' ? chunkMaterial : null);
            const atlasTex = typeof window.blockAtlasTexture !== 'undefined' ? window.blockAtlasTexture : (chunkMat && chunkMat.map ? chunkMat.map : null);
            const mat = chunkMat ? chunkMat.clone() : new THREE.MeshLambertMaterial({ color: 0x888888, transparent: true, alphaTest: 0.15 });
            if (atlasTex) { mat.map = atlasTex; mat.needsUpdate = true; }
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(x, y, z);
            if (typeof window.isFlora === 'function' && window.isFlora(type) || type === 'fire') mesh.renderOrder = 1;
            scene.add(mesh);
            const vx = hasVel && velocity.vx != null ? velocity.vx : 0;
            const vy = hasVel && velocity.vy != null ? velocity.vy : 3.0;
            const vz = hasVel && velocity.vz != null ? velocity.vz : 0;
            items.push({ mesh, type, count: count, x, y, z, vx, vy, vz, cx: Math.floor(x / chunkSize), cz: Math.floor(z / chunkSize) });
        }
                function updateEntities(delta) {
            
            // --- GESTION DES ITEMS DROPPÉS ---
            for (let i = items.length - 1; i >= 0; i--) {
                let item = items[i]; 
                item.mesh.rotation.y += 1.0 * delta; 
                item.vy -= 25.0 * delta; 
                item.y += item.vy * delta;
                item.x += (item.vx || 0) * delta;
                item.z += (item.vz || 0) * delta;
                // Collision sol : arrêter vertical et horizontal
                if (isColliding(item.x, item.y, item.z, 0.3)) { 
                    item.y -= item.vy * delta; 
                    item.vy = 0; 
                    if (item.vx != null) item.vx = 0; 
                    if (item.vz != null) item.vz = 0; 
                }
                item.mesh.position.set(item.x, item.y, item.z);
                
                // Ramassage
                let dx = yawObject.position.x - item.x; 
                let dy = (yawObject.position.y - 1.0) - item.y; 
                let dz = yawObject.position.z - item.z;
                
                if(dx * dx + dy * dy + dz * dz < 2.5) { 
                    const n = item.count != null && item.count > 0 ? item.count : 1;
                    addToInventory(item.type, n); 
                    scene.remove(item.mesh); 
                    items.splice(i, 1); 
                }
            }

            // --- GESTION DE L'IA DES MOBS (seulement à distance de rendu) ---
            const playerX = yawObject.position.x, playerZ = yawObject.position.z;
            const mobActiveDist = (typeof window.mobActiveDistance === 'number') ? window.mobActiveDistance : HOSTILE_FREEZE_RANGE;
			for (let i = mobs.length - 1; i >= 0; i--) {
                let mob = mobs[i];
                if (window.disableMobAI) continue;
                if (typeof gameStarted !== 'undefined' && !gameStarted && mob.isHostile) continue;

                let dx = playerX - mob.x, dz = playerZ - mob.z;
                let dist = Math.sqrt(dx * dx + dz * dz);
                if (dist > mobActiveDist) continue;

                // On définit la hauteur une seule fois ici !
                let mobHeight = mob.height || ((mob.type === 'villager' || mob.type === 'zombie') ? 1.6 : 1.0);
                let checkY = mob.y + mobHeight;
                const mw = mob.width || MOB_WIDTH;
                const md = mob.depth || MOB_DEPTH;
                
                if (mob.isHostile && window.gameMode === 'survival') {
                    if (mob.aggro && mob.aggroTime > 0) mob.aggroTime -= delta;
                    const chaseRange = (mob.aggro && mob.aggroTime > 0) ? 64 : HOSTILE_DETECT_RANGE;
                    if (dist > chaseRange) {
                        mob.vx = 0; mob.vz = 0; mob.fuseTime = 0;
                    } else if (mob.type === 'zombie') {
                        if (dist < 15) { 
                            let speed = 3.5; 
                            mob.vx = (dx / dist) * speed; 
                            mob.vz = (dz / dist) * speed; 
                            mob.targetRotY = Math.atan2(mob.vx, mob.vz);
                            if (dist < 1.5 && mob.attackCooldown <= 0) { 
                                takeDamage(1, mob.x, mob.z);
                                mob.attackCooldown = 1.0; 
                            }
                        } else { mob.vx = 0; mob.vz = 0; }
                        if (mob.attackCooldown > 0) mob.attackCooldown -= delta;
                    } else if (mob.type === 'creeper' && dist <= chaseRange) {
                        if (dist < 12 && dist > 1.2) {
                            mob.vx = (dx / dist) * 2.0; 
                            mob.vz = (dz / dist) * 2.0; 
                            mob.targetRotY = Math.atan2(mob.vx, mob.vz);
                            mob.fuseTime = 0;
                        } else if (dist <= 1.2 && dist > 0) {
                            mob.vx = 0; mob.vz = 0;
                            mob.fuseTime += delta;
                            if (mob.fuseTime > 0) {
                                const blinkRate = mob.fuseTime > 1.0 ? 16 : 8;
                                const flash = Math.floor(mob.fuseTime * blinkRate) % 2 === 0;
                                if (!mob._flashMats) {
                                    mob._flashMats = [];
                                    mob.group.traverse(function(child) {
                                        if (!child.isMesh || !child.material) return;
                                        const mats = Array.isArray(child.material) ? child.material : [child.material];
                                        if (!child.userData.hasClonedMaterial) {
                                            child.userData.hasClonedMaterial = true;
                                            const cloned = mats.map(function(m) { return (m && typeof m.clone === 'function') ? m.clone() : m; });
                                            child.material = cloned.length === 1 ? cloned[0] : cloned;
                                        }
                                        const toSet = Array.isArray(child.material) ? child.material : [child.material];
                                        toSet.forEach(function(m) { if (m && m.emissive) mob._flashMats.push(m); });
                                    });
                                }
                                for (let k = 0; k < mob._flashMats.length; k++) {
                                    mob._flashMats[k].emissive.setHex(flash ? 0xffffff : 0x000000);
                                    if (flash) mob._flashMats[k].emissiveIntensity = 1.0;
                                    else mob._flashMats[k].emissiveIntensity = 0;
                                }
                            }
                            if (mob.fuseTime >= 1.5) {
                                if (typeof takeDamage === 'function') takeDamage(4, mob.x, mob.z);
                                if (typeof explodeAt === 'function') explodeAt(mob.x, mob.y + mob.height/2, mob.z, 2);
                                scene.remove(mob.group);
                                if (typeof spawnDrop === 'function') spawnDrop(mob.x, mob.y, mob.z, 'gunpowder');
                                mobs.splice(i, 1);
                                continue;
                            }
                        } else {
                            mob.vx = 0; mob.vz = 0; mob.fuseTime = 0;
                            if (mob.type === 'creeper' && mob._flashMats) { for (let k = 0; k < mob._flashMats.length; k++) mob._flashMats[k].emissive.setHex(0x000000); mob._flashMats = null; }
                        }
                    }
                } else if (mob.isHostile && (window.gameMode === 'creative' || window.gameMode === 'spectator')) {
                    mob.vx = 0; mob.vz = 0; mob.fuseTime = 0;
                } else if (!mob.isHostile) {
                    if (mob.fleeing && mob.fleeUntil > 0) {
                        mob.fleeUntil -= delta;
                        const runSpeed = 4.5;
                        const ax = mob.x - playerX, az = mob.z - playerZ;
                        const alen = Math.sqrt(ax * ax + az * az) || 1;
                        mob.vx = (ax / alen) * runSpeed;
                        mob.vz = (az / alen) * runSpeed;
                        mob.targetRotY = Math.atan2(mob.vx, mob.vz);
                    } else {
                        mob.fleeing = false;
                        mob.timer -= delta;
                        if(mob.timer <= 0) {
                            mob.timer = 2 + Math.random() * 4; 
                            if(Math.random() > 0.4) { 
                                let angle = Math.random() * Math.PI * 2; 
                                let speed = 1.0 + Math.random() * 1.5; 
                                mob.vx = Math.sin(angle) * speed; 
                                mob.vz = Math.cos(angle) * speed; 
                                mob.targetRotY = angle; 
                            } else { 
                                if(Math.random() > 0.5) { 
                                    let pdx = yawObject.position.x - mob.x; 
                                    let pdz = yawObject.position.z - mob.z; 
                                    mob.targetRotY = Math.atan2(pdx, pdz); 
                                } 
                                mob.vx = 0; 
                                mob.vz = 0; 
                            } 
                        }
                    }
                }

                // Villageois : ouvrir les portes en s'approchant, fermer quand ils sont à l'intérieur / inactifs
                if (mob.type === 'villager' && typeof window.getBlockAt === 'function' && typeof window.toggleDoorAt === 'function') {
                    if (mob.doorCooldown == null) mob.doorCooldown = 0;
                    else mob.doorCooldown -= delta;
                    if (mob.doorCooldown <= 0) {
                        const speed = Math.sqrt(mob.vx * mob.vx + mob.vz * mob.vz);
                        if (speed > 0.1) {
                            const nx = mob.vx / speed, nz = mob.vz / speed;
                            const bx = Math.round(mob.x + nx * 1.2), by = Math.round(mob.y) + 1, bz = Math.round(mob.z + nz * 1.2);
                            const b = window.getBlockAt(bx, by, bz);
                            if (b && b.type === 'wooden_door' && !b.open) {
                                window.toggleDoorAt(bx, by, bz);
                                mob.doorCooldown = 1.2;
                            }
                        } else if (Math.random() < 0.015 * delta) {
                            let closed = false;
                            for (let ox = -1; ox <= 1 && !closed; ox++) {
                                for (let oz = -1; oz <= 1 && !closed; oz++) {
                                    const bx = Math.round(mob.x) + ox, by = Math.round(mob.y) + 1, bz = Math.round(mob.z) + oz;
                                    const b = window.getBlockAt(bx, by, bz);
                                    if (b && b.type === 'wooden_door' && b.open) {
                                        window.toggleDoorAt(bx, by, bz);
                                        mob.doorCooldown = 0.8;
                                        closed = true;
                                    }
                                }
                            }
                        }
                    }
                }

                // Interpolation de la rotation
                if (mob.targetRotY !== undefined) {
                    let diff = mob.targetRotY - mob.group.rotation.y;
                    while(diff < -Math.PI) diff += Math.PI * 2; 
                    while(diff > Math.PI) diff -= Math.PI * 2;
                    mob.group.rotation.y += diff * 5 * delta;
                }

                // Application de la Gravité
// Application de la Gravité
// Application de la Gravité
                mob.vy -= 25.0 * delta; 
                mob.y += mob.vy * delta; 
                
                let isGrounded = false;
                if(isColliding(mob.x, checkY, mob.z, mobHeight)) { 
                    mob.y -= mob.vy * delta; 
                    mob.vy = 0; 
                    isGrounded = true; 
                } 
                
                let hitWallX = false; 
                let hitWallZ = false;

                // Application des Mouvements (Vitesse)
                mob.x += mob.vx * delta; 
                if(isColliding(mob.x, checkY + 0.1, mob.z, mobHeight)) { mob.x -= mob.vx * delta; hitWallX = true; }
                if (typeof isCollidingWithMobs === 'function' && isCollidingWithMobs(mob.x, mob.y, mob.z, mobHeight, mw, md, mob)) { mob.x -= mob.vx * delta; }
                if (typeof isCollidingWithPlayer === 'function' && isCollidingWithPlayer(mob.x, mob.y, mob.z, mobHeight, mw, md)) { mob.x -= mob.vx * delta; }
                
                mob.z += mob.vz * delta; 
                if(isColliding(mob.x, checkY + 0.1, mob.z, mobHeight)) { mob.z -= mob.vz * delta; hitWallZ = true; }
                if (typeof isCollidingWithMobs === 'function' && isCollidingWithMobs(mob.x, mob.y, mob.z, mobHeight, mw, md, mob)) { mob.z -= mob.vz * delta; }
                if (typeof isCollidingWithPlayer === 'function' && isCollidingWithPlayer(mob.x, mob.y, mob.z, mobHeight, mw, md)) { mob.z -= mob.vz * delta; }
                
                if (typeof pushMobsApart === 'function') pushMobsApart(mob, mw, md, mobHeight);
                // IA Saut par-dessus les blocs
                if(isGrounded && (hitWallX || hitWallZ) && (mob.vx !== 0 || mob.vz !== 0)) { 
                    mob.vy = 7.0; 
                }
                // Sauts aléatoires
                if(isGrounded && Math.random() < 0.01 && (mob.vx !== 0 || mob.vz !== 0)) { 
                    mob.vy = 7.0; 
                }
                
                if (typeof window.disableMobAnimations !== 'undefined' && window.disableMobAnimations) {
                    if (mob.legMeshes) mob.legMeshes.forEach(l => { l.rotation.x = 0; });
                } else {
                    if ((mob.vx !== 0 || mob.vz !== 0) && mob.legMeshes) {
                        mob.walkTime += delta * 15;
                        const swing = Math.sin(mob.walkTime) * 0.5;
                        if (mob.legMeshes.length === 4) {
                            mob.legMeshes[0].rotation.x = swing;
                            mob.legMeshes[1].rotation.x = -swing;
                            mob.legMeshes[2].rotation.x = -swing;
                            mob.legMeshes[3].rotation.x = swing;
                        } else if (mob.legMeshes.length === 2) {
                            mob.legMeshes[0].rotation.x = swing;
                            mob.legMeshes[1].rotation.x = -swing;
                        }
                    } else if (mob.legMeshes) {
                        mob.legMeshes.forEach(l => l.rotation.x = 0);
                    }
                }
                
                mob.group.position.set(mob.x, mob.y, mob.z);
            }
        }
