function Moon() {
	this.SIZE_IN_EARTHS = 1 / 3.7 * 1.2;
	this.DISTANCE_FROM_EARTH = 356400;
	this.INCLINATION = 0.089;
}

Moon.prototype.init = function() {
	var geometry = new THREE.SphereGeometry(this.SIZE_IN_EARTHS, 32, 32),
		texture = new THREE.TextureLoader().load(require('./images/moon_1024.jpg')),
		material = new THREE.MeshPhongMaterial({map: texture}),
		mesh = new THREE.Mesh(geometry, material);

	var distance = this.DISTANCE_FROM_EARTH / 6371;
	console.log(distance);
	mesh.position.set(Math.sqrt(distance/2), 0, -Math.sqrt(distance/2));
	mesh.rotation.y = Math.PI;

	var moonGroup = new THREE.Object3D();
	moonGroup.add(mesh);

	moonGroup.rotation.x = this.INCLINATION;

	this.moonGroup = moonGroup;
	this.mesh = mesh;
};

Moon.prototype.run = function() {
	this.moonGroup.rotation.y += 0.003 / 28;
};

export default Moon;