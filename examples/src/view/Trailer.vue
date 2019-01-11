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
import building from '../mixins/createBuilding.js';
import roads from '../mixins/createRoad.js';

const { TWEEN } = window;
const clock = new THREE.Clock();
export default {
    mixins: [mixin, animate, truck, park, curve, building, roads],
    data: () => ({
        PI: Math.PI,
        sin: Math.sin,
        cos: Math.cos,
        mainGroup: new THREE.Group(),
        truckGroup: new THREE.Group(), // 卡车组
        truckRotateGroup: new THREE.Group(), // 卡车旋转组，用来模拟卡车侧翻
        headGroup: new THREE.Group(), // 车头组
        backGroup: new THREE.Group(), // 车挂组
        loadParkGroup: new THREE.Group(),
        unloadParkGroup: new THREE.Group(),
        goodsGroup: new THREE.Group(),
        guideGroup: new THREE.Group(),
        lineColor: 0xffffff,
    }),
    methods: {
        async initWebGL() {
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(this.$refs.canvas, { position: {x: 0, y: 100, z: 100}, antialias: true }, { clearColor: 0x10141F, shadowEnabled: true });
            
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            this.scene.add(this.mainGroup);

            // const stats = this.initStats(this.$refs.stats);

            await this.addObject();

            this.initAnimate();

            // const control = this.addControl();

            const renderScene = () => {
                // stats.update();
                // const delta = clock.getDelta();
                // control.update(delta);
                TWEEN.update();
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };

            renderScene();

            this.animateStart();
        },
        async addObject() { // 添加对象
            // this.addAxes();
            // 光源
            this.addLight();
            //卡车
            await this.createTruck();
            this.mainGroup.add(this.truckGroup);
            // 装货点
            const loadPark = await this.createPark(0);
            loadPark.position.set(0, 0, 90);
            loadPark.rotation.y = this.PI;
            this.loadParkGroup = loadPark;
            this.mainGroup.add(this.loadParkGroup);
            // // 卸货点
            const unloadPark = await this.createPark(1);
            unloadPark.position.set(0, 0, -90);
            this.unloadParkGroup = unloadPark;
            this.mainGroup.add(this.unloadParkGroup);
            // // 创建弯道
            const curve = this.createCurve();
            this.mainGroup.add(curve);
            // // 创建建筑群
            const building = this.createBuilding();
            this.mainGroup.add(building);
            // 起点
            const start = this.createStart();
            this.mainGroup.add(start);
        },
        createStart() { // 创建始发站
            const startGroup = new THREE.Group();
            const space = this.createSpace();
            space.rotation.y = this.PI / 2;
            space.position.set(0, 0, 0);
            startGroup.add(space);
            const gateUnit = this.createGateUnit();
            // gateUnit.rotation.y = this.PI / 2;
            gateUnit.position.set(-3, 0, 0);
            startGroup.add(gateUnit);
            startGroup.position.x = -90;
            return startGroup;
        },
        addAxes(len = 50) { // 辅助坐标系
            const axes = this.initAxes(len);
            this.mainGroup.add(axes);
        },
        addLight() {
            const lightGroup = new THREE.Group();
            // 环境光
            const ambientLight = this.initLight('Ambient', {color: 0xeeeeee});
            lightGroup.add(ambientLight);
            // 平行光
            const directionalLight = this.initLight('Directional', {
                color: 0xeeeeee,
                position: { x: -80, y: 100, z: 0},
                castShadow: true,
                shadow: {
                    camera: {
                        near: 2,
                        far: 220,
                        left: -100,
                        right: 100,
                        top: 130,
                        bottom: -80,
                    },
                    mapSize: {
                        width: 2048,
                        height: 2048,
                    },
                },
            });
            const target = this.initTarget(0, 0, 0);
            directionalLight.target = target;
            const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
            // lightGroup.add(helper);
            lightGroup.add(directionalLight);
            this.mainGroup.add(lightGroup);
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