// ==========================================
// SAUVEGARDE MULTI-MONDES (IndexedDB + repli localStorage)
// ==========================================
const SAVE_PREFIX = 'minicraft_world_';
const WORLD_LIST_KEY = 'minicraft_world_list';
const SAVE_VERSION = 5;
const CHUNK_SIZE = typeof chunkSize !== 'undefined' ? chunkSize : 16;
const IDB_NAME = 'PolocraftSaves';
const IDB_VERSION = 1;
const IDB_STORE = 'worlds';

window.currentWorldName = null;
window.stringToSeed = function(s) {
    if (!s) return 0;
    var h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
    return Math.abs(h);
};

function getChunkKeyFromBlockKey(blockKey) {
    const [bx, , bz] = blockKey.split(',').map(Number);
    const cx = Math.floor(bx / CHUNK_SIZE);
    const cz = Math.floor(bz / CHUNK_SIZE);
    return cx + '_' + cz;
}

// --- IndexedDB ---
let _idb = null;
let _idbFailed = false; // true si ouverture impossible -> fallback localStorage
function openIDB() {
    if (_idb) return Promise.resolve(_idb);
    if (_idbFailed || typeof indexedDB === 'undefined' || !indexedDB.open) return Promise.resolve(null);
    return new Promise(function(resolve) {
        const timeout = setTimeout(function() {
            _idbFailed = true;
            resolve(null);
        }, 5000);
        const r = indexedDB.open(IDB_NAME, IDB_VERSION);
        r.onerror = function() { _idbFailed = true; clearTimeout(timeout); resolve(null); };
        r.onsuccess = function() { clearTimeout(timeout); _idb = r.result; resolve(_idb); };
        r.onblocked = function() { clearTimeout(timeout); _idbFailed = true; resolve(null); };
        r.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
        };
    });
}

function idbGet(key) {
    return openIDB().then(function(db) {
        if (!db) return undefined;
        return new Promise(function(resolve) {
            const t = db.transaction(IDB_STORE, 'readonly');
            const s = t.objectStore(IDB_STORE);
            const r = s.get(key);
            r.onsuccess = function() { resolve(r.result); };
            r.onerror = function() { resolve(undefined); };
        });
    });
}

function idbSet(key, value) {
    return openIDB().then(function(db) {
        if (!db) return Promise.reject(new Error('IndexedDB non disponible'));
        return new Promise(function(resolve, reject) {
            const t = db.transaction(IDB_STORE, 'readwrite');
            const s = t.objectStore(IDB_STORE);
            s.put(value, key);
            t.oncomplete = function() { resolve(); };
            t.onerror = function() { reject(t.error); };
        });
    });
}

function idbDelete(key) {
    return openIDB().then(function(db) {
        if (!db) return Promise.resolve();
        return new Promise(function(resolve) {
            const t = db.transaction(IDB_STORE, 'readwrite');
            t.objectStore(IDB_STORE).delete(key);
            t.oncomplete = resolve;
            t.onerror = resolve;
        });
    });
}

function idbKeys(prefix) {
    return openIDB().then(function(db) {
        if (!db) return [];
        return new Promise(function(resolve) {
            const t = db.transaction(IDB_STORE, 'readonly');
            const r = t.objectStore(IDB_STORE).getAllKeys();
            r.onsuccess = function() {
                const keys = r.result || [];
                if (!prefix) resolve(keys);
                else resolve(keys.filter(function(k) { return String(k).indexOf(prefix) === 0; }));
            };
            r.onerror = function() { resolve([]); };
        });
    });
}

// Ne pas appeler getWorldListAsync ici (évite récursion infinie). Lit localStorage et écrit dans IDB.
function migrateLocalStorageToIDB() {
    try {
        const raw = localStorage.getItem(WORLD_LIST_KEY);
        const list = raw ? JSON.parse(raw) : [];
        if (list.length === 0) return Promise.resolve([]);
        const prefix = SAVE_PREFIX;
        return Promise.all(list.map(function(name) {
            const metaRaw = localStorage.getItem(prefix + name + '_meta');
            if (!metaRaw) return Promise.resolve();
            const meta = JSON.parse(metaRaw);
            const chunkKeys = meta.chunkKeys || [];
            return idbSet('meta_' + name, meta).then(function() {
                return Promise.all(chunkKeys.map(function(ck) {
                    const chunkRaw = localStorage.getItem(prefix + name + '_chunk_' + ck);
                    if (!chunkRaw) return Promise.resolve();
                    const data = JSON.parse(chunkRaw);
                    return idbSet('chunk_' + name + '_' + ck, data);
                }));
            }).then(function() {
                try { localStorage.removeItem(prefix + name + '_meta'); chunkKeys.forEach(function(ck) { localStorage.removeItem(prefix + name + '_chunk_' + ck); }); } catch (_) {}
            });
        })).then(function() {
            return idbSet('world_list', list);
        }).then(function() {
            try { localStorage.removeItem(WORLD_LIST_KEY); } catch (_) {}
            if (typeof console !== 'undefined' && console.log) console.log('Sauvegardes migrées vers IndexedDB.');
            return list;
        });
    } catch (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('Migration localStorage->IDB:', e);
        return Promise.resolve([]);
    }
}

// --- Utilisation IndexedDB ou localStorage ---
function useIndexedDB() {
    return typeof indexedDB !== 'undefined' && indexedDB.open && !_idbFailed;
}

// Liste des mondes : sync pour compat, async pour IDB
function getWorldList() {
    if (!useIndexedDB()) {
        try {
            const raw = localStorage.getItem(WORLD_LIST_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }
    return null;
}

function getWorldListAsync() {
    if (!useIndexedDB()) return Promise.resolve(getWorldList());
    return idbGet('world_list').then(function(arr) {
        const list = Array.isArray(arr) ? arr : [];
        if (list.length > 0) return list;
        return migrateLocalStorageToIDB().then(function(migrated) {
            return Array.isArray(migrated) && migrated.length > 0 ? migrated : idbGet('world_list').then(function(a) { return Array.isArray(a) ? a : []; });
        });
    });
}

function setWorldList(list) {
    if (!useIndexedDB()) {
        try { localStorage.setItem(WORLD_LIST_KEY, JSON.stringify(list)); } catch (e) {}
        return Promise.resolve();
    }
    return idbSet('world_list', list);
}

function saveWorldToStorage(worldName) {
    const name = worldName || window.currentWorldName;
    if (!name) return Promise.resolve(false);
    const chunkToBlocks = {};
    for (const key in blocks) {
        if (!blocks[key] || !blocks[key].type) continue;
        const ck = getChunkKeyFromBlockKey(key);
        if (!chunkToBlocks[ck]) chunkToBlocks[ck] = {};
        chunkToBlocks[ck][key] = blocks[key].type;
    }
    const chunkKeys = Object.keys(chunkToBlocks);
    const meta = {
        version: SAVE_VERSION,
        name: name,
        lastSave: Date.now(),
        chunkKeys: chunkKeys,
        player: { x: yawObject.position.x, y: yawObject.position.y, z: yawObject.position.z },
        inventory: (typeof window.playerInventory !== 'undefined' && window.playerInventory ? window.playerInventory : (typeof inventory !== 'undefined' ? inventory : [])).map(slot => slot ? { type: slot.type, count: slot.count } : null),
        gameMode: (typeof window !== 'undefined' && window.gameMode) ? window.gameMode : 'survival',
        playerHp: typeof playerHp !== 'undefined' ? playerHp : 10,
        playerHunger: typeof playerHunger !== 'undefined' ? playerHunger : 10,
        selectedHotbarIndex: typeof selectedHotbarIndex !== 'undefined' ? selectedHotbarIndex : 0,
        gameTime: typeof window.gameTime === 'number' ? window.gameTime : 0
    };

    if (!useIndexedDB()) {
        try {
            localStorage.setItem(SAVE_PREFIX + name + '_meta', JSON.stringify(meta));
            for (let i = 0; i < chunkKeys.length; i++) {
                const ck = chunkKeys[i];
                const payload = JSON.stringify(chunkToBlocks[ck]);
                if (payload.length < 0.8 * 1024 * 1024) localStorage.setItem(SAVE_PREFIX + name + '_chunk_' + ck, payload);
            }
            const list = getWorldList();
            if (!list.includes(name)) { list.push(name); setWorldList(list); }
            return Promise.resolve(true);
        } catch (e) {
            if (typeof console !== 'undefined' && console.warn) console.warn('Erreur sauvegarde:', e);
            return Promise.resolve(false);
        }
    }

    return idbSet('meta_' + name, meta)
        .then(function() {
            const promises = chunkKeys.map(function(ck) { return idbSet('chunk_' + name + '_' + ck, chunkToBlocks[ck]); });
            return Promise.all(promises);
        })
        .then(function() {
            return getWorldListAsync().then(function(list) {
                if (!list.includes(name)) { list.push(name); return setWorldList(list); }
            });
        })
        .then(function() { return true; })
        .catch(function(e) {
            if (typeof console !== 'undefined' && console.warn) console.warn('Erreur sauvegarde IndexedDB:', e);
            return false;
        });
}

function loadWorldFromStorage(worldName) {
    const name = worldName || window.currentWorldName;
    if (!name) return Promise.resolve(false);

    function applyData(data) {
        if (!data || !data.player) return false;
        window.currentWorldName = name;
        window.worldSeed = (typeof window.stringToSeed === 'function') ? window.stringToSeed(name) : 0;
        Object.keys(chunks).forEach(chunkKey => {
            const mesh = chunks[chunkKey];
            if (mesh && mesh.geometry) mesh.geometry.dispose();
            scene.remove(chunks[chunkKey]);
        });
        Object.keys(chunks).forEach(k => delete chunks[k]);
        if (typeof chunkTransparent !== 'undefined') {
            Object.keys(chunkTransparent).forEach(chunkKey => {
                const m = chunkTransparent[chunkKey];
                if (m && m.geometry) { scene.remove(m); m.geometry.dispose(); }
            });
            Object.keys(chunkTransparent).forEach(k => delete chunkTransparent[k]);
        }
        Object.keys(blocks).forEach(k => delete blocks[k]);
        Object.keys(chunkBlocks).forEach(k => delete chunkBlocks[k]);
        loadedChunks.clear();
        while (chunksQueue.length) chunksQueue.pop();
        items.forEach(it => scene.remove(it.mesh));
        items.length = 0;
        mobs.forEach(m => scene.remove(m.group));
        mobs.length = 0;

        if (data.chunkKeys && data.chunkKeys.length > 0 && data._chunks) {
            for (let i = 0; i < data.chunkKeys.length; i++) {
                const ck = data.chunkKeys[i];
                const chunkBlocksData = data._chunks[ck];
                if (!chunkBlocksData) continue;
                for (const key in chunkBlocksData) {
                    const [bx, by, bz] = key.split(',').map(Number);
                    addBlock(bx, by, bz, chunkBlocksData[key]);
                }
            }
        }

        const chunkKeysSet = new Set();
        for (const key in blocks) {
            const [bx, , bz] = key.split(',').map(Number);
            const cx = Math.floor(bx / chunkSize);
            const cz = Math.floor(bz / chunkSize);
            chunkKeysSet.add(`${cx},${cz}`);
        }
        chunkKeysSet.forEach(k => {
            const [cx, cz] = k.split(',').map(Number);
            loadedChunks.add(k);
            buildChunkMesh(cx, cz);
        });

        yawObject.position.set(data.player.x, data.player.y, data.player.z);
        if (velocity) velocity.set(0, 0, 0);

        const inv = typeof window.playerInventory !== 'undefined' ? window.playerInventory : (typeof inventory !== 'undefined' ? inventory : null);
        if (inv && data.inventory && Array.isArray(data.inventory)) {
            for (let i = 0; i < 27; i++) inv[i] = (data.inventory[i] && data.inventory[i].type) ? { type: data.inventory[i].type, count: data.inventory[i].count || 1 } : null;
        }
        if (typeof data.gameMode === 'string') { if (typeof window !== 'undefined') window.gameMode = data.gameMode; }
        if (typeof data.playerHp === 'number') playerHp = data.playerHp;
        if (typeof data.playerHunger === 'number') playerHunger = data.playerHunger;
        if (typeof data.selectedHotbarIndex === 'number') selectedHotbarIndex = data.selectedHotbarIndex;
        if (typeof data.gameTime === 'number') window.gameTime = data.gameTime;

        if (typeof updateInventoryUI === 'function') updateInventoryUI();
        if (typeof updateSurvivalHUD === 'function') updateSurvivalHUD();
        if (typeof setGameMode === 'function' && typeof data.gameMode === 'string') setGameMode(data.gameMode);
        return true;
    }

    if (!useIndexedDB()) {
        try {
            let data = null;
            const metaRaw = localStorage.getItem(SAVE_PREFIX + name + '_meta');
            if (metaRaw) {
                data = JSON.parse(metaRaw);
                if (data && data.chunkKeys) {
                    data._chunks = {};
                    for (let i = 0; i < data.chunkKeys.length; i++) {
                        const rawChunk = localStorage.getItem(SAVE_PREFIX + name + '_chunk_' + data.chunkKeys[i]);
                        if (rawChunk) data._chunks[data.chunkKeys[i]] = JSON.parse(rawChunk);
                    }
                }
            }
            if (!data) {
                const raw = localStorage.getItem(SAVE_PREFIX + name);
                if (!raw) return Promise.resolve(false);
                data = JSON.parse(raw);
                if (!data.blocks || !data.player) return Promise.resolve(false);
                data.chunkKeys = [];
                data._chunks = {};
            }
            return Promise.resolve(applyData(data));
        } catch (e) {
            if (typeof console !== 'undefined' && console.warn) console.warn('Erreur chargement:', e);
            return Promise.resolve(false);
        }
    }

    return idbGet('meta_' + name)
        .then(function(meta) {
            if (!meta || !meta.player || !meta.chunkKeys) return null;
            const chunkPromises = meta.chunkKeys.map(function(ck) {
                return idbGet('chunk_' + name + '_' + ck).then(function(chunkData) {
                    return { ck: ck, data: chunkData };
                });
            });
            return Promise.all(chunkPromises).then(function(results) {
                meta._chunks = {};
                results.forEach(function(r) { if (r.data) meta._chunks[r.ck] = r.data; });
                return meta;
            });
        })
        .then(function(data) {
            return data ? applyData(data) : false;
        })
        .catch(function(e) {
            if (typeof console !== 'undefined' && console.warn) console.warn('Erreur chargement IndexedDB:', e);
            return false;
        });
}

function clearWorld() {
    if (typeof chunks === 'undefined') return;
    Object.keys(chunks).forEach(chunkKey => {
        const mesh = chunks[chunkKey];
        if (mesh && mesh.geometry) mesh.geometry.dispose();
        scene.remove(chunks[chunkKey]);
    });
    Object.keys(chunks).forEach(k => delete chunks[k]);
    if (typeof chunkTransparent !== 'undefined') {
        Object.keys(chunkTransparent).forEach(chunkKey => {
            const m = chunkTransparent[chunkKey];
            if (m && m.geometry) { scene.remove(m); m.geometry.dispose(); }
        });
        Object.keys(chunkTransparent).forEach(k => delete chunkTransparent[k]);
    }
    Object.keys(blocks).forEach(k => delete blocks[k]);
    Object.keys(chunkBlocks).forEach(k => delete chunkBlocks[k]);
    loadedChunks.clear();
    while (chunksQueue.length) chunksQueue.pop();
    if (typeof items !== 'undefined') {
        items.forEach(it => scene.remove(it.mesh));
        items.length = 0;
    }
    if (typeof mobs !== 'undefined') {
        mobs.forEach(m => scene.remove(m.group));
        mobs.length = 0;
    }
    if (yawObject) yawObject.position.set(0, 70, 0);
    if (typeof velocity !== 'undefined' && velocity) velocity.set(0, 0, 0);
    window.gameTime = 0;
}

function createNewWorld(name) {
    window.currentWorldName = name || ('Monde_' + Date.now());
    const list = getWorldList();
    if (list && !list.includes(window.currentWorldName)) setWorldList(list.concat(window.currentWorldName));
    else getWorldListAsync().then(function(list) {
        if (!list.includes(window.currentWorldName)) setWorldList(list.concat(window.currentWorldName));
    });
    clearWorld();
}

function hasSavedWorld(worldName) {
    if (worldName && !useIndexedDB()) return !!(localStorage.getItem(SAVE_PREFIX + worldName + '_meta') || localStorage.getItem(SAVE_PREFIX + worldName));
    return getWorldListAsync().then(function(list) { return list.length > 0; });
}

function deleteWorld(name) {
    if (!useIndexedDB()) {
        const metaRaw = localStorage.getItem(SAVE_PREFIX + name + '_meta');
        if (metaRaw) {
            try {
                const meta = JSON.parse(metaRaw);
                if (meta.chunkKeys && Array.isArray(meta.chunkKeys)) meta.chunkKeys.forEach(ck => localStorage.removeItem(SAVE_PREFIX + name + '_chunk_' + ck));
            } catch (_) {}
            localStorage.removeItem(SAVE_PREFIX + name + '_meta');
        }
        localStorage.removeItem(SAVE_PREFIX + name);
        const list = getWorldList().filter(n => n !== name);
        setWorldList(list);
        return Promise.resolve();
    }
    return idbGet('meta_' + name).then(function(meta) {
        const keys = ['meta_' + name];
        if (meta && meta.chunkKeys) meta.chunkKeys.forEach(function(ck) { keys.push('chunk_' + name + '_' + ck); });
        return Promise.all(keys.map(idbDelete));
    }).then(function() {
        return getWorldListAsync().then(function(list) {
            return setWorldList(list.filter(n => n !== name));
        });
    });
}

function duplicateWorld(sourceName) {
    function doDup(meta, chunkMap) {
        let newName = 'Copie de ' + sourceName;
        return getWorldListAsync().then(function(list) {
            let n = 1;
            while (list.indexOf(newName) >= 0) newName = 'Copie de ' + sourceName + ' (' + (n++) + ')';
            meta.name = newName;
            meta.lastSave = Date.now();
            if (!useIndexedDB()) {
                localStorage.setItem(SAVE_PREFIX + newName + '_meta', JSON.stringify(meta));
                (meta.chunkKeys || []).forEach(function(ck) {
                    if (chunkMap && chunkMap[ck]) localStorage.setItem(SAVE_PREFIX + newName + '_chunk_' + ck, JSON.stringify(chunkMap[ck]));
                    else {
                        const chunkData = localStorage.getItem(SAVE_PREFIX + sourceName + '_chunk_' + ck);
                        if (chunkData) localStorage.setItem(SAVE_PREFIX + newName + '_chunk_' + ck, chunkData);
                    }
                });
                list.push(newName);
                setWorldList(list);
                return newName;
            }
            return idbSet('meta_' + newName, meta).then(function() {
                const promises = (meta.chunkKeys || []).map(function(ck) {
                    const data = chunkMap && chunkMap[ck] ? chunkMap[ck] : null;
                    if (data) return idbSet('chunk_' + newName + '_' + ck, data);
                    return idbGet('chunk_' + sourceName + '_' + ck).then(function(d) {
                        if (d) return idbSet('chunk_' + newName + '_' + ck, d);
                    });
                });
                return Promise.all(promises).then(function() {
                    return getWorldListAsync().then(function(l) {
                        l.push(newName);
                        return setWorldList(l).then(function() { return newName; });
                    });
                });
            });
        });
    }

    if (!useIndexedDB()) {
        try {
            const metaRaw = localStorage.getItem(SAVE_PREFIX + sourceName + '_meta');
            let meta = null, chunkToBlocksCopy = null;
            if (metaRaw) {
                meta = JSON.parse(metaRaw);
                meta.chunkKeys = meta.chunkKeys || [];
            } else {
                const raw = localStorage.getItem(SAVE_PREFIX + sourceName);
                if (!raw) return Promise.resolve(null);
                const data = JSON.parse(raw);
                if (!data.blocks) return Promise.resolve(null);
                chunkToBlocksCopy = {};
                for (const key in data.blocks) {
                    const ck = getChunkKeyFromBlockKey(key);
                    if (!chunkToBlocksCopy[ck]) chunkToBlocksCopy[ck] = {};
                    chunkToBlocksCopy[ck][key] = data.blocks[key];
                }
                meta = { version: SAVE_VERSION, chunkKeys: Object.keys(chunkToBlocksCopy), player: data.player, inventory: data.inventory, gameMode: data.gameMode, playerHp: data.playerHp, playerHunger: data.playerHunger, selectedHotbarIndex: data.selectedHotbarIndex, gameTime: data.gameTime };
            }
            return doDup(meta, chunkToBlocksCopy);
        } catch (e) {
            if (typeof console !== 'undefined' && console.warn) console.warn('Erreur duplication:', e);
            return Promise.resolve(null);
        }
    }

    return idbGet('meta_' + sourceName).then(function(meta) {
        if (!meta) return null;
        meta.chunkKeys = meta.chunkKeys || [];
        return Promise.all(meta.chunkKeys.map(function(ck) { return idbGet('chunk_' + sourceName + '_' + ck).then(function(d) { return { ck: ck, d: d }; }); }))
            .then(function(results) {
                const chunkMap = {};
                results.forEach(function(r) { if (r.d) chunkMap[r.ck] = r.d; });
                return doDup(meta, chunkMap);
            });
    });
}

// --- Atlas de textures : sauvegarde / restauration IndexedDB ---
window.saveAtlasesToIndexedDB = function() {
    const blocksUrl = (typeof window.getAtlasDataUrl === 'function' && window.getAtlasDataUrl()) || window.atlasDataUrl || '';
    const mobsUrl = (typeof window.getMobAtlasDataUrl === 'function' && window.getMobAtlasDataUrl()) || '';
    const p = [];
    if (blocksUrl) p.push(idbSet('atlas_blocks', blocksUrl));
    if (mobsUrl) p.push(idbSet('atlas_mobs', mobsUrl));
    return Promise.all(p);
};
window.restoreAtlasesFromIndexedDB = function() {
    return openIDB().then(function(db) {
        if (!db) return [undefined, undefined];
        return Promise.all([idbGet('atlas_blocks'), idbGet('atlas_mobs')]);
    });
};
