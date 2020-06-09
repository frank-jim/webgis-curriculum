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
                <el-col :span="3" :offset="3">
                    <el-image :src="locate_info" fit="scale-down" class="locate_img" ></el-image>
                </el-col>
                <el-col :span="1">X:</el-col>
                <el-col :span="3">{{X}}</el-col>
                <el-col :span="3" :offset="3">
                    <el-image :src="locate_info" fit="scale-down" class="locate_img" ></el-image>
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
                <el-col :span="10" :offset="2" style="height: 30px">
                    <el-tooltip :content="logininfo" placement="top" :disabled="this.$store.state.login" >
                        <el-button  type="text" class="button delete">删除</el-button>
                    </el-tooltip>

                </el-col>
                <el-col :span="10" style="height: 30px">
                    <el-tooltip :content="logininfo" placement="top" :disabled="this.$store.state.login" >
                        <el-button  type="text" class="button update" >更新</el-button>
                    </el-tooltip>
                </el-col>
            </el-row>
        </el-footer>
    </el-container>
</template>

<script>
    import guangzhou from '../../assets/image/guangzhou.jpg'
    import locate_info from '../../assets/image/locate_info.png'
    import {post} from "../../network/post";
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
                console.log(properties);
                this.cityname = properties.name;
                this.cityinfo = properties.intro;
                this.cityImage = properties.image;
                this.citycoords = feature.geometry.coordinates;
                this.$parent.$parent.$refs["mapview"].JumpToLocal(this.citycoords);
            },
            changeInfo(){
                console.log(this.$parent.featureid+"++++++++++++");
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
                    this.createInfo(geojson);
                    console.log(this.id);
                })
            },

        },
        created() {
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
    }
    .update:hover{
        color: springgreen;
    }
    .delete:hover{
        color: red;
    }
</style>