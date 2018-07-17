<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'>
        </div>
    </div>
</template>
<script>
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import mixin from '../../mixins/index';

export default {
    mixins: [mixin],
    name: 'ligths',
    methods: {
        initWebGL() {
            // 初始化性能监测
            const stats = this.initStats();

            // 创建基础设施
            const canvas = this.$refs.canvas;
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(canvas, {fov: 45}, {shadowEnabled: true});

            this.listenResize(canvas, camera, renderer);

            // 创建轴线
            const axes = this.initAxes(30);
            scene.add(axes);

            //创建板
            const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
            const planeMaterial = new THREE.MeshPhongMaterial({color: '#fff'});
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;
            plane.receiveShadow = true;
            scene.add(plane);

            //创建块
            const cube = this.initCube({
                length: 4, width: 4, height: 4,
                positionX: -4, positionY: 3, positionZ: 0,
                material: 'Lambert',
                color: 0xff0000,
                castShadow: true,
            });
            scene.add(cube);

            //创建球
            const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
            // const sphereTexture = new THREE.TextureLoader().load(require('../assets/img/pkq.png'));
            const sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.x = 20;
            sphere.position.y = 4;
            sphere.position.z = 2;
            sphere.rotation.y = 4.5;
            sphere.castShadow = true;
            scene.add(sphere);

            const pointGeometry = new THREE.SphereGeometry(0.2);
            const pointMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.set(10, 10, 10);
            scene.add(point);

            //创建光源
            const spotLight = this.initLight('Spot', {
                position: {x: -40, y: 60, z: -10},
                color: '#fff',
                castShadow: true,
                shadow: {
                    mapSize: {
                        width: 2048,
                        height: 2048,
                    }
                }
            });
            scene.add(spotLight);

            const pointLight = this.initLight('Point', {
                position: {x: 10, y: 10, z: 10},
                color: '#ccffcc',
                distance: 20,
            });
            // scene.add(pointLight);

            const directionalLight = this.initLight('Directional', {
                position: {x: -40, y: 60, z: -10},
                castShadow: true,
                shadow: {
                    camera: {
                        near: 2,
                        far: 200,
                        left: 50,
                        right: -50,
                        top: 50,
                        bottom: -50,
                    },
                    mapSize: {
                        width: 2048,
                        height: 2048,
                    },
                },
            });
            console.log(directionalLight);
            // scene.add(directionalLight);

            const ambientColor = '#0c0c0c';
            const ambientLight = this.initLight('Ambient', {color: ambientColor});
            // scene.add(ambientLight);

            //创建GUI
            const controls = new function() {
                this.ambientColor = ambientColor;
                this.pointX = 10;
                this.pointY = 10;
                this.pointZ = 10;
                this.distance = 0;
                this.intensity = 1;
            };
            const gui = new GUI();
            gui.addColor(controls, 'ambientColor').onChange((e) => {
                ambientLight.color = new THREE.Color(e);
            });
            gui.add(controls, 'pointX', -30, 30);
            gui.add(controls, 'pointY', -10, 20);
            gui.add(controls, 'pointZ', -10, 10);
            gui.add(controls, 'distance', 0, 100).onChange((e) => {
                pointLight.distance = e;
            });
            gui.add(controls, 'intensity', 0, 3).onChange((e) => {
                pointLight.intensity = e;
            });

            //绘制
            renderScene();
            let step = 0;
            function renderScene() {
                stats.update();

                pointLight.position.set(controls.pointX, controls.pointY, controls.pointZ);
                point.position.copy(pointLight.position);

                cube.rotation.x += 0.02;
                step += 0.06;
                sphere.position.x = 20 + (10 * Math.cos(step));
                sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            }
        },
    },
    mounted () {
        this.initWebGL();
    },
}
</script>