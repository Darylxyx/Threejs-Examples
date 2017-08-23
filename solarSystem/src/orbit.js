function Orbit() {
	this.N_SEGMENTS = 120;

}

Orbit.prototype.init = function(distance) {
	var geometry = new THREE.Geometry();

	let twopi = 2 * Math.PI;
	for (let i = 0; i < this.N_SEGMENTS; i ++) {
		let x = distance * Math.cos(i / this.N_SEGMENTS * twopi),
			z = distance * Math.sin(i / this.N_SEGMENTS * twopi),
			vertex = new THREE.Vector3(x, 0, z);
		geometry.vertices.push(vertex);	
	}

	let material = new THREE.LineBasicMaterial({color: '#fff', opacity: 0.5, linewidth: 2});
	var line = new THREE.Line(geometry, material);
	this.mesh = line;
};

export default Orbit;