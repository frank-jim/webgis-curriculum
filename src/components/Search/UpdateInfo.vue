<template>
    <el-dialog title="更新详细信息" :visible.sync="dialogShow" center class="updateinfodialog" :modal="false">
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
                <el-select v-model="CityInfo.cityType" placeholder="城市类型">
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
                <el-col :span="5">
                    <el-input v-model="CityInfo.coords[0]" autocomplete="off" ></el-input>
                </el-col>
                <el-col :span="1" :offset="2">
                    <el-image :src="locate_info" fit="scale-down" class="locate_img" ></el-image>
                </el-col>
                <el-col :span="1" style="font-family: 'Bodoni Bd BT';font-size: 20px">Y:</el-col>
                <el-col :span="5">
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
                               :file-list="ImageList"
                               list-type="picture-card"
                               :limit="1" :http-request="showImage" ref="upload">
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
            <el-button type="info" @click="cancelUpdate" >取 消</el-button>
            <el-button type="success" @click="uploadInfo"  style="margin-left: 150px">提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import guangzhou from '../../assets/image/guangzhou.jpg'
    import locate_info from '../../assets/image/locate_info.png'
    import {post} from "../../network/post";

    export default {
        name: "UpdateInfo",
        data(){
            return{
                dialogShow:false,
                CityInfo:{
                    name:null,
                    code:null,
                    intro:"",
                    coords:[1.2,2.3],
                    cityImage:"",
                    cityType:null,
                    pinyin:null
                },
                ImageList:[],
                formlabelWidth:"100px",
                locate_info:locate_info,
                locateTip:"点击这里到地图上去寻点",
                PreImageDialog:false,
                //上传的文件 base64
                PreImageUrl:'',
                ImageFile:"",
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
                }],
                featureId:null,
                uploadimage:false
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

                this.PreImageUrl = file.url;
                this.PreImageDialog = true;
            },
            beforeRemove(file, fileList) {
                console.log(file, fileList);
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            setInfo(item){
                console.log("更新请求已收到");
                this.createInfo(item)
            },
            createInfo(geojson){
                let feature = geojson.features[0];
                let properties = feature.properties;
                this.CityInfo.name = properties.name;
                this.CityInfo.intro = properties.intro;
                this.CityInfo.cityImage = properties.image;
                this.CityInfo.coords = feature.geometry.coordinates;
                this.CityInfo.pinyin = properties.pinyin;
                this.CityInfo.cityType = parseInt(properties.adclass);
                this.CityInfo.code = properties.adcode99;
                this.featureId = properties.id;
            },
            cancelUpdate(){
                this.dialogShow = false;
            },
            uploadInfo(){
                // this.$refs['upload'].submit();
                //查找是否上传图片,这个是文件

                let file = this.$refs['upload'].uploadFiles;
                if(file.length>0){
                    console.log(file[0].raw);
                    this.loadPromise(file[0].raw).then((res)=>{
                        this.ImageFile = res;
                        console.log(this.uploadimage);
                        console.log("开始上传信息");
                        console.log("1");
                        post({
                            url:"./UpdateInfoServlet",
                            data:{
                                id:this.featureId,
                                name:encodeURI(this.CityInfo.name),
                                intro:encodeURI(this.CityInfo.intro),
                                pinyin:this.CityInfo.pinyin,
                                adcode99:this.CityInfo.code,
                                coordinates:this.CityInfo.coords,
                                image:this.CityInfo.cityImage,
                                adclass:this.CityInfo.cityType
                            }
                        }).then((res)=>{
                            this.updateAfter(res);
                        }).catch((res)=>{
                            console.log(res);
                        })
                    })
                }else
                    {
                    post({
                        url:"./UpdateInfoServlet",
                        data:{
                            id:this.featureId,
                            name:encodeURI(this.CityInfo.name),
                            intro:encodeURI(this.CityInfo.intro),
                            pinyin:this.CityInfo.pinyin,
                            adcode99:this.CityInfo.code,
                            coordinates:this.CityInfo.coords,
                            image:this.CityInfo.cityImage,
                            adclass:this.CityInfo.cityType
                        }
                    }).then((res)=>{
                        this.updateAfter(res);
                    }).catch((res)=>{
                        console.log(res);
                    })
                }
            },
            showImage(item){
                this.loadPromise(item).then((res)=>{
                    this.ImageFile = res;
                    post({
                        url:"./UpdateInfoServlet",
                        data:{
                            id:this.featureId,
                            name:encodeURI(this.CityInfo.name),
                            intro:encodeURI(this.CityInfo.intro),
                            pinyin:this.CityInfo.pinyin,
                            adcode99:this.CityInfo.code,
                            coordinates:this.CityInfo.coords,
                            image:this.ImageFile,
                            adclass:this.CityInfo.cityType
                        }
                    }).then((res)=>{
                        this.updateAfter(res);
                    }).catch((res)=>{
                        console.log(res);
                    })
                });
                this.uploadimage = false;
            },
            loadPromise(item){
                return new Promise(((resolve, reject) => {
                    let file = item;
                    if(file!=null){
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        //reader.onload 是文件加载完成之后需要调用的函数，如何来进行异步加载？
                        reader.onload = function (e) {
                            resolve(reader.result);
                        }
                    }else {
                        reject();
                    }
                }));
            },
            updateAfter(res){
                if(res.data.status===200){
                    let geojson = res.data.data.geojson;
                    this.createInfo(JSON.parse(geojson));
                    this.$message({
                        message: '城市信息修改成功',
                        type: 'success'
                    });
                }else {
                    this.$message({
                        message:"信息修改失败，请检查后重新修改",
                        type:"error"
                    })
                }
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
        padding: 10px;
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