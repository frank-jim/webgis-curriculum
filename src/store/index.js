import Vuex from "vuex"
import Vue from "vue";

import mutations from "./mutations";
//1. 安装插件
Vue.use(Vuex)

const state = {
    GeoServer_url:"http://localhost:5858/geoserver",
    GeoServer_WorkPlace:"stars",
    login:false,
    showInfo:false,
    LoginTabShow:false,
    DataQueryShow:false,
    heatMapShow:false
}

const store = new Vuex.Store({
    state:state,
    mutations:mutations
})

export default store

