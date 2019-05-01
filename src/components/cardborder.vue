<template>
    <div class='border-group' :class='borderColor'>
        <div class='backcover backcover-l'></div>
        <div class='backcover backcover-rt'></div>
        <div class='backcover backcover-rb'></div>
        <hr class='card-t' />
        <hr class='card-l' />
        <hr class='card-r' />
        <hr class='card-b' />
        <hr class='card-br' />
    </div>
</template>
<script>
export default {
    props: ['borderColor'],
};
</script>
<style lang='less' scoped>
.blue {
    hr {
        background-color: #22BBF2;
    }
}
.red {
    hr {
        background-color: #ED18CC;
    }
}
.border-group {
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    hr {
        position: absolute;
        z-index: 1;
        border: none;
        opacity: 0.3;
    }
    .card-t {
        width: 62%;
        height: 2px;
        top: 0;
        right: 0;
    }
    .card-l {
        width: 2px;
        height: 80%;
        left: 0;
        bottom: 0;
    }
    .card-r {
        width: 2px;
        height: 0.8rem;
        top: 0;
        right: 0;
    }
    .card-b {
        width: 2.5rem;
        height: 2px;
        bottom: 0;
        left: 0;
    }
    .card-br {
        width: 0.42426rem;
        height: 2px;
        transform: rotate(-45deg);
        right: -4px;
        bottom: 0.14rem;
    }
    .backcover {
        position: absolute;
        z-index: -1;
        background: rgba(0,0,0,0.7);
    }
    .backcover-l {
        width: 2.5rem;
        height: 100%;
        left: 0;
        top: 0;
    }
    .backcover-rt {
        width: 0.3rem;
        height: 0.8rem;
        right: 0;
        top: 0;
    }
    .backcover-rb {
        width: 0;
        height: 0;
        background: none;
        border: 0.212rem solid transparent;
        border-right-color: rgba(0,0,0,0.7);
        transform: rotate(45deg);
        right: 0.09125rem;
        bottom: 0.09rem;
    }
}
</style>