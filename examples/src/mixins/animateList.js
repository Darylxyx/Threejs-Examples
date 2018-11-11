// 动画队列
let truck = null;
const { PI, sin, cos } = Math;
let rad = PI / 2; // 通用弧度变量（用于计算车辆过弯）
let stepIndex = 0; // 当前动画步骤
let count = 0;
const co = { // 摄影机偏移量
    x: 0,
    y: 15,
    z: 0,    
};
export default {
    methods: {
        initAnimate() {
            const params = {};
            this.animateParams = params;
            truck = this.truckGroup;
            this.animateList = [
                this.outStation,
                this.inLoad,
                this.reversInLoad,
                this.loading,
                this.outLoad,
                this.inCurve,
                this.reversInUnload,
                this.unloading,
                this.outUnload,
                this.inStation,
                this.resetStart,
            ];
        },
        carAnimate() {
            this.animateList[stepIndex] && this.animateList[stepIndex]();
        },
        outStation() { // 出站
            if (rad <= 0) {
                if (truck.position.z >= 42) {
                    rad = PI;
                    stepIndex++;
                }
                this.$store.commit('setTitle', '');
                truck.position.z += 0.5;
            } else {
                rad -= 0.01;
                this.drift(10, -80, 10, true);
                this.$store.commit('setTitle', '车挂匹配');
            }
            if (co.y < 40) {
                co.y += 0.2;
            }
            this.moveCamera();
        },
        inLoad() { // 进入装货园区
            if (rad >= PI / 2 * 3) {
                if (truck.position.x >= 11) {
                    rad = PI / 2;
                    stepIndex++;
                } else {
                    truck.position.x += 0.5;
                }
            } else {
                rad += 0.02;
                this.drift(15, -55, 42);
            }
            this.moveCamera();
        },
        reversInLoad() { // 倒车进入装货阶段
            if (rad >= PI) {
                if (truck.position.z >= 76) {
                    stepIndex++;
                } else {
                    truck.position.z += 0.2;
                }
                if (co.x < 4) {
                    co.x += 0.1;
                }
            } else {
                rad += 0.01;
                this.drift(11, 11, 68, true);
                this.$store.commit('setTitle', '园区停靠');
                this.$store.commit('setActCardList', ['stop']);
            }
            if (co.y > 2) {
                co.y -= 0.5;
            }
            if (co.z < 12) {
                co.z += 0.5;
            }
            this.moveCamera();
        },
        loading() { // 装货
            if (count >= 180) {
                count = 0;
                rad = PI;
                stepIndex++;
            }
            count++;
            this.$store.commit('setTitle', '装货');
            this.$store.commit('setActCardList', ['load', 'loadtime']);
        },
        outLoad() { // 离开装货园区
            if (truck.position.z <= 68) {
                if (rad <= PI / 2) {
                    if (truck.position.x >= 80) {
                        rad = - PI / 2;
                        stepIndex++;
                    } else {
                        truck.position.x += 1;
                    }
                } else {
                    rad -= 0.05;
                    this.drift(11, 11, 68, true);
                }
            } else {
                truck.position.z -= 0.2;
                this.$store.commit('setTitle', '');
                this.$store.commit('setActCardList', []);
            }
            this.moveCamera();
        },
        inCurve() { // 进入弯道
            if (rad >= PI / 2) {
                if (truck.position.x <= - 11) {
                    rad = - PI / 2;
                    stepIndex++;
                } else {
                    truck.position.x -= 0.3;
                    this.$store.commit('setTitle', '');
                    this.$store.commit('setActCardList', []);
                }
                co.x = 0;
                co.y = 40;
                co.z = 0;
                this.moveCamera();
            } else {
                rad += 0.005;
                this.drift(57, 80, 0);
                this.$store.commit('setTitle', '沪123456挂');
                this.$store.commit('setActCardList', ['temp', 'weight', 'wheel', 'wheelalert', 'rollalert']);
                const x = 62 * cos(rad - 0.25) + 80;
                const y = 2;
                const z = - 62 * sin(rad - 0.25);
                this.moveCamera(x, y, z);
            }
        },
        reversInUnload() { // 倒车进入卸货园区
            if (rad >= 0) {
                if (truck.position.z <= - 76) {
                    stepIndex++;
                } else {
                    truck.position.z -= 0.2;
                }
            } else {
                rad += 0.01;
                this.drift(11, -11, -68, true);
                this.$store.commit('setActCardList', ['stop']);
            }
            this.moveCamera();
        },
        unloading() {
            if (count >= 180) {
                count = 0;
                rad = 0;
                stepIndex++;
            }
            count++;
            this.$store.commit('setTitle', '卸货');
            this.$store.commit('setActCardList', ['unload', 'unloadtime']);
        },
        outUnload() { // 离开卸货园区
            if (truck.position.z >= - 68) {
                if (rad <= - PI / 2) {
                    if (truck.position.x <= -55) {
                        rad = PI / 2;
                        stepIndex++;
                    } else {
                        truck.position.x -= 0.2;
                    }
                } else {
                    rad -= 0.01;
                    this.drift(11, -11, -68, true);
                }
            } else {
                truck.position.z += 0.2;
                this.$store.commit('setTitle', '');
                this.$store.commit('setActCardList', []);
            }
            this.moveCamera();
        },
        inStation() { // 回到始发点
            if (rad >= PI) {
                if (truck.position.z >= 10) {
                    rad = 0;
                    stepIndex++;
                } else {
                    truck.position.z += 0.2;
                }
            } else {
                rad += 0.01;
                this.drift(15, -55, -42);
            }
            this.moveCamera();
        },
        resetStart() { // 复位
            if (rad >= PI / 2) {
                if (count >= 180) {
                    count = 0;
                    stepIndex = 0;
                }
                count++
            } else {
                rad += 0.01;
                this.drift(10, -80, 10, true);
            }
            this.moveCamera();
        },
        drift(r, offsetX, offsetZ, clockwise = false) {
            const x = r * cos(rad) + offsetX;
            const z = - (r * sin(rad)) + offsetZ;
            truck.position.x = x;
            truck.position.z = z;
            truck.rotation.y = clockwise ? rad - PI : rad;
        },
        moveCamera(cameraX, cameraY, camerZ) { // 若传入绝对摄影机坐标，则不使用偏移量
            const { x, y, z } = truck.position;
            this.camera.position.set(cameraX || x + co.x, cameraY || y + co.y, camerZ || z + co.z);
            this.camera.lookAt(truck.position);
        },
    },
};