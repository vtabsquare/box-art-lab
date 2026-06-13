const THREE = require('three');
const e = new THREE.Euler(0.197, Math.PI/2, 0, 'XYZ');
const v = new THREE.Vector3(0, 1, 0);
v.applyEuler(e);
console.log("Right Panel Top:", v.x.toFixed(3), v.y.toFixed(3), v.z.toFixed(3));
