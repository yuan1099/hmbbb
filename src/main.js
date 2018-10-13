import Vue from 'vue'
import App from './App.vue'
import './assets/cavars.js'

// 引入插件element-ui
import ElementUI from 'element-ui';
// 引入插件的样式
import 'element-ui/lib/theme-chalk/index.css';
// 实例化elementUI
Vue.use(ElementUI);

// 引入路由
import VueRouter from 'vue-router';
// 实例化VueRouter
Vue.use(VueRouter);

// 引入插件iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

// 懒加载
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  error: require('./assets/img/error.gif'),
  loading: require('./assets/img/log.jpg')
})

// 引入组件
import index from './components/index.vue';
import detail from './components/detail.vue';
import shopCart from './components/shopCart.vue';

// 导入axios
import axios from "axios";
Vue.prototype.$axios = axios;
// 抽取基地址
axios.defaults.baseURL = 'http://111.230.232.110:8899';
// 图片放大镜功能插件
import ProductZoomer from 'vue-product-zoomer'
Vue.use(ProductZoomer);


// 定义路由的规则
const routes = [{
    path: '/',
    component: index
  },
  {
    path: '/index',
    component: index
  },
  {
    path: '/detail/:goodId',
    component:detail
  },
  {
    path: '/shopCart',
    component:shopCart
  }
]
// 实例化路由对象
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

Vue.config.productionTip = false

// 引入时间
import moment from "moment";
// 设置全局过滤器
Vue.filter('beautifyTime', function(value,formatStr){
  return moment(value).format(formatStr)
})

// 引入vuex 数据共享
import Vuex from 'vuex'
Vue.use(Vuex)
// 实例化数据仓库
const store = new Vuex.Store({
  // 数据
  state: {
    // count: 0
    shopCartData:JSON.parse(window.localStorage.getItem('cartData'))||{}
  },
  // 相当于事件  修改数据的方式
  mutations: {
    // increment (state) {
    //   state.count++
    // }
    addCart(state,opt){
    // console.log(state);

    // 添加属性到shopCartData中
    if(state.shopCartData[opt.id] == undefined){
      // 判断有没有这个key    没有就添加 使用这种方法，当vue在次改变时无法观察到值的改变
      // state.shopCartData[opt.id]=opt.buyCount
      // 当需要实时监控值发生改变需使用Vue.set(obj, 'newProp', 123)方法
      Vue.set(state.shopCartData, opt.id, opt.buyCount);
    }else{
      // 有就累加  对象也支持累加
      state.shopCartData[opt.id] += opt.buyCount
    }

    }
  },
  getters:{
    cartGoodCount(state){
      // console.log("出发了");
      let totalCoount=0;
      for(const key in state.shopCartData){
        totalCoount +=state.shopCartData[key]
      }
      return totalCoount;
    }
  }
})

// 实例化对象vue
new Vue({
  render: h => h(App),
  // 挂载到vue实例上
  router,
  // 挂载
  store
}).$mount('#app')

// 浏览器关闭时保存数据
window.onbeforeunload=function(){
  window.localStorage.setItem('cartData',JSON.stringify(store.state.shopCartData))
}