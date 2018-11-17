// 动画队列
let truck = null;
const { PI, sin, cos } = Math;
let rad = PI / 2; // 通用弧度变量（用于计算车辆过弯）
let stepIndex = 0; // 当前动画步骤
let count = 0;
let goodsIndex = 0; // 货物动画索引
let goodsFar = 0;
const runSpeed = 0.5; // 直路行进速度
const reversSpeed = 0.05; // 倒车速度
const cornerSpeed = 0.01; // 转弯速度
const co = { // 摄影机偏移量
    x: 0,
    y: 15,
    z: 5    
};
let s1, s2, s3; // 三组信号灯
let flag = false;
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

            this.camera.position.set(-80, 15, 10);
            this.camera.lookAt(this.v3(-80, 0, 0));
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
                    this.$store.commit('setTitle', {});
                    this.headGroup.remove(s1);
                    this.backGroup.remove(s2);
                    this.backGroup.remove(s3);
                    stepIndex++;
                } else {
                    if (count === 130) {
                        s1 = this.createSignal();
                        s1.position.set(0, 0.8, -5.5);
                        s2 = this.createSignal();
                        s2.position.set(-1, 0.8, -4.8);
                        s3 = this.createSignal();
                        s3.position.set(1, 0.8, -4.8);
                        s1.tween.start();
                        s2.tween.start();
                        s3.tween.start();
                        this.headGroup.add(s1);
                        this.backGroup.add(s2);
                        this.backGroup.add(s3);
                    } else if (count > 130) {
                        truck.position.x -= 0.02;
                        let progress = Math.abs(truck.position.x + 75) / 10 * 100;
                        if (progress > 100) progress = 100;
                        this.$store.commit('setTitle', {
                            title: '车挂匹配',
                            type: 'connect',
                            progress,
                        });
                    }
                }
            } 
            count++;
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
            }
            if (!flag) {
                s1.position.set(0, 0.8, 0);
                this.backGroup.add(s1);
                flag = true;
            }
            this.moveCamera();
        },
        loading() { // 装货
            if (count >= 1300) {
                count = 0;
                stepIndex++;
            } else if (count > 400 && count < 600) {
                if (co.x < 4) {
                    co.x += 0.055;
                }
                if (co.y > 8) {
                    co.y -= 0.53;
                }
                if (co.z < 5) {
                    co.z += 0.17;
                }
            } else if (count === 50) {
                this.$store.commit('setActCardList', ['location']);
            } else if (count === 200) {
                this.$store.commit('setActCardList', ['platform']);
            } else if (count === 400) {
                this.$store.commit('setTitle', { title: '园区停靠' });
                this.$store.commit('setActCardList', ['stop']);
                this.backGroup.remove(s1);
                flag = false;
            } else if (count === 600) {
                this.$store.commit('setTitle', { title: '装货' });
                this.$store.commit('setActCardList', ['load', 'loadtime']);
                const goods = this.goodsList;
                goods.forEach((good) => {
                    good.inTween.start();
                });
            }
            count++;
            this.moveCamera();
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
                this.$store.commit('setTitle', {});
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
                    this.$store.commit('setTitle', {});
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
                rad += 0.005;
                this.drift(57, 80, 0);
                this.$store.commit('setTitle', {
                    type: 'trailer',
                });
                const cx = 60 * cos(rad - 0.2) + 80;
                const cy = 4;
                const cz = - 60 * sin(rad - 0.2);
                // console.log(x, y, z);
                this.moveCamera(cx, cy, cz);
                const { x, y, z } = truck.position;
                co.x = cx - x;
                co.y = cy - y;
                co.z = cz - z;
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
                if (!flag) {
                    s1.position.set(0, 0.8, 0);
                    this.backGroup.add(s1);
                    flag = true;
                }
            }
            this.moveCamera();
        },
        unloading() { // 卸货
            if (count >= 1300) {
                count = 0;
                stepIndex++;
            } else if (count > 400 && count < 600) {
                if (co.x >- 4) {
                    co.x -= 0.55;
                }
                if (co.y > 8) {
                    co.y -= 0.53;
                }
                if (co.z > -5) {
                    co.z -= 0.17;
                }
            } else if (count === 50) {
                this.$store.commit('setActCardList', ['location']);
            } else if (count === 200) {
                this.$store.commit('setActCardList', ['platform']);
            } else if (count === 400) {
                this.$store.commit('setTitle', { title: '园区停靠' });
                this.$store.commit('setActCardList', ['stop']);
                this.backGroup.remove(s1);
                flag = false;
            } else if (count === 600) {
                this.$store.commit('setTitle', { title: '卸货' });
                this.$store.commit('setActCardList', ['unload', 'unloadtime']);
                const goods = this.goodsList;
                for (let i = goods.length - 1; i > -1; i--) {
                    goods[i].outTween.start();
                }
            }
            count++;
            this.moveCamera();
        },
        outUnload() { // 离开卸货园区
            if (truck.position.z >= - 68) {
                if (rad <= - PI / 2) {
                    if (truck.position.x <= -55) {
                        rad = PI / 2;
                        // 车挂分离
                        this.truckGroup.remove(this.backGroup);
                        this.mainGroup.add(this.backGroup);
                        this.backGroup.position.set(-55, 2.3, -57);
                        this.backGroup.rotation.y = PI / 2;
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
                this.$store.commit('setTitle', {});
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
                    this.backGroup.position.set(-85, 2.3, 0);
                    this.backGroup.rotation.y = - PI / 2;
                }
            } else {
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
            window.$$vue.round++;
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