function Sun() {
	this.group = new THREE.Object3D();
}

Sun.prototype.init = function() {
	var uniforms = {
		time: {type: 'f', value: 1.0},
		texture1: {type: 't', value: 0, texture: new THREE.TextureLoader().load(require('./images/cloud.png'))},
		texture2: {type: 't', value: 1, texture: new THREE.TextureLoader().load(require('./images/lavatile.jpg'))}
	};
};

export default Sun;