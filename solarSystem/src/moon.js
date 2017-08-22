function Moon() {
	this.SIZE_IN_EARTHS = 1 / 3.7 * 1.2;
	this.DISTANCE_FROM_EARTH = 356400;
	this.INCLINATION = 0.089;
}

Moon.prototype = {
	init() {
		var geometry = new THREE.SphereGeometry(1, 32, 32),
			texture = new THREE.TextureLoader().load(require('./images/moon_1024.jpg')),
			material = new THREE.MeshPhongMaterial({map: texture}),
			mesh = new THREE.Mesh(geometry, material);

		var distance = this.DISTANCE_FROM_EARTH / 6371;
		console.log(distance);
		mesh.position.set(1, 1, 1);
		mesh.rotation.y = Math.PI;

		var moonGroup = new THREE.Object3D();
		moonGroup.add(mesh);

		moonGroup.rotation.x = this.INCLINATION;

		this.moonGroup = moonGroup;
		this.mesh = mesh;
	},

	run() {
		this.moonGroup.rotation.y += 0.003 / 28;
	}
};

var moon = new Moon();

export default moon;