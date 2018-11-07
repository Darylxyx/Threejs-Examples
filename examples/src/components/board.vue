<template>
    <div class='board'>
        <div class='left-bar'>
            <div v-for='item in leftList' class='left-sec'>
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
                    <p class='num'>1248</p>
                    <p class='desc'>智能挂车</p>
                    <p class='num'>67%</p>
                    <p class='desc'>平均装载率</p>
                    <p class='num'>26分钟</p>
                    <p class='desc'>平均装货时长</p>
                </div>
                <div class='right-top-right'>
                    <p class='num'>108</p>
                    <p class='desc'>智能挂客户</p>
                    <p class='num'>12.36t</p>
                    <p class='desc'>平均载重</p>
                    <p class='num'>21分钟</p>
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
                        <p class='desc'>厢式挂 <span class='num'>23</span></p>
                    </div>
                    <div class='middle-sec'>
                        <div class='icon'>冷</div>
                        <p class='desc'>冷链挂 <span class='num'>23</span></p>
                    </div>
                </div>
                <div class='right-middle-right'>
                    <div class='middle-sec'>
                        <div class='icon'>轿</div>
                        <p class='desc'>轿运挂 <span class='num'>23</span></p>
                    </div>
                    <div class='middle-sec'>
                        <div class='icon'>罐</div>
                        <p class='desc'>罐式挂 <span class='num'>23</span></p>
                    </div>
                </div>
            </div>
            <div class='right-bottom'>
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
            </div>
        </div>
        <div class='bottom-bar'>
            <div class='bottom-sec' v-for='item in bottomList'>
                <p class='num'>{{item.num}}<span class='unit'>辆</span></p>
                <p class='desc'>{{item.desc}}</p>
            </div>
        </div>
        <div class='card-group'>
            <div class='card card-blue card-stop'>
                <span class='card-title'>园区停靠</span>
                <p class='con'>停靠位置<span>B04</span></p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div class='card card-blue card-load'>
                <span class='card-title'>实时装载...</span>
                <p class='con'>14 t<span>50 m³</span></p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div class='card card-blue card-loadtime'>
                <span class='card-title'>装载时长</span>
                <p class='con'>00:32:09</p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div class='card card-red card-unload'>
                <span class='card-title'>实时卸载...</span>
                <p class='con'>13 t<span>47 m³</span></p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div class='card card-red card-unloadtime'>
                <span class='card-title'>卸货时长</span>
                <p class='con'>00:24:32</p>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div class='card card-blue card-temp'>
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
            <div class='card card-blue card-weight'>
                <span class='card-title'>挂车载重</span>
                <div class='con'>
                    <img src='static/img/icon11.png' />
                    <hr class='split' />
                    <div>
                        <p>体积<span>50 m³</span></p>
                        <p>载重<span>14 t</span></p>
                    </div>
                </div>
                <hr class='card-t' />
                <hr class='card-l' />
                <hr class='card-r' />
                <hr class='card-b' />
                <hr class='card-br' />
            </div>
            <div class='card card-red card-wheel'>
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
            <div class='card card-red card-wheelalert'>
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
            <div class='card card-red card-rollalert'>
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
    data: () => ({
        leftList: [{
            icon: 'static/img/icon1.png',
            num: 32,
            desc: '头挂匹配',
        }, {
            icon: 'static/img/icon2.png',
            num: 24,
            desc: '头挂分离',
        }, {
            icon: 'static/img/icon3.png',
            num: 32,
            desc: '停靠月台',
        }, {
            icon: 'static/img/icon4.png',
            num: 14,
            desc: '进入场站',
        }, {
            icon: 'static/img/icon5.png',
            num: 5,
            desc: '防侧翻',
        }, {
            icon: 'static/img/icon6.png',
            num: 6,
            desc: '胎压过高',
        }, {
            icon: 'static/img/icon7.png',
            num: 0,
            desc: '轮胎漏气',
        }, {
            icon: 'static/img/icon8.png',
            num: 4,
            desc: '胎温过高', 
        }],
        bottomList: [{
            num: 32,
            desc: '装货中',
        }, {
            num: 24,
            desc: '卸货中',
        }, {
            num: 56,
            desc: '停靠月台',
        }, {
            num: 64,
            desc: '停靠场站',
        }],
    }),
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
    top: 10%;
    left: 14%;
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
    top: 25%;
    left: 14%;
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
    top: 40%;
    left: 14%;
    .con {
        font-size: .46rem;
        color: @C3;
    }
}

/*实时卸载*/
.card-unload {
    top: 55%;
    left: 14%;
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
    top: 70%;
    left: 14%;
    .con {
        font-size: .46rem;
        color: @C4;
    }
}

/*车厢温度*/
.card-temp {
    top: 10%;
    right: 20%;
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
    top: 25%;
    right: 20%;
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
    top: 40%;
    right: 20%;
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
    top: 55%;
    right: 20%;
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
    right: 20%;
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

.card {
    display: flex;
    align-items: center;
    padding: 0 .15rem;
    line-height: 1;
    position: absolute;
    width: 2.8rem;
    height: 1.1rem;
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
            padding: .28rem 0 .7rem;
            position: relative;
            display: flex;
            &-left {
                margin-right: .92rem;
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
}
</style>