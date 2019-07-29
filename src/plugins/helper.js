import {helper} from '@imagina/qhelper/_plugins/helper'
import alert from '@imagina/qhelper/_plugins/alert'
import {Forage} from '@imagina/qhelper/_plugins/localForage'

export default ({ Vue }) => {
  Vue.prototype.$helper = helper
  Vue.prototype.$alert = alert
  Vue.prototype.$storage = Forage
}
