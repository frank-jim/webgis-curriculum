<template>
    <div class="route" v-if="this.$store.state.RouteQueryShow" >
        <el-row class="header" >
            路径规划
        </el-row>

        <el-row>
            <div class="line"></div>
        </el-row>

        <el-row>
            <el-col :span="20" >
                <el-row v-if="!startCoordsShow" style="margin-top: 0" >
                    <el-autocomplete placeholder="请输入路线起点"
                                     :fetch-suggestions="querySearch" style="width: 100%"
                                     v-model="startInputContent"
                                     @select="handleStartSelect"/>
                </el-row>
                <el-row v-else type="flex" align="middle" style="margin-top: 0">
                    <el-col :span="2" >
                        <el-tooltip content="点击这里到地图上去取点" placement="top" effect="light">
                            <el-button circle type="success" icon="el-icon-thumb" @click="JumpToGetPoint('start')"
                            ></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="3" style="font-family: 'Bodoni Bd BT';font-size: 20px" :offset="2">X:</el-col>
                    <el-col :span="8" >
                        <el-input v-model="startCoords[0]"  autocomplete="off" ></el-input>
                    </el-col>
                    <el-col :span="3" style="font-family: 'Bodoni Bd BT';font-size: 20px" :offset="1">Y:</el-col>
                    <el-col :span="8">
                        <el-input v-model="startCoords[1]"  autocomplete="off" ></el-input>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="1" :offset="1">
                <el-tooltip :content="getTips(startCoordsShow)" placement="top" effect="light">
                    <el-button type="primary" icon="el-icon-sort" circle @click="startCoordsShow = !startCoordsShow"/>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" >
                <el-row v-if="!endCoordsShow" style="margin-top: 0" >
                    <el-autocomplete placeholder="请输入路线终点"
                                     style="width: 100%"
                                     v-model="endInputContent"
                                     :fetch-suggestions="querySearch"
                                     @select="handleEndSelect"/>
                </el-row>
                <el-row v-else type="flex" align="middle" style="margin-top: 0">
                    <el-col :span="2" >
                        <el-tooltip content="点击这里到地图上去取点" placement="top" effect="light">
                            <el-button circle type="danger" icon="el-icon-thumb"
                                       @click="JumpToGetPoint('end')"
                            ></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="3" style="font-family: 'Bodoni Bd BT';font-size: 20px" :offset="2">X:</el-col>
                    <el-col :span="8" >
                        <el-input v-model="endCoords[0]"  autocomplete="off" ></el-input>
                    </el-col>
                    <el-col :span="3" style="font-family: 'Bodoni Bd BT';font-size: 20px" :offset="1">Y:</el-col>
                    <el-col :span="8">
                        <el-input v-model="endCoords[1]"  autocomplete="off" ></el-input>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="1" :offset="1">
                <el-tooltip :content="getTips(endCoordsShow)" placement="top" effect="light">
                    <el-button type="primary" icon="el-icon-sort" circle @click="endCoordsShow = !endCoordsShow"/>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row style="margin-top: 20px" type="flex" align="middle">
            <el-col :span="4">
                <el-button icon="el-icon-caret-right" type="warning" class="calculate" @click="execute"  >开始解算</el-button>
            </el-col>
            <el-col :span="1" :offset="6" >
                <el-button icon="el-icon-video-camera" type="success"  @click="BeginAnimation"  >路径导航
                </el-button>
            </el-col>
            <el-col :span="5" :offset="8">
                <el-button type="danger" @click="handleClose"  >关闭</el-button>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import {post} from "../../network/post";
    import { Loading } from "element-ui"
    export default {
        name: "RoutePlanControl",
        data(){
            return{
                startCoordsShow:false,
                startCoords:[0,0],
                startSearchResult:[],
                startInputContent:'',
                endCoordsShow:false,
                endCoords:[0,0],
                endSearchResult:[],
                endInputContent:'',
                num:0
            }
        },
        methods:{
            getTips(show){
                if(show){
                    return "转换为输入框模式"
                }
                else {
                    return "转换为坐标点模式"
                }
            },
            /**
             * 响应查询函数，（自动完成时的响应函数，也就是输入信息后，进行数据查找
             * @param queryString 输入框内的查询字符串
             * @param callback 响应函数 这是时实际上返回的数据
             */
            querySearch(queryString, callback){
                //querystring 是得到的查询字符串
                //对字符串进行判断,如果为空就直接返回空
                if(queryString.trim()===""||queryString.trim===null)
                    return callback([]);
                else {
                    //异步请求，产生蒙版

                    //注释掉的内容实际上是在模拟网络请求
                    // clearTimeout(this.timeout);
                    // this.timeout = setTimeout(() => {
                    //     callback([]);
                    // }, 3000 * Math.random());
                    post({
                        url:"./SearchServlet",
                        data:{
                            name:queryString
                        },
                        params:{
                            //暂时就将数据放在这里
                            //TODO 有时间，解决一下，后端获取payload数据，或者获取form-data内的表单数据
                            name:queryString
                        }
                    }).then((res)=>{

                        if(res.data.status===200){
                            let features = JSON.parse(res.data.data.geojson).features;
                            let result = [];
                            for (let feature of features){
                                result.push({
                                    id:feature.properties.id,
                                    //demo里已经说明 ，这里展示的数据只能是 value
                                    value:feature.properties.name,
                                    feature:feature
                                })
                            }
                            return callback(result);
                            //TODO 这里实际上需要修改的，耦合太严重，但是如果不耦合就无法完成实时更新
                        }else {
                            return callback([]);
                        }
                    });

                }
            },
            handleStartSelect(item){
                console.log("展示搜索结果")
                this.startCoords = item.feature.geometry.coordinates;
                this.$EventBus.$emit("setStartCoords",this.startCoords);
            },
            handleEndSelect(item){
                console.log("展示搜索结果")
                this.endCoords = item.feature.geometry.coordinates;
                this.$EventBus.$emit("setEndCoords",this.endCoords);
            },
            JumpToGetPoint(type){
                this.$message({
                    message: '请按下ctr键 和鼠标 从地图上获得你需要的坐标点 ',
                    center: true,
                    type:"success"
                });
                // this.$parent.$parent.$refs['mapview'].handPoint = true;
                this.$EventBus.$emit("getRoutePoint",type)
            },
            handleClose(){
                this.clearQueryInfo();
                this.$store.commit("CloseRouteQuery");
                this.$store.commit("OpenDataQuery");
                this.$EventBus.$emit("clearRouteLayer")
            },
            execute(){
                if(this.startCoords.toString()===[0,0].toString()||this.endCoords.toString()===[0,0].toString()){
                    this.$message({
                        message: '请检查你输入的起点和终点是否完整 ',
                        center: true,
                        type:"error"
                    });
                    return;
                }
                else {
                    this.num++;
                    let loadinstance = Loading.service({
                        lock:true,
                        text:"正在解算路径请稍等",
                        body:document
                    });
                    post({
                        url:"./DataQueryServlet",
                        params:{
                            QueryType:"3"
                        },
                        data:{
                            startPoint:this.startCoords,
                            endPoint:this.endCoords
                        }
                    }).then(res=>{
                        loadinstance.close();
                        let routeArray = JSON.parse(res.data.data.geojson).coordinates;
                        console.log(JSON.parse(res.data.data.geojson));
                        //发送数据到mapView绑定地图导航要素
                        //直接传递坐标点数据
                        this.$EventBus.$emit("routeQuery",routeArray)
                    })
                }
            },
            BeginAnimation(){
                this.$EventBus.$emit("BeginRouteAnimation")
            },
            clearQueryInfo(){
                this.startCoordsShow = false;
                this.startCoords = [0,0];
                this.startSearchResult = [];
                this.startInputContent = '';
                this.endCoordsShow = false;
                this.endCoords = [0,0];
                this.endSearchResult = [];
                this.endInputContent = '' ;
                this.num = 0;
            }
        },
        mounted() {
            this.$EventBus.$on("returnRoutePoint",res=>{
                if (res.type==="start"){
                    this.startCoords = res.coords;
                }else if(res.type==="end"){
                    this.endCoords = res.coords;
                }
            });
            //清除所有内容
            this.clearQueryInfo();
        }
    }
</script>

<style scoped>
.route{
    position: absolute;
    width: 360px;
    left: 5%;
    top: 15%;
    z-index: 8;
    opacity: 90%;
    padding: 10px;
    border-radius: 30px;
    background-color: #dfe4ed;
}
    .el-row{
        margin-top: 20px;
    }
    .calculate{
        font-family: 幼圆;
        font-size: medium;
    }
    .header{
        width: 100%;
        text-align: center;
        color: #1E9FFF;
        font-size: 20px;
    }
.line{
    width: 100%;
    height: 3px;
    border-top: solid #242424 1px;
}
</style>