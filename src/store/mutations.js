export default {
    //这里添加响应的函数，修改整体登录状态信息
    login_in(state){
        state.login = true;
    },
    login_out(state){
        state.login = false;
    },
    ShowCityInfo(state,item){

    },
    ShowLoginTab(state){
        state.LoginTabShow = true
    },
    CloseLoginTab(state){
        state.LoginTabShow = false;
    },
    CloseDataQuery(state){
        state.DataQueryShow = false;
    },
    OpenDataQuery(state){
        state.DataQueryShow = true;
    },
    CloseHeatMap(state){
        state.heatMapShow = false;
    },
    OpenHeatMap(state){
        state.heatMapShow = true;
    }
}