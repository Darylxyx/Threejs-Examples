<template>
    <h1>光源</h1>
</template>
<script>
import mixin from '../../mixins/index';

export default {
    mixins: [mixin],
    mounted() {
        console.log(this.initLight('point'));
    },
};
</script>