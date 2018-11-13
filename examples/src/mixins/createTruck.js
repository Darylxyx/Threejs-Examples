// 车辆模型
import 'three/examples/js/loaders/OBJLoader.js';
import 'three/examples/js/loaders/MTLLoader.js';
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
            };
            this.truckParmas = params;
        },
        async createTruck() { // 创建卡车
            this.initTruckParam();
            const truck = await this.loadModel();
            this.headGroup = truck[0];
            this.backGroup = truck[1];
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
                        headGroup.add(obj);
                        headGroup.position.y = 2.3;
                        headGroup.scale.set(p.modelScale, p.modelScale, p.modelScale);
                        resolve(headGroup);
                    });
                });
            });
            const backPromise = new Promise((resolve, reject) => {
                const backGroup = new THREE.Group();
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('static/G7Trailer-back.mtl', (mat) => {
                    mat.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(mat);
                    objLoader.load('static/G7Trailer-back.obj', (obj) => {
                        backGroup.add(obj);
                        backGroup.position.y = 2.3;
                        backGroup.scale.set(p.modelScale, p.modelScale, p.modelScale);
                        resolve(backGroup);
                    });
                });
            });
            return Promise.all([headPromise, backPromise]);
        },
    },
};