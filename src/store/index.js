import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@imagina/quser/_store/index'; //User

const appConfig = require('src/config/app').default//Get config APP

//Auto load stores from modules available in: src/config/app.js "modules"
//Not edit
let stores = {}
if(appConfig && appConfig.modulesDev){
  const modules = appConfig.modulesDev

  modules.forEach(name => {
    try {
      let storeModule = require(`@imagina/${name}/_store/index`).default
      stores[name] = storeModule
    }catch (e) {}
  })
}

Vue.use(Vuex)//Add VUEX to VUE
const store = new Vuex.Store({
  modules: stores//Add config of store's
});

export default store
