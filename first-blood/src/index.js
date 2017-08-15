import './base.css';
import './main.css';

// import THREE from 'three/build/three.js';

window.onload = function() {

	// var camera, scene, renderer;
	// var mesh;

	// init();

	// animate();

	// function init() {
	// 	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	// 	camera.position.z = 400;
	// 	scene = new THREE.Scene();
	// 	var texture = new THREE.TextureLoader().load( 'src/images/bg.jpg' );
	// 	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
	// 	var material = new THREE.MeshBasicMaterial( { map: texture } );
	// 	mesh = new THREE.Mesh( geometry, material );
	// 	scene.add( mesh );
	// 	renderer = new THREE.WebGLRenderer();
	// 	renderer.setPixelRatio( window.devicePixelRatio );
	// 	renderer.setSize( window.innerWidth, window.innerHeight );
	// 	document.body.appendChild( renderer.domElement );
	// 	//
	// 	window.addEventListener( 'resize', onWindowResize, false );
	// }

	// function onWindowResize() {
	// 	camera.aspect = window.innerWidth / window.innerHeight;
	// 	camera.updateProjectionMatrix();
	// 	renderer.setSize( window.innerWidth, window.innerHeight );
	// }

	// function animate() {
	// 	requestAnimationFrame( animate );
	// 	mesh.rotation.x += 0.005;
	// 	mesh.rotation.y += 0.01;
	// 	renderer.render( scene, camera );
	// }

	// var container = document.querySelector('.container'),
	// 	conW = container.offsetWidth,
	// 	conH = container.offsetHeight;

	// var renderer = new THREE.WebGLRenderer({antialias: true});
	// renderer.setSize(conW, conH);
	// container.appendChild(renderer.domElement);

	// var scene = new THREE.Scene();

	// var camera = new THREE.PerspectiveCamera(45, conW/conH, 1, 4000);
	// camera.position.set(0, 0, 3);
	// scene.add(camera);

	// var light = new THREE.DirectionalLight(0xffffff, 1.5);
	// light.position.set(0, 0, 2);
	// scene.add(light);

	// var map = new THREE.TextureLoader();
	// console.log(map);

	// var material = new THREE.MeshPhongMaterial({map: map});

	// var geometry = new THREE.CubeGeometry(1, 1, 1);
	// // var geometry = new THREE.( 200, 200, 200 );

	// var cube = new THREE.Mesh(geometry, material);
	// cube.rotation.x = Math.PI / 5;
	// cube.rotation.y = Math.PI / 5;
	// scene.add(cube);

	// renderer.render(scene, camera);

	// 创建渲染器
	// var renderer = new THREE.WebGLRenderer();
	// renderer.setSize(conW, conH);
	// container.appendChild(renderer.domElement);

	// // 创建场景
	// var scene = new THREE.Scene();

	// // 创建相机，并添加到场景中
	// var camera = new THREE.PerspectiveCamera(45, conW/conH, 1, 4000);
	// camera.position.set(0, 0, 3.3333);
	// scene.add(camera);

	// // 创建几何体，并添加到场景中
	// var geometry = new THREE.PlaneGeometry(1, 1),
	// 	mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
	// scene.add(mesh);
	// console.log(geometry);


	// // 渲染绘制
	// renderer.render(scene, camera);
};


