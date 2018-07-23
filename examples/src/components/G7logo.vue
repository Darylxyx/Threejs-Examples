<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
    </div>
</template>
<script>
import TWEEN from 'tween.js';
import { GUI } from 'dat.gui';
import mixin from '../mixins/index';

const PI = Math.PI;

export default {
    mixins: [mixin],
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            isAnimating: false
        };
    },
    methods: {
        initWebGL() {
            const {
                scene,
                camera,
                renderer
            } = this.initBasics(this.$refs.canvas, {position: {x: 0, y: 0, z: 300}}, {clearColor: 0x000000});
            this.scene = scene;
            this.camera = camera;
            this.render = renderer;
            // this.addAxes(scene);

            const stats = this.initStats();

            this.geom = this.addGeom();

            const circle = this.addCircle();

            this.points = this.addPoints();
            // console.log(points);

            this.listenClick(camera, [circle], (target) => {
                this.movePoints();
            });

            setTimeout(() => {
                this.animateStart();
            }, 2000);

            // 动画
            const controls = this.addControls(camera);
            const clock = new THREE.Clock();
            const renderScene = () => {
                stats.update();
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
            const geom = this.initGeometry('Sphere', 100, 30, 30);
            return geom;
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
            const cloud = this.createPointCloud(points);
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
        createPointCloud(geom) {
            var material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 3,
                transparent: true,
                blending: THREE.AdditiveBlending,
                map: this.generateSprite(),
                fog: true,
            });

            var cloud = new THREE.Points(geom, material);
            cloud.sortParticles = true;
            return cloud;
        },
        generateSprite() {
            var canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;

            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.9, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
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
            });
            return controls;
        },
    },
    mounted() {
        this.initWebGL();
    },
};
</script>
<style lang='LESS' scoped>
#WebGL-output{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>