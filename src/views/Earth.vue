<template>
    <div class='container'>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
import math from '../mixins/math.js';
import mixin from '../mixins/threeMixin.js';
import boundaryJSON from '@/assets/js/boundary';

const { THREE } = window;
const mainGroup = new THREE.Group();
const sphereGroup = new THREE.Group();
const boundaryGroup = new THREE.Group();
const radius = 20;
const chinaBoundary = boundaryJSON.pop();
export default {
    mixins: [mixin, math],
    methods: {
        initWebGL() {
            const { scene, camera, renderer } = this.initBasics(this.$refs.canvas, {
                position: { x: 30, y: 10, z: 35 }, antialias: true
            }, {
                clearColor: 0x000000,
            });
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            this.scene.add(mainGroup);

            const stats = this.initStats(this.$refs.stats);
            this.addAxes(50);

            const control = this.addControl();
            const clock = new THREE.Clock();

            this.addSphere();

            const renderScene = () => {
                stats.update();
                const delta = clock.getDelta();
                control.update(delta);
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };
            renderScene();
        },
        addSphere() {
            // 根据经纬度间隔绘制出点
            const pointsMatrix = []; // 二维数组，用于按同一纬度保存数据
            const points = new THREE.Geometry();
            const arr = [4, 5, 5.5, 6.1, 10, 20, 91]; // 用来单独设置后15层的经度间隔
            const _this = this;
            function createHemisphere(isNorth, lng, lat, rowVector) { // isNorth 为 true 时生成北半球的点，反之南半球
                    if (isNorth && lat === 0) {
                        return;
                    }
                    const { x, y, z } = _this.lglt2xyx(lng, isNorth ? lat : -lat, radius);
                    const v = _this.v3(x, y, z);
                    points.vertices.push(v);
                    rowVector.push(v);
            }
            for (let lat = 0; lat <= 90; lat++) {
                const rowVector = [];
                // 设置多级经度间隔，以解决高纬度下点重叠的问题
                let dLng;
                if (lat < 74) {
                    dLng = 1;
                } else if (lat >= 74 && lat < 84) {
                    const d = lat - 74;
                    dLng = 1.35 + d * 0.15;
                } else {
                    const d = lat - 84
                    dLng = arr[d];
                }
                for (let lng = -180; lng < 180; lng += dLng) {
                    // 北半球的点
                    createHemisphere(true, lng, lat, rowVector);
                    // 南半球的点
                    createHemisphere(false, lng, lat, rowVector);
                }
                pointsMatrix.push(rowVector);
            }
            const cloud = this.createPointsCloud(points);
            sphereGroup.add(cloud);
            mainGroup.add(sphereGroup);

            this.addBoundary();
        },
        addBoundary() {
            const totalData = chinaBoundary.data.map((item) => {
                const point = item.split(', ');
                const lng = Math.round(point[0]);
                const lat = Math.round(point[1]);
                const { x, y, z } = this.lglt2xyx(lng, lat, radius + 3);
                const v = this.v3(x, y, z);
                return v;
            });
            const vacuateData = this.vacuate(totalData, 0.2);
            const points = new THREE.Geometry();
            points.vertices = vacuateData;
            const map = [{
                pro: 0,
                color: 'rgba(220,20,60,1)',
            }, {
                pro: 0.8,
                color: 'rgba(220,20,60,1)',
            }, {
                pro: 1,
                color: 'rgba(220,20,60,0)',
            }];
            const cloud = this.createPointsCloud(points, { size: 0.3, depthTest: true }, map);
            boundaryGroup.add(cloud);
            mainGroup.add(boundaryGroup);
        },
        createPointsCloud(geom, style, map) {
            const defaltMap = [{
                pro: 0,
                color: 'rgba(255,255,255,1)',
            }, {
                pro: 0.8,
                color: 'rgba(255,255,255,1)',
            }, {
                pro: 1,
                color: 'rgba(255,255,255,0)',
            }];
            const points = this.createPoints(geom, style || {
                size: 0.2,
                depthTest: true,
            }, map || defaltMap);
            return points;
        },
        addAxes(len) { // 默认辅助坐标系
            const axes = this.initAxes(len);
            this.scene.add(axes);
        },
        addControl() { // 摄影机控制器
            const control = this.initControls('Trackball', this.camera, {
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
                target: {x: 20, y: 5, z: 0},
            });
            return control;
        },
    },
    mounted() {
        this.initWebGL();
    },
};
</script>