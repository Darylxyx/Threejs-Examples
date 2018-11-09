export default {
    methods: {
        initParkParams() {
            const params = {
                stationWidth: 32,
                stationLength: 14,
                stationHeight: 3,
                stationOffset: 4.8, // 站台间隔
                spaceWidth: 2.8,
                spaceLength: 8,
                spaceOffset: 2, // 停车位间隔
                betweenOffset: 0.35, // 停车位与站台的间隔
            };
            this.parkParams = params;
        },
        createPark() { // 创建园区
            const parkGroup = new THREE.Group();
            this.initParkParams();
            const p = this.parkParams;
            for (let i = 0; i < 3; i++) {
                const station = this.createStation();
                station.position.x = (i - 1) * (p.stationWidth + p.stationOffset);
                parkGroup.add(station);
            }
            return parkGroup;
        },
        createStation() { // 创建站台
            const stationGroup = new THREE.Group();
            const p = this.parkParams;
            const stationGeom = this.initGeometry('Cube', p.stationWidth, p.stationHeight, p.stationLength);
            const stationMat = this.initMaterial('MeshBasic', {
                color: 0x1E2642,
            });
            const station = new THREE.Mesh(stationGeom, stationMat);
            station.position.y = p.stationHeight / 2;
            stationGroup.add(station);
            const spaces = this.createSpace();
            stationGroup.add(spaces);
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
                    color: 0x283251,
                });
                const points2 = [{
                    x: 0, y: 0, z: 0,
                }, {
                    x: 0, y: 0, z: p.spaceLength,
                }];
                const dashLine = this.initLine(points2, {
                    color: 0x283251,
                });
                lineGroup.add(line);
                lineGroup.add(dashLine);
                lineGroup.position.x = (i - 3) * (p.spaceWidth + p.spaceOffset);
                spaceGroup.add(lineGroup);
            }
            spaceGroup.position.z = p.stationLength / 2 + p.betweenOffset;
            return spaceGroup;
        }
    },
};