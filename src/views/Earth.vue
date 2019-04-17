<template>
    <div class='container'>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
import axios from 'axios';
import math from '../mixins/math.js';
import mixin from '../mixins/threeMixin.js';
import boundaryJSON from '@/assets/js/boundary';
import country from '@/assets/js/country';

const { PI } = Math;
const { THREE } = window;
const TWEEN = window.TWEEN;
const mainGroup = new THREE.Group();
const sphereGroup = new THREE.Group();
const boundaryGroup = new THREE.Group();
const radius = 20;
const chinaBoundary = boundaryJSON.pop();
export default {
    mixins: [mixin, math],
    data() {
        return {
            pointsMatrix: {},
        }
    },
    methods: {
        initWebGL() {
            const { scene, camera, renderer } = this.initBasics(this.$refs.canvas, {
                position: { x: 30, y: 10, z: 35 }, antialias: true
            }, {
                clearColor: 0x0B0318,
            });
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            this.scene.add(mainGroup);
            mainGroup.add(sphereGroup);
            sphereGroup.add(boundaryGroup);

            const stats = this.initStats(this.$refs.stats);
            // this.addAxes(50);

            const control = this.addControl();
            const clock = new THREE.Clock();

            // this.addSphere();
            this.handleData();

            // this.test(51, 41);

            this.animateStart();

            const renderScene = () => {
                TWEEN.update();
                stats.update();
                const delta = clock.getDelta();
                control.update(delta);
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };
            renderScene();
        },
        test(lng, lat) {
            const geom = this.initGeometry('Sphere', 0.1, 20, 20);
            const mat = this.initMaterial('MeshBasic', { color: 0x0000FF });
            const mesh = new THREE.Mesh(geom, mat);
            const v = this.lglt2xyx(lng, lat, radius + 0.1);
            mesh.position.x = v.x;
            mesh.position.y = v.y;
            mesh.position.z = v.z;
            mainGroup.add(mesh);
        },
        async handleData() { // 数据预处理，确定地球与大陆边界的点阵
            //【1】生成全量点阵数据
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
                for (let lng = -180; lng < 180; lng += 1) {
                    fillVector(lng, lat, rowVector);
                }
                this.pointsMatrix[lat] = rowVector;
            }
            //【2】将国家边界坐标映射到点阵数据上，并完成内部填充
            country.forEach((item, index) => {
                this.drawCountry(item, index);
            });
            //【3】区分绘制实际点与空白点
            const drawData = [];
            const fillData = [];
            for (const lat in this.pointsMatrix) {
                const vLat = this.pointsMatrix[lat];
                for (const lng in vLat) {
                    const point = vLat[lng];
                    if (!point.isFill) {
                        fillData.push(point.v);
                    } else {
                        drawData.push(point.v);
                    }
                }
            }
            this.addBoundary(drawData);
            this.addSphere(fillData);
        },
        drawCountry(item, index) {
            // if (index < 101) {
                const { minLng, maxLng, minLat, maxLat } = this.fillCountry(item.data, item.dLimit);
                if (item.disPatch) this.patchBoundary(item.disPatch);
                if (item.name === 'Antarctica') {
                    this.fillAntarctica();
                } else {
                    let data;
                    if (item.center) {
                        data = item.center.split(';');
                        data.forEach((item) => {
                            const lnglat = item.split(',');
                            const lng = lnglat[0];
                            const lat = lnglat[1];
                            // this.test(lng, lat);
                            this.fillContent({lng, lat});
                        });
                    } else {
                        data = {
                            lng: Math.round((minLng + maxLng) / 2),
                            lat: Math.round((minLat + maxLat) / 2),
                        };
                        // console.log(data);
                        // this.test(data.lng, data.lat);
                        this.fillContent(data);
                    }
                }
            // }
        },
        animateStart() {
            const obj = { r: 0 };
            const tween = new TWEEN.Tween(obj)
                .to({ r: PI * 2 }, 50000)
                .onUpdate((p) => {
                    sphereGroup.rotation.y = p.r;
                })
                .onComplete(() => {
                    obj.r = 0;
                })
                .repeat(Infinity);
            tween.start();
        },
        fillCountry(data, dLimit) {
            let minLng, maxLng, minLat, maxLat;
            data = data.split(';');
            const map = [];
            const countryOnly = [];
            data.forEach((item) => {
                const lnglat = item.split(',');
                const lng = Math.round(lnglat[0]) === 180 ? 0 : Math.round(lnglat[0]);
                const lat = Math.round(lnglat[1]);
                const point = this.pointsMatrix[lat][lng];
                if (point && countryOnly.indexOf(point) < 0) {
                    map.push({lng, lat});
                    countryOnly.push(point);
                    point.isFill = true;
                }
                if (minLng > lng || minLng === undefined) minLng = lng;
                if (maxLng < lng || maxLng === undefined) maxLng = lng;
                if (minLat > lat || minLat === undefined) minLat = lat;
                if (maxLat < lat || maxLat === undefined) maxLat = lat;
            });
            this.compensation(map, dLimit);
            return {
                minLng,
                maxLng,
                minLat,
                maxLat,
            };
        },
        patchBoundary(data) {
            data = data.split(';');
            data.forEach((item) => {
                const lnglat = item.split(',');
                const lng = Math.floor(lnglat[0]);
                const lat = Math.round(lnglat[1]);
                const point = this.pointsMatrix[lat][lng];
                if (point && !point.isFill) {
                    point.isFill = true;
                }
            });
        },
        fillContent(data) { // 四连通填充算法
            const _this = this;
            const centerPoint = this.pointsMatrix[data.lat][data.lng];
            centerPoint.isFill = true;
            function nearBy(type = 'lng', trend = 'add', num) { // type: lng|lat trend: add|minus
                if (type === 'lng') {
                    if (trend === 'add') {
                        num++;
                        if (num === 180) {
                            num = -180;
                        }
                    } else if (trend === 'minus') {
                        num--;
                        if (num === -181) {
                            num = 179;
                        }
                    }
                } else if (type === 'lat') {
                    if (trend === 'add') {
                        num++;
                        if (num >= 90) {
                            num = 90;
                        }
                    } else if (trend === 'minus') {
                        num--;
                        if (num <= -90) {
                            num = -90;
                        }
                    }
                }
                return num;
            }
            function fourConnected(lng, lat) {
                const top = _this.pointsMatrix[nearBy('lat','add',lat)][lng];
                const bottom = _this.pointsMatrix[nearBy('lat','minus',lat)][lng];
                const left = _this.pointsMatrix[lat][nearBy('lng','minus',lng)];
                const right = _this.pointsMatrix[lat][nearBy('lng','add',lng)];
                [top, bottom, left, right].forEach((point) => {
                    if (point && !point.isFill) {
                        point.isFill = true;
                        fourConnected(point.lnglat.lng, point.lnglat.lat);
                    }
                });
            }
            fourConnected(data.lng, data.lat);
        },
        fillAntarctica() {
            const _this = this;
            function checkNorth(lng, lat) {
                const point = _this.pointsMatrix[lat][lng];
                if (point && !point.isFill) {
                    point.isFill = true;
                    checkNorth(lng, lat+1);
                }
            }
            for (let lng = -180; lng < 180; lng++) {
                checkNorth(lng, -90);
            }
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
                color: 'rgba(65,105,225,1)',
            }, {
                pro: 0.8,
                color: 'rgba(65,105,225,1)',
            }, {
                pro: 1,
                color: 'rgba(65,105,225,0)',
            }];
            const cloud = this.createPointsCloud(points, { size: 0.2, depthTest: true }, map);
            boundaryGroup.add(cloud);
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
                size: 0.05,
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
            });
            return control;
        },
        compensation(data, limit = 10) { // 边界补偿
            return new Promise((resolve) => {
                data.forEach(async (item, index) => {
                    const I = index === 0 ? data.length - 1 : index - 1;
                    const prev = data[I];
                    if (!prev) {
                        return;
                    };
                    const dLng = Math.pow(item.lng - prev.lng, 2);
                    const dLat = Math.pow(item.lat - prev.lat, 2);
                    const distance = Math.sqrt(dLng + dLat);
                    if (distance >= 2 && distance < limit) { // 绝对距离大于2的点，通过图形学画线算法进行补间
                        await this.lineAlgorithm(prev, item);
                    }
                });
                resolve();
            });
        },
        lineAlgorithm(start, end) { // 画线算法
            return new Promise((resolve) => {
                const { lng: x1, lat: y1 } = start;
                const { lng: x2, lat: y2 } = end;
                const minX = x1 < x2 ? x1 : x2;
                const maxX = x1 > x2 ? x1 : x2;
                const minY = y1 < y2 ? y1 : y2;
                const maxY = y1 > y2 ? y1 : y2;
                // console.log(minY, maxY);
                if (x1 === x2) { // 垂直直线，方程 x = b;
                    for (let i = minY + 1; i < maxY; i++) {
                        const point = this.pointsMatrix[i][x1];
                        if (!point.isFill) point.isFill = true;
                    }
                } else { // 非垂直直线，斜截式方程 y = k * x + b
                    // 系数行列式
                    const D = this.SOD([[x1, 1], [x2, 1]]);
                    // 斜率行列式
                    const K = this.SOD([[y1, 1], [y2, 1]]);
                    // 截距行列式
                    const B = this.SOD([[x1, y1], [x2, y2]]);
                    // 斜率
                    const k = K / D;
                    // 截距
                    const b = B / D;
                    // console.log(start, end);
                    if (Math.abs(k) > 1) {
                        for (let i = minY + 1; i < maxY; i++) {
                            const x = Math.round((i - b) / k);
                            const point = this.pointsMatrix[i][x];
                            if (!point.isFill) point.isFill = true;
                        }
                    } else {
                        for (let i = minX + 1; i < maxX; i++) {
                            const y = Math.round(k * i + b);
                            const point = this.pointsMatrix[y][i];
                            if (!point.isFill) point.isFill = true;
                        }
                    }
                }
                resolve();
            });
        },
    },
    mounted() {
        this.initWebGL();
    },
};
</script>