import 'three/examples/js/loaders/OBJLoader.js';
import 'three/examples/js/loaders/MTLLoader.js';

const { TWEEN } = window;
const easing = TWEEN.Easing.Sinusoidal;
const arr = ['A', 'B', 'C', 'D', 'E', 'F'];
let lineMat;
let arrMat;
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
            lineMat = {
                color: this.lineColor,
                opacity: 0.3,
                transparent: true,
            };
            arrMat = {
                color: this.lineColor,
                opacity: 0,
                transparent: true,
            };
        },
        async createPark(index) { // 创建园区，index: 0为装货区，1为卸货区
            const parkGroup = new THREE.Group();
            this.initParkParams();
            const p = this.parkParams;
            // const stationModal = this.createStation();
            for (let i = 0; i < 3; i++) {
                // const station = stationModal.clone();
                const station = this.createStation(i, index);
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

            const road = this.createParkRoad(index);
            parkGroup.add(road);

            const gate = this.createParkGate();
            gate.position.x = 58;
            parkGroup.add(gate);
            const gate2 = gate.clone();
            gate2.position.x = -58;
            parkGroup.add(gate2);

            return parkGroup;
        },
        createStation(index, type) { // 创建站台
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
            const spaces = this.createSpace(index, type);
            stationGroup.add(spaces);
            const spaces1 = spaces.clone();
            spaces1.position.z = 53;
            stationGroup.add(spaces1);
            return stationGroup;
        },
        createSpace(index, type) { // 创建停车位
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
                const line = this.initLine(points, lineMat);
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

                if (index !== undefined) {
                    let num;
                    if (type === 0) {
                        num = arr[index];
                    } else {
                        num = arr[index + 3];
                    }
                    const text = this.textSprite(`${num}0${i+1}`, {
                        scale: 4,
                        textColor: '#FFFFFF',
                    });
                    text.position.set(- p.spaceWidth / 2 + 0.7, 0, p.spaceLength - 1);
                    lineGroup.add(text); 
                }

                lineGroup.position.x = (i - 3) * (p.spaceWidth + p.spaceOffset);
                spaceGroup.add(lineGroup);
            }
            spaceGroup.position.z = p.stationLength / 2 + p.betweenOffset;
            return spaceGroup;
        },
        createParkRoad(type) {
            const roadGroup = new THREE.Group();
            if (type === 0) {
                const points = [
                    this.v3(-54, 0, 30),
                    this.v3(54, 0, 30),
                ];
                const line = this.initLine(points, lineMat);
                roadGroup.add(line);

                const points2 = [
                    this.v3(-54, 0, 36),
                    this.v3(40, 0, 36),
                ];
                const line2 = this.initLine(points2, lineMat);
                roadGroup.add(line2);

                const points3 = [
                    this.v3(54, 0, 36),
                    this.v3(46, 0, 36),
                ];
                const line3 = this.initLine(points3, lineMat);
                roadGroup.add(line3);

                const sideRoad = this.createSideRoad();
                roadGroup.add(sideRoad);

                this.guideGroup = this.createParkGuideLine();
                roadGroup.add(this.guideGroup);

                const textMat = {
                    scale: 4,
                    fontSize: 40,
                    textColor: '#FFFFFF',
                    canvasWidth: 160,
                    canvasHeight: 160,
                };
                const text1 = this.textSprite('园区一路', textMat);
                text1.position.set(20, 0.5, 33);
                roadGroup.add(text1);

                const text2 = this.textSprite('园区二路', textMat);
                text2.position.set(20, 0.5, 43);
                roadGroup.add(text2);

            } else {
                const points = [this.v3(-54, 0, 30), this.v3(54, 0, 30)];
                const line = this.initLine(points, lineMat);
                roadGroup.add(line);
                const line2 = line.clone();
                line2.position.z = 6;
                roadGroup.add(line2);
            }

            return roadGroup;
        },
        createSideRoad() { // 园区二路
            const roadGroup = new THREE.Group();
            const points = [
                this.v3(-54, 0, 41),
                this.v3(35, 0, 41),
            ];
            const line = this.initLine(points, lineMat);
            const line2 = line.clone();
            line2.position.z = 6;
            roadGroup.add(line);
            roadGroup.add(line2);

            const curvePoints = [];
            for (let r = 0; r <= this.PI / 2; r += 0.03) {
                const x = 5 * this.cos(r) + 35;
                const z = 5 * this.sin(r) + 36;
                curvePoints.push(this.v3(x, 0, z));
            }
            const curve = this.initLine(curvePoints, lineMat);

            const curvePoints2 = [];
            for (let r = 0; r <= this.PI / 2; r += 0.03) {
                const x = 11 * this.cos(r) + 35;
                const z = 11 * this.sin(r) + 36;
                curvePoints2.push(this.v3(x, 0, z));
            }
            const curve2 = this.initLine(curvePoints2, lineMat);

            roadGroup.add(curve);
            roadGroup.add(curve2);
 
            return roadGroup;
        },
        createParkGuideLine() { //创建园区引导路线
            const guideGroup = new THREE.Group();
            const guideGeom = this.initGeometry('Plane', 50, 1.4);
            const mat = this.initMaterial('MeshPhong', {
                color: 0x05314A,
                opacity: 0,
                transparent: true,
            });
            const guide = new THREE.Mesh(guideGeom, mat);
            guide.rotation.x = - this.PI / 2;
            guide.position.set(30, 0, 33);
            guideGroup.add(guide);

            const curveGeom = this.initGeometry('Ring', 4.3, 5.7, 20, 8, this.PI, this.PI / 2);
            const curve = new THREE.Mesh(curveGeom, mat);
            curve.rotation.x = - this.PI / 2;
            curve.position.set(5, 0, 28);
            guideGroup.add(curve);

            const guide2Geom = this.initGeometry('Plane', 1.4, 8);
            const guide2 = new THREE.Mesh(guide2Geom, mat);
            guide2.rotation.x = - this.PI / 2;
            guide2.position.set(0, 0, 24);
            guideGroup.add(guide2);

            const arrowGroup = new THREE.Group();
            const arrow = this.createParkGuideArrow();
            for (let i = 0; i < 20; i++) {
                const arr = arrow.clone();
                arr.position.x = i * 2;
                arrowGroup.add(arr);
            }
            arrowGroup.position.x = 10;
            guideGroup.add(arrowGroup);

            function changeArrowMat(opacity) {
                arrowGroup.children.forEach((arrow) => {
                    arrow.children.forEach((item) => {
                        item.material.opacity = opacity;
                    });
                });
            }

            const data = {opacity: 0};
            guideGroup.tweenIn = new TWEEN.Tween(data)
                .to({opacity: 0.75})
                .onUpdate(function() {
                    mat.opacity = this.opacity;
                    changeArrowMat(this.opacity);
                })
                .easing(easing.In);
            guideGroup.tweenOut = new TWEEN.Tween(data)
                .to({opacity: 0})
                .onUpdate(function() {
                    mat.opacity = this.opacity;
                    changeArrowMat(this.opacity);
                })
                .easing(easing.Out);

            return guideGroup;
        },
        createParkGuideArrow() { // 指引箭头
            const group = new THREE.Group();
            const points1 = [this.v3(0, 0.01, 33), this.v3(0.7, 0.01, 33.3)];
            const points2 = [this.v3(0, 0.01, 33), this.v3(0.7, 0.01, 32.7)];
            const line1 = this.initLine(points1, arrMat);
            const line2 = this.initLine(points2, arrMat);
            group.add(line1);
            group.add(line2);
            return group;
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
                mtlLoader.load('public/forklift.mtl', (mat) => {
                    mat.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(mat);
                    objLoader.load('public/forklift.obj', (obj) => {
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
                mtlLoader.load('public/Cargo.mtl', (mat) => {
                    mat.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(mat);
                    objLoader.load('public/Cargo.obj', (obj) => {
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