import Stats from 'stats.js';
import 'three/examples/js/controls/TrackballControls';

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
            const renderer = new THREE.WebGLRenderer({antialias: true});
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
        initStats(dom) { // 创建性能检测器
            const stats = new Stats();
            const sd = stats.domElement;
            stats.setMode(0);
            sd.style.position = 'absolute';
            sd.style.left = '15px';
            sd.style.top = '0';
            dom.appendChild(sd);
            return stats;
        },
        initLight(type, params = {}) { // 光源类型，颜色，其余参数
            let light;
            const constructor = `${type}Light`;
            if (!this.constructorCheck(constructor)) return;
            light = new THREE[constructor]();
            assignment(light, params);
            return light;
        },
        initMaterial(type, params = {}) { // 创建材质
            let material;
            const constructor = `${type}Material`;
            if (!this.constructorCheck(constructor)) return;
            material = new THREE[constructor]();
            assignment(material, params);
            return material;
        },
        initGeometry(type, ...params) { // 创建几何图形
            let geometry;
            const constructor = `${type}Geometry`;
            if (!this.constructorCheck(constructor)) return;
            // const params = [].slice.call(arguments).slice(1); // ESLint 不支持 arguments 对象
            geometry = new THREE[constructor](...params);
            return geometry;
        },
        initLine(pointsList, params = {}) { // 创建线
            const lines = new THREE.Geometry();
            pointsList.forEach((p) => {
                lines.vertices.push(p);
            });
            const mat = new THREE.LineBasicMaterial(params);
            const line = new THREE.Line(lines, mat);
            return line;
        },
        initTarget(x, y, z) { // 创建目标点
            const target = new THREE.Object3D();
            target.position.set(x, y, z);
            return target;
        },
        v2(x, y) { // 创建 Vector2 对象
            return new THREE.Vector2(x, y);
        },
        v3(x, y, z) { // 创建 Vector3 对象
            return new THREE.Vector3(x, y, z);
        },
        f3(p1, p2, p3) { // 创建 Face3 对象
            return new THREE.Face3(p1, p2, p3);
        },
        color(color) { // 创建 Color 对象
            return new THREE.Color(color);
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
        constructorCheck(target) { // 验证THREE对象下是否有指定构造器
            let result = true;
            if (typeof THREE[target] !== 'function') {
                console.warn(`THREE.${target} is not a constructor.`);
                result = false;
            }
            return result;
        },
        createMultiMaterialObject(geometry, materials) { 
            var group = new THREE.Group();
            for ( var i = 0, l = materials.length; i < l; i ++ ) {
                group.add( new THREE.Mesh( geometry, materials[ i ] ) );
            }
            return group;
        },
        initControls(type, camera, params = {}) { // 初始化相机控制器
            let control;
            const constructor = `${type}Controls`;
            if (!this.constructorCheck(constructor)) return;
            control = new THREE[constructor](camera);
            assignment(control, params);
            return control;
        },
        listenEvent(eventName, camera, objList, callback) { // 监听鼠标&键盘行为
            function handleEvent(event) {
                let vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
                vector = vector.unproject(camera);
                const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
                const intersects = raycaster.intersectObjects(objList);
                callback && callback(intersects);
            }
            document.addEventListener(eventName, handleEvent, false);
        },
        loadTexture(path) { // 材质loader
            return new THREE.TextureLoader().load(path);
        },
        createPoints(geom, matParam = {}, mapParam = []) { // 创建粒子云
            const defaults = {
                color: 0xffffff,
                size: 1,
                transparent: true,
                blending: THREE.AdditiveBlending,
                map: this.generateSprite(mapParam),
            };
            matParam = Object.assign({}, defaults, matParam);
            const material = new THREE.PointsMaterial(matParam);
            const cloud = new THREE.Points(geom, material);
            cloud.sortParticles = true;
            return cloud;
        },
        generateSprite(params) { // 粒子云材质 map 函数
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            
            const defaults = [{
                pro: 0,
                color: '#fff',
            }, {
                pro: 0.9,
                color: 'rgba(255, 255, 255, 1)',
            }, {
                pro: 1,
                color: '#000',
            }];
            const colorList = params.length ? params : defaults;
            colorList.forEach((item) => {
                gradient.addColorStop(item.pro, item.color);
            });

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        },
        // textSprite(message, params = {}) {
        //     const defaults = {
        //         fontface: 'Arial',
        //         fontsize: 16,
        //         borderThickness: 4,
        //         textColor: this.tc(0x000000),
        //     };
        //     params = Object.assign({}, defaults, params);
        //     const canvas = document.createElement('canvas');
        //     const context = canvas.getContext('2d');
        //     context.font = "Bold " + params.fontsize + "px " + params.fontface;
        //     canvas.width = 256;
        //     canvas.height = 128;
        //     context.lineWidth = params.borderThickness;
        //     context.fillStyle = "rgba("+params.textColor.r+", "+params.textColor.g+", "+params.textColor.b+", 1.0)";
        //     context.fillText(message, params.borderThickness, params.fontsize + params.borderThickness);
        //     const texture = new THREE.Texture(canvas)
        //     texture.needsUpdate = true;
        //     const spriteMaterial = new THREE.SpriteMaterial({map: texture});
        //     const sprite = new THREE.Sprite(spriteMaterial);
        //     sprite.scale.set(0.5 * params.fontsize, 0.25 * params.fontsize, 0.75 * params.fontsize);
        //     return sprite;
        // }
    },
};