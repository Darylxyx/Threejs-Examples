<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
import * as THREE from 'three';
// import { createMultiMaterialObject } from 'three/examples/js/utils/SceneUtils';
import { GUI } from 'dat.gui';
import mixin from '../../mixins/index';

const PI = Math.PI;
export default {
    mixins: [mixin],
    methods: {
        WebGLInit() {
            const stats = this.initStats();
            const canvasDom = this.$refs.canvas;
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(canvasDom, {x: -20, y: 25, z: 20}, {clearColor: 'grey', shadowEnabled: true});

            const axes = this.initAxes(40);
            scene.add(axes);

            const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 0;
            plane.position.y = 0;
            plane.position.z = 0;
            scene.add(plane);

            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 60, 10);
            spotLight.castShadow = true;
            scene.add(spotLight);

            const V3 = this.V3;
            const F3 = this.F3;

            const vertices = [
                V3(1, 3, 1),
                V3(1, 3, -1),
                V3(1, -1, 1),
                V3(1, -1, -1),
                V3(-1, 3, -1),
                V3(-1, 3, 1),
                V3(-1, -1, -1),
                V3(-1, -1, 1)
            ];

            const faces = [
                F3(0, 2, 1),
                F3(2, 3, 1),
                F3(4, 6, 5),
                F3(6, 7, 5),
                F3(4, 5, 1),
                F3(5, 0, 1),
                F3(7, 6, 2),
                F3(6, 3, 2),
                F3(5, 7, 0),
                F3(7, 2, 0),
                F3(1, 3, 4),
                F3(3, 6, 4)
            ];

            const geom = new THREE.Geometry();
            geom.vertices = vertices;
            geom.faces = faces;
            geom.computeFaceNormals();
            // const materials = [
            //     new THREE.MeshLambertMaterial({opacity: 0.6, color: 0xff44ff, transparent: true}),
            //     new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
            // ];
            const material = new THREE.MeshLambertMaterial({color: 0xffffff});
            // const mesh = createMultiMaterialObject(geom, material);
            const mesh = new THREE.Mesh(geom, material);
            scene.add(mesh);

            render();

            function render() {
                requestAnimationFrame(render);
                renderer.render(scene, camera);
            }
        },
    },
    mounted() {
        this.WebGLInit();
    },
};
</script>