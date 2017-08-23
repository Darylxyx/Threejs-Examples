function Earth() {
	this.group = new THREE.Object3D();
	this.TILT = 0.41;
	this.GLOBAL_SPEED = 0.002;
	this.CLOUD_SPEED = 0.7 * this.GLOBAL_SPEED;
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
	this.globalMesh = mesh;
};

Earth.prototype.createCloud = function() {
	var geometry = new THREE.SphereGeometry(1.005, 32, 32),
		texture = new THREE.TextureLoader.load(require('./images/earth_clouds_1024.png')),
		material = new THREE.MeshLambertMaterial({map: texture, color: '#fff', transparent: true}),
		mesh = new THREE.Mesh(geometry, material);

	mesh.rotation.z = this.TILT;
	this.group.ad(mesh);
	this.cloudMesh =  mesh;
};

Earth.prototype.run = function() {
	this.globalMesh.rotation.y += this.GLOBAL_SPEED;
	this.cloudMesh.rotation.y += this.CLOUD_SPEED;
};

export default Earth;

// var surfaceMap = this.loader(require('./images/earth_surface_2048.jpg')),
// 	normalMap = this.loader(require('./images/earth_normal_2048.jpg')),
// 	specularMap = this.loader(require('./images/earth_specular_2048.jpg'));

// var shader = THREE.ShaderLib['normal'],
// 	uniforms = THREE.UniformsUtils.clone(shader.uniforms);
// console.log(uniforms);
// uniforms.normalMap.value = normalMap;
// uniforms["specularMap"].value = specularMap;
// // uniforms["tSurface"] = {texture: surfaceMap};
// // uniforms["tSpecular"] = {texture: specularMap};
// // console.log(shader);

// var shaderMaterial = new THREE.ShaderMaterial({
// 	fragmentShader: shader.fragmentShader,
// 	vertexShader: shader.vertexShader,
// 	uniforms: uniforms
// });

// var geometry = new THREE.SphereGeometry(1, 32, 32);
// // geometry.getTangent();

// this.mesh = new THREE.Mesh(geometry, shaderMaterial);
// this.scene.add(this.mesh);
