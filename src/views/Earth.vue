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
import country from '@/assets/js/country';

const { PI, abs, round } = Math;
const { THREE } = window;
const TWEEN = window.TWEEN;
const mainGroup = new THREE.Group();
const sphereGroup = new THREE.Group();
const boundaryGroup = new THREE.Group();
const starsGroup = new THREE.Group();
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
            sphereGroup.add(starsGroup);
            // const stats = this.initStats(this.$refs.stats);
            // this.addAxes(50);

            const control = this.addControl();
            const clock = new THREE.Clock();

            // this.addSphere();
            this.handleData();

            this.addStar();

            this.animateStart();

            const renderScene = () => {
                TWEEN.update();
                // stats.update();
                const delta = clock.getDelta();
                control.update(delta);
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };
            renderScene();
        },
        async handleData() { // 数据预处理，确定地球与大陆边界的点阵
            //【1】生成全量点阵数据
            const _this = this;
            function fillVector(lng, lat, rowVector) {
                const { x, y, z } = _this.lglt2xyz(lng, lat, radius);
                const v = _this.v3(x, y, z);
                const infoData = {
                    lnglat: { lng, lat },
                    isFill: false,
                    v,
                };
                rowVector[Math.floor(lng)] = infoData;
            }
            for (let lat = -90; lat <= 90; lat++) {
                const rowVector = {};
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
            const arr = [360, 18, 8, 6, 5, 4, 3]; // 用来单独设置后15层的经度间隔
            for (const lat in this.pointsMatrix) {
                let interval = 0;
                let d = 1;
                const vLat = this.pointsMatrix[lat];
                const absLat = Math.abs(Number(lat));
                if (absLat > 74 && absLat < 84) {
                    d = 2;
                } else if (absLat >= 84) {
                    d = arr[90 - absLat];
                }
                for (const lng in vLat) {
                    interval++;
                    if (interval === d) {
                        interval = 0;
                    } else {
                        continue;
                    }
                    const point = vLat[lng];
                    if (!point.isFill) { //!point.isFill
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
            // if (item.name === 'China') {
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
                .to({ r: PI * 2 }, 100000)
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
        addStar() {
            const stars = new THREE.Geometry();
            function initStarTween(target) {
                const tween = new TWEEN.Tween(target);
                return tween;
            }
            for (let i = 0; i < 20000; i++) {
                const randomLng = Math.random() * 360 - 180;
                const randomLat = Math.random() * 180 - 90;
                const point = this.lglt2xyz(randomLng, randomLat, radius + 1.5);
                stars.vertices.push(point);
                stars.vertices[i].tween = initStarTween(point);
            }
            const map = [{
                pro: 0,
                color: 'rgba(0,191,255,1)',
            }, {
                pro: 0.8,
                color: 'rgba(0,191,255,1)',
            }, {
                pro: 1,
                color: 'rgba(0,191,255,0)',
            }];
            const cloud = this.createPointsCloud(stars, { size: 0.1, depthTest: true }, map);
            starsGroup.add(cloud);
            // this.starAnimate();
        },
        starAnimate() {
            const stars = starsGroup.children[0];
            const _this = this;
            function starsMove(star) {
                const x = Math.random() * 5;
                const y = Math.random() * 5;
                const z = Math.random() * 5;
                const v = _this.v3(x, y, z);
                star.tween.to(v, 1000);
            }
            function onUpdate(obj) {
                // console.log(obj);
                stars.geometry.verticesNeedUpdate = true;
            }
            stars.geometry.vertices.forEach((star) => {
                star.tween.onComplete(() => {
                    // console.log(star);
                    starsMove(star);
                });
                star.tween.onUpdate(onUpdate);
                starsMove(star);
                star.tween.start();
            });
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
                const { lng: xa, lat: ya } = start;
                const { lng: xb, lat: yb } = end;
                const dx = xb - xa;
                const dy = yb - ya;
                const abs_dx = abs(dx);
                const abs_dy = abs(dy);
                const steps = abs_dx > abs_dy ? abs_dx : abs_dy;
                const delta_x = dx / steps;
                const delta_y = dy / steps;
                let x = xa;
                let y = ya;
                for (let i = 1; i <= steps; i++) {
                    x += delta_x;
                    y += delta_y;
                    // console.log(x, y);
                    const point = this.pointsMatrix[round(y)][round(x)];
                    if (!point.isFill) point.isFill = true;
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