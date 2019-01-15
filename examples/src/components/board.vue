<template>
    <div class='board'>
        <div class='title-bar'>
            <p v-if='titleType === "basic"' class='title-basic'>{{title}}</p>
            <div v-if='titleType === "connect"' class='title-connect'>
                <div class='title-connect-text'>
                    <span>挂车：{{currentTrailer}}</span>
                    <span class='main'>{{title}}</span>
                    <span>车头：{{currentTruck}}</span>
                </div>
                <div class='progress'>
                    <div :style='{width: `${connectProgress/2 + 1}%`}' class='left'></div>
                    <div :style='{width: `${connectProgress/2 +1 }%`}' class='right'></div>
                </div>
            </div>
      <!--       <div v-if='titleType === "trailer"' class='title-trailer'>
                <span>沪GD889挂</span>
                <img src='static/img/gua.png' />
                <span>沪AD9832</span>
            </div> -->
        </div>
        <div class='left-bar'>
            <div v-for='item in leftWarns' class='left-sec'>
                <img class='icon' :src='item.icon' />
                <div>
                    <p class='num'>{{item.num}}</p>
                    <p class='desc'>{{item.desc}}</p>
                </div>
            </div>
        </div>
        <div class='right-bar'>
            <div class='right-top'>
                <div class='right-top-left'>
                    <p class='num'>{{rightList.trailerCount}}辆</p>
                    <p class='desc'>智能挂车</p>
                    <p class='num'>{{rightList.clients}}家</p>
                    <p class='desc'>智能挂客户</p>
                    <p class='num'>{{rightList.volumeRate}}%</p>
                    <p class='desc'>平均体积装载率</p>
                    <p class='num'>{{rightList.weightRate}}%</p>
                    <p class='desc'>平均重量装载率</p>
                    <p class='num'>{{rightList.loadTime}}小时</p>
                    <p class='desc'>平均装货时长</p>
                    <p class='num'>{{rightList.unloadTime}}小时</p>
                    <p class='desc'>平均卸货时长</p>
                </div>
            </div>
            <div class='right-middle'>
                <div class='sub-title'>
                    <span>车辆类型</span>
                    <hr />
                </div>
                <div class='right-middle-left'>
                    <div class='middle-sec'>
                        <div class='icon'>厢</div>
                        <p class='desc'><span class='num'>{{rightList.boxTrailer}}辆</span></p>
                    </div>
                    <div class='middle-sec'>
                        <div class='icon'>冷</div>
                        <p class='desc'><span class='num'>{{rightList.coldTrailer}}辆</span></p>
                    </div>
                    <div class='middle-sec'>
                        <div class='icon'>轿</div>
                        <p class='desc'><span class='num'>{{rightList.carTrailer}}辆</span></p>
                    </div>
                </div>
                <!--<div class='right-middle-right'>-->
                    <!--<div class='middle-sec'>-->
                        <!--<div class='icon'>罐</div>-->
                        <!--<p class='desc'>罐式挂 <span class='num'>0</span></p>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
            <!--             <div class='right-bottom'>
                            <div class='sub-title'>
                                <span>GPS状态</span>
                                <hr />
                            </div>
                            <div class='bottom-sec'>
                                <img src='static/img/run.png' />
                                <p class='desc'>行驶 <span class='num'>23</span></p>
                            </div>
                            <div class='bottom-sec'>
                                <img src='static/img/stop.png' />
                                <p class='desc'>静止 <span class='num'>16</span></p>
                            </div>
                            <div class='bottom-sec'>
                                <img src='static/img/offline.png' />
                                <p class='desc'>离线 <span class='num'>6</span></p>
                            </div>
                        </div> -->
        </div>
        <div class='bottom-bar'>
            <div class='bottom-sec' v-for='item in bottomList'>
                <p class='num'>{{item.num}}<span class='unit'>辆</span></p>
                <p class='desc'>{{item.desc}}</p>
            </div>
        </div>
        <div class='card-group'>
            <div  v-if='actCardList.indexOf("stop") > -1' class='card-active card card-blue card-stop animated flipInX'>
                <span class='card-title'>月台匹配</span>
                <p class='con'>停靠月台<span>B04</span></p>
                <cardborder border-color='blue'></cardborder>
            </div>
            <div  v-if='actCardList.indexOf("unloadstop") > -1' class='card-active card card-blue card-stop animated flipInX'>
                <span class='card-title'>月台匹配</span>
                <p class='con'>停靠月台<span>E04</span></p>
                <cardborder border-color='blue'></cardborder>
            </div>
            <div :class='{"card-active": actCardList.indexOf("location") > -1 }' class='card card-blue card-stop'>
                <span class='card-title'>高精度定位</span>
                <p class='con'>高精度定位成功</p>
                <cardborder border-color='blue'></cardborder>
            </div>
            <div style='left: 20%;'  v-if='actCardList.indexOf("unlock") > -1' class='card-active card card-blue card-stop animated zoomInUp'>
                <span class='card-title'>远程解锁</span>
                <p class='con'>车挂匹配，智能挂远程自动解锁</p>
                <cardborder border-color='blue'></cardborder>
            </div>
            <div style='top: 35%;right: 20%;' v-if='actCardList.indexOf("lock") > -1' class='card-active card card-red card-stop animated zoomInUp'>
                <span class='card-title'>远程锁挂</span>
                <p class='con'>车挂分离，智能挂远程自动锁定</p>
                <cardborder border-color='red'></cardborder>
            </div>
            <div :class='{"card-active": actCardList.indexOf("platform") > -1 }' class='card card-blue card-stop'>
                <span class='card-title'>月台匹配</span>
                <p class='con'>月台匹配成功</p>
                <cardborder border-color='blue'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("load") > -1' class='card-active card card-red card-load animated fadeInDown'>
                <span class='card-title'>实时装货...</span>
                <p class='con'>
                    <animate-number from="0" :to="numList[roundIndex].weight" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> t
                    <span><animate-number from="0" :to="numList[roundIndex].volume" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> m³</span>
                </p>
                <cardborder border-color='red'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("loadtime") > -1' class='card-active card card-red card-loadtime animated fadeInDown'>
                <span class='card-title'>装货时长</span>
                <p class='con'><animate-number from="1" :to="numList[roundIndex].time" duration="11000" :formatter="formattime" style="margin-left:0"></animate-number></p>
                <cardborder border-color='red'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("unload") > -1' class='card-active card card-red card-unload'>
                <span class='card-title'>实时卸货...</span>
                <p class='con'>
                    <animate-number :from="numList[roundIndex].weight" to="0" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> t
                    <span><animate-number :from="numList[roundIndex].volume" to="0" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> m³</span>
                </p>
                <cardborder border-color='red'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("unloadtime") > -1' class='card-active card card-red card-unloadtime'>
                <span class='card-title'>卸货时长</span>
                <p class='con'><animate-number from="1" :to="numList[roundIndex].time" duration="11000" :formatter="formattime" style="margin-left:0"></animate-number></p>
                <cardborder border-color='red'></cardborder>
            </div>
            <div :class='{"card-active": actCardList.indexOf("temp") > -1 }' class='card card-blue card-temp'>
                <span class='card-title'>车厢温度</span>
                <div class='con'>
                    <img src='static/img/icon10.png' />
                    <hr class='split' />
                    <div>
                        <p>压缩机<span>打开</span></p>
                        <p>温度<span>正常</span></p>
                    </div>
                </div>
                <cardborder border-color='blue'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("weight") > -1' class='card-active card card-blue card-weight animated zoomInLeft'>
                <span class='card-title'>挂车装载</span>
                <div class='con'>
                    <img src='static/img/icon11.png' />
                    <hr class='split' />
                    <div>
                        <p>体积<span>48 m³</span></p>
                        <p>载重<span>15 t</span></p>
                    </div>
                </div>
                <cardborder border-color='blue'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("wheel") > -1' class='card-active card card-red card-wheel  animated zoomInLeft'>
                <span class='card-title'>胎温胎压</span>
                <div class='con'>
                    <img src='static/img/icon12.png' />
                    <hr class='split' />
                    <div>
                        <p>胎温<span>正常</span></p>
                        <p>胎压<span>过高</span></p>
                    </div>
                </div>
                <cardborder border-color='red'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("wheelalert") > -1' class='card-active card card-red card-wheelalert  animated zoomInLeft'>
                <span class='card-title'>事件报警</span>
                <div class='con'>
                    <img src='static/img/icon12.png' />
                    <hr class='split' />
                    <div>
                        <p>12:15:32</p>
                        <p>胎压报警</p>
                    </div>
                </div>
                <cardborder  border-color='red'></cardborder>
            </div>
            <div  v-if='actCardList.indexOf("wheelalert") > -1' class='card-active card card-red card-wheelvoice  animated zoomInLeft'>
                <span class='card-title card-voice'>语音播报</span>
                <div class='con'>
                    <div>
                        <p>挂车二轴右胎胎压过高，请及时处理</p>
                    </div>
                </div>
                <cardborder border-color='red'></cardborder>
            </div>
            <div v-if='actCardList.indexOf("rollalert") > -1' class='card-active card card-red card-rollalert  animated zoomInLeft'>
                <span class='card-title'>事件报警</span>
                <div class='con'>
                    <img src='static/img/icon9.png' />
                    <hr class='split' />
                    <div>
                        <p>15:49:04</p>
                        <p>防侧翻保护</p>
                    </div>
                </div>
                <cardborder border-color='red'></cardborder>
            </div>
            <div v-for='(item,index) in picList[roundIndex]' :class='{"card-active": picIndex === (index+1)}' class="card card-img img-1">
                <img :src="item">
            </div>
            <div :class='{"card-active": actCardList.indexOf("guide") > -1}' class='card-gif'>
                <img id='guideGif' src='static/img/guide.gif' />
            </div>
        </div>
    </div>
</template>

<script>
import cardborder from './cardborder.vue';
export default {
    computed: {
        title() {
            return this.$store.state.title;
        },
        actCardList() {
            return this.$store.state.actCardList;
        },
        titleType() {
            return this.$store.state.titleType;
        },
        connectProgress() {
            return this.$store.state.connectProgress;
        },
        currentTruck() {
            return this.truckNums[0];
        },
        currentTrailer() {
            return this.trailerNums[this.round % 10];
        },
        picIndex() {
            return this.$store.state.picIndex;
        },
        roundIndex() {
            return this.$store.state.roundIndex;
        },
    },
    methods: {
        formatWarn() {
            setInterval(() => {
                this.timerCount++;
                this.leftWarns.forEach((item,index) => {
                    // var s = Math.round(this.leftList[index].num/24/30);
                    // 按步长增加1
                    var x = this.timerCount % item.step;
                    if(x == 0){
                        item.num++;
                    }
                    // item.num = item.num + s;
                });
            },6000);
        },
        formatCount() {
            setInterval(() => {
                this.bottomList.forEach((item) => {
                    //加还是减？
                    var s = Math.random() > 0.4 ? 1 : -1;
                    item.num = parseInt(item.num + s*Math.random()*5);
                });
                this.bottomList[2].num = this.rightList.trailerCount - this.bottomList[0].num - this.bottomList[1].num;
            },10000);
        },
        formatRight() {
            setInterval(() => {
                var x = Math.random() > 0.5 ? 1 :-1;
                for(let item in this.rightList){
                    if(item == "volumeRate" || item == "weightRate"){
                        this.rightList[item] = this.rightList[item] + x * Math.round(Math.random()*4);
                        this.rightList[item] = this.rightList[item] > 75 ? 75 : (this.rightList[item] < 40 ? 40 : this.rightList[item]);
                    }else if(item == "loadTime" || item == "unloadTime"){
                        // this.rightList[item] = (this.rightList[item] + parseInt(x * Math.random() * 10));
                    }
                }
            },10000);
        },
        makeLeftWarns() {
            var h = new Date().getHours() + 1;
            this.leftList.forEach((item) => {
                var warn = item;
                warn.num = Math.round(item.num / 24 * h);
                warn.step = Math.round(3600 / item.num);
                this.leftWarns.push(warn);
            });
        },
        formatter(num) {
            return num.toFixed(1);
        },
        formattime(num) {
            const h = Math.floor(num / 60 / 60).toFixed(0).padStart(2,'0');
            const m = Math.max((num - h*3600) / 60,0).toFixed(0).padStart(2,'0');
            const s = (num % 60).toFixed(0).padStart(2,'0');
            return h + ":" + m + ":" + s;
        },
        initPicList() {
            for (let i = 0; i < 5; i++) {
                const loadArr = [];
                const unloadArr = [];
                for (let j = 0; j < 3; j ++) {
                    loadArr.push(`static/img/load-${i+1}-${j+1}.png`);
                    unloadArr.push(`static/img/unload-${i+1}-${j+1}.png`);
                }
                this.picList.push(loadArr.concat(unloadArr));
            }
        },
    },
    data: () => ({
        timerCount:0,
        leftWarns:[],
        picList: [],
        numList: [
            {
                volume: 48,
                weight: 15,
                time: 11304,
            }, {
                volume: 53,
                weight: 17,
                time: 12304,
            }, {
                volume: 60,
                weight: 20,
                time: 15000,
            }, {
                volume: 45,
                weight: 14,
                time: 11000,
            }, {
                volume: 50,
                weight: 16,
                time: 12000,
            }
        ],
        leftList: [
            {
                icon: 'static/img/icon1.png',
                num: 309,
                desc: '头挂匹配',
            }, {
                icon: 'static/img/icon2.png',
                num: 206,
                desc: '头挂分离',
            }, {
                icon: 'static/img/icon4.png',
                num: 784,
                desc: '进入场站',
            },{
                icon: 'static/img/icon13.png',
                num: 813,
                desc: '离开场站',
            },{
                icon: 'static/img/icon3.png',
                num: 776,
                desc: '停靠月台',
            }, {
                icon: 'static/img/icon5.png',
                num: 21,
                desc: '防侧翻保护',
            }, {
                icon: 'static/img/icon6.png',
                num: 163,
                desc: '胎压异常',
            }, {
                icon: 'static/img/icon8.png',
                num: 0,
                desc: '胎温异常',
            }, {
                icon: 'static/img/icon7.png',
                num: 2,
                desc: '轮胎漏气',
            }
        ],
        rightList:{
            trailerCount:2964,
            clients:146,
            volumeRate:72,
            weightRate:66,
            loadTime:3.2,
            unloadTime:2.4,
            boxTrailer:2312,
            coldTrailer:119,
            carTrailer:533,
        },
        bottomList: [
            {
                num: 1850,
                desc: '运行中',
            }, {
                num: 761,
                desc: '静止中',
            }, {
                num: 353,
                desc: '离线中',
            }, {
                num: 211,
                desc: '装货中',
            },{
                num: 134,
                desc: '卸货中',
            }
        ],
        truckNums:['沪AD9832'],
        trailerNums:['沪GD889挂','沪F7T73挂','沪D9C73挂','沪D9C79挂','沪D9C81挂','沪D9C02挂','沪D9C46挂','沪D9C02挂','沪D9C66挂','沪D9C58挂'],
        round:0,
    }),
    mounted() {
        this.initPicList();
        this.makeLeftWarns();
        this.formatCount();
        this.formatWarn();
        this.formatRight();
        window.$$vue = this;
        // console.log(this.$store.state.);
    },
    components: {
        cardborder,
    },
};
</script>

<style lang='LESS' scoped>
    @C0: #C7CFEE;
    /*@C1: #747EA5;*/
    @C1: #FFFFFF;
    @C2: #5865B5;
    @C3: #22BBF2;
    @C4: #ED18CC;

    .card-group {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    /*园区停靠*/
    .card-stop {
        top: 15%;
        right: 30%;
        .con {
            line-height: 1.3;
            font-size: .3rem;
            color: @C1;
            span {
                margin-left: .23rem;
                color: @C3;
            }
        }
    }

    /*实时装载*/
    .card-load {
        top: 30%;
        right: 20%;
        .con {
            font-size: .35rem;
            font-weight:bold;
            color: @C4;
            span {
                margin-left: .2rem;
            }
        }
    }

    /*装载时长*/
    .card-loadtime {
        top: 45%;
        right: 20%;
        .con {
            font-weight:bold;
            font-size: .35rem;
            color: @C4;
        }
    }

    /*实时卸载*/
    .card-unload {
        top: 30%;
        right: 20%;
        .con {
            font-size: .35rem;
            font-weight:bold;
            color: @C4;
            span {
                margin-left: .2rem;
            }
        }
    }

    /*卸货时长*/
    .card-unloadtime {
        top: 45%;
        right: 20%;
        .con {
            font-size: .35rem;
            font-weight:bold;
            color: @C4;
        }
    }

    /*车厢温度*/
    .card-temp {
        top: 30%;
        right: 22%;
        .con {
            img {
                width: .7rem;
                left: .14rem;
                top: .2rem;
            }
            p {
                font-size: .22rem;
                color: @C1;
                margin-bottom: .15rem;
                &:last-child {
                    margin-bottom: 0;
                }
                span {
                    color: @C3;
                    margin-left: .2rem;
                }
            }
        }
    }

    /*挂车载重*/
    .card-weight {
        top: 50%;
        right: 22%;
        .con {
            img {
                width: .8rem;
                left: .1rem;
                top: .2rem;
            }
            p {
                font-size: .22rem;
                color: @C1;
                margin-bottom: .15rem;
                &:last-child {
                    margin-bottom: 0;
                }
                span {
                    color: @C3;
                    margin-left: .2rem;
                }
            }
        }
    }

    .card-gif {
        opacity: 0;
        position: absolute;
        top: 10%;
        right: 10%;
        width: 3rem;
        padding: .08rem;
        background: rgba(35, 43, 70, 0.5);

        img {
            width: 100%;
        }
    }

    /*胎温胎压*/
    .card-wheel {
        top: 60%;
        right: 30%;
        .con {
            img {
                width: .65rem;
                left: .17rem;
                top: .25rem;
            }
            p {
                font-size: .22rem;
                color: @C1;
                margin-bottom: .15rem;
                &:last-child {
                    margin-bottom: 0;
                    span {
                        color: @C4;
                    }
                }
                span {
                    color: @C3;
                    margin-left: .2rem;
                }
            }
        }
    }

    /*胎压报警*/
    .card-wheelalert {
        top: 60%;
        right: 30%;
        img {
            width: .65rem;
            left: .17rem;
            top: .25rem;
        }
        .con {
            p {
                color: @C1;
                font-size: .22rem;
                margin-bottom: .15rem;
                &:last-child {
                    color: @C4;
                    margin-bottom: 0;
                }
            }
        }
    }

    .card-wheelvoice {
        top: 10%;
        right: 15%;
        .con {
            line-height: 1.5;
            p {
                color: @C1;
                font-size: .22rem;
                margin-bottom: .15rem;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    /*防侧翻保护*/
    .card-rollalert {
        top: 50%;
        right: 30%;
        img {
            width: .65rem;
            left: .17rem;
            top: .25rem;
        }
        .con {
            p {
                color: @C1;
                font-size: .22rem;
                margin-bottom: .15rem;
                &:last-child {
                    color: @C4;
                    margin-bottom: 0;
                }
            }
        }
    }

    .card-img{
        position: absolute;
        top: 60%;
        right: 20%;
        width: 2.8rem !important;
        height: 2.11rem !important;
        padding: 0 !important;
        background: url('../../static/img/photobg.png');
        background-size: cover;
        img{
            display: block;
            position: absolute;
            width:2.2rem;
            height: 1.66rem;
            padding: 0 !important;
            margin: 0.08rem 0 0 0.3rem;
        }
    }

    .card-active {
        opacity: .9 !important;
    }

    .card {
        display: flex;
        align-items: center;
        padding: 0 .15rem;
        line-height: 1;
        position: absolute;
        width: 2.8rem;
        height: 1.1rem;
        transition: opacity 0.5s linear;
        opacity: 0;
        &-title {
            line-height: 1;
            font-size: .2rem;
            position: absolute;
            top: -.09rem;
            left: 0;
        }
        &-voice {
            display: inline-block;
            background-size: 24px;
            background-position: left;
            overflow: visible;
            padding: 20px 0 20px 28px;
            margin: -20px 0 0 0;
            background-image: url('../../static/img/volume.png');
            background-repeat: no-repeat;
        }
        .con {
            display: flex;
            img {
                position: absolute;
            }
            .split {
                width: 2px;
                height: .6rem;
                margin: 0 .3rem 0 .8rem;
                position: relative;
            }
        }
    }

    .card-blue {
        color: @C3;
        hr {
            background: @C3;
        }
    }

    .card-red {
        color: @C4;
        hr {
            background: @C4;
        }
    }

    .board {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1;

        .title-basic {
            font-size: .48rem;
            color: #ffffff;
        }

        .title-connect {
            width: 10rem;
            height: 1.89rem;
            background: rgba(17,22,35,0.7);
            border: 2px solid rgba(30,222,255,0.2);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            line-height: 1;
            padding: .51rem .85rem .35rem;

            &-text {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                span {
                    font-size: .32rem;
                    color: #747EA5;
                }
                .main {
                    font-size: .48rem;
                    color: #22bbf2;
                }
            }

            .progress {
                width: 90%;
                height: 8px;
                background: #000;
                position: relative;

                .left, .right {
                    position: absolute;
                    height: 100%;
                    background: #22BBF2;
                }
                .left{
                    left: 0;
                }
                .right{
                    right:0;
                }
            }
        }

        .title-trailer {
            width: 8rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 1;

            span {
                font-size: .48rem;
                color: #3A456F;
            }

            img {
                width: 2.22rem;
            }
        }
    }

    .title-bar {
        position: absolute;
        width: 100%;
        top: .78rem;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;

        p {
            font-size: .48rem;
            color: #3A456F;
        }
    }

    .left-bar {
        display: flex;
        flex-direction: column;

        .left-sec {
            display: flex;
            line-height: 1;
            margin: 0 0 .3rem .37rem;
            &:last-child {
                margin-bottom: 0;
            }

            .icon {
                width: .64rem;
                height: .64rem;
                margin-right: .2rem;
            }
            .num {
                font-size: .38rem;
                color: @C0;
                margin-bottom: .06rem;
            }
            .desc {
                font-size: .18rem;
                color: @C2;
            }
        }
    }

    .right-bar {
        opacity: .9;
        line-height: 1;
        padding:.24rem;
        background-image: linear-gradient(149deg, rgba(49,51,143,.8) 0%, rgba(22,23,86,.8) 93%);
        .right-top {
            display: flex;
            padding: 0 0 .5rem 0;

            .num {
                font-size: .26rem;
                color: @C0;
                margin-bottom: .1rem;
            }

            .desc {
                font-size: .18rem;
                color: @C2;
                margin-bottom: .24rem;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        .right-middle {
            padding: .3rem 0 0 0;
            position: relative;
            display: flex;
            &-left {
                /*margin-right: .92rem;*/
                /* display: flex; */
                width: 100%;
                flex-direction: row;
                justify-content: space-around;
            }
            .middle-sec {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: .2rem;
                &:last-child {
                    margin-bottom: 0;
                }
                .icon {
                    line-height: 1;
                    width: .46rem;
                    height: .46rem;
                    border-radius: .23rem;
                    font-size: .18rem;
                    color: @C0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #5865B5;
                    margin-bottom: .1rem;
                }
                .desc {
                    font-size: .18rem;
                    color: @C2;
                    .num {
                        color: @C0;
                    }
                }
            }
        }
        .right-bottom {
            padding: .29rem .15rem .52rem 0;
            position: relative;
            display: flex;
            justify-content: space-between;
            .bottom-sec {
                display: flex;
                flex-direction: column;
                align-items: center;
                img {
                    width: .46rem;
                    height: .46rem;
                    margin-bottom: .1rem;
                }
                .desc {
                    font-size: .18rem;
                    color: @C2;
                    .num {
                        color: @C0;
                    }
                }
            }
        }
        .sub-title {
            width: 100%;
            display: flex;
            align-items: center;
            position: absolute;
            top: -0.09rem;
            span {
                font-size: .18rem;
                color: @C2;
                padding-right: .126rem;
            }
            hr {
                display: flex;
                flex-grow: 1;
                border: none;
                height: 1px;
                background: @C2;
                opacity: .66;
            }
        }
    }

    .bottom-bar {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: .28rem;

        .bottom-sec {
            line-height: 1;
            margin-right: 1.3rem;
            &:last-child {
                margin: 0;
            }
            .num {
                color: @C0;
                font-size: .38rem;
                margin-bottom: .1rem;

                .unit {
                    color: @C1;
                    font-size: .22rem;
                    margin-left: .15rem;
                }
            }
            .desc {
                font-size: .18rem;
                color: @C2;
            }
        }
    }
</style>
