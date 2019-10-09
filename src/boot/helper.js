import alert from '@imagina/qhelper/_plugins/alert'
import array from '@imagina/qhelper/_plugins/array'
import date from '@imagina/qhelper/_plugins/date'
import helper from '@imagina/qhelper/_plugins/helper'
import cache from '@imagina/qhelper/_plugins/cache'
import crud from '@imagina/qcrud/_services/baseService'
import cloneDeep from 'lodash.clonedeep'
import moment from 'vue-moment'
import Vuelidate from 'vuelidate'
import { uid } from 'quasar'

export default function ({ app, router, store, Vue, ssrContext }) {
  Vue.prototype.$alert = alert
  Vue.prototype.$array = array
  Vue.prototype.$date = date
  Vue.prototype.$helper = helper
  Vue.prototype.$cache = cache
  Vue.prototype.$clone = cloneDeep
  Vue.prototype.$crud = crud
  Vue.prototype.$auth = {
    hasAccess : (can) => {return store.getters['quserAuth/hasAccess'](can)},
    hasSetting : (name) => {return store.getters['quserAuth/hasSetting'](name)},
  }
  Vue.prototype.$uid = uid

  Vue.use(moment)
  Vue.use(Vuelidate)
}
