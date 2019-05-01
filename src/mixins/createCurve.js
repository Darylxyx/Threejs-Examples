export default {
    methods: {
        initCurveParams() {
            const params = {
                radius: 48,
                innerRadius: 36,
                outerRadius: 60,
                offsetX: 80,
                buildWidth: 4,
                buildLengh: 4,
                lineWidth: 0.7,
                lineLength: 7,
            };
            this.curveParams = params;
        },
        createCurve() {
            this.initCurveParams();
            const curveGroup = new THREE.Group();
            const road = this.createRoad();
            curveGroup.add(road);
            const flowers = this.createCurveFlower();
            curveGroup.add(flowers);
            const buildings = this.createRoadBuilding();
            curveGroup.add(buildings);
            return curveGroup;
        },
        createRoad() {
            const p = this.curveParams;
            const roadGroup = new THREE.Group();
            const pointsArr = [];
            const ir = p.innerRadius;
            for (let i = 0; i < 5; i++) {
                const r = ir + (i * 6);
                const arr = [];
                for (let rad = this.PI * 1.5; rad < this.PI * 2.5; rad += 0.005) {
                    const x = r * this.cos(rad);
                    const z = r * this.sin(rad);
                    arr.push(this.v3(x, 0, z));
                }
                pointsArr.push(arr);
            }
            pointsArr.forEach((item, index) => {
                let line;
                if (index === 2) return;
                if (index % 2 === 0) {
                    line = this.initLine(item, {
                        color: this.lineColor,
                        opacity: 0.3,
                        transparent: true,
                    });
                } else {
                    line = this.initLine(item, {
                        color: this.lineColor,
                        opacity: 0.3,
                        transparent: true,
                        dashSize: 5,
                        gapSize: 4,
                    }, true);
                }
                roadGroup.add(line);
            });
            roadGroup.position.x = 80;
            return roadGroup;
        },
        createCurveFlower() {
            const flowerGroup = new THREE.Group();
            const p = this.curveParams;
            const r = p.radius;
            for (let rad = this.PI * 1.5; rad < this.PI * 2.5; rad += 0.14) {
                const x = r * this.cos(rad);
                const z = r * this.sin(rad);
                const flower = this.createFlower(1, 7.5, true);
                flower.position.set(x, 0, z);
                flower.rotation.y = -rad;
                flowerGroup.add(flower);
            }
            flowerGroup.position.x = 80;
            return flowerGroup;
        },
        createRoadBuilding() {
            const p = this.curveParams;
            const buildingGroup = new THREE.Group();
            const buildingMat = this.initMaterial('MeshLambert', {
                color: 0x182038,
                transparent: true,
                opacity: 0.7,
            });
            const initBuilding = (d, r) => {
                const height = Math.random() * 10 + 2;
                const buildingGeom = this.initGeometry('Cube', p.buildWidth, height, p.buildLengh);
                const building = new THREE.Mesh(buildingGeom, buildingMat);
                building.position.set(r * this.cos(d) + p.offsetX, height / 2, r * this.sin(d));
                building.rotation.y = - d;
                buildingGroup.add(building);
            };
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.2) {
                initBuilding(d, p.innerRadius - 10);
            }
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.25) {
                initBuilding(d, p.innerRadius - 15);
            }
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.15) {
                initBuilding(d, p.outerRadius + 10);
            }
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.12) {
                initBuilding(d, p.outerRadius + 15);
            }
            return buildingGroup;
        },
        createRoadSigns() { // 创建路牌
            const signGroup = new THREE.Group();
            const signBoardGeom = this.initGeometry('');
            return signGroup;
        },
    },
};