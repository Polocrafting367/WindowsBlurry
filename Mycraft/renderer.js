const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // Activer les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Ombres douces
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Créer la caméra
const camera = new THREE.PerspectiveCamera(anglecam, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.8;  // Positionner la caméra légèrement au-dessus du sol

// Fonction pour redimensionner la scène quand la fenêtre change de taille
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
