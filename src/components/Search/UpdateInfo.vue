<template>
    <el-dialog title="更新详细信息" :visible.sync="dialogShow" center>
        <el-form :model="CityInfo">
            <el-form-item label="城市名称:" :label-width="formlabelWidth" >
                <el-input v-model="CityInfo.name" autocomplete="off" ></el-input>
            </el-form-item>

            <el-row>
                <div class="line"></div>
            </el-row>

            <el-form-item label="城市编码:" :label-width="formlabelWidth" >
                <el-input v-model="CityInfo.code" autocomplete="off" ></el-input>
            </el-form-item>

            <el-row>
                <div class="line"></div>
            </el-row>

            <el-form-item label="城市印象:" :label-width="formlabelWidth">
                <el-input type="textarea" autosize v-model="CityInfo.intro" autocomplete="off" ></el-input>
            </el-form-item>

            <el-row>
                <div class="line"></div>
            </el-row>

            <el-form-item label="活动名称:" :label-width="formlabelWidth">
                <el-input v-model="CityInfo.name" autocomplete="off" ></el-input>
            </el-form-item>
            <el-row>
                <div class="line"></div>
            </el-row>

            <el-row type="flex" align="middle" style="margin-bottom: 3px">
                <el-col :span="2" :offset="2">
                    <el-tooltip :content="locateTip" placement="top" effect="light">
                        <el-button circle type="success" icon="el-icon-thumb"></el-button>
                    </el-tooltip>
                </el-col>
                <el-col :span="1" :offset="1">
                    <el-image :src="locate_info" fit="scale-down" class="locate_img" ></el-image>
                </el-col>
                <el-col :span="1">X:</el-col>
                <el-col :span="4">
                    <el-input v-model="CityInfo.coords[0]" autocomplete="off" ></el-input>
                </el-col>
                <el-col :span="1" :offset="2">
                    <el-image :src="locate_info" fit="scale-down" class="locate_img" ></el-image>
                </el-col>
                <el-col :span="1">Y:</el-col>
                <el-col :span="4">
                    <el-input v-model="CityInfo.coords[1]" autocomplete="off" ></el-input>
                </el-col>
            </el-row>

            <el-row>
                <div class="line"></div>
            </el-row>

            <el-row type="flex" align="middle" style="margin-top: 30px">
                城市图片:
                <el-image :src="CityInfo.cityImage" fit="scale-down" class="cityimage" ></el-image>
            </el-row>
        </el-form>
        <el-row style="margin: 5px">
            <div class="line"></div>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button >取 消</el-button>
            <el-button style="margin-left: 150px">提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import guangzhou from '../../assets/image/guangzhou.jpg'
    import locate_info from '../../assets/image/locate_info.png'
    export default {
        name: "UpdateInfo",
        data(){
            return{
                dialogShow:true,
                CityInfo:{
                    name:"这是城市名称",
                    code:5555,
                    intro:"别称江城，是湖北省省会，中部六省唯一的副省级市，特大城市，国务院批复确定的中国中部地区的中心城市，全国重要的工业基地、科教基地和综合交通枢纽。截至2019年末，全市下辖13个区，总面积8569.15平方千米，建成区面积812.39平方千米，常住人口1121.2万人，地区生产总值1.62万亿",
                    coords:[1.2,2.3],
                    cityImage:guangzhou
                },
                formlabelWidth:"100px",
                locate_info:locate_info,
                locateTip:"点击这里到地图上去寻点"
            }
        }
    }
</script>

<style scoped>
    .el-container{
        position: absolute;
        top:10%;
        left: 80%;
        height: 60%;
        z-index: 7;
    }
    .el-dialog__body{
        width: 300px;
    }
    .locate_img{
        height: 22px;
        width: 22px;
    }
    .cityimage{
        height: 200px;
        width: 350px;
    }
    .line{
        width: 100%;
        height: 3px;
        border-top: solid #242424 1px;
    }
    .el-dialog__body{
        padding: 2px;
    }
    .el-form-item{
        margin-bottom: 3px;
    }
    .el-input__inner{
        color: #185fd9;
    }
    .el-input{
        border: #E9EEF3;
    }
    .el-dialog__footer{
        padding: 10px;
    }
</style>