const THREE = require('three');
const euler = new THREE.Euler(-Math.PI/2, 0, Math.PI/2, 'XYZ');
const vY = new THREE.Vector3(0, 1, 0).applyEuler(euler);
console.log('Local Y:', vY.x, vY.y, vY.z);
