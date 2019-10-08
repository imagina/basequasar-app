import Vue from 'vue'
import Vuex from 'vuex'
import allStores from './stores'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
let store = false

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: allStores,
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })
  store = Store
  return Store
}

export {store}
