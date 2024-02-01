import {createStore} from 'vuex'

//Get all stores
let coreStores = config('stores')

//Add here more stores...
coreStores = {...coreStores}

//Load Stores in VUEX
export default function () {
  const Store = createStore({modules: coreStores, strict: process.env.DEV})
  return Store
}
