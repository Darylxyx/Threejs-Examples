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

const PI = Math.PI;
export default {
    mixins: [mixin],
    methods: {
        initWebGL() {
            const canvas = this.$refs.canvas;
            const {
                scene,
                camera,
                renderer
            } = this.initBasics(canvas, {position: {x: -20, y: 10, z: 40}}, {shadowEnabled: true});

            const axes = this.initAxes(30);
            // scene.add(axes);

            const stats = this.initStats();

            const ambientLight = this.initLight('Ambient', {
                color: 0xffffff,
            });
            scene.add(ambientLight);

            const spotLight = this.initLight('Spot', {
                color: 0xffffff,
                position: {
                    x: -40,
                    y: 60,
                    z: -10
                }
            });
            scene.add(spotLight);

            const meshMaterial = this.initMaterial('MeshNormal', {
                side: THREE.DoubleSide,
            });
            const wireframeMaterial = this.initMaterial('MeshBasic', {
                wireframe: true,
            });
            const planeGeometry = this.initGeometry('Plane', 25, 15, 5, 5);
            const plane = this.createMultiMaterialObject(planeGeometry, [meshMaterial, wireframeMaterial]);
            // scene.add(plane);

            const circleGeometry = this.initGeometry('Circle', 15, 20, PI/6, PI*2/3);
            const circle = this.createMultiMaterialObject(circleGeometry, [meshMaterial, wireframeMaterial]);
            // scene.add(circle);

            const ringGeometry = this.initGeometry('Ring', 0, 15, 10, 10);
            const ring = this.createMultiMaterialObject(ringGeometry, [meshMaterial, wireframeMaterial]);
            // const ring = new THREE.Mesh(ringGeometry, meshMaterial);
            scene.add(ring);

            function render() {
                stats.update();
                circle.rotation.y += 0.01;
                ring.rotation.y += 0.01;
                requestAnimationFrame(render);
                renderer.render(scene, camera);
            }
            render();
        }
    },
    mounted() {
        this.initWebGL();
    }
};
</script>