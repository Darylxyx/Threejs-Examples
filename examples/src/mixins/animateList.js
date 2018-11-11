// 动画队列
let truck = null;
const { PI, sin, cos } = Math;
let rad = PI / 2; // 通用弧度变量（用于计算车辆过弯）
let stepIndex = 0; // 当前动画步骤
let count = 0;
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
            // console.log(truck.position);
            this.animateList[stepIndex] && this.animateList[stepIndex]();
            // const { x, y, z } = car.position;
            // // this.camera.position.set(x, 30, z + 30);
            // // this.camera.lookAt(car.position);
        },
        outStation() { // 出站
            if (rad <= 0) {
                if (truck.position.z >= 42) {
                    rad = PI;
                    stepIndex++;
                }
                truck.position.z += 1;
            } else {
                rad -= 0.05;
                this.drift(10, -80, 10, true);
            }
        },
        inLoad() { // 进入装货园区
            if (rad >= PI / 2 * 3) {
                if (truck.position.x >= 11) {
                    rad = PI / 2;
                    stepIndex++;
                } else {
                    truck.position.x += 1;
                }
            } else {
                rad += 0.1;
                this.drift(15, -55, 42);
            }
        },
        reversInLoad() { // 倒车进入装货阶段
            if (rad >= PI) {
                if (truck.position.z >= 76) {
                    stepIndex++;
                } else {
                    truck.position.z += 1;
                }
            } else {
                rad += 0.05;
                this.drift(11, 11, 68, true);
            }
        },
        loading() { // 装货
            if (count >= 180) {
                count = 0;
                rad = PI;
                stepIndex++;
            }
            count++;
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
                truck.position.z -= 1;
            }
        },
        inCurve() { // 进入弯道
            if (rad >= PI / 2) {
                if (truck.position.x <= - 11) {
                    rad = - PI / 2;
                    stepIndex++;
                } else {
                    truck.position.x -= 1;
                }
            } else {
                rad += 0.02;
                this.drift(57, 80, 0);
            }
        },
        reversInUnload() { // 倒车进入卸货园区
            if (rad >= 0) {
                if (truck.position.z <= - 76) {
                    stepIndex++;
                } else {
                    truck.position.z -= 1;
                }
            } else {
                rad += 0.05;
                this.drift(11, -11, -68, true);
            }
        },
        unloading() {
            if (count >= 180) {
                count = 0;
                rad = 0;
                stepIndex++;
            }
            count++;
        },
        outUnload() { // 离开卸货园区
            if (truck.position.z >= - 68) {
                if (rad <= - PI / 2) {
                    if (truck.position.x <= -55) {
                        rad = PI / 2;
                        stepIndex++;
                    } else {
                        truck.position.x -= 1;
                    }
                } else {
                    rad -= 0.05;
                    this.drift(11, -11, -68, true);
                }
            } else {
                truck.position.z += 1;
            }
        },
        inStation() { // 回到始发点
            if (rad >= PI) {
                if (truck.position.z >= 10) {
                    rad = 0;
                    stepIndex++;
                } else {
                    truck.position.z += 1;
                }
            } else {
                rad += 0.02;
                this.drift(15, -55, -42);
            }
        },
        resetStart() { // 复位
            if (rad >= PI / 2) {
                stepIndex = 0;
            } else {
                rad += 0.02;
                this.drift(10, -80, 10, true);
            }
        },
        drift(r, offsetX, offsetZ, clockwise = false) {
            const x = r * cos(rad) + offsetX;
            const z = - (r * sin(rad)) + offsetZ;
            truck.position.x = x;
            truck.position.z = z;
            truck.rotation.y = clockwise ? rad - PI : rad;
        },
    },
};