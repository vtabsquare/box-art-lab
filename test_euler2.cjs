const THREE = require('three');
const v = new THREE.Vector3(0, 1, 0);
v.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.197);
v.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/2);
console.log("Right Panel Top with applyAxisAngle:", v.x.toFixed(3), v.y.toFixed(3), v.z.toFixed(3));
