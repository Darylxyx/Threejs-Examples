function Moon() {
	this.group = new THREE.Object3D();
	this.SIZE_IN_EARTHS = 1 / 3.7 * 1.2;
	this.DISTANCE_FROM_EARTH = 356400;
	this.INCLINATION = 0.089;
}

Moon.prototype.init = function() {
	var geometry = new THREE.SphereGeometry(this.SIZE_IN_EARTHS, 32, 32),
		texture = new THREE.TextureLoader().load(require('./images/moon_1024.jpg')),
		material = new THREE.MeshPhongMaterial({map: texture}),
		mesh = new THREE.Mesh(geometry, material);

	var distance = 20;
	// console.log(distance);
	mesh.position.set(Math.sqrt(distance/2), 0, -Math.sqrt(distance/2));
	mesh.rotation.y = Math.PI;

	this.group.add(mesh);

	// this.group.rotation.x = this.INCLINATION;

	this.mesh = mesh;
};

Moon.prototype.run = function() {
	this.group.rotation.y += 0.003 / 28;
};

export default Moon;