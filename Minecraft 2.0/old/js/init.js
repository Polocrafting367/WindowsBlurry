  // ==========================================
        // INITIALISATION THREE.JS
        // ==========================================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        window.gameTime = 0;
        window.isNight = function() { const t = (window.gameTime || 0) % 24000; return t >= 13000 && t < 23000; };

        let fovValue = 75;
        const camera = new THREE.PerspectiveCamera(fovValue, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = false;
        document.body.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(20, 40, 20);
        scene.add(dirLight);
        window.updateDayNight = function(time, playerX, playerZ) {
            const t = (time || 0) % 24000;
            const p = t / 24000;
            const angle = p * Math.PI * 2 - Math.PI / 2;
            scene.traverse(function(o) {
                if (o.isDirectionalLight) {
                    o.position.set(50 * Math.cos(angle), 30 + 20 * Math.sin(angle), 50 * Math.sin(angle));
                }
            });
            const dayR = 0.53, dayG = 0.81, dayB = 0.92;
            const nightR = 0.02, nightG = 0.02, nightB = 0.08;
            const blend = 0.5 + 0.5 * Math.cos((t / 24000) * Math.PI * 2);
            const smooth = blend * blend * (3 - 2 * blend);
            let r = dayR * smooth + nightR * (1 - smooth);
            let g = dayG * smooth + nightG * (1 - smooth);
            let b = dayB * smooth + nightB * (1 - smooth);
            if (typeof playerX === 'number' && typeof playerZ === 'number' && typeof window.getBiomeAt === 'function') {
                const biome = window.getBiomeAt(playerX, playerZ);
                if (biome === 'desert') {
                    r = r * 0.85 + 0.25 * smooth; g = g * 0.75 + 0.2 * smooth; b = b * 0.4;
                } else if (biome === 'mountains') {
                    const w = 0.25 + 0.2 * smooth;
                    r = r + w; g = g + w; b = b + w;
                }
            }
            scene.background.setRGB(Math.min(1, r), Math.min(1, g), Math.min(1, b));
            if (scene.fog) scene.fog.color.copy(scene.background);
            scene.traverse(function(o) {
                if (o.isDirectionalLight) {
                    o.intensity = 0.3 + 0.45 * smooth;
                }
                if (o.isAmbientLight) {
                    o.intensity = 0.4 + 0.35 * smooth;
                }
            });
        };

        // Qualité graphique : Off = rien, Faible = basique, Normal = ombres soleil, Élevé = ombres + feuillage animé + eau réaliste
        window.applyShaderQuality = function(quality) {
            function setupShadows(enable, size) {
                renderer.shadowMap.enabled = enable;
                dirLight.castShadow = enable;
                if (enable) {
                    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    dirLight.shadow.mapSize.width = size;
                    dirLight.shadow.mapSize.height = size;
                    dirLight.shadow.camera.near = 1;
                    dirLight.shadow.camera.far = 150;
                    dirLight.shadow.camera.left = -40;
                    dirLight.shadow.camera.right = 40;
                    dirLight.shadow.camera.top = 40;
                    dirLight.shadow.camera.bottom = -40;
                    dirLight.shadow.bias = -0.0001;
                }
            }
            if (quality === 'off') {
                renderer.setPixelRatio(1);
                renderer.antialias = false;
                setupShadows(false);
                dirLight.intensity = 0.6;
                ambientLight.intensity = 0.7;
            } else if (quality === 'low') {
                renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
                renderer.antialias = false;
                setupShadows(false);
                dirLight.intensity = 0.55;
                ambientLight.intensity = 0.75;
            } else if (quality === 'medium') {
                renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
                renderer.antialias = true;
                setupShadows(true, 1024);
                dirLight.intensity = 0.65;
                ambientLight.intensity = 0.65;
            } else if (quality === 'high') {
                renderer.setPixelRatio(window.devicePixelRatio || 2);
                renderer.antialias = true;
                setupShadows(true, 1024);
                dirLight.intensity = 0.7;
                ambientLight.intensity = 0.6;
            }
            if (typeof window.applyChunkMaterialForQuality === 'function') {
                window.applyChunkMaterialForQuality(quality);
            }
            if (renderer.domElement && renderer.domElement.width) renderer.setSize(renderer.domElement.width, renderer.domElement.height);
        };


