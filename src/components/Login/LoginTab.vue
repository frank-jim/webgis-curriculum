<template>
    <div v-if="this.$store.state.LoginTabShow">
        <el-button type="danger"  @click="closeTab"><i style="color: #000000" class="el-icon-close"></i></el-button>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card"  id="el_tabs_log" >
            <el-tab-pane label="用户登录" name="login">
                <div style="width: 100%;margin:0 auto;text-align: center">
                    <slot name="login" ></slot>
                </div>
            </el-tab-pane>
            <el-tab-pane label="用户注册" name="register">
                <div style="width: 100%;margin:0 auto;text-align: center">
                    <slot name="register"></slot>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "LoginTab",
        data(){
            return{
                activeName:"login"
            }
        },
        methods:{
            handleClick(tab, event) {
                console.log(tab, event);
            },
            closeTab(){
                this.$store.commit("CloseLoginTab");
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .el-tabs{
        position: absolute;
        z-index: 5;
        left: 40%;
        top: 30%;
        width: 25%;
        /*background-color: #E6E6E6;*/
        border-width: 2px;
        border-radius:4px;
        text-align: center;
    }
    .el-button{
        left: 62%;
        top: 31%;
        position: absolute;
        z-index: 6;
        background-color: #f5f7fa;
        padding: 8px;
        border: #FFFFFF;
    }
    .el-button:hover{
        background-color: #ff0436;
    }
</style>