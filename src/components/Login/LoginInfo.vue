<template>
    <el-card>
        <div slot="header" class="clearfix">
            <span style="margin-left: 10px">登录信息</span>

            <el-button style="float: right; padding: 3px 0" type="text" @click="login_btn" >{{setLoginBtn()}}</el-button>
        </div>
        <el-row type="flex" align="middle" style="height: 60px">
            <el-col :span="6">
                <el-tooltip class="item" effect="light" :content="createTips" placement="top" >
                    <el-button type="warning"  icon="el-icon-edit" circle @click="CreateNewFeature"></el-button>
                </el-tooltip>
            </el-col>
            <el-col :span="6">
                <el-tooltip class="item" effect="light" content="点击这里查看城市的统计信息" placement="top" >
                    <el-button type="primary"  icon="el-icon-s-data" circle @click="showStatistics"></el-button>
                </el-tooltip>
            </el-col>
            <el-col :span="12">
                <div class="user_info">
                    <div v-if="this.$store.state.login">
                        <div style="height: 22px" >{{username}}</div>
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
    import {post} from "../../network/post";

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

                    //2.向服务器发生ajax请求，告知登出，将服务端的session移除
                    //发送登出请求
                    post({
                        url:"./LoginServlet",
                        params:{
                            LoginQuery:"3"
                        }
                    }).then(res=>{
                        //如果当前用户已经登录，则取出用户的登录信息
                        if(res.data.status===200){
                            //转换当前状态为已登录
                            this.$store.commit("login_out");
                            //修改登录信息
                            this.clearUserInfo();

                            this.$message({
                                message:"当前用户注销成功",
                                showClose: true,
                                type: 'success'
                            })

                        }
                    }).catch(()=>{
                        this.$message({
                            message:"注销失败",
                            showClose: true,
                            type: 'error'
                        })
                    })

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
                    // let timestr = '';
                    // if(day!==0){
                    //     timestr +=day+"天";
                    // }
                    // if(hours!==0){
                    //     timestr +=hours+"时";
                    // }
                    // if(minutes!==0){
                    //     timestr +=minutes+'分'
                    // }
                    // if(seconds!==0){
                    //     timestr +=seconds+"秒"
                    // }
                    this.interval = hours+" : "+minutes+" : "+seconds;
                }
            },
            CreateNewFeature(){
                if(!this.$store.state.login)
                {
                    return;
                }
                this.$message({
                    message: '请按下ctr键 和鼠标 从地图上获得你需要的坐标点 ',
                    center: true,
                    type:"success"
                });
                this.$parent.$parent.$refs['mapview'].handPoint = true;
                this.$parent.$parent.$refs['search-view'].$refs['update'].clearInfo();
                this.$parent.$parent.$refs['search-view'].$refs['update'].isCreateNew = true;
            },
            showStatistics(){
                this.$store.commit("OpenDataQuery");

            }
        },
        beforeMount() {
            //在数据渲染之间，要进行判断，获取session，判断用户当前是否登录，如果已经登录，需要更改状态信息，和权限信息
            post({
                url:"./LoginServlet",
                params:{
                    LoginQuery:"1"
                }
            }).then(res=>{
              //如果当前用户已经登录，则取出用户的登录信息
                if(res.data.status===200){
                    //转换当前状态为已登录
                    this.$store.commit("login_in");
                    //修改登录信息
                    this.username = res.data.data.username;
                    //设置计时功能
                    this.logintime = res.data.data.LoginTime;
                }
            })
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