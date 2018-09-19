<template>
    <div>
        <div ref='stats'></div>
        <div ref='card' class='card'>
            <p>名称: {{dataInfo.name || '-'}}</p>
            <p>占比: {{dataInfo.percent || '-'}}</p>
        </div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
import TWEEN from 'tween.js';
import mixin from '../mixins/threeMixin';

const PI = Math.PI;
const cos = Math.cos;
const sin = Math.sin;
const mainGroup = new THREE.Group();
const pieGroup = new THREE.Group();
export default {
    mixins: [mixin],
    data() {
        return {
            dataInfo: {},
        }
    },
    methods: {
        initWebGL() {
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(this.$refs.canvas, { position: { x: 0, y: 25, z: 20 } }, { clearColor: 0xf1f1f1, shadowEnabled: true });
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            const stats = this.initStats(this.$refs.stats); // 添加性能监测

            // this.addAxes(); // 添加坐标轴

            const dataArr = [30, 50, 120, 10, 60];
            this.addPie(dataArr); // 添加饼状图

            this.addLight(); // 添加光源

            this.listenMouseCover(); // 添加光标监听

            scene.add(mainGroup);

            const control = this.addControl();
            const clock = new THREE.Clock();

            const renderScene = () => {
                TWEEN.update();
                stats.update();
                const delta = clock.getDelta();
                control.update();
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };

            renderScene();
        },
        addAxes() {
            const axes = this.initAxes(30);
            mainGroup.add(axes);
        },
        addPie(dataArr) {
            let total = 0;
            dataArr.forEach((value) => {
                total += value;
            });
            const options = {
                depth: 0.5,
                bevelThickness: 1,
                bevelSize: 0,
                bevelSegments: 3,
                bevelEnabled: true,
                curveSegments: 12,
                steps: 1
            };
            let start = 0; // 起始绘制点，单位弧度
            const colorList = [0x3098D5, 0x5CDCDF, 0xFFD652, 0xFF9474, 0xE285CB];
            const nameList = ['A', 'B', 'C', 'D', 'E'];
            dataArr.forEach((value, i) => {
                const percent = value / total;
                const target = PI * 2 * percent;
                const shape = this.drawShape(0, target);
                const mat = this.initMaterial('MeshLambert', {color: colorList[i]});
                const geom = new THREE.ExtrudeGeometry(shape, options);
                const pie = new THREE.Mesh(geom, mat);
                // pie.position.z = i * 1;
                pie.rotation.z = start;
                pie.castShadow = true;
                pie.receiveShadow = true;

                pie.dataInfo = {
                    name: nameList[i],
                    percent: `${(percent * 100).toFixed(1)}%`,
                };

                this.bindTween(pie); // 为饼单元绑定tween动画
                pieGroup.add(pie);
                start += target;
            });
            pieGroup.rotation.x = - PI / 2;
            mainGroup.add(pieGroup);
        },
        addControl() {
            const control = this.initControls('Trackball', this.camera, {
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
            });
            return control;
        },
        addLight() {
            const lightGroup = new THREE.Group();
            const ambientLight = this.initLight('Ambient', {color: 0xeeeeee});
            const target = this.initTarget(0, 0, 0);
            lightGroup.add(target);
            const directionalLight = this.initLight('Directional', {
                color: 0xeeeeee,
                intensity: 0.2,
                position: {x: 10, y: 20, z: 10},
                castShadow: true,
                shadow: {
                    camera: {
                        near: 2,
                        far: 40,
                        left: -15,
                        right: 15,
                        top: 15,
                        bottom: -15,
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
            lightGroup.add(ambientLight);
            lightGroup.add(directionalLight);
            mainGroup.add(lightGroup);
        },
        drawShape(start, end) {
            const fragment = Math.round((end - start) / (PI * 2) * 200);
            const vertices = [this.v2(0, 0)];
            for (let i = 0; i <= fragment; i++) {
                const x = 10 * cos(end * i / fragment);
                const y = 10 * sin(end * i / fragment);
                vertices.push(this.v2(x, y));
            }
            const shape = new THREE.Shape(vertices);
            // const shapeGeom = shape.makeGeometry();
            return shape;
        },
        listenMouseCover() {
            const targetList = pieGroup.children;
            let prevPie = null;
            let currentPie = null;
            this.listenEvent('mousemove', this.camera, targetList, (target, e) => {
                // console.log(target);
                if (!target.length) {
                    this.toggleInfo(false, e, {});
                    if (prevPie) {
                        prevPie.tweenIn.stop();
                        prevPie.tweenOut.start();
                        prevPie = null;
                    }
                    return;
                }
                currentPie = target[0].object;
                this.toggleInfo(true, e, currentPie.dataInfo);
                if (currentPie === prevPie) return;

                if (prevPie) {
                    prevPie.tweenIn.stop();
                    prevPie.tweenOut.start();
                }

                currentPie.tweenOut.stop();
                currentPie.tweenIn.start();
                prevPie = currentPie;
            });
        },
        bindTween(target) {
            const duration = 500;
            const obj = { z: target.position.z };
            target.isAnimating = false;

            function onStart() {
                target.isAnimating = true;
            }
            function onUpdate() {
                target.position.z = this.z;
            }
            function onComplete() {
                target.isAnimating = false;
            }
            function onStop() {
                target.isAnimating = false;
            }

            const tweenIn = new TWEEN.Tween(obj)
                .to({ z: 2.5 }, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onStart(onStart)
                .onUpdate(onUpdate)
                .onComplete(onComplete)
                .onStop(onStop);
            target.tweenIn = tweenIn;

            const tweenOut = new TWEEN.Tween(obj)
                .to({ z: 0 }, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onStart(onStart)
                .onUpdate(onUpdate)
                .onComplete(onComplete)
                .onStop(onStop);
            target.tweenOut = tweenOut;
        },
        toggleInfo(type, event, data) {
            const target = this.$refs.card;
            this.dataInfo = data;
            const x = event.clientX;
            const y = event.clientY;
            target.style.top = `${y + 20}px`;
            target.style.left = `${x + 20}px`;
            if (type) {
                target.style.opacity = 1;
            } else {
                target.style.opacity = 0;
            }
        },
        test(x1, y1, x2, y2) {
            const maxX = Math.max(x1, x2);
            const minX = Math.min(x1, x2);
            const maxY = Math.max(y1, y2);
            const minY = Math.min(y1, y2);
            const middleX = (maxX - minX) / 2 + minX;
            const middleY = (maxY - minY) / 2 + minY;
            console.log(middleX, middleY);
            const vectorX = x1 - x2;
            const vectorY = y1 - y2;
            console.log(vectorX, vectorY);
            let orthX;
            let orthY;
            if (vectorX === 0) { // 求正交向量
                orthX = 1;
                orthY = 0;
            } else if (vectorY === 0) {
                orthY = 1;
                orthX = 0;
            } else {
                orthY = 1;
                orthX = - vectorY / vectorX;
                // 单位化
                const len = Math.sqrt(Math.pow(orthX, 2) + Math.pow(orthY, 2));
                console.log(len);
                orthY = orthY / len;
                orthX = orthX / len;
            }
            console.log(orthX, orthY);
            const offset = 3;
            const targetX = middleX + (offset * orthX);
            const targetY = middleY + (offset * orthY);
            console.log(targetX, targetY);
        },
    },
    mounted() {
        this.initWebGL();
        this.test(1, 3, 2, 1);
    }
};
</script>
<style lang='LESS' scoped>
.card {
    padding: 10px;
    background-color: rgba(0,0,0,0.5);
    position: absolute;
    z-index: 3;
    opacity: 0;
    border-radius: 5px;
    transition: all 0.1s linear;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
        font-size: 16px;
        color: #fff;
        line-height: 1;
        text-align: left;
        white-space: nowrap;

        &:first-child {
            margin-bottom: 5px;
        }
    }
}
#WebGL-output{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>