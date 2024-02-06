
import { createRouter, createWebHistory } from 'vue-router'
//[ptc]
// import Vue from 'vue'
// import VueRouter from 'vue-router'

// [ptc]
// Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({x: 0, y: 0}),
  routes: [],
})

export default function (/* { store, ssrContext } */) {
  //[ptc]
  // const Router = new VueRouter({
  //   scrollBehavior: () => ({x: 0, y: 0}),
  //   routes: [],
  //   // Leave these as is and change from quasar.conf.js instead!
  //   // quasar.conf.js -> build -> vueRouterMode
  //   // quasar.conf.js -> build -> publicPath
  //   mode: process.env.VUE_ROUTER_MODE,
  //   base: process.env.VUE_ROUTER_BASE
  // })
  const Router = {
    scrollBehavior: () => ({x: 0, y: 0}),
    routes: [],
    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  }

  return router
}
