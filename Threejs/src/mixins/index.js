import * as THREE from 'three';
import Stats from 'stats.js';

export default {
    methods: {
        initBasics(canvasDom, cameraParams, rendererParams) { // 创建场景、相机、渲染器
            const W = canvasDom.offsetWidth;
            const H = canvasDom.offsetHeight;
            // 场景
            const scene = new THREE.Scene();
            // 相机
            const cpDefault = {fov: 45, near: 0.1, far: 1000, x: -30, y: 40, z: 30};
            const cp = Object.assign(cpDefault, cameraParams);
            const camera = new THREE.PerspectiveCamera(cp.fov, W / H, cp.near, cp.far);
            camera.position.x = cp.x;
            camera.position.y = cp.y;
            camera.position.z = cp.z;
            camera.lookAt(scene.position);
            // 渲染器
            const renderer = new THREE.WebGLRenderer();
            const rpDefault = {clearColor: 0xeeeeee, shadowEnabled: false};
            const rp = Object.assign(rpDefault, rendererParams);
            renderer.setSize(W, H);
            renderer.setClearColor(rp.clearColor);
            renderer.shadowMap.enabled = rp.shadowEnabled;
            canvasDom.appendChild(renderer.domElement);
            renderer.render(scene, camera);
            return {
                scene,
                camera,
                renderer
            };
        },
        initAxes(length = 30) { // 创建坐标轴
            return new THREE.AxesHelper(length);
        },
        initStats() { // 创建性能检测器
            const stats = new Stats();
            const sd = stats.domElement;
            stats.setMode(0);
            sd.style.position = 'absolute';
            sd.style.left = '0';
            sd.style.top = '0';
            this.$refs.stats.appendChild(sd);
            return stats;
        },
        V3(x, y, z) { // 创建 Vector3 对象
            return new THREE.Vector3(x, y, z);
        },
        F3(p1, p2, p3) { // 创建 Face3 对象
            return new THREE.Face3(p1, p2, p3);
        },
    },
};