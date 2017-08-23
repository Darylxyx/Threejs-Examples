function Star() {
	this.group = new THREE.Object3D();
	this.NVERTICES = 667;
	this.NMATERIALS = 8;
	this.NPARTCLESYSTEMS = 24;
}

Star.prototype.init = function(minDistance) {
	var geometry = new THREE.Geometry();

	for (let i = 0; i < this.NVERTICES; i ++) {
		var vector = new THREE.Vector3(
			(Math.random() * 2 - 1) * minDistance,
			(Math.random() * 2 - 1) * minDistance,
			(Math.random() * 2 - 1) * minDistance
		);

		if (vector.length() < minDistance) {
			vector = vector.setLength(minDistance);
		}

		geometry.vertices.push(vector);
	}

	console.log(geometry);

	var starsMaterials = [];
	for (let i = 0; i < this.NMATERIALS; i ++) {
		starsMaterials.push(
			new THREE.PointsMaterial(
				{color: 0x101010 * (i + 1),
				size: i % 2 + 1,
				sizeAttenuation: false}
			)
		);
	}

	for (let i = 0; i < this.NPARTCLESYSTEMS; i ++) {
		var star = new THREE.Points(geometry, starsMaterials[i % this.NMATERIALS]);
		star.rotation.y = i / (Math.PI * 2);
		this.group.add(star);
	}
};

export default Star;