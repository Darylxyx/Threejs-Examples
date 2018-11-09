<template>
    <div class='container'>
        <div ref='stats'></div>
        <!-- <board></board> -->
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

const PI = Math.PI;
const cos = Math.cos;
const sin = Math.sin;
const clock = new THREE.Clock();
const mainGroup = new THREE.Group();
const groundGroup = new THREE.Group();
const roadGroup = new THREE.Group();
const carGroup = new THREE.Group();
const buildingGroup = new THREE.Group();

export default {
    mixins: [mixin, animate, truck, park, curve],
    data: () => ({
        PI: Math.PI,
        sin: Math.sin,
        cos: Math.cos,
        mainGroup: new THREE.Group(),
        truckGroup: new THREE.Group(),
        parkGroup: new THREE.Group(),
    }),
    methods: {
        initWebGL() {
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(this.$refs.canvas, { position: {x: 0, y: 100, z: 100}, antialias: true }, { clearColor: 0x10141F });
            
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            this.scene.add(this.mainGroup);
            this.scene.add(mainGroup);

            const stats = this.initStats(this.$refs.stats);

            this.addObject();

            const control = this.addControl();

            const renderScene = () => {
                stats.update();
                const delta = clock.getDelta();
                control.update(delta);
                this.carAnimate(carGroup);
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };

            renderScene();
        },
        addObject() { // 添加对象
            this.addAxes();
            // this.createTruck();
            // 起点
            const start = this.createStart();
            start.position.x = - 80;
            mainGroup.add(start);
            // 装货点
            const loadPark = this.createPark();
            loadPark.position.set(0, 0, 80);
            loadPark.rotation.y = PI;
            mainGroup.add(loadPark);
            // 卸货点
            const unloadPark = this.createPark();
            unloadPark.position.set(0, 0, -80);
            mainGroup.add(unloadPark);
            // 创建弯道
            const curve = this.createCurve();
            mainGroup.add(curve);

            carGroup.add(this.createCar());
            carGroup.position.set(-45, 0.95, -47);
            carGroup.rotation.y = - PI / 2;
            mainGroup.add(carGroup);
        },
        createStart() { // 创建始发站
            const startGeom = this.initGeometry('Plane', 32, 20);
            const startMat = this.initMaterial('MeshBasic', {
                color: 0x1E2642,
            });
            const start = new THREE.Mesh(startGeom, startMat);
            start.rotation.x = - PI / 2;
            return start;
        },
        createCar() { // 挂车系
            const carGroup = new THREE.Group();
            const createWheel = () => {
                const wheelGeom = this.initGeometry('Cylinder', 0.2, 0.2, 0.2, 20);
                const wheelMat = this.initMaterial('MeshBasic', { color: 0x000000 });
                const wheel = new THREE.Mesh(wheelGeom, wheelMat);
                wheel.rotation.z = PI / 2;
                wheel.position.y = - 0.75;
                wheel.name = 'wheel';
                return wheel;
            };
            // 车头
            const carHeadGroup = new THREE.Group();
            const headGeom = this.initGeometry('Cube', 1.5, 1.5, 1.8);
            const headMat = this.initMaterial('MeshBasic', { color: 0xDC143C });
            const head = new THREE.Mesh(headGeom, headMat);
            carHeadGroup.add(head);
            for (let i = 0; i < 4; i++) {
                const wheel = createWheel();
                wheel.position.x = i < 2  ? - 0.6 : 0.6;
                wheel.position.z = i % 2 === 0 ? - 0.4 : 0.4;
                carHeadGroup.add(wheel);
            }
            carHeadGroup.position.z = - 2.2;
            // 车挂
            const carBodyGroup = new THREE.Group();
            const bodyGeom = this.initGeometry('Cube', 1.5, 1.5, 4);
            const bodyMat = this.initMaterial('MeshBasic', { color: 0xDC143C });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            carBodyGroup.add(body);
            for (let i = 0; i < 4; i++) {
                const wheel = createWheel();
                wheel.position.x = i < 2 ? - 0.6 : 0.6;
                wheel.position.z = i % 2 === 0 ? - 1.2 : 1.2;
                carBodyGroup.add(wheel);
            }
            carBodyGroup.position.z = 1.1;
            carGroup.add(carHeadGroup);
            carGroup.add(carBodyGroup);
            return carGroup;
        },
        addRoad() { // 路
            const roadColor = 0x808080;
            const mat = this.initMaterial('MeshBasic', 
            {
                color: 0x808080,
                transparent: true,
                opacity: 0.5,
            });
            
            // 起点
            const startGeom = this.initGeometry('Plane', 40, 20, 1, 1);
            const start = new THREE.Mesh(startGeom, mat);
            start.position.set(-45, 0, -47);
            roadGroup.add(start);
            
            // 路段1（直路）
            const road1Geom = this.initGeometry('Plane', 10, 60, 1, 1);
            const road1 = new THREE.Mesh(road1Geom, mat);
            road1.position.set(-45, 0, -7);
            roadGroup.add(road1);

            // 路段2（小弯路）
            const road2Geom = this.initGeometry('Ring', 20, 30, 60, 1, PI, PI / 2);
            const road2 = new THREE.Mesh(road2Geom, mat);
            road2.position.set(-20, 0, 22);
            roadGroup.add(road2);

            // 装货点
            const stowageGeom = this.initGeometry('Plane', 40, 30, 1, 1);
            const stowage = new THREE.Mesh(stowageGeom, mat);
            stowage.position.set(0, 0, 47);
            roadGroup.add(stowage);

            // 路段3（小直路）
            const road3Geom = this.initGeometry('Plane', 20, 10, 1, 1);
            const road3 = new THREE.Mesh(road3Geom, mat);
            road3.position.set(30, 0, 47);
            roadGroup.add(road3);

            // 路段4（大弯路）
            const road4Geom = this.initGeometry('Ring', 42, 52, 60, 1, PI / 2 * 3, PI);
            const road4 = new THREE.Mesh(road4Geom, mat);
            road4.position.set(40, 0, 0);
            roadGroup.add(road4);

            const road5Geom = this.initGeometry('Plane', 66, 10, 1, 1);
            const road5 = new THREE.Mesh(road5Geom, mat);
            road5.position.set(7, 0, -47);
            roadGroup.add(road5);

            roadGroup.position.y = 0.01;
            roadGroup.children.forEach((item) => {
                item.rotation.x = - PI / 2;
            });
            mainGroup.add(roadGroup);
        },
        addBuilding() { // 建筑物
            for (let i = 0; i < 8; i++) {
                if (i === 2) continue;
                const car = this.createCar();
                car.position.set(i * 4 - 14, 0.95, 54.5);
                mainGroup.add(car);
            }
            // const r = 25;
            // for (let d = 0; d < PI * 2; d += 0.3) {
            //     const height = Math.random() * 8 + 6;
            //     const geom = this.initGeometry('Cube', 4, height, 4);
            //     const mat = this.initMaterial('MeshBasic', { color: 0x808080 });
            //     const mesh = new THREE.Mesh(geom, mat);
            //     mesh.position.set(r * cos(d), height / 2, r * sin(d));
            //     mesh.rotation.y = - d;
            //     buildingGroup.add(mesh);
            // }
            // const R = 41;
            // for (let d = 0; d < PI * 2; d += 0.2) {
            //     const height = Math.random() * 8 + 6;
            //     const geom = this.initGeometry('Cube', 4, height, 4);
            //     const mat = this.initMaterial('MeshBasic', { color: 0x808080 });
            //     const mesh = new THREE.Mesh(geom, mat);
            //     mesh.position.set(R * cos(d), height / 2, R * sin(d));
            //     mesh.rotation.y = - d;
            //     buildingGroup.add(mesh);
            // }
            // mainGroup.add(buildingGroup);
        },
        addAxes(len = 50) { // 辅助坐标系
            const axes = this.initAxes(len);
            mainGroup.add(axes);
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