function Earth() {
	this.group = new THREE.Object3D();
	this.TILT = 0.41;
}

Earth.prototype.init = function() {
	this.createGlobal();
	this.createCloud();
};

Earth.prototype.createGlobal = function() {
	var geometry = new THREE.SphereGeometry(1, 32, 32),
		texture = new THREE.TextureLoader().load(require('./images/earth_surface_2048.jpg')),
		material = new THREE.MeshPhongMaterial({map: texture}),
		mesh = new THREE.Mesh(geometry, material);

	mesh.rotation.z = this.TILT;
	this.group.add(mesh);
	this.mesh = mesh;
};

Earth.prototype.createCloud = function() {

};

export default Earth;