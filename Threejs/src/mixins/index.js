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
            const cpDefault = {fov: 50, near: 0.1, far: 1000, x: -30, y: 40, z: 30}; // fov: 视场角度；near: 近边距离；far: 远边距离
            const cp = Object.assign(cpDefault, cameraParams);
            const camera = new THREE.PerspectiveCamera(cp.fov, W / H, cp.near, cp.far);
            camera.position.x = cp.x;
            camera.position.y = cp.y;
            camera.position.z = cp.z;
            camera.lookAt(scene.position);
            // 渲染器
            const renderer = new THREE.WebGLRenderer();
            const rpDefault = {clearColor: 0xeeeeee, shadowEnabled: false}; // shadowEnabled: 是否开启阴影
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
        initLight(type, color, params = {}) { // 光源类型，颜色，其余参数
            const lights = {};
            const defaults = {x: 0, y: 0, z: 0};

            lights.ambient = () => { // 环境光
                const ambientLight = new THREE.AmbientLight(color);
                return ambientLight;
            };

            lights.point = () => { // 点光源
                const pl = Object.assign(defaults, params);
                const pointLight = new THREE.PointLight(color);
                pointLight.position.set(pl.x, pl.y, pl.z);
                return pointLight;
            };

            lights.spot = () => { // 聚光灯光源
                const sl = Object.assign(defaults, params);
                const spotLight = new THREE.SpotLight(color);
                spotLight.position.set(sl.x, sl.y, sl.z);
                return spotLight;
            };

            if (typeof lights[type] === 'function') return lights[type].call(this);
        },
        V3(x, y, z) { // 创建 Vector3 对象
            return new THREE.Vector3(x, y, z);
        },
        F3(p1, p2, p3) { // 创建 Face3 对象
            return new THREE.Face3(p1, p2, p3);
        },
    },
};