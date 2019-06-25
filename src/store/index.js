import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@imagina/quser/_store/index'; //User

const appConfig = require('src/config/app').default//Get config APP

//Auto load stores from modules available in: src/config/app.js "modules"
//Not edit
let stores = {}
if(appConfig && appConfig.modules){
  const modules = appConfig.modules

  modules.forEach(name => {
    try {
      let storeModule = require(`@imagina/${name}/_store/index`).default
      for(var itemName in storeModule){
        let keyName = name+(itemName.charAt(0).toUpperCase() + itemName.slice(1))
        stores[keyName] = storeModule[itemName]
      }
    }catch (e) {}
  })
}

//Add extra stores
//#example: stores.<name> = require('path-store-index').default
stores.app = require('src/store/app/index').default


Vue.use(Vuex)//Add VUEX to VUE
const store = new Vuex.Store({
  modules: stores//Add config of store's
});

export default store
