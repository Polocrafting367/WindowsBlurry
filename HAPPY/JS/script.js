const THEMES = {
    'default': {
        name: 'Défaut',
        lvl: 1,
        cost: 0,
        bg: '#121212',
        surf: '#1e1e1e',
        surf2: '#252525',
        nav: '#1a1a2e',
        prim: '#bb86fc',
        sec: '#03dac6',
        err: '#cf6679'
    },
    'coffee': {
        name: 'Café',
        lvl: 2,
        cost: 20,
        bg: '#2c2420',
        surf: '#4a3b34',
        surf2: '#5d4a42',
        nav: '#1f1917',
        prim: '#d4a373',
        sec: '#faedcd',
        err: '#e07a5f'
    },
    'forest': {
        name: 'Forêt',
        lvl: 3,
        cost: 40,
        bg: '#0a1a0a',
        surf: '#243d24',
        surf2: '#2e502e',
        nav: '#051205',
        prim: '#81c784',
        sec: '#aed581',
        err: '#e57373'
    },
    'mystic': {
        name: 'Bois Mystique',
        lvl: 4,
        cost: 60,
        bg: '#0a1a0a',
        surf: '#3a2550',
        surf2: '#81c78430',
        nav: '#1e122a',
        prim: '#b39ddb',
        sec: '#81c784',
        err: '#ff8a65'
    },
    'ocean': {
        name: 'Océan',
        lvl: 5,
        cost: 80,
        bg: '#001529',
        surf: '#002b52',
        surf2: '#003d73',
        nav: '#000b1a',
        prim: '#4fc3f7',
        sec: '#26c6da',
        err: '#ff5252'
    },
    'atlantis': {
        name: 'Atlantis',
        lvl: 6,
        cost: 100,
        bg: '#002626',
        surf: '#004d4d',
        surf2: '#006666',
        nav: '#001a1a',
        prim: '#1de9b6',
        sec: '#4fc3f7',
        err: '#ff5252'
    },

    // Thèmes clairs
    'candy': {
        name: 'Bonbon',
        lvl: 7,
        cost: 120,
        bg: '#ffdbc9',
        surf: '#ffffff',
        surf2: '#ffb3c1',
        nav: '#ff85a1',
        prim: '#d81b60',
        sec: '#ad1457',
        err: '#c62828'
    },
    'popsicle': {
        name: 'Popsicle',
        lvl: 8,
        cost: 140,
        bg: '#ffedd5',
        surf: '#ffffff',
        surf2: '#fed7aa',
        nav: '#fb923c',
        prim: '#ea580c',
        sec: '#f97316',
        err: '#dc2626'
    },
    'ruby': {
        name: 'Rubis',
        lvl: 9,
        cost: 160,
        bg: '#ffe4e6',
        surf: '#ffffff',
        surf2: '#fecdd3',
        nav: '#fb7185',
        prim: '#e11d48',
        sec: '#be123c',
        err: '#9f1239'
    },
    'lagoon': {
        name: 'Lagune',
        lvl: 10,
        cost: 180,
        bg: '#cffafe',
        surf: '#ffffff',
        surf2: '#a5f3fc',
        nav: '#22d3ee',
        prim: '#0891b2',
        sec: '#0e7490',
        err: '#be123c'
    },
    'lollipop': {
        name: 'Lollipop',
        lvl: 11,
        cost: 200,
        bg: '#f3e5f5',
        surf: '#ffffff',
        surf2: '#ce93d8',
        nav: '#ab47bc',
        prim: '#7b1fa2',
        sec: '#00bcd4',
        err: '#e91e63'
    },
    'mint': {
        name: 'Menthe',
        lvl: 12,
        cost: 220,
        bg: '#e0f2f1',
        surf: '#b2dfdb',
        surf2: '#80cbc4',
        nav: '#4db6ac',
        prim: '#00796b',
        sec: '#01b597',
        err: '#c62828'
    },
    'sakura': {
        name: 'Sakura',
        lvl: 13,
        cost: 240,
        bg: '#fff0f5',
        surf: '#ffffff',
        surf2: '#f48fb1',
        nav: '#ec407a',
        prim: '#ad1457',
        sec: '#ff80ab',
        err: '#d32f2f'
    },

    'deepsea': {
        name: 'Abysses',
        lvl: 14,
        cost: 260,
        bg: '#02060c',
        surf: '#112240',
        surf2: '#1a335e',
        nav: '#010409',
        prim: '#64ffda',
        sec: '#00bfa5',
        err: '#f06292'
    },
    'desert': {
        name: 'Désert',
        lvl: 16,
        cost: 280,
        bg: '#2b1e16',
        surf: '#5d4037',
        surf2: '#6d4c41',
        nav: '#1a120d',
        prim: '#ffcc80',
        sec: '#d4a373',
        err: '#e57373'
    },
    'sunset': {
        name: 'Coucher de Soleil',
        lvl: 18,
        cost: 300,
        bg: '#1a0500',
        surf: '#4d0f00',
        surf2: '#6b1500',
        nav: '#000000',
        prim: '#ff8c00',
        sec: '#ff4500',
        err: '#ffccbc'
    },
    'lava': {
        name: 'Volcan',
        lvl: 20,
        cost: 320,
        bg: '#0d0000',
        surf: '#2d0a00',
        surf2: '#4d0f00',
        nav: '#000000',
        prim: '#ff4e00',
        sec: '#ff0000',
        err: '#ff8a80'
    },
    'toxic': {
        name: 'Toxique',
        lvl: 22,
        cost: 340,
        bg: '#050a05',
        surf: '#1a331a',
        surf2: '#244d24',
        nav: '#0a001a',
        prim: '#adff2f',
        sec: '#32cd32',
        err: '#ff4500'
    },
    'neon': {
        name: 'Néon',
        lvl: 24,
        cost: 360,
        bg: '#000000',
        surf: '#151515',
        surf2: '#222222',
        nav: '#000000',
        prim: '#39ff14',
        sec: '#ccff00',
        err: '#ff00ff'
    },
    'synth': {
        name: 'Retro',
        lvl: 26,
        cost: 380,
        bg: '#0d0221',
        surf: '#240b5a',
        surf2: '#331080',
        nav: '#050110',
        prim: '#f92aad',
        sec: '#00e5ff',
        err: '#ff2d55'
    },
    'cyber': {
        name: 'Cyber',
        lvl: 28,
        cost: 400,
        bg: '#0b0014',
        surf: '#250040',
        surf2: '#35005c',
        nav: '#000a1a',
        prim: '#ff00ff',
        sec: '#00ffff',
        err: '#ff0055'
    },

    // Or Pur et Luxe
    'gold': {
        name: 'Or Pur',
        lvl: 30,
        cost: 450,
        bg: '#463500',
        surf: '#af8a3d',
        surf2: '#c9a65a',
        nav: '#7a5901',
        prim: '#ffd700',
        sec: '#fcf4a3',
        err: '#ff4444'
    },
    'luxe': {
        name: 'Luxe Noir',
        lvl: 35,
        cost: 480,
        bg: '#050505',
        surf: '#1a1a1a',
        surf2: '#252525',
        nav: '#000000',
        prim: '#d4af37',
        sec: '#aa8800',
        err: '#cf6679'
    },
    'royal': {
        name: 'Royal',
        lvl: 40,
        cost: 500,
        bg: '#0a0014',
        surf: '#2d0059',
        surf2: '#3d007a',
        nav: '#05000a',
        prim: '#ffd700',
        sec: '#bd93f9',
        err: '#ff5555'
    },
    'emerald': {
        name: 'Émeraude',
        lvl: 45,
        cost: 520,
        bg: '#00140d',
        surf: '#003d24',
        surf2: '#005231',
        nav: '#000a06',
        prim: '#2ecc71',
        sec: '#1abc9c',
        err: '#e74c3c'
    },
    'glitch': {
        name: 'Glitch',
        lvl: 50,
        cost: 550,
        bg: '#000000',
        surf: '#111111',
        surf2: '#222222',
        nav: '#000000',
        prim: '#00ffff',
        sec: '#ff00ff',
        err: '#ffff00'
    },
    'aurora': {
        name: 'Aurore',
        lvl: 55,
        cost: 600,
        bg: '#010b13',
        surf: '#1a2e35',
        surf2: '#243e47',
        nav: '#1a0d2b',
        prim: '#00e676',
        sec: '#d1d1f7',
        err: '#ff5252'
    },
    'midnight': {
        name: 'Minuit',
        lvl: 60,
        cost: 650,
        bg: '#05050a',
        surf: '#1a1a2e',
        surf2: '#252545',
        nav: '#020205',
        prim: '#7986cb',
        sec: '#3f51b5',
        err: '#ff4081'
    },

    // Fin de jeu (700-900)
    'supernova': {
        name: 'Supernova',
        lvl: 80,
        cost: 750,
        bg: '#04000d',
        surf: '#12003d',
        surf2: '#1c005e',
        nav: '#000000',
        prim: '#ff007f',
        sec: '#7a00ff',
        err: '#00ffcc'
    },
    'crash': {
        name: 'Error 404',
        lvl: 90,
        cost: 800,
        bg: '#0000aa',
        surf: '#002bff',
        surf2: '#000479',
        nav: '#002bff',
        prim: '#00d0ff',
        sec: '#5555ff',
        err: '#ff5555'
    },
    'corrupt': {
        name: 'Corrompu',
        lvl: 95,
        cost: 850,
        bg: '#1a1a1a',
        surf: '#0a0a0a',
        surf2: '#111111',
        nav: '#440000',
        prim: '#00ff00',
        sec: '#5555ff',
        err: '#ffffff'
    },
    'void': {
        name: 'Néant',
        lvl: 100,
        cost: 900,
        bg: '#000000',
        surf: '#0a0a0a',
        surf2: '#111111',
        nav: '#050505',
        prim: '#ffffff',
        sec: '#444444',
        err: '#ff0000'
    },
    'frozen': {
        name: 'Givre',
        lvl: 110,
        cost: 900,
        bg: '#0f172a',
        surf: '#1e293b',
        surf2: '#334155',
        nav: '#020617',
        prim: '#a2d2ff',
        sec: '#7dd3fc',
        err: '#fb7185'
    },
};
const RANKS = [{
    id: 0,
    name: 'Débutant',
    icon: 'fa-solid fa-egg',
    color: '#888',
    threshold: 0
}, {
    id: 1,
    name: 'Caillou',
    icon: 'fa-solid fa-mountain',
    color: '#a6a6a6',
    threshold: 2
}, {
    id: 2,
    name: 'Bois',
    icon: 'fa-solid fa-tree',
    color: '#cd853f',
    threshold: 5
}, {
    id: 3,
    name: 'Bronze',
    icon: 'fa-solid fa-medal',
    color: '#cd7f32',
    threshold: 10
}, {
    id: 4,
    name: 'Argent',
    icon: 'fa-solid fa-medal',
    color: '#c0c0c0',
    threshold: 20
}, {
    id: 5,
    name: 'Or',
    icon: 'fa-solid fa-medal',
    color: '#ffd700',
    threshold: 30
}, {
    id: 6,
    name: 'Platine',
    icon: 'fa-solid fa-trophy',
    color: '#e5e4e2',
    threshold: 45
}, {
    id: 7,
    name: 'Émeraude',
    icon: 'fa-solid fa-leaf',
    color: '#2ecc71',
    threshold: 65
}, {
    id: 8,
    name: 'Diamant',
    icon: 'fa-solid fa-gem',
    color: '#b9f2ff',
    threshold: 90
}, {
    id: 9,
    name: 'Maître',
    icon: 'fa-solid fa-crown',
    color: '#9b59b6',
    threshold: 130
}, {
    id: 10,
    name: 'Légende',
    icon: 'fa-solid fa-bolt',
    color: '#ff8c00',
    threshold: 200
}, {
    id: 11,
    name: 'En Feu',
    icon: 'fa-solid fa-fire',
    color: '#ff4500',
    threshold: 365
}, {
    id: 12,
    name: 'Éternel',
    icon: 'fa-solid fa-infinity',
    color: '#00ffff',
    threshold: 450
}];
const SHOP_ITEMS = {
    'confetti': {
        name: 'Confettis',
        icon: 'fa-wand-magic-sparkles',
        color: '#ff00ff',
        cost: 100,
        desc: 'Explosion de joie !',
        single: true
    },
    'goldBadge': {
        name: 'Badge Doré',
        icon: 'fa-certificate',
        color: '#ffd700',
        cost: 750,
        desc: 'Cosmétique : Aura dorée permanente.',
        single: false
    },
    'insurance': {
        name: 'Assurance Vie',
        icon: 'fa-user-shield',
        color: '#03dac6',
        cost: 400,
        desc: 'Bloque automatiquement 1 perte de cœur.',
        single: true
    },
    'potionXP': {
        name: 'Potion XP (x2)',
        icon: 'fa-flask',
        color: '#bb86fc',
        cost: 1200,
        desc: "Double l'XP de la prochaine action.",
        single: true
    },
    'joker': {
        name: 'Joker',
        icon: 'fa-shield-halved',
        color: 'var(--gold)',
        cost: 600,
        desc: 'Annule les perte lié a un "Cédé".',
        single: true
    },
    'freeze': {
        name: 'Pause',
        icon: 'fa-icicles',
        color: '#a2d2ff',
        cost: 3000,
        desc: 'Gèle tes séries pendant 48h.',
        single: true
    },
    'eraser': {
        name: 'Gomme',
        icon: 'fa-eraser',
        color: '#f4a261',
        cost: 10000,
        desc: "Annule le dernier enregistrement d'un profil.",
        single: true
    },
};
// --- STATE ---

// Initialisation propre : Valeurs par défaut uniquement.
// Les vraies données seront injectées par init() via getItem()
let store = {
    activeSessions: {}, 
    profiles: [],
    events: [],
    xp: 0,
    coins: 0,
    inventory: { 
        jokers: 0,
        confetti: 0,
        ownedThemes: ['default'],
        potionXP: 0,
        insurance: 0,
        eraser: 0,
        freeze: 0,
        freezeUntil: null,
        goldBadge: 0,
        showGoldBadge: true
    },
    activeTheme: 'default',
    isProMode: false
};
let currentHistoryFilter = 'all';
let stopwatchInterval = null;
let stopwatchSeconds = 0;
let tempNotes = {};
if (!store.inventory.ownedThemes) store.inventory.ownedThemes = ['default'];
let historyNavDate = new Date(); // Date de référence pour l'historique
let selectedType = 'good';
let navDate = new Date();
let editingProfileId = null;
let selectedProfileToErase = null;
let statsYear = new Date().getFullYear(); 
viewMode: 'grid';
let habit_view_mode = 'grid';









