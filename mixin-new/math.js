const { PI, sin, cos, tan, asin, acos, log, abs } = Math;

export default {
    methods: {
        // 基础运算
        deg2rad(degree) { // 角度转弧度
            degree = Number(degree);
            return degree * PI / 180;
        },
        rad2deg(radian) { // 弧度转角度
            radian = Number(radian);
            return radian * 180 / PI;
        },
        power(v, num = 2) { // 求次方
            return Math.pow(v, num);
        },
        vacuate(dataArr, distance = 0) { // 基于距离的数据抽稀
            let index = dataArr[0]; // 数组索引指针
            const arr = [index];
            dataArr.forEach((item) => {
                if (this.calcDistance(item, index) > distance && arr.indexOf(item) < 0) {
                    index = item;
                    arr.push(index);
                }
            });
            return arr;
        },
        lglt2xy(lng, lat, params = { Mercator: true }) { // 经纬度转二维坐标，Mercator表示是否采用墨卡托投影方式
            const { scale, Mercator } = params;
            lng = this.deg2rad(lng);
            lat = this.deg2rad(lat);
            let x = lng;
            let y = Mercator ? sin(lat) * log(tan(PI / 4 + abs(lat / 2))) : lat;
            x = this.rad2deg(x);
            y = this.rad2deg(y);
            if (scale) {
                x *= scale;
                y *= scale;
            }
            return { x, y };
        },
        lglt2xyz(lng, lat, r) { // 经纬度转三维坐标
            lng = this.deg2rad(lng);
            lat = this.deg2rad(lat);
            const x = r * cos(lat) * sin(lng);
            const y = r * sin(lat);
            const z = r * cos(lat) * cos(lng);
            return { x, y, z };
        },
        splitArray(arr, num) { // 将数组随便拆分为指定个数
            const max = arr.length;
            const len = Math.ceil(max / num);
            const result = [];
            arr.sort(() => {
                const diff = Math.random() - Math.random();
                return diff;
            });
            for (let i = 0; i < max; i += len) {
                result.push(arr.slice(i, i + len));
            }
            return result;
        },
        randomColor() {
            let str = '#';
            const numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            for (let i = 0; i < 6; i++) {
                const r = parseInt(Math.random() * 16);
                str += numArr[r];
            }
            return str;
        },
        world2screen(v, canvas) { // v 必须为 THREE.Vector 的实例
            if (v.constructor !== THREE.Vector3) {
                console.error('vector is not a example of THREE.Vector3');
                return;
            }
            const location = v.project(this.camera);
            const hw = canvas.offsetWidth / 2;
            const hh = canvas.offsetHeight / 2;
            const x = Math.round(location.x * hw + hw);
            const y = Math.round(-location.y * hh + hh);
            return { x, y };
        },
        // 向量相关运算
        calcVectorLength(v) { // 计算模长
            return Math.sqrt(this.power(v.x) + this.power(v.y) + this.power(v.z));
        },
        calcDistance(p1, p2) { // 计算两点间隔
            const v = this.calcVector(p1, p2);
            const { x, y, z } = v;
            const d = this.calcVectorLength({ x, y, z });
            return d;
        },
        calcVector(start, end, isUnit = false) { // 计算两点生成的向量
            const x = end.x - start.x;
            const y = end.y - start.y;
            const z = end.z - start.z;
            let v;
            if (isUnit) {
                v = this.vectorUnit({ x, y, z });
            } else {
                v = { x, y, z };
            }
            return v;
        },
        vectorUnit(v) { // 向量单位化
            const l = this.calcVectorLength(v);
            return {
                x: v.x / l,
                y: v.y / l,
                z: v.z / l,
            };
        },
        vectorAdd(v1, v2) { // 向量加法
            return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
        },
        vectorNumMultiply(v, num) { // 向量数乘
            return { x: v.x * num, y: v.y * num, z: v.z * num };
        },
        vectorMultiply(v1, v2) { // 向量点积
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        },
        vectorProduct(v1, v2, isUnit) { // 向量叉积
            let v =  {
                x: v1.y * v2.z - v1.z * v2.y,
                y: v1.z * v2.x - v1.x * v2.z,
                z: v1.x * v2.y - v1.y * v2.x,
            };
            if (isUnit) {
                v = this.vectorUnit(v)
            }
            return v;
        },
        calcVectorAngle(v1, v2) { // 计算两向量的夹角
            const v1L = this.calcVectorLength(v1);
            const v2L = this.calcVectorLength(v2);
            const vm = this.vectorMultiply(v1, v2);
            let rad = acos(vm / (v1L * v2L));
            // 计算夹角为顺or逆时针
            const cross = v1.x * v2.y - (v1.y * v2.x);
            if (cross < 0) rad = -rad;
            return rad;
        },
        calcOrthVector(v1, v2, angle, isUnit = false) { // 计算两向量的正交向量，等同于叉积
            const vp = this.vectorProduct(v1, v2);
            const v1L = this.calcVectorLength(v1);
            const v2L = this.calcVectorLength(v2);
            const den = v1L * v2L * sin(angle);
            let u = {
                x: vp.x / den,
                y: vp.y / den,
                z: vp.z / den,
            };
            if (isUnit) {
                u = this.vectorUnit(u);
            }
            return u;
        },
        // 矩阵相关运算
        calcDeterminant(A) { // 解行列式

        },
        matrixMultiply(M, N) { // 矩阵乘法，左乘规律 MxN
            const mr = M.length;
            const mc = M[0].length;
            const nr = N.length;
            const nc = N[0].length;
            if (mc !== nr) {
                console.error('Illegal Matrix Multiplication.');
                return;
            }
            const res = [];
            for (let i = 0; i < mr; i++) {
                const r = [];
                for (let j = 0; j < nc; j++) {
                    const ele = 0;
                    for (let k = 0; k < mc; k++) {
                        ele += M[i][k] * N[k][j];
                    }
                    r.push(ele);
                }
                res.push(r);
            }
            return res;
        },
    },
};