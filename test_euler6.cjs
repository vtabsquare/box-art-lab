const THREE = require('three');
const e_xyz = new THREE.Euler(0.197, Math.PI, 0, 'XYZ');
const v_xyz = new THREE.Vector3(0, 1, 0);
v_xyz.applyEuler(e_xyz);

const e_yxz = new THREE.Euler(0.197, Math.PI, 0, 'YXZ');
const v_yxz = new THREE.Vector3(0, 1, 0);
v_yxz.applyEuler(e_yxz);

console.log("Back Panel Top with XYZ:", v_xyz.x.toFixed(3), v_xyz.y.toFixed(3), v_xyz.z.toFixed(3));
console.log("Back Panel Top with YXZ:", v_yxz.x.toFixed(3), v_yxz.y.toFixed(3), v_yxz.z.toFixed(3));
