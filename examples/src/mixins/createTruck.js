// 车辆模型
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
            };
            this.truckParmas = params;
        },
        createTruck() { // 创建卡车
            this.initTruckParam();
            const truckGroup = new THREE.Group();
            const p = this.truckParmas;
            const head = this.createHead();
            truckGroup.add(head);
            const trailer = this.createTrailer();
            trailer.position.y = 0.12;
            trailer.position.z = 4;
            truckGroup.add(trailer);
            truckGroup.position.set(-80, p.height / 2 + p.wheelDiameter * 2, 0);
            truckGroup.rotation.y = - this.PI / 2;
            return truckGroup;
        },
        createHead() { // 创建车头
            const p = this.truckParmas;
            const headGroup = new THREE.Group();
            // 车头
            const vertices = [
                { x: -1, y: 1},
                { x: 0.2, y: 1},
                { x: 1, y: 0.2},
                { x: 1, y: -1 },
                { x: -1, y: -1},
                { x: -1, y: 1},
            ];
            const options = {
                depth: 0,
                bevelThickness: 1,
                bevelSize: 0,
                bevelSegments: 3,
                bevelEnabled: true,
                curveSegments: 12,
                steps: 1
            };
            const shape = new THREE.Shape(vertices);
            const headGeom = new THREE.ExtrudeGeometry(shape, options);
            const headMat = this.initMaterial('MeshBasic', {
                color: 0x597FF3,
                transparent: true,
                opacity: 0.7,
            });
            const head = new THREE.Mesh(headGeom, headMat);
            head.rotation.y = this.PI / 2;
            headGroup.add(head);
            // 车头底板
            const headPlaneGeom = this.initGeometry('Cube', p.width * 0.8, 0.1, p.headLength * 2);
            const headPlaneMat = this.initMaterial('MeshBasic', {
                color: 0x597FF3,
                transparent: true,
                opacity: 0.8,
            });
            const headPlane = new THREE.Mesh(headPlaneGeom, headPlaneMat);
            headPlane.position.set(0, (- p.height / 2 + 0.05), (p.headLength));
            headGroup.add(headPlane);
            // 车头车轮
            for (let i = 0; i < 4; i++) {
                const wheel = this.createWheel();
                wheel.position.x = (i % 2 === 0) ? - (p.width / 2 - p.wheelWidth / 1.5) : (p.width / 2 - p.wheelWidth / 1.5);
                wheel.position.z = i > 1 ? (p.headLength * 1.3) : 0;
                headGroup.add(wheel);
            }
            return headGroup;
        },
        createTrailer() { // 创建挂车
            const p = this.truckParmas;
             // 车挂组
            const trailerGroup = new THREE.Group();
            // 车挂
            const trailerGeom = this.initGeometry('Cube', p.width, p.height, p.trailerLength);
            const trailerMat = this.initMaterial('MeshBasic', {
                color: 0x597FF3,
                transparent: true,
                opacity: 0.7,
            });
            const trailer = new THREE.Mesh(trailerGeom, trailerMat);
            trailerGroup.add(trailer);
            // 车挂车轮
            for (let i = 0; i < 4; i++) {
                const wheel = this.createWheel();
                wheel.position.x = (i % 2 === 0) ? - (p.width / 2 - p.wheelWidth / 1.5) : (p.width / 2 - p.wheelWidth / 1.5);
                wheel.position.z = i < 2 ? (p.trailerLength / 2 - p.wheelDiameter * 2) : (p.trailerLength / 2 - p.wheelDiameter * 4.2);
                trailerGroup.add(wheel);
            }
            // 车挂底板
            const trailerPlaneGeom = this.initGeometry('Plane', p.width * 0.75, p.trailerLength * 0.7);
            const trailerPlaneMat = this.initMaterial('MeshBasic', {
                color: 0x597FF3,
                transparent: true,
                opacity: 0.8,
            });
            const trailerPlane = new THREE.Mesh(trailerPlaneGeom, trailerPlaneMat);
            trailerPlane.rotation.x = - this.PI / 2;
            trailerPlane.position.set(0, (- p.height / 2), (p.trailerLength * 0.1));
            trailerGroup.add(trailerPlane);
            return trailerGroup;
        },
        createWheel() { // 创建车轮
            const p = this.truckParmas;
            const wheelGeom = this.initGeometry('Cylinder', p.wheelDiameter, p.wheelDiameter, p.wheelWidth, 20);
            const wheelMat = this.initMaterial('MeshBasic', {
                color: 0x597FF3,
                transparent: true,
                opacity: 0.75,
            });
            const wheel = new THREE.Mesh(wheelGeom, wheelMat);
            wheel.rotation.z = this.PI / 2;
            wheel.position.y = - (p.height / 2 + p.wheelDiameter);
            return wheel;
        },
    },
};