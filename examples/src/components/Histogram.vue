<template>
    <div class='container'>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
// import { GUI } from 'dat.gui';
import mixin from '../mixins/index';

const PI = Math.PI;
const mainGroup = new THREE.Group();
const dataArr = [];
// const gui = new GUI();
export default {
    mixins: [mixin],
    methods: {
        queryData() {
            for (let i = 0; i < 30; i ++) {
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
            } = this.initBasics(this.$refs.canvas, {position: {x: 30, y: 10, z: 40}}, {clearColor: 0xf1f1f1, shadowEnabled: true});
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

            // const text = this.textSprite('Hello Threejs');
            // scene.add(text);

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
        addColumn() {
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
                mainMesh.position.set(index * 2, item.main / 2, 0);
                mainMesh.castShadow = true;
                mainMesh.receiveShadow = true;
                const viceColumn = this.initGeometry('Box', 1.4, item.vice, 2);
                const viceMesh = new THREE.Mesh(viceColumn, viceMat);
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
            const target = this.addTarget(30, 0, 0);
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
            const h = 12;
            
            const p1 = v3(0, 0, 6); // 底面四个点
            const p2 = v3(60, 0, 6);
            const p3 = v3(60, 0, 0);
            const p4 = v3(0, 0, 0);
            const p5 = v3(0, h, 6);
            const p6 = v3(60, h, 6);
            const p7 = v3(60, h, 0);
            const p8 = v3(0, h, 0);

            const pointArr = [
                [p1, p2, p3, p4, p1, p5, p8, p7, p6],
                [p2, p6],
                [p3, p7],
                [p4, p8],
            ];
            pointArr.forEach((arr) => {
                arr.forEach((p, i) => {
                    const nextP = arr[i+1];
                    if (!nextP) return;
                    console.log(p);
                    const line = this.initLine([p, nextP], {
                        color: 0x000000,
                    });
                    axisGroup.add(line);
                })
            });
            mainGroup.add(axisGroup);
        },
        addControl() { // 摄影机控制器
            const control = this.initControls('Trackball', this.camera, {
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
                target: {x: 30, y: 10, z: 0},
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
            this.listenEvent('mousemove', this.camera, objList, (target) => {
                if (target.length < 1) {
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
                    }
                    prevColor = target.material.color;
                    target.material.color = this.color(0xDC143C);
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
        }
    },
    mounted() {
        this.queryData();
        this.initWebGL();
        // this.initGUI();
    },
}
</script>
<style lang='LESS' scoped>
.container {
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
</style>