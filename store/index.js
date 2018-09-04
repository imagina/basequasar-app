import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@imagina/quser/_store/auth/index'; //Import this file

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth
  }
});

export default store
