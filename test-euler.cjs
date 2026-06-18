const THREE = require('three');
const euler = new THREE.Euler(-Math.PI/2, 0, -Math.PI/2, 'XYZ');
const vZ = new THREE.Vector3(0, 0, 1).applyEuler(euler);
const vY = new THREE.Vector3(0, 1, 0).applyEuler(euler);
const vX = new THREE.Vector3(1, 0, 0).applyEuler(euler);
console.log('Local Z:', vZ.x, vZ.y, vZ.z);
console.log('Local Y:', vY.x, vY.y, vY.z);
console.log('Local X:', vX.x, vX.y, vX.z);
