import './base.css';
import './main.css';

// import THREE from 'three/build/three.js';

window.onload = function() {

	var container = document.querySelector('.container'),
		conW = container.offsetWidth,
		conH = container.offsetHeight;

	// var renderer = new THREE.WebGLRenderer({antialias: true});
	// renderer.setSize(conW, conH);
	// container.appendChild(renderer.domElement);

	// var scene = new THREE.Scene();

	// var camera = new THREE.PerspectiveCamera(45, conW/conH, 1, 4000);

	// 创建渲染器
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(conW, conH);
	container.appendChild(renderer.domElement);

	// 创建场景
	var scene = new THREE.Scene();

	// 创建相机，并添加到场景中
	var camera = new THREE.PerspectiveCamera(45, conW/conH, 1, 4000);
	camera.position.set(0, 0, 3.3333);
	scene.add(camera);

	// 创建几何体，并添加到场景中
	var geometry = new THREE.PlaneGeometry(1, 1),
		mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
	scene.add(mesh);
	console.log(geometry);


	// 渲染绘制
	renderer.render(scene, camera);
};


