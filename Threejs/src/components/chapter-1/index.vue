<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'>
        </div>
    </div>
</template>
<script>
import * as THREE from 'three';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';

export default {
    name: 'chapter-1',
    methods: {
        initWebGL() {
            // 初始化性能监测
            const stats = this.initStats();

            // 创建基础设施
            const W = window.innerWidth - 60;
            const H = window.innerHeight - 60;
            const scene = new THREE.Scene();
            const camera =  new THREE.PerspectiveCamera(45, W/H, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            const canvas = this.$refs.canvas;
            renderer.setClearColor('#eee');
            renderer.setSize(W, H);
            renderer.shadowMap.enabled = true;

            // 创建轴线
            const axes = new THREE.AxesHelper(40);
            scene.add(axes);

            //创建板
            const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({color: '#fff'});
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;
            plane.receiveShadow = true;
            scene.add(plane);

            //创建块
            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            const cubeMaterial = new THREE.MeshPhongMaterial({color: '#ff0000'});
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.x = -4;
            cube.position.y = 3;
            cube.position.z = 0;
            cube.castShadow = true;
            scene.add(cube);

            //创建球
            const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
            // const sphereTexture = new THREE.TextureLoader().load(require('../assets/img/pkq.png'));
            const sphereMaterial = new THREE.MeshPhongMaterial({color: '#ff0000'});
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.x = 20;
            sphere.position.y = 4;
            sphere.position.z = 2;
            sphere.rotation.y = 4.5;
            sphere.castShadow = true;
            scene.add(sphere);

            //创建光源
            const spotLight = new THREE.SpotLight('#fff');
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 3 * W;
            spotLight.shadow.mapSize.height = 3 * W;
            scene.add(spotLight);

            // 调整相机角度
            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(scene.position);

            //创建GUI
            const controls = new function() {
                this.rotationSpeed = 0.02;
                this.bouncingSpeed = 0.06;
                this.cameraX = -30;
                this.cameraY = 40;
                this.cameraZ = 30;
            };
            const gui = new GUI();
            gui.add(controls, 'rotationSpeed', 0, 0.5);
            gui.add(controls, 'bouncingSpeed', 0, 0.5);
            gui.add(controls, 'cameraX', -50, 50);
            gui.add(controls, 'cameraY', -50, 50);
            gui.add(controls, 'cameraZ', -50, 50);

            //绘制
            canvas.appendChild(renderer.domElement);
            renderScene();
            let step = 0;
            function renderScene() {
                stats.update();

                camera.position.x = controls.cameraX;
                camera.position.y = controls.cameraY;
                camera.position.z = controls.cameraZ;
                camera.lookAt(scene.position);

                cube.rotation.x += controls.rotationSpeed;
                step += controls.bouncingSpeed;
                sphere.position.x = 20 + (10 * Math.cos(step));
                sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            }

            // 窗口自适应
            function onResize() {
                const W = window.innerWidth - 60;
                const H = window.innerHeight - 60;
                camera.aspect = W / H;
                camera.updateProjectionMatrix();
                renderer.setSize(W, H);
            }

            window.addEventListener('resize', onResize, false);
        },
        initStats() {
            const stats = new Stats();
            const sd = stats.domElement;
            stats.setMode(0);
            sd.style.position = 'absolute';
            sd.style.left = '30px';
            sd.style.top = '30px';
            this.$refs.stats.appendChild(sd);
            return stats;
        },
    },
    mounted () {
        this.initWebGL();
    },
}
</script>