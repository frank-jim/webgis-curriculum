<template>
    <el-dialog title="更新详细信息" :visible.sync="dialogShow" center class="updateinfodialog">
        <el-form :model="CityInfo">
            <el-row>
                <div class="line"></div>
            </el-row>

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

            <el-form-item label="城市类型:" :label-width="formlabelWidth">
                <el-select v-model="cityType" placeholder="城市类型">
                    <el-option
                            v-for="item in cityTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
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
                <el-col :span="1" style="font-family: 'Bodoni Bd BT';font-size: 20px">X:</el-col>
                <el-col :span="4">
                    <el-input v-model="CityInfo.coords[0]" autocomplete="off" ></el-input>
                </el-col>
                <el-col :span="1" :offset="2">
                    <el-image :src="locate_info" fit="scale-down" class="locate_img" ></el-image>
                </el-col>
                <el-col :span="1" style="font-family: 'Bodoni Bd BT';font-size: 20px">Y:</el-col>
                <el-col :span="4">
                    <el-input v-model="CityInfo.coords[1]" autocomplete="off" ></el-input>
                </el-col>
            </el-row>

            <el-row>
                <div class="line"></div>
            </el-row>

            <el-row type="flex" align="middle" >
                <el-col :span="3" :offset="1">城市图片:</el-col>
                <el-col :span="8">
                    <el-image :src="CityInfo.cityImage" fit="scale-down" class="cityimage" ></el-image>
                </el-col>
                <el-col :span="8" :offset="2">
                    <el-upload :auto-upload="false"
                               action="#"
                               :on-preview="handlePreview"
                               :on-remove="handleRemove"
                               :before-remove="beforeRemove"
                               list-type="picture-card"
                               :limit="3">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="PreImageDialog">
                        <img width="100%" :src="PreImageUrl" alt="">
                    </el-dialog>
                </el-col>
            </el-row>
        </el-form>
        <el-row style="margin: 2px;height: 1px">
            <div class="line"></div>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" >取 消</el-button>
            <el-button type="success" style="margin-left: 150px">提交</el-button>
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
                dialogShow:false,
                CityInfo:{
                    name:"这是城市名称",
                    code:5555,
                    intro:"别称江城，是湖北省省会，中部六省唯一的副省级市，特大城市，国务院批复确定的中国中部地区的中心城市，全国重要的工业基地、科教基地和综合交通枢纽。截至2019年末，全市下辖13个区，总面积8569.15平方千米，建成区面积812.39平方千米，常住人口1121.2万人，地区生产总值1.62万亿",
                    coords:[1.2,2.3],
                    cityImage:guangzhou
                },
                formlabelWidth:"100px",
                locate_info:locate_info,
                locateTip:"点击这里到地图上去寻点",
                PreImageDialog:false,
                PreImageUrl:'',
                ImageFile:"",
                cityType:1,
                cityTypeOptions: [{
                    value: 1,
                    label: "首都"
                }, {
                    value: 2,
                    label: '省会'
                }, {
                    value: 3,
                    label: '城市'
                }, {
                    value: 9,
                    label: '特别行政区'
                }]
            }
        },
        computed:{
            // cityType(){
            //     if(this.adclass===2){
            //         return "省会"
            //     }else if(this.adclass===1){
            //         return "首都"
            //     }else if(this.adclass===9){
            //         return "特别行政区"
            //     }else {
            //         return "城市"
            //     }
            // }
        },
        methods:{
            //三个函数处理当前用户的上传操作
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                this.ImageFile = "";
                console.log(file, fileList);
            },
            handlePreview(file) {
                //这个判断放到实际发送请求的时候再来进行
                // const isJPG = file.type === 'image/jpeg';
                // const isLt2M = file.size / 1024 / 1024 < 2;
                //
                // if (!isJPG) {
                //     this.$message.error('上传头像图片只能是 JPG 格式!');
                //     return ;
                // }
                // if (!isLt2M) {
                //     this.$message.error('上传头像图片大小不能超过 2MB!');
                //     return ;
                // }

                console.log(file);
                this.PreImageUrl = file.url;
                this.PreImageDialog = true;
                this.ImageFile = file;
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
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

    }
    .line{
        width: 100%;
        height: 3px;
        border-top: solid #242424 1px;
    }
    .updateinfodialog >>>.el-dialog__body{
        padding: 0px 10px 10px;

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
    .updateinfodialog >>> .el-dialog__footer{
        padding: 5px;
    }
    .updateinfodialog >>> .el-dialog__header{
        padding: 5px;
    }
    .updateinfodialog >>>.el-dialog{
        margin-top: 30px!important;
        margin-left: 450px;
        background-color: #ccebfc;
        border-radius: 10px;

    }
    .updateinfodialog{
        z-index: 8;
    }
</style>