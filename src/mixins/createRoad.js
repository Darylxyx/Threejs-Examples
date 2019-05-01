export default {
    methods: {
        createAllRoad() {
            const roadsGroup = new THREE.Group();
            const mat = this.initMaterial('MeshLambert', {
                color: 0x1E2642,
            });
            const road1Geom = this.initGeometry('Plane', 135, 10);
            const road1 = new THREE.Mesh(road1Geom, mat);
            road1.rotation.x = -this.PI / 2;
            road1.position.set(13, 0, 57);
            roadsGroup.add(road1);

            const road2 = new THREE.Mesh(road1Geom, mat);
            road2.rotation.x = -this.PI / 2;
            road2.position.set(13, 0, -57);
            roadsGroup.add(road2);

            const road3Geom = this.initGeometry('Ring', 10, 20, 20, 1, this.PI, this.PI / 2);
            const road3 = new THREE.Mesh(road3Geom, mat);
            road3.rotation.x = -this.PI / 2;
            road3.position.set(-54, 0, 42);
            roadsGroup.add(road3);

            const road4Geom = this.initGeometry('Ring', 10, 20, 20, 1, this.PI * 0.5, this.PI / 2);
            const road4 = new THREE.Mesh(road4Geom, mat);
            road4.rotation.x = -this.PI / 2;
            road4.position.set(-54, 0, -42);
            roadsGroup.add(road4);

            const road5Geom = this.initGeometry('Plane', 10, 30);
            const road5 = new THREE.Mesh(road5Geom, mat);
            road5.rotation.x = -this.PI / 2;
            road5.position.set(-69, 0, 27);
            roadsGroup.add(road5);

            const road6 = new THREE.Mesh(road5Geom, mat);
            road6.rotation.x = -this.PI / 2;
            road6.position.set(-69, 0, -27);
            roadsGroup.add(road6);

            return roadsGroup;
        },
    },
};