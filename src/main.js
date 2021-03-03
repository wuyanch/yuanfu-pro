// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 
import Vue from 'vue'
import App from './App'

import router from './router'

import ElementUI, { Message, Alert } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入淘宝的自适应js
import 'lib-flexible/flexible.js'
// import 'amfe-flexible/index.js'

// import Vuex from 'vuex'
import directives from './js'
import axios from 'axios'
// import axiosInit from "./js/axios-init";
import qs from 'qs'
//埋点要的两个文件
import Log from './util/Log'
import sa from 'sa-sdk-javascript'



import temporaryClear from './js/temporaryClear';
Vue.use(temporaryClear);

directives.init(Vue);

Vue.use(ElementUI);

Vue.config.productionTip = false

//把axios 作为Vue的原型属性
// window.axios = axiosInit();
// Vue.prototype.$axios = window.axios;

Vue.prototype.$qs = qs
Vue.prototype.$axios = axios;




axios.defaults.baseURL = process.env.NODE_ENV==='production'?'http://gdbbc.pension.taikang.com/mybp/work':'' //服务器地址
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;  //设置cross跨域 并设置访问权限 允许跨域携带cookie信息
axios.defaults.headers.common['Authorization'] = ''; // 设置请求头为 Authorization


axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = window.localStorage.getItem("token");
    token && (config.headers.Authorization = token);
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    console.log("authorization:" + response.headers.hasOwnProperty("authorization"))
    if (response.status === 200) {
      if(response.headers.hasOwnProperty("authorization")){
        localStorage.setItem('token',response.headers.authorization);
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.push({name:'overLogin'})
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          // vant.Toast.fail("登录过期，请关闭重新进入。");
          // 清除token
          break;

        // 404请求不存在
        case 404:
          router.push({name:'error'})
          // vant.Toast.fail("您访问的网页不存在。");

          break;
        case 502:
          console.log('502网关有问题')
          break;
        // 其他错误，直接抛出错误提示
        default:
          // vant.Toast.fail(error.response.data.message);
          // router.push({name:'overLogin'})
      }
      return Promise.reject(error.response);
    }
  }
);



const user_id = window.localStorage.getItem("token") // 这个是必须要有唯一的id，可以取用户id
sa.init({
  server_url: process.env.NODE_ENV==='production'?'/mybp/work/user/logdata':'/user/logdata', // 替换成自己的地址/MyBP
  show_log: false, // 打印console，自己配置，可以看到自己是否踩点成功，以及
  heatmap: {
     //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
     clickmap:'not_collect',
     //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
     scroll_notice_map:'default',
     // 设置触达图的有效停留时间，默认超过4秒以上算有效停留
     scroll_delay_time: 4000
  }
});
sa.login(user_id);
// if (window.$config.env == 'prod') { // 这个地方是看自己的需求加判断添加
  // 神策路由监控页面跳转
router.afterEach((to,from) => {
    Vue.nextTick(() => {
        document.title = to.meta.title;
        sa.quick("autoTrackSinglePage");
    });
})
// 点击事件统计
Log.init()
// }





/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
new Vue({
  router,
  render: function (h) { return h(App) },
}).$mount('#app')
