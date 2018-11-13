<template>
    <div class='container'>
        <div ref='stats'></div>
        <board></board>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>

<script>
import { GUI } from 'dat.gui';
import board from '../components/board';
import mixin from '../mixins/threeMixin.js';
import animate from '../mixins/animateList.js';
import truck from '../mixins/createTruck.js';
import park from '../mixins/createPark.js';
import curve from '../mixins/createCurve.js';

const clock = new THREE.Clock();
export default {
    mixins: [mixin, animate, truck, park, curve],
    data: () => ({
        PI: Math.PI,
        sin: Math.sin,
        cos: Math.cos,
        mainGroup: new THREE.Group(), 
        truckGroup: new THREE.Group(), // 卡车组
        headGroup: new THREE.Group(), // 车头组
        backGroup: new THREE.Group(), // 车挂组
        parkGroup: new THREE.Group(),
    }),
    methods: {
        async initWebGL() {
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(this.$refs.canvas, { position: {x: 0, y: 100, z: 100}, antialias: true }, { clearColor: 0x10141F });
            
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            this.scene.add(this.mainGroup);

            const stats = this.initStats(this.$refs.stats);

            await this.addObject();

            this.initAnimate();

            // const control = this.addControl();

            const renderScene = () => {
                stats.update();
                // const delta = clock.getDelta();
                // control.update(delta);
                this.carAnimate();
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };

            renderScene();
        },
        async addObject() { // 添加对象
            // this.addAxes();
            // 光源
            this.addLight();
            //卡车
            await this.createTruck();
            this.mainGroup.add(this.truckGroup);
            // 起点
            const start = this.createStart();
            this.mainGroup.add(start);
            // 装货点
            const loadPark = this.createPark();
            loadPark.position.set(0, 0, 90);
            loadPark.rotation.y = this.PI;
            this.mainGroup.add(loadPark);
            // 卸货点
            const unloadPark = this.createPark();
            unloadPark.position.set(0, 0, -90);
            this.mainGroup.add(unloadPark);
            // 创建弯道
            const curve = this.createCurve();
            this.mainGroup.add(curve);
        },
        createStart() { // 创建始发站
            const startGeom = this.initGeometry('Plane', 32, 20);
            const startMat = this.initMaterial('MeshBasic', {
                color: 0x1E2642,
            });
            const start = new THREE.Mesh(startGeom, startMat);
            start.position.x = - 80;
            start.rotation.x = - this.PI / 2;
            return start;
        },
        addAxes(len = 50) { // 辅助坐标系
            const axes = this.initAxes(len);
            this.mainGroup.add(axes);
        },
        addLight() {
            const ambientLight = this.initLight('Ambient', {color: 0xeeeeee});
            this.mainGroup.add(ambientLight);
        },
        addControl() { // 轨迹球摄影机
            const control = this.initControls('Trackball', this.camera, {
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
            });
            return control;
        },
    },
    components: {
        board,
    },
    mounted() {
        this.initWebGL();
    },
};
</script>

<style lang='LESS' scoped>
.container {
    height: 100%;
    #WebGL-output {
        height: 100%;
    }
}
</style>