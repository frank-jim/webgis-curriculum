<template>
    <el-card>
        <div slot="header" class="clearfix">
            <span style="margin-left: 10px">登录信息</span>

            <el-button style="float: right; padding: 3px 0" type="text" @click="login_btn" >{{setLoginBtn()}}</el-button>
        </div>
        <el-row type="flex" align="middle" style="height: 60px">
            <el-col :span="10"  :offset="2">
                <el-tooltip class="item" effect="light" :content="createTips" placement="top" >
                    <el-button type="warning"  icon="el-icon-edit" circle @click="CreateNewFeature"></el-button>
                </el-tooltip>
            </el-col>
            <el-col :span="13" >
                <div class="user_info">
                    <div v-if="this.$store.state.login">
                        <div >{{username}}</div>
                        <div>{{interval}}</div>
                    </div>
                    <div v-else>
                        <div>当前用户未登录</div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import login_false from '../../assets/image/login_false.png'
    import login_true from '../../assets/image/login_true.png'
    export default {
        name: "LoginInfo",
        data(){
            return{
                username:"",
                logintime:"",
                interval:""
            }
        },
        computed:{
          createTips(){
              if(this.$store.state.login){
                  return "点我添加新城市"
              }else {
                  return "当前用户未登录，请登录后进行编辑"
              }
          }
        },
        methods:{
            getLoginImg(){
                if(this.$store.state.login){
                    return login_true;
                }else {
                    return login_false;
                }
            },
            setLoginBtn(){
                if(this.$store.state.login){
                    return "登出"
                }
                else{
                    return "登录"
                }
            },
            login_btn(){
                console.log("响应点击事件");
                //响应login的点击事件
                if(this.$store.state.login){
                    // 已经登录的情况下
                    //1. 取消登录状态
                    this.$store.commit("login_out");
                    //2.向服务器发生ajax请求，告知登出，将服务端的session移除
                    this.$emit("login_out_click");
                    this.clearUserInfo();

                }
                else {
                    this.$store.commit("ShowLoginTab");
                    console.log("开启登录");
                    this.$emit("login_in_click",true);
                }
            },
            setUserInfo(info){
                this.username = info.username;
                //设置计时功能
                this.logintime = info.LoginTime;
            },
            clearUserInfo(){
                this.username = '';
                this.logintime = '';
                this.interval = '';
            },
            setTime(){
                if(this.$store.state.login){
                    let now = new Date();
                    let sect = now.getTime() - parseInt(this.logintime);
                    let day = Math.floor(sect/(24*3600*1000));
                    let internal1 = sect%(24*3600*1000);
                    let hours = Math.floor(internal1/(3600*1000));
                    let internal2 = internal1%(3600*1000);
                    let minutes =  Math.floor(internal2/(60*1000));
                    let internal3 = internal2%(60*1000);
                    let seconds = Math.floor(internal3/1000);
                    console.log(day+":"+hours+":"+minutes+":"+seconds);
                    this.interval = day+":"+hours+":"+minutes+":"+seconds;
                }
            },
            CreateNewFeature(){
                this.$message({
                    message: '请按下ctr键 和鼠标 从地图上获得你需要的坐标点 ',
                    center: true,
                    type:"success"
                });
                this.$parent.$parent.$refs['mapview'].handPoint = true;
                this.$parent.$parent.$refs['search-view'].$refs['update'].clearInfo();
                this.$parent.$parent.$refs['search-view'].$refs['update'].isCreateNew = true;
            }
        },
        mounted() {

            //生命周期内要实时判断时间内容，
            //登录时钟开发
            setInterval(()=>{
                this.setTime();
            },1000)
        }
    }
</script>

<style scoped>
    .el-card{
        width: 250px;
        z-index: 5;
        float:right;
        margin-left: 80%;
        margin-top: 20px;
        position: absolute;
    }
    .el-card >>> .el-card__body{
        /* <<< 深度选择器， 从上个节点得到下一个节点 放在这里比较合适，如果单独修改一般不能起作用*/
        padding: 5px;
        /*打破行内排列，纵向排列*/
    }
    .el-card >>> .el-card__header{
        /* <<< 深度选择器， 从上个节点得到下一个节点 放在这里比较合适，如果单独修改一般不能起作用*/
        padding: 5px;
    }
    .el-button{
        margin-right: 20px;
    }
    .user_info_img{
        height: 40px;
        width: 40px;
        border-radius: 20px;
    }
</style>