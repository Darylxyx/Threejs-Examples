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
        createPark(haveGoods) { // 创建园区，haveGoods: 是否有货物
            const parkGroup = new THREE.Group();
            this.initParkParams();
            const p = this.parkParams;
            for (let i = 0; i < 3; i++) {
                const station = this.createStation();
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

            // if (haveGoods) {
                // const goodsGroup = this.createGoods();
                // parkGroup.add(goodsGroup);
            // }

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
                    x: 0, y: 0, z: 3,
                }, {
                    x: 0, y: 0, z: p.spaceLength - 3,
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
        },
        // createGoods() {
        //     const p = this.parkParams;
        //     const goodsGroup = new THREE.Group();
        //     const matrix = [
        //         [
        //             [0, 0, 1, 1, 0],
        //             [1, 1, 1, 1, 0],
        //             [1, 1, 1, 1, 1],
        //         ],
        //         [
        //             [1, 1, 0, 0, 0],
        //             [1, 1, 0, 0, 1],
        //             [1, 1, 1, 1, 1],
        //         ],
        //         [
        //             [0, 1, 0, 0, 0],
        //             [0, 1, 0, 0, 0],
        //             [1, 1, 1, 1, 0],
        //             [1, 1, 1, 1, 1],
        //         ],
        //     ];
        //     const initGoods = (x, y, z) => {
        //         const goodsGeom = this.initGeometry('Cube', p.goodSize, p.goodSize, p.goodSize);
        //         const goodsMat = this.initMaterial('MeshLambert', {
        //             color: 0xFFA500,
        //         });
        //         const goods = new THREE.Mesh(goodsGeom, goodsMat);
        //         goods.position.set(x, y, z);
        //         goods.castShadow = true;
        //         goods.receiveShadow = true;
        //         goodsGroup.add(goods);
        //     };
        //     matrix.forEach((z, zi) => { // z轴向货物数量
        //         z.forEach((y, yi) => { // y轴向货物数量
        //             y.forEach((x, xi) => {
        //                 if (x) {
        //                     const goodX = (xi - (y.length - 1) / 2) * (p.goodOffset + p.goodSize);
        //                     const goodY = (z.length - 1 - yi) * (p.goodOffset + p.goodSize);
        //                     const goodZ = zi * (p.goodSize + p.goodOffset);
        //                     initGoods(goodX, goodY, goodZ);
        //                 }
        //             });
        //         });
        //     });
        //     goodsGroup.position.y = p.stationHeight + p.goodSize / 2;
        //     return goodsGroup;
        // },
    },
};