const blocks = {}; 
        const chunkBlocks = {}; 
        const chunkSize = 16; 
        
        let renderDistance = 4; 
        let maxRenderDistance = 15;
        
        const loadedChunks = new Set(); 
        if (typeof window !== 'undefined') {
            window.getLoadedChunksCount = function() { return loadedChunks.size; };
            window.addLoadedChunk = function(cx, cz) { loadedChunks.add(cx + ',' + cz); };
        }
        const chunksQueue = [];
        const chunks = {};
        const chunkTransparent = {};
        const transparentBlockTypes = ['glass', 'water', 'fire'];

        // --- Brouillard et ciel (init.js peut écraser scene.background ensuite) ---
        const defaultSkyColor = new THREE.Color(0x87ceeb);
        scene.background = defaultSkyColor;
        scene.fog = new THREE.Fog(defaultSkyColor, (renderDistance - 1) * chunkSize, renderDistance * chunkSize);
        if (typeof window !== 'undefined') window.mobActiveDistance = Math.max(8, (renderDistance * chunkSize) * (typeof window.mobRangeMultiplier === 'number' ? window.mobRangeMultiplier : 1));
        // --------------------------------------------------------

        function addBlock(x, y, z, type, waterLevel) {
            const bx = Math.round(x);
            const by = Math.round(y);
            const bz = Math.round(z); 
            const key = `${bx},${by},${bz}`;
            
            if (blocks[key]) return; 
            
            blocks[key] = { x: bx, y: by, z: bz, type: type };
            if (type === 'wooden_door' || type === 'wooden_trapdoor') blocks[key].open = false;
            if (type === 'water') {
                blocks[key].waterLevel = (waterLevel !== undefined && waterLevel >= 1 && waterLevel <= 8) ? waterLevel : 8;
                blocks[key].originX = bx;
                blocks[key].originZ = bz;
            }
            const cx = Math.floor(bx / chunkSize);
            const cz = Math.floor(bz / chunkSize); 
            const chunkKey = `${cx},${cz}`;
            if (!chunkBlocks[chunkKey]) chunkBlocks[chunkKey] = [];
            chunkBlocks[chunkKey].push(key);
            if (typeof window._currentGenerateChunk !== 'undefined' && window._currentGenerateChunk && (Math.floor(bx / chunkSize) !== window._currentGenerateChunk.cx || Math.floor(bz / chunkSize) !== window._currentGenerateChunk.cz)) {
                if (!window._chunksModifiedDuringGenerate) window._chunksModifiedDuringGenerate = new Set();
                window._chunksModifiedDuringGenerate.add(chunkKey);
            }
        }

        function replaceBlockType(x, y, z, type) { 
            const bx = Math.round(x);
            const by = Math.round(y);
            const bz = Math.round(z);
            const key = `${bx},${by},${bz}`; 
            if(blocks[key]) blocks[key].type = type; 
            else addBlock(bx, by, bz, type); 
        }

        window.explodeAt = function(ex, ey, ez, radius) {
            const r2 = radius * radius;
            const destroyed = [];
            for (let bx = Math.floor(ex - radius); bx <= Math.ceil(ex + radius); bx++) {
                for (let by = Math.floor(ey - radius); by <= Math.ceil(ey + radius); by++) {
                    for (let bz = Math.floor(ez - radius); bz <= Math.ceil(ez + radius); bz++) {
                        if (by === -16) continue;
                        const dx = bx + 0.5 - ex, dy = by + 0.5 - ey, dz = bz + 0.5 - ez;
                        if (dx*dx + dy*dy + dz*dz > r2) continue;
                        const key = `${bx},${by},${bz}`;
                        if (blocks[key]) { destroyed.push({ bx, by, bz, key }); delete blocks[key]; }
                    }
                }
            }
            destroyed.forEach(o => {
                const cKey = `${Math.floor(o.bx/chunkSize)},${Math.floor(o.bz/chunkSize)}`;
                if (chunkBlocks[cKey]) chunkBlocks[cKey] = chunkBlocks[cKey].filter(k => k !== o.key);
                rebuildChunkAndBorders(o.bx, o.bz);
            });
        };

        const TNT_IGNITE_DELAY_MS = 1500;
        const TNT_FLASH_START_MS = 1100;
        function igniteTNTAt(tx, ty, tz) {
            const key = `${Math.round(tx)},${Math.round(ty)},${Math.round(tz)}`;
            const b = blocks[key];
            if (!b || b.type !== 'tnt') return;
            setTimeout(function() {
                if (!blocks[key] || blocks[key].type !== 'tnt') return;
                const flashMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
                const flashBox = new THREE.Mesh(new THREE.BoxGeometry(1.01, 1.01, 1.01), flashMat);
                flashBox.position.set(tx + 0.5, ty + 0.5, tz + 0.5);
                flashBox.userData.tntKey = key;
                scene.add(flashBox);
                if (!window._tntFlashList) window._tntFlashList = [];
                window._tntFlashList.push({ mesh: flashBox, key: key, blinkAt: Date.now() + 50 });
            }, TNT_FLASH_START_MS);
            setTimeout(function() {
                if (!blocks[key] || blocks[key].type !== 'tnt') return;
                if (window._tntFlashList) {
                    const idx = window._tntFlashList.findIndex(function(o) { return o.key === key; });
                    if (idx >= 0) {
                        scene.remove(window._tntFlashList[idx].mesh);
                        window._tntFlashList[idx].mesh.geometry.dispose();
                        window._tntFlashList[idx].mesh.material.dispose();
                        window._tntFlashList.splice(idx, 1);
                    }
                }
                if (typeof window.explodeAt === 'function') window.explodeAt(tx + 0.5, ty + 0.5, tz + 0.5, 4);
                delete blocks[key];
                const cKey = `${Math.floor(tx / chunkSize)},${Math.floor(tz / chunkSize)}`;
                if (chunkBlocks[cKey]) chunkBlocks[cKey] = chunkBlocks[cKey].filter(k => k !== key);
                rebuildChunkAndBorders(tx, tz);
            }, TNT_IGNITE_DELAY_MS);
        }
        window.checkFireIgniteTNT = function(fx, fy, fz) {
            const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
            for (let d = 0; d < dirs.length; d++) {
                const tx = fx + dirs[d][0], ty = fy + dirs[d][1], tz = fz + dirs[d][2];
                const key = `${tx},${ty},${tz}`;
                if (blocks[key] && blocks[key].type === 'tnt') igniteTNTAt(tx, ty, tz);
            }
        };
        window.checkTNTIgniteFromFire = function(tx, ty, tz) {
            const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
            for (let d = 0; d < dirs.length; d++) {
                const fx = tx + dirs[d][0], fy = ty + dirs[d][1], fz = tz + dirs[d][2];
                const key = `${fx},${fy},${fz}`;
                if (blocks[key] && blocks[key].type === 'fire') { igniteTNTAt(tx, ty, tz); return; }
            }
        };

        function buildChunkMesh(cx, cz) {
            const chunkKey = `${cx},${cz}`;
            if (chunks[chunkKey]) { 
                scene.remove(chunks[chunkKey]); 
                chunks[chunkKey].geometry.dispose(); 
                delete chunks[chunkKey]; 
            }
            if (chunkTransparent[chunkKey]) {
                scene.remove(chunkTransparent[chunkKey]);
                chunkTransparent[chunkKey].geometry.dispose();
                delete chunkTransparent[chunkKey];
            }
            
            const blockKeys = chunkBlocks[chunkKey] || []; 
            if (blockKeys.length === 0) return;
            
            const camPos = (typeof yawObject !== 'undefined' && yawObject && yawObject.position) ? yawObject.position.clone() : new THREE.Vector3(0, 0, 0);
            const matData = { pos: [], norm: [], uv: [], ind: [], foliage: [] }; 
            const transData = { pos: [], norm: [], uv: [], ind: [] };
            let vCount = 0;
            let tCount = 0;
            function isFoliageFace(blockType, face) {
                return blockType === 'leaves' || blockType === 'birch_leaves' || blockType === 'maple_leaves' || blockType === 'dark_leaves' || blockType === 'flower_red' || (blockType === 'grass_birch' && face === 2) || blockType === 'flower_yellow' || blockType === 'tall_grass' || blockType === 'torch' || (blockType === 'grass' && face === 2);
            }
            function distSqToBlock(bx, by, bz) {
                const cx = bx + 0.5 - camPos.x, cy = by + 0.5 - camPos.y, cz = bz + 0.5 - camPos.z;
                return cx * cx + cy * cy + cz * cz;
            }

            for (let key of blockKeys) {
                const b = blocks[key]; 
                if (!b) continue;
                
                if (isFlora(b.type)) {
                    const [tx, ty] = getTileCoords(b.type, 0); 
                    const u_min = tx * 0.25;
                    const u_max = u_min + 0.25;
                    const v_max = 1.0 - (ty * 0.0625); 
                    const v_min = v_max - 0.0625;
                    
                    const floraVerts = [ 
                        [-0.48, 0.48, -0.48], [-0.48, -0.48, -0.48], [0.48, -0.48, 0.48], [0.48, 0.48, 0.48], 
                        [0.48, 0.48, -0.48], [0.48, -0.48, -0.48], [-0.48, -0.48, 0.48], [-0.48, 0.48, 0.48] 
                    ];
                    
                    for (let p = 0; p < 2; p++) { 
                        const offset = p * 4; 
                        for(let c = 0; c < 4; c++) { 
                            matData.pos.push(b.x + floraVerts[offset+c][0], b.y + floraVerts[offset+c][1], b.z + floraVerts[offset+c][2]); 
                            matData.norm.push(0, 1, 0); 
                            matData.foliage.push(1); 
                        } 
                        matData.uv.push(u_min, v_max, u_min, v_min, u_max, v_min, u_max, v_max); 
                        matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3); 
                        vCount += 4; 
                    }
                } else if (b.type === 'fire') {
                    // Feu en croix (deux quads perpendiculaires) comme la flore, dans le pass transparent
                    const [tx, ty] = getTileCoords('fire', 0);
                    const u_min = tx * 0.25, u_max = u_min + 0.25;
                    const v_max = 1.0 - (ty * 0.0625), v_min = v_max - 0.0625;
                    const fireCrossVerts = [
                        [-0.48, 0.48, -0.48], [-0.48, -0.48, -0.48], [0.48, -0.48, 0.48], [0.48, 0.48, 0.48],
                        [0.48, 0.48, -0.48], [0.48, -0.48, -0.48], [-0.48, -0.48, 0.48], [-0.48, 0.48, 0.48]
                    ];
                    const quadUVs = [[u_min, v_max], [u_min, v_min], [u_max, v_min], [u_max, v_max]];
                    for (let p = 0; p < 2; p++) {
                        for (let c = 0; c < 4; c++) {
                            const v = fireCrossVerts[p * 4 + c];
                            transData.pos.push(b.x + v[0], b.y + v[1], b.z + v[2]);
                            transData.norm.push(0, 1, 0);
                            transData.uv.push(quadUVs[c][0], quadUVs[c][1]);
                        }
                        transData.ind.push(tCount, tCount + 1, tCount + 2, tCount, tCount + 2, tCount + 3);
                        tCount += 4;
                    }
                } else if (transparentBlockTypes.indexOf(b.type) >= 0) {
                    // Verre / eau : faces avec texture du bloc adjacent si voisin solide (pass opaque), sinon pass transparent
                    for (let f = 0; f < 6; f++) {
                        const normal = faceNormals[f]; 
                        const nx = b.x + normal.x, ny = b.y + normal.y, nz = b.z + normal.z; 
                        const neighbor = blocks[`${nx},${ny},${nz}`];
                        let drawFace = !neighbor;
                        if (neighbor && (neighbor.type === b.type)) {
                            const dMy = distSqToBlock(b.x, b.y, b.z);
                            const dNb = distSqToBlock(nx, ny, nz);
                            const tieBreak = (b.x < nx) || (b.x === nx && b.y < ny) || (b.x === nx && b.y === ny && b.z < nz);
                            drawFace = (dMy > dNb) || (dMy === dNb && tieBreak);
                        } else if (neighbor && isTransparent(neighbor.type)) {
                            drawFace = true;
                        } else if (neighbor && !isTransparent(neighbor.type)) {
                            drawFace = true;
                        }
                        if (drawFace) {
                            const useNeighborTex = neighbor && neighbor.type !== 'air' && !isTransparent(neighbor.type);
                            const texType = useNeighborTex ? neighbor.type : b.type;
                            const texFace = useNeighborTex ? (f ^ 1) : f;
                            const [tx, ty] = getTileCoords(texType, texFace); 
                            const u_min = tx * 0.25, u_max = u_min + 0.25;
                            const v_max = 1.0 - (ty * 0.0625), v_min = v_max - 0.0625;
                            const faceUVs = [ [u_min, v_max], [u_min, v_min], [u_max, v_min], [u_max, v_max] ];
                            if (useNeighborTex) {
                                for (let c = 0; c < 4; c++) { 
                                    const v = faceVertices[f][c]; 
                                    matData.pos.push(b.x + v.x, b.y + v.y, b.z + v.z); 
                                    matData.norm.push(normal.x, normal.y, normal.z); 
                                    matData.uv.push(faceUVs[c][0], faceUVs[c][1]); 
                                    matData.foliage.push(0);
                                }
                                matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3); 
                                vCount += 4;
                            } else {
                                for (let c = 0; c < 4; c++) { 
                                    const v = faceVertices[f][c];
                                transData.pos.push(b.x + v.x, b.y + v.y, b.z + v.z); 
                                    transData.norm.push(normal.x, normal.y, normal.z); 
                                    transData.uv.push(faceUVs[c][0], faceUVs[c][1]); 
                                }
                                transData.ind.push(tCount, tCount+1, tCount+2, tCount, tCount+2, tCount+3); 
                                tCount += 4;
                            }
                        }
                    }
                } else if (b.type === 'snow_layer') {
                    const h = 0.125;
                    // Base du voxel au sol, sommet à y0 + h
                    const x0 = b.x - 0.5;
                    const y0 = b.y - 0.5;
                    const z0 = b.z - 0.5;
                    const x1 = b.x + 0.5;
                    const y1 = y0 + h;
                    const z1 = b.z + 0.5;
                    const snowFaces = [
                        { n: [1,0,0], vs: [[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]], nx: 1 },
                        { n: [-1,0,0], vs: [[x0,y0,z1],[x0,y0,z0],[x0,y1,z0],[x0,y1,z1]], nx: -1 },
                        { n: [0,1,0], vs: [[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]], ny: 1 },
                        { n: [0,0,1], vs: [[x1,y0,z1],[x0,y0,z1],[x0,y1,z1],[x1,y1,z1]], nz: 1 },
                        { n: [0,0,-1], vs: [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]], nz: -1 }
                    ];
                    const faceNormalsSnow = [[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1]];
                    const faceIdToF = [1, 0, 2, 4, 5];
                    for (let fi = 0; fi < snowFaces.length; fi++) {
                        const face = snowFaces[fi];
                        const n = face.n;
                        const neighborKey = (b.x + (n[0]||0)) + ',' + (b.y + (n[1]||0)) + ',' + (b.z + (n[2]||0));
                        const neighbor = blocks[neighborKey];
                        let drawFace = !neighbor;
                        if (neighbor && (neighbor.type === 'snow_layer')) drawFace = false;
                        if (neighbor && isTransparent(neighbor.type)) drawFace = true;
                        if (drawFace) {
                            const f = faceIdToF[fi];
                            const [tx, ty] = getTileCoords('snow', f);
                            const u_min = tx * 0.25, u_max = u_min + 0.25;
                            const v_max = 1.0 - (ty * 0.0625), v_min = v_max - 0.0625;
                            const faceUVs = [ [u_min, v_max], [u_min, v_min], [u_max, v_min], [u_max, v_max] ];
                            for (let c = 0; c < 4; c++) {
                                matData.pos.push(face.vs[c][0], face.vs[c][1], face.vs[c][2]);
                                matData.norm.push(faceNormalsSnow[fi][0], faceNormalsSnow[fi][1], faceNormalsSnow[fi][2]);
                                matData.uv.push(faceUVs[c][0], faceUVs[c][1]);
                                matData.foliage.push(0);
                            }
                            matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3);
                            vCount += 4;
                        }
                    }
                } else if (b.type === 'wooden_door') {
                    const [tx, ty] = getTileCoords('wooden_door', 0);
                    const u_min = tx * 0.25, u_max = u_min + 0.25;
                    const v_max = 1.0 - (ty * 0.0625), v_min = v_max - 0.0625;
                    const doorUVs = [[u_min, v_min], [u_max, v_min], [u_max, v_max], [u_min, v_max]];
                    
                    // L'épaisseur standard d'une porte Minecraft est de 3/16 de bloc (environ 0.1875)
                    const thick = 0.15; 
                    const bx = b.x, by = b.y, bz = b.z;
                    const doorY0 = by - 0.5, doorY1 = by + 1.5;
                
                    // Définir le point de pivot dans l'un des coins du bloc 
                    // (Ici on recule de 0.5 car bx et bz représentent le centre du bloc)
                    const pivotX = bx - 0.5;
                    const pivotZ = bz - 0.5;
                
                    if (b.open) {
                        // --- ÉTAT OUVERT ---
                        // La porte est alignée sur l'axe Z, pivotant depuis le coin (pivotX, pivotZ)
                        for (let side = 0; side < 2; side++) {
                            // Décalage sur X pour créer l'épaisseur (Face avant / Face arrière)
                            const xc = pivotX + (side * thick);
                            const normalX = side === 0 ? -1 : 1;
                            
                            // Les sommets s'étendent de pivotZ à pivotZ + 1 sur l'axe Z
                            const vs = [
                                [xc, doorY0, pivotZ + 1], 
                                [xc, doorY0, pivotZ], 
                                [xc, doorY1, pivotZ], 
                                [xc, doorY1, pivotZ + 1]
                            ];
                            
                            for (let i = 0; i < 4; i++) {
                                matData.pos.push(vs[i][0], vs[i][1], vs[i][2]);
                                matData.norm.push(normalX, 0, 0);
                                matData.uv.push(doorUVs[i][0], doorUVs[i][1]);
                                matData.foliage.push(0);
                            }
                            
                            // Inversion de l'ordre de dessin pour la face arrière (pour qu'elle soit visible)
                            if (side === 0) {
                                matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3);
                            } else {
                                matData.ind.push(vCount, vCount+3, vCount+2, vCount, vCount+2, vCount+1);
                            }
                            vCount += 4;
                        }
                    } else {
                        // --- ÉTAT FERMÉ ---
                        // La porte est pivotée de 90°, alignée sur l'axe X, depuis le coin (pivotX, pivotZ)
                        for (let side = 0; side < 2; side++) {
                            // Décalage sur Z pour créer l'épaisseur
                            const zc = pivotZ + (side * thick);
                            const normalZ = side === 0 ? -1 : 1;
                            
                            // Les sommets s'étendent de pivotX à pivotX + 1 sur l'axe X
                            // Ordre : pivotX + 1 (Gauche) puis pivotX (Droite) pour avoir le bon Winding Order
                            const vs = [
                                [pivotX + 1, doorY0, zc], 
                                [pivotX, doorY0, zc], 
                                [pivotX, doorY1, zc], 
                                [pivotX + 1, doorY1, zc]
                            ];
                            
                            for (let i = 0; i < 4; i++) {
                                matData.pos.push(vs[i][0], vs[i][1], vs[i][2]);
                                matData.norm.push(0, 0, normalZ);
                                matData.uv.push(doorUVs[i][0], doorUVs[i][1]);
                                matData.foliage.push(0);
                            }
                            
                            // Inversion de l'ordre de dessin pour la face arrière
                            if (side === 0) {
                                matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3);
                            } else {
                                matData.ind.push(vCount, vCount+3, vCount+2, vCount, vCount+2, vCount+1);
                            }
                            vCount += 4;
                        }
                    }
                } else if (b.type === 'wooden_trapdoor') {
                    const [tx, ty] = getTileCoords('wooden_trapdoor', 0);
                    const u_min = tx * 0.25, u_max = u_min + 0.25, v_max = 1.0 - (ty * 0.0625), v_min = v_max - 0.0625;
                    const trapUVs = [[u_min, v_min], [u_max, v_min], [u_max, v_max], [u_min, v_max]];
                    const thick = 0.08;
                    const bx = b.x, by = b.y, bz = b.z;
                    const hingeZ = bz - 0.5;
                    if (b.open) {
                        for (let side = 0; side < 2; side++) {
                            const zc = hingeZ + side * thick;
                            const n = side === 0 ? -1 : 1;
                            const vs = [[bx-0.5, by-0.5, zc], [bx+0.5, by-0.5, zc], [bx+0.5, by+0.5, zc], [bx-0.5, by+0.5, zc]];
                            for (let i = 0; i < 4; i++) {
                                matData.pos.push(vs[i][0], vs[i][1], vs[i][2]);
                                matData.norm.push(0, 0, n);
                                matData.uv.push(trapUVs[i][0], trapUVs[i][1]);
                                matData.foliage.push(0);
                            }
                            matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3);
                            vCount += 4;
                        }
                    } else {
                        const y0 = by - 0.5, y1 = by - 0.5 + thick;
                        for (let side = 0; side < 2; side++) {
                            const yf = side === 0 ? y1 : y0;
                            const n = side === 0 ? 1 : -1;
                            for (let i = 0; i < 4; i++) {
                                const xi = (i === 0 || i === 3) ? bx - 0.5 : bx + 0.5;
                                const zi = (i < 2) ? bz - 0.5 : bz + 0.5;
                                matData.pos.push(xi, yf, zi);
                                matData.norm.push(0, n, 0);
                                matData.uv.push(trapUVs[i][0], trapUVs[i][1]);
                                matData.foliage.push(0);
                            }
                            matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3);
                            vCount += 4;
                        }
                    }
                } else {
                    for (let f = 0; f < 6; f++) {
                        const normal = faceNormals[f]; 
                        const nx = b.x + normal.x;
                        const ny = b.y + normal.y;
                        const nz = b.z + normal.z; 
                        const neighbor = blocks[`${nx},${ny},${nz}`];
                        
                        let drawFace = !neighbor; 
                        // Afficher la face si le voisin est transparent, feuilles, porte, trappe ou neige (comme la vitre : évite de voir au travers)
                        const neighborDrawFace = neighbor && (isTransparent(neighbor.type) || neighbor.type === 'snow_layer' || neighbor.type === 'wooden_door' || neighbor.type === 'wooden_trapdoor' ||
                            neighbor.type === 'leaves' || neighbor.type === 'birch_leaves' || neighbor.type === 'maple_leaves' || neighbor.type === 'dark_leaves');
                        if (neighborDrawFace) { 
                            if (b.type === 'glass' && neighbor.type === 'glass') drawFace = false; 
                            else if (b.type === 'water' && neighbor.type === 'water') drawFace = false; 
                            else drawFace = true; 
                        }
                        
                        if (drawFace) {
                            const [tx, ty] = getTileCoords(b.type, f); 
                            const u_min = tx * 0.25;
                            const u_max = u_min + 0.25;
                            const v_max = 1.0 - (ty * 0.0625);
                            const v_min = v_max - 0.0625;
                            const faceUVs = [ [u_min, v_max], [u_min, v_min], [u_max, v_min], [u_max, v_max] ];
                            const foliage = isFoliageFace(b.type, f) ? 1 : 0;
                            for (let c = 0; c < 4; c++) { 
                                const v = faceVertices[f][c]; 
                                const yOff = v.y;
                                matData.pos.push(b.x + v.x, b.y + yOff, b.z + v.z); 
                                matData.norm.push(normal.x, normal.y, normal.z); 
                                matData.uv.push(faceUVs[c][0], faceUVs[c][1]); 
                                matData.foliage.push(foliage); 
                            }
                            matData.ind.push(vCount, vCount+1, vCount+2, vCount, vCount+2, vCount+3); 
                            vCount += 4;
                        }
                    }
                }
            }
            if (matData.pos.length > 0) {
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(matData.pos, 3));
                geometry.setAttribute('normal', new THREE.Float32BufferAttribute(matData.norm, 3));
                geometry.setAttribute('uv', new THREE.Float32BufferAttribute(matData.uv, 2));
                geometry.setAttribute('foliage', new THREE.Float32BufferAttribute(matData.foliage, 1));
                geometry.setIndex(matData.ind);
                const mesh = new THREE.Mesh(geometry, chunkMaterial);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add(mesh); 
                chunks[chunkKey] = mesh;
            }
            if (transData.pos.length > 0 && typeof window.chunkMaterialTransparent !== 'undefined') {
                const tGeo = new THREE.BufferGeometry();
                tGeo.setAttribute('position', new THREE.Float32BufferAttribute(transData.pos, 3));
                tGeo.setAttribute('normal', new THREE.Float32BufferAttribute(transData.norm, 3));
                tGeo.setAttribute('uv', new THREE.Float32BufferAttribute(transData.uv, 2));
                tGeo.setIndex(transData.ind);
                const tMesh = new THREE.Mesh(tGeo, window.chunkMaterialTransparent);
                tMesh.renderOrder = 1;
                scene.add(tMesh);
                chunkTransparent[chunkKey] = tMesh;
            }
        }

        function rebuildChunkAndBorders(bx, bz) {
            const bxInt = Math.floor(Number(bx));
            const bzInt = Math.floor(Number(bz));
            const cx = Math.floor(bxInt / chunkSize);
            const cz = Math.floor(bzInt / chunkSize);
            buildChunkMesh(cx, cz);
            const localX = bxInt - cx * chunkSize;
            const localZ = bzInt - cz * chunkSize;
            if (localX <= 0) buildChunkMesh(cx - 1, cz);
            if (localX >= chunkSize - 1) buildChunkMesh(cx + 1, cz);
            if (localZ <= 0) buildChunkMesh(cx, cz - 1);
            if (localZ >= chunkSize - 1) buildChunkMesh(cx, cz + 1);
        }

        const seaLevel = -2;
        function getRawHeightAt(x, z) {
            let e = fbm(x, z, 3, 0.012);
            let m = fbm(x + 500, z + 500, 2, 0.02);
            let t = fbm(x + 300, z + 700, 2, 0.025);
            let rawH;
            if (e > 0.62) {
                rawH = e * 14 + fbm(x * 1.2, z * 1.2, 4, 0.03) * 4 + 2;
            } else if (m < 0.38 || e < 0.35) {
                rawH = fbm(x, z, 4, 0.01) * 10 + fbm(x + 200, z, 2, 0.02) * 4 + 1;
            } else {
                rawH = fbm(x, z, 3, 0.015) * 12 + fbm(x + 100, z + 100, 2, 0.02) * 5 + 2;
            }
            let h = Math.floor(rawH);
            // Océans : grandes dépressions avec vraie profondeur (jusqu'à ~25 blocs sous la surface)
            const oceanNoise = fbm(x * 0.004 + 2000, z * 0.004 + 2000, 2, 0.4);
            if (oceanNoise > 0.52) {
                const depth = Math.floor((oceanNoise - 0.52) * 48);
                h = Math.min(h, seaLevel - 1 - depth);
            }
            // Rivières : très présentes et bien marquées
            let riverNoise = Math.abs(fbm(x + 1000, z + 1000, 2, 0.01) - 0.5) * 2.0;
            if (riverNoise < 0.5) {
                let drop = Math.floor((0.5 - riverNoise) * 18);
                h = Math.max(seaLevel - 2, h - drop);
            }
            if (h > seaLevel && h <= seaLevel + 2) h = seaLevel + 1;
            return h;
        }

        /** Retourne { x, z } pour placer une structure de demi-taille (halfW, halfD) entièrement dans le chunk [startX, startX+chunkSize-1] x [startZ, startZ+chunkSize-1]. */
        function structureCenterInChunk(startX, startZ, halfW, halfD) {
            const minX = startX + halfW, maxX = startX + chunkSize - 1 - halfW;
            const minZ = startZ + halfD, maxZ = startZ + chunkSize - 1 - halfD;
            if (minX > maxX || minZ > maxZ) return null;
            return {
                x: minX + Math.floor(Math.random() * (maxX - minX + 1)),
                z: minZ + Math.floor(Math.random() * (maxZ - minZ + 1))
            };
        }

        function generateChunk(cx, cz) {
            window._currentGenerateChunk = { cx, cz };
            window._chunksModifiedDuringGenerate = new Set();
            const startX = cx * chunkSize;
            const startZ = cz * chunkSize;
            const chunkCenterX = startX + chunkSize / 2, chunkCenterZ = startZ + chunkSize / 2;
            const allowMobs = (typeof yawObject === 'undefined' || !yawObject.position) ||
                ((yawObject.position.x - chunkCenterX) ** 2 + (yawObject.position.z - chunkCenterZ) ** 2 <= (2.5 * chunkSize) ** 2);
            let flatCount = 0; 
            let chunkBiome = 'plains'; 
            const heightMap = {};

            for (let dx = 0; dx < chunkSize; dx++) {
                for (let dz = 0; dz < chunkSize; dz++) {
                    let x = startX + dx;
                    let z = startZ + dz;
                    let h = getRawHeightAt(x, z);
                    var hLeft = (dx > 0) ? heightMap[(x - 1) + ',' + z] : getRawHeightAt(x - 1, z);
                    var hFront = (dz > 0) ? heightMap[x + ',' + (z - 1)] : getRawHeightAt(x, z - 1);
                    var hMax = Math.min(hLeft + 1, hFront + 1);
                    var hMin = Math.max(hLeft - 1, hFront - 1);
                    h = Math.max(hMin, Math.min(hMax, h));
                    heightMap[x + ',' + z] = h;

                    if (h >= -1 && h <= 3) flatCount++;
                    
                    let e = fbm(x, z, 3, 0.012);
                    let m = fbm(x + 500, z + 500, 2, 0.02);
                    let t = fbm(x + 300, z + 700, 2, 0.025);
                    let surface = 'grass', sub = 'dirt', treeProb = 0;
                    const seaInfluence = h <= seaLevel ? 1 : 0;
                    const mountInfluence = smoothstep(0.55, 0.68, e) * (1 - seaInfluence);
                    const desertInfluence = smoothstep(0.42, 0.32, m) * (1 - seaInfluence) * (1 - mountInfluence);
                    const taigaInfluence = smoothstep(0.55, 0.68, t) * smoothstep(0.35, 0.45, e) * (1 - seaInfluence - mountInfluence - desertInfluence);
                    const jungleInfluence = smoothstep(0.68, 0.78, m) * (1 - seaInfluence - mountInfluence - desertInfluence - taigaInfluence);
                    const birchForestScale = 0.6 + 0.4 * Math.max(0, Math.min(1, fbm(x * 0.0015, z * 0.0015 + 500, 2, 0.3)));
                    const oakForestScale = 0.6 + 0.4 * Math.max(0, Math.min(1, fbm(x * 0.0015 + 300, z * 0.0015 + 800, 2, 0.3)));
                    const birchInfluence = birchForestScale * smoothstep(0.52, 0.58, m) * smoothstep(0.48, 0.58, e) * (1 - seaInfluence - mountInfluence - desertInfluence - taigaInfluence - jungleInfluence);
                    const mapleInfluence = smoothstep(0.45, 0.52, m) * smoothstep(0.5, 0.6, t) * (1 - seaInfluence - mountInfluence - desertInfluence - taigaInfluence - jungleInfluence - birchInfluence);
                    const darkForestInfluence = smoothstep(0.6, 0.72, m) * smoothstep(0.4, 0.5, e) * (1 - seaInfluence - mountInfluence - desertInfluence - taigaInfluence - jungleInfluence - birchInfluence - mapleInfluence);
                    const forestInfluence = oakForestScale * smoothstep(0.48, 0.58, m) * (1 - jungleInfluence - birchInfluence - mapleInfluence - darkForestInfluence) * (1 - seaInfluence - mountInfluence - desertInfluence - taigaInfluence);
                    const plainsInfluence = Math.max(0, 1 - seaInfluence - mountInfluence - desertInfluence - taigaInfluence - jungleInfluence - birchInfluence - mapleInfluence - darkForestInfluence - forestInfluence);
                    const totalInf = seaInfluence + mountInfluence + desertInfluence + taigaInfluence + jungleInfluence + birchInfluence + mapleInfluence + darkForestInfluence + forestInfluence + plainsInfluence;
                    const r = Math.random();
                    if (seaInfluence >= 0.5 || h <= seaLevel) {
                        chunkBiome = 'ocean'; surface = 'sand'; sub = 'sand'; treeProb = 0;
                    } else {
                        let acc = 0;
                        const pick = totalInf > 0 ? r * totalInf : r;
                        if ((acc += mountInfluence) >= pick) { chunkBiome = 'mountains'; surface = 'grass'; sub = 'stone'; treeProb = 0.015; }
                        else if ((acc += desertInfluence) >= pick) { chunkBiome = 'desert'; surface = 'sand'; sub = 'sand'; treeProb = 0; }
                        else if ((acc += taigaInfluence) >= pick) { chunkBiome = 'taiga'; surface = 'grass'; sub = 'dirt'; treeProb = 0.03; }
                        else if ((acc += jungleInfluence) >= pick) { chunkBiome = 'jungle'; surface = 'grass'; sub = 'dirt'; treeProb = 0.06; }
                        else if ((acc += birchInfluence) >= pick) { chunkBiome = 'birch_forest'; surface = 'grass_birch'; sub = 'dirt'; treeProb = 0.025; }
                        else if ((acc += mapleInfluence) >= pick) { chunkBiome = 'maple_forest'; surface = 'grass'; sub = 'dirt'; treeProb = 0.022; }
                        else if ((acc += darkForestInfluence) >= pick) { chunkBiome = 'dark_forest'; surface = 'grass'; sub = 'dirt'; treeProb = 0.04; }
                        else if ((acc += forestInfluence) >= pick) { chunkBiome = 'forest'; surface = 'grass'; sub = 'dirt'; treeProb = 0.02; }
                        else { chunkBiome = 'plains'; surface = 'grass'; sub = 'dirt'; treeProb = 0.001; }
                    }

                    for (let y = h; y >= -15; y--) { 
                        let isCave = false;
                        if (y < h - 3) {
                            let cave1 = Math.sin(x * 0.12 + y * 0.08) * Math.cos(z * 0.12);
                            let cave2 = Math.sin(z * 0.1 + y * 0.06) * Math.cos(x * 0.1);
                            let cave3 = smoothNoise(x * 0.08, z * 0.08 + y * 0.05);
                            let caveNoise = (cave1 + cave2) * 0.5 + cave3 * 0.3;
                            if (caveNoise > 0.55) isCave = true;
                        }

                        if(isCave) continue;

                        let bType = (y === h) ? surface : sub;
                        if (y < h - 4) bType = 'stone';

                        if (bType === 'stone') {
                            if (y < -10 && Math.random() < 0.012) bType = 'diamond_ore';
                            else if (y < -2 && Math.random() < 0.03) bType = 'iron_ore';
                            else if (y < -8 && Math.random() < 0.025) bType = 'gold_ore';
                            else if (Math.random() < 0.045) bType = 'coal_ore';
                        }
                        addBlock(x, y, z, bType);
                    }
                    addBlock(x, -16, z, 'cobblestone');

                    for (let y = h + 1; y <= seaLevel; y++) {
                        addBlock(x, y, z, 'water');
                    }

                    if (h > seaLevel) {
                        const treeFitsInChunk = (dx >= 2 && dx <= 13 && dz >= 2 && dz <= 13);
                        const cactusFitsInChunk = (dx >= 1 && dx <= 14 && dz >= 1 && dz <= 14);
                        if (treeFitsInChunk && chunkBiome === 'mountains' && Math.random() < treeProb) {
                            buildSpruceTree(x, h + 1, z);
                        } else if (treeFitsInChunk && chunkBiome === 'birch_forest' && Math.random() < treeProb) {
                            buildBirchTree(x, h + 1, z);
                        } else if (treeFitsInChunk && chunkBiome === 'maple_forest' && Math.random() < treeProb) {
                            buildMapleTree(x, h + 1, z);
                        } else if (treeFitsInChunk && chunkBiome === 'dark_forest' && Math.random() < treeProb) {
                            buildDarkTree(x, h + 1, z);
                        } else if (treeFitsInChunk && chunkBiome === 'forest' && Math.random() < treeProb) {
                            let treeHeight = 4;
                            buildOakTree(x, h + 1, z, treeHeight);
                        } else if (treeFitsInChunk && Math.random() < treeProb && chunkBiome !== 'desert') {
                            let treeHeight = (chunkBiome === 'jungle') ? 6 : (chunkBiome === 'taiga' ? 5 : 4);
                            buildTree(x, h + 1, z, treeHeight); 
                        } else if (cactusFitsInChunk && chunkBiome === 'desert' && Math.random() < 0.008) {
                            let cHeight = 2 + Math.floor(Math.random() * 3); 
                            for(let cy = 0; cy < cHeight; cy++) addBlock(x, h + 1 + cy, z, 'cactus');
                        } else if (surface === 'grass' || surface === 'grass_birch') {
                            const r = Math.random();
                            if (r > 0.97) addBlock(x, h + 1, z, 'tall_grass');
                            else if (r > 0.96 && (chunkBiome === 'forest' || chunkBiome === 'jungle' || chunkBiome === 'birch_forest' || chunkBiome === 'maple_forest' || chunkBiome === 'dark_forest')) addBlock(x, h + 1, z, 'tall_grass');
                            else if (r > 0.997) addBlock(x, h + 1, z, 'flower_yellow');
                            else if (r > 0.994) addBlock(x, h + 1, z, 'flower_red');
                            
                            if (allowMobs) {
                                let rMob = Math.random();
                                const surfaceY = h + 0.5;
                                const menuMore = (typeof window.menuPreviewGenerating !== 'undefined' && window.menuPreviewGenerating);
                                if (chunkBiome === 'mountains' && (menuMore ? rMob > 0.98 : rMob > 0.994)) spawnMob(x, surfaceY, z, 'goat');
                                else if (menuMore ? rMob > 0.97 : rMob > 0.992) spawnMob(x, surfaceY, z, ['pig', 'cow', 'chicken', 'sheep'][Math.floor(Math.random() * 4)]);
                                else if (typeof isNight === 'function' && isNight() && (menuMore ? rMob > 0.97 : rMob > 0.988)) spawnMob(x, surfaceY, z, 'zombie');
                                else if (typeof isNight === 'function' && isNight() && (menuMore ? rMob > 0.965 : rMob > 0.985)) spawnMob(x, surfaceY, z, 'creeper');
                            }
                        }
                        if (chunkBiome === 'mountains' && h > seaLevel) {
                            const snowKey = `${x},${h + 1},${z}`;
                            if (!blocks[snowKey]) addBlock(x, h + 1, z, 'snow_layer');
                        }
                    }
                }
            }

            if (chunkBiome === 'mountains' && Math.random() < 0.012) {
                const c = structureCenterInChunk(startX, startZ, 1, 1);
                if (c) { const my = getSurfaceHeight(c.x, c.z) + 1; buildMountainCabin(c.x, my, c.z); }
            }
            if (chunkBiome === 'desert' && Math.random() < 0.02) {
                const c = structureCenterInChunk(startX, startZ, 5, 5);
                if (c) buildDesertTemple(c.x, getSurfaceHeight(c.x, c.z), c.z);
            }
            if (Math.random() < 0.04) {
                const c = structureCenterInChunk(startX, startZ, 1, 1);
                if (c) buildRuin(c.x, c.z);
            }
            if (Math.random() < 0.012) {
                const c = structureCenterInChunk(startX, startZ, 2, 2);
                if (c) buildDungeon(c.x, c.z);
            }
            if (chunkBiome === 'desert' && Math.random() < 0.045) {
                const c = structureCenterInChunk(startX, startZ, 1, 1);
                if (c) buildWell(c.x, getSurfaceHeight(c.x, c.z), c.z, 'sand');
            }

            const isSpawnChunk = (cx === 0 && cz === 0);
            if (isSpawnChunk || (flatCount > 150 && Math.random() < 0.08 && (chunkBiome === 'plains' || chunkBiome === 'desert'))) {
                const vx = startX + 8; 
                const vz = startZ + 8;
                let pathMat = chunkBiome === 'desert' ? 'sand' : 'grass_path'; 
                let buildMat = chunkBiome === 'desert' ? 'sand' : 'cobblestone'; 
                let woodMat = chunkBiome === 'desert' ? 'planks' : 'planks';
                if (typeof addBlock === 'undefined') return;
                function groundAt(px, pz) { return getSurfaceHeight(px, pz); }

                const villageLayout = [
                    { type: 'house', dx: -8, dz: -8 },
                    { type: 'church', dx: 8, dz: -8 },
                    { type: 'forge', dx: -8, dz: 8 },
                    { type: 'house', dx: 8, dz: 8 },
                    { type: 'house', dx: 0, dz: -10 } 
                ];

                for (let b of villageLayout) {
                    let bX = vx + b.dx;
                    let bZ = vz + b.dz;
                    const bGroundY = groundAt(bX, bZ);
                    buildPath(vx, vz, bX, bZ, pathMat);
                    if (b.type === 'house') {
                        buildHouse(bX, bZ, buildMat, woodMat, bGroundY);
                    } else if (b.type === 'church') {
                        buildChurch(bX, bZ, buildMat, bGroundY); 
                    } else if (b.type === 'forge') {
                        buildForge(bX, bZ, buildMat, bGroundY);
                    }
                    if (allowMobs && typeof window.spawnMob === 'function') window.spawnMob(bX, bGroundY + 0.5, bZ + 2, 'villager');
                }
                buildWell(vx, groundAt(vx, vz), vz, chunkBiome === 'desert' ? 'sand' : 'cobblestone');
            }
            window._currentGenerateChunk = null;
        }

        function buildWell(cx, groundY, cz, mat) {
            const floorY = groundY + 1;
            for (let ix = -1; ix <= 1; ix++) {
                for (let iz = -1; iz <= 1; iz++) {
                    if (ix === 0 && iz === 0) {
                        addBlock(cx + ix, floorY, cz + iz, 'water');
                        addBlock(cx + ix, floorY + 1, cz + iz, 'water');
                    } else {
                        replaceBlockType(cx + ix, groundY, cz + iz, mat);
                        addBlock(cx + ix, floorY, cz + iz, mat);
                        addBlock(cx + ix, floorY + 1, cz + iz, mat);
                    }
                }
            }
            addBlock(cx + 1, floorY + 2, cz, mat); addBlock(cx - 1, floorY + 2, cz, mat);
            addBlock(cx, floorY + 2, cz + 1, mat); addBlock(cx, floorY + 2, cz - 1, mat);
        }

        function buildDesertTemple(tx, baseY, tz) {
            const floorY = baseY + 1;
            const layers = 5;
            const baseR = 5;
            for (let layer = 0; layer < layers; layer++) {
                const r = baseR - layer;
                for (let ix = -r; ix <= r; ix++) {
                    for (let iz = -r; iz <= r; iz++) {
                        if (Math.abs(ix) !== r && Math.abs(iz) !== r && layer > 0) continue;
                        if (layer === 0) replaceBlockType(tx + ix, floorY + layer, tz + iz, 'sand');
                        else addBlock(tx + ix, floorY + layer, tz + iz, 'sand');
                    }
                }
            }
            replaceBlockType(tx, floorY, tz, 'sand');
            for (let dy = 0; dy <= 2; dy++) replaceBlockType(tx, baseY - dy, tz, 'sand');
            const secretY = baseY - 3;
            for (let ix = -1; ix <= 1; ix++) for (let iz = -1; iz <= 1; iz++) {
                replaceBlockType(tx + ix, secretY, tz + iz, 'sand');
                replaceBlockType(tx + ix, secretY - 1, tz + iz, 'sand');
            }
            addBlock(tx, secretY, tz, 'chest');
            addBlock(tx + 1, secretY, tz, 'torch');
            addBlock(tx - 1, secretY, tz, 'gold_ore');
        }

        function buildRuin(rx, rz) {
            const ry = getSurfaceHeight(rx, rz) + 1;
            const w = 2 + (Math.random() > 0.5 ? 1 : 0);
            for (let dx = 0; dx < w; dx++) for (let dz = 0; dz < 2; dz++) {
                addBlock(rx + dx, ry, rz + dz, 'cobblestone');
                if (Math.random() < 0.4) addBlock(rx + dx, ry + 1, rz + dz, 'cobblestone');
            }
        }

        function buildDungeon(dx, dz) {
            const floorY = getSurfaceHeight(dx, dz) + 1;
            for (let ix = -2; ix <= 2; ix++) for (let iz = -2; iz <= 2; iz++) {
                replaceBlockType(dx + ix, floorY - 1, dz + iz, 'cobblestone');
                addBlock(dx + ix, floorY, dz + iz, (Math.abs(ix) === 2 || Math.abs(iz) === 2) ? 'cobblestone' : 'stone');
                if (Math.abs(ix) === 2 || Math.abs(iz) === 2) addBlock(dx + ix, floorY + 1, dz + iz, 'cobblestone');
            }
            addBlock(dx, floorY + 1, dz, 'chest');
            addBlock(dx + 1, floorY + 1, dz, 'iron_ore');
            addBlock(dx - 1, floorY + 1, dz, 'iron_ore');
            addBlock(dx, floorY + 1, dz + 1, Math.random() < 0.4 ? 'diamond_ore' : 'coal_ore');
        }

        function fbm(x, z, octaves, freq=0.03) { 
            let v = 0, amp = 0.5; 
            for(let i = 0; i < octaves; i++) { 
                v += smoothNoise(x * freq, z * freq) * amp; 
                amp *= 0.5; 
                freq *= 2; 
            } 
            return v; 
        }

        function hash(x, z) { 
            const seed = (typeof window !== 'undefined' && window.worldSeed) ? window.worldSeed * 0.0001 : 0;
            let h = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453123; 
            return h - Math.floor(h); 
        }

        function smoothNoise(x, z) { 
            let ix = Math.floor(x), iz = Math.floor(z); 
            let fx = x - ix, fz = z - iz; 
            fx = fx * fx * (3 - 2 * fx); 
            fz = fz * fz * (3 - 2 * fz); 
            let a = hash(ix, iz), b = hash(ix + 1, iz); 
            let c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1); 
            return a * (1 - fx) * (1 - fz) + b * fx * (1 - fz) + c * (1 - fx) * fz + d * fx * fz; 
        }

        function buildTree(x, y, z, height = 4) { 
            for(let i = 0; i < height; i++) addBlock(x, y + i, z, 'birch_wood'); 
            for(let dx = -2; dx <= 2; dx++) { 
                for(let dz = -2; dz <= 2; dz++) { 
                    for(let dy = height - 1; dy <= height + 1; dy++) { 
                        if(Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === height + 1) continue; 
                        if(dx === 0 && dz === 0 && dy < height + 1) continue; 
                        addBlock(x + dx, y + dy, z + dz, 'birch_leaves'); 
                    } 
                } 
            } 
        }

        function buildOakTree(x, y, z, height = 4) { 
            for(let i = 0; i < height; i++) addBlock(x, y + i, z, 'wood'); 
            for(let dx = -2; dx <= 2; dx++) { 
                for(let dz = -2; dz <= 2; dz++) { 
                    for(let dy = height - 1; dy <= height + 1; dy++) { 
                        if(Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === height + 1) continue; 
                        if(dx === 0 && dz === 0 && dy < height + 1) continue; 
                        addBlock(x + dx, y + dy, z + dz, 'leaves'); 
                    } 
                } 
            } 
        }

        function buildSpruceTree(x, y, z) {
            const height = 8 + Math.floor(Math.random() * 5);
            for (let i = 0; i < height; i++) addBlock(x, y + i, z, 'wood');
            const layers = [
                { start: height - 5, radius: 2 },
                { start: height - 3, radius: 2 },
                { start: height - 1, radius: 1 },
                { start: height, radius: 0 }
            ];
            for (const layer of layers) {
                for (let dy = 0; dy <= (layer.radius === 0 ? 0 : 1); dy++) {
                    const yLeaf = y + layer.start + dy;
                    for (let dx = -layer.radius; dx <= layer.radius; dx++) {
                        for (let dz = -layer.radius; dz <= layer.radius; dz++) {
                            if (dx === 0 && dz === 0 && yLeaf < y + height) continue;
                            if (layer.radius > 0 && Math.abs(dx) === layer.radius && Math.abs(dz) === layer.radius && Math.random() < 0.35) continue;
                            addBlock(x + dx, yLeaf, z + dz, 'birch_leaves');
                        }
                    }
                }
            }
        }

        function buildBirchTree(x, y, z) {
            const height = 4 + Math.floor(Math.random() * 2);
            for (let i = 0; i < height; i++) addBlock(x, y + i, z, 'birch_wood');
            for (let dx = -2; dx <= 2; dx++) {
                for (let dz = -2; dz <= 2; dz++) {
                    for (let dy = height - 1; dy <= height + 1; dy++) {
                        if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === height + 1) continue;
                        if (dx === 0 && dz === 0 && dy < height + 1) continue;
                        addBlock(x + dx, y + dy, z + dz, 'birch_leaves');
                    }
                }
            }
        }

        function buildMapleTree(x, y, z) {
            const height = 4 + Math.floor(Math.random() * 2);
            for (let i = 0; i < height; i++) addBlock(x, y + i, z, 'maple_wood');
            for (let dx = -2; dx <= 2; dx++) {
                for (let dz = -2; dz <= 2; dz++) {
                    for (let dy = height - 1; dy <= height + 1; dy++) {
                        if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === height + 1) continue;
                        if (dx === 0 && dz === 0 && dy < height + 1) continue;
                        addBlock(x + dx, y + dy, z + dz, 'maple_leaves');
                    }
                }
            }
        }

        function buildDarkTree(x, y, z) {
            const height = 5 + Math.floor(Math.random() * 2);
            for (let i = 0; i < height; i++) addBlock(x, y + i, z, 'dark_wood');
            for (let dx = -2; dx <= 2; dx++) {
                for (let dz = -2; dz <= 2; dz++) {
                    for (let dy = height - 2; dy <= height + 1; dy++) {
                        if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === height + 1) continue;
                        if (dx === 0 && dz === 0 && dy < height + 1) continue;
                        if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && Math.random() < 0.3) continue;
                        addBlock(x + dx, y + dy, z + dz, 'dark_leaves');
                    }
                }
            }
        }

        function buildMountainCabin(bx, baseY, bz) {
            const floorY = baseY + 1;
            for (let ix = -1; ix <= 1; ix++) {
                for (let iz = -1; iz <= 1; iz++) {
                    replaceBlockType(bx + ix, baseY, bz + iz, 'planks');
                    addBlock(bx + ix, floorY, bz + iz, 'planks');
                }
            }
            for (let ix = -1; ix <= 1; ix++) {
                for (let iz = -1; iz <= 1; iz++) {
                    if (ix === 0 && iz === 0) continue;
                    addBlock(bx + ix, floorY + 1, bz + iz, 'planks');
                    addBlock(bx + ix, floorY + 2, bz + iz, 'wood');
                }
            }
            addBlock(bx, floorY + 1, bz, 'planks');
            addBlock(bx, floorY + 2, bz, 'wood');
            addBlock(bx, floorY + 3, bz, 'wood');
            addBlock(bx + 1, floorY + 1, bz, 'crafting_table');
            addBlock(bx - 1, floorY + 1, bz, 'torch');
        }

        function buildHouse(baseX, baseZ, block1='cobblestone', block2='planks', villageGroundY = null) { 
            let baseY = villageGroundY !== null ? villageGroundY : getSurfaceHeight(baseX, baseZ); 
            let floorY = baseY + 1;

            for(let x = -2; x <= 2; x++) { 
                for(let z = -2; z <= 2; z++) { 
                    let realX = baseX + x;
                    let realZ = baseZ + z;
                    let groundY = villageGroundY !== null ? villageGroundY : getSurfaceHeight(realX, realZ);
                    for(let fy = groundY; fy <= floorY; fy++) {
                        replaceBlockType(realX, fy, realZ, block1);
                    }

                    if(Math.abs(x) === 2 || Math.abs(z) === 2) { 
                        for(let y = 1; y <= 3; y++) { 
                            if(x === 0 && z === 2 && (y === 1 || y === 2)) continue; 
                            if(y === 2 && Math.abs(x) === 2 && z === 0) {
                                addBlock(realX, floorY + y, realZ, 'glass'); 
                            } else {
                                addBlock(realX, floorY + y, realZ, block2); 
                            }
                        } 
                    } 
                    if(Math.abs(x) <= 2 && Math.abs(z) <= 2) addBlock(realX, floorY + 4, realZ, 'wood'); 
                    if(Math.abs(x) <= 1 && Math.abs(z) <= 1) addBlock(realX, floorY + 5, realZ, 'wood'); 
                } 
            } 
            addBlock(baseX, floorY + 6, baseZ, 'wood'); 
            addBlock(baseX - 1, floorY + 1, baseZ - 1, 'crafting_table');
            addBlock(baseX + 1, floorY + 1, baseZ, 'chest');
            addBlock(baseX + 1, floorY + 1, baseZ + 1, 'planks');
            if (Math.random() < 0.5) addBlock(baseX, floorY + 1, baseZ + 1, 'torch');
            addBlock(baseX, floorY + 1, baseZ + 2, 'wooden_door');
        }

        function buildChurch(baseX, baseZ, mat='cobblestone', villageGroundY = null) { 
            let baseY = villageGroundY !== null ? villageGroundY : getSurfaceHeight(baseX, baseZ);
            let floorY = baseY + 1;
            for(let x = -2; x <= 2; x++) { 
                for(let z = -3; z <= 3; z++) { 
                    let realX = baseX + x; let realZ = baseZ + z;
                    let groundY = villageGroundY !== null ? villageGroundY : getSurfaceHeight(realX, realZ);
                    for(let fy = groundY; fy <= floorY; fy++) replaceBlockType(realX, fy, realZ, mat);
                    
                    if(Math.abs(x) === 2 || Math.abs(z) === 3) { 
                        for(let y = 1; y <= 5; y++) { 
                            if(x === 0 && z === 3 && (y === 1 || y === 2)) continue; 
                            if(y === 3 && Math.abs(x) === 2 && Math.abs(z) === 1) addBlock(realX, floorY + y, realZ, 'glass'); 
                            else addBlock(realX, floorY + y, realZ, mat); 
                        } 
                    } 
                    addBlock(realX, floorY + 6, realZ, mat); 
                } 
            } 
            for(let y = 7; y <= 9; y++) addBlock(baseX, floorY + y, baseZ, mat); 
            addBlock(baseX - 1, floorY + 8, baseZ, mat); 
            addBlock(baseX + 1, floorY + 8, baseZ, mat);
            addBlock(baseX + 1, floorY + 1, baseZ, 'chest');
            addBlock(baseX, floorY + 1, baseZ + 1, 'torch');
            addBlock(baseX, floorY + 1, baseZ + 3, 'wooden_door');
        }

        function buildForge(baseX, baseZ, mat='cobblestone', villageGroundY = null) { 
            let baseY = villageGroundY !== null ? villageGroundY : getSurfaceHeight(baseX, baseZ);
            let floorY = baseY + 1;
            for(let x = -2; x <= 2; x++) { 
                for(let z = -2; z <= 2; z++) { 
                    let realX = baseX + x; let realZ = baseZ + z;
                    let groundY = villageGroundY !== null ? villageGroundY : getSurfaceHeight(realX, realZ);
                    for(let fy = groundY; fy <= floorY; fy++) replaceBlockType(realX, fy, realZ, mat);
                    
                    if(Math.abs(x) === 2 || Math.abs(z) === 2) { 
                        for(let y = 1; y <= 3; y++) { 
                            if(z === 2 && Math.abs(x) <= 1) continue; 
                            addBlock(realX, floorY + y, realZ, mat); 
                        } 
                    } else if(x === 1 && z === -1) { 
                        addBlock(realX, floorY + 1, realZ, 'stone'); 
                        addBlock(realX, floorY + 2, realZ, mat); 
                        addBlock(realX, floorY + 3, realZ, mat); 
                    } 
                    if(Math.abs(x) <= 2 && Math.abs(z) <= 2) addBlock(realX, floorY + 4, realZ, 'wood'); 
                } 
            } 
            addBlock(baseX - 1, floorY + 1, baseZ, 'crafting_table');
            addBlock(baseX + 1, floorY + 1, baseZ + 1, 'chest');
            addBlock(baseX + 1, floorY + 1, baseZ, 'coal_ore');
            addBlock(baseX, floorY + 1, baseZ + 1, 'iron_ore');
            if (Math.random() < 0.5) addBlock(baseX - 1, floorY + 1, baseZ + 1, 'coal_ore');
            addBlock(baseX, floorY + 1, baseZ + 2, 'wooden_door');
        }

        function requestChunk(cx, cz) { 
            const chunkKey = `${cx},${cz}`; 
            if (loadedChunks.has(chunkKey)) return; 
            loadedChunks.add(chunkKey); 
            chunksQueue.push({ cx, cz, meshOnly: false }); 
        }

        window._chunkQueueFrameSkip = 0;
        function processChunksQueue() { 
            window._chunkQueueFrameSkip = (window._chunkQueueFrameSkip || 0) + 1;
            if ((window._chunkQueueFrameSkip % 2) !== 0) return;
            if (chunksQueue.length === 0) return;
            const item = chunksQueue.shift(); 
            const { cx, cz, meshOnly } = item || {};
            if (meshOnly) {
                buildChunkMesh(cx, cz);
                return;
            }
            generateChunk(cx, cz); 
            buildChunkMesh(cx, cz);
            if (window._chunksModifiedDuringGenerate && window._chunksModifiedDuringGenerate.size > 0) {
                window._chunksModifiedDuringGenerate.forEach(function (chunkKey) {
                    const parts = chunkKey.split(',');
                    if (parts.length === 2) buildChunkMesh(parseInt(parts[0], 10), parseInt(parts[1], 10));
                });
                window._chunksModifiedDuringGenerate = new Set();
            }
            chunksQueue.push({ cx: cx - 1, cz, meshOnly: true });
            chunksQueue.push({ cx: cx + 1, cz, meshOnly: true });
            chunksQueue.push({ cx, cz: cz - 1, meshOnly: true });
            chunksQueue.push({ cx, cz: cz + 1, meshOnly: true });
        }

        function getSurfaceHeight(x, z) {
            return getRawHeightAt(Math.floor(x), Math.floor(z));
        }
        window.getSurfaceHeight = getSurfaceHeight;

        /** Retourne true si un bloc solide (collision) est à (bx, by, bz). Porte/trappe : toujours false (collision gérée par panneau dans isColliding). */
        function blockSolidAt(bx, by, bz) {
            const key = Math.round(bx) + ',' + Math.round(by) + ',' + Math.round(bz);
            const b = blocks[key];
            if (!b || b.type === 'air') return false;
            if (typeof window.BLOCK_REGISTRY !== 'undefined' && window.BLOCK_REGISTRY.isFlora(b.type)) return false;
            if (b.type === 'snow_layer') return false;
            if (b.type === 'wooden_door' || b.type === 'wooden_trapdoor') return false;
            return true;
        }
        if (typeof window !== 'undefined') window.blockSolidAt = blockSolidAt;

        /** AABB du panneau (porte ou trappe) pour les collisions. Retourne { minX, minY, minZ, maxX, maxY, maxZ } ou null. */
        window.getDoorTrapdoorPanelBounds = function(b) {
            if (!b || (b.type !== 'wooden_door' && b.type !== 'wooden_trapdoor')) return null;
            const doorThick = 0.15, trapThick = 0.08;
            const bx = b.x, by = b.y, bz = b.z;
            if (b.type === 'wooden_door') {
                const bottomBlock = (blocks[bx + ',' + (by - 1) + ',' + bz] && blocks[bx + ',' + (by - 1) + ',' + bz].type === 'wooden_door') ? blocks[bx + ',' + (by - 1) + ',' + bz] : b;
                const doorBottomY = bottomBlock.y;
                const pivotX = bx - 0.5, pivotZ = bz - 0.5;
                const doorY0 = doorBottomY - 0.5, doorY1 = doorBottomY + 1.5;
                if (bottomBlock.open) {
                    return { minX: pivotX, minY: doorY0, minZ: pivotZ, maxX: pivotX + doorThick, maxY: doorY1, maxZ: pivotZ + 1 };
                } else {
                    return { minX: pivotX, minY: doorY0, minZ: pivotZ, maxX: pivotX + 1, maxY: doorY1, maxZ: pivotZ + doorThick };
                }
            }
            if (b.type === 'wooden_trapdoor') {
                const hingeZ = bz - 0.5;
                if (b.open) {
                    return { minX: bx - 0.5, minY: by - 0.5, minZ: hingeZ, maxX: bx + 0.5, maxY: by + 0.5, maxZ: hingeZ + trapThick };
                } else {
                    return { minX: bx - 0.5, minY: by - 0.5, minZ: bz - 0.5, maxX: bx + 0.5, maxY: by - 0.5 + trapThick, maxZ: bz + 0.5 };
                }
            }
            return null;
        };

        /** Retourne le bloc à (bx, by, bz) ou null. Pour l'IA des villageois. */
        if (typeof window !== 'undefined') {
            window.getBlockAt = function(bx, by, bz) {
                const key = Math.round(bx) + ',' + Math.round(by) + ',' + Math.round(bz);
                return blocks[key] || null;
            };
        }
        /** Ouvre ou ferme une porte à (bx, by, bz). Utilisé par les villageois. */
        if (typeof window !== 'undefined') {
            window.toggleDoorAt = function(bx, by, bz) {
                const key = Math.round(bx) + ',' + Math.round(by) + ',' + Math.round(bz);
                const b = blocks[key];
                if (!b || b.type !== 'wooden_door') return false;
                b.open = !b.open;
                rebuildChunkAndBorders(Math.round(bx), Math.round(bz));
                return true;
            };
        }

        /** Bloc visé (pour outline, clic) : prend en compte la hitbox fixe des portes/trappes (toujours le bloc d’origine). */
        window.getTargetBlockForInteraction = function(raycaster, maxDist) {
            maxDist = maxDist || 6;
            const chunkMeshes = Object.values(chunks).concat(typeof chunkTransparent !== 'undefined' ? Object.values(chunkTransparent) : []);
            const intersects = raycaster.intersectObjects(chunkMeshes, true);
            const origin = raycaster.ray.origin;
            const hitPoint = new THREE.Vector3();
            const box = new THREE.Box3();

            let meshResult = null;
            if (intersects.length > 0 && intersects[0].distance <= maxDist) {
                const pIn = intersects[0].point.clone().sub(intersects[0].face.normal.clone().multiplyScalar(0.1));
                let bx = Math.round(pIn.x), by = Math.round(pIn.y), bz = Math.round(pIn.z);
                let b = blocks[bx + ',' + by + ',' + bz];
                if (b && b.type === 'wooden_door' && by > 0) {
                    const below = blocks[bx + ',' + (by - 1) + ',' + bz];
                    if (below && below.type === 'wooden_door') { by--; b = below; }
                }
                if (b) meshResult = { bx, by, bz, block: b, distance: intersects[0].distance };
            }

            let doorResult = null;
            const px = typeof yawObject !== 'undefined' ? yawObject.position.x : origin.x;
            const py = typeof yawObject !== 'undefined' ? yawObject.position.y : origin.y;
            const pz = typeof yawObject !== 'undefined' ? yawObject.position.z : origin.z;
            const doorThick = 0.15;
            const trapThick = 0.08;
            for (let bx = Math.floor(px - maxDist); bx <= Math.ceil(px + maxDist); bx++) {
                for (let bz = Math.floor(pz - maxDist); bz <= Math.ceil(pz + maxDist); bz++) {
                    for (let by = Math.floor(py - 2); by <= Math.ceil(py + 4); by++) {
                        const b = blocks[bx + ',' + by + ',' + bz];
                        if (!b || (b.type !== 'wooden_door' && b.type !== 'wooden_trapdoor')) continue;
                        if (b.type === 'wooden_door') {
                            const pivotX = bx - 0.5, pivotZ = bz - 0.5;
                            const doorY0 = by - 0.5, doorY1 = by + 1.5;
                            if (b.open) {
                                box.min.set(pivotX, doorY0, pivotZ);
                                box.max.set(pivotX + doorThick, doorY1, pivotZ + 1);
                            } else {
                                box.min.set(pivotX, doorY0, pivotZ);
                                box.max.set(pivotX + 1, doorY1, pivotZ + doorThick);
                            }
                        } else {
                            const hingeZ = bz - 0.5;
                            if (b.open) {
                                box.min.set(bx - 0.5, by - 0.5, hingeZ);
                                box.max.set(bx + 0.5, by + 0.5, hingeZ + trapThick);
                            } else {
                                box.min.set(bx - 0.5, by - 0.5, bz - 0.5);
                                box.max.set(bx + 0.5, by - 0.5 + trapThick, bz + 0.5);
                            }
                        }
                        if (raycaster.ray.intersectBox(box, hitPoint)) {
                            const d = hitPoint.distanceTo(origin);
                            if (d <= maxDist && (!doorResult || d < doorResult.distance)) doorResult = { bx, by, bz, block: b, distance: d };
                        }
                    }
                }
            }
            if (doorResult && (!meshResult || doorResult.distance <= meshResult.distance)) return doorResult;
            return meshResult;
        };

        /** Retourne { x, y, z } pour un spawn : surface (grass/dirt/sand), jamais dans un bloc, jamais enfermé dans 3x3, pas sur arbre ni structure. */
        window.findSpawnNear = function(centerX, centerZ, radius, maxTries) {
            const solidGround = ['grass', 'dirt', 'sand'];
            const r = Math.max(3, radius || 6);
            const tries = maxTries || 80;
            for (let i = 0; i < tries; i++) {
                const x = Math.floor(centerX + (Math.random() * 2 - 1) * r);
                const z = Math.floor(centerZ + (Math.random() * 2 - 1) * r);
                const sy = getSurfaceHeight(x, z);
                const groundKey = x + ',' + sy + ',' + z;
                const ground = blocks[groundKey];
                if (!ground || solidGround.indexOf(ground.type) < 0) continue;
                let ok = true;
                for (let dx = -1; dx <= 1 && ok; dx++) {
                    for (let dz = -1; dz <= 1 && ok; dz++) {
                        if (blockSolidAt(x + dx, sy + 1, z + dz)) ok = false;
                        if (blockSolidAt(x + dx, sy + 2, z + dz)) ok = false;
                    }
                }
                if (ok) return { x: x + 0.5, y: sy + 1.5, z: z + 0.5 };
            }
            const sx = Math.floor(centerX), sz = Math.floor(centerZ);
            let sy = getSurfaceHeight(sx, sz);
            return { x: centerX + 0.5, y: sy + 1.5, z: centerZ + 0.5 };
        };

        window.getBiomeAt = function(x, z) {
            const seaLevel = -2;
            let h = getSurfaceHeight(x, z);
            if (h <= seaLevel) return 'ocean';
            let e = fbm(x, z, 3, 0.012);
            let m = fbm(x + 500, z + 500, 2, 0.02);
            let t = fbm(x + 300, z + 700, 2, 0.025);
            const mountInfluence = smoothstep(0.55, 0.68, e);
            const desertInfluence = smoothstep(0.42, 0.32, m) * (1 - mountInfluence);
            const taigaInfluence = smoothstep(0.55, 0.68, t) * smoothstep(0.35, 0.45, e);
            const jungleInfluence = smoothstep(0.68, 0.78, m);
            const birchForestScale = 0.6 + 0.4 * Math.max(0, Math.min(1, fbm(x * 0.0015, z * 0.0015 + 500, 2, 0.3)));
            const oakForestScale = 0.6 + 0.4 * Math.max(0, Math.min(1, fbm(x * 0.0015 + 300, z * 0.0015 + 800, 2, 0.3)));
            const birchInfluence = birchForestScale * smoothstep(0.52, 0.58, m) * smoothstep(0.48, 0.58, e);
            const mapleInfluence = smoothstep(0.45, 0.52, m) * smoothstep(0.5, 0.6, t);
            const darkForestInfluence = smoothstep(0.6, 0.72, m) * smoothstep(0.4, 0.5, e);
            const forestInfluence = oakForestScale * smoothstep(0.48, 0.58, m) * (1 - jungleInfluence - birchInfluence - mapleInfluence - darkForestInfluence);
            const arr = [{ n: 'mountains', v: mountInfluence }, { n: 'desert', v: desertInfluence }, { n: 'taiga', v: taigaInfluence }, { n: 'jungle', v: jungleInfluence }, { n: 'birch_forest', v: birchInfluence }, { n: 'maple_forest', v: mapleInfluence }, { n: 'dark_forest', v: darkForestInfluence }, { n: 'forest', v: forestInfluence }];
            let best = 'plains';
            let bestV = 0;
            arr.forEach(function(o) { if (o.v > bestV) { bestV = o.v; best = o.n; } });
            return bestV > 0.2 ? best : 'plains';
        };

        function smoothstep(a, b, x) {
            const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
            return t * t * (3 - 2 * t);
        }
        function getSmoothedHeight(x, z, kernelRadius) {
            let sum = 0, weightSum = 0;
            for (let jx = -kernelRadius; jx <= kernelRadius; jx++) {
                for (let jz = -kernelRadius; jz <= kernelRadius; jz++) {
                    const w = 1 / (1 + Math.abs(jx) + Math.abs(jz));
                    sum += w * getSurfaceHeight(x + jx, z + jz);
                    weightSum += w;
                }
            }
            return Math.floor(sum / weightSum);
        }
        function smoothVillageTerrain(centerX, centerZ, radius, pathMat, biome) {
            const subMat = (biome === 'desert') ? 'sand' : 'dirt';
            const smoothedHeights = {};
            const originalHeights = {};
            for (let ix = -radius; ix <= radius; ix++) {
                for (let iz = -radius; iz <= radius; iz++) {
                    const x = centerX + ix;
                    const z = centerZ + iz;
                    const k = x + ',' + z;
                    originalHeights[k] = getSurfaceHeight(x, z);
                    smoothedHeights[k] = getSmoothedHeight(x, z, 2);
                }
            }
            for (let ix = -radius; ix <= radius; ix++) {
                for (let iz = -radius; iz <= radius; iz++) {
                    const x = centerX + ix;
                    const z = centerZ + iz;
                    const k = x + ',' + z;
                    const targetY = smoothedHeights[k];
                    const origY = originalHeights[k];
                    for (let y = origY; y > targetY; y--) {
                        const key = `${x},${y},${z}`;
                        if (blocks[key]) {
                            delete blocks[key];
                            const ck = `${Math.floor(x/chunkSize)},${Math.floor(z/chunkSize)}`;
                            if (chunkBlocks[ck]) chunkBlocks[ck] = chunkBlocks[ck].filter(bk => bk !== key);
                        }
                    }
                    for (let y = targetY; y >= -15; y--) {
                        const type = (y === targetY) ? pathMat : (y >= targetY - 4 ? subMat : 'stone');
                        replaceBlockType(x, y, z, type);
                        if (!blocks[x + ',' + y + ',' + z]) addBlock(x, y, z, type);
                        else blocks[x + ',' + y + ',' + z].type = type;
                    }
                    if (targetY > origY) {
                        for (let y = origY + 1; y <= targetY; y++) {
                            const type = (y === targetY) ? pathMat : (y >= targetY - 4 ? subMat : 'stone');
                            addBlock(x, y, z, type);
                        }
                    }
                }
            }
            const chunkKeys = new Set();
            for (let ix = -radius; ix <= radius; ix++) {
                for (let iz = -radius; iz <= radius; iz++) {
                    chunkKeys.add(`${Math.floor((centerX + ix) / chunkSize)},${Math.floor((centerZ + iz) / chunkSize)}`);
                }
            }
            chunkKeys.forEach(function(ck) {
                const [cx, cz] = ck.split(',').map(Number);
                if (loadedChunks.has(ck)) buildChunkMesh(cx, cz);
            });
            return smoothedHeights;
        }

        function buildPathFlat(startX, startZ, endX, endZ, flatY, mat) {
            let dx = Math.abs(endX - startX);
            let dz = Math.abs(endZ - startZ);
            let sx = startX < endX ? 1 : -1;
            let sz = startZ < endZ ? 1 : -1;
            let err = dx - dz;
            let cx = startX, cz = startZ;
            while (true) {
                replaceBlockType(cx, flatY, cz, mat);
                replaceBlockType(cx + 1, flatY, cz, mat);
                replaceBlockType(cx, flatY, cz + 1, mat);
                if (cx === endX && cz === endZ) break;
                let e2 = 2 * err;
                if (e2 > -dz) { err -= dz; cx += sx; }
                if (e2 < dx) { err += dx; cz += sz; }
            }
        }
        function buildPathSmooth(startX, startZ, endX, endZ, heightsMap, mat) {
            let dx = Math.abs(endX - startX);
            let dz = Math.abs(endZ - startZ);
            let sx = startX < endX ? 1 : -1;
            let sz = startZ < endZ ? 1 : -1;
            let err = dx - dz;
            let cx = startX, cz = startZ;
            while (true) {
                const fy = heightsMap[cx + ',' + cz] !== undefined ? heightsMap[cx + ',' + cz] : getSurfaceHeight(cx, cz);
                replaceBlockType(cx, fy, cz, mat);
                const fy1 = heightsMap[(cx + 1) + ',' + cz] !== undefined ? heightsMap[(cx + 1) + ',' + cz] : getSurfaceHeight(cx + 1, cz);
                const fy2 = heightsMap[cx + ',' + (cz + 1)] !== undefined ? heightsMap[cx + ',' + (cz + 1)] : getSurfaceHeight(cx, cz + 1);
                replaceBlockType(cx + 1, fy1, cz, mat);
                replaceBlockType(cx, fy2, cz + 1, mat);
                if (cx === endX && cz === endZ) break;
                let e2 = 2 * err;
                if (e2 > -dz) { err -= dz; cx += sx; }
                if (e2 < dx) { err += dx; cz += sz; }
            }
        }

        function buildPath(startX, startZ, endX, endZ, mat) {
            let dx = Math.abs(endX - startX);
            let dz = Math.abs(endZ - startZ);
            let sx = startX < endX ? 1 : -1;
            let sz = startZ < endZ ? 1 : -1;
            let err = dx - dz;

            let cx = startX;
            let cz = startZ;

            while (true) {
                let cy = getSurfaceHeight(cx, cz);
                replaceBlockType(cx, cy, cz, mat);
                
                replaceBlockType(cx + 1, getSurfaceHeight(cx + 1, cz), cz, mat);
                replaceBlockType(cx, getSurfaceHeight(cx, cz + 1), cz + 1, mat);

                if (cx === endX && cz === endZ) break;
                let e2 = 2 * err;
                if (e2 > -dz) { err -= dz; cx += sx; }
                if (e2 < dx) { err += dx; cz += sz; }
            }
        }

        // --- Dynamique eau : désactivée par défaut (remplissage statique rivières/océans). Activer uniquement sur action joueur si besoin.
        window.waterPhysicsEnabled = false;
        let lastWaterSpreadTime = 0;
        window.tickWaterSpread = function(delta) {
            if (!window.waterPhysicsEnabled) return;
            if (typeof gameStarted === 'undefined' || !gameStarted || (typeof window.playerDead !== 'undefined' && window.playerDead)) return;
            lastWaterSpreadTime += delta || 0;
            if (lastWaterSpreadTime < 0.35) return;
            lastWaterSpreadTime = 0;
            const dirs = [[0, -1, 0], [-1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1]];
            const toRebuild = new Set();
            const waterKeys = Object.keys(blocks).filter(function(k) { const b = blocks[k]; return b && b.type === 'water' && (b.waterLevel || 8) > 1; });
            let done = 0;
            for (let i = 0; i < waterKeys.length && done < 25; i++) {
                const key = waterKeys[i];
                const b = blocks[key];
                const level = b.waterLevel || 8;
                const bx = b.x, by = b.y, bz = b.z;
                const originX = (b.originX !== undefined) ? b.originX : bx;
                const originZ = (b.originZ !== undefined) ? b.originZ : bz;
                for (let d = 0; d < dirs.length && done < 25; d++) {
                    const dx = dirs[d][0], dy = dirs[d][1], dz = dirs[d][2];
                    const nx = bx + dx, ny = by + dy, nz = bz + dz;
                    if (Math.abs(nx - originX) > 1 || Math.abs(nz - originZ) > 1) continue;
                    const belowKey = nx + ',' + (ny - 1) + ',' + nz;
                    if (!blocks[belowKey]) continue;
                    const nkey = nx + ',' + ny + ',' + nz;
                    const neighbor = blocks[nkey];
                    const newLevel = level - 1;
                    if (!neighbor) {
                        addBlock(nx, ny, nz, 'water', newLevel);
                        blocks[nkey].originX = originX;
                        blocks[nkey].originZ = originZ;
                        toRebuild.add(nx + ',' + nz);
                        done++;
                        break;
                    } else if (neighbor.type === 'water') {
                        const nl = neighbor.waterLevel || 8;
                        if (nl > newLevel) {
                            neighbor.waterLevel = newLevel;
                            if (neighbor.originX === undefined) { neighbor.originX = originX; neighbor.originZ = originZ; }
                            toRebuild.add(nx + ',' + nz);
                            done++;
                            break;
                        }
                    }
                }
            }
            toRebuild.forEach(function(coord) {
                const parts = coord.split(',');
                rebuildChunkAndBorders(parseInt(parts[0], 10), parseInt(parts[1], 10));
            });
        };