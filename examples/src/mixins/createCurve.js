export default {
    methods: {
        initCurveParams() {
            const params = {
                innerRadius: 52,
                outerRadius: 62,
                offsetX: 80,
                buildWidth: 4,
                buildLengh: 4,
            };
            this.curveParams = params;
        },
        createCurve() {
            this.initCurveParams();
            const curveGroup = new THREE.Group();
            const road = this.createRoad();
            curveGroup.add(road);
            const buildings = this.createBuilding();
            curveGroup.add(buildings);
            return curveGroup;
        },
        createRoad() {
            const p = this.curveParams;
            const roadGeom = this.initGeometry('Ring', p.innerRadius, p.outerRadius, 60, 1, this.PI /2 * 3, this.PI);
            const roadMat = this.initMaterial('MeshBasic', {
                color: 0x1E2642,
            });
            const road = new THREE.Mesh(roadGeom, roadMat);
            road.rotation.x = - this.PI / 2;
            road.position.x = p.offsetX;
            return road;
        },
        createBuilding() {
            const p = this.curveParams;
            const buildingGroup = new THREE.Group();
            const buildingMat = this.initMaterial('MeshBasic', {
                color: 0x182038,
                transparent: true,
                opacity: 0.7,
            })
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.2) {
                const height = Math.random() * 8 + 10;
                const buildingGeom = this.initGeometry('Cube', p.buildWidth, height, p.buildLengh);
                const building = new THREE.Mesh(buildingGeom, buildingMat);
                building.position.set((p.innerRadius - 4) * this.cos(d) + p.offsetX, height / 2, (p.innerRadius - 4) * this.sin(d));
                building.rotation.y = - d; 
                buildingGroup.add(building);
            }
            for (let d = this.PI / 2 * 3; d <= this.PI / 2 * 5; d += 0.15) {
                const height = Math.random() * 8 + 10;
                const buildingGeom = this.initGeometry('Cube', p.buildWidth, height, p.buildLengh);
                const building = new THREE.Mesh(buildingGeom, buildingMat);
                building.position.set((p.outerRadius + 4) * this.cos(d) + p.offsetX, height / 2, (p.outerRadius + 4) * this.sin(d));
                building.rotation.y = - d; 
                buildingGroup.add(building);
            }
            return buildingGroup;
        },
    },
};