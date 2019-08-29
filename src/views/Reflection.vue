<template>
    <div class='container'>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>

<script>
import math from '../mixins/math.js';
import mixin from '../mixins/threeMixin.js';

const { TWEEN, THREE } = window;
const { PI } = Math;
export default {
    mixins: [math, mixin],
    data() {
        return {
            textureCube: null,
            sphere: null,
            cubeCamera: null,
        };
    },
    methods: {
        initWebGL() {
            const { scene, camera, renderer } = this.initBasics(this.$refs.canvas, {
                position: { x: 0, y: 0, z: 100 }, antialias: true
            }, {
                clearColor: 0x0B0318,
            });
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            this.createCubTexture();
            this.scene.background = this.textureCube;

            this.addItems();

            const control = this.addControl();

            const renderScene = () => {
                TWEEN.update();
                control.update();

                this.sphere.visible = false;
                this.cubeCamera.update(renderer, scene);
                this.sphere.visible = true;

                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };
            renderScene();
        },
        addItems() {
            const cubeCamera = new THREE.CubeCamera(0.1, 40, 100);
            cubeCamera.position.x = 20;
            this.cubeCamera = cubeCamera;
            this.scene.add(this.cubeCamera);

            const sphereGeom = this.initGeometry('Sphere', 15, 50, 50);
            const sphereMat = new THREE.MeshBasicMaterial({ envMap: cubeCamera.renderTarget });
            const sphere = new THREE.Mesh(sphereGeom, sphereMat);
            sphere.position.x = 20;
            this.sphere = sphere;
            this.scene.add(sphere);

            const boxGeom = this.initGeometry('Dodecahedron', 15);
            const boxMat = new THREE.MeshBasicMaterial({ envMap: this.textureCube });
            const box = new THREE.Mesh(boxGeom, boxMat);
            box.position.x = -20;
            this.rotateAnim(box);
            this.scene.add(box);
        },
        rotateAnim(obj) {
            const a = { r: 0 };
            const tween = this.initTween({
                start: a,
                end: { r: PI * 2 },
                duration: 30000,
                repeat: Infinity,
                onUpdate: (o) => {
                    obj.rotation.x = o.r;
                    obj.rotation.z = o.r;
                },
            });
            tween.start();
        },
        createCubTexture() {
            this.textureCube = new THREE.CubeTextureLoader()
                .setPath('img/')
                .load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);
        },
        addAxes(len) { // 默认辅助坐标系
            const axes = this.initAxes(len);
            this.scene.add(axes);
        },
        addControl() { // 摄影机控制器
            const control = this.initControls('Orbit', this.camera);
            return control;
        },
    },
    mounted() {
        this.initWebGL();
    },
};
</script>