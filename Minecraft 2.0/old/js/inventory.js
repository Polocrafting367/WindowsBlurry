            const inventory = new Array(27).fill(null);
        window.playerInventory = inventory;
        let selectedHotbarIndex = 0;
        let itemHeldInCursor = null;
        window.getItemHeldInCursor = function() { return itemHeldInCursor; };
        window.setItemHeldInCursor = function(v) { itemHeldInCursor = v; }; 
        let selectedCreativeTab = 'Construction'; 

        const recipes = [
            { id: 'craft_planks', result: {type: 'planks', count: 4}, req: [{type: 'wood', count: 1}], name: 'Planches' },
            { id: 'craft_stick', result: {type: 'stick', count: 4}, req: [{type: 'planks', count: 2}], name: 'Bâtons' },
            { id: 'craft_table', result: {type: 'crafting_table', count: 1}, req: [{type: 'planks', count: 4}], name: 'Table de Craft' },
            { id: 'craft_chest', result: {type: 'chest', count: 1}, req: [{type: 'planks', count: 8}], name: 'Coffre' },
            { id: 'craft_torch', result: {type: 'torch', count: 4}, req: [{type: 'stick', count: 1}, {type: 'coal', count: 1}], name: 'Torche x4' },
            { id: 'craft_wood_pick', result: {type: 'wood_pickaxe', count: 1}, req: [{type: 'planks', count: 3}, {type: 'stick', count: 2}], name: 'Pioche en Bois' },
            { id: 'craft_iron_pick', result: {type: 'iron_pickaxe', count: 1}, req: [{type: 'iron_ingot', count: 3}, {type: 'stick', count: 2}], name: 'Pioche en Fer' },
            { id: 'craft_diamond_pick', result: {type: 'diamond_pickaxe', count: 1}, req: [{type: 'diamond', count: 3}, {type: 'stick', count: 2}], name: 'Pioche en Diamant' },
            { id: 'craft_wood_sword', result: {type: 'wood_sword', count: 1}, req: [{type: 'planks', count: 2}, {type: 'stick', count: 1}], name: 'Épée en Bois' },
            { id: 'craft_iron_sword', result: {type: 'iron_sword', count: 1}, req: [{type: 'iron_ingot', count: 2}, {type: 'stick', count: 1}], name: 'Épée en Fer' },
            { id: 'craft_diamond_sword', result: {type: 'diamond_sword', count: 1}, req: [{type: 'diamond', count: 2}, {type: 'stick', count: 1}], name: 'Épée en Diamant' },
            { id: 'craft_glass', result: {type: 'glass', count: 1}, req: [{type: 'sand', count: 2}], name: 'Vitre' }, 
            { id: 'craft_cobble', result: {type: 'cobblestone', count: 1}, req: [{type: 'stone', count: 1}], name: 'Pierre Taillée' },
            { id: 'craft_tnt', result: {type: 'tnt', count: 1}, req: [{type: 'gunpowder', count: 5}, {type: 'sand', count: 4}], name: 'TNT' },
            { id: 'craft_bed', result: {type: 'bed', count: 1}, req: [{type: 'wool', count: 3}, {type: 'planks', count: 3}], name: 'Lit' }
        ];

        /** Recettes 2x2 (inventaire) : pattern [row][col] pour 4 cases. */
        const recipesGrid2x2 = [
            { pattern: [['wood', null], [null, null]], result: { type: 'planks', count: 4 } },
            { pattern: [[null, 'planks'], [null, 'planks']], result: { type: 'stick', count: 4 } },
            { pattern: [['planks', 'planks'], ['planks', 'planks']], result: { type: 'crafting_table', count: 1 } },
            { pattern: [['coal', null], [null, 'stick']], result: { type: 'torch', count: 4 } },
            { pattern: [['sand', 'sand'], [null, null]], result: { type: 'glass', count: 1 } },
            { pattern: [['stone', null], [null, null]], result: { type: 'cobblestone', count: 1 } }
        ];

        /** Recettes en grille 3x3 (comme Minecraft) : pattern[y][x] = type ou null. */
        const recipesGrid = [
            { pattern: [['wood', null, null], [null, null, null], [null, null, null]], result: { type: 'planks', count: 4 } },
            { pattern: [[null, 'planks', null], [null, 'planks', null], [null, null, null]], result: { type: 'stick', count: 4 } },
            { pattern: [['planks', 'planks', null], ['planks', 'planks', null], [null, null, null]], result: { type: 'crafting_table', count: 1 } },
            { pattern: [['planks', 'planks', 'planks'], ['planks', null, 'planks'], ['planks', 'planks', 'planks']], result: { type: 'chest', count: 1 } },
            { pattern: [['coal', null, null], [null, 'stick', null], [null, null, null]], result: { type: 'torch', count: 4 } },
            { pattern: [['planks', 'planks', 'planks'], [null, 'stick', null], [null, 'stick', null]], result: { type: 'wood_pickaxe', count: 1 } },
            { pattern: [['iron_ingot', 'iron_ingot', 'iron_ingot'], [null, 'stick', null], [null, 'stick', null]], result: { type: 'iron_pickaxe', count: 1 } },
            { pattern: [['diamond', 'diamond', 'diamond'], [null, 'stick', null], [null, 'stick', null]], result: { type: 'diamond_pickaxe', count: 1 } },
            { pattern: [[null, 'planks', null], [null, 'planks', null], [null, 'stick', null]], result: { type: 'wood_sword', count: 1 } },
            { pattern: [[null, 'iron_ingot', null], [null, 'iron_ingot', null], [null, 'stick', null]], result: { type: 'iron_sword', count: 1 } },
            { pattern: [[null, 'diamond', null], [null, 'diamond', null], [null, 'stick', null]], result: { type: 'diamond_sword', count: 1 } },
            { pattern: [['sand', 'sand', null], [null, null, null], [null, null, null]], result: { type: 'glass', count: 1 } },
            { pattern: [['stone', null, null], [null, null, null], [null, null, null]], result: { type: 'cobblestone', count: 1 } },
            { pattern: [['gunpowder', 'sand', 'gunpowder'], ['sand', 'gunpowder', 'sand'], [null, null, null]], result: { type: 'tnt', count: 1 } },
            { pattern: [['wool', 'wool', 'wool'], ['planks', 'planks', 'planks'], [null, null, null]], result: { type: 'bed', count: 1 } },
            { pattern: [['planks', 'planks', 'planks'], [null, 'planks', null], [null, 'planks', null]], result: { type: 'boat', count: 1 } }
        ];

        function getCraftResult(grid9) {
            for (let r of recipesGrid) {
                let match = true;
                for (let i = 0; i < 9; i++) {
                    const row = Math.floor(i / 3), col = i % 3;
                    const want = r.pattern[row][col];
                    const have = grid9[i] ? grid9[i].type : null;
                    if ((want === null && have !== null) || (want !== null && (have !== want || (grid9[i] && grid9[i].count < 1)))) { match = false; break; }
                }
                if (match) return r.result;
            }
            return null;
        }

        function consumeCraftGrid(grid9, recipe) {
            for (let i = 0; i < 9; i++) {
                const row = Math.floor(i / 3), col = i % 3;
                if (recipe.pattern[row][col]) {
                    if (grid9[i]) { grid9[i].count--; if (grid9[i].count <= 0) grid9[i] = null; }
                }
            }
        }

        function getCraftResult2x2(grid4) {
            for (let r of recipesGrid2x2) {
                let match = true;
                for (let i = 0; i < 4; i++) {
                    const row = Math.floor(i / 2), col = i % 2;
                    const want = r.pattern[row][col];
                    const have = grid4[i] ? grid4[i].type : null;
                    if ((want === null && have !== null) || (want !== null && (have !== want || (grid4[i] && grid4[i].count < 1)))) { match = false; break; }
                }
                if (match) return r.result;
            }
            return null;
        }

        function consumeCraftGrid2x2(grid4, recipe) {
            for (let i = 0; i < 4; i++) {
                const row = Math.floor(i / 2), col = i % 2;
                if (recipe.pattern[row][col]) {
                    if (grid4[i]) { grid4[i].count--; if (grid4[i].count <= 0) grid4[i] = null; }
                }
            }
        }

        window.openChestAt = null;
        window.openCraftingScreen = false;
        window.craftGrid = new Array(9).fill(null);
        window.craftGrid2x2 = new Array(4).fill(null);

        function handleChestSlotClick(container, index) {
            const arr = container === 'chest' ? (blocks[window.openChestAt] && blocks[window.openChestAt].inventory) : inventory;
            if (!arr) return;
            if (!itemHeldInCursor && arr[index]) {
                itemHeldInCursor = arr[index]; arr[index] = null;
            } else if (itemHeldInCursor && !arr[index]) {
                arr[index] = itemHeldInCursor; itemHeldInCursor = null;
            } else if (itemHeldInCursor && arr[index]) {
                if (itemHeldInCursor.type === arr[index].type && arr[index].count < 64) {
                    const space = 64 - arr[index].count;
                    if (itemHeldInCursor.count <= space) { arr[index].count += itemHeldInCursor.count; itemHeldInCursor = null; }
                    else { arr[index].count = 64; itemHeldInCursor.count -= space; }
                } else {
                    const t = arr[index]; arr[index] = itemHeldInCursor; itemHeldInCursor = t;
                }
            }
            updateChestUI(); updateCursorItem();
        }

        window.updateChestUI = function() {
            const key = window.openChestAt;
            if (!key || !blocks[key] || !blocks[key].inventory) return;
            const chestInv = blocks[key].inventory;
            const chestGrid = document.getElementById('chest-inv-grid');
            const hotbarGrid = document.getElementById('chest-player-hotbar');
            const storageGrid = document.getElementById('chest-player-storage');
            if (!chestGrid || !hotbarGrid || !storageGrid) return;
            chestGrid.innerHTML = '';
            for (let i = 0; i < 27; i++) {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot';
                if (chestInv[i]) { slotDiv.style = getStyleForIcon(chestInv[i].type); slotDiv.innerHTML = '<div class="count">' + chestInv[i].count + '</div>'; }
                slotDiv.onclick = () => handleChestSlotClick('chest', i);
                chestGrid.appendChild(slotDiv);
            }
            hotbarGrid.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot';
                if (inventory[i]) { slotDiv.style = getStyleForIcon(inventory[i].type); slotDiv.innerHTML = '<div class="count">' + inventory[i].count + '</div>'; }
                slotDiv.onclick = () => handleChestSlotClick('player', i);
                hotbarGrid.appendChild(slotDiv);
            }
            storageGrid.innerHTML = '';
            for (let i = 9; i < 27; i++) {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot';
                if (inventory[i]) { slotDiv.style = getStyleForIcon(inventory[i].type); slotDiv.innerHTML = '<div class="count">' + inventory[i].count + '</div>'; }
                slotDiv.onclick = () => handleChestSlotClick('player', i);
                storageGrid.appendChild(slotDiv);
            }
            updateCursorItem();
        };

        window.updateCraftingUI = function() {
            const craftScreenRecipesCol = document.getElementById('craft-screen-recipes-column');
            if (craftScreenRecipesCol) craftScreenRecipesCol.style.display = (typeof window.gameMode !== 'undefined' && window.gameMode === 'creative') ? 'none' : 'block';
            const grid9 = window.craftGrid || [];
            const gridEl = document.getElementById('craft-grid-3x3');
            const resultEl = document.getElementById('craft-result-slot');
            const hotbarGrid = document.getElementById('craft-player-hotbar');
            const storageGrid = document.getElementById('craft-player-storage');
            if (!gridEl || !resultEl) return;
            gridEl.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot';
                if (grid9[i]) { slotDiv.style = getStyleForIcon(grid9[i].type); slotDiv.innerHTML = '<div class="count">' + grid9[i].count + '</div>'; }
                (function(idx) {
                    slotDiv.onclick = function() {
                        if (itemHeldInCursor && !grid9[idx]) { grid9[idx] = { type: itemHeldInCursor.type, count: 1 }; itemHeldInCursor.count--; if (itemHeldInCursor.count <= 0) itemHeldInCursor = null; }
                        else if (!itemHeldInCursor && grid9[idx]) { itemHeldInCursor = grid9[idx]; grid9[idx] = null; }
                        else if (itemHeldInCursor && grid9[idx] && itemHeldInCursor.type === grid9[idx].type && grid9[idx].count < 64) { grid9[idx].count++; itemHeldInCursor.count--; if (itemHeldInCursor.count <= 0) itemHeldInCursor = null; }
                        else if (itemHeldInCursor && grid9[idx]) { const t = grid9[idx]; grid9[idx] = itemHeldInCursor; itemHeldInCursor = t; }
                        updateCraftingUI(); updateCursorItem();
                    };
                })(i);
                gridEl.appendChild(slotDiv);
            }
            const result = getCraftResult(grid9);
            resultEl.innerHTML = '';
            resultEl.style = '';
            resultEl.onclick = null;
            if (result) {
                resultEl.style = getStyleForIcon(result.type);
                resultEl.innerHTML = '<div class="count">' + result.count + '</div>';
                resultEl.onclick = function() {
                    if (itemHeldInCursor && itemHeldInCursor.type !== result.type) return;
                    const r = getCraftResult(grid9);
                    if (!r) return;
                    for (let rec of recipesGrid) {
                        let match = true;
                        for (let i = 0; i < 9; i++) {
                            const row = Math.floor(i / 3), col = i % 3;
                            const want = rec.pattern[row][col];
                            const have = grid9[i] ? grid9[i].type : null;
                            if ((want === null && have !== null) || (want !== null && have !== want)) { match = false; break; }
                        }
                        if (match && rec.result.type === r.type) {
                            consumeCraftGrid(grid9, rec);
                            if (itemHeldInCursor && itemHeldInCursor.type === r.type) itemHeldInCursor.count += r.count;
                            else itemHeldInCursor = { type: r.type, count: r.count };
                            updateCraftingUI(); updateCursorItem();
                            break;
                        }
                    }
                };
            }
            if (hotbarGrid && storageGrid) {
                hotbarGrid.innerHTML = '';
                for (let i = 0; i < 9; i++) {
                    const slotDiv = document.createElement('div');
                    slotDiv.className = 'slot';
                    if (inventory[i]) { slotDiv.style = getStyleForIcon(inventory[i].type); slotDiv.innerHTML = '<div class="count">' + inventory[i].count + '</div>'; }
                    (function(idx) { slotDiv.onclick = () => { handlePlayerSlotClick(idx); updateCraftingUI(); }; })(i);
                    hotbarGrid.appendChild(slotDiv);
                }
                storageGrid.innerHTML = '';
                for (let i = 9; i < 27; i++) {
                    const slotDiv = document.createElement('div');
                    slotDiv.className = 'slot';
                    if (inventory[i]) { slotDiv.style = getStyleForIcon(inventory[i].type); slotDiv.innerHTML = '<div class="count">' + inventory[i].count + '</div>'; }
                    (function(idx) { slotDiv.onclick = () => { handlePlayerSlotClick(idx); updateCraftingUI(); }; })(i);
                    storageGrid.appendChild(slotDiv);
                }
            }
            const craftTablePanel = document.getElementById('craft-table-recipe-panel');
            if (craftTablePanel && (typeof window.gameMode === 'undefined' || window.gameMode !== 'creative')) {
                craftTablePanel.innerHTML = '';
                const getTile = typeof window.getTileCoords === 'function' ? window.getTileCoords : null;
                const atlasUrl = typeof window.atlasDataUrl === 'string' ? window.atlasDataUrl : '';
                recipes.forEach(function(r) {
                    let canCraft = true;
                    let reqText = r.req.map(function(req) {
                        let has = countItem(req.type);
                        if (has < req.count) canCraft = false;
                        return req.count + ' ' + (typeof window.BLOCK_DISPLAY_NAMES !== 'undefined' && window.BLOCK_DISPLAY_NAMES[req.type] ? window.BLOCK_DISPLAY_NAMES[req.type] : req.type);
                    }).join(', ');
                    const rec3 = recipesGrid.find(function(rec) { return rec.result.type === r.result.type && rec.result.count === r.result.count; });
                    let div = document.createElement('div');
                    div.className = 'recipe ' + (canCraft ? '' : 'disabled');
                    const tile = getTile ? getTile(r.result.type, 0) : [0, 0];
                    const tx = tile[0] != null ? tile[0] : 0, ty = tile[1] != null ? tile[1] : 0;
                    const iconStyle = atlasUrl ? 'background-image:url(' + atlasUrl + '); background-size:120px 480px; background-position:' + (-tx * 30) + 'px ' + (-ty * 30) + 'px; image-rendering:pixelated;' : 'background:#642;';
                    div.innerHTML = '<div style="display:flex; align-items:center; gap:10px;"><div class="slot" style="width:30px; height:30px; ' + iconStyle + '"></div><div><div style="font-weight:bold; color:#f0e6d2;">' + r.name + ' x' + r.result.count + '</div><div style="font-size:11px; color:#c4a574;">' + reqText + '</div></div></div>';
                    if (canCraft && rec3) {
                        div.onclick = function() {
                            const req = {};
                            for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
                                const t = rec3.pattern[row][col];
                                if (t) req[t] = (req[t] || 0) + 1;
                            }
                            let ok = true;
                            for (const t in req) { if (countItem(t) < req[t]) { ok = false; break; } }
                            if (!ok) return;
                            const g = window.craftGrid || [];
                            for (let i = 0; i < 9; i++) { if (g[i]) { addToInventory(g[i].type, g[i].count); g[i] = null; } }
                            for (let i = 0; i < 9; i++) {
                                const row = Math.floor(i / 3), col = i % 3;
                                const t = rec3.pattern[row][col];
                                if (t && removeFromInventory(t, 1)) g[i] = { type: t, count: 1 };
                            }
                            updateCraftingUI();
                            updateCursorItem();
                        };
                    }
                    craftTablePanel.appendChild(div);
                });
            }
            updateCursorItem();
        };





        function addToInventory(type, amount) {
            for(let i = 0; i < inventory.length; i++) { 
                if (inventory[i] && inventory[i].type === type && inventory[i].count < 64) { 
                    let space = 64 - inventory[i].count; 
                    if (amount <= space) { 
                        inventory[i].count += amount; 
                        updateInventoryUI(); 
                        return; 
                    } else { 
                        inventory[i].count = 64; 
                        amount -= space; 
                    } 
                } 
            }
            for(let i = 0; i < inventory.length; i++) { 
                if (!inventory[i]) { 
                    inventory[i] = { type: type, count: amount }; 
                    updateInventoryUI(); 
                    return; 
                } 
            }
        }
                function removeFromInventory(type, amount) {
            let remain = amount;
            for(let i = 0; i < inventory.length; i++) {
                if (inventory[i] && inventory[i].type === type) {
                    if (inventory[i].count >= remain) { 
                        inventory[i].count -= remain; 
                        if (inventory[i].count === 0) inventory[i] = null; 
                        updateInventoryUI(); 
                        return true; 
                    } else { 
                        remain -= inventory[i].count; 
                        inventory[i] = null; 
                    }
                }
            } 
            return false;
        }


        function countItem(type) { 
            return inventory.reduce((sum, item) => item && item.type === type ? sum + item.count : sum, 0); 
        }

        function craftItem(recipe) {
            for(let req of recipe.req) { 
                if (countItem(req.type) < req.count) return; 
            }
            for(let req of recipe.req) { 
                removeFromInventory(req.type, req.count); 
            }
            addToInventory(recipe.result.type, recipe.result.count);
        }
        function handlePlayerSlotClick(index) {
            if (!itemHeldInCursor && inventory[index]) {
                itemHeldInCursor = inventory[index]; 
                inventory[index] = null;
            } else if (itemHeldInCursor && !inventory[index]) {
                inventory[index] = itemHeldInCursor; 
                itemHeldInCursor = null;
            } else if (itemHeldInCursor && inventory[index]) {
                if (itemHeldInCursor.type === inventory[index].type && inventory[index].count < 64) {
                    let space = 64 - inventory[index].count;
                    if (itemHeldInCursor.count <= space) { 
                        inventory[index].count += itemHeldInCursor.count; 
                        itemHeldInCursor = null; 
                    } else { 
                        inventory[index].count = 64; 
                        itemHeldInCursor.count -= space; 
                    }
                } else { 
                    let temp = inventory[index]; 
                    inventory[index] = itemHeldInCursor; 
                    itemHeldInCursor = temp; 
                }
            }
            updateCursorItem();
        }
        function handleSlotClick(index) {
            if (!inventoryOpen) return;
            handlePlayerSlotClick(index);
            updateInventoryUI();
        }
                function getItemTooltip(item) {
            if (!item) return '';
            const names = typeof window.BLOCK_DISPLAY_NAMES !== 'undefined' ? window.BLOCK_DISPLAY_NAMES : {};
            const dura = typeof window.TOOL_DURABILITY !== 'undefined' ? window.TOOL_DURABILITY : {};
            let s = names[item.type] || item.type;
            if (dura[item.type] !== undefined && item.durability !== undefined)
                s += '\nDurabilité: ' + (item.durability === undefined ? dura[item.type] : item.durability) + ' / ' + dura[item.type];
            else if (dura[item.type] !== undefined)
                s += '\nDurabilité: ' + dura[item.type];
            return s;
        }
                function updateInventoryUI() {
            for(let i = 0; i < 9; i++) {
                const hb = document.getElementById(`hb-${i}`); 
                hb.innerHTML = ''; 
                hb.style = '';
                if (inventory[i]) { 
                    hb.style = getStyleForIcon(inventory[i].type); 
                    hb.innerHTML = `<div class="count">${inventory[i].count}</div>`; 
                }
                if (i === selectedHotbarIndex) {
                    hb.classList.add('active'); 
                } else {
                    hb.classList.remove('active');
                }
                hb.onclick = () => handleSlotClick(i);
                hb.title = inventory[i] ? getItemTooltip(inventory[i]) : '';
                hb.onmouseenter = function(e) {
                    if (!inventory[i]) return;
                    const tt = document.getElementById('inv-tooltip');
                    if (tt) { tt.textContent = getItemTooltip(inventory[i]); tt.style.display = 'block'; tt.style.left = (e.clientX + 12) + 'px'; tt.style.top = (e.clientY + 8) + 'px'; }
                };
                hb.onmouseleave = function() {
                    const tt = document.getElementById('inv-tooltip');
                    if (tt) tt.style.display = 'none';
                };
            }
            
            const invTitle = document.getElementById('inv-title');
            if (invTitle) invTitle.textContent = (typeof window.gameMode !== 'undefined' && window.gameMode === 'creative') ? 'Inventaire créatif' : 'Sac à dos';
            const creativePicker = document.getElementById('creative-picker');
            const invSurvivalLabel = document.getElementById('inv-survival-label');
            const invHotbarEl = document.getElementById('inv-hotbar');
            const invStorageEl = document.getElementById('inv-storage');
            const creativeTabsEl = document.getElementById('creative-tabs');
            const creativeGridEl = document.getElementById('creative-grid');
            const names = typeof window.BLOCK_DISPLAY_NAMES !== 'undefined' ? window.BLOCK_DISPLAY_NAMES : {};
            const categories = typeof window.CREATIVE_CATEGORIES !== 'undefined' ? window.CREATIVE_CATEGORIES : {};
            const tabOrder = typeof window.CREATIVE_TAB_ORDER !== 'undefined' ? window.CREATIVE_TAB_ORDER : Object.keys(categories);

            if (typeof window.gameMode !== 'undefined' && window.gameMode === 'creative') {
                if (creativePicker) creativePicker.style.display = 'block';
                if (invSurvivalLabel) invSurvivalLabel.style.display = 'block';
                if (creativeTabsEl) {
                    creativeTabsEl.innerHTML = '';
                    tabOrder.forEach(function(catName) {
                        if (!categories[catName]) return;
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'mc-btn small' + (selectedCreativeTab === catName ? ' active-tab' : '');
                        btn.textContent = catName;
                        if (selectedCreativeTab === catName) btn.style.background = 'linear-gradient(180deg, #3d7a3d 0%, #2d5a2d 100%)';
                        btn.onclick = function() { selectedCreativeTab = catName; updateInventoryUI(); };
                        creativeTabsEl.appendChild(btn);
                    });
                }
                if (creativeGridEl && categories[selectedCreativeTab]) {
                    creativeGridEl.innerHTML = '';
                    categories[selectedCreativeTab].forEach(function(type) {
                        const slotDiv = document.createElement('div');
                        slotDiv.className = 'slot';
                        slotDiv.style = getStyleForIcon(type);
                        slotDiv.innerHTML = '<div class="count">64</div>';
                        slotDiv.title = names[type] || type;
                        slotDiv.onclick = function() {
                            if (itemHeldInCursor && itemHeldInCursor.type === type && itemHeldInCursor.count < 64) {
                                itemHeldInCursor.count = Math.min(64, itemHeldInCursor.count + 64);
                            } else if (!itemHeldInCursor || itemHeldInCursor.type !== type) {
                                itemHeldInCursor = { type: type, count: 64 };
                            }
                            updateCursorItem();
                        };
                        slotDiv.onmouseenter = function(e) {
                            const tt = document.getElementById('inv-tooltip');
                            if (tt) { tt.textContent = names[type] || type; tt.style.display = 'block'; tt.style.left = (e.clientX + 12) + 'px'; tt.style.top = (e.clientY + 8) + 'px'; }
                        };
                        slotDiv.onmouseleave = function() {
                            const tt = document.getElementById('inv-tooltip');
                            if (tt) tt.style.display = 'none';
                        };
                        creativeGridEl.appendChild(slotDiv);
                    });
                }
            } else {
                if (creativePicker) creativePicker.style.display = 'none';
                if (invSurvivalLabel) invSurvivalLabel.style.display = 'none';
            }

            const invCraft2x2Section = document.getElementById('inv-craft-2x2-section');
            if (invCraft2x2Section) invCraft2x2Section.style.display = (typeof window.gameMode !== 'undefined' && window.gameMode === 'creative') ? 'none' : 'flex';
            const invCraftColumn = document.getElementById('inv-craft-column');
            if (invCraftColumn) invCraftColumn.style.display = (typeof window.gameMode !== 'undefined' && window.gameMode === 'creative') ? 'none' : 'block';
            const craftingPanel = document.getElementById('crafting-panel');
            if (craftingPanel) craftingPanel.style.display = (typeof window.gameMode !== 'undefined' && window.gameMode === 'creative') ? 'none' : 'flex';
            const craftScreenRecipesCol = document.getElementById('craft-screen-recipes-column');
            if (craftScreenRecipesCol) craftScreenRecipesCol.style.display = (typeof window.gameMode !== 'undefined' && window.gameMode === 'creative') ? 'none' : 'block';

            const grid2x2 = document.getElementById('inv-craft-grid-2x2');
            const resultSlot2x2 = document.getElementById('inv-craft-result-slot');
            const craft2x2 = window.craftGrid2x2 || [];
            if (grid2x2 && resultSlot2x2 && (typeof window.gameMode === 'undefined' || window.gameMode !== 'creative')) {
                grid2x2.innerHTML = '';
                for (let i = 0; i < 4; i++) {
                    const slotDiv = document.createElement('div');
                    slotDiv.className = 'slot';
                    if (craft2x2[i]) { slotDiv.style = getStyleForIcon(craft2x2[i].type); slotDiv.innerHTML = '<div class="count">' + craft2x2[i].count + '</div>'; }
                    (function(idx) {
                        slotDiv.onclick = function() {
                            if (itemHeldInCursor && !craft2x2[idx]) { craft2x2[idx] = { type: itemHeldInCursor.type, count: 1 }; itemHeldInCursor.count--; if (itemHeldInCursor.count <= 0) itemHeldInCursor = null; }
                            else if (!itemHeldInCursor && craft2x2[idx]) { itemHeldInCursor = craft2x2[idx]; craft2x2[idx] = null; }
                            else if (itemHeldInCursor && craft2x2[idx] && itemHeldInCursor.type === craft2x2[idx].type && craft2x2[idx].count < 64) { craft2x2[idx].count++; itemHeldInCursor.count--; if (itemHeldInCursor.count <= 0) itemHeldInCursor = null; }
                            else if (itemHeldInCursor && craft2x2[idx]) { const t = craft2x2[idx]; craft2x2[idx] = itemHeldInCursor; itemHeldInCursor = t; }
                            updateInventoryUI(); updateCursorItem();
                        };
                    })(i);
                    grid2x2.appendChild(slotDiv);
                }
                const result = getCraftResult2x2(craft2x2);
                resultSlot2x2.innerHTML = '';
                resultSlot2x2.style = '';
                resultSlot2x2.onclick = null;
                if (result) {
                    resultSlot2x2.style = getStyleForIcon(result.type);
                    resultSlot2x2.innerHTML = '<div class="count">' + result.count + '</div>';
                    resultSlot2x2.onclick = function() {
                        if (itemHeldInCursor && itemHeldInCursor.type !== result.type) return;
                        const r = getCraftResult2x2(craft2x2);
                        if (!r) return;
                        for (let rec of recipesGrid2x2) {
                            let match = true;
                            for (let i = 0; i < 4; i++) {
                                const row = Math.floor(i / 2), col = i % 2;
                                const want = rec.pattern[row][col];
                                const have = craft2x2[i] ? craft2x2[i].type : null;
                                if ((want === null && have !== null) || (want !== null && have !== want)) { match = false; break; }
                            }
                            if (match && rec.result.type === r.type) {
                                consumeCraftGrid2x2(craft2x2, rec);
                                if (itemHeldInCursor && itemHeldInCursor.type === r.type) itemHeldInCursor.count += r.count;
                                else itemHeldInCursor = { type: r.type, count: r.count };
                                updateInventoryUI(); updateCursorItem();
                                break;
                            }
                        }
                    };
                }
            }

            function buildInvSlot(i) {
                    let slotDiv = document.createElement('div'); 
                    slotDiv.className = 'slot';
                    if (inventory[i]) { 
                        slotDiv.style = getStyleForIcon(inventory[i].type); 
                        slotDiv.innerHTML = `<div class="count">${inventory[i].count}</div>`; 
                    }
                slotDiv.title = inventory[i] ? getItemTooltip(inventory[i]) : '';
                slotDiv.onclick = () => { handleSlotClick(i); };
                (function(slotIndex) {
                    slotDiv.onmouseenter = function(e) {
                        const item = inventory[slotIndex];
                        const tt = document.getElementById('inv-tooltip');
                        if (tt && item) { tt.textContent = getItemTooltip(item); tt.style.display = 'block'; tt.style.left = (e.clientX + 12) + 'px'; tt.style.top = (e.clientY + 8) + 'px'; }
                    };
                    slotDiv.onmouseleave = function() {
                        const tt = document.getElementById('inv-tooltip');
                        if (tt) tt.style.display = 'none';
                    };
                })(i);
                slotDiv.setAttribute('data-slot', i);
                return slotDiv;
            }
            if (invHotbarEl) {
                invHotbarEl.innerHTML = '';
                for (let i = 0; i < 9; i++) invHotbarEl.appendChild(buildInvSlot(i));
            }
            if (invStorageEl) {
                invStorageEl.innerHTML = '';
                for (let i = 9; i < 27; i++) invStorageEl.appendChild(buildInvSlot(i));
            }
            
            const panel = document.getElementById('crafting-panel');
            if (panel && (typeof window.gameMode === 'undefined' || window.gameMode !== 'creative')) {
                panel.innerHTML = '';
                const getTile = typeof window.getTileCoords === 'function' ? window.getTileCoords : null;
                const atlasUrl = typeof window.atlasDataUrl === 'string' ? window.atlasDataUrl : '';
                recipes.forEach(r => {
                    let canCraft = true; 
                    let reqText = r.req.map(req => { 
                        let has = countItem(req.type); 
                        if(has < req.count) canCraft = false; 
                        const name = typeof window.BLOCK_DISPLAY_NAMES !== 'undefined' && window.BLOCK_DISPLAY_NAMES[req.type] ? window.BLOCK_DISPLAY_NAMES[req.type] : req.type;
                        return req.count + ' ' + name;
                    }).join(', ');
                    const recipe2x2 = recipesGrid2x2.find(rec => rec.result.type === r.result.type && rec.result.count === r.result.count);
                    const tile = getTile ? getTile(r.result.type, 0) : [0, 0];
                    const tx = tile[0] != null ? tile[0] : 0, ty = tile[1] != null ? tile[1] : 0;
                    const iconStyle = atlasUrl ? 'background-image:url(' + atlasUrl + '); background-size:120px 480px; background-position:' + (-tx * 30) + 'px ' + (-ty * 30) + 'px; image-rendering:pixelated;' : 'background:#642;';
                    let div = document.createElement('div'); 
                    div.className = `recipe ${canCraft ? '' : 'disabled'}`;
                    div.innerHTML = '<div style="display:flex; align-items:center; gap:10px;"><div class="slot" style="width:30px; height:30px; ' + iconStyle + '"></div><div><div style="font-weight:bold;">' + r.name + ' x' + r.result.count + '</div><div style="font-size:12px; color:#555;">Requis: ' + reqText + '</div></div></div>';
                    if (canCraft) {
                        if (recipe2x2) {
                            div.onclick = function() {
                                const req = {};
                                for (let row = 0; row < 2; row++) for (let col = 0; col < 2; col++) {
                                    const t = recipe2x2.pattern[row][col];
                                    if (t) req[t] = (req[t] || 0) + 1;
                                }
                                let ok = true;
                                for (const t of Object.keys(req)) { if (countItem(t) < req[t]) { ok = false; break; } }
                                if (!ok) return;
                                const g = window.craftGrid2x2 || [];
                                for (let i = 0; i < 4; i++) {
                                    if (g[i]) { addToInventory(g[i].type, g[i].count); g[i] = null; }
                                }
                                for (let i = 0; i < 4; i++) {
                                    const row = Math.floor(i / 2), col = i % 2;
                                    const t = recipe2x2.pattern[row][col];
                                    if (t && removeFromInventory(t, 1)) g[i] = { type: t, count: 1 };
                                }
                                updateInventoryUI(); updateCursorItem();
                            };
                        } else {
                            div.onclick = () => craftItem(r);
                        }
                    }
                    panel.appendChild(div);
                });
            }
        }
                function updateCursorItem() {
            if (itemHeldInCursor) { 
                cursorIcon.style.display = 'block'; 
                cursorIcon.style.cssText += getStyleForIcon(itemHeldInCursor.type); 
                cursorCount.innerText = itemHeldInCursor.count; 
            } else { 
                cursorIcon.style.display = 'none'; 
            }
        }
