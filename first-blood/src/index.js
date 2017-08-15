import './base.css';
import './main.css';

// import THREE from 'three/build/three.js';

console.log(THREE);

var canvas = document.querySelector('.container');

var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
canvas.appendChild(renderer.domElement);

console.log(renderer);
