// 动画队列
let truck = null;
const { PI, sin, cos } = Math;
let rad = PI / 2; // 通用弧度变量（用于计算车辆过弯）
let stepIndex = 0; // 当前动画步骤
let count = 0;
const runSpeed = 0.5; // 直路行进速度
const reversSpeed = 0.05; // 倒车速度
const cornerSpeed = 0.01; // 转弯速度
const co = { // 摄影机偏移量
    x: 0,
    y: 15,
    z: 5    
};
export default {
    methods: {
        initAnimate() {
            const params = {};
            this.animateParams = params;
            this.animateList = [
                this.truckCombine,
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
            truck = this.truckGroup;
            truck.add(this.headGroup);
            truck.rotation.y = - PI / 2;
            truck.position.x = -75;
            this.backGroup.position.x = -85;
            this.backGroup.rotation.y = - PI / 2;
            this.mainGroup.add(this.backGroup);
        },
        carAnimate() {
            this.animateList[stepIndex] && this.animateList[stepIndex]();
        },
        truckCombine() { // 组装车辆
            if (count > 120) {
                if (truck.position.x <= -85) {
                    this.mainGroup.remove(this.backGroup);
                    this.backGroup.position.x = 0;
                    truck.add(this.backGroup);
                    this.backGroup.rotation.y = 0;
                    this.$store.commit('setTitle', '');
                    stepIndex++;
                } else {
                    truck.position.x -= reversSpeed;
                    this.$store.commit('setTitle', '车挂匹配');
                }
            } 
            count++;
            this.moveCamera();
        },
        outStation() { // 出站
            count = 0;
            if (truck.position.x >= -80) {
                if (rad <= 0) {
                    if (truck.position.z >= 42) {
                        rad = PI;
                        stepIndex++;
                    }
                    truck.position.z += runSpeed;
                } else {
                    rad -= cornerSpeed;
                    this.drift(10, -80, 10, true);
                }
            } else {
                truck.position.x += reversSpeed;
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
                    truck.position.x += runSpeed;
                }
            } else {
                rad += cornerSpeed;
                this.drift(15, -55, 42);
            }
            this.moveCamera();
        },
        reversInLoad() { // 倒车进入装货阶段
            if (rad >= PI) {
                if (truck.position.z >= 77.4) {
                    stepIndex++;
                } else {
                    truck.position.z += reversSpeed;
                }
            } else {
                rad += cornerSpeed;
                this.drift(11, 11, 68, true);
                this.$store.commit('setTitle', '园区停靠');
                this.$store.commit('setActCardList', ['stop']);
            }
            this.moveCamera();
        },
        loading() { // 装货
            if (count >= 300) {
                count = 0;
                rad = PI;
                stepIndex++;
            }
            count++;
            if (co.x < 4) {
                co.x += 0.055;
            }
            if (co.y > 2) {
                co.y -= 0.53;
            }
            if (co.z < 12) {
                co.z += 0.17;
            }
            this.moveCamera();
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
                        truck.position.x += runSpeed;
                    }
                } else {
                    rad -= cornerSpeed;
                    this.drift(11, 11, 68, true);
                }
            } else {
                truck.position.z -= reversSpeed;
                this.$store.commit('setTitle', '');
                this.$store.commit('setActCardList', []);
            }
            if (co.x > 0) {
                co.x -= 0.027;
            }
            if (co.y < 40) {
                co.y += 0.26;
            }
            if (co.z > 5) {
                co.z -= 0.08;
            }
            this.moveCamera();
        },
        inCurve() { // 进入弯道
            if (rad >= PI / 2) {
                if (truck.position.x <= - 11) {
                    rad = - PI / 2;
                    stepIndex++;
                } else {
                    truck.position.x -= runSpeed;
                    this.$store.commit('setTitle', '');
                    this.$store.commit('setActCardList', []);
                }
                if (co.x > 0) {
                    co.x -= 0.11;
                }
                if (co.y < 40) {
                    co.y += 0.27;
                }
                if (co.z < 5) {
                    co.z += 0.07;
                }
                this.moveCamera();
            } else {
                rad += cornerSpeed;
                this.drift(57, 80, 0);
                this.$store.commit('setTitle', '沪123456挂');
                const cx = 60 * cos(rad - 0.25) + 80;
                const cy = 2;
                const cz = - 60 * sin(rad - 0.25);
                // console.log(x, y, z);
                this.moveCamera(cx, cy, cz);
                const { x, y, z } = truck.position;
                co.x = cx - x;
                co.y = cy - y;
                co.z = cz - z;
                console.log(co);
                if (rad > PI / 3) {
                    this.$store.commit('setActCardList', ['rollalert']);
                } else if (rad > PI / 6) {
                    this.$store.commit('setActCardList', ['wheelalert']);
                } else if (rad > 0) {
                    this.$store.commit('setActCardList', ['wheel']);
                } else if (rad > - PI / 6) {
                    this.$store.commit('setActCardList', ['weight']);
                } else if (rad > - PI / 3) {
                    this.$store.commit('setActCardList', ['temp']);
                }
            }
        },
        reversInUnload() { // 倒车进入卸货园区
            if (rad >= 0) {
                if (truck.position.z <= - 77.4) {
                    stepIndex++;
                } else {
                    truck.position.z -= reversSpeed;
                }
            } else {
                rad += cornerSpeed;
                this.drift(11, -11, -68, true);
                this.$store.commit('setActCardList', ['stop']);
            }
            this.moveCamera();
        },
        unloading() { // 卸货
            if (count >= 300) {
                count = 0;
                rad = 0;
                stepIndex++;
            }
            // 车挂分离
            this.truckGroup.remove(this.backGroup);
            this.mainGroup.add(this.backGroup);
            this.backGroup.position.set(0, 2.3, -77.4);
            this.backGroup.rotation.y = PI;
            count++;
            if (co.x >- 4) {
                co.x -= 0.55;
            }
            if (co.y > 2) {
                co.y -= 0.53;
            }
            if (co.z > -12) {
                co.z -= 0.17;
            }
            this.$store.commit('setTitle', '卸货');
            this.$store.commit('setActCardList', ['unload', 'unloadtime']);
            this.moveCamera();
        },
        outUnload() { // 离开卸货园区
            if (truck.position.z >= - 68) {
                if (rad <= - PI / 2) {
                    if (truck.position.x <= -55) {
                        rad = PI / 2;
                        stepIndex++;
                    } else {
                        truck.position.x -= runSpeed;
                    }
                } else {
                    rad -= cornerSpeed;
                    this.drift(11, -11, -68, true);
                }
            } else {
                truck.position.z += reversSpeed;
                this.$store.commit('setTitle', '');
                this.$store.commit('setActCardList', []);
            }
            if (co.x < 0) {
                co.x += 0.027;
            }
            if (co.y < 40) {
                co.y += 0.26;
            }
            if (co.z < 5) {
                co.z += 0.08;
            }
            this.moveCamera();
        },
        inStation() { // 回到始发点
            if (rad >= PI) {
                if (truck.position.z >= 10) {
                    rad = 0;
                    stepIndex++;
                } else {
                    truck.position.z += runSpeed;
                }
            } else {
                this.backGroup.position.set(-85, 2.3, 0);
                this.backGroup.rotation.y = - PI / 2;
                rad += cornerSpeed;
                this.drift(15, -55, -42);
            }
            this.moveCamera();
        },
        resetStart() { // 复位
            if (rad >= PI / 2) {
                stepIndex = 0;
            } else {
                rad += cornerSpeed;
                this.drift(10, -80, 10, true);
            }
            if (co.y > 15) {
                co.y -= 0.2;
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