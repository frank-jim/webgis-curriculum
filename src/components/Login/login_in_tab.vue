<template>
    <div class="register_div">
        <el-form :model="ruleForm" label-width="100px" status-icon  :rules="rules" ref="ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input autocomplete="off" v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input autocomplete="off" type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item class="login-button" >
                <el-button type="primary" @click="submitForm('ruleForm')" >登录</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {post} from "../../network/post";
    import axios from "axios"
    export default {
        name: "login_in_tab",
        data(){
            /***
             * 验证函数
             */
            let validateUsername = (rule, value, callback) => {
                if (value === '') {
                    console.log("1.用户名");
                    callback(new Error('请输入用户名'));
                } else {
                    //这里没有下面的那一环，就是因为这里不需要进行双重验证
                    callback();
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    console.log("2.密码");
                    if (this.ruleForm.checkPass !== '') {
                        //这里为什么要验证，是要进行双重验证所以才有的    这句代码的含义，实际上就是 调用ruleform，里面的验证函数，对checkpass进行验证
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            return{
                ruleForm:{
                    password:"",
                    username:"",
                },
                rules: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    username:[
                        { validator: validateUsername, trigger:'blur'}
                    ]
                }
            }
        },
        methods: {
            //验证信息
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login(this.showError,this.showSuccess);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                console.log("信息提交")
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },
            showError(){
                this.$message({
                    showClose: true,
                    message: '用户名或密码错误',
                    type: 'error'
                })
            },
            showSuccess(){
                this.$message({
                    showClose: true,
                    message: '用户登录成功',
                    type: 'success'
                })
            },
            login_success_event(data){
                if(data.status===200){
                    //登录成功 弹窗
                    this.showSuccess();
                    //1.进行图标展示，关闭登录注册框
                    this.$store.commit("CloseLoginTab");
                    this.$store.commit("login_in");
                    //
                    console.log(data.data);
                    this.$emit("login_success",data.data);

                }
                else {
                    //登录失败 弹窗
                    this.showError()
                }
            },
            login(){
                // 登录函数，收集信息发送ajax请求
                post({
                    url:"./LoginServlet",
                    data:{
                        username:this.ruleForm.username,
                        password:this.ruleForm.password
                    },
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                }).then((res)=>{
                    //成功发送了请求后
                    this.login_success_event(res.data)
                });
            }
        }
    }
</script>

<style scoped>
    /*.login-button /deep/ .el-form-item__content{*/
    /*    margin-left: 0px;*/
    /*}*/
    .login-button {
        margin-bottom: 0px;
    }
    .el-form{
        margin-right: 80px;
        margin-top: 20px;
    }
</style>