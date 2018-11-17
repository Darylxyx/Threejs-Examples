export default {
    methods: {
        createBuilding() {
            const buildGroup = new THREE.Group();
            // const buildingMat = this.initMaterial('MeshLambert', {
            //     color: 0x182038,
            //     transparent: true,
            //     opacity: 0.7,
            // });
            // for (let i = 0; i < 20; i++) {
            //     const width = Math.random() * 10 + 5;
            //     const height = Math.random() * 20 + 2;
            //     const x = Math.random() * 90 - 45;
            //     const z = Math.random() * 90 - 45;
            //     const geom = this.initGeometry('Cube', width, height, width);
            //     const building = new THREE.Mesh(geom, buildingMat);
            //     building.position.set(x, height / 2, z);
            //     buildGroup.add(building);
            // }
            return buildGroup;
        },
    },
};