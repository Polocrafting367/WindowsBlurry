               if (typeof window !== 'undefined' && window.gameMode === undefined) window.gameMode = 'survival';
        let gameStarted = false;
        let playerHp = 10;
        let playerHunger = 10;
        const pitchObject = new THREE.Object3D(); 
        const yawObject = new THREE.Object3D(); 
        yawObject.position.set(8, 20, 8); 
        yawObject.add(pitchObject); 
        scene.add(yawObject);
        const velocity = new THREE.Vector3();
        if (typeof window !== 'undefined') window.velocity = velocity;
        let canJump = false; 
        const playerHeight = 1.5;

        
function updatePhysics(delta) {
            if (playerDead) return;
            // --- MODE SPECTATEUR ---
            if (window.gameMode === 'spectator') {
                const specSpeed = 20.0;
                
                // Mouvement avant/arrière/gauche/droite
                const specMove = new THREE.Vector3(0, 0, 0);
                if (keys.w) specMove.z -= 1;
                if (keys.s) specMove.z += 1;
                if (keys.a) specMove.x -= 1;
                if (keys.d) specMove.x += 1;

                if (specMove.lengthSq() > 0) specMove.normalize();
                specMove.multiplyScalar(specSpeed * delta);
                
                // On applique la rotation Y (gauche/droite) MAIS AUSSI X (haut/bas) de la caméra
                // pour pouvoir voler dans la direction où l'on regarde
                specMove.applyEuler(new THREE.Euler(pitchObject.rotation.x, yawObject.rotation.y, 0, 'YXZ'));
                
                yawObject.position.add(specMove);

                // Contrôle vertical absolu (Espace pour monter, Shift pour descendre)
                if (keys.space) yawObject.position.y += specSpeed * delta;
                if (keys.shift) yawObject.position.y -= specSpeed * delta;

                // En spectateur, on ne montre pas l'outline de sélection des blocs
                outlineMesh.visible = false;
                
                return; // On arrête la fonction ici, pas de gravité ni de collision
            }

            // --- VOL EN CRÉATIF (double saut) ---
            if (window.gameMode === 'creative' && window.creativeFlying) {
                const flySpeed = 12.0;
                const flyVec = new THREE.Vector3(0, 0, 0);
                if (keys.w) flyVec.z -= 1;
                if (keys.s) flyVec.z += 1;
                if (keys.a) flyVec.x -= 1;
                if (keys.d) flyVec.x += 1;
                if (flyVec.lengthSq() > 0) flyVec.normalize();
                flyVec.multiplyScalar(flySpeed * delta);
                flyVec.applyEuler(new THREE.Euler(pitchObject.rotation.x, yawObject.rotation.y, 0, 'YXZ'));
                yawObject.position.add(flyVec);
                if (keys.space) yawObject.position.y += flySpeed * delta;
                if (keys.shift) yawObject.position.y -= flySpeed * delta;
                velocity.y = 0;
                return;
            }

            // --- MODE SURVIE / CRÉATIF (marche) ---
            let previousVelY = velocity.y;
            const inWater = typeof isInWater === 'function' && isInWater(yawObject.position.x, yawObject.position.y, yawObject.position.z, playerHeight);
            const isMoving = keys.w || keys.s || keys.a || keys.d;
            const sprinting = (typeof keys.sprint !== 'undefined' && keys.sprint) && isMoving && !inWater;
            const moveSpeed = inWater ? 3.5 : (sprinting ? 11.0 : 7.2);

            if (inWater) {
                velocity.y += 6.0 * delta;
                if (velocity.y > 1.8) velocity.y = 1.8;
                if (keys.space) velocity.y += 5.0 * delta;
            } else {
                velocity.y -= 30.0 * delta;
            }
            
            const moveVec = new THREE.Vector3(0, 0, 0); 
            if(keys.w) moveVec.z -= 1; 
            if(keys.s) moveVec.z += 1; 
            if(keys.a) moveVec.x -= 1; 
            if(keys.d) moveVec.x += 1;
            
            if(moveVec.lengthSq() > 0) moveVec.normalize(); 
            moveVec.multiplyScalar(moveSpeed * delta);
            if (inWater) {
                moveVec.applyEuler(new THREE.Euler(pitchObject.rotation.x, yawObject.rotation.y, 0, 'YXZ'));
            } else {
                moveVec.applyEuler(new THREE.Euler(0, yawObject.rotation.y, 0));
            }

            let pos = yawObject.position.clone(); 
            
            pos.y += velocity.y * delta;
            
            if(isColliding(pos.x, pos.y, pos.z, playerHeight)) {
                if(velocity.y < 0) {
                    pos.y = Math.round(pos.y - playerHeight) + 0.5 + playerHeight;
                    // Dégâts de chute (réduits) uniquement en Survie
                    if (previousVelY < -18 && window.gameMode === 'survival') { 
                        let damage = Math.max(0, Math.floor((Math.abs(previousVelY) - 16) * 0.4)); 
                        if (damage > 0) takeDamage(damage); 
                    }
                } else if(velocity.y > 0) { 
                    pos.y = Math.round(pos.y) - 0.5 - 0.001; 
                }
                velocity.y = 0;
            }
            
            canJump = (velocity.y === 0 && isColliding(pos.x, pos.y - 0.05, pos.z, playerHeight));
            if(keys.space && canJump) { 
                velocity.y = 9.0; 
                canJump = false; 
            }
            
            pos.x += moveVec.x; 
            if(isColliding(pos.x, pos.y, pos.z, playerHeight)) pos.x -= moveVec.x;
            if (typeof mobs !== 'undefined' && isCollidingWithAnyMob(pos.x, pos.y, pos.z)) pos.x -= moveVec.x;
            
            pos.z += moveVec.z; 
            if(isColliding(pos.x, pos.y, pos.z, playerHeight)) pos.z -= moveVec.z;
            if (typeof mobs !== 'undefined' && isCollidingWithAnyMob(pos.x, pos.y, pos.z)) pos.z -= moveVec.z;
            
            // Dégâts dans le vide uniquement en Survie
            if(pos.y < -30 && window.gameMode === 'survival') { takeDamage(10); }

            yawObject.position.copy(pos);
            
            raycaster.setFromCamera(center, camera);
            const target = typeof window.getTargetBlockForInteraction === 'function' ? window.getTargetBlockForInteraction(raycaster, 6) : null;
            if (target && target.block) {
                outlineMesh.position.set(target.bx, target.by, target.bz);
                outlineMesh.visible = true;
            } else {
                const chunkMeshes = Object.values(chunks).concat(typeof chunkTransparent !== 'undefined' ? Object.values(chunkTransparent) : []);
                const intersects = raycaster.intersectObjects(chunkMeshes);
                if (intersects.length > 0 && intersects[0].distance <= 6) {
                    const pIn = intersects[0].point.clone().sub(intersects[0].face.normal.clone().multiplyScalar(0.1));
                    outlineMesh.position.set(Math.round(pIn.x), Math.round(pIn.y), Math.round(pIn.z));
                    outlineMesh.visible = true;
                } else {
                    outlineMesh.visible = false;
                }
            }
        }
        function isInWater(x, y, z, height = 1.5) {
            const pSize = 0.6;
            for (let bx = Math.floor(x - pSize/2); bx <= Math.ceil(x + pSize/2); bx++) {
                for (let by = Math.floor(y - height); by <= Math.ceil(y); by++) {
                    for (let bz = Math.floor(z - pSize/2); bz <= Math.ceil(z + pSize/2); bz++) {
                        const b = blocks[`${bx},${by},${bz}`];
                        if (b && b.type === 'water') return true;
                    }
                }
            }
            return false;
        }

        function isColliding(x, y, z, height = 1.5) { 
            const pSize = 0.6;
            const pMinX = x - pSize / 2;
            const pMaxX = x + pSize / 2;
            const pMinY = y - height;
            const pMaxY = y;
            const pMinZ = z - pSize / 2;
            const pMaxZ = z + pSize / 2;
            
            for(let bx = Math.round(pMinX); bx <= Math.round(pMaxX); bx++) { 
                for(let by = Math.round(pMinY); by <= Math.round(pMaxY); by++) { 
                    for(let bz = Math.round(pMinZ); bz <= Math.round(pMaxZ); bz++) { 
                        let b = blocks[`${bx},${by},${bz}`];
                        if (!b) {
                            const bBelow = blocks[`${bx},${by-1},${bz}`];
                            if (bBelow && bBelow.type === 'wooden_door' && !bBelow.open) b = { x: bx, y: by, z: bz, type: 'wooden_door', open: false };
                        }
                        if (b && !isFlora(b.type) && b.type !== 'snow_layer') {
                            if (b.type === 'wooden_door' || b.type === 'wooden_trapdoor') {
                                const panel = typeof window.getDoorTrapdoorPanelBounds === 'function' && window.getDoorTrapdoorPanelBounds(b);
                                if (panel && pMinX < panel.maxX && pMaxX > panel.minX && pMinY < panel.maxY && pMaxY > panel.minY && pMinZ < panel.maxZ && pMaxZ > panel.minZ) return true;
                            } else if (typeof window.blockSolidAt === 'function' && window.blockSolidAt(bx, by, bz)) {
                                const bMinY = by - 0.5, bMaxY = by + 0.5;
                                if (pMinX < bx + 0.5 && pMaxX > bx - 0.5 && pMinY < bMaxY && pMaxY > bMinY && pMinZ < bz + 0.5 && pMaxZ > bz - 0.5) return true;
                            }
                        } 
                    } 
                } 
            } 
            return false; 
        }

        function isCollidingWithPlayer(mobX, mobY, mobZ, mobHeight, mw, md) {
            if (typeof yawObject === 'undefined') return false;
            const px = yawObject.position.x, py = yawObject.position.y, pz = yawObject.position.z;
            const pSize = 0.6;
            const pMinX = px - pSize/2, pMaxX = px + pSize/2;
            const pMinY = py - playerHeight, pMaxY = py;
            const pMinZ = pz - pSize/2, pMaxZ = pz + pSize/2;
            const mMidX = mobX, mMidZ = mobZ;
            const mMinX = mMidX - mw/2, mMaxX = mMidX + mw/2;
            const mMinY = mobY, mMaxY = mobY + mobHeight;
            const mMinZ = mMidZ - md/2, mMaxZ = mMidZ + md/2;
            return pMinX < mMaxX && pMaxX > mMinX && pMinY < mMaxY && pMaxY > mMinY && pMinZ < mMaxZ && pMaxZ > mMinZ;
        }

        function isCollidingWithMobs(x, y, z, height, w, d, excludeMob) {
            if (typeof mobs === 'undefined') return false;
            const aMinX = x - w/2, aMaxX = x + w/2, aMinY = y, aMaxY = y + height, aMinZ = z - d/2, aMaxZ = z + d/2;
            for (let m of mobs) {
                if (m === excludeMob) continue;
                const mw = m.width || 0.6, md = m.depth || 0.6, mh = m.height || 1.6;
                const bMinX = m.x - mw/2, bMaxX = m.x + mw/2, bMinY = m.y, bMaxY = m.y + mh, bMinZ = m.z - md/2, bMaxZ = m.z + md/2;
                if (aMinX < bMaxX && aMaxX > bMinX && aMinY < bMaxY && aMaxY > bMinY && aMinZ < bMaxZ && aMaxZ > bMinZ) return true;
            }
            return false;
        }

        function isCollidingWithAnyMob(px, py, pz) {
            const pSize = 0.6;
            const pMinX = px - pSize/2, pMaxX = px + pSize/2, pMinY = py - playerHeight, pMaxY = py, pMinZ = pz - pSize/2, pMaxZ = pz + pSize/2;
            for (let m of mobs) {
                const mw = m.width || 0.6, md = m.depth || 0.6, mh = m.height || 1.6;
                const mMinX = m.x - mw/2, mMaxX = m.x + mw/2, mMinY = m.y, mMaxY = m.y + mh, mMinZ = m.z - md/2, mMaxZ = m.z + md/2;
                if (pMinX < mMaxX && pMaxX > mMinX && pMinY < mMaxY && pMaxY > mMinY && pMinZ < mMaxZ && pMaxZ > mMinZ) return true;
            }
            return false;
        }

        function pushMobsApart(mob, mw, md, mh) {
            if (typeof mobs === 'undefined') return;
            const aMinX = mob.x - mw/2, aMaxX = mob.x + mw/2, aMinZ = mob.z - md/2, aMaxZ = mob.z + md/2;
            for (let m of mobs) {
                if (m === mob) continue;
                const bw = m.width || 0.6, bd = m.depth || 0.6;
                const bMinX = m.x - bw/2, bMaxX = m.x + bw/2, bMinZ = m.z - bd/2, bMaxZ = m.z + bd/2;
                if (aMinX >= bMaxX || aMaxX <= bMinX || aMinZ >= bMaxZ || aMaxZ <= bMinZ) continue;
                const overlapX = Math.min(aMaxX - bMinX, bMaxX - aMinX) * 0.5;
                const overlapZ = Math.min(aMaxZ - bMinZ, bMaxZ - aMinZ) * 0.5;
                const dirX = mob.x > m.x ? 1 : -1, dirZ = mob.z > m.z ? 1 : -1;
                mob.x += dirX * overlapX; m.x -= dirX * overlapX;
                mob.z += dirZ * overlapZ; m.z -= dirZ * overlapZ;
            }
        }
        let playerDead = false;
        window.playerDead = false;
                function takeDamage(amount, knockbackFromX, knockbackFromZ) {
            if (window.gameMode === 'creative') return; // Le joueur est invincible en créatif
            
            playerHp -= amount;
            if (playerHp <= 0) {
                playerHp = 0;
                playerDead = true;
                window.playerDead = true;
                if (typeof document !== 'undefined') {
                    try { if (document.exitPointerLock) document.exitPointerLock(); } catch (e) {}
                    const go = document.getElementById('gameover-screen');
                    if (go) { go.style.display = 'flex'; go.style.pointerEvents = 'auto'; go.style.cursor = 'default'; }
                }
            }
            updateSurvivalHUD();
        }
        function respawnPlayer() {
            playerDead = false;
            window.playerDead = false;
            playerHp = 10;
            if (typeof window.findSpawnNear === 'function') {
                const sp = window.findSpawnNear(8, 8, 10, 80);
                yawObject.position.set(sp.x, sp.y, sp.z);
            } else {
                yawObject.position.set(8, 20, 8);
            }
            velocity.set(0, 0, 0);
            const go = document.getElementById('gameover-screen');
            if (go) go.style.display = 'none';
            updateSurvivalHUD();
        }
        window.respawnPlayer = respawnPlayer;
                function updateSurvivalHUD() {
            const hud = document.getElementById('survival-hud');
            if (window.gameMode === 'creative') { 
                hud.style.display = 'none'; 
                return; 
            }
            hud.style.display = 'flex';

            const heartsDiv = document.getElementById('hearts-container');
            const hungerDiv = document.getElementById('hunger-container');
            
            heartsDiv.innerHTML = ''; 
            hungerDiv.innerHTML = '';
            
            for (let i = 0; i < 10; i++) {
                heartsDiv.innerHTML += `<span>${i < playerHp ? '❤️' : '🖤'}</span>`;
                hungerDiv.innerHTML += `<span>${i < playerHunger ? '🍗' : '🦴'}</span>`;
            }
        }
        function selectHotbar(index) { 
            selectedHotbarIndex = index; 
            updateInventoryUI(); 
        }
