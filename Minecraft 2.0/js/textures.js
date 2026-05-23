    let atlasDataUrl = "";
        
        const floraTypes = ['flower_red', 'flower_yellow', 'tall_grass', 'torch'];
        const transparentTypes = ['glass', 'water', 'fire', ...floraTypes]; // leaves = opaque (forme conservée, pas de transparence) 
        
function generateTextureAtlas() {
    const TEXTURE_QUALITY = 16;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 64, 256);

    function px(bx, by, x, y, color, w, h) {
        if (w === undefined) w = 1;
        if (h === undefined) h = 1;
        ctx.fillStyle = color;
        ctx.fillRect(bx + x, by + y, w, h);
    }

    function drawNoiseBlock(bx, by, baseColor, colorsList) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(bx, by, 16, 16);
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                let noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
                noise = noise - Math.floor(noise);
                if (noise > 0.5) {
                    let colorIdx = Math.floor((noise - 0.5) * 2 * colorsList.length);
                    px(bx, by, x, y, colorsList[colorIdx]);
                }
            }
        }
    }

    function drawSprite(bx, by, palette, spriteMap) {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const char = spriteMap[y][x];
                if (char !== ' ' && palette[char]) {
                    ctx.fillStyle = palette[char];
                    ctx.fillRect(bx + x, by + y, 1, 1);
                }
            }
        }
    }

    const flowerPalette = {
        'd': '#1b4a10', 'g': '#337a20', 'l': '#4aab32',
        'R': '#5e0b0b', 'r': '#b81616', 'p': '#eb3131',
        'Y': '#b88216', 'y': '#ebd531', 'w': '#f7f2b5'
    };

    const redFlowerSprite = [
        "                ", "       rr       ", "      rppr      ", "     rppRpr     ",
        "      rpRpr     ", "       rRr      ", "        g       ", "       dgd      ",
        "    d  dgl      ", "   lgd dgl      ", "   dgl  g  d    ", "    gd  g dgl   ",
        "        gdlgd   ", "        dgd     ", "         d      ", "                "
    ];

    const yellowFlowerSprite = [
        "                ", "                ", "       YY       ", "      YyyY      ",
        "     YyywyY     ", "      YywY      ", "       YY       ", "       g        ",
        "      dgd       ", "      dgl d     ", "  d   dgl dgl   ", " lgl  g  dlgl   ",
        " dgl  g   gd    ", "  gd dgd        ", "      d         ", "                "
    ];

    const craftPalette = {
        '0': '#382613', '1': '#5e4226', '2': '#755433', '3': '#9c7b4c', '4': '#b6945c',
        's': '#8c8c8c', 'S': '#5a5a5a', 'r': '#942222'
    };

    const craftTopSprite = [
        "1111111111111111", "1444414444144441", "1433314333143331", "1433314333143331",
        "1433314333143331", "1111111111111111", "1444414444144441", "1433314333143331",
        "1433314333143331", "1433314333143331", "1111111111111111", "1444414444144441",
        "1433314333143331", "1433314333143331", "1433314333143331", "1111111111111111"
    ];

    const craftSideSprite = [
        "1111111111111111", "3444444444444443", "3333333333333333", "0000000000000000",
        "33233sS333233333", "3333SsS333332333", "233sSsS331113332", "33sSsS333r1r3333",
        "3sSsS32331113333", "331133333r1r3323", "2333333331113333", "3332332333333332",
        "3333333333323333", "0330333033333033", "1001000100000100", "0000000000000000"
    ];

    const toolPalettes = {
        wood:    { '0': '#291b0f', '1': '#4a311b', '2': '#735131', '3': '#402a18', '4': '#5e4026', '5': '#805938', '6': '#9e724a' },
        iron:    { '0': '#291b0f', '1': '#4a311b', '2': '#735131', '3': '#3d3d3d', '4': '#7a7a7a', '5': '#b5b5b5', '6': '#ffffff' },
        diamond: { '0': '#291b0f', '1': '#4a311b', '2': '#735131', '3': '#165759', '4': '#248f91', '5': '#3be8eb', '6': '#91fffe' },
        coal:    { '3': '#141414', '4': '#292929', '5': '#424242', '6': '#5e5e5e' }
    };

    const pickaxeSprite = [
        "                ",
        "        33333   ",
        "      33555553  ",
        "     3556666553 ",
        "    356633336553",
        "    363  0136553",
        "    33  01136553",
        "       02103653 ",
        "      0210 353  ",
        "     0210  33   ",
        "    0210        ",
        "   0210         ",
        "  0210          ",
        " 0210           ",
        " 010            ",
        " 00             "
    ];

    const swordSprite = [
        "              3 ", "             363", "            3563", "           3553 ",
        "          3553  ", "         3553   ", "        3553    ", "    0  3553     ",
        "   0103553      ", "  0121053       ", "   01210  0     ", "     0121010    ",
        "      01210     ", "       010      ", "         0      ", "                "
    ];

    const stickSprite = [
        "                ", "                ", "                ", "                ",
        "                ", "             0  ", "            010 ", "           0210 ",
        "          0210  ", "         0210   ", "        0210    ", "       0210     ",
        "      0210      ", "     0210        ", "    0100         ", "   0000         "
    ];

    const ingotSprite = [
        "                ", "                ", "                ", "                ",
        "                ", "      3333      ", "    33666633    ", "   3655555563   ",
        "  355555555553  ", "  344444444443  ", "   3333333333   ", "                ",
        "                ", "                ", "                ", "                "
    ];

    const diamondGemSprite = [
        "                ", "                ", "                ", "      3333      ",
        "    33666633    ", "  336555555633  ", "  365555555563  ", "   3655555563   ",
        "    36555563    ", "     365563     ", "      3663      ", "       33       ",
        "                ", "                ", "                ", "                "
    ];

    const coalItemSprite = [
        "                ", "                ", "                ", "      333       ",
        "    3344433     ", "   344455543    ", "  34455566543   ", "  34555666543   ",
        "  34555565543   ", "   345555543    ", "    3344433     ", "      333       ",
        "                ", "                ", "                ", "                "
    ];

    drawNoiseBlock(0, 0, '#79553a', ['#8b6b4b', '#68452d', '#593a25']);
    drawNoiseBlock(16, 0, '#5e942f', ['#6bb833', '#4d7a27', '#7bd43d']);
    drawNoiseBlock(32, 0, '#79553a', ['#8b6b4b', '#68452d']);
    const grassHeights = [4, 5, 4, 3, 5, 6, 4, 3, 4, 5, 6, 4, 3, 5, 4, 4];
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < grassHeights[x]; y++) {
            let color = (y === grassHeights[x] - 1) ? '#4d7a27' : '#5e942f';
            px(32, 0, x, y, color);
        }
    }
    drawNoiseBlock(48, 0, '#7d7d7d', ['#8c8c8c', '#6e6e6e', '#5a5a5a']);

    ctx.fillStyle = '#3a2512'; ctx.fillRect(0, 16, 16, 16);
    const barkColors = ['#5e4226', '#4a331c', '#6b4c2a'];
    for (let x = 0; x < 16; x++) {
        let col = barkColors[Math.floor(Math.abs(Math.sin(x * 2.3)) * barkColors.length)];
        px(0, 16, x, 0, col, 1, 16);
        if (x % 3 === 0) px(0, 16, x, (x * 3) % 16, '#3a2512', 1, 3);
    }

    ctx.fillStyle = '#b6945c'; ctx.fillRect(16, 16, 16, 16);
    px(16, 16, 0, 0, '#3a2512', 16, 16);
    px(16, 16, 1, 1, '#b6945c', 14, 14);
    px(16, 16, 3, 3, '#9c7b4c', 10, 10); px(16, 16, 4, 4, '#b6945c', 8, 8);
    px(16, 16, 6, 6, '#9c7b4c', 4, 4); px(16, 16, 7, 7, '#b6945c', 2, 2);

    ctx.fillStyle = '#1a3d0e'; ctx.fillRect(32, 16, 16, 16);
    const leafColors = ['#1a3d0e', '#2c5216', '#3d6b20', '#4a8228', '#357a1a', '#286b14'];
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            const n = Math.sin(x * 2.7 + y * 3.1) * 43758.5453; const v = n - Math.floor(n);
            const n2 = Math.sin(x * 1.3 + y * 2.9 + 10) * 43758.5453; const v2 = n2 - Math.floor(n2);
            const idx = Math.floor((v + v2) * 0.5 * leafColors.length) % leafColors.length;
            px(32, 16, x, y, leafColors[idx]);
        }
    }
    for (let i = 0; i < 24; i++) {
        const nx = Math.sin(i * 5.1) * 43758.5453; const vx = (nx - Math.floor(nx) + 1) % 1;
        const ny = Math.sin(i * 7.3 + 3) * 43758.5453; const vy = (ny - Math.floor(ny) + 1) % 1;
        const cx = Math.floor(vx * 14) + 1, cy = Math.floor(vy * 14) + 1;
        const r = 1 + Math.floor(Math.sin(i * 2) * 43758.5453) % 2;
        for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
            const ax = cx + dx, ay = cy + dy;
            if (ax >= 0 && ax < 16 && ay >= 0 && ay < 16 && (dx*dx + dy*dy <= r*r)) px(32, 16, ax, ay, leafColors[i % leafColors.length]);
        }
    }
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            const n = Math.sin(x * 4.1 + y * 5.7 + 99) * 43758.5453; const v = n - Math.floor(n);
            if (v < 0.22) ctx.clearRect(32 + x, 16 + y, 1, 1);
        }
    }

    drawSprite(48, 16, flowerPalette, redFlowerSprite);
    drawSprite(0, 32, flowerPalette, yellowFlowerSprite);

    const tgColor1 = '#4a8220', tgColor2 = '#61a32f';
    px(16, 32, 4, 6, tgColor2, 1, 10); px(16, 32, 7, 4, tgColor1, 2, 12);
    px(16, 32, 11, 8, tgColor2, 1, 8); px(16, 32, 12, 10, tgColor1, 1, 6);

    ctx.fillStyle = '#9c7b4c'; ctx.fillRect(32, 32, 16, 16);
    for (let y = 0; y < 16; y += 4) {
        px(32, 32, 0, y, '#b6945c', 16, 1);
        px(32, 32, 0, y + 3, '#5e4226', 16, 1);
        if (y === 0 || y === 8) { px(32, 32, 2, y + 1, '#4a331c'); px(32, 32, 14, y + 1, '#4a331c'); }
        else { px(32, 32, 6, y + 1, '#4a331c'); }
    }

    ctx.fillStyle = 'rgba(230, 245, 255, 0.15)'; ctx.fillRect(48, 32, 16, 16);
    px(48, 32, 0, 0, '#fff', 16, 2); px(48, 32, 0, 14, '#fff', 16, 2);
    px(48, 32, 0, 0, '#fff', 2, 16); px(48, 32, 14, 0, '#fff', 2, 16);
    for (let i = 4; i < 9; i++) { px(48, 32, i, i + 2, '#fff'); px(48, 32, i + 4, i, '#fff'); }

    ctx.fillStyle = '#3b3b3b'; ctx.fillRect(0, 48, 16, 16);
    const stones = [{x: 1, y: 1, w: 7, h: 6}, {x: 9, y: 1, w: 6, h: 4}, {x: 1, y: 8, w: 5, h: 7}, {x: 7, y: 6, w: 8, h: 5}, {x: 7, y: 12, w: 8, h: 3}];
    stones.forEach(function(s) {
        px(0, 48, s.x, s.y, '#7d7d7d', s.w, s.h);
        px(0, 48, s.x, s.y, '#a1a1a1', s.w, 1); px(0, 48, s.x, s.y, '#a1a1a1', 1, s.h);
        px(0, 48, s.x + s.w - 1, s.y, '#5a5a5a', 1, s.h); px(0, 48, s.x, s.y + s.h - 1, '#5a5a5a', s.w, 1);
    });

    drawSprite(16, 48, craftPalette, craftTopSprite);
    drawSprite(32, 48, craftPalette, craftSideSprite);
    drawNoiseBlock(48, 48, '#a6855b', ['#b8986c', '#8b6b4b']);

    drawNoiseBlock(0, 64, '#dbd3a0', ['#e8e1b7', '#c2ba86']);
    drawNoiseBlock(16, 64, '#f0fbfb', ['#ffffff', '#e0ecec']);

    ctx.fillStyle = '#185918'; ctx.fillRect(32, 64, 16, 16);
    for (let x = 1; x < 16; x += 4) { px(32, 64, x, 0, '#258a25', 2, 16); }
    for (let y = 2; y < 16; y += 5) { px(32, 64, 3, y, '#000', 1, 1); px(32, 64, 11, y + 2, '#000', 1, 1); }

    ctx.fillStyle = '#185918'; ctx.fillRect(48, 64, 16, 16);
    px(48, 64, 2, 2, '#4d994d', 12, 12);
    px(48, 64, 4, 4, '#258a25', 8, 8);

    function drawOre(bx, by, colorBase, colorLight) {
        drawNoiseBlock(bx, by, '#7d7d7d', ['#8c8c8c', '#6e6e6e']);
        const spots = [{x: 2, y: 3}, {x: 10, y: 2}, {x: 5, y: 8}, {x: 11, y: 10}, {x: 3, y: 12}];
        spots.forEach(function(sp) { px(bx, by, sp.x, sp.y, colorBase, 2, 2); px(bx, by, sp.x, sp.y, colorLight, 1, 1); });
    }
    drawOre(0, 80, '#d8af93', '#f2d5c4');
    drawOre(16, 80, '#33ebcb', '#7cffeb');
    drawOre(32, 80, '#1c1c1c', '#383838');
    drawOre(48, 80, '#fced4e', '#fff68f');

    drawSprite(0, 96, toolPalettes.iron, swordSprite);
    drawSprite(16, 96, toolPalettes.iron, ingotSprite);
    drawSprite(32, 96, toolPalettes.diamond, diamondGemSprite);

    ctx.fillStyle = 'rgba(40, 80, 220, 0.85)'; ctx.fillRect(0, 112, 16, 16);
    px(0, 112, 2, 2, 'rgba(255, 255, 255, 0.2)', 12, 1); px(0, 112, 2, 6, 'rgba(255, 255, 255, 0.1)', 8, 1);

    px(0, 128, 6, 6, '#6b4c2a', 4, 10);
    px(0, 128, 6, 4, '#ffdb00', 4, 3);
    px(0, 128, 6, 3, '#ff9000', 4, 1);
    px(0, 128, 7, 2, '#ffdb00', 2, 1);

    ctx.fillStyle = '#8B2020'; ctx.fillRect(16, 128, 16, 16);
    for (let x = 2; x < 16; x += 4) {
        px(16, 128, x, 0, '#5c1515', 2, 16);
        px(16, 128, x - 1, 0, '#a83030', 1, 16);
    }
    px(16, 128, 0, 6, '#ffffff', 16, 5); px(16, 128, 0, 6, '#e0e0e0', 16, 1); px(16, 128, 0, 10, '#c0c0c0', 16, 1);
    ctx.fillStyle = '#000000';
    px(16, 128, 2, 7, '#000', 3, 1); px(16, 128, 3, 8, '#000', 1, 2);
    px(16, 128, 6, 7, '#000', 1, 3); px(16, 128, 7, 8, '#000', 1, 1); px(16, 128, 8, 7, '#000', 1, 3);
    px(16, 128, 11, 7, '#000', 3, 1); px(16, 128, 12, 8, '#000', 1, 2);

    ctx.fillStyle = '#e53b00'; ctx.fillRect(32, 128, 16, 16);
    px(32, 128, 0, 4, '#ff9900', 16, 12);
    px(32, 128, 0, 8, '#ffee00', 16, 8);
    ctx.clearRect(32, 128, 16, 4);
    px(32, 128, 2, 2, '#ff9900', 2, 4); px(32, 128, 3, 4, '#ffee00', 2, 4);
    px(32, 128, 7, 1, '#ff9900', 3, 6); px(32, 128, 8, 3, '#ffee00', 2, 6);
    px(32, 128, 12, 3, '#ff9900', 2, 5);

    ctx.fillStyle = '#9c7b4c'; ctx.fillRect(48, 128, 16, 16);
    px(48, 128, 0, 0, '#382a17', 16, 2); px(48, 128, 0, 14, '#382a17', 16, 2);
    px(48, 128, 0, 0, '#382a17', 2, 16); px(48, 128, 14, 0, '#382a17', 2, 16);
    px(48, 128, 0, 6, '#382a17', 16, 2); px(48, 128, 7, 5, '#a1a1a1', 2, 4);

    // Coffre : dessus (couvercle)
    ctx.fillStyle = '#5e4226'; ctx.fillRect(16, 160, 16, 16);
    px(16, 160, 0, 0, '#382a17', 16, 2); px(16, 160, 0, 14, '#382a17', 16, 2);
    px(16, 160, 0, 0, '#382a17', 2, 16); px(16, 160, 14, 0, '#382a17', 2, 16);
    px(16, 160, 2, 2, '#9c7b4c', 12, 4); px(16, 160, 2, 6, '#b6945c', 12, 2);
    px(16, 160, 2, 9, '#8b6b4b', 12, 4); px(16, 160, 4, 4, '#755433', 2, 8);
    px(16, 160, 10, 4, '#755433', 2, 8); px(16, 160, 7, 5, '#a1a1a1', 2, 4);

    // Coffre : dessous (base)
    ctx.fillStyle = '#5e4226'; ctx.fillRect(48, 160, 16, 16);
    px(48, 160, 0, 0, '#382a17', 16, 2); px(48, 160, 0, 14, '#382a17', 16, 2);
    px(48, 160, 0, 0, '#382a17', 2, 16); px(48, 160, 14, 0, '#382a17', 2, 16);
    px(48, 160, 2, 2, '#9c7b4c', 12, 2); px(48, 160, 2, 5, '#8b6b4b', 4, 2);
    px(48, 160, 8, 5, '#8b6b4b', 4, 2); px(48, 160, 2, 8, '#755433', 12, 2);
    px(48, 160, 2, 11, '#9c7b4c', 12, 2);

    ctx.fillStyle = '#f5f5f5'; ctx.fillRect(0, 160, 16, 16);
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            const n = Math.sin(x * 7.3 + y * 11.1) * 43758.5453; const v = n - Math.floor(n);
            if (v > 0.7) px(0, 160, x, y, '#e8e8e8'); else if (v < 0.2) px(0, 160, x, y, '#d0d0d0');
        }
    }

    drawSprite(0, 144, toolPalettes.wood, stickSprite);
    drawSprite(16, 144, toolPalettes.wood, pickaxeSprite);
    drawSprite(32, 144, toolPalettes.iron, pickaxeSprite);

    ctx.fillStyle = '#8B2020'; ctx.fillRect(48, 144, 16, 16);
    for (let r = 0; r < 16; r += 4) {
        px(48, 144, 0, r, '#5c1515', 16, 2);
        px(48, 144, r, 0, '#5c1515', 2, 16);
    }

    drawSprite(32, 160, toolPalettes.coal, coalItemSprite);

    // Porte en bois (tile [0,12]) : texture plaine
    ctx.fillStyle = '#9c7b4c';
    ctx.fillRect(0, 192, 16, 16);
    px(0, 192, 0, 0, '#5e4226', 16, 2);
    px(0, 192, 0, 14, '#5e4226', 16, 2);
    px(0, 192, 0, 0, '#5e4226', 2, 16);
    px(0, 192, 14, 0, '#5e4226', 2, 16);
    for (let row = 2; row < 14; row += 3) px(0, 192, 2, row, '#b6945c', 12, 1);
    // Trappe en bois (tile [1,12]) : texture plaine
    ctx.fillStyle = '#b6945c';
    ctx.fillRect(16, 192, 16, 16);
    px(16, 192, 0, 0, '#5e4226', 16, 2);
    px(16, 192, 0, 14, '#5e4226', 16, 2);
    px(16, 192, 0, 0, '#5e4226', 2, 16);
    px(16, 192, 14, 0, '#5e4226', 2, 16);
    px(16, 192, 2, 2, '#9c7b4c', 12, 12);

    // Érable : bois (écorce gris-brun, distincte des feuilles orange) [0,13], dessus [1,13], feuilles [2,13]
    ctx.fillStyle = '#5c4e3d';
    ctx.fillRect(0, 208, 16, 16);
    const mapleBark = ['#5c4e3d', '#6b5b4a', '#7a6b5a', '#4a4035'];
    for (let x = 0; x < 16; x++) {
        let col = mapleBark[Math.floor(Math.abs(Math.sin(x * 2.1)) * mapleBark.length) % mapleBark.length];
        px(0, 208, x, 0, col, 1, 16);
        if (x % 4 === 0) px(0, 208, x, (x * 2) % 16, '#3d3528', 1, 2);
    }
    ctx.fillStyle = '#8a7a6a';
    ctx.fillRect(16, 208, 16, 16);
    px(16, 208, 2, 2, '#5c4e3d', 12, 12);
    px(16, 208, 4, 4, '#7a6b5a', 8, 8);
    // Feuilles érable (orange / rouge / jaune)
    ctx.fillStyle = '#c45c20';
    ctx.fillRect(32, 208, 16, 16);
    const mapleLeafColors = ['#e88c30', '#d46820', '#c45c20', '#b85010', '#e0a040', '#a03010'];
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            const n = Math.sin(x * 2.7 + y * 3.1 + 5) * 43758.5453;
            const v = n - Math.floor(n);
            const idx = Math.floor((v + 0.5) * mapleLeafColors.length) % mapleLeafColors.length;
            px(32, 208, x, y, mapleLeafColors[idx]);
        }
    }
    for (let i = 0; i < 20; i++) {
        const nx = Math.sin(i * 4.3) * 43758.5453;
        const vx = (nx - Math.floor(nx) + 1) % 1;
        const ny = Math.sin(i * 6.1 + 7) * 43758.5453;
        const vy = (ny - Math.floor(ny) + 1) % 1;
        const cx = Math.floor(vx * 12) + 2, cy = Math.floor(vy * 12) + 2;
        const r = 1 + Math.floor(Math.sin(i * 2.1) * 43758.5453) % 2;
        for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
            const ax = cx + dx, ay = cy + dy;
            if (ax >= 0 && ax < 16 && ay >= 0 && ay < 16 && (dx*dx + dy*dy <= r*r)) px(32, 208, ax, ay, mapleLeafColors[i % mapleLeafColors.length]);
        }
    }
    // Chêne noir : bois [3,13], dessus [0,14], feuilles sombres [1,14]
    ctx.fillStyle = '#2d1f0f';
    ctx.fillRect(48, 208, 16, 16);
    const darkBark = ['#1a1208', '#2d1f0f', '#3d2a18'];
    for (let x = 0; x < 16; x++) {
        let col = darkBark[Math.floor(Math.abs(Math.sin(x * 1.9)) * darkBark.length) % darkBark.length];
        px(48, 208, x, 0, col, 1, 16);
        if (x % 3 === 0) px(48, 208, x, (x * 5) % 16, '#150d06', 1, 2);
    }
    ctx.fillStyle = '#3d2a18';
    ctx.fillRect(0, 224, 16, 16);
    px(0, 224, 2, 2, '#2d1f0f', 12, 12);
    ctx.fillStyle = '#1e3d0e';
    ctx.fillRect(16, 224, 16, 16);
    const darkLeafColors = ['#0f2a08', '#1e3d0e', '#2d5014', '#1a3510', '#254a12'];
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            const n = Math.sin(x * 3.1 + y * 2.7 + 11) * 43758.5453;
            const v = n - Math.floor(n);
            const idx = Math.floor((v + 0.5) * darkLeafColors.length) % darkLeafColors.length;
            px(16, 224, x, y, darkLeafColors[idx]);
        }
    }
    for (let i = 0; i < 18; i++) {
        const nx = Math.sin(i * 5.7) * 43758.5453;
        const vx = (nx - Math.floor(nx) + 1) % 1;
        const ny = Math.sin(i * 7.1 + 13) * 43758.5453;
        const vy = (ny - Math.floor(ny) + 1) % 1;
        const cx = Math.floor(vx * 12) + 2, cy = Math.floor(vy * 12) + 2;
        const r = 1 + Math.floor(Math.sin(i * 2.5) * 43758.5453) % 2;
        for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
            const ax = cx + dx, ay = cy + dy;
            if (ax >= 0 && ax < 16 && ay >= 0 && ay < 16 && (dx*dx + dy*dy <= r*r)) px(16, 224, ax, ay, darkLeafColors[i % darkLeafColors.length]);
        }
    }

    drawSprite(0, 176, toolPalettes.wood, swordSprite);
    drawSprite(16, 176, toolPalettes.diamond, swordSprite);
    drawSprite(32, 176, toolPalettes.diamond, pickaxeSprite);
    ctx.fillStyle = '#5e4226'; ctx.fillRect(48, 176, 16, 16);
    px(48, 176, 0, 0, '#4a331c', 16, 2);
    px(48, 176, 0, 14, '#4a331c', 16, 2);
    px(48, 176, 0, 0, '#4a331c', 2, 16);
    px(48, 176, 14, 0, '#4a331c', 2, 16);
    px(48, 176, 2, 2, '#8B2020', 6, 5);
    px(48, 176, 2, 3, '#a33', 6, 4);
    px(48, 176, 8, 2, '#9c7b4c', 6, 12);
    px(48, 176, 8, 3, '#b6945c', 6, 4);
    px(48, 176, 8, 8, '#5e4226', 6, 4);

    // Herbe biome bouleau – même logique que grass standard : dessus (noise) + côtés (terre + hauteurs d'herbe par colonne)
    const birchGrassHeights = [4, 5, 4, 3, 5, 6, 4, 3, 4, 5, 6, 4, 3, 5, 4, 4];
    drawNoiseBlock(0, 240, '#8a9c2a', ['#9cab38', '#7d8f22', '#a8b840']);
    drawNoiseBlock(16, 240, '#79553a', ['#8b6b4b', '#68452d']);
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < birchGrassHeights[x]; y++) {
            const color = (y === birchGrassHeights[x] - 1) ? '#7d8f22' : '#8a9c2a';
            px(16, 240, x, y, color);
        }
    }

    let finalCanvas = canvas;
    if (TEXTURE_QUALITY !== 16) {
        finalCanvas = document.createElement('canvas');
        finalCanvas.width = (64 / 16) * TEXTURE_QUALITY;
        finalCanvas.height = (256 / 16) * TEXTURE_QUALITY;
        const fCtx = finalCanvas.getContext('2d');
        fCtx.imageSmoothingEnabled = false;
        fCtx.drawImage(canvas, 0, 0, 64, 256, 0, 0, finalCanvas.width, finalCanvas.height);
    }

    const texture = new THREE.CanvasTexture(finalCanvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    atlasDataUrl = finalCanvas.toDataURL();
    window.atlasDataUrl = atlasDataUrl;
    try { localStorage.setItem('polocraft_atlas_cache', atlasDataUrl); } catch (e) {}

    return texture;
}

        let atlasTexture = generateTextureAtlas();
        window.regenerateAtlas = function() {
            const newTex = generateTextureAtlas();
            atlasTexture = newTex;
            matTexture.map = newTex;
            if (matFancyUniforms && matFancyUniforms.map) matFancyUniforms.map.value = newTex;
            if (chunkMaterial) {
                chunkMaterial.map = newTex;
                if (chunkMaterial.uniforms && chunkMaterial.uniforms.map) chunkMaterial.uniforms.map.value = newTex;
            }
            if (window.chunkMaterialTransparent) window.chunkMaterialTransparent.map = newTex;
            window.blockAtlasTexture = newTex;
            if (typeof chunks !== 'undefined') Object.values(chunks).forEach(function(m) { m.material = chunkMaterial; });
            if (typeof chunkTransparent !== 'undefined') Object.values(chunkTransparent).forEach(function(m) { m.material = window.chunkMaterialTransparent; });
            if (typeof window.saveAtlasesToIndexedDB === 'function') window.saveAtlasesToIndexedDB();
            return window.atlasDataUrl;
        };
        window.updateAtlasFromDataUrl = function(url, done) {
            const img = new Image();
            img.onload = function() {
                const c = document.createElement('canvas');
                c.width = img.width;
                c.height = img.height;
                c.getContext('2d').drawImage(img, 0, 0);
                atlasDataUrl = c.toDataURL();
                window.atlasDataUrl = atlasDataUrl;
                try { localStorage.setItem('polocraft_atlas_cache', atlasDataUrl); } catch (e) {}
                const tex = new THREE.CanvasTexture(c);
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                tex.colorSpace = THREE.SRGBColorSpace;
                atlasTexture = tex;
                matTexture.map = tex;
                if (matFancyUniforms && matFancyUniforms.map) matFancyUniforms.map.value = tex;
if (chunkMaterial) {
                chunkMaterial.map = tex;
                if (chunkMaterial.uniforms && chunkMaterial.uniforms.map) chunkMaterial.uniforms.map.value = tex;
                }
                if (window.chunkMaterialTransparent) window.chunkMaterialTransparent.map = tex;
                window.blockAtlasTexture = tex;
                if (typeof chunks !== 'undefined') Object.values(chunks).forEach(function(m) { m.material = chunkMaterial; });
                if (typeof chunkTransparent !== 'undefined') Object.values(chunkTransparent).forEach(function(m) { m.material = window.chunkMaterialTransparent; });
                if (typeof window.saveAtlasesToIndexedDB === 'function') window.saveAtlasesToIndexedDB();
                if (done) done();
            };
            img.src = url;
        };
        window.getAtlasDataUrl = function() {
            try {
                const cached = localStorage.getItem('polocraft_atlas_cache');
                if (cached) return cached;
            } catch (e) {}
            return window.atlasDataUrl || '';
        };
// Remplace ton ancien "const chunkMaterial = ..." par ceci :
        
        let chunkMaterial; // On le met en let pour pouvoir le modifier

        // 1. Matériau texturé : alphaTest uniquement (pas de blend) pour ne pas voir à travers les blocs
        const matTexture = new THREE.MeshLambertMaterial({ 
            map: atlasTexture, 
            transparent: true, 
            alphaTest: 0.15, 
            depthWrite: true,
            side: THREE.DoubleSide 
        });

        // 2. Le matériau en Fil de fer (Wireframe) - Style "Hacking" ou "Debug"
        const matWireframe = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            wireframe: true 
        });

        // 3. Le matériau "Normal" - Assigne des couleurs en fonction de l'orientation de la face
        const matNormal = new THREE.MeshNormalMaterial();

        // On assigne le matériau par défaut au démarrage
        chunkMaterial = matTexture;
        if (typeof window !== 'undefined') window.chunkMaterial = chunkMaterial;

        // Matériau pour blocs transparents (eau, verre, feu) : depthWrite true pour que les faces s'occluent correctement (évite qu'un côté apparaisse par-dessus selon la direction de vue).
        const chunkMaterialTransparent = new THREE.MeshLambertMaterial({
            map: atlasTexture,
            transparent: true,
            opacity: 0.78,
            alphaTest: 0.08,
            depthWrite: true,
            depthTest: true,
            side: THREE.FrontSide,
            blending: THREE.NormalBlending
        });
        window.chunkMaterialTransparent = chunkMaterialTransparent;

        // 4. Matériau "Élevé" : ombres + feuillage qui bouge + eau réaliste (reflets, ondulations)
        const matFancyUniforms = {
            map: { value: atlasTexture },
            time: { value: 0 },
            lightDir: { value: new THREE.Vector3(-0.5, -0.8, -0.3).normalize() },
            skyColor: { value: new THREE.Color(0x87ceeb) }
        };
        const matFancy = new THREE.ShaderMaterial({
            uniforms: matFancyUniforms,
            vertexShader: `
                attribute float foliage;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying float vFoliage;
                uniform float time;
                void main() {
                    vUv = uv;
                    vNormal = normalMatrix * normal;
                    vec3 pos = position;
                    if (foliage > 0.5) {
                        float wave = sin(time * 1.2 + position.x * 0.5 + position.z * 0.5) * 0.04;
                        pos += normal * wave;
                    }
                    vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
                    vFoliage = foliage;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float time;
                uniform vec3 lightDir;
                uniform vec3 skyColor;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying float vFoliage;
                void main() {
                    vec2 uv = vUv;
                    bool isWater = (vUv.y >= 0.4375 && vUv.y <= 0.5 && vUv.x >= 0.0 && vUv.x <= 0.25);
                    if (isWater) {
                        float ripple = sin(vUv.x * 40.0 + time * 3.0) * sin(vUv.y * 40.0 + time * 2.5) * 0.002;
                        uv += ripple;
                    }
                    vec4 tex = texture2D(map, uv);
                    if (tex.a < 0.1) discard;
                    vec3 n = normalize(vNormal);
                    float diff = max(0.0, dot(n, normalize(lightDir)));
                    vec3 light = vec3(0.65) + vec3(0.35) * diff;
                    vec3 col = tex.rgb * light;
                    if (isWater) {
                        vec3 viewDir = normalize(-vPosition);
                        float fresnel = pow(1.0 - max(0.0, dot(viewDir, n)), 2.5);
                        vec3 waterColor = vec3(0.2, 0.4, 0.9);
                        col = mix(waterColor, skyColor, fresnel * 0.7);
                        col = mix(col, tex.rgb, 0.3);
                        float rippleLight = 0.9 + sin(uv.x * 60.0 + time * 4.0) * sin(uv.y * 60.0 + time * 3.0) * 0.1;
                        col *= rippleLight;
                    }
                    gl_FragColor = vec4(col, max(tex.a, 0.95));
                }
            `,
            transparent: true,
            alphaTest: 0.15,
            depthWrite: true,
            side: THREE.DoubleSide,
            lights: false
        });
        window.getFancyMaterialTime = function() { return matFancyUniforms.time; };
        window.updateFancyMaterialUniforms = function(camera, scene) {
            if (!camera || !scene) return;
            scene.traverse(function(obj) {
                if (obj.isDirectionalLight && obj.position) {
                    const dir = obj.position.clone().normalize();
                    const viewDir = dir.applyMatrix4(camera.matrixWorldInverse);
                    matFancyUniforms.lightDir.value.copy(viewDir);
                }
            });
        };

        window.applyChunkMaterialForQuality = function(quality) {
            const style = document.getElementById('render-style') ? document.getElementById('render-style').value : 'texture';
            let newMat = (style === 'wireframe') ? matWireframe : ((style === 'normal') ? matNormal : ((quality === 'high') ? matFancy : matTexture));
            chunkMaterial = newMat;
            if (typeof chunks !== 'undefined') {
                Object.values(chunks).forEach(mesh => {
                    mesh.material = newMat;
                    if (newMat.uniforms) newMat.uniformsNeedUpdate = true;
                });
            }
        };

                function getTileCoords(type, f) {
            if (type === 'grass') return (f === 2) ? [1, 0] : ((f === 3) ? [0, 0] : [2, 0]);
            if (type === 'grass_birch') return (f === 2) ? [0, 15] : ((f === 3) ? [0, 0] : [1, 15]); 
            if (type === 'dirt') return [0, 0];
            if (type === 'stone') return [3, 0]; 
            if (type === 'wood') return (f === 2 || f === 3) ? [1, 1] : [0, 1];
            if (type === 'birch_wood') return (f === 2 || f === 3) ? [1, 1] : [0, 1];
            if (type === 'maple_wood') return (f === 2 || f === 3) ? [1, 13] : [0, 13];
            if (type === 'dark_wood') return (f === 2 || f === 3) ? [0, 14] : [3, 13];
            if (type === 'leaves') return [2, 1];
            if (type === 'birch_leaves') return [2, 1];
            if (type === 'maple_leaves') return [2, 13];
            if (type === 'dark_leaves') return [1, 14]; 
            if (type === 'planks') return [2, 2];
            if (type === 'wooden_door') return [0, 12];
            if (type === 'wooden_trapdoor') return [1, 12];
            if (type === 'glass') return [3, 2]; 
            if (type === 'cobblestone') return [0, 3];
            if (type === 'crafting_table') return (f === 2) ? [1, 3] : ((f === 3) ? [2, 2] : [2, 3]);
            if (type === 'grass_path') return [3, 3];
            if (type === 'flower_red') return [3, 1]; 
            if (type === 'flower_yellow') return [0, 2];
            if (type === 'tall_grass') return [1, 2]; 
            if (type === 'sand') return [0, 4];
            if (type === 'snow' || type === 'snow_layer') return [1, 4]; 
            if (type === 'cactus') return (f === 2 || f === 3) ? [3, 4] : [2, 4];
            if (type === 'iron_ore') return [0, 5]; 
            if (type === 'diamond_ore') return [1, 5];
            if (type === 'coal_ore') return [2, 5];
            if (type === 'gold_ore') return [3, 5];
            if (type === 'water') return [0, 7];
            if (type === 'torch') return [0, 8];
            if (type === 'tnt') return (f === 2 || f === 3) ? [3, 9] : [1, 8];
            if (type === 'fire') return [2, 8];
            if (type === 'chest') {
                if (f === 2) return [1, 10];
                if (f === 3) return [3, 10];
                return [3, 8];
            }
            if (type === 'bed') return (f === 2) ? [0, 10] : [3, 11];
            if (type === 'wool') return [0, 10];
            if (type === 'stick') return [0, 9];
            if (type === 'wood_pickaxe') return [1, 9];
            if (type === 'iron_pickaxe') return [2, 9];
            if (type === 'diamond_pickaxe') return [2, 11];
            if (type === 'wood_sword') return [0, 11];
            if (type === 'iron_sword') return [0, 6];
            if (type === 'diamond_sword') return [1, 11];
            if (type === 'iron_ingot') return [1, 6];
            if (type === 'diamond') return [2, 6];
            if (type === 'coal') return [2, 10];
            if (type === 'gunpowder') return [2, 10];
            return [0, 0];
        }
        window.getTileCoords = getTileCoords;
        function createMobTexturePixel(base, shade, highlight) {
            const canvas = document.createElement('canvas'); 
            canvas.width = 16; 
            canvas.height = 16; 
            const ctx = canvas.getContext('2d'); 
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = shade;
            for (let i = 0; i < 16; i += 2) for (let j = 0; j < 16; j += 2) {
                if ((i + j) % 4 === 0) ctx.fillRect(i, j, 2, 2);
            }
            ctx.fillStyle = highlight;
            ctx.fillRect(0, 0, 2, 2); ctx.fillRect(14, 0, 2, 2); ctx.fillRect(0, 14, 2, 2);
            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            return tex;
        }

        function createHeadTexturePixel(base, shade, type) {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, 16, 16); 
            ctx.fillStyle = shade;
            ctx.fillRect(2, 2, 4, 4); ctx.fillRect(10, 2, 4, 4); ctx.fillRect(4, 8, 8, 6);
            ctx.fillStyle = '#1a1a1a';
            if (type === 'villager_face' || type === 'zombie_face' || type === 'player_face') {
                ctx.fillRect(4, 5, 2, 2); ctx.fillRect(10, 5, 2, 2);
                ctx.fillRect(6, 8, 4, 2);
            } else if (type === 'creeper_face') {
                ctx.fillRect(3, 4, 2, 3); ctx.fillRect(11, 4, 2, 3);
                ctx.fillRect(5, 8, 6, 2); ctx.fillRect(6, 10, 4, 1);
            } else if (type === 'pig_face') {
                ctx.fillRect(3, 6, 2, 2); ctx.fillRect(11, 6, 2, 2);
                ctx.fillStyle = '#ff9eb0'; ctx.fillRect(5, 7, 6, 4);
            } else if (type === 'cow_face') {
                ctx.fillRect(3, 5, 2, 2); ctx.fillRect(11, 5, 2, 2);
                ctx.fillStyle = '#505050'; ctx.fillRect(6, 8, 4, 3);
            } else if (type === 'chicken_face') {
                ctx.fillRect(2, 6, 2, 2); ctx.fillRect(12, 6, 2, 2);
                ctx.fillStyle = '#ff8800'; ctx.fillRect(6, 9, 4, 2);
            } else if (type === 'goat_face') {
                ctx.fillRect(3, 6, 2, 2); ctx.fillRect(11, 6, 2, 2);
                ctx.fillStyle = shade; ctx.fillRect(5, 10, 6, 3);
            } else if (type === 'sheep_face') {
                ctx.fillRect(3, 6, 2, 2); ctx.fillRect(11, 6, 2, 2);
                ctx.fillStyle = '#2a2a2a'; ctx.fillRect(6, 8, 4, 2);
            }
            const tex = new THREE.CanvasTexture(canvas); 
            tex.magFilter = THREE.NearestFilter; 
            tex.minFilter = THREE.NearestFilter; 
            return tex; 
        }

        function createMobLegTexturePixel(base, shade) {
            const canvas = document.createElement('canvas'); 
            canvas.width = 16; 
            canvas.height = 16; 
            const ctx = canvas.getContext('2d'); 
            ctx.fillStyle = shade;
            ctx.fillRect(0, 0, 16, 16); 
            ctx.fillStyle = base;
            for (let i = 0; i < 16; i += 4) for (let j = 0; j < 16; j += 2) {
                if ((i + j) % 4 === 0) ctx.fillRect(i, j, 2, 2);
            } 
            const tex = new THREE.CanvasTexture(canvas); 
            tex.magFilter = THREE.NearestFilter; 
            tex.minFilter = THREE.NearestFilter; 
            return tex; 
        }
        function createMobArmTexturePixel(base, shade) {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = shade;
            ctx.fillRect(0, 0, 4, 16);
            ctx.fillRect(12, 0, 4, 16);
            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            return tex;
        }

        function createPlayerBodyTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            const blue = '#4a6fa5', blueDark = '#3d5c8a', blueLight = '#5a8fc9', collar = '#6b8cb5';
            ctx.fillStyle = blue;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = blueDark;
            for (let i = 0; i < 16; i += 2) for (let j = 0; j < 16; j += 2) {
                if ((i + j) % 4 === 0) ctx.fillRect(i, j, 2, 2);
            }
            ctx.fillStyle = blueLight;
            ctx.fillRect(0, 0, 2, 2); ctx.fillRect(14, 0, 2, 2); ctx.fillRect(0, 14, 2, 2); ctx.fillRect(14, 14, 2, 2);
            ctx.fillStyle = collar;
            ctx.fillRect(2, 0, 12, 2);
            ctx.fillRect(0, 2, 2, 4); ctx.fillRect(14, 2, 2, 4);
            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            return tex;
        }

        function createPlayerLegTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            const blue = '#4a6fa5', blueDark = '#3d5c8a';
            ctx.fillStyle = blueDark;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = blue;
            for (let i = 0; i < 16; i += 3) for (let j = 0; j < 16; j += 2) {
                if ((i + j) % 3 !== 0) ctx.fillRect(i, j, 2, 2);
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            return tex;
        }

        const mobTextures = { 
            pig: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#F0B0A0', '#E09080', '#FFD0C8') }), 
            cow: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#B8B8B8', '#787878', '#D8D8D8') }), 
            chicken: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#F5F5DC', '#E8E8C8', '#FFF8DC') }), 
            villager: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#8B6914', '#6B4A0A', '#A08020') }), 
            zombie: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#799C65', '#5A7D4A', '#8BA876') }), 
            creeper: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#3D5C1E', '#2D4A14', '#4A7A28') }),
            goat: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#F5F5F0', '#D8D8D0', '#E8E8E0') }),
            sheep: new THREE.MeshLambertMaterial({ map: createMobTexturePixel('#F5F5F0', '#E0E0D8', '#FAFAF5') }),
            player: new THREE.MeshLambertMaterial({ map: createPlayerBodyTexture() })
        };

        const mobFaceTextures = { 
            pig: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#F0B0A0', '#E09080', 'pig_face') }), 
            cow: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#B8B8B8', '#787878', 'cow_face') }), 
            chicken: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#F5F5DC', '#E8D8B0', 'chicken_face') }), 
            villager: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#C4A574', '#A08050', 'villager_face') }), 
            zombie: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#799C65', '#5A7D4A', 'zombie_face') }), 
            creeper: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#3D5C1E', '#2D4A14', 'creeper_face') }),
            goat: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#F5F5F0', '#D8D8D0', 'goat_face') }),
            sheep: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#F5F5F0', '#E0E0D8', 'sheep_face') }),
            player: new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#C4A574', '#A08050', 'player_face') })
        };
        window.mobTextures = mobTextures;
        window.mobFaceTextures = mobFaceTextures;
        const mobLegTextures = {};
        const mobArmTextures = {};
        (function() {
            const types = ['pig', 'cow', 'chicken', 'villager', 'zombie', 'creeper', 'goat', 'sheep', 'player'];
            const bodyArgs = { pig: ['#D09070', '#A07050'], cow: ['#909090', '#606060'], chicken: ['#E8D8A0', '#C8B880'], villager: ['#5c4a32', '#3d3528'], zombie: ['#5A6D4A', '#3d4a35'], creeper: ['#2D4A14', '#1a3010'], goat: ['#C8B8A0', '#A09080'], sheep: ['#F5F5F0', '#E0E0D8'] };
            const armArgs = { villager: ['#9B7B4A', '#6B5A3A'], zombie: ['#6A8C5A', '#4A6D40'], player: ['#C4A574', '#A08050'] };
            types.forEach(function(type) {
                if (type === 'player') {
                    mobLegTextures[type] = new THREE.MeshLambertMaterial({ map: createPlayerLegTexture() });
                    mobArmTextures[type] = new THREE.MeshLambertMaterial({ map: createMobArmTexturePixel('#C4A574', '#A08050') });
                } else {
                    var a = bodyArgs[type];
                    if (a) mobLegTextures[type] = new THREE.MeshLambertMaterial({ map: createMobLegTexturePixel(a[0], a[1]) });
                    a = armArgs[type];
                    if (a) mobArmTextures[type] = new THREE.MeshLambertMaterial({ map: createMobArmTexturePixel(a[0], a[1]) });
                }
            });
        })();
        window.mobLegTextures = mobLegTextures;
        window.mobArmTextures = mobArmTextures;
        const uiIcons = {
            'grass': [-50, 0], 'dirt': [0, 0], 'stone': [-150, 0], 'wood': [0, -50],
            'leaves': [-100, -50], 'flower_red': [-150, -50], 'flower_yellow': [0, -100],
            'tall_grass': [-50, -100], 'planks': [-100, -100], 'glass': [-150, -100],
            'cobblestone': [0, -150], 'crafting_table': [-100, -150], 'stick': [0, -450],
            'sand': [0, -200], 'snow': [-50, -200], 'cactus': [-100, -200],
            'iron_ore': [0, -250], 'diamond_ore': [-50, -250], 'coal_ore': [-100, -250], 'gold_ore': [-150, -250],
            'wood_pickaxe': [-50, -450], 'iron_pickaxe': [-100, -450], 'diamond_pickaxe': [-100, -550],
            'wood_sword': [0, -550], 'iron_sword': [0, -300], 'diamond_sword': [-50, -550],
            'iron_ingot': [-50, -300], 'diamond': [-100, -300], 'coal': [-100, -500], 'gunpowder': [-100, -350], 'water': [0, -350],
            'torch': [0, -400], 'tnt': [-50, -400], 'chest': [-150, -400], 'fire': [-100, -400], 'bed': [-150, -550], 'boat': [-100, -100], 'wool': [0, -500]
        };
        function getStyleForIcon(type) {
            if (uiIcons[type]) return `background-image: url(${atlasDataUrl}); background-size: 200px 800px; background-repeat: no-repeat; background-position: ${uiIcons[type][0]}px ${uiIcons[type][1]}px;`;
            if (typeof window.getTileCoords === 'function') {
                var t = window.getTileCoords(type, 0);
                if (t && t.length >= 2) return `background-image: url(${atlasDataUrl}); background-size: 200px 800px; background-repeat: no-repeat; background-position: ${-t[0] * 50}px ${-t[1] * 50}px;`;
            }
            return "background: #664422;";
        }
        window.BLOCK_DISPLAY_NAMES = {
            grass: 'Herbe', dirt: 'Terre', grass_path: 'Chemin', stone: 'Pierre', wood: 'Bois', leaves: 'Feuilles', flower_red: 'Tulipe rouge', flower_yellow: 'Tulipe jaune', tall_grass: 'Herbe haute', planks: 'Planches', glass: 'Verre', cobblestone: 'Pierre taillée', crafting_table: 'Table de craft', stick: 'Bâton', sand: 'Sable', snow: 'Neige', cactus: 'Cactus', iron_ore: 'Minerai de fer', diamond_ore: 'Minerai de diamant', coal_ore: 'Minerai de charbon', gold_ore: 'Minerai d\'or', wood_pickaxe: 'Pioche en bois', iron_pickaxe: 'Pioche en fer', diamond_pickaxe: 'Pioche en diamant', wood_sword: 'Épée en bois', iron_sword: 'Épée en fer', diamond_sword: 'Épée en diamant', iron_ingot: 'Lingot de fer', diamond: 'Diamant', coal: 'Charbon', gunpowder: 'Poudre à canon', torch: 'Torche', tnt: 'TNT', chest: 'Coffre', bed: 'Lit', boat: 'Bateau', water: 'Eau', fire: 'Feu', wool: 'Laine', wooden_door: 'Porte en bois', wooden_trapdoor: 'Trappe en bois', birch_wood: 'Bois de bouleau', birch_leaves: 'Feuilles de bouleau', grass_birch: 'Herbe (bouleau)', maple_wood: 'Bois d\'érable', maple_leaves: 'Feuilles d\'érable', dark_wood: 'Bois de chêne noir', dark_leaves: 'Feuilles de chêne noir'
        };
        window.TOOL_DURABILITY = { wood_pickaxe: 60, iron_pickaxe: 250, diamond_pickaxe: 1561, wood_sword: 60, iron_sword: 250, diamond_sword: 1561 };
        window.CREATIVE_CATEGORIES = {
            'Construction': ['dirt', 'stone', 'cobblestone', 'planks', 'sand', 'snow', 'glass', 'wool', 'wooden_door', 'wooden_trapdoor'],
            'Nature': ['grass', 'grass_birch', 'wood', 'leaves', 'birch_wood', 'birch_leaves', 'maple_wood', 'maple_leaves', 'dark_wood', 'dark_leaves', 'flower_red', 'flower_yellow', 'tall_grass', 'cactus'],
            'Combat': ['wood_pickaxe', 'iron_pickaxe', 'diamond_pickaxe', 'wood_sword', 'iron_sword', 'diamond_sword', 'stick'],
            'Autre': ['coal_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'coal', 'iron_ingot', 'diamond', 'crafting_table', 'chest', 'torch', 'tnt', 'gunpowder', 'bed', 'boat', 'water', 'fire', 'wool']
        };
        window.CREATIVE_TAB_ORDER = ['Construction', 'Nature', 'Combat', 'Autre'];

        const MOB_ATLAS_COLS = 4;
        const MOB_TYPES = ['pig', 'cow', 'chicken', 'villager', 'zombie', 'creeper', 'goat', 'sheep', 'player'];
        const MOB_ATLAS_CELLS_PER_MOB = 4; // body, face, legs, arms
        const MOB_ATLAS_SIZE = 16;
        const MOB_ATLAS_CACHE_KEY = 'polocraft_mobs_atlas_cache';

        function drawMobAtlasToCanvas(ctx, cols, size, bodyMatFn, faceMatFn, legMatFn, armMatFn) {
            const totalCells = MOB_TYPES.length * MOB_ATLAS_CELLS_PER_MOB;
            const rows = Math.ceil(totalCells / cols);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, cols * size, rows * size);
            MOB_TYPES.forEach(function(type, i) {
                for (let c = 0; c < MOB_ATLAS_CELLS_PER_MOB; c++) {
                    const cellIndex = i * MOB_ATLAS_CELLS_PER_MOB + c;
                    const x = (cellIndex % cols) * size, y = Math.floor(cellIndex / cols) * size;
                    let mat = null;
                    if (c === 0) mat = bodyMatFn(type);
                    else if (c === 1) mat = faceMatFn(type);
                    else if (c === 2) mat = legMatFn ? legMatFn(type) : null;
                    else if (c === 3) mat = armMatFn ? armMatFn(type) : bodyMatFn(type);
                    if (mat && mat.map && mat.map.image) ctx.drawImage(mat.map.image, x, y, size, size);
                }
            });
        }

        window.getMobAtlasDataUrl = function() {
            const size = MOB_ATLAS_SIZE;
            const cols = MOB_ATLAS_COLS;
            const totalCells = MOB_TYPES.length * MOB_ATLAS_CELLS_PER_MOB;
            const canvas = document.createElement('canvas');
            canvas.width = cols * size;
            canvas.height = Math.ceil(totalCells / cols) * size;
            const ctx = canvas.getContext('2d');
            function legMat(t) { return window.mobLegTextures && window.mobLegTextures[t] ? window.mobLegTextures[t] : null; }
            function armMat(t) { return window.mobArmTextures && window.mobArmTextures[t] ? window.mobArmTextures[t] : null; }
            drawMobAtlasToCanvas(ctx, cols, size, function(t) { return mobTextures[t]; }, function(t) { return mobFaceTextures[t]; }, legMat, armMat);
            return canvas.toDataURL();
        };

        /** Applique une image d'atlas mobs (data URL) : 4 cellules par mob = body, face, legs, arms. */
        window.updateMobAtlasFromDataUrl = function(url, done) {
            const img = new Image();
            img.onload = function() {
                const cols = MOB_ATLAS_COLS;
                const size = MOB_ATLAS_SIZE;
                const totalCells = MOB_TYPES.length * MOB_ATLAS_CELLS_PER_MOB;
                const w = cols * size;
                const h = Math.ceil(totalCells / cols) * size;
                if (img.width < w || img.height < h) { if (done) done(); return; }
                function applyCell(cellIndex, mat) {
                    if (!mat || !mat.map) return;
                    const x = (cellIndex % cols) * size;
                    const y = Math.floor(cellIndex / cols) * size;
                    const crop = document.createElement('canvas');
                    crop.width = size;
                    crop.height = size;
                    const cropCtx = crop.getContext('2d');
                    cropCtx.drawImage(img, x, y, size, size, 0, 0, size, size);
                    const tex = new THREE.CanvasTexture(crop);
                    tex.magFilter = THREE.NearestFilter;
                    tex.minFilter = THREE.NearestFilter;
                    mat.map = tex;
                }
                MOB_TYPES.forEach(function(type, i) {
                    const base = i * MOB_ATLAS_CELLS_PER_MOB;
                    applyCell(base + 0, mobTextures[type]);
                    applyCell(base + 1, mobFaceTextures[type]);
                    if (mobLegTextures[type]) applyCell(base + 2, mobLegTextures[type]);
                    if (mobArmTextures[type]) applyCell(base + 3, mobArmTextures[type]);
                });
                try { localStorage.setItem(MOB_ATLAS_CACHE_KEY, url); } catch (e) {}
                if (typeof window.saveAtlasesToIndexedDB === 'function') window.saveAtlasesToIndexedDB();
                if (done) done();
            };
            img.onerror = function() { if (done) done(); };
            img.src = url;
        };

        /** Régénère l'atlas mobs par défaut (body, face, legs, arms) et l'applique. */
        window.regenerateMobAtlas = function() {
            const size = MOB_ATLAS_SIZE;
            const cols = MOB_ATLAS_COLS;
            const bodyArgs = { pig: ['#F0B0A0', '#E09080', '#FFD0C8'], cow: ['#B8B8B8', '#787878', '#D8D8D8'], chicken: ['#F5F5DC', '#E8E8C8', '#FFF8DC'], villager: ['#8B6914', '#6B4A0A', '#A08020'], zombie: ['#799C65', '#5A7D4A', '#8BA876'], creeper: ['#3D5C1E', '#2D4A14', '#4A7A28'], goat: ['#F5F5F0', '#D8D8D0', '#E8E8E0'], sheep: ['#F5F5F0', '#E0E0D8', '#FAFAF5'] };
            const faceArgs = { pig: ['#F0B0A0', '#E09080', 'pig_face'], cow: ['#B8B8B8', '#787878', 'cow_face'], chicken: ['#F5F5DC', '#E8D8B0', 'chicken_face'], villager: ['#C4A574', '#A08050', 'villager_face'], zombie: ['#799C65', '#5A7D4A', 'zombie_face'], creeper: ['#3D5C1E', '#2D4A14', 'creeper_face'], goat: ['#F5F5F0', '#D8D8D0', 'goat_face'], sheep: ['#F5F5F0', '#E0E0D8', 'sheep_face'], player: ['#C4A574', '#A08050', 'player_face'] };
            const legArgs = { pig: ['#D09070', '#A07050'], cow: ['#909090', '#606060'], chicken: ['#E8D8A0', '#C8B880'], villager: ['#5c4a32', '#3d3528'], zombie: ['#5A6D4A', '#3d4a35'], creeper: ['#2D4A14', '#1a3010'], goat: ['#C8B8A0', '#A09080'], sheep: ['#F5F5F0', '#E0E0D8'], player: ['#4a6fa5', '#3d5c8a'] };
            const armArgs = { villager: ['#9B7B4A', '#6B5A3A'], zombie: ['#6A8C5A', '#4A6D40'], player: ['#C4A574', '#A08050'] };
            var tempBody = {}, tempFace = {}, tempLeg = {}, tempArm = {};
            MOB_TYPES.forEach(function(t) {
                if (t === 'player') {
                    tempBody[t] = new THREE.MeshLambertMaterial({ map: createPlayerBodyTexture() });
                    tempFace[t] = new THREE.MeshLambertMaterial({ map: createHeadTexturePixel('#C4A574', '#A08050', 'player_face') });
                    tempLeg[t] = new THREE.MeshLambertMaterial({ map: createPlayerLegTexture() });
                    tempArm[t] = new THREE.MeshLambertMaterial({ map: createMobArmTexturePixel('#C4A574', '#A08050') });
                } else {
                    var a = bodyArgs[t]; tempBody[t] = a ? new THREE.MeshLambertMaterial({ map: createMobTexturePixel(a[0], a[1], a[2]) }) : tempBody[t];
                    a = faceArgs[t]; tempFace[t] = a ? new THREE.MeshLambertMaterial({ map: createHeadTexturePixel(a[0], a[1], a[2]) }) : tempFace[t];
                    a = legArgs[t]; tempLeg[t] = a ? new THREE.MeshLambertMaterial({ map: createMobLegTexturePixel(a[0], a[1]) }) : tempLeg[t];
                    tempArm[t] = armArgs[t] ? new THREE.MeshLambertMaterial({ map: createMobArmTexturePixel(armArgs[t][0], armArgs[t][1]) }) : tempBody[t];
                }
            });
            const totalCells = MOB_TYPES.length * MOB_ATLAS_CELLS_PER_MOB;
            const canvas = document.createElement('canvas');
            canvas.width = cols * size;
            canvas.height = Math.ceil(totalCells / cols) * size;
            const ctx = canvas.getContext('2d');
            drawMobAtlasToCanvas(ctx, cols, size, function(t) { return tempBody[t]; }, function(t) { return tempFace[t]; }, function(t) { return tempLeg[t]; }, function(t) { return tempArm[t]; });
            MOB_TYPES.forEach(function(t) {
                [tempBody[t], tempFace[t], tempLeg[t]].forEach(function(m) { if (m && m.map) m.map.dispose(); if (m) m.dispose(); });
                if (tempArm[t] !== tempBody[t] && tempArm[t].map) tempArm[t].map.dispose(); if (tempArm[t] !== tempBody[t]) tempArm[t].dispose();
            });
            const url = canvas.toDataURL();
            try { localStorage.setItem(MOB_ATLAS_CACHE_KEY, url); } catch (e) {}
            window.updateMobAtlasFromDataUrl(url, function() {
                if (typeof window.saveAtlasesToIndexedDB === 'function') window.saveAtlasesToIndexedDB();
            });
        };

        try {
            var mobCached = localStorage.getItem(MOB_ATLAS_CACHE_KEY);
            if (mobCached) window.updateMobAtlasFromDataUrl(mobCached);
        } catch (e) {}

       const faceMatrices = [ 
            new THREE.Matrix4().makeRotationY(Math.PI / 2), 
            new THREE.Matrix4().makeRotationY(-Math.PI / 2), 
            new THREE.Matrix4().makeRotationX(-Math.PI / 2), 
            new THREE.Matrix4().makeRotationX(Math.PI / 2), 
            new THREE.Matrix4().makeRotationY(0), 
            new THREE.Matrix4().makeRotationY(Math.PI) 
        ];
        
        const faceNormals = [ 
            new THREE.Vector3(1,0,0), 
            new THREE.Vector3(-1,0,0), 
            new THREE.Vector3(0,1,0), 
            new THREE.Vector3(0,-1,0), 
            new THREE.Vector3(0,0,1), 
            new THREE.Vector3(0,0,-1) 
        ];
        if (typeof window !== 'undefined') { window.faceNormals = faceNormals; }
        
        const baseVertices = [ 
            new THREE.Vector3(-0.5,0.5,0.5), 
            new THREE.Vector3(-0.5,-0.5,0.5), 
            new THREE.Vector3(0.5,-0.5,0.5), 
            new THREE.Vector3(0.5,0.5,0.5) 
        ];
                const faceVertices = faceMatrices.map(matrix => baseVertices.map(v => v.clone().applyMatrix4(matrix)));
        if (typeof window !== 'undefined') { window.faceVertices = faceVertices; }
     function isFlora(type) {
            if (typeof window.BLOCK_REGISTRY !== 'undefined' && window.BLOCK_REGISTRY.isFlora(type)) return true;
            return floraTypes.includes(type);
        }
        window.isFlora = isFlora;
        function isTransparent(type) {
            if (typeof window.BLOCK_REGISTRY !== 'undefined' && window.BLOCK_REGISTRY.isTransparent(type)) return true;
            return transparentTypes.includes(type);
        }

        function getTileCoords(type, f) {
            if (type === 'grass') return (f === 2) ? [1, 0] : ((f === 3) ? [0, 0] : [2, 0]);
            if (type === 'grass_birch') return (f === 2) ? [0, 15] : ((f === 3) ? [0, 0] : [1, 15]); 
            if (type === 'dirt') return [0, 0];
            if (type === 'stone') return [3, 0]; 
            if (type === 'wood') return (f === 2 || f === 3) ? [1, 1] : [0, 1];
            if (type === 'birch_wood') return (f === 2 || f === 3) ? [1, 1] : [0, 1];
            if (type === 'maple_wood') return (f === 2 || f === 3) ? [1, 13] : [0, 13];
            if (type === 'dark_wood') return (f === 2 || f === 3) ? [0, 14] : [3, 13];
            if (type === 'leaves') return [2, 1];
            if (type === 'birch_leaves') return [2, 1];
            if (type === 'maple_leaves') return [2, 13];
            if (type === 'dark_leaves') return [1, 14]; 
            if (type === 'planks') return [2, 2];
            if (type === 'wooden_door') return [0, 12];
            if (type === 'wooden_trapdoor') return [1, 12];
            if (type === 'glass') return [3, 2]; 
            if (type === 'cobblestone') return [0, 3];
            if (type === 'crafting_table') return (f === 2) ? [1, 3] : ((f === 3) ? [2, 2] : [2, 3]);
            if (type === 'grass_path') return [3, 3];
            if (type === 'flower_red') return [3, 1]; 
            if (type === 'flower_yellow') return [0, 2];
            if (type === 'tall_grass') return [1, 2]; 
            if (type === 'sand') return [0, 4];
            if (type === 'snow' || type === 'snow_layer') return [1, 4]; 
            if (type === 'cactus') return (f === 2 || f === 3) ? [3, 4] : [2, 4];
            if (type === 'iron_ore') return [0, 5]; 
            if (type === 'diamond_ore') return [1, 5];
            if (type === 'coal_ore') return [2, 5];
            if (type === 'gold_ore') return [3, 5];
            if (type === 'water') return [0, 7];
            if (type === 'torch') return [0, 8];
            if (type === 'tnt') return (f === 2 || f === 3) ? [3, 9] : [1, 8];
            if (type === 'fire') return [2, 8];
            if (type === 'chest') {
                if (f === 2) return [1, 10];
                if (f === 3) return [3, 10];
                return [3, 8];
            }
            if (type === 'bed') return (f === 2) ? [0, 10] : [2, 2];
            if (type === 'wool') return [0, 10];
            if (type === 'iron_ingot') return [1, 6];
            if (type === 'diamond') return [2, 6];
            if (type === 'coal') return [2, 10];
            if (type === 'gunpowder') return [2, 10];
            return [0, 0];
        }

        window.blockAtlasTexture = atlasTexture;
        function createCrackOverlayTexture() {
            const c = document.createElement('canvas');
            c.width = 64;
            c.height = 64;
            const ctx = c.getContext('2d');
            ctx.clearRect(0, 0, 64, 64);
            ctx.strokeStyle = 'rgba(0,0,0,0.85)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'square';
            ctx.beginPath();
            ctx.moveTo(4, 4); ctx.lineTo(32, 28); ctx.lineTo(60, 8);
            ctx.moveTo(8, 60); ctx.lineTo(30, 35); ctx.lineTo(55, 55);
            ctx.moveTo(50, 12); ctx.lineTo(35, 40); ctx.lineTo(15, 25);
            ctx.moveTo(20, 50); ctx.lineTo(40, 20); ctx.lineTo(58, 45);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(10, 15); ctx.lineTo(45, 50);
            ctx.moveTo(25, 55); ctx.lineTo(55, 25);
            ctx.stroke();
            const tex = new THREE.CanvasTexture(c);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            return tex;
        }
        window.crackOverlayTexture = createCrackOverlayTexture();
        /** Géométrie de prévisualisation unique : main, objet au sol, fissure. Gère cube (avec textures par face), croix (flore, feu), transparents. */
        function createBlockPreviewGeometry(blockType, scale) {
            if (scale == null) scale = 1;
            var pos = [], norm = [], uv = [], ind = [];
            var vCount = 0;
            var isCross = isFlora(blockType) || blockType === 'fire';
            if (isCross) {
                var tile = getTileCoords(blockType, 0);
                var tx = (tile[0] != null) ? tile[0] : 0, ty = (tile[1] != null) ? tile[1] : 0;
                var u_min = tx * 0.25, u_max = u_min + 0.25;
                var v_max = 1.0 - (ty * 0.0625), v_min = v_max - 0.0625;
                var crossVerts = [
                    [-0.48, 0.48, -0.48], [-0.48, -0.48, -0.48], [0.48, -0.48, 0.48], [0.48, 0.48, 0.48],
                    [0.48, 0.48, -0.48], [0.48, -0.48, -0.48], [-0.48, -0.48, 0.48], [-0.48, 0.48, 0.48]
                ];
                var quadUVs = [[u_min, v_max], [u_min, v_min], [u_max, v_min], [u_max, v_max]];
                for (var p = 0; p < 2; p++) {
                    for (var c = 0; c < 4; c++) {
                        var v = crossVerts[p * 4 + c];
                        pos.push(v[0] * scale, v[1] * scale, v[2] * scale);
                        norm.push(0, 1, 0);
                        uv.push(quadUVs[c][0], quadUVs[c][1]);
                    }
                    ind.push(vCount, vCount + 1, vCount + 2, vCount, vCount + 2, vCount + 3);
                    vCount += 4;
                }
            } else {
                for (var f = 0; f < 6; f++) {
                    var ft = getTileCoords(blockType, f);
                    var u_min = ft[0] * 0.25, u_max = u_min + 0.25;
                    var v_max = 1.0 - (ft[1] * 0.0625), v_min = v_max - 0.0625;
                    var faceUVs = [[u_min, v_max], [u_min, v_min], [u_max, v_min], [u_max, v_max]];
                    var normal = faceNormals[f];
                    for (var c = 0; c < 4; c++) {
                        var v = faceVertices[f][c];
                        pos.push(v.x * scale, v.y * scale, v.z * scale);
                        norm.push(normal.x, normal.y, normal.z);
                        uv.push(faceUVs[c][0], faceUVs[c][1]);
                    }
                    ind.push(vCount, vCount + 1, vCount + 2, vCount, vCount + 2, vCount + 3);
                    vCount += 4;
                }
            }
            var geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            geom.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
            geom.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
            geom.setIndex(ind);
            return geom;
        }
        window.createBlockPreviewGeometry = createBlockPreviewGeometry;
        window.createBreakingBlockGeometry = function(blockType) {
            return createBlockPreviewGeometry(blockType, 1.02);
        };

        const renderStyleSelect = document.getElementById('render-style');
        
        if (renderStyleSelect) renderStyleSelect.addEventListener('change', (e) => {
            const style = e.target.value;
            const quality = document.getElementById('shader-quality') ? document.getElementById('shader-quality').value : 'medium';
            let newMaterial;
            if (style === 'wireframe') newMaterial = matWireframe;
            else if (style === 'normal') newMaterial = matNormal;
            else newMaterial = (quality === 'high') ? matFancy : matTexture;
            chunkMaterial = newMaterial;
            if (typeof window !== 'undefined') window.chunkMaterial = chunkMaterial;
            if (typeof chunks !== 'undefined') {
            Object.values(chunks).forEach(mesh => {
                mesh.material = newMaterial;
                    if (newMaterial.uniforms) newMaterial.uniformsNeedUpdate = true;
            });
            }
        });

        // Pas de chargement auto du cache : l'atlas généré en code garantit que les textures correspondent aux blocs en jeu.
        // L'utilisateur peut importer une image depuis le menu Textures s'il le souhaite.