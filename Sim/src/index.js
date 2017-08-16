import './base.css';
import './main.css';

// import './sim.js';
// console.log(Sim);

window.onload = function() {

	function App() {
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.earthGroup = new THREE.Object3D;
		this.conW = window.innerWidth;
		this.conH = window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(45, this.conW/this.conH, 1, 1000);
		this.scene = new THREE.Scene();
		this.light = new THREE.PointLight('#fff', 2, 100);
		this.ROTATION_SPEED = 0.002;
	}

	App.prototype = {
		init() {
			this.renderer.setSize(this.conW, this.conH);
			document.body.appendChild(this.renderer.domElement);

			this.camera.position.set(0, 0, 4);

			this.light.position.set(-10, 0, 20);
			this.scene.add(this.light);

			this.createGlobal();
		},

		createGlobal() {
			var surfaceMap = new THREE.TextureLoader().load(require('./images/earth_surface_2048.jpg')),
				normalMap = new THREE.TextureLoader().load(require('./images/earth_normal_2048.jpg')),
				specularMap = new THREE.TextureLoader().load(require('./images/earth_specular_2048.jpg'));

			var shader = THREE.ShaderUtils.lib['normal'],
				uniforms = THREE.UniformsUtils.clone(shader.uniforms);

			// var texture = new THREE.TextureLoader().load(require('./images/earth_surface_2048.jpg')),
			// 	material = new THREE.MeshPhongMaterial({map: texture}),
			// 	geometry = new THREE.SphereGeometry(1, 32, 32);
			// this.mesh = new THREE.Mesh(geometry, material);
			// this.mesh.rotation.z = 0.41;
			// this.scene.add(this.mesh);
		},

		run() {
			requestAnimationFrame(() => {
				this.run();
			});
			this.mesh.rotation.y += this.ROTATION_SPEED;
			this.renderer.render(this.scene, this.camera);
		}
	};

	var app = new App();

	app.init();

	app.run();
};


