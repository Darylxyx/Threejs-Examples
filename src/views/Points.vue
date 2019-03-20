<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
// import { GUI } from 'dat.gui';
// import mixin from '../mixins/index';
import threeMixin from '../mixins/threeMixin';

const TWEEN = window.TWEEN;
const PI = Math.PI;
export default {
    mixins: [threeMixin],
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            isAnimating: true
        };
    },
    methods: {
        async initWebGL() {
            const {
                scene,
                camera,
                renderer
            } = this.initBasics(this.$refs.canvas, {far: 1000, position: {x: 0, y: 0, z: 400}}, {clearColor: 0x000000});
            this.scene = scene;
            this.camera = camera;
            this.render = renderer;

            // scene.fog = new THREE.FogExp2(0xffffff, 100);
            scene.fog = new THREE.Fog(0xffffff, 0.015, 1000);

            // this.addAxes(scene);

            // const stats = this.initStats();

            await this.addGeom();
            // this.geom = this.addGeom();

            const circle = this.addCircle();

            this.points = this.addPoints();
            // console.log(this.points);

            this.listenEvent('click', camera, [circle], (target) => {
                this.movePoints();
            });

            setTimeout(() => {
                this.animateStart();
                setTimeout(() => {
                    this.isAnimating = false;
                }, 1500);
            }, 2000);

            // 动画
            const controls = this.addControls(camera);
            const clock = new THREE.Clock();
            const renderScene = () => {
                // stats.update();
                TWEEN.update();
                this.points.rotation.y += 0.001;
                const delta = clock.getDelta();
                controls.update(delta);
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            }

            renderScene();
        },
        animateStart() {
            const geom = this.points.geometry;
            const vertices = geom.vertices;
            function onUpdate() {
                geom.verticesNeedUpdate = true;
            }
            vertices.forEach((v) => {
                v.tween.onUpdate(onUpdate);
                v.tween.start();
            });
        },
        addGeom() {
            return new Promise((resolve, reject) => {
                const geom = this.initGeometry('Sphere', 110, 30, 30);
                this.geom = geom;
                resolve(geom);
            });
        },
        addCircle() {
            const material = this.initMaterial('MeshNormal', {visible: false});
            const circle = new THREE.Mesh(this.geom, material);
            this.scene.add(circle);
            return circle;
        },
        rdPoint() {
            const range = 800;
            const x = Math.random() * range - range / 2;
            const y = Math.random() * range - range / 2;
            const z = Math.random() * range - range / 2;
            return {x, y, z};
        },
        addPoints() { // 创建点
            const points = new THREE.Geometry();
            const vertices = this.geom.vertices;
            const num = vertices.length;
            for (let i = 0; i < num; i++) {
                const {x, y, z} = this.rdPoint();
                const particle = this.v3(x, y, z);
                const {x: dx, y: dy, z: dz} = vertices[i];
                const target = this.v3(dx, dy, dz);
                points.vertices.push(particle);
                points.vertices[i].tween = this.tweenInit(particle, target);
            }
            const cloud = this.createPoints(points);
            cloud.rotation.set(PI/6, 0, PI/6);
            this.scene.add(cloud);
            return cloud;
        },
        movePoints() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            const duration = 1000;
            const moveAnimate = (type) => { // 0:散开动画 1:聚合动画
                const vertices = this.points.geometry.vertices;
                vertices.forEach((v, i) => {
                    const {x, y, z} = (type === 0) ? this.rdPoint() : this.geom.vertices[i];
                    const particle = this.v3(x, y, z);
                    v.tween.to(particle, duration);
                });
                this.animateStart();
            };
            moveAnimate(0);
            setTimeout(() => {
                moveAnimate(1);
                setTimeout(() => {
                    this.isAnimating = false;
                }, duration * 1.5);
            }, duration*1.5);
        },
        tweenInit(prev, next) {
            const duration = 1000;
            const delay = Math.floor(duration * Math.random() / 2);
            const tween = new TWEEN.Tween(prev).to(next, duration);
            tween.easing(TWEEN.Easing.Sinusoidal.InOut);
            tween.delay(delay);
            return tween;
        },
        addAxes(scene) {
            const axes = this.initAxes(50);
            scene.add(axes);
        },
        addControls(camera) { // 添加相机控制器
            const controls = this.initControls('Trackball', camera, {
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
                // noZoom: true,
            });
            return controls;
        },
    },
    mounted() {
        this.initWebGL();
    },
};
</script>
<style lang='less' scoped>
#WebGL-output{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>