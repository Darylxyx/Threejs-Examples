import * as THREE from 'three';
import Stats from 'stats.js';

function assignment(target, params = {}) { // 给对象赋值
    for (const attr in params) {
        const val = params[attr];
        switch(attr) {
            case 'position':
            case 'rotation':
                target[attr].set(val.x, val.y, val.z);
                break;
            case 'color':
                target[attr] = new THREE.Color(val);
                break;
            default: 
                target[attr] = val;
                break;
        }
    }
}

export default {
    methods: {
        initBasics(canvasDom, cameraParams, rendererParams) { // 创建场景、相机、渲染器
            const W = canvasDom.offsetWidth;
            const H = canvasDom.offsetHeight;
            // 场景
            const scene = new THREE.Scene();
            // 相机
            const cpDefault = { // fov: 视场角度；near: 近边距离；far: 远边距离
                fov: 50,
                near: 0.1,
                far: 1000,
                aspect: W / H,
                position: {x: -30, y: 40, z: 30},
            };
            const cp = Object.assign(cpDefault, cameraParams);
            const camera = new THREE.PerspectiveCamera(cp.fov, cp.aspect, cp.near, cp.far);
            camera.position.set(cp.position.x, cp.position.y, cp.position.z);
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
            sd.style.left = '15px';
            sd.style.top = '0';
            this.$refs.stats.appendChild(sd);
            return stats;
        },
        initLight(type, params = {}) { // 光源类型，颜色，其余参数
            const lights = {};

            lights.ambient = () => { // 环境光光源
                const defaults = {color: '#fff'};
                const al = Object.assign(defaults, params);
                const ambientLight = new THREE.AmbientLight();
                assignment(ambientLight, al);
                return ambientLight;
            };

            lights.point = () => { // 点光源
                const defaults = {
                    position: {x: 0, y: 0, z: 0},
                    color: '#fff',
                };
                const pl = Object.assign(defaults, params);
                const pointLight = new THREE.PointLight();
                assignment(pointLight, pl);
                return pointLight;
            };

            lights.spot = () => { // 聚光灯光源
                const defaults = {
                    position: {x: 0, y: 0, z: 0},
                    color: '#fff',
                };
                const sl = Object.assign(defaults, params);
                const spotLight = new THREE.SpotLight();
                assignment(spotLight, sl);
                return spotLight;
            };

            lights.directional = () => { // 平行光光源
                const dl = Object.assign(defaults, params);
                const directionalLight = new THREE.DirectionalLight(color);
                directionalLight.position.set(dl.x, dl.y, dl.z);
                return directionalLight;
            };

            if (typeof lights[type] === 'function') return lights[type].call(this);
        },
        initCube(params = {}) { // 创建块对象
            const defaults = {
                length: 5, width: 5, height: 5,
                positionX: 0, positionY: 0, positionZ: 0,
                rotationX: 0, rotationY: 0, rotationZ: 0,
                material: 'Lambert',
                color: '#fff',
                castShadow: false,
            };
            const p = Object.assign(defaults, params);
            const cubeGeometry = new THREE.CubeGeometry(p.length, p.width, p.height);
            const Material = THREE[`Mesh${p.material}Material`];
            if (typeof Material !== 'function') return null;
            const cubeMaterial = new Material({color: p.color});
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(p.positionX, p.positionY, p.positionZ);
            cube.rotation.set(p.rotationX, p.rotationY, p.rotationZ);
            cube.castShadow = p.castShadow;
            return cube;
        },
        v3(x, y, z) { // 创建 Vector3 对象
            return new THREE.Vector3(x, y, z);
        },
        f3(p1, p2, p3) { // 创建 Face3 对象
            return new THREE.Face3(p1, p2, p3);
        },
        listenResize(canvasDom, camera, renderer) { // 窗口自适应
            function onResize() {
                const W = canvasDom.offsetWidth;
                const H = canvasDom.offsetHeight;
                camera.aspect = W / H;
                camera.updateProjectionMatrix();
                renderer.setSize(W, H);
            }
            window.addEventListener('resize', onResize, false);
        },
    },
};