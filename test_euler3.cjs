const THREE = require('three');
const e = new THREE.Euler(0.197, Math.PI/2, 0, 'YXZ');
const v = new THREE.Vector3(0, 1, 0);
v.applyEuler(e);
console.log("Right Panel Top with YXZ:", v.x.toFixed(3), v.y.toFixed(3), v.z.toFixed(3));
