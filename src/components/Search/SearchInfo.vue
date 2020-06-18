<template>
<!--    更新城市的详细信息-->
    <el-container>
        <el-header>{{CityClass +" "}}: {{cityname}}({{pinyin}})</el-header>
        <el-main>
            <el-row>
                <div class="line"></div>
            </el-row>
            <el-row>
                <el-image :src="cityImage" fit="scale-down"></el-image>
            </el-row>
            <el-row>
                <div class="line"></div>
            </el-row>
            <el-row>
                <el-col :span="12">
                    {{lowTemperature}}
                </el-col>
                <el-col :span="12">
                    {{highTemperature}}
                </el-col>
            </el-row>
            <el-row>
                <div class="line"></div>
            </el-row>
            <el-row>
                <el-col :span="3" :offset="3">
                    <el-image :src="locate_info" fit="scale-down" class="locate_img" ></el-image>
                </el-col>
                <el-col :span="1">X:</el-col>
                <el-col :span="3">{{X}}</el-col>
                <el-col :span="3" :offset="3">
                    <img :src="locate_info" fit="scale-down" class="locate_img" ></img>
                </el-col>
                <el-col :span="1">Y:</el-col>
                <el-col :span="3">{{Y}}</el-col>
            </el-row>
            <el-row>
                <div class="line"></div>
            </el-row>
            <el-row>
                <div class="text-area">
                    {{cityinfo}}
                </div>
            </el-row>
        </el-main>
        <el-footer>
            <el-row>
                <el-col :span="5" :offset="2" style="height: 30px">
                    <el-button type="text" class=" button close" @click="closeInfoDia"  > 关闭</el-button>
                </el-col>
                <el-col :span="6" :offset="1" style="height: 30px">
                    <el-tooltip :content="logininfo" placement="top" :disabled="this.$store.state.login" >
                        <el-button  type="text" class="button delete" @click="befordelete"
                                    >删除
                        </el-button>
                    </el-tooltip>

                </el-col>
                <el-col :span="6" style="height: 30px">
                    <el-tooltip :content="logininfo" placement="top" :disabled="this.$store.state.login" >
                        <el-button  type="text" class="button update" @click="updateInfo"
                                     >更新</el-button>
                    </el-tooltip>
                </el-col>
            </el-row>
        </el-footer>
        <el-dialog
                title="警告"
                :visible.sync="deleteIdentify"
                width="30%"
                center>
            <span>确认要删除该要素吗？(此操作将不可逆)</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deleteIdentify=false" type="info">取 消</el-button>
            <el-button type="danger" @click="DeleteCity">删除</el-button>
          </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import guangzhou from '../../assets/image/guangzhou.jpg'
    import locate_info from '../../assets/image/locate_info.png'
    import {post,weather} from "../../network/post";
    export default {
        name: "SearchInfo",
        data(){
            return{
                src:guangzhou,
                locate_info:locate_info,
                adclass:2,
                cityname:"城市名称",
                citycoords:[1,2],
                cityinfo:"城市内容",
                cityImage:null,
                pinyin:"chengshi",
                itemInfo:"",
                deleteIdentify:false,
                CityWindDir:null,
                CityWeather:null,
                lowTemperature:null,
                highTemperature:null
            }
        },
        computed:{
            CityClass(){
                if(this.adclass===2){
                    return "省会"
                }else if(this.adclass===1){
                    return "首都"
                }else if(this.adclass===9){
                    return "特别行政区"
                }else {
                    return "城市"
                }
            },
            X(){
                return this.citycoords[0].toFixed(2);
            },
            Y(){
                return this.citycoords[1].toFixed(2);
            },
            logininfo(){
                if(!this.$store.state.login){
                    return "当前用户未登录，请登录后进行操作"
                }
            }
        },
        props:{
            id:Number
        },
        methods:{
            createInfo(geojson){

                let feature = geojson.features[0];
                console.log(feature);
                let properties = feature.properties;
                this.cityname = properties.name;
                this.cityinfo = properties.intro;
                this.cityImage = properties.image;
                this.citycoords = feature.geometry.coordinates;
                this.pinyin = properties.pinyin;
                this.adclass = parseInt(properties.adclass);

                //页面跳转
                this.$parent.$parent.$refs["mapview"].JumpToLocal(this.citycoords);

            },
            changeInfo(){
                //发送ajax请求 修改当前信息
                post({
                    url:"./infoServlet",
                    params:{
                        fid:this.$parent.featureid
                    },
                    data:{
                        fid:this.$parent.featureid
                    }
                }).then((res)=>{
                    //请求成功
                    let geojson = JSON.parse(res.data.data.geojson);
                    this.itemInfo = geojson;
                    this.createInfo(geojson);
                    this.getWeather(this.cityname);
                    console.log(this.cityImage);
                })
            },
            updateInfo(){
                if(!this.$store.state.login){
                    return;
                }
                //弹窗更新
                this.$parent.$refs['update'].dialogShow = true;
                this.$parent.$refs['update'].setInfo(this.itemInfo);
            },
            befordelete(){
                if(!this.$store.state.login)
                {
                    return;
                }
                this.deleteIdentify = true
            },
            DeleteCity(){

                this.deleteIdentify = false;
                post({
                    url:"./UpdateInfoServlet",
                    data:{
                        id:this.id
                    },
                    params:{
                        type:"3"
                    }
                }).then((res)=>{
                    if(res.data.status==200){
                        this.$message({
                            message:"要素删除成功",
                            type:"success",
                            center:true
                        })
                    }
                })
            },
            getWeather(cityname){
                weather({
                    url:"./weather_mini",
                    params:{
                        city:cityname
                    }
                }).then((res)=>{
                    this.highTemperature = res.data.data.forecast[0].high;
                    this.lowTemperature = res.data.data.forecast[0].low;
                })
            },
            closeInfoDia(){
                this.$EventBus.$emit("clearCityFeature")
                this.$store.commit("closeCityInfo");
            }
        },
        mounted() {
            //在生成之间，这里需要对信息进行填充
            this.changeInfo();
        }

    }
</script>

<style scoped>
    .el-container{
        margin-top: 40px;

    }
    .el-header, .el-footer {
        background-color: #cbe2f1;
        color: #333;
        text-align: center;
        width: 350px;
        font-size: 20px;
        line-height: 30px;
        /*  使用deep进行穿透样式设置  使用！important进行默认行内样式的配置 */
        height: 30px!important;
    }
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        padding: 0px;
    }
    .el-image{
        height: 200px;
        width: 350px;
    }
    .locate_img{
        height: 22px;
        width: 22px;
    }
    .line{
        width: 100%;
        height: 5px;
        border-top: solid #ACC0D8 2px;
    }
    .text-area{
        width: 350px;
    }
    .button{
        padding: 0;
        font-size: 16px;
        color: #1E9FFF;
    }
    .update:hover{
        color: springgreen;
    }
    .delete:hover{
        color: red;
    }
    .close:hover{
        color: red;
    }
</style>