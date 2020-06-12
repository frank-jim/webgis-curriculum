<template>
    <div>
        <el-button type="warning" round @click="openHeatMap">打开热力图</el-button>
        <el-row >
            <el-col :span="10" :offset="2">
                <el-row>blur</el-row>
                <el-row>
                    <el-slider vertical height="300px">

                    </el-slider>
                </el-row>
            </el-col>
            <el-col :span="10">
                <el-row>radius</el-row>
                <el-row>
                    <el-slider vertical height="300px">

                    </el-slider>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "HeatMapControll",
        methods:{
            openHeatMap(){
                this.$store.commit("OpenHeatMap");
                this.$store.commit("CloseDataQuery");
                //FIXME 这里并非万全，主要是跨组件调用
                // TODO 完成修改，使用eventbus，服务总线的方式来见跨组件调用

                this.$EventBus.$emit("addHeatMap");
                // console.log(this.$parent);
                // this.$parent.$parent.$parent.$parent.$parent.$refs['mapview'].map.addLayer(this.$parent.$parent.$parent.$parent.$parent.$refs['mapview'].heatmaplayer);
            }
        }
    }
</script>

<style scoped>
    .el-row{
        margin-top: 30px;
    }
</style>