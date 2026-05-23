// Créer le contrôle du joueur à la première personne (PointerLockControls)
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Variables de mouvement
var moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
var moveUp = false, moveDown = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
