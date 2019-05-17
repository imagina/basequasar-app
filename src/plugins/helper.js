import {helper} from '@imagina/qhelper/_plugins/helper'
import {alert} from '@imagina/qhelper/_plugins/alert'

export default ({ Vue }) => {
  Vue.prototype.$helper = helper
  Vue.prototype.$alert = alert
}
