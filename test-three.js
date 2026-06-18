import * as THREE from 'three';
const cyl = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
const circ = new THREE.CircleGeometry(1, 6);
console.log("Cylinder:");
for(let i=0; i<6; i++) {
  console.log(cyl.attributes.position.array[i*3], cyl.attributes.position.array[i*3+2]);
}
console.log("Circle:");
for(let i=0; i<6; i++) {
  // First vertex in CircleGeometry is at index 1 because index 0 is center
  console.log(circ.attributes.position.array[(i+1)*3], circ.attributes.position.array[(i+1)*3+1]);
}
