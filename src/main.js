import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


// 配置全局样式 @ 符号，代指src路径
import '@/assets/css/global.css'
// 配置全局自定义设置
import settings from '@/assets/js/settings'
// axios配置
import axios from 'axios'
// ElementUI的配置
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// cookies配置
import cookies from 'vue-cookies'

Vue.prototype.$settings = settings;
Vue.prototype.$axios = axios;
Vue.prototype.$cookies = cookies;

Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
