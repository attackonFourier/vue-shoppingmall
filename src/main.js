// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import { routerMode } from './utils/env'

Vue.use(VueRouter)

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
  //store,
  //template: '<login/>',
  //components: { login }
}).$mount('#app')
