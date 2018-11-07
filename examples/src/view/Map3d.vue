<template>
    <div class="container">
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
import axios from 'axios';
import Geohash from 'latlon-geohash';
import TWEEN from 'tween.js';
import { GUI } from 'dat.gui';
import mixin from '../mixins/threeMixin';
import math from '../mixins/math';
import boundaryJSON from '../../static/boundary';

const THREE = window.THREE;
const PI = Math.PI;
const radius = 100;
let globalDirec = true;
const clock = new THREE.Clock();

const mainGroup = new THREE.Group(); // 顶级组
const lineGroup = new THREE.Group(); // 地图边界线组
const sphereGroup = new THREE.Group(); // 地球组
const globalGroup = new THREE.Group();
const pointsGroup = new THREE.Group(); // 车辆坐标点组
const scanGroup = new THREE.Group(); // 扫描线组
const pathGroup = new THREE.Group(); // 路径组
export default {
    mixins: [mixin, math],
    data() {
        return {
            runCount: 0,
            stopCount: 0,
            offlineCount: 0,
            isLoading: false,
        };
    },
    methods: {
        queryData() {
            this.isLoading = true;
            // 查询车辆信息
            const fetch = axios.create();
            fetch({
                method: 'get',
                url: '/static/geohash.json',
                data: {},
            }).then(async (res) => {
                let run = [];
                let silence = [];
                let offline = [];
                res = res.data;
                for (const obj of res) {
                    if (obj.geoHashKey) {
                        const coord = Geohash.decode(obj.geoHashKey);
                        const lglt = [coord.lon, coord.lat];
                        switch (obj.value) {
                            case 2:
                                run.push(lglt);
                                break;
                            case 1:
                                silence.push(lglt);
                                break;
                            // case 0:
                            //     offline.push(lglt);
                            //     break;
                            default:
                                offline.push(lglt);
                                break;
                        }
                    }
                }
                this.runCount = run.length;
                this.stopCount = silence.length;
                function randomSort() {
                    const diff = Math.random() - Math.random();
                    return diff;
                }
                function dataSlice(target) {
                    return target.slice(0, Math.floor(target.length / 7));
                }
                run.sort(randomSort);
                silence.sort(randomSort);
                offline.sort(randomSort);
                run = dataSlice(run);
                silence = dataSlice(silence);
                offline = dataSlice(offline);
                const dataMap = [{
                    type: 'run',
                    data: run,
                    color: 0x19D190,
                    rgbcolor: 'rgba(25,209,144,1)',
                    twinkle: true,
                }, {
                    type: 'silence',
                    data: silence,
                    color: 0x2934CE,
                    rgbcolor: 'rgba(41,52,206,1)',
                }, {
                    type: 'offline',
                    data: offline,
                    color: 0x303A61,
                    rgbcolor: 'rgba(48,58,97,1)',
                }];

                await this.drawTruck(dataMap);
                function pointsAnimateStart() {
                    pointsGroup.children.forEach((cloudGroup) => {
                        cloudGroup.children.forEach((cloud) => {
                            if (cloud.tween) cloud.tween.start();
                        });
                    });
                }
                pointsAnimateStart();

                // 查询线路信息
                const fetch = axios.create();
                fetch({
                    method: 'get',
                    url: '/static/graphql.json',
                    data: {},
                }).then((result) => {
                    // console.log(result);
                    result = result.data.data.topLine100.slice(0, 300);
                    this.addPath(result);
                });
            });
        },
        drawTruck(dataMap) {
            return new Promise((resolve) => {
                const promises = dataMap.map((item) => {
                    const pro = new Promise((solve) => {
                        pointsGroup.add(this.drawPoints(item));
                        solve();
                    });
                    return pro;
                });
                Promise.all(promises).then(() => {
                    resolve();
                });
            });
        },
        initWebGL() {
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(this.$refs.canvas, { position: { x: -45, y: 62, z: -140 }, antialias: true }, { clearColor: 0x000000 });
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            this.scene.add(mainGroup);
            camera.lookAt(this.v3(64, 20, 150));

            // scene.fog = new THREE.Fog(0x000000, 0.015, 1000);

            const stats = this.initStats(this.$refs.stats);
            const control = this.addControl();
            console.log(clock);

            this.addAxes();

            this.addLight(); // 光源

            this.addSphere(); // 地球

            // this.addScanLine(); // 扫描线

            this.addBackground(); // 星空背景

            this.initMap(); // 绘制地图

            // this.initGUI();
            const renderScene = () => {
                stats.update();
                const delta = clock.getDelta();
                control.update(delta);
                this.globalAnimate();
                // this.scanAnimate();
                TWEEN.update();
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };
            renderScene();
        },
        initMap() {
            globalGroup.add(lineGroup);
            globalGroup.add(pointsGroup);
            mainGroup.add(globalGroup);
            boundaryJSON.forEach((province) => {
                lineGroup.add(this.drawMap(province.name, province.data));
            });
        },
        addAxes() {
            const axes = this.initAxes(150);
            mainGroup.add(axes);
        },
        addLight() { // 光源
            const lightGroup = new THREE.Group();
            const ambientLight = this.initLight('Ambient', {
                color: 0x696969,
            });
            const directionalLight = this.initLight('Directional', {
                color: 0xffffff,
                position: { x: -500, y: 250, z: -100 },
                shadow: {
                    camera: {
                        near: 2,
                        far: radius * 2.5,
                        left: -radius * 2,
                        right: radius * 2,
                        top: radius * 2,
                        bottom: -radius * 2,
                    },
                },
            });
            // const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
            // lightGroup.add(helper);
            lightGroup.add(ambientLight);
            lightGroup.add(directionalLight);
            mainGroup.add(lightGroup);
        },
        addControl() {
            const control = this.initControls('Trackball', this.camera, {
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
            });
            return control;
        },
        addSphere() { // 球
            const geom = this.initGeometry('Sphere', radius, 40, 40);
            const map = this.loadTexture(require('../assets/img/world2.png'));
            // const normal = this.loadTexture(require('../../assets/img/EarthNormal.png'));
            const mat = this.initMaterial('MeshPhong'); // 0x192452
            mat.map = map;
            // mat.normalMap = normal;
            // mat.normalScale.set(1, -2);
            const sphere = new THREE.Mesh(geom, mat);
            sphereGroup.add(sphere);
            globalGroup.add(sphereGroup);
        },
        globalAnimate() {
            if (globalDirec) {
                globalGroup.rotation.y += 0.0001;
                if (globalGroup.rotation.y >= 0.1) globalDirec = false;
            } else {
                globalGroup.rotation.y -= 0.0001;
                if (globalGroup.rotation.y <= -0.1) globalDirec = true;
            }
        },
        addScanLine() {
            for (let i = 0; i < 8; i++) {
                const geom = this.initGeometry('Circle', radius + 0.2, 40, 0, PI);
                const mat = new THREE.LineBasicMaterial({
                    color: 0xF5F5F5,
                    opacity: i / 14,
                    transparent: true,
                });
                const scanLine = new THREE.Line(geom, mat);
                scanLine.rotation.x += i * 0.02;
                scanGroup.add(scanLine);
            }
            mainGroup.add(scanGroup);
        },
        scanAnimate() {
            scanGroup.rotation.x += 0.02;
            if (scanGroup.rotation.x >= PI * 2) scanGroup.rotation.x = 0;
        },
        addBackground() {
            const backGroup = new THREE.Group();
            for (let i = 0; i < 10; i++) {
                const geo = new THREE.Geometry();
                for (let j = 0; j < 100; j++) {
                    const x = Math.random() * 600 - 300;
                    const y = Math.random() * 400 - 200;
                    const z = 100;
                    const particle = this.v3(x, y, z);
                    geo.vertices.push(particle);
                }
                const stars = this.createPoints(geo, { map: null, color: 0xffffff });
                this.bindTwinkle(stars, {
                    inTime: 1000,
                    outTime: 1000,
                    duration: 3000,
                    delay: Math.floor(Math.random() * 1000),
                });
                stars.tween.start();
                backGroup.add(stars);
            }
            backGroup.rotation.y = PI / 9;
            mainGroup.add(backGroup);
        },
        drawMap(name, pointsArr) {
            const pList = [];
            pointsArr.forEach((point) => {
                if (point.indexOf(', ') > -1) {
                    point = point.split(', ');
                } else {
                    point = point.split(',');
                }
                const lng = point[0];
                const lat = point[1];
                const { x, y, z } = this.lglt2xyx(lng, lat, radius);
                const particle = this.v3(x, y, z);
                pList.push(particle);
            });
            let lineColor = 0x145385;
            let linewidth = 1;
            // if (name === '中国' || name === '台湾省') { // 轮廓加粗
            //     lineColor = 0x6EFFFF;
            //     linewidth = 1;
            // }
            const line = this.initLine(pList, {
                color: lineColor,
                linewidth,
                transparent: true,
                opacity: 0.6,
            });
            return line;
        },
        drawPoints(pData) { // 绘制车辆点
            const cloudGroup = new THREE.Group();
            let pointSize = 0.15;
            const mapParam = [{
                pro: 0,
                color: pData.rgbcolor,
            }, {
                pro: 0.8,
                color: pData.rgbcolor,
            }, {
                pro: 1,
                color: 'rgba(0, 0, 0, 1)',
            }];
            if (pData.type === 'run') { // 运行的车辆增加光晕效果
                pointSize = 0.3;
                mapParam.splice(2, 0, { pro: 0.81, color: 'rgba(255,255,224, 1)' });
            }
            // console.log(mapParam);
            const params = {
                size: pointSize,
                depthTest: false,
            };
            if (pData.twinkle) { // 车辆是否需要闪烁
                const splitCount = 100; // 用于分组，实现闪烁效果
                const splitArr = this.splitArray(pData.data, splitCount);
                splitArr.forEach((arr) => {
                    const points = new THREE.Geometry();
                    arr.forEach((p) => {
                        const { x, y, z } = this.lglt2xyx(p[0], p[1], radius);
                        const particle = this.v3(x, y, z);
                        points.vertices.push(particle);
                    });
                    const cloud = this.createPoints(points, params, mapParam);
                    this.bindTwinkle(cloud);
                    cloudGroup.add(cloud);
                });
            } else {
                const points = new THREE.Geometry();
                pData.data.forEach((p) => {
                    const { x, y, z } = this.lglt2xyx(p[0], p[1], radius);
                    const particle = this.v3(x, y, z);
                    points.vertices.push(particle);
                });
                const cloud = this.createPoints(points, params, mapParam);
                cloudGroup.add(cloud);
            }
            return cloudGroup;
        },
        addPath(data) {
            data.forEach((path, rank) => {
                const points = path.points.split(';');
                const list = points.map((p) => {
                    p = p.split(',');
                    const lng = p[0];
                    const lat = p[1];
                    const result = this.lglt2xyx(lng, lat, radius + 0.1);
                    return result;
                });
                this.drawPath(list, rank);
            });
        },
        drawPath(list, rank) { // 绘制线路
            const lineGeom = new THREE.Geometry();
            list.forEach((p) => {
                lineGeom.vertices.push(p);
            });
            const lineMat = new THREE.LineBasicMaterial({
                color: 0xFFD700,
                opacity: 0.2,
                transparent: true,
            });
            const line = new THREE.Line(lineGeom, lineMat);
            pathGroup.add(line);
            this.drawPathFlow(list, rank);
            // this.drawPathFlow2(list);
            globalGroup.add(pathGroup);
        },
        drawPathFlow(list, rank) { // 线路流动效果
            const length = list.length;
            const frag = Math.round(list.length / 5);
            const pointsGeom = new THREE.Geometry(); // 线路轨迹动画点
            for (let i = 0; i < frag; i++) {
                pointsGeom.vertices.push(this.v3(0, 0, 0));
            }
            const mapParam = [{
                pro: 0,
                color: 'rgba(255,215,0,1)',
            }, {
                pro: 0.9,
                color: 'rgba(255,255,255,0.5)',
            }, {
                pro: 1,
                color: 'rgba(0,0,0,1)',
            }];
            let pointSize = 0.2;
            if (rank < 50) {
                pointSize = 0.3;
            } else if (rank >= 50 && rank < 200) {
                pointSize = 0.25;
            }
            const points = this.createPoints(pointsGeom, {
                color: 0xffffff,
                size: pointSize,
                depthTest: false,
            }, mapParam);

            const _this = this;
            const initData = { index: 0 };
            function onUpdate() {
                const I = Math.floor(this.index);
                const vertices = [];
                for (let i = I; i > I - frag; i--) {
                    if (list[i]) {
                        vertices.push(list[i]);
                    } else {
                        vertices.push(_this.v3(500, 500, 500));
                    }
                }
                points.geometry.vertices = vertices;
                points.geometry.verticesNeedUpdate = true;
            }
            function onComplete() {
                initData.index = 0;
            }
            const duration = 2000;
            const delay = Math.floor(Math.random() * duration * 2);
            // const delay = duration / 2;
            const tween = new TWEEN.Tween(initData)
                .to({ index: length + frag }, duration)
                .delay(delay)
                .onUpdate(onUpdate)
                .onComplete(onComplete);
            tween.chain(tween);
            pathGroup.add(points);
            tween.start();
        },
        initGUI() {
            const gui = new GUI();
            const controls = {
                cameraX: this.camera.position.x,
                cameraY: this.camera.position.y,
                cameraZ: this.camera.position.z,
                lookX: 64,
                lookY: 20,
                lookZ: 150,
                fogFar: 300,
            };
            let x = controls.lookX;
            let y = controls.lookY;
            let z = controls.lookZ;
            const lookAt = () => {
                this.camera.lookAt(this.v3(x, y, z));
            };
            gui.add(controls, 'cameraX', -200, 200).onChange((e) => {
                this.camera.position.x = e;
            });
            gui.add(controls, 'cameraY', -200, 200).onChange((e) => {
                this.camera.position.y = e;
            });
            gui.add(controls, 'cameraZ', -200, 200).onChange((e) => {
                this.camera.position.z = e;
            });
            gui.add(controls, 'lookX', -200, 200).onChange((e) => {
                x = e;
                lookAt();
            });
            gui.add(controls, 'lookY', -200, 200).onChange((e) => {
                y = e;
                lookAt();
            });
            gui.add(controls, 'lookZ', -200, 200).onChange((e) => {
                z = e;
                lookAt();
            });
            gui.add(controls, 'fogFar', 0, 2000).onChange((e) => {
                this.scene.fog = new THREE.Fog(0xffffff, 0.015, e);
            });
        },
    },
    mounted() {
        this.initWebGL();
        this.queryData();
    },
};
</script>
<style lang='less' scoped>
.container {
    position: relative;
    height: 100%;

    #WebGL-output {
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    .map-bar{
        position: absolute;
        width: 100%;
        height: .86rem;
        display:flex;
        justify-content: center;
        align-items: center;
        top:0;
        .truck-status{
            font-size: .18rem;
            color: #7782AC;
            margin-right: .7rem;
            .icon{
                margin-top: .19rem;
                width: .18rem;
                height: .18rem;
                float: left;
                margin-right: .1rem;
                border-radius: 50%;
                &.moving{
                    background-image: linear-gradient(-180deg, #19D190 0%, #0D8477 100%);
                }
                &.stop{
                    background-image: linear-gradient(45deg, #2934CE 0%, #86B0FF 100%);
                }
                &.offline{
                    background-image: linear-gradient(45deg, #303A61 0%, #64709F 100%);
                }
            }
            .num{
                font-size: .32rem;
                margin-left: .1rem;
                color: #C7CFEE;
            }
        }
    }
}
</style>