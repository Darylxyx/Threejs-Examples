import TWEEN from 'tween.js';
import 'three/examples/js/loaders/OBJLoader.js';
import 'three/examples/js/loaders/MTLLoader.js';
export default {
    methods: {
        initParkParams() {
            const params = {
                stationWidth: 32,
                stationLength: 14,
                stationHeight: 1,
                stationOffset: 4.8, // 站台间隔
                spaceWidth: 2.8,
                spaceLength: 12,
                spaceOffset: 2, // 停车位间隔
                betweenOffset: 0.35, // 停车位与站台的间隔
                goodSize: 0.4, // 货物尺寸
                goodOffset: 0.01, // 货物间隔
            };
            this.parkParams = params;
        },
        async createPark(index) { // 创建园区，index: 0为装货区，1为卸货区
            const parkGroup = new THREE.Group();
            this.initParkParams();
            const p = this.parkParams;
            const stationModal = this.createStation();
            for (let i = 0; i < 3; i++) {
                const station = stationModal.clone();
                station.position.x = (i - 1) * (p.stationWidth + p.stationOffset);
                parkGroup.add(station);
            }
            const ox = p.spaceOffset + p.spaceWidth;
            const pa = [- 2 * ox, - ox, ox, 2 * ox];

            for (let i = 0; i < 4; i++) {
                const truck = new THREE.Group();
                const head = this.headGroup.clone();
                const back = this.backGroup.clone();
                truck.add(head);
                truck.add(back);
                truck.position.set(pa[i], 0, 12.5);
                truck.rotation.y = this.PI;
                parkGroup.add(truck);
            }

            const matchSpace = this.createMatchSpace();
            if (index) {
                this.unloadMatchSpace = matchSpace;
            } else {
                this.loadMatchSpace = matchSpace;
            }
            parkGroup.add(matchSpace);

            const forklift = await this.createForklift();
            parkGroup.add(forklift);

            const cargo = await this.createCargo();
            parkGroup.add(cargo);

            const road = this.createParkRoad();
            parkGroup.add(road);

            const gate = this.createParkGate();
            gate.position.x = 58;
            parkGroup.add(gate);
            const gate2 = gate.clone();
            gate2.position.x = -58;
            parkGroup.add(gate2);

            return parkGroup;
        },
        createStation() { // 创建站台
            const stationGroup = new THREE.Group();
            const p = this.parkParams;
            const stationGeom = this.initGeometry('Cube', p.stationWidth, p.stationHeight, p.stationLength);
            const stationMat = this.initMaterial('MeshLambert', {
                color: 0x1E2642,
            });
            const station = new THREE.Mesh(stationGeom, stationMat);
            station.position.y = p.stationHeight / 2;
            station.receiveShadow = true;
            stationGroup.add(station);
            const spaces = this.createSpace();
            stationGroup.add(spaces);
            const spaces1 = spaces.clone();
            spaces1.position.z = 53;
            stationGroup.add(spaces1);
            return stationGroup;
        },
        createSpace() { // 创建停车位
            const spaceGroup = new THREE.Group();
            const p = this.parkParams;
            for (let i = 0; i < 7; i ++) {
                const lineGroup = new THREE.Group();
                const points = [{
                    x: - p.spaceWidth / 2, y: 0, z: 0,
                }, {
                    x: p.spaceWidth / 2, y: 0, z: 0,
                }, {
                    x: p.spaceWidth / 2, y: 0, z: p.spaceLength,
                }, {
                    x: - p.spaceWidth / 2, y: 0, z: p.spaceLength,
                }, {
                    x: - p.spaceWidth / 2, y: 0, z: 0,
                }];
                const line = this.initLine(points, {
                    color: this.lineColor,
                    opacity: 0.3,
                    transparent: true,
                });
                const points2 = [
                    this.v3(0, 0, 0),
                    this.v3(0, 0, p.spaceLength),
                ];
                const dashLine = this.initLine(points2, {
                    color: this.lineColor,
                    opacity: 0.3,
                    transparent: true,
                    dashSize: 0.5,
                    gapSize: 0.5,
                }, true);
                lineGroup.add(line);
                lineGroup.add(dashLine);
                lineGroup.position.x = (i - 3) * (p.spaceWidth + p.spaceOffset);
                spaceGroup.add(lineGroup);
            }
            spaceGroup.position.z = p.stationLength / 2 + p.betweenOffset;
            return spaceGroup;
        },
        createParkRoad() {
            const roadGroup = new THREE.Group();
            const points = [
                this.v3(-54, 0, 30),
                this.v3(54, 0, 30),
            ];
            const line = this.initLine(points, {
                color: this.lineColor,
                opacity: 0.3,
                transparent: true,
            });
            roadGroup.add(line);
            const line2 = line.clone();
            line2.position.z = 12;
            roadGroup.add(line2);
            const dashLine = this.initLine(points, {
                color: this.lineColor,
                opacity: 0.3,
                transparent: true,
                dashSize: 5,
                gapSize: 4,
            }, true);
            dashLine.position.z = 6;
            roadGroup.add(dashLine);
            return roadGroup;
        },
        createParkGate() {
            const gateGroup = new THREE.Group();
            const gateUnit = this.createGateUnit();
            gateUnit.position.z = 13.5;
            gateGroup.add(gateUnit);
            const gateUnit2 = gateUnit.clone();
            gateUnit2.position.z = 59;
            gateGroup.add(gateUnit2);
            return gateGroup;
        },
        createGateUnit() {
            const gateUnit = new THREE.Group();
            const flower = this.createFlower();
            gateUnit.add(flower);
            const tree = this.createTree();
            tree.position.z = -12;
            gateUnit.add(tree);
            const tree2 = tree.clone();
            tree2.position.z = 12;
            gateUnit.add(tree2);
            return gateUnit;
        },
        createTree() {
            const treeGroup = new THREE.Group();
            const treeGeom = this.initGeometry('Cube', 2, 3, 2);
            const treeMat = this.initMaterial('MeshLambert', {
                color: 0x588559,
                opacity: 0.6,
                transparent: true,
            });
            const tree = new THREE.Mesh(treeGeom, treeMat);
            tree.position.y = 3;
            treeGroup.add(tree);
            const trunkGeom = this.initGeometry('Cylinder', 0.2, 0.2, 2, 20, 1, false);
            const trunkMat = this.initMaterial('MeshLambert', {
                color: 0x313740,
                opacity: 0.6,
                transparent: true,
            });
            const trunk = new THREE.Mesh(trunkGeom, trunkMat);
            trunk.position.y = 1;
            treeGroup.add(trunk);
            return treeGroup;
        },
        createFlower(x = 1.6, z = 16, isCurve = false) { // 创建花坛
            const flowerGroup = new THREE.Group();
            const flowerGeom = this.initGeometry('Cube', x - 0.6, 0.8, isCurve ? z : z - 1);
            const flowerMat = this.initMaterial('MeshLambert', {
                color: 0x588559,
                opacity: 0.6,
                transparent: !isCurve,
            });
            const flower = new THREE.Mesh(flowerGeom, flowerMat);
            flower.position.y = 1;
            flowerGroup.add(flower);
            const bedGeom = this.initGeometry('Cube', x, 0.6, z);
            const bedMat = this.initMaterial('MeshLambert', {
                color: 0x313740,
                opacity: 0.6,
                transparent: !isCurve,
            });
            const bed = new THREE.Mesh(bedGeom, bedMat);
            bed.position.y = 0.3;
            flowerGroup.add(bed);
            return flowerGroup;
        },
        createMatchSpace() {
            const p = this.parkParams;
            const points = [{
                x: - p.spaceWidth / 2, y: 0, z: 0,
            }, {
                x: p.spaceWidth / 2, y: 0, z: 0,
            }, {
                x: p.spaceWidth / 2, y: 0, z: p.spaceLength,
            }, {
                x: - p.spaceWidth / 2, y: 0, z: p.spaceLength,
            }, {
                x: - p.spaceWidth / 2, y: 0, z: 0,
            }];
            const matchLine = this.initLine(points, {
                color: 0xED4AFF,
                transparent: true,
                opacity: 0,
            });
            matchLine.position.set(0, 0.05, p.stationLength / 2 + p.betweenOffset);

            const obj = { opacity: 0 };
            function onUpdate() {
                matchLine.material.opacity = this.opacity;
            }
            function onStop() {
                matchLine.material.opacity = 0;
                obj.opacity = 0;
            }
            const tweenIn = new TWEEN.Tween(obj)
                .to({opacity: 1}, 800)
                .onUpdate(onUpdate)
                .onStop(onStop);
            const tweenOut = new TWEEN.Tween(obj)
                .to({opacity: 0}, 800)
                .onUpdate(onUpdate)
                .onStop(onStop);
            tweenIn.chain(tweenOut);
            tweenOut.chain(tweenIn);
            matchLine.tween = tweenIn;
            return matchLine;
        },
        createForklift() {
            return new Promise((resolve) => {
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('static/forklift.mtl', (mat) => {
                    mat.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(mat);
                    objLoader.load('static/forklift.obj', (obj) => {
                        obj.position.set(-7.5, 3.3, 0);
                        obj.rotation.y = -this.PI / 1.5;
                        obj.scale.set(0.04, 0.04, 0.04);
                        resolve(obj);
                    });
                });
            });
        },
        createCargo() {
            return new Promise((resolve) => {
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('static/Cargo.mtl', (mat) => {
                    mat.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(mat);
                    objLoader.load('static/Cargo.obj', (obj) => {
                        obj.position.set(-7.5, 3.3, 5);
                        obj.rotation.y = - this.PI / 2;
                        obj.scale.set(0.04, 0.04, 0.04);
                        resolve(obj);
                    });
                });
            });
        },
    },
};