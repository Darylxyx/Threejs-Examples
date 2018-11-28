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
let co = { // 摄影机偏移量
    x: 0,
    y: 15,
    z: 10
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
            resetStart.end.chain(truckCombine.begin);

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
                    truck.position.x = this.x;
                    let progress =  Math.abs(truck.position.x + 75) / 10 * 100;
                    _this.$store.commit('setTitle', {
                        title: '接挂',
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
                    _this.$store.commit('setTitle', {
                        title: '任务开始',
                    });
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
                .to({x: -80}, 2000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objIn.x = -85;
                });
            // 镜头动画
            const objc = {y: 15};
            const ct = new TWEEN.Tween(objc)
                .to({y: 30}, 1000)
                .onUpdate(function() {
                    co.y = this.y;
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objc.y = 15;
                });
            ct.chain(tweenIn);
            // 转向
            const objMid = {rad: PI / 2};
            const tweenMid = new TWEEN.Tween(objMid)
                .to({rad: 0}, 2000)
                .onUpdate(function() {
                    _this.drift(10, this.rad, -80, 10, true);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    _this.$store.commit('setTitle', {});
                    objMid.rad = PI / 2;
                });
            tweenIn.chain(tweenMid);
            // 直行
            const objOut = {z: 10};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: 42}, 3000)
                .onUpdate(function() {
                    truck.position.z = this.z;
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objOut.z = 10;
                });
            tweenMid.chain(tweenOut);
            return {
                begin: ct,
                end: tweenOut,
            };
        },
        inLoad() { // 进入装货点
            const _this = this;
            // 转向
            const objIn = {rad: PI};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: PI / 2 * 3}, 2000)
                .onUpdate(function() {
                    _this.drift(15, this.rad, -55, 42);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objIn.rad = PI;
                });
            // 直行
            const objOut = {x: -55};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: 11}, 4000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                    _this.moveCamera();
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
                .to({rad: PI}, 2000)
                .onStart(function() {
                    _this.signal2.position.set(0, 0.9, 0);
                    _this.signal2.tween.start();
                })
                .onUpdate(function() {
                    _this.drift(11, this.rad, 11, 68, true);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objIn.rad = PI / 2;
                });
            const objOut = {z: 68};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: 77.4}, 3000)
                .onUpdate(function() {
                    truck.position.z = this.z;
                    _this.moveCamera();
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
                .to({}, 500)
                .onStart(function() {
                    // _this.$store.commit('setActCardList', ['location']);
                });
            const tweenPlat = new TWEEN.Tween({})
                .to({}, 4000)
                .onStart(function() {
                    _this.loadMatchSpace.tween.start();
                    _this.$store.commit('setTitle', { title: '园区停靠' });
                    _this.$store.commit('setActCardList', ['stop']);
                });
            tweenLoc.chain(tweenPlat);
            const tweenStop = new TWEEN.Tween({})
                .to({}, 1000)
                .onStart(function() {
                    _this.signal2.tween.stop();
                    _this.loadMatchSpace.tween.stop();
                    // _this.$store.commit('setActCardList', ['stop']);
                });
            tweenPlat.chain(tweenStop);
            let co1 = {x: 0, y: 30, z: 87.4};
            const ct1 = new TWEEN.Tween(co1)
                .to({x: 4, y: 5, z: 100}, 1000)
                .onUpdate(function() {
                    _this.moveCamera(this.x, this.y, this.z);
                })
                .onComplete(function() {
                    co1 = {x: 0, y: 30, z: 87.4};
                });
            tweenStop.chain(ct1);
            let co2 = {x: 4, y: 5, z: 100};
            const ct2 = new TWEEN.Tween(co2)
                .to({x: 4, y: 8, z: 82.4}, 1000)
                .onUpdate(function() {
                    _this.moveCamera(this.x, this.y, this.z);
                })
                .onComplete(function() {
                    co2 = {x: 4, y: 5, z: 100};
                })
                .delay(1000);
            ct1.chain(ct2);
            let lo = {index: 0};
            const tweenLoad = new TWEEN.Tween(lo)
                .to({index: 15}, 15000)
                .onStart(function() {
                    _this.$store.commit('setTitle', { title: '装货' });
                    _this.$store.commit('setActCardList', ['load', 'loadtime']);
                    const goods = _this.goodsList;
                    goods.forEach((good) => {
                        good.inTween.start();
                    });
                })
                .onUpdate(function() {
                    if (this.index >= 10) {
                        _this.$store.commit('showPic', 3);
                    } else if (this.index >= 5) {
                        _this.$store.commit('showPic', 2);
                    } else if (this.index >= 1) {
                        _this.$store.commit('showPic', 1);
                    }
                })
                .onComplete(function() {
                    lo.index = 0;
                    _this.$store.commit('showPic', 0);
                });
            ct2.chain(tweenLoad);
            return {
                begin: tweenLoc,
                end: tweenLoad,
            };
        },
        outLoad() { // 离开装货园区
            const _this = this;
            const objIn = {z: 77.4};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({z: 70}, 3000)
                .onStart(function() {
                    _this.$store.commit('setTitle', {});
                    _this.$store.commit('setActCardList', []);
                })
                .onUpdate(function() {
                    truck.position.z = this.z;
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objIn.z = 77.4;
                });
            let co = {x: 4, y: 8, z: 82.4};
            const ct = new TWEEN.Tween(co)
                .to({x: 0, y: 30, z: 87.4}, 1000)
                .onUpdate(function() {
                    _this.moveCamera(this.x, this.y, this.z);
                })
                .onComplete(function() {
                    co = {x: 4, y: 8, z: 82.4};
                });
            ct.chain(tweenIn);
            const objMid = {rad: PI};
            const tweenMid = new TWEEN.Tween(objMid)
                .to({rad: PI / 2}, 2000)
                .onUpdate(function() {
                    _this.drift(11, this.rad, 11, 70, true);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objMid.rad = PI;
                });
            tweenIn.chain(tweenMid);
            const objOut = {x: 11};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: 80}, 4000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objOut.x = 11;
                });
            tweenMid.chain(tweenOut);
            return {
                begin: ct,
                end: tweenOut,
            };
        },
        inCurve() { // 进入弯道
            const _this = this;
            const et1 = new TWEEN.Tween({})
                .to({}, 100)
                .onStart(function() {
                    // _this.signal2.position.set(0, 0.8, -4.5);
                    _this.signal2.tween.start();
                    // _this.$store.commit('setActCardList', ['temp']);
                });
            const et2 = new TWEEN.Tween({})
                .to({}, 6000)
                .onStart(function() {
                    _this.signal2.position.set(1, 0, 0);
                    _this.$store.commit('setActCardList', ['weight']);
                });
            const et3 = new TWEEN.Tween({})
                .to({}, 6000)
                .onStart(function() {
                    _this.signal2.position.set(1, -1.85, 3);
                    _this.$store.commit('setActCardList', ['wheel']);
                });
            const et4 = new TWEEN.Tween({})
                .to({}, 6000)
                .onStart(function() {
                    _this.signal2.position.set(1, -1.85, 3);
                    _this.$store.commit('setActCardList', ['wheelalert']);
                });
            const et5 = new TWEEN.Tween({})
                .to({}, 6000)
                .onStart(function() {
                    _this.signal2.position.set(1, -1.4, 1);
                    _this.$store.commit('setActCardList', ['rollalert']);
                });
            et1.chain(et2);
            et2.chain(et3);
            et3.chain(et4);
            et4.chain(et5);
            const objIn = {rad: - PI / 2};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: PI / 2}, 30000)
                .onStart(function() {
                    et1.start();
                })
                .onUpdate(function() {
                    _this.drift(59, this.rad, 80, 0);
                    const cx = 64 * cos(this.rad - 0.1) + 80;
                    const cy = 4;
                    const cz = - 64 * sin(this.rad - 0.1);
                    _this.moveCamera(cx, cy, cz);
                })
                .onComplete(function() {
                    _this.signal2.tween.stop();
                    _this.$store.commit('setActCardList', []);
                    objIn.rad = - PI / 2;
                    co.x = 0;
                    co.y = 30;
                    co.z = 10;
                });
            const objOut = {x: 80};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: -11}, 3000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                    _this.moveCamera();
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
                .to({rad: 0}, 3000)
                .onStart(function() {
                    _this.signal2.position.set(0, 0.9, 0);
                    _this.signal2.tween.start();
                })
                .onUpdate(function() {
                    _this.drift(11, this.rad, -11, -70, true);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objIn.rad = - PI / 2;
                });
            const objOut = {z: -70};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: -77.4}, 3000)
                .onUpdate(function() {
                    truck.position.z = this.z;
                    _this.moveCamera();
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
                .to({}, 500)
                .onStart(function() {
                    // _this.$store.commit('setActCardList', ['location']);
                });
            const tweenPlat = new TWEEN.Tween({})
                .to({}, 4000)
                .onStart(function() {
                    _this.unloadMatchSpace.tween.start();
                    _this.$store.commit('setTitle', { title: '园区停靠' });
                    _this.$store.commit('setActCardList', ['unloadstop']);
                });
            tweenLoc.chain(tweenPlat);
            const tweenStop = new TWEEN.Tween({})
                .to({}, 1000)
                .onStart(function() {
                    _this.signal2.tween.stop();
                    _this.unloadMatchSpace.tween.stop();
                    // _this.$store.commit('setTitle', { title: '园区停靠' });
                    // _this.$store.commit('setActCardList', ['unloadstop']);
                });
            tweenPlat.chain(tweenStop);
            let co1 = {x: 0, y: 30, z: -87.4};
            const ct1 = new TWEEN.Tween(co1)
                .to({x: -4, y: 5, z: -100}, 1000)
                .onUpdate(function() {
                    _this.moveCamera(this.x, this.y, this.z);
                })
                .onComplete(function() {
                    co1 = {x: 0, y: 30, z: -87.4};
                });
            tweenStop.chain(ct1);
            let co2 = {x: -4, y: 5, z: -100};
            const ct2 = new TWEEN.Tween(co2)
                .to({x: -4, y: 8, z: -82.4}, 1000)
                .onUpdate(function() {
                    _this.moveCamera(this.x, this.y, this.z);
                })
                .onComplete(function() {
                    co2 = {x: -4, y: 5, z: -100};
                })
                .delay(1000);
            ct1.chain(ct2);
            const tweenLoad = new TWEEN.Tween({})
                .to({}, 15000)
                .onStart(function() {
                    _this.$store.commit('setTitle', { title: '卸货' });
                    _this.$store.commit('setActCardList', ['unload', 'unloadtime']);
                    const goods = _this.goodsList;
                    for (let i = goods.length - 1; i > -1; i--) {
                        goods[i].outTween.start();
                    }
                });
            ct2.chain(tweenLoad);
            return {
                begin: tweenLoc,
                end: tweenLoad,
            };
        },
        outUnload() { // 离开卸货点
            const _this = this;
            const objIn = {z: -77.4};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({z: -68}, 3000)
                .onStart(function() {
                    co.x = 0;
                    co.y = 30;
                    co.z = 10;
                    _this.$store.commit('setTitle', {});
                    _this.$store.commit('setActCardList', []);
                })
                .onUpdate(function() {
                    truck.position.z = this.z;
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objIn.z = -77.4;
                });
            let co = {x: -4, y: 8, z: -82.4};
            const ct = new TWEEN.Tween(co)
                .to({x: 0, y: 30, z: -87.4}, 1000)
                .onUpdate(function() {
                    _this.moveCamera(this.x, this.y, this.z);
                })
                .onComplete(function() {
                    co = {x: -4, y: 8, z: -82.4};
                });
            ct.chain(tweenIn);
            const objMid = {rad: 0};
            const tweenMid = new TWEEN.Tween(objMid)
                .to({rad: - PI / 2}, 2000)
                .onUpdate(function() {
                    _this.drift(11, this.rad, -11, -68, true);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objMid.rad = 0;
                });
            tweenIn.chain(tweenMid);
            const objOut = {x: -11};
            const tweenOut = new TWEEN.Tween(objOut)
                .to({x: -40}, 2000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                    _this.moveCamera();
                })
                .onComplete(function() {
                    objOut.x = -11;
                    _this.truckGroup.remove(_this.backGroup);
                    _this.mainGroup.add(_this.backGroup);
                    _this.backGroup.position.set(-40, 2.3, -57);
                    _this.backGroup.rotation.y = PI / 2;
                });
            tweenMid.chain(tweenOut);
            const objU = {x: -40};
            const tweenU = new TWEEN.Tween(objU)
                .to({x: -50}, 3000)
                .onUpdate(function() {
                    truck.position.x = this.x;
                    let progress =  Math.abs(truck.position.x + 50) / 10 * 100;
                    _this.$store.commit('setTitle', {
                        title: '摘挂',
                        type: 'connect',
                        progress,
                    });
                    _this.moveCamera();
                })
                .onComplete(function() {
                    _this.$store.commit('setTitle', {
                        title: '任务完成',
                    });
                })
                .delay(1000);
            tweenOut.chain(tweenU);
            return {
                begin: ct,
                end: tweenU,
            };
        },
        inStation() { // 回到起点
            const _this = this;
            const objIn = {rad: PI / 2};
            const tweenIn = new TWEEN.Tween(objIn)
                .to({rad: PI}, 2000)
                .onUpdate(function() {
                    _this.drift(15, this.rad, -50, -42);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    _this.$store.commit('setTitle', {});
                    objIn.rad = PI / 2;
                });
            const objOut = {z: -27}
            const tweenOut = new TWEEN.Tween(objOut)
                .to({z: 10}, 3000)
                .onStart(function() {
                    _this.backGroup.position.set(-85, 2.3, 0);
                    _this.backGroup.rotation.y = - PI / 2;
                })
                .onUpdate(function() {
                    truck.position.z = this.z;
                    _this.moveCamera();
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
                .to({rad: PI / 2}, 3000)
                .onStart(function() {
                    window.$$vue.round++;
                })
                .onUpdate(function() {
                    _this.drift(10, this.rad, -75, 10, true);
                    _this.moveCamera();
                })
                .onComplete(function() {
                    console.log(_this.camera.position);
                    obj.rad = 0;
                });
            let oc = {x: -75, y: 30, z: 10};
            const ct = new TWEEN.Tween(oc)
                .to({x: -80, y: 15, z: 10}, 1000)
                .onUpdate(function() {
                    _this.moveCamera(this.x, this.y, this.z);
                    _this.camera.lookAt(_this.v3(-80, 0, 0));
                });
            tween.chain(ct);
            return {
                begin: tween,
                end: ct,
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
    },
};