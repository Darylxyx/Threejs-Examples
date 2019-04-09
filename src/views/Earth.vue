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

            // this.addSphere();
            this.handleData();

            const renderScene = () => {
                stats.update();
                const delta = clock.getDelta();
                control.update(delta);
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };
            renderScene();
        },
        handleData() { // 数据预处理，确定地球与大陆边界的点阵
            //【1】生成全量点阵数据
            const pointsMatrix = {}; // 矩阵，用于按同一纬度保存数据
            const _this = this;
            function fillVector(lng, lat, rowVector) {
                const { x, y, z } = _this.lglt2xyx(lng, lat, radius);
                const v = _this.v3(x, y, z);
                const infoData = {
                    lnglat: { lng, lat },
                    isFill: false,
                    v,
                };
                rowVector[Math.floor(lng)] = infoData;
            }
            function dLngCorrect(lat) { // 设置多级经度间隔，以解决高纬度下点重叠的问题
                const arr = [4, 5, 5.5, 6.1, 10, 20, 91]; // 用来单独设置后15层的经度间隔
                let dLng;
                const absLat = Math.abs(lat);
                if (absLat < 74) {
                    dLng = 1;
                } else if (absLat >= 74 && absLat < 84) {
                    const d = absLat - 74;
                    dLng = 1.35 + d * 0.15;
                } else if (absLat === 90) {
                    dLng = 360;
                } else {
                    const d = absLat - 84
                    dLng = arr[d];
                }
                return dLng;
            }
            for (let lat = -90; lat <= 90; lat++) {
                const rowVector = {};
                const dLng = dLngCorrect(lat);
                for (let lng = -180; lng < 180; lng += dLng) {
                    fillVector(lng, lat, rowVector);
                }
                pointsMatrix[lat] = rowVector;
            }
            //【2】将地图边界坐标映射到点阵数据上
            const drawBoundaryData = [];
            chinaBoundary.data.forEach((item) => {
                const lnglat = item.split(', ');
                const lng = Math.floor(lnglat[0]);
                const lat = Math.round(lnglat[1]);
                // console.log(pointsMatrix[lat][lng]);
                const point = pointsMatrix[lat][lng];
                if (!point.isFill) {
                    drawBoundaryData.push(point.v);
                    point.isFill = true;
                }
            });
            this.addBoundary(drawBoundaryData);
            //【3】剩余点阵部分填充
            const fillData = [];
            for (const lat in pointsMatrix) {
                const vLat = pointsMatrix[lat];
                for (const lng in vLat) {
                    const point = vLat[lng];
                    if (!point.isFill) {
                        fillData.push(point.v);
                    }
                }
            }
            this.addSphere(fillData);
        },
        addSphere(dataArr) {
            const points = new THREE.Geometry();
            points.vertices = dataArr;
            const cloud = this.createPointsCloud(points);
            sphereGroup.add(cloud);
            mainGroup.add(sphereGroup);
        },
        addBoundary(dataArr) {
            const points = new THREE.Geometry();
            points.vertices = dataArr;
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