<template>
    <div class='container'>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
        <div id='tvmap'></div>
    </div>
</template>
<script>
import TWEEN from 'tween.js';
import { GUI } from 'dat.gui';
import mixin from '../mixins/index.js';
import math from '../mixins/math.js';
import provinceJSON from '../../static/province.js';

const PI = Math.PI;
const radius = 100;
const clock = new THREE.Clock();
const mainGroup = new THREE.Group(); // 顶级组
const lineGroup = new THREE.Group(); // 地图边界线组
const sphereGroup = new THREE.Group(); //地球组
const pointsGroup = new THREE.Group(); // 车辆坐标点组
const scanGroup = new THREE.Group(); // 扫描线组
export default {
    mixins: [mixin, math],
    methods: {
        async initMap() {
            mainGroup.add(lineGroup);
            mainGroup.add(pointsGroup);
            await this.queryData();
            this.animateStart();
            // this.drawTube();
        },
        queryData() {
            return new Promise((solve) => {
                const mapBoundary = new window.BMap.Boundary();
                const provinceList = provinceJSON.map(item => item.name);
                const promises = provinceList.map((name) => {
                    return new Promise((resolve, reject) => {
                        mapBoundary.get(name, (res) => {
                            let result = res.boundaries;
                            if (name === '台湾省') {
                                result.pop();
                            }
                            lineGroup.add(this.drawMap(name, result));
                            pointsGroup.add(this.drawPoints(name, result));
                            resolve();
                        });
                    });
                });
                Promise.all(promises).then(() => {
                    solve();
                });
            });
        },
        initWebGL() {
            const {
                scene,
                camera,
                renderer
            } = this.initBasics(this.$refs.canvas, {position: {x: -50, y: 70, z: -150}}, {clearColor: 0x000000});
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            camera.lookAt(this.v3(0, 0, 200));
            console.log(camera.lookAt);
            this.scene.add(mainGroup);

            // this.addAxes();
            const stats = this.initStats(this.$refs.stats);
            // const control = this.addControl();

            this.addLight(); // 光源

            this.addSphere(); // 地球

            this.addScanLine(); // 扫描线

            this.addBackground(); // 星空背景

            const renderScene = () => {
                stats.update();
                const delta = clock.getDelta();
                // control.update(delta);
                TWEEN.update();
                scanGroup.rotation.x += 0.015;
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };
            renderScene();
        },
        addAxes() {
            const axes = this.initAxes(150);
            mainGroup.add(axes);
        },
        addLight() { // 光源
            const lightGroup = new THREE.Group();
            const ambientLight = this.initLight('Ambient', {
                color: 0x330000,
            });
            const directionalLight = this.initLight('Directional', {
                color: 0xffffff,
                position: {x: -700, y: 100, z: -200},
                shadow: {
                    camera: {
                        near: 2,
                        far: radius * 2.5,
                        left: -radius,
                        right: radius,
                        top: radius,
                        bottom: -radius,
                    },
                },
            });
            directionalLight.target = this.initTarget(0, 80, 0);
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
            const normal = this.loadTexture(require('../assets/img/planets/EarthNormal.png'));
            const mat = this.initMaterial('MeshPhong', {color: 0x134B60});
            mat.normalMap = normal;
            mat.normalScale.set(1, 1);
            const sphere = new THREE.Mesh(geom, mat);
            sphereGroup.add(sphere);
            mainGroup.add(sphereGroup);
        },
        addScanLine() {
            for (let i = 0; i < 10; i++) {
                const geom = this.initGeometry('Circle', radius + 0.5, 40, 0, PI);
                const mat = new THREE.LineBasicMaterial({
                    color: 0xF5F5F5,
                    opacity: i / 15,
                    transparent: true,
                });
                const scanLine = new THREE.Line(geom, mat);
                scanLine.rotation.x += i * 0.02;
                scanGroup.add(scanLine);
            }
            // scanGroup.rotation.z += PI / 2;
            mainGroup.add(scanGroup);
        },
        addBackground() {
            const backGroup = new THREE.Group();
            const geom = this.initGeometry('Sphere', radius * 2, 40, 40);
            const texture = this.loadTexture(require('../assets/img/starfield.jpg'));
            const mat = this.initMaterial('MeshBasic', {
                side: THREE.BackSide,
            });
            mat.map = texture;
            const background = new THREE.Mesh(geom, mat);
            background.rotation.y = PI / 2;
            background.rotation.x = - PI / 2;
            backGroup.add(background);
            mainGroup.add(backGroup);
        },
        drawMap(name, pointsArr) {
            const pList = [];
            let maxArr = [];
            pointsArr.forEach((list) => { // 取最长的数据使用
                const arr = list.split(';');
                if (arr.length > maxArr.length) maxArr = arr;
            });
            maxArr.forEach((point) => {
                if (point.indexOf(', ') > -1) {
                    point = point.split(', ');
                } else {
                    point = point.split(',');
                }
                const lng = point[0];
                const lat = point[1];
                const {x, y, z} = this.lglt2xyx(lng, lat, radius);
                const particle = this.v3(x, y, z);
                pList.push(particle);
            });
            let lineColor = 0x145385;
            if (name === '中国' || name === '台湾省') { // 轮廓加粗
                lineColor = 0x6EFFFF;
            }
            const line = this.initLine(pList, {
                color: lineColor,
                linewidth: 1,
                transparent: true,
                opacity: 0.6,
            });
            if (name === '中国') {
                // this.drawPath(pList);
            }
            return line;
        },
        drawPoints(name, pointsArr) {
            const points = new THREE.Geometry();
            let maxArr = [];
            pointsArr.forEach((list) => { // 取最长的数据使用
                const arr = list.split(';');
                if (arr.length > maxArr.length) maxArr = arr;
            });
            const point = maxArr.length && maxArr[0].split(', ');
            const lng = point[0];
            const lat = point[1];
            const {x, y, z} = this.lglt2xyx(lng, lat, radius);
            const particle = this.v3(x, y, z);
            points.vertices.push(particle);
            const cloud = this.createPoints(points, {
                size: 1,
                map: null,
                color: 0xFFD700,
            });
            // console.log(cloud);
            const {tween, tweenBack} = this.initTween(cloud);
            cloud.geometry.vertices[0].tween = tween;
            cloud.geometry.vertices[0].tweenBack = tweenBack;
            return cloud;
        },
        drawPath(list) {
            const pathGroup = new THREE.Group();
            const colors = list.map((item, index) => {
                return this.color(0xffffff);
            });
            const actColors = [];
            for (let i = 0; i < 200; i++) {
                actColors.push(this.color(0xFFD700));
            }
            const line = this.initLine(list, {
                // color: 0xFFD700,
                vertexColors: THREE.VertexColors,
            });
            line.geometry.colors = colors;
            console.log(line);

            const _this = this;
            let prevI = 0;
            let obj = {index: 0};
            const gold = this.color(0xFFD700);
            const white = this.color(0xffffff); 
            function onUpdate() {
                const I = Math.floor(this.index);
                for (let i = prevI; i <= I; i++) {
                    line.geometry.colors[i] = gold;
                }
                if (I >= 800) {
                    for (let i = 0; i < I - 800; i++) {
                        line.geometry.colors[i] = white;
                    }
                }
                prevI = I;
                line.geometry.colorsNeedUpdate = true;
            }

            function onStop() {
                obj = {index: 0};
                prevI = 0;
                line.geometry.colors = colors;
                line.geometry.colorsNeedUpdate = true;
            }

            const tween = new TWEEN.Tween(obj)
                .to({index: colors.length}, 10000)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate(onUpdate)
                .onStop(onStop);
                tween.chain(tween);
            pathGroup.add(line);
            mainGroup.add(pathGroup);

            tween.start();
        },
        animateStart() {
            pointsGroup.children.forEach((p) => {
                const vertices = p.geometry.vertices;
                vertices.forEach((v, i) => {
                    v.tween.start();
                });
            });
        },
        initTween(points) {
            const opaSrc = {opacity: 0};
            const duration = 500;
            const backDuration = 1000;
            const delay = Math.floor(Math.random() * backDuration) + 2000;

            function onUpdate() {
                points.material.opacity = this.opacity;
            }

            const tween = new TWEEN.Tween(opaSrc)
                .to({opacity: 1}, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .delay(delay)
                .onUpdate(onUpdate);
            
            const tweenBack = new TWEEN.Tween(opaSrc)
                .to({opacity: 0}, backDuration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate(onUpdate);

            tween.chain(tweenBack);
            tweenBack.chain(tween);

            return {
                tween,
                tweenBack,
            };
        },
        initGUI(pointsGroup) {
            const gui = new GUI();
            const controls = new function() {
                this.opacity = 1;
            };
            gui.add(controls, 'opacity', 0, 1).onChange((e) => {
                // this.light.color = this.tc(e);
                pointsGroup.children.forEach((p) => {
                    p.material.opacity = e;
                });
            });
        },
    },
    mounted() {
        this.initWebGL();
        this.initMap();
    },
};
</script>
<style lang='LESS' scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;

    #WebGL-output {
        width: 100%;
        height: 100%;
    }
}
</style>