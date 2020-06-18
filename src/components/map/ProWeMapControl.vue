<template>
    <el-button v-if="this.$store.state.ProWeMapShow" class="close" type="danger" @click="close" >关闭分区统计图</el-button>
</template>

<script>
    export default {
        name: "ProWeMapControl",
        methods:{
            close(){
                this.$store.commit("CloseProWeMap");
                this.$EventBus.$emit("CloseProWeMap");
                this.$store.commit("OpenDataQuery");
            }
        }
    }
</script>

<style scoped>
    .close{
        position: absolute;
        width: 160px;
        left: 83%;
        top: 20%;
        z-index: 8;
        opacity: 90%;
        padding: 10px;
        border-radius: 30px;
    }
</style>