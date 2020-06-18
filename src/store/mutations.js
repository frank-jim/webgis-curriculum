export default {
    //这里添加响应的函数，修改整体登录状态信息
    login_in(state){
        state.login = true;
    },
    login_out(state){
        state.login = false;
    },
    closeCityInfo(state){
        state.showInfo = false;
    },
    openCityInfo(state){
        state.showInfo = true;
    }
    ,
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
    },
    OpenRouteQuery(state){
      state.RouteQueryShow = true;
    },
    CloseRouteQuery(state){
        state.RouteQueryShow = false;
    },
    OpenProWeMap(state){
        state.ProWeMapShow = true;
    },
    CloseProWeMap(state){
        state.ProWeMapShow = false;
    },
    LoadVirusMapAlready(state){
        state.LoadVirusMapFirst = false;
    },
    OpenVirusInfo(state){
        state.VirusInfoShow = true;
    },
    CloseVirusInfo(state){
        state.VirusInfoShow = false;
    }
}