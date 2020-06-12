<template>
    <div class="heatslider" v-if="this.$store.state.heatMapShow">
        <el-button type="warning" round @click="closeHeatMap"
                   style="margin-left: 13%;margin-bottom: 10%">
            关闭热力图
        </el-button>
        <el-row >
            <el-col :span="9" :offset="4">
                <el-row style="margin-bottom: 15px"> blur </el-row>
                <el-row>
                    <el-slider v-model="blur" vertical height="300px" :min="1" :max="50" @input="blurChange">

                    </el-slider>
                </el-row>
            </el-col>
            <el-col :span="9">
                <el-row style="margin-bottom: 15px">radius</el-row>
                <el-row>
                    <el-slider v-model="radius" vertical height="300px" :min="1" :max="50" @input="radiusChange">

                    </el-slider>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "heatslider",
        data(){
            return{
                radius:20,
                blur:10
            }
        },
        methods:{
            closeHeatMap(){
                //关闭热力图，同时关闭这个调节框
                this.$store.commit("CloseHeatMap");
                this.$store.commit("OpenDataQuery");

                this.$EventBus.$emit("removeHeatMap");
                // this.$parent.map.removeLayer(this.$parent.heatmaplayer);
            },
            radiusChange(value){
                this.$parent.heatmaplayer.setRadius(value);
            },
            blurChange(value){
                this.$parent.heatmaplayer.setBlur(value);
            }
        }
    }
</script>

<style scoped>
    .heatslider{
        position: absolute;
        width: 160px;
        left: 85%;
        top: 20%;
        z-index: 8;
        background-color: #a2a2a5;
        opacity: 90%;
        padding: 10px;
        border-radius: 30px;
    }
</style>