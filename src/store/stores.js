import Vue from 'vue'
import Vuex from 'vuex'

const appConfig = require('src/config/app').default//Get config APP

//Auto load stores from modules available in: src/config/application.js "modules"
//Not edit
let stores = {}
if (appConfig && appConfig.modules) {
  const modules = appConfig.modules
  modules.forEach(moduleName => {
    try {
      let storeModule = require(`@imagina/${moduleName}/_store/index`).default
      for (var storeName in storeModule) {
        let keyName = moduleName + (storeName.charAt(0).toUpperCase() + storeName.slice(1))
        stores[keyName] = storeModule[storeName]
      }
    } catch (e) {
    }
  })
}

//Add extra stores
//#example: stores.<name> = require('path-store-index').default
stores.app = require('src/store/app/index').default

export default stores
