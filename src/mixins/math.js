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
        lglt2xyx(lng, lat, r) { // 经纬度转三维坐标
            lng = this.deg2rad(lng) + PI / 2;
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