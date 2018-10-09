import Vue from 'vue'
import App from './App.vue'

// 引入路由
import VueRouter from 'vue-router';

    Vue.use(VueRouter);
// 引入组件
import index from './components/index.vue';


const routes=[
  {
    path: '/',
    component: index
  },
  {
  path: '/index',
  component: index
}]
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
