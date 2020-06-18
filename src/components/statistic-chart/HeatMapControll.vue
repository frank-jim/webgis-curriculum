<template>
    <div class="buttons">
        <el-row>
            <el-button type="warning" round @click="openHeatMap">打开热力图</el-button>
        </el-row>
        <el-row>
            <el-button type="success" round @click="openRouteQuery">打开路径导航</el-button>
        </el-row>
        <el-row>
            <el-button type="primary" round @click="openProWeMap">显示分区统计图</el-button>
        </el-row>
        <el-row>
            <el-button type="danger" round @click="openVirusMap">打开疫情信息图</el-button>
        </el-row>
    </div>
</template>

<script>
    import {post} from "../../network/post";
    import {Loading} from "element-ui";

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
            },
            openRouteQuery(){
                this.$store.commit("OpenRouteQuery");
                this.$store.commit("CloseDataQuery");
                //FIXME 这里并非万全，主要是跨组件调用
                // TODO 完成修改，使用eventbus，服务总线的方式来见跨组件调用

            },
            openProWeMap(){
                this.$store.commit("CloseDataQuery");
                this.$store.commit("OpenProWeMap");
                //map view open
                this.$EventBus.$emit("openProWeMap");
            },
            openVirusMap(){
                //需要判断当前是否是第一次加载数据
                if(this.$store.state.LoadVirusMapFirst){
                    let loadinstance = Loading.service({
                        lock:true,
                        text:"正在加载地图，请稍后",
                        body:document
                    });

                    post({
                        url:"./DataQueryServlet",
                        params:{
                            QueryType:5
                        }
                    }).then((res)=>{
                        this.$store.commit("LoadVirusMapAlready")
                        loadinstance.close();
                        //请求数据得到
                        let geojson = JSON.parse(res.data.data.geojson);
                        //发送数据到mapView绑定地图导航要素
                        //直接传递坐标点数据
                        this.$EventBus.$emit("CreateVirusMap",geojson)
                        this.$store.commit("CloseDataQuery");
                        this.$store.commit("OpenVirusInfo");
                    })
                }else {
                    this.$EventBus.$emit("OpenVirusMap")
                    this.$store.commit("CloseDataQuery");
                    this.$store.commit("OpenVirusInfo");
                }
            }
        }
    }
</script>

<style scoped>
    .el-row{
        margin-top: 40px;


    }
    .buttons{
        text-align: center;
    }
</style>