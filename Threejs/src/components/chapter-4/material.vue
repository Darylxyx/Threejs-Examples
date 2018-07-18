<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'>
        </div>
    </div>
</template>
<script>
import * as THREE from 'three';
import mixin from '../../mixins/index';
import { GUI } from 'dat.gui';

export default {
    mixins: [mixin],
    methods: {
        initWebGL() {
            const {
                scene,
                camera,
                renderer
            } = this.initBasics(this.$refs.canvas, {fov: 45, position: {x: -20, y: 30, z: 40}}, {clearColor: 0xeeeeee, shadowEnabled: true});

            const stats = this.initStats();
            const axes = this.initAxes();
            scene.add(axes);

            // const basicMaterial = this.initMaterial('MeshBasic', {
            //     color: 0x7777ff,
            //     name: 'material-1',
            //     opcity: 0.5,
            //     transparency: true,
            //     // wireframe: true,
            //     side: THREE.BackSide,
            // });

            const depthMaterial = this.initMaterial('MeshDepth');
            const colorMaterial = this.initMaterial('MeshBasic', {
                color: 0x00ff00,
                transparent: true,
                blending: THREE.MultiplyBlending
            });
            const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
            // const cube = new THREE.Mesh(cubeGeometry, depthMaterial);
            const cube = new this.createMultiMaterialObject(cubeGeometry, [colorMaterial, depthMaterial]);
            cube.children[1].scale.set(0.99, 0.99, 0.99);
            cube.castShadow = true;
            // scene.add(cube);

            // 球，MeshNormalMaterial
            const normalMaterial = this.initMaterial('MeshNormal', {
                color: 0x7777ff,
                flatShading: true,
                side: THREE.FrontSide,
            });
            // const normalMaterial = new THREE.MeshNormalMaterial({color: 0x7777ff});
            const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
            const sphere = new THREE.Mesh(sphereGeometry, normalMaterial);
            // scene.add(sphere);

            const v3 = this.v3;
            sphere.geometry.faces.forEach((face) => {
                const centroid = v3(0, 0, 0);
                centroid.add(sphere.geometry.vertices[face.a]);
                centroid.add(sphere.geometry.vertices[face.b]);
                centroid.add(sphere.geometry.vertices[face.c]);
                centroid.divideScalar(3);

                const arrow = new THREE.ArrowHelper(
                    face.normal,
                    centroid,
                    2, 0x3333ff, 0.5, 0.3
                )
                sphere.add(arrow);
            });

            // 魔方，MeshFaceMaterail
            const colorList = [0x009e60, 0x009e60, 0x0051ba, 0x0051ba, 0xffd500, 0xffd500, 0xff5800, 0xff5800, 0xC41E3A, 0xC41E3A, 0xffffff, 0xffffff];
            const mats = colorList.map((item) => {
                return this.initMaterial('MeshPhong', {color: item});
            });
            
            const group = new THREE.Mesh();
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    for (let z = 0; z < 3; z++) {
                        const cubeGeometry = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                        const cube = new THREE.Mesh(cubeGeometry, mats);
                        cube.position.set(x*3 - 3, y*3 - 3, z*3 - 3);
                        group.add(cube);
                    }
                }
            }
            // scene.add(group);

            const lines = new THREE.Geometry();
            const p1 = v3(-10, 10, 10);
            const p2 = v3(10, -10, 10);
            const p3 = v3(-10, -10, -10);
            const c1 = new THREE.Color(0x444444);
            const c2 = new THREE.Color(0xff0000);
            const c3 = new THREE.Color(0x3333ff);
            lines.vertices.push(p1, p2, p3, p1);
            lines.colors.push(c1, c2, c3, c1);
            // const lineMaterial = this.initMaterial('LineBasic', {
            //     vertexColors: true,
            //     linewidth: 20,
            // })
            // const lineMaterial = new THREE.LineBasicMaterial({
            //     linewidth: 5,
            //     vertexColors: true,
            //     linejoin: 'round',
            // });
            // lines.computeLineDistances();
            // THREE.Line.computeLineDistances()
            const lineMaterial =  new THREE.LineDashedMaterial({
                vertexColors: true,
                color: 0xffffff,
                dashSize: 3,
                gapSize: 2,
                scale: 2
            });
            const line = new THREE.Line(lines, lineMaterial);
            line.computeLineDistances();
            scene.add(line);

            // 光源
            const ambientLight = this.initLight('Ambient', {
                color: 0xeeeeee
            });
            scene.add(ambientLight);

            const spotLight = this.initLight('Spot', {
                color: 0xffffff,
                position: {
                    x: -40,
                    y: 60,
                    z: -10,
                },
                castShadow: true,
            });
            scene.add(spotLight);

            const controls = new function() {
                this.cubeZ = 0;
            };

            const gui = new GUI();
            // gui.add(controls, 'cubeZ', -100, 100).onChange((e) => {
            //     cube.position.z = e;
            // });
            function renderScene() {
                stats.update();
                line.rotation.x += 0.01;
                line.rotation.y += 0.01;
                line.rotation.z += 0.01;
                sphere.rotation.y += 0.01;

                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            }

            renderScene();
        }
    },
    mounted() {
        this.initWebGL();
    }
};
</script>