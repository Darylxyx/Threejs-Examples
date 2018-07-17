import * as THREE from 'three';
import Stats from 'stats.js';

const setList = ['position', 'rotation', 'scale']; // 需要通过 set 方法来设置的属性列表
function assignment(target, params = {}, prevKey) {
    const keys = Object.keys(params);
    keys.forEach((key) => {
        const value = params[key];
        if (setList.indexOf(key) > -1) {
            target[key].set(value.x, value.y, value.z);
            return;
        }
        if (key === 'color') { // 颜色属性只能通过 THREE.Color 赋值
            target[key] = new THREE.Color(value);
            return;
        }
        let nextTarget;
        if (!prevKey) { // 顶层
            nextTarget = target;
        } else {
            if (!target[prevKey]) target[prevKey] = {};
            nextTarget = target[prevKey];
        }
        if (typeof value === 'object') {
            assignment(nextTarget, value, key);
        } else {
            nextTarget[key] = value;
        }
    });
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

            this.listenResize(canvasDom, camera, renderer);

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
        initLight(type, params = {}, debug) { // 光源类型，颜色，其余参数
            let light;
            const constructor = `${type}Light`;
            if (typeof THREE[constructor] === 'function') {
                light = new THREE[constructor]();
                assignment(light, params);
            }
            return light;
        },
        initMaterial(type, params = {}) {
            let material;
            const constructor = `${type}Material`;
            if (typeof THREE[constructor] === 'function') {
                material = new THREE[constructor]();
                assignment(material, params);
            }
            return material;
        },
        initGeometry(material, params) {
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
        createMultiMaterialObject( geometry, materials) {
            var group = new THREE.Group();
            for ( var i = 0, l = materials.length; i < l; i ++ ) {
                group.add( new THREE.Mesh( geometry, materials[ i ] ) );
            }
            return group;
        },
    },
};