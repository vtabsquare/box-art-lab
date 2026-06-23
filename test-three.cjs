const THREE = require('three');
const W = 0.8, H = 1.2, D = 0.5, wall = 0.01;
const group = new THREE.Group();
group.position.set(0, H, -D / 2 + wall / 2);
group.rotation.set(Math.PI / 2 + 0.3, 0, 0);

const mesh = new THREE.Mesh();
mesh.position.set(0, wall / 2, D / 2);
group.add(mesh);

group.updateMatrixWorld(true);
const target = new THREE.Vector3();
mesh.getWorldPosition(target);
console.log('Group position:', group.position);
console.log('Flap center world position:', target);
