import Vue from 'vue'
import App from './App.vue'
import './assets/cavars.js'

// 引入插件element-ui
import ElementUI from 'element-ui';
// 引入插件的样式
import 'element-ui/lib/theme-chalk/index.css';
// 实例化elementUI
Vue.use(ElementUI);

// 引入jquery
import $ from "jquery";
Vue.prototype.$$ = $;

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
import shopcart from './components/shopcart.vue';
import chenckOrder from './components/chenckOrder.vue';
import login from './components/login.vue'

// 导入axios
import axios from "axios";
Vue.prototype.$axios = axios;
//让ajax携带cookie
axios.defaults.withCredentials = true;
// 抽取基地址
axios.defaults.baseURL = 'http://111.230.232.110:8899';
// 图片放大镜功能插件
import ProductZoomer from 'vue-product-zoomer'
Vue.use(ProductZoomer);


// 定义路由的规则
const routes = [
  // 导航重定向  当地址为/时进入主页
  {
    path: '/',
    component: index
  },
  // 主页
  {
    path: '/index',
    component: index,
    meta: {
      ChinaName: "首页"
    }
  },
  // 商品详情页
  {
    path: '/detail/:goodId',
    component: detail,
    meta: {
      ChinaName: "商品详情"
    }
  },
  // 购物车页面
  {
    path: '/shopcart',
    component: shopcart,
    meta: {
      ChinaName: "购物车"
    }
  },
  // 订单页
  {
    path: '/chenckOrder',
    component: chenckOrder,
    meta: {
      ChinaName: "订单确认页"
    }
  },
  // 登录页面
  {
    path: '/login',
    component: login,
    meta: {
      ChinaName: "登录"
    }
  }
];
// 实例化路由对象
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
});
// 导航守卫
router.beforeEach((to, from, next) => {
  // 设置一个自动设置页面title
  window.document.title = to.meta.ChinaName

  // console.log(to);去的地方
  // console.log(from);从哪里去的
  // console.log(next);必写守卫
  // 如果去的是订单也则判断有没有登录
  if (to.path == "/chenckOrder") {
    axios.get('site/account/islogin').then(response => {
      // console.log(response);
      // console.log(response.data.code);
      if (response.data.code == 'nologin') {
        Vue.prototype.$message.info('你还没用登录哦！')
        // 没登录打回登录页
        router.push('/login')
      } else {
        // 继续填写订单
        next()
      }
    })
    // 如不使用else的情况下会出现闪现订单页的情况
  } else {
    next()
  }
});

// 后置钩子 
// 跳转完成后执行
router.afterEach((to, from) => {
  // 滚回顶部
  window.scroll(0, 0)
})

Vue.config.productionTip = false

// 引入时间
import moment from "moment";
// 设置全局过滤器
Vue.filter('beautifyTime', function (value, formatStr) {
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
    // 取出数据,没数据就用空对象
    shopCartData: JSON.parse(window.localStorage.getItem('cartData')) || {},
    // 记录登录状态  是否登录
    isLogin: false
  },
  // 相当于事件  修改数据的方式
  mutations: {
    // increment (state) {
    //   state.count++
    // }
    addCart(state, opt) {
      // console.log(state);

      // 添加属性到shopCartData中
      if (state.shopCartData[opt.id] == undefined) {
        // 判断有没有这个key    没有就添加 使用这种方法，当vue在次改变时无法观察到值的改变
        // state.shopCartData[opt.id]=opt.buyCount
        // 当需要实时监控值发生改变需使用Vue.set(obj, 'newProp', 123)方法
        Vue.set(state.shopCartData, opt.id, opt.buyCount);
      } else {
        // 有就累加  对象也支持累加
        state.shopCartData[opt.id] += opt.buyCount
      }

    },
    // 修改仓库中的数据
    updataCart(state, opt) {
      state.shopCartData[opt.id] = opt.newCount
    },
    // 删除对应的数据即可
    deledata(state, id) {
      Vue.delete(state.shopCartData, id)
    },
    // 设置登录状态
    changeLoginState(state, loginState) {
      // 直接赋值即可
      state.isLogin = loginState
    }
  },
  getters: {
    cartGoodCount(state) {
      // console.log("出发了");
      let totalCoount = 0;
      for (const key in state.shopCartData) {
        totalCoount += state.shopCartData[key]
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
  store,
  // 生命周期函数  维持登录状态
  created() {
    // 发送请求判断登录了还是没登录
    axios.get('site/account/islogin').then(response => {
      // console.log(response);
      if (response.data.code === "logined") {
        // 登录了
        store.commit('changeLoginState', true)
      } else {
        // 没登录
        store.commit('changeLoginState', false)
      }

    })

  },
}).$mount('#app')

// 浏览器关闭时保存数据
window.onbeforeunload = function () {
  window.localStorage.setItem('cartData', JSON.stringify(store.state.shopCartData))
}