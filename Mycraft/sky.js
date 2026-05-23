// Shader pour le ciel
const vertexShader = `...`;
const fragmentShader = `...`;

// Définir les couleurs et les paramètres du ciel
const uniforms = {
  topColor: { value: new THREE.Color(0x87CEEB) },
  bottomColor: { value: new THREE.Color(0x1E90FF) },
  offset: { value: 33 },
  exponent: { value: 0.6 }
};

// Créer la géométrie et le matériau pour le ciel
const skyGeo = new THREE.SphereGeometry(500, 32, 15);
const skyMat = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: uniforms,
  side: THREE.BackSide
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);
