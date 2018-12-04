export default {
    methods: {
        createBuilding() {
            const buildGroup = new THREE.Group();
            const buildingMat = this.initMaterial('MeshLambert', {
                color: 0x182038,
            });
            for (let i = 0; i < 7; i++) {
                const height = 20 * Math.random() + 10;
                const geom = this.initGeometry('Cube', 14, height, 14);
                const building = new THREE.Mesh(geom, buildingMat);
                building.position.set((i - 3) * 14, height / 2, 0);
                buildGroup.add(building);
            }
            return buildGroup;
        },
    },
};