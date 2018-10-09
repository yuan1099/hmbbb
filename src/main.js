import Vue from 'vue'
import App from './App.vue'

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
// 引入组件
import index from './components/index.vue';

// 匹配路由
const routes=[
  {
    path: '/',
    component: index
  },
  {
  path: '/index',
  component: index
}]
// 
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

Vue.config.productionTip = false
// 实例化对象vue
new Vue({
  render: h => h(App),
  // 挂载
  router
}).$mount('#app')
