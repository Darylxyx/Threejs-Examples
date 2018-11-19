export default {
    methods: {
        initCurveParams() {
            const params = {
                innerRadius: 52,
                outerRadius: 62,
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
            const roadLine = this.createRoadLine();
            curveGroup.add(roadLine);
            const buildings = this.createRoadBuilding();
            curveGroup.add(buildings);
            return curveGroup;
        },
        createRoad() {
            const p = this.curveParams;
            const roadGeom = this.initGeometry('Ring', p.innerRadius, p.outerRadius, 60, 1, this.PI /2 * 3, this.PI);
            console.log(roadGeom);
            const roadMat = this.initMaterial('MeshLambert', {
                color: 0x1E2642,
            });
            const road = new THREE.Mesh(roadGeom, roadMat);
            road.rotation.x = - this.PI / 2;
            road.position.x = p.offsetX;
            return road;
        },
        createRoadLine() {
            const p = this.curveParams;
            const roadLineGroup = new THREE.Group();

            const mat = this.initMaterial('MeshLambert', {
                color: 0xffffff,
            });
            const initLine = () => {
                const geom = this.initGeometry('Plane', p.lineWidth, p.lineLength);
                const roadLine = new THREE.Mesh(geom, mat);
                return roadLine;
            };
            for (let rad = this.PI / 2 * 3 + 0.1; rad < this.PI / 2 * 5 - 0.2; rad += 0.3) {
                const roadLine = initLine();
                const x = 57 * this.cos(rad);
                const y = 57 * this.sin(rad);
                roadLine.position.set(x, y, 0.005);
                roadLine.rotation.z = rad;
                roadLineGroup.add(roadLine);
            }
            roadLineGroup.position.x = p.offsetX;
            roadLineGroup.rotation.x = - this.PI / 2;
            return roadLineGroup;
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
                initBuilding(d, p.innerRadius - 4);
            }
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.25) {
                initBuilding(d, p.innerRadius - 10);
            }
            // for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.2) {
            //     initBuilding(d, p.innerRadius - 16);
            // }
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.15) {
                initBuilding(d, p.outerRadius + 4);
            }
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.12) {
                initBuilding(d, p.outerRadius + 10);
            }
            // for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.1) {
            //     initBuilding(d, p.outerRadius + 16);
            // }
            return buildingGroup;
        },
    },
};