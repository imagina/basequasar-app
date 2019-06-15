import cloneDeep from 'lodash.clonedeep'

export default ({ Vue }) => {
  Vue.prototype.$clone = cloneDeep
}
