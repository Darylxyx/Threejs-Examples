const { PI, sin, cos } = Math;

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
        distance(p1, p2) { // 计算两点间距离
            const dx = Math.pow(p2.x - p1.x, 2);
            const dy = Math.pow(p2.y - p1.y, 2);
            const dz = Math.pow(p2.z - p2.z, 2);
            const d = Math.sqrt(dx + dy + dz);
            return d;
        },
        vacuate(dataArr, distance = 0) { // 基于距离的数据抽稀
            let index = dataArr[0]; // 数组索引指针
            const arr = [index];
            dataArr.forEach((item) => {
                if (this.distance(item, index) > distance && arr.indexOf(item) < 0) {
                    index = item;
                    arr.push(index);
                }
            });
            return arr;
        },
        SOD(data) { // secondOrderDeterminant, 解二阶行列式
            const a11 = data[0][0];
            const a12 = data[0][1];
            const a21 = data[1][0];
            const a22 = data[1][1];
            return a11 * a22 - a21 * a12;
        },
        TOD(data) { // thirdOrderDeterminant, 解三阶行列式
            const a11 = data[0][0];
            const a12 = data[0][1];
            const a13 = data[0][2];
            const a21 = data[1][0];
            const a22 = data[1][1];
            const a23 = data[1][2];
            const a31 = data[2][0];
            const a32 = data[2][1];
            const a33 = data[2][2];
            const res = (a11 * a22 * a33) + (a13 * a21 * a22) + (a12 * a23 * a31) - (a13 * a22 * a31) - (a12 * a21 * a33) - (a11 * a23 * a32);
            return res;
        },
        lglt2xyx(lng, lat, r) { // 经纬度转三维坐标
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