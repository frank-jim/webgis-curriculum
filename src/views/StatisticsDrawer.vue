<template>
    <el-drawer
            title="统计信息"
            :visible.sync="this.$store.state.DataQueryShow"
            direction="rtl"
            :before-close="handleClose"
            :class="drawerClass" :modal="false" >
        <el-tabs type="border-card" tab-position="left" style="height: 100%" @tab-click="tabChange">
            <el-tab-pane label="城市分组查询">
                <slot name="firstpane"> </slot>
            </el-tab-pane>
            <el-tab-pane label="热力图">
                <slot name="secondpane"></slot>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script>
    export default {
        name: "StatisticsDrawer",
        data(){
            return{
                drawer:true,
                drawerClass:"long"
            }
        },
        methods:{
            handleClose(){
                this.$store.state.DataQueryShow = false;
            },
            tabChange(tab){
                let tabname = tab.label;
                if(tabname==="热力图"){
                    this.drawerClass = "short"
                }
                else {
                    this.drawerClass = "long"
                }
            }
        }

    }
</script>

<style scoped>
    .long >>> .el-drawer__header{
        margin-bottom: 5px;
        padding:5px;
        text-align: center;
        font-size: 20px;

    }
    .short >>> .el-drawer__header{
        margin-bottom: 5px;
        padding:5px;
        text-align: center;
        font-size: 20px;

    }
    .long >>> .el-drawer{
        width: 40%!important;
    }
    .short >>> .el-drawer{
        width: 20%!important;
    }

</style>