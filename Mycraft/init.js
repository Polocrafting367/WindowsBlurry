 const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // Activer les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Utiliser des ombres douces
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Ajouter une lumière ambiante qui éclaire uniformément toute la scène
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // Lumière blanche douce
scene.add(ambientLight);

// Ajouter une lumière directionnelle pour générer des ombres aux intersections
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 80, 30);
directionalLight.castShadow = true;  // Permettre à la lumière de projeter des ombres
scene.add(directionalLight);

// Configurer la caméra de la lumière pour les ombres douces
directionalLight.shadow.mapSize.width = 0;
directionalLight.shadow.mapSize.height = 0;
directionalLight.shadow.camera.near = 0;
directionalLight.shadow.camera.far = 0;

// Limiter la zone d'ombre à une petite région autour des cubes
directionalLight.shadow.camera.left = -0;
directionalLight.shadow.camera.right = 0;
directionalLight.shadow.camera.top = 0;
directionalLight.shadow.camera.bottom = -0;

let fpsCounter = 0;
let lastTime = performance.now();
// Créer la scène, la caméra et le moteur de rendu
const camera = new THREE.PerspectiveCamera(anglecam, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


document.getElementById("anglecamValue").innerText = anglecam;  // Affichage de l'angle actuel

// Fonction pour mettre à jour l'angle de la caméra via l'input utilisateur
anglecamInput.addEventListener("input", function() {
    anglecam = parseInt(this.value);  // Récupérer la nouvelle valeur
    camera.fov = anglecam;  // Mettre à jour l'angle de la caméra
    camera.updateProjectionMatrix();  // Mettre à jour la matrice de projection
    document.getElementById("anglecamValue").innerText = anglecam;  // Mettre à jour l'affichage de l'angle
});
// Initialiser les contrôles pour verrouiller le pointeur
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());



// Variables de mouvement
var moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
var moveUp = false, moveDown = false;  // Nouvelles variables pour le déplacement vertical
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();




// Positionner la caméra légèrement au-dessus du sol
camera.position.y = 1.8;


// Fonction d'animation
let prevTime = performance.now();