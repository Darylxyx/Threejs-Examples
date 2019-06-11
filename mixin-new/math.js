const { PI, sin, cos, asin, acos } = Math;

export default {
    methods: {
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
        calcDistance(p1, p2) { // 计算两点间隔
            const x = p2.x - p1.x;
            const y = p2.y - p1.y;
            const z = p2.z - p1.z;
            const d = this.calcVectorLength({ x, y, z });
            return d;
        },
        calcVectorLength(v) { // 计算模长
            return Math.sqrt(this.power(v.x) + this.power(v.y) + this.power(v.z));
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
        calcVector(start, end, isUnit = false) { // 计算向量，若isUnit为true，则计算单位向量
            const x = end.x - start.x;
            const y = end.y - start.y;
            const z = end.z - start.z;
            let v;
            if (isUnit) {
                const l = this.calcVectorLength({ x, y, z });
                v = {
                    x: x / l,
                    y: y / l,
                    z: z / l,
                };
            } else {
                v = { x, y, z };
            }
            return v;
        },
        calcDeterminant(A) { // 解行列式

        },
        calcVectorAngle(v1, v2) { // 计算两向量的夹角
            const v1L = this.calcVectorLength(v1);
            const v2L = this.calcVectorLength(v2);
            const vm = this.vectorMultiply(v1, v2);
            let rad = acos(vm / (v1L * v2L));
            if (rad > PI / 2) { // 该算法待定
                rad = rad - PI / 2;
            }
            return rad;
        },
        vectorMultiply(v1, v2) { // 向量乘法
            let res = 0;
            for (const o in v1) {
                res += v1[o] * v2[o];
            }
            return res;
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
    },
};