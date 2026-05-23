// Ajouter une lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Ajouter une lumière directionnelle pour les ombres
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 80, 30);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Configurer les ombres de la lumière directionnelle
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
