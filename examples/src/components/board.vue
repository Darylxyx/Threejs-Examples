<template>
    <div class='board'>
        <div class='title-bar'>
            <p v-if='titleType === "basic"' class='title-basic'>{{title}}</p>
            <div v-if='titleType === "connect"' class='title-connect'>
                <div class='title-connect-text'>
                    <span>挂车：{{currentTruck}}</span>
                    <span class='main'>接挂</span>
                    <span>车头：{{currentTrailer}}</span>
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
                    <p class='num'>2964辆</p>
                    <p class='desc'>智能挂车</p>
                    <p class='num'>89%</p>
                    <p class='desc'>平均体积装载率</p>
                    <p class='num'>3.2小时</p>
                    <p class='desc'>平均装货时长</p>
                </div>
                <div class='right-top-right'>
                    <p class='num'>146家</p>
                    <p class='desc'>智能挂客户</p>
                    <p class='num'>73%</p>
                    <p class='desc'>平均重量装载率</p>
                    <p class='num'>2.4小时</p>
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
                        <p class='desc'><span class='num'>2312辆</span></p>
                    </div>
                    <div class='middle-sec'>
                        <div class='icon'>冷</div>
                        <p class='desc'><span class='num'>119辆</span></p>
                    </div>
                    <div class='middle-sec'>
                        <div class='icon'>轿</div>
                        <p class='desc'><span class='num'>533辆</span></p>
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
            <div :class='{"card-active": actCardList.indexOf("stop") > -1 }' class='card card-blue card-stop'>
                <span class='card-title'>园区停靠</span>
                <p class='con'>停靠位置<span>B04</span></p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div :class='{"card-active": actCardList.indexOf("location") > -1 }' class='card card-blue card-stop'>
                <span class='card-title'>高精度定位</span>
                <p class='con'>高精度定位成功</p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div :class='{"card-active": actCardList.indexOf("platform") > -1 }' class='card card-blue card-stop'>
                <span class='card-title'>月台匹配</span>
                <p class='con'>月台匹配成功</p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div v-if='actCardList.indexOf("load") > -1' class='card-active card card-blue card-load'>
                <span class='card-title'>实时装货...</span>
                <p class='con'>
                    <animate-number from="0" to="15" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> t
                    <span><animate-number from="0" to="48" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> m³</span>
                </p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div v-if='actCardList.indexOf("loadtime") > -1' class='card-active card card-blue card-loadtime'>
                <span class='card-title'>装货时长</span>
                <p class='con'><animate-number from="1" to="11304" duration="11000" :formatter="formattime" style="margin-left:0"></animate-number></p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div v-if='actCardList.indexOf("unload") > -1' class='card-active card card-red card-unload'>
                <span class='card-title'>实时卸货...</span>
                <p class='con'>
                    <animate-number from="15" to="0" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> t
                    <span><animate-number from="48" to="0" duration="11000" :formatter="formatter" style="margin-left:0"></animate-number> m³</span>
                </p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div v-if='actCardList.indexOf("unloadtime") > -1' class='card-active card card-red card-unloadtime'>
                <span class='card-title'>卸货时长</span>
                <p class='con'><animate-number from="1" to="9796" duration="11000" :formatter="formattime" style="margin-left:0"></animate-number></p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
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
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div :class='{"card-active": actCardList.indexOf("weight") > -1 }' class='card card-blue card-weight'>
                <span class='card-title'>挂车载重</span>
                <div class='con'>
                    <img src='static/img/icon11.png' />
                    <hr class='split' />
                    <div>
                        <p>体积<span>48 m³</span></p>
                        <p>载重<span>15 t</span></p>
                    </div>
                </div>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div :class='{"card-active": actCardList.indexOf("wheel") > -1 }' class='card card-red card-wheel'>
                <span class='card-title'>胎温胎压</span>
                <div class='con'>
                    <img src='static/img/icon12.png' />
                    <hr class='split' />
                    <div>
                        <p>胎温<span>正常</span></p>
                        <p>胎压<span>过高</span></p>
                    </div>
                </div>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div :class='{"card-active": actCardList.indexOf("wheelalert") > -1 }' class='card card-red card-wheelalert'>
                <span class='card-title'>事件报警</span>
                <div class='con'>
                    <img src='static/img/icon12.png' />
                    <hr class='split' />
                    <div>
                        <p>12:15:32</p>
                        <p>胎压报警</p>
                    </div>
                </div>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div :class='{"card-active": actCardList.indexOf("rollalert") > -1 }' class='card card-red card-rollalert'>
                <span class='card-title'>事件报警</span>
                <div class='con'>
                    <img src='static/img/icon9.png' />
                    <hr class='split' />
                    <div>
                        <p>12:32:54</p>
                        <p>防侧翻保护</p>
                    </div>
                </div>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
        </div>
    </div>
</template>

<script>
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
        },
        methods: {
            formatWarn() {
                setInterval(() => {
                    this.leftWarns.forEach((item,index) => {
                        var s = Math.round(this.leftList[index].num/24/30);
                        item.num = item.num + s;
                    });
                },10000 + Math.random()*10000);
            },
            formatCount(value) {
                setInterval(() => {
                    this.bottomList.forEach((item) => {
                        var s = Math.random() > 0.4 ? 1 : -1;
                        item.num = parseInt(item.num + s*Math.random()*5);
                    });
                },10000);
            },
            makeLeftWarns() {
                var h = new Date().getHours() + 1;
                this.leftList.forEach((item) => {
                    var warn = item;
                    warn.num = Math.round(item.num / 24 * h);
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
        },
        data: () => ({
            leftWarns:[],
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
                    icon: 'static/img/icon3.png',
                    num: 776,
                    desc: '停靠月台',
                }, {
                    icon: 'static/img/icon5.png',
                    num: 21,
                    desc: '防侧翻保护',
                }, {
                    icon: 'static/img/icon6.png',
                    num: 1633,
                    desc: '胎压异常',
                }, {
                    icon: 'static/img/icon7.png',
                    num: 0,
                    desc: '胎温异常',
                }, {
                    icon: 'static/img/icon8.png',
                    num: 2,
                    desc: '轮胎漏气',
                }
            ],
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
            this.makeLeftWarns();
            this.formatCount();
            this.formatWarn();

            window.$$vue = this;
            // console.log(this.$store.state.);
        },
    };
</script>

<style lang='LESS' scoped>
    @C0: #C7CFEE;
    @C1: #747EA5;
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
            font-size: .3rem;
            color: @C3;
            span {
                margin-left: .73rem;
            }
        }
    }

    /*装载时长*/
    .card-loadtime {
        top: 45%;
        right: 20%;
        .con {
            font-size: .46rem;
            color: @C3;
        }
    }

    /*实时卸载*/
    .card-unload {
        top: 20%;
        right: 20%;
        .con {
            font-size: .3rem;
            color: @C4;
            span {
                margin-left: .73rem;
            }
        }
    }

    /*卸货时长*/
    .card-unloadtime {
        top: 45%;
        right: 20%;
        .con {
            font-size: .46rem;
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

    /*胎温胎压*/
    .card-wheel {
        top: 70%;
        right: 22%;
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
        top: 50%;
        left: 22%;
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

    /*防侧翻保护*/
    .card-rollalert {
        top: 70%;
        left: 22%;
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

    .card-active {
        opacity: .9 !important;
        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;

        -webkit-backface-visibility: visible !important;
        backface-visibility: visible !important;
        -webkit-animation-name: flipInX;
        animation-name: flipInX;
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
            font-size: .18rem;
            position: absolute;
            top: -.09rem;
            left: 0;
        }
        hr {
            position: absolute;
            border: none;
            opacity: 0.3;
        }
        &-t {
            width: 62%;
            height: 2px;
            top: 0;
            right: 0;
        }
        &-l {
            width: 2px;
            height: 80%;
            left: 0;
            bottom: 0;
        }
        &-r {
            width: 2px;
            height: 0.8rem;
            top: 0;
            right: 0;
        }
        &-b {
            width: 2.5rem;
            height: 2px;
            bottom: 0;
            left: 0;
        }
        &-br {
            width: 0.42426rem;
            height: 2px;
            transform: rotate(-45deg);
            right: -4px;
            bottom: 0.14rem;
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
        line-height: 1;
        padding: 0 .16rem 0 .24rem;
        background-image: linear-gradient(149deg, #31338F 0%, #161756 93%);
        .right-top {
            display: flex;
            padding: .39rem 0 .71rem 0;

            &-left {
                margin-right: .69rem;
            }

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
            padding: .28rem 0 .1rem;
            position: relative;
            display: flex;
            &-left {
                /*margin-right: .92rem;*/
                display: flex;
                width: 100%;
                flex-direction: row;
                justify-content: space-around;
            }
            .middle-sec {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: .28rem;
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
                font-size: .46rem;
                margin-bottom: .1rem;

                .unit {
                    color: @C1;
                    font-size: .22rem;
                    margin-left: .2rem;
                }
            }
            .desc {
                font-size: .22rem;
                color: @C2;
            }
        }
    }
</style>
<style>
@-webkit-keyframes flipInX {
  from {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  to {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
  }
}

@keyframes flipInX {
  from {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  to {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
  }
}
</style>
