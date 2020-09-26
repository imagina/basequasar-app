import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//Get all stores
let coreStores = config('stores')

//Add here more stores...
coreStores = {...coreStores}

//Load Stores in VUEX
export default function () {
  const Store = new Vuex.Store({modules: coreStores, strict: process.env.DEV})
  return Store
}
