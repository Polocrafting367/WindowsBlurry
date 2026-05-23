// ==========================================
// REGISTRE DES BLOCS – ID, nom, textures, comportement
// Utilisé pour : sauvegarde (IDs), monde, inventaire, GUI, prévisualisation main, objets au sol
// ==========================================

(function() {
    'use strict';

    // 0 = air (pas stocké en chunk), 1..N = blocs
    var NEXT_ID = 1;
    var BY_NAME = {};
    var BY_ID = [];

    function register(name, opts) {
        opts = opts || {};
        var id = NEXT_ID++;
        var entry = {
            id: id,
            name: name,
            transparent: !!opts.transparent,
            flora: !!opts.flora,       // croix 2 quads, même texture face
            cross: !!opts.cross,       // comme flora (torch, fire)
            solid: opts.solid !== false,
            // Pour multi-texture type "grass": sides, top, bottom (noms de tile ou [tx,ty])
            tiles: opts.tiles || null  // si objet: { sides, top, bottom } ou { all }
        };
        BY_NAME[name] = entry;
        BY_ID[id] = entry;
        return id;
    }

    // Air (id 0) – pas enregistré comme bloc, mais on garde la cohérence
    BY_ID[0] = { id: 0, name: 'air', transparent: true, flora: false, solid: false };

    // Blocs solides simples (une texture partout)
    register('dirt');
    register('stone');
    register('cobblestone');
    register('planks');
    register('sand');
    register('glass', { transparent: true });
    register('leaves');
    register('wool');
    register('grass_path');
    register('iron_ore');
    register('diamond_ore');
    register('coal_ore');
    register('gold_ore');
    register('wood');  // multi-texture (côtés écorce, dessus/dessous planches) géré dans getTileCoords
    register('birch_wood');
    register('birch_leaves');
    register('maple_wood');
    register('maple_leaves');
    register('dark_wood');
    register('dark_leaves');
    register('grass'); // multi-texture (côtés terre, dessus herbe, dessous terre)
    register('grass_birch'); // herbe biome bouleau (teinte orangée)
    register('crafting_table'); // multi-face
    register('cactus');         // multi-face
    register('snow_layer');
    register('snow');
    register('water', { transparent: true });
    register('fire', { transparent: true, cross: true });
    register('torch', { transparent: true, flora: true });
    register('tnt');
    register('chest');
    register('bed');
    register('wooden_door');
    register('wooden_trapdoor');

    // Flore / décor (croix)
    register('flower_red', { flora: true, transparent: true });
    register('flower_yellow', { flora: true, transparent: true });
    register('tall_grass', { flora: true, transparent: true });

    // Objets / items (inventaire, drops, prévisualisation)
    register('stick');
    register('wood_pickaxe');
    register('iron_pickaxe');
    register('diamond_pickaxe');
    register('wood_sword');
    register('iron_sword');
    register('diamond_sword');
    register('iron_ingot');
    register('diamond');
    register('coal');
    register('gunpowder');
    register('boat');

    // Rétrocompatibilité : types sauvegardés en ancien format (string) sans ID
    function ensureRegistered(name) {
        if (BY_NAME[name]) return BY_NAME[name].id;
        var id = register(name);
        return id;
    }

    window.BLOCK_REGISTRY = {
        getBlockId: function(type) {
            if (type == null || type === '') return 0;
            var e = BY_NAME[type];
            if (e) return e.id;
            return ensureRegistered(type);
        },
        getBlockType: function(id) {
            if (id == null || id === 0) return null;
            var e = BY_ID[id];
            return e ? e.name : null;
        },
        getBlockInfo: function(idOrType) {
            if (typeof idOrType === 'number') return BY_ID[idOrType] || null;
            return BY_NAME[idOrType] || null;
        },
        isFlora: function(type) {
            var e = BY_NAME[type];
            return e ? e.flora : false;
        },
        isTransparent: function(type) {
            var e = BY_NAME[type];
            return e ? e.transparent : false;
        },
        isCross: function(type) {
            var e = BY_NAME[type];
            return e ? e.cross : false;
        },
        getAllTypes: function() {
            return Object.keys(BY_NAME);
        },
        getMaxId: function() {
            return NEXT_ID - 1;
        }
    };

    // Raccourcis globaux
    window.getBlockId = window.BLOCK_REGISTRY.getBlockId;
    window.getBlockType = window.BLOCK_REGISTRY.getBlockType;
    window.getBlockInfo = window.BLOCK_REGISTRY.getBlockInfo;
})();
