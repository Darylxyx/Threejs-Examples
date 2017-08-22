import './base.css';
import './main.css';
import moon from './moon.js';

// import test from 'three/build/three.min.js';

// console.log(test);

window.onload = function() {

	function App() {
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.earthGroup = new THREE.Object3D;
		this.conW = window.innerWidth;
		this.conH = window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(45, this.conW/this.conH, 1, 1000);
		this.scene = new THREE.Scene();
		this.loader = new THREE.TextureLoader().load;
		this.light = new THREE.PointLight('#fff', 2, 100);
		this.ROTATION_SPEED = 0.002;
		this.CLOUD_SPEED = this.ROTATION_SPEED * 0.7;
		this.TILT = 0.41;
	}

	App.prototype = {
		init() {
			this.renderer.setSize(this.conW, this.conH);
			document.body.appendChild(this.renderer.domElement);

			this.camera.position.set(0, 0, 3);

			this.light.position.set(-10, 0, 20);
			this.scene.add(this.light);

			// this.scene.add(moon.mesh);

			this.createGlobal();
			this.createCloud();

			// moon.init();
			// this.earthGroup.add(moon.moonGroup);

			window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
		},

		createGlobal() {
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
			

			var texture = this.loader(require('./images/earth_surface_2048.jpg')),
				material = new THREE.MeshPhongMaterial({map: texture}),
				geometry = new THREE.SphereGeometry(1, 32, 32);
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.rotation.z = this.TILT;

			this.earthGroup.add(this.mesh);
			// this.scene.add(this.mesh);

		},

		createCloud() {
			var cloudMap = this.loader(require('./images/earth_clouds_1024.png')),
				cloudMaterial = new THREE.MeshLambertMaterial({
					color: '#fff',
					map: cloudMap,
					transparent: true
				}),
				cloudGeometry = new THREE.SphereGeometry(1.005, 32, 32);
			this.cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
			this.cloudMesh.rotation.z = this.TILT;
			// this.scene.add(this.cloudMesh);
			this.earthGroup.add(this.cloudMesh);
		},

		run() {
			requestAnimationFrame(() => {
				this.run();
			});
			this.mesh.rotation.y += this.ROTATION_SPEED;
			this.cloudMesh.rotation.y += this.CLOUD_SPEED;
			// moon.run();
			this.renderer.render(this.scene, this.camera);
		},

		onWindowResize() {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	};

	var app = new App();

	app.init();

	app.run();
};


