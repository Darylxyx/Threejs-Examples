// 车辆模型
import TWEEN from 'tween.js';
import 'three/examples/js/loaders/OBJLoader.js';
import 'three/examples/js/loaders/MTLLoader.js';
let goodIndex = 0;
export default {
    methods: {
        initTruckParam() { // 初始卡车辆参数
            const params = {
                width: 2,
                height: 2,
                headLength: 1.7,
                trailerLength: 5,
                wheelWidth: 0.55,
                wheelDiameter: 0.4,
                modelScale: 0.04,
                goodSize: 0.4,
                goodOffset: 0.01,
            };
            this.truckParmas = params;
        },
        async createTruck() { // 创建卡车
            this.initTruckParam();
            const truck = await this.loadModel();
            this.headGroup = truck[0];
            this.backGroup = truck[1];
            this.createGoods();
        },
        loadModel() {
            const p = this.truckParmas;
            const headPromise = new Promise((resolve, reject) => {
                const headGroup = new THREE.Group();
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('static/G7Trailer-head.mtl', (mat) => {
                    mat.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(mat);
                    objLoader.load('static/G7Trailer-head.obj', (obj) => {
                        obj.scale.set(p.modelScale, p.modelScale, p.modelScale);
                        headGroup.add(obj);
                        headGroup.position.y = 2.3;
                        resolve(headGroup);
                    });
                });
            });
            const backPromise = new Promise((resolve, reject) => {
                const backGroup = new THREE.Group();
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('static/G7Trailer-logo1.mtl', (mat) => {
                    mat.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(mat);
                    objLoader.load('static/G7Trailer-logo1.obj', (obj) => {
                        obj.scale.set(p.modelScale, p.modelScale, p.modelScale);
                        backGroup.add(obj);
                        backGroup.position.y = 2.3;
                        // backGroup.scale.set(p.modelScale, p.modelScale, p.modelScale);
                        resolve(backGroup);
                    });
                });
            });
            return Promise.all([headPromise, backPromise]);
        },
        createGoods() {
            this.goodsList = [];
            const p = this.truckParmas;
            const matrix = [
                [
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 1, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 0, 0, 0],
                    [1, 1, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [0, 0, 0, 1],
                    [1, 1, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 0, 0, 0],
                    [1, 0, 0, 1],
                    [1, 1, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 1, 0, 1],
                    [1, 1, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [0, 0, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 0, 0, 0],
                    [1, 0, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 1, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [0, 0, 0, 1],
                    [1, 0, 1, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 0, 0, 1],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [0, 0, 0, 1],
                    [1, 0, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [0, 0, 0, 1],
                    [1, 0, 1, 1],
                    [1, 1, 1, 1],
                ],
                [
                    [1, 0, 0, 0],
                    [1, 1, 1, 1],
                ],
            ];
            const initGoods = (x, y, z) => {
                const goodsGeom = this.initGeometry('Cube', p.goodSize, p.goodSize, p.goodSize);
                const goodsMat = this.initMaterial('MeshLambert', {
                    color: 0xFFA500,
                });
                const goods = new THREE.Mesh(goodsGeom, goodsMat);
                goods.scale.set(0.001, 0.001, 0.001);
                goods.inTween = this.initGoodTween(goods, goodIndex, {scale: 0.001}, {scale: 1});
                goods.inTween.onComplete(() => {
                    this.goodsGroup.add(goods);
                });
                goods.outTween = this.initGoodTween(goods, 211 - goodIndex, {scale: 1}, {scale: 0.001});
                goods.outTween.onComplete(() => {
                    this.goodsGroup.remove(goods);
                });
                goods.position.set(x, y, z);
                this.goodsList.push(goods);
                goodIndex++;
            };
            matrix.forEach((z, zi) => {
                for (let yi = z.length - 1; yi > -1; yi--) {
                    const y = z[yi];
                    y.forEach((x, xi) => {
                        if (x) {
                            const goodX = (xi - (y.length - 1) / 2) * (p.goodOffset + p.goodSize);
                            const goodY = (z.length - 1 - yi) * (p.goodOffset + p.goodSize) - 1.1;
                            const goodZ = zi * (p.goodSize + p.goodOffset) - 4.5;
                            initGoods(goodX, goodY, goodZ);
                        }
                    });
                }
            });
            this.backGroup.add(this.goodsGroup);
        },
        initGoodTween(obj, i, now, target) {
            function onUpdate() {
                obj.scale.set(this.scale, this.scale, this.scale);
            }
            const duration = 100;
            const tween = new TWEEN.Tween(now)
                .to(target, duration)
                .onUpdate(onUpdate)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .delay(i * 50);
            return tween;
        },
        createSignal() {
            const signalGroup = new THREE.Group();
            const initSignal = () => {
                const signalGeom = this.initGeometry('Sphere', 0.5, 30, 30, 0, this.PI * 2, 0, this.PI * 2);
                const signalMat = this.initMaterial('MeshLambert', {
                    color: 0xFF0000,
                    transparent: true,
                    opacity: 0.001,
                    depthTest: false,
                });
                const signal = new THREE.Mesh(signalGeom, signalMat);
                signal.scale.set(0.001, 0.001, 0.001);
                return signal;
            };
            const signal = initSignal();
            this.initSignalTween(signal);

            return signal;
        },
        initSignalTween(obj) {
            function onUpdate() {
                obj.scale.set(this.index, this.index, this.index);
                obj.material.opacity = 1 - this.index;
            }
            function onComplete() {
                this.index = 0.001;
            }
            const duration = 2000;
            const tween = new TWEEN.Tween({index: 0.001})
                .to({index: 1}, duration)
                .onUpdate(onUpdate)
                .onComplete(onComplete)
                .delay(500);
            tween.chain(tween);
            obj.tween = tween;
        },
    },
};