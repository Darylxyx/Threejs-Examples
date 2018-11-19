import TWEEN from 'tween.js';
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
let flag = false;
export default {
    methods: {
        initAnimate() {
            // this.animateList = [
            //     this.truckCombine,
            //     this.outStation,
            //     this.inLoad,
            //     this.reversInLoad,
            //     this.loading,
            //     this.outLoad,
            //     this.inCurve,
            //     this.reversInUnload,
            //     this.unloading,
            //     this.outUnload,
            //     this.inStation,
            //     this.resetStart,
            // ];
            truck = this.truckGroup;
            truck.add(this.headGroup);
            truck.rotation.y = - PI / 2;
            truck.position.x = -75;
            this.backGroup.position.x = -85;
            this.backGroup.rotation.y = - PI / 2;
            this.mainGroup.add(this.backGroup);

            this.camera.position.set(-80, 15, 10);
            this.camera.lookAt(this.v3(-80, 0, 0));

            const truckCombine = this.truckCombine();
            this.firstAnimate = truckCombine.begin;

            const outStation = this.outStation();
            truckCombine.begin.chain(outStation.begin);

            const inLoad = this.inLoad();
            outStation.end.chain(inLoad.begin);

            const reversInLoad = this.reversInLoad();
            inLoad.end.chain(reversInLoad.begin);

            const loading = this.loading();
            reversInLoad.end.chain(loading.begin);

            const outLoad = this.outLoad();
            loading.end.chain(outLoad.begin);

            const inCurve = this.inCurve();
            outLoad.end.chain(inCurve.begin);

            const reversInUnload = this.reversInUnload();
            inCurve.end.chain(reversInUnload.begin);

            const unloading = this.unloading();
            reversInUnload.end.chain(unloading.begin);

            const outUnload = this.outUnload();
            unloading.end.chain(outUnload.begin);

            const inStation = this.inStation();
            outUnload.end.chain(inStation.begin);

            const resetStart = this.resetStart();
            inStation.end.chain(resetStart.begin);
            resetStart.begin.chain(truckCombine.begin);
        },
        animateStart() {
            this.firstAnimate.start();
        },
        truckCombine() { // 组装车辆
            const _this = this;
            const obj = {x: -75};
            const tween = new TWEEN.Tween(obj)
                .to({x: -85}, 6000)
                .onStart(function() {
                    _this.signal1.position.set(0, -0.7, -5.2);
                    _this.signal2.position.set(-1, -0.9, -4.8);
                    _this.signal3.position.set(1, -0.9, -4.8);
                    _this.signal1.tween.start();
                    _this.signal2.tween.start();
                    _this.signal3.tween.start();
                })
                .onUpdate(function() { // 倒车接挂
                    console.log(this.x);
                    truck.position.x = this.x;
                    let progress =  Math.abs(truck.position.x + 75) / 10 * 100;
                    _this.$store.commit('setTitle', {
                        title: '车挂匹配',
                        type: 'connect',
                        progress,
                    });
                })
                .onComplete(function() {
                    obj.x = -75;
                    _this.mainGroup.remove(_this.backGroup);
                    _this.backGroup.position.x = 0;
                    truck.add(_this.backGroup);
                    _this.backGroup.rotation.y = 0;
                    _this.signal1.tween.stop();
                    _this.signal2.tween.stop();
                    _this.signal3.tween.stop();
                    _this.$store.commit('setTitle', {});
                })
                .delay(3000);
            return {
                begin: tween,
            };
        },
        outStation() { // 出站
            const _this = this;
            // 倒车
            const objIn = {x: -85};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({x: -80}, 1000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                })
                .onComplete(function() {
                    objIn.x = -85;
                });
            // 转向
            const objMid = {rad: PI / 2};
            const tweenMid = new TWEEN.Tween(objMid)
                .to({rad: 0}, 1000)
                .onUpdate(function() {
                    _this.drift(10, this.rad, -80, 10, true);
                })
                .onComplete(function() {
                    objMid.rad = PI / 2;
                });
            tweenIn.chain(tweenMid);
            // 直行
            const objOut = {z: 10};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: 42}, 1000)
                .onUpdate(function() {
                    truck.position.z = this.z;
                })
                .onComplete(function() {
                    objOut.z = 10;
                });
            tweenMid.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        inLoad() { // 进入
            const _this = this;
            // 转向
            const objIn = {rad: PI};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: PI / 2 * 3}, 1000)
                .onUpdate(function() {
                    _this.drift(15, this.rad, -55, 42);
                })
                .onComplete(function() {
                    objIn.rad = PI;
                });
            // 直行
            const objOut = {x: -55};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: 11}, 1000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                })
                .onComplete(function() {
                    objOut.x = -55;
                });
            tweenIn.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        reversInLoad() { // 倒车进入装货阶段
            const _this = this;
            const objIn = {rad: PI / 2};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: PI}, 1000)
                .onStart(function() {
                    _this.signal2.position.set(0, 0.8, 0);
                    _this.signal2.tween.start();
                })
                .onUpdate(function() {
                    _this.drift(11, this.rad, 11, 68, true);
                })
                .onComplete(function() {
                    objIn.rad = PI / 2;
                });
            const objOut = {z: 68};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: 77.4}, 1000)
                .onUpdate(function() {
                    truck.position.z = this.z;
                })
                .onComplete(function() {
                    objOut.z = 68;
                });
            tweenIn.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        loading() { // 装货
            const _this = this;
            const tweenLoc = new TWEEN.Tween({})
                .to({}, 2000)
                .onStart(function() {
                    _this.$store.commit('setActCardList', ['location']);
                });
            const tweenPlat = new TWEEN.Tween({})
                .to({}, 2000)
                .onStart(function() {
                    _this.loadMatchSpace.tween.start();
                    _this.$store.commit('setActCardList', ['platform']);
                });
            tweenLoc.chain(tweenPlat);
            const tweenStop = new TWEEN.Tween({})
                .to({}, 2000)
                .onStart(function() {
                    _this.signal2.tween.stop();
                    _this.loadMatchSpace.tween.stop();
                    _this.$store.commit('setTitle', { title: '园区停靠' });
                    _this.$store.commit('setActCardList', ['stop']);
                });
            tweenPlat.chain(tweenStop);
            const tweenLoad = new TWEEN.Tween({})
                .to({}, 12000)
                .onStart(function() {
                    _this.$store.commit('setTitle', { title: '装货' });
                    _this.$store.commit('setActCardList', ['load', 'loadtime']);
                    const goods = _this.goodsList;
                    goods.forEach((good) => {
                        good.inTween.start();
                    });
                });
            tweenStop.chain(tweenLoad);
            return {
                begin: tweenLoc,
                end: tweenLoad,
            };
        },
        outLoad() { // 离开装货园区
            const _this = this;
            const objIn = {z: 77.4};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({z: 70}, 1000)
                .onStart(function() {
                    _this.$store.commit('setTitle', {});
                    _this.$store.commit('setActCardList', []);
                })
                .onUpdate(function() {
                    truck.position.z = this.z;
                })
                .onComplete(function() {
                    objIn.z = 77.4;
                });
            const objMid = {rad: PI};
            const tweenMid = new TWEEN.Tween(objMid)
                .to({rad: PI / 2}, 1000)
                .onUpdate(function() {
                    _this.drift(11, this.rad, 11, 70, true);
                })
                .onComplete(function() {
                    objMid.rad = PI;
                });
            tweenIn.chain(tweenMid);
            const objOut = {x: 11};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: 80}, 1000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                })
                .onComplete(function() {
                    objOut.x = 11;
                });
            tweenMid.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        inCurve() { // 进入弯道
            const _this = this;
            const objIn = {rad: - PI / 2};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: PI / 2}, 10000)
                .onUpdate(function() {
                    _this.drift(59, this.rad, 80, 0);
                    // if (rad > PI / 3) {
                    //     console.log(1);
                    //     _this.signal2.position.set(0.9, -1.5, 0);
                    //     _this.$store.commit('setActCardList', ['rollalert']);
                    // } else if (rad > PI / 6) {
                    //     _this.signal2.position.set(0.9, -1.8, 3);
                    //     _this.$store.commit('setActCardList', ['wheelalert']);
                    // } else if (rad > 0) {
                    //     _this.signal2.position.set(0.9, -1.8, 3);
                    //     _this.$store.commit('setActCardList', ['wheel']);
                    // } else if (rad > - PI / 6) {
                    //     _this.signal2.position.set(1, 0, 0);
                    //     _this.$store.commit('setActCardList', ['weight']);
                    // } else if (rad > - PI / 3) {
                    //     _this.signal2.position.set(0, 0.6, 0);
                    //     _this.signal2.tween.start();
                    //     _this.$store.commit('setActCardList', ['temp']);
                    // }
                })
                .onComplete(function() {
                    objIn.rad = - PI / 2;
                });
            const objOut = {x: 80};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: -11})
                .onUpdate(function() {
                    truck.position.x = this.x;
                })
                .onComplete(function() {
                    objOut.x = 80;
                });
            tweenIn.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        reversInUnload() { // 倒车进入卸货园区
            const _this = this;
            const objIn = {rad: - PI / 2}
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: 0}, 1000)
                .onStart(function() {
                    _this.signal2.position.set(0, 0.8, 0);
                    _this.signal2.tween.start();
                })
                .onUpdate(function() {
                    _this.drift(11, this.rad, -11, -70, true)
                })
                .onComplete(function() {
                    objIn.rad = - PI / 2;
                });
            const objOut = {z: -70};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: -77.4}, 1000)
                .onUpdate(function() {
                    truck.position.z = this.z;
                })
                .onComplete(function() {
                    objOut.z = -70;
                });
            tweenIn.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        unloading() { // 卸货
            const _this = this;
            const tweenLoc = new TWEEN.Tween({})
                .to({}, 2000)
                .onStart(function() {
                    _this.$store.commit('setActCardList', ['location']);
                });
            const tweenPlat = new TWEEN.Tween({})
                .to({}, 2000)
                .onStart(function() {
                    _this.unloadMatchSpace.tween.start();
                    _this.$store.commit('setActCardList', ['platform']);
                });
            tweenLoc.chain(tweenPlat);
            const tweenStop = new TWEEN.Tween({})
                .to({}, 2000)
                .onStart(function() {
                    _this.signal2.tween.stop();
                    _this.unloadMatchSpace.tween.stop();
                    _this.$store.commit('setTitle', { title: '园区停靠' });
                    _this.$store.commit('setActCardList', ['stop']);
                });
            tweenPlat.chain(tweenStop);
            const tweenLoad = new TWEEN.Tween({})
                .to({}, 12000)
                .onStart(function() {
                    _this.$store.commit('setTitle', { title: '卸货' });
                    _this.$store.commit('setActCardList', ['unload', 'unloadtime']);
                    const goods = _this.goodsList;
                    for (let i = goods.length - 1; i > -1; i--) {
                        goods[i].outTween.start();
                    }
                });
            tweenStop.chain(tweenLoad);
            return {
                begin: tweenLoc,
                end: tweenLoad,
            };
        },
        outUnload() { // 离开卸货点
            const _this = this;
            const objIn = {z: -77.4};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({z: -68}, 1000)
                .onStart(function() {
                    _this.$store.commit('setTitle', {});
                    _this.$store.commit('setActCardList', []);
                })
                .onUpdate(function() {
                    truck.position.z = this.z;
                })
                .onComplete(function() {
                    objIn.z = -77.4;
                });
            const objMid = {rad: 0};
            const tweenMid = new TWEEN.Tween(objMid)
                .to({rad: - PI / 2}, 1000)
                .onUpdate(function() {
                    _this.drift(11, this.rad, -11, -68, true);
                })
                .onComplete(function() {
                    objMid.rad = 0;
                });
            tweenIn.chain(tweenMid);
            const objOut = {x: -11};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: -50}, 1000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                })
                .onComplete(function() {
                    objOut.x = -11;
                    _this.truckGroup.remove(_this.backGroup);
                    _this.mainGroup.add(_this.backGroup);
                    _this.backGroup.position.set(-50, 2.3, -57);
                    _this.backGroup.rotation.y = PI / 2;
                });
            tweenMid.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        inStation() { // 回到起点
            const _this = this;
            const objIn = {rad: PI / 2};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: PI}, 1000)
                .onUpdate(function() {
                    _this.drift(15, this.rad, -50, -42);
                })
                .onComplete(function() {
                    objIn.rad = PI / 2;
                });
            const objOut = {z: -27}
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: 10}, 1000)
                .onStart(function() {
                    _this.backGroup.position.set(-85, 2.3, 0);
                    _this.backGroup.rotation.y = - PI / 2;
                })
                .onUpdate(function() {
                    truck.position.z = this.z;
                })
                .onComplete(function() {
                    objOut.z = -27;
                });
            tweenIn.chain(tweenOut);
            return {
                begin: tweenIn,
                end: tweenOut,
            };
        },
        resetStart() { // 复位
            const _this = this;
            const obj = {rad: 0};
            const tween = new TWEEN.Tween(obj)
                .to({rad: PI / 2}, 1000)
                .onUpdate(function() {
                    _this.drift(10, this.rad, -75, 10, true);
                })
                .onComplete(function() {
                    obj.rad = 0;
                });
            return {
                begin: tween,
            };
        },
        drift(r, rad, offsetX, offsetZ, clockwise = false) {
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
        // carAnimate() {
        //     this.animateList[stepIndex] && this.animateList[stepIndex]();
        // },
        // truckCombine() { // 组装车辆
        //     if (count > 120) {
        //         if (truck.position.x <= -85) {
        //             this.mainGroup.remove(this.backGroup);
        //             this.backGroup.position.x = 0;
        //             truck.add(this.backGroup);
        //             this.backGroup.rotation.y = 0;
        //             this.$store.commit('setTitle', {});
        //             this.signal1.tween.stop();
        //             this.signal2.tween.stop();
        //             this.signal3.tween.stop();
        //             stepIndex++;
        //         } else {
        //             if (count === 130) {
        //                 this.signal1.position.set(0, -0.7, -5.2);
        //                 this.signal2.position.set(-1, -0.9, -4.8);
        //                 this.signal3.position.set(1, -0.9, -4.8);
        //                 this.signal1.tween.start();
        //                 this.signal2.tween.start();
        //                 this.signal3.tween.start();
        //             } else if (count > 130) {
        //                 truck.position.x -= 0.02;
        //                 let progress = Math.abs(truck.position.x + 75) / 10 * 100;
        //                 if (progress > 100) progress = 100;
        //                 this.$store.commit('setTitle', {
        //                     title: '车挂匹配',
        //                     type: 'connect',
        //                     progress,
        //                 });
        //             }
        //         }
        //     } 
        //     count++;
        // },
        // outStation() { // 出站
        //     count = 0;
        //     if (truck.position.x >= -80) {
        //         if (rad <= 0) {
        //             if (truck.position.z >= 42) {
        //                 rad = PI;
        //                 stepIndex++;
        //             }
        //             truck.position.z += runSpeed;
        //         } else {
        //             rad -= cornerSpeed;
        //             this.drift(10, -80, 10, true);
        //         }
        //     } else {
        //         truck.position.x += reversSpeed;
        //     }
        //     if (co.y < 40) {
        //         co.y += 0.2;
        //     }
        //     this.moveCamera();
        // },
        // inLoad() { // 进入装货园区
        //     if (rad >= PI / 2 * 3) {
        //         if (truck.position.x >= 11) {
        //             rad = PI / 2;
        //             stepIndex++;
        //         } else {
        //             truck.position.x += runSpeed;
        //         }
        //     } else {
        //         rad += cornerSpeed;
        //         this.drift(15, -55, 42);
        //     }
        //     this.moveCamera();
        // },
        // reversInLoad() { // 倒车进入装货阶段
        //     if (rad >= PI) {
        //         if (truck.position.z >= 77.4) {
        //             stepIndex++;
        //         } else {
        //             truck.position.z += reversSpeed;
        //         }
        //     } else {
        //         rad += cornerSpeed;
        //         this.drift(11, 11, 68, true);
        //     }
        //     if (!flag) {
        //         this.signal2.position.set(0, 0.8, 0);
        //         this.signal2.tween.start();
        //         flag = true;
        //     }
        //     this.moveCamera();
        // },
        // loading() { // 装货
        //     if (count >= 1300) {
        //         count = 0;
        //         stepIndex++;
        //     } else if (count > 400 && count < 600) {
        //         if (co.x < 4) {
        //             co.x += 0.055;
        //         }
        //         if (co.y > 8) {
        //             co.y -= 0.53;
        //         }
        //         if (co.z < 5) {
        //             co.z += 0.17;
        //         }
        //     } else if (count === 50) {
        //         this.$store.commit('setActCardList', ['location']);
        //     } else if (count === 200) {
        //         this.loadMatchSpace.tween.start(0.9, -1.5, 0);
        //         this.$store.commit('setActCardList', ['platform']);
        //     } else if (count === 400) {
        //         this.signal2.tween.stop();
        //         this.loadMatchSpace.tween.stop();
        //         this.$store.commit('setTitle', { title: '园区停靠' });
        //         this.$store.commit('setActCardList', ['stop']);
        //         this.backGroup.remove(s1);
        //         flag = false;
        //     } else if (count === 600) {
        //         this.$store.commit('setTitle', { title: '装货' });
        //         this.$store.commit('setActCardList', ['load', 'loadtime']);
        //         const goods = this.goodsList;
        //         goods.forEach((good) => {
        //             good.inTween.start();
        //         });
        //     }
        //     count++;
        //     this.moveCamera();
        // },
        // outLoad() { // 离开装货园区
        //     if (truck.position.z <= 70) {
        //         if (rad <= PI / 2) {
        //             if (truck.position.x >= 80) {
        //                 rad = - PI / 2;
        //                 stepIndex++;
        //             } else {
        //                 truck.position.x += runSpeed;
        //             }
        //         } else {
        //             rad -= cornerSpeed;
        //             this.drift(11, 11, 70, true);
        //         }
        //     } else {
        //         truck.position.z -= reversSpeed;
        //         this.$store.commit('setTitle', {});
        //         this.$store.commit('setActCardList', []);
        //     }
        //     if (co.x > 0) {
        //         co.x -= 0.027;
        //     }
        //     if (co.y < 40) {
        //         co.y += 0.26;
        //     }
        //     if (co.z > 5) {
        //         co.z -= 0.08;
        //     }
        //     this.moveCamera();
        // },
        // inCurve() { // 进入弯道
        //     if (rad >= PI / 2) {
        //         if (truck.position.x <= - 11) {
        //             rad = - PI / 2;
        //             count = 0;
        //             stepIndex++;
        //         } else {
        //             truck.position.x -= runSpeed;
        //             this.$store.commit('setTitle', {});
        //             this.$store.commit('setActCardList', []);
        //         }
        //         if (co.x > 0) {
        //             co.x -= 0.11;
        //         }
        //         if (co.y < 40) {
        //             co.y += 0.27;
        //         }
        //         if (co.z < 5) {
        //             co.z += 0.07;
        //         }
        //         this.moveCamera();
        //         console.log(count);
        //         if (count === 5) {
        //             this.signal2.tween.stop();
        //         }
        //         count++;
        //     } else {
        //         rad += 0.003;
        //         this.drift(59, 80, 0);
        //         this.$store.commit('setTitle', {
        //             type: 'trailer',
        //         });
        //         const cx = 63 * cos(rad - 0.2) + 80;
        //         const cy = 4;
        //         const cz = - 63 * sin(rad - 0.2);
        //         this.moveCamera(cx, cy, cz);
        //         const { x, y, z } = truck.position;
        //         co.x = cx - x;
        //         co.y = cy - y;
        //         co.z = cz - z;
        //         if (rad > PI / 3) {
        //             this.signal2.position.set(0.9, -1.5, 0);
        //             this.$store.commit('setActCardList', ['rollalert']);
        //         } else if (rad > PI / 6) {
        //             this.signal2.position.set(0.9, -1.8, 3);
        //             this.$store.commit('setActCardList', ['wheelalert']);
        //         } else if (rad > 0) {
        //             this.signal2.position.set(0.9, -1.8, 3);
        //             this.$store.commit('setActCardList', ['wheel']);
        //         } else if (rad > - PI / 6) {
        //             this.signal2.position.set(1, 0, 0);
        //             this.$store.commit('setActCardList', ['weight']);
        //         } else if (rad > - PI / 3) {
        //             this.signal2.position.set(0, 0.6, 0);
        //             this.signal2.tween.start();
        //             this.$store.commit('setActCardList', ['temp']);
        //         }
        //     }
        // },
        // reversInUnload() { // 倒车进入卸货园区
        //     if (rad >= 0) {
        //         if (truck.position.z <= - 77.4) {
        //             stepIndex++;
        //         } else {
        //             truck.position.z -= reversSpeed;
        //         }
        //     } else {
        //         rad += cornerSpeed;
        //         this.drift(11, -11, -70, true);
        //         if (!flag) {
        //             this.signal2.position.set(0, 0.8, 0);
        //             this.signal2.tween.start();
        //             flag = true;
        //         }
        //     }
        //     this.moveCamera();
        // },
        // unloading() { // 卸货
        //     if (count >= 1300) {
        //         count = 0;
        //         stepIndex++;
        //     } else if (count > 400 && count < 600) {
        //         if (co.x >- 4) {
        //             co.x -= 0.55;
        //         }
        //         if (co.y > 8) {
        //             co.y -= 0.53;
        //         }
        //         if (co.z > -5) {
        //             co.z -= 0.17;
        //         }
        //     } else if (count === 50) {
        //         this.$store.commit('setActCardList', ['location']);
        //     } else if (count === 200) {
        //         this.unloadMatchSpace.tween.start();
        //         this.$store.commit('setActCardList', ['platform']);
        //     } else if (count === 400) {
        //         this.unloadMatchSpace.tween.stop();
        //         this.signal2.tween.stop();
        //         this.$store.commit('setTitle', { title: '园区停靠' });
        //         this.$store.commit('setActCardList', ['stop']);
        //         this.backGroup.remove(s1);
        //         flag = false;
        //     } else if (count === 600) {
        //         this.$store.commit('setTitle', { title: '卸货' });
        //         this.$store.commit('setActCardList', ['unload', 'unloadtime']);
        //         const goods = this.goodsList;
        //         for (let i = goods.length - 1; i > -1; i--) {
        //             goods[i].outTween.start();
        //         }
        //     }
        //     count++;
        //     this.moveCamera();
        // },
        // outUnload() { // 离开卸货园区
        //     if (truck.position.z >= - 68) {
        //         if (rad <= - PI / 2) {
        //             if (truck.position.x <= -55) {
        //                 rad = PI / 2;
        //                 // 车挂分离
        //                 this.truckGroup.remove(this.backGroup);
        //                 this.mainGroup.add(this.backGroup);
        //                 this.backGroup.position.set(-55, 2.3, -57);
        //                 this.backGroup.rotation.y = PI / 2;
        //                 stepIndex++;
        //             } else {
        //                 truck.position.x -= runSpeed;
        //             }
        //         } else {
        //             rad -= cornerSpeed;
        //             this.drift(11, -11, -68, true);
        //         }
        //     } else {
        //         truck.position.z += reversSpeed;
        //         this.$store.commit('setTitle', {});
        //         this.$store.commit('setActCardList', []);
        //     }
        //     if (co.x < 0) {
        //         co.x += 0.027;
        //     }
        //     if (co.y < 40) {
        //         co.y += 0.26;
        //     }
        //     if (co.z < 5) {
        //         co.z += 0.08;
        //     }
        //     this.moveCamera();
        // },
        // inStation() { // 回到始发点
        //     if (rad >= PI) {
        //         if (truck.position.z >= 10) {
        //             rad = 0;
        //             stepIndex++;
        //         } else {
        //             truck.position.z += runSpeed;
        //             this.backGroup.position.set(-85, 2.3, 0);
        //             this.backGroup.rotation.y = - PI / 2;
        //         }
        //     } else {
        //         rad += cornerSpeed;
        //         this.drift(15, -55, -42);
        //     }
        //     this.moveCamera();
        // },
        // resetStart() { // 复位
        //     if (rad >= PI / 2) {
        //         stepIndex = 0;
        //     } else {
        //         rad += cornerSpeed;
        //         this.drift(10, -80, 10, true);
        //     }
        //     if (co.y > 15) {
        //         co.y -= 0.2;
        //     }
        //     this.moveCamera();
        //     window.$$vue.round++;
        // },
    },
};