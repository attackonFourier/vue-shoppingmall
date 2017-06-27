// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import { routerMode } from './utils/env'

import swiper from 'vue-awesome-swiper'
import Tab from 'vue-tabs-component'
import modal from './components/modal'

import './style/icofont/iconfont.css'

Vue.use(VueRouter)
Vue.use(swiper)
Vue.use(Tab)
Vue.use(modal)

const router = new VueRouter({
  routes,
  mode:routerMode,
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to,from,savedPosition){
    if(savedPosition){
      return savedPosition
    }
    else{
      if(from.meta.keepAlive){
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x:0,
        y:to.meta.savedPosition || 0
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  //el: '#app',
  router,
  store,
  //template: '<login/>',
  //components: { login }
}).$mount('#app')
