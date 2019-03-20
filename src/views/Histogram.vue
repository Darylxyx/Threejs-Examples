<template>
    <div class='container'>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
        <canvas id='canvas'></canvas>
    </div>
</template>
<script>
// import { GUI } from 'dat.gui';
import mixin from '../mixins/threeMixin.js';

const PI = Math.PI;
const mainGroup = new THREE.Group();
const labelGroup = new THREE.Group();
const dataArr = [];
// const gui = new GUI();
export default {
    mixins: [mixin],
    methods: {
        queryData() {
            for (let i = 0; i < 20; i ++) {
                const num = rd();
                const per = rd(num);
                dataArr.push({
                    main: per,
                    vice: num,
                });
            }
            function rd(range = 10) {
                const val = Math.round(Math.random() * range);
                return val === 0 ? 0.01 : val;
            }
        },
        initWebGL() {
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(this.$refs.canvas, {position: {x: 30, y: 10, z: 35}}, {clearColor: 0xf1f1f1, shadowEnabled: true});
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            const stats = this.initStats(this.$refs.stats);
            const columnList = this.addColumn();
            this.addLight();
            this.addAxis();

            this.linstenMouseMove(columnList);
            // this.addAxes(50);

            const control = this.addControl();
            const clock = new THREE.Clock();

            mainGroup.add(labelGroup);
            scene.add(mainGroup);

            const renderScene = () => {
                stats.update();
                const delta = clock.getDelta();
                control.update(delta);
                // camera.rotation.z = 0;
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };

            renderScene();
        },
        addColumn() { // 添加柱状图
            const columnList = [];
            const columnGroup = new THREE.Group();
            dataArr.forEach((item, index) => {
                const mainMat = this.initMaterial('MeshLambert', {
                    color: 0x74B6E1,
                });
                const viceMat = this.initMaterial('MeshLambert', {
                    color: 0xFFB75F,
                });
                const mainColumn = this.initGeometry('Box', 1.4, item.main, 2);
                const mainMesh = new THREE.Mesh(mainColumn, mainMat);
                mainMesh.selfValue = Math.floor(item.main);
                mainMesh.position.set(index * 2, item.main / 2, 0);
                mainMesh.castShadow = true;
                mainMesh.receiveShadow = true;
                const viceColumn = this.initGeometry('Box', 1.4, item.vice, 2);
                const viceMesh = new THREE.Mesh(viceColumn, viceMat);
                viceMesh.selfValue = Math.floor(item.vice);
                viceMesh.position.set(index * 2, item.vice / 2, -3);
                viceMesh.castShadow = true;
                viceMesh.receiveShadow = true;
                columnGroup.add(mainMesh);
                columnGroup.add(viceMesh);
                columnList.push(mainMesh);
                columnList.push(viceMesh);
            });
            columnGroup.position.set(1, 0, 4.5);
            mainGroup.add(columnGroup);
            return columnList;
        },
        addLight() {
            const ambientLight = this.initLight('Ambient', {color: 0xeeeeee});
            const target = this.initTarget(30, 0, 0);
            const directionalLight = this.initLight('Directional', {
                color: 0x919191,
                position: {x: 70, y: 30, z: 30},
                castShadow: true,
                shadow: {
                    camera: {
                        near: 2,
                        far: 120,
                        left: -20,
                        right: 20,
                        top: 25,
                        bottom: -20,
                    },
                    mapSize: {
                        width: 2048,
                        height: 2048,
                    },
                },
            });
            directionalLight.target = target;
            // const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
            // this.scene.add(helper);
            mainGroup.add(ambientLight);
            mainGroup.add(directionalLight);
            this.light = directionalLight;
        },
        addAxis() { // 绘制坐标系
            const axisGroup = new THREE.Group();
            const v3 = this.v3;
            // 最大边界
            const X = 40;
            const Y = 12;
            const Z = 6;

            //底面四点
            const b1 = v3(0, 0, 0);
            const b2 = v3(X, 0, 0);
            const b3 = v3(X, 0, Z);
            const b4 = v3(0, 0, Z);

            //顶面四点 
            const t1 = v3(0, Y, 0);
            const t2 = v3(X, Y, 0);
            const t3 = v3(X, Y, Z);
            const t4 = v3(0, Y, Z);

            // 与x轴垂直的轴线
            const xLineArr = [];
            for (let i = 5; i <= X; i += 4) {
                const p1 = v3(i, 0, Z + 0.6);
                const p2 = v3(i, 0, 0);
                const p3 = v3(i, Y, 0);
                xLineArr.push([p1, p2, p3]);
                this.addAxisLabel(Math.floor(i / 2 + 1), i, 0, Z + 2);
            }

            // 与y轴垂直的轴线
            const yLineArr = [];
            for (let i = 0; i <= Y; i += 3) {
                const p1 = v3(0, i, 0);
                const p2 = v3(X, i, 0);
                const p3 = v3(0, i, Z + 0.6);
                yLineArr.push([p3, p1, p2]);
                this.addAxisLabel(i, 0, i, Z + 2);
            }

            // 与z轴垂直的轴线
            const zLineArr = [];
            for (let i = 0; i < Z; i += 3) {
                const p1 = v3(X + 0.6, 0, i);
                const p2 = v3(0, 0, i);
                const p3 = v3(0, Y, i);
                zLineArr.push([p1, p2, p3]);
                const text = i === 0 ? '高风险次数' : '风险干预次数';
                this.addAxisLabel(text, X + 1.5, 0, i + 1.2);
            }

            const pointArr = [
                [t4, b4, b3, b2],
                ...xLineArr,
                ...yLineArr,
                ...zLineArr,
            ];
            pointArr.forEach((arr, index) => {
                arr.forEach((p, i) => {
                    const nextP = arr[i+1];
                    if (!nextP) return;
                    const line = this.initLine([p, nextP], {
                        color: index === 0 ? 0x000000 : 0xC0C0C0,
                    });
                    axisGroup.add(line);
                })
            });
            mainGroup.add(axisGroup);
        },
        addAxisLabel(msg, x, y, z) { // 坐标标注
            const text = this.textSprite(msg, {
                scale: 2.5,
            });
            text.position.set(x, y, z);
            labelGroup.add(text);
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
        addAxes(len) { // 默认辅助坐标系
            const axes = this.initAxes(len);
            this.scene.add(axes);
        },
        addTarget(x, y, z) {
            const target = new THREE.Object3D();
            target.position.set(x, y, z);
            mainGroup.add(target);
            return target;
        },
        linstenMouseMove(objList) {
            let prevTarget = null;
            let prevColor = this.color(0xffffff);
            let targetValue = null;
            this.listenEvent('mousemove', this.camera, objList, (target) => {
                if (target.length < 1) {
                    mainGroup.remove(targetValue);
                    if (prevTarget) {
                        prevTarget.material.color = prevColor;
                        prevTarget = null;
                    }
                    return;
                }
                target = target[0].object;
                if (prevTarget === target) {
                    return;
                } else {
                    if (prevTarget) {
                        prevTarget.material.color = prevColor;
                        mainGroup.remove(targetValue);
                    }
                    prevColor = target.material.color;
                    target.material.color = this.color(0xDC143C);
                    targetValue = this.textSprite(target.selfValue, {
                        textColor: '#DC143C',
                        scale: 4,
                    });
                    const { x, y, z } = target.position;
                    targetValue.position.set(x + 1, y * 2 + 0.5, z + 4.5);
                    mainGroup.add(targetValue);
                    prevTarget = target;
                }
            });
        },
        initGUI() {
            const controls = new function() {
                this.color = 0xffffff;
            };
            gui.addColor(controls, 'color').onChange((e) => {
                this.light.color = this.color(e);
            });
        },
    },
    mounted() {
        this.queryData();
        this.initWebGL();
    },
}
</script>
<style lang='less' scoped>
.container {
    width: 100%;
    height: 100%;
    #WebGL-output {
        height: 100%;
    }
    .num-tips {
        position: absolute;
        left: 50%;
        padding: 2px 3px;
        background-color: red;
        font-size: 18px;
    }
}
#canvas {
    position: absolute;
    z-index: 999;
    top: 0;
    right: 0;
}
</style>