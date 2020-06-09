<template>
    <div>
        <login-info ref="logininfo"></login-info>
        <LoginTab ref="logintab">
            <register_tab ref="aaa" slot="register" @register_success="re_log_success"  ></register_tab>
            <login_in_tab ref="ccc" slot="login" @login_success="re_log_success"></login_in_tab>
        </LoginTab>
    </div>
</template>

<script>
    import LoginInfo from "../../components/Login/LoginInfo";
    import LoginTab from "../../components/Login/LoginTab";
    import Register_tab from "../../components/Login/register_tab";
    import Login_in_tab from "../../components/Login/login_in_tab";
    export default {
        name: "LoginView",
        components: {
            Login_in_tab,
            Register_tab,
            LoginTab,
            LoginInfo
        },
        methods:{
            re_log_success(info){
                console.log("已经收到信号")
                this.$refs["logininfo"].setUserInfo(info);
            },
        }
    }
</script>

<style scoped>

</style>