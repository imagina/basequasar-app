import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@imagina/quser/_store/index'; //User

const configApp = require('src/config/app').default//Get config APP
if (!configApp.modules.store.auth) configApp.modules.store.auth = auth//Check if store auth exist

Vue.use(Vuex)//Add VUEX to VUE
const store = new Vuex.Store({
  modules: configApp.modules.store//Add config of store's
});

export default store
