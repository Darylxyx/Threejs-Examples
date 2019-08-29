<template>
    <div>
        <h1>目录索引</h1>
        <router-link v-for='router in routerList' :to='router.path'>
            <a>{{router.name}}</a>
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            routerList: [],
        };
    },
    mounted() {
        this.routerList = this.$router.options.routes;
    },
};
</script>

<style lang='less' scoped>
a {
    display: block;
    font-size: 18px;
    margin: 0 0 10px 10px;
    cursor: pointer;
    text-decoration: underline;
}
</style>