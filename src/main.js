import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
import store from "./store";


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$EventBus = new Vue();
new Vue({
  render: h => h(App),
}).$mount('#app')
