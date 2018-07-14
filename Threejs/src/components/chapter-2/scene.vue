<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import mixin from '../../mixins/index';

const PI = Math.PI;
export default {
    mixins: [mixin],
    methods: {
        WebGLinit() {
            const stats = this.initStats();
            const W = window.innerWidth - 60;
            const H = window.innerHeight - 60;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            const canvasDom = this.$refs.canvas;
            renderer.setClearColor('#eee');
            renderer.setSize(W, H);
            renderer.shadowMap.enabled = true;
            canvasDom.appendChild(renderer.domElement);

            scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
            // scene.fog = new THREE.FogExp2(0xffffff, 0.01);
            scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 'red'});


            const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            plane.rotation.x = -0.5 * PI;
            plane.position.set(0, 0, 0);
            scene.add(plane);

            const ambientLight = new THREE.AmbientLight(0x0c0c0c);
            scene.add(ambientLight);

            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 60, -10);
            spotLight.shadow.mapSize.width = 3 * W;
            spotLight.shadow.mapSize.height = 3 * W;
            spotLight.castShadow = true;
            scene.add(spotLight);

            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(scene.position);
            scene.add(camera);

            const controls = new function() {
                this.rotationSpeed = 0.02;
                this.numberOfObjects = scene.children.length;

                this.addCube = () => {
                    const cubeSize = Math.round((Math.random() * 3));
                    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    const cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.castShadow = true;
                    cube.name = `cube-${scene.children.length}`;
                    const x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
                    const y = Math.round((Math.random() * 5));
                    const z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));
                    cube.position.set(x, y, z);
                    scene.add(cube);
                    this.numberOfObjects = scene.children.length;
                };

                this.removeCube = () => {
                    const childrens = scene.children;
                    const lastObject = childrens[childrens.length - 1];
                    if (lastObject instanceof THREE.Mesh) {
                        scene.remove(lastObject);
                        this.numberOfObjects = scene.children.length;
                    }
                };

                this.outputObjects = () => {
                    console.log(scene.children);
                    console.log(scene.getObjectByName('cube-4')); // getObjectByName，获取指定对象的方法
                };
            };

            const gui = new GUI();
            gui.add(controls, 'addCube');
            gui.add(controls, 'removeCube');
            gui.add(controls, 'outputObjects');
            gui.add(controls, 'rotationSpeed', 0, 0.5);

            render();

            function render() {
                stats.update();

                scene.traverse((e) => {
                    if (e instanceof THREE.Mesh && e !== plane) {
                        e.rotation.x += controls.rotationSpeed;
                        e.rotation.y += controls.rotationSpeed;
                        e.rotation.z += controls.rotationSpeed;
                    }
                });

                requestAnimationFrame(render);
                renderer.render(scene, camera);
            }
       },
    },
    mounted() {
        this.WebGLinit();
    },
};
</script>