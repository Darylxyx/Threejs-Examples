// 动画队列
const { PI, sin, cos, abs } = Math;
let rad = 0; // 通用弧度变量（用于计算车辆过弯）
let car = null;
let stepIndex = 1; // 当前动画步骤
let count = 0;
export default {
    methods: {
        carAnimate(carGroup) {
            car = carGroup;
            this[`step${stepIndex}`] && this[`step${stepIndex}`]();
            const { x, y, z } = car.position;
            // this.camera.position.set(x, 30, z + 30);
            // this.camera.lookAt(car.position);
        },
        step1() {
            if (car.position.x <= - 55) {
                rad = PI / 2;
                stepIndex++;
            }
            car.position.x -= 0.2;
        },
        step2() {
            if (rad <= 0) {
                stepIndex++;
            }
            rad -= 0.02;
            this.drift(10, -55, -37, true);
        },
        step3() {
            car.position.z += 0.3;
            if (car.position.z >= 22) {
                rad = PI;
                stepIndex++;
            }
        },
        step4() {
            rad += 0.015;
            this.drift(25, -20, 22);
            if (rad >= (PI / 2 * 3)) {
                stepIndex++;
            }
        },
        step5() {
            car.position.x += 0.2;
            if (car.position.x >= 1.5) {
                rad = PI / 2;
                stepIndex++;
            }
        },
        step6() {
            if (rad >= PI) {
                if (count >= 180) {
                    rad = PI;
                    stepIndex++;
                }
                count++;
                return;
            }
            rad += 0.01;
            this.drift(7.5, 1.5, 54.5, true);
        },
        step7() {
            if (rad <= PI / 2) {
                stepIndex++;
            }
            rad -= 0.01;
            this.drift(7.5, 1.5, 54.5, true);
        },
        step8() {
            if (car.position.x >= 40) {
                rad = PI / 2 * 3;
                stepIndex++;
            }
            car.position.x += 0.3;
        },
        step9() {
            if (rad >= (PI / 2 * 5)) {
                stepIndex++;
            }
            rad += 0.008;
            this.drift(47, 40, 0);
        },
        step10() {
            if (car.position.x <= -45) {
                // stepIndex = 1;
                return;
            }
            car.position.x -= 0.3;
        },
        drift(r, offsetX, offsetZ, clockwise = false) {
            const x = r * cos(rad) + offsetX;
            const z = - (r * sin(rad)) + offsetZ;
            car.position.x = x;
            car.position.z = z;
            car.rotation.y = clockwise ? rad - PI : rad;
        },
    },
};