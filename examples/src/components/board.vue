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