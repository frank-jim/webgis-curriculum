<template>
    <div class="register_div">
        <el-form :model="ruleForm" label-width="100px" status-icon  :rules="rules" ref="ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input autocomplete="off" v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input autocomplete="off" type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="验证密码" prop="checkPass">
                <el-input autocomplete="off" type="password" v-model="ruleForm.checkPass"></el-input>
            </el-form-item>
            <el-form-item  class="login-button">
                <el-button type="primary" @click="submitForm('ruleForm')" >提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {post} from "../../network/post";

    export default {
        name: "register_tab",
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
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                ruleForm:{
                    password:"",
                    checkPass:"",
                    username:"",
                },
                rules: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
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
                        this.register();
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
            register(){
                //登录函数，收集信息发送ajax请求
                post({
                    url:"./RegisterServlet",
                    data:{
                        username:this.ruleForm.username,
                        password:this.ruleForm.password
                    },
                    headers: {'X-Requested-With': 'XMLHttpRequest'},
                }).then((res)=>{
                    this.register_success_event(res.data)
                })
            },
            showError(){
                this.$message({
                    showClose: true,
                    message: '用户名重复，注册失败',
                    type: 'error'
                })
            },
            showSuccess(){
                this.$message({
                    showClose: true,
                    message: '用户注册成功',
                    type: 'success'
                })
            },
            register_success_event(data){
                //注册事件
                if(data.status==200){
                    //注册成功
                    this.showSuccess();
                    this.$emit("register_success",data.data)
                }else {
                    this.showError();
                    this.resetForm("ruleForm");
                }
            }

        }
    }
</script>

<style scoped>
    .login-button /deep/ .el-form-item__content{
        margin-left:50px;
    }
    .login-button{
        margin-bottom: 0px;
    }
    /*.el-form-item /deep/ .el-form-item__content{*/
    /*    margin-left: 0px;*/
    /*}*/
    .el-form{
        margin-right: 80px;
        margin-top: 20px;
    }
</style>