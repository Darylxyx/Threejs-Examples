const { PI, sin, cos, tan, cot, sqrt } = Math;

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
        lglt2xyx(lng, lat, r) { //  经纬度转三维坐标
            lng = this.deg2rad(lng) + PI / 2;
            lat = this.deg2rad(lat);
            const x = r * cos(lat) * sin(lng);
            const y = r * sin(lat);
            const z = r * cos(lat) * cos(lng);
            return {x, y, z};
        },
    }
};