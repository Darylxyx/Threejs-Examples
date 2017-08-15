import './base.css';
import './main.css';

// import './sim.js';
// console.log(Sim);

window.onload = function() {
	var renderer = new THREE.WebGLRenderer({antialias: true}),
		conW = window.innerWidth,
		conH = window.innerHeight;
	renderer.setSize(conW, conH);
	document.body.appendChild(renderer.domElement);
	
	var camera = new THREE.PerspectiveCamera(45, conW/conH, 1, 1000);
	camera.position.set(0, 0, 3.333);

	var scene = new THREE.Scene();

	var light = new THREE.DirectionalLight('#fff', 1.5);
	light.position.set(0, 0, 3);
	scene.add(light);

	var texture = new THREE.TextureLoader().load(require('./images/bg.jpg')),
		material = new THREE.MeshPhongMaterial({map: texture}),
		geometry = new THREE.SphereGeometry(1, 32, 32),
		mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	run();

	function run() {
		mesh.rotation.y -= 0.01;
		renderer.render(scene, camera);
	}
};


