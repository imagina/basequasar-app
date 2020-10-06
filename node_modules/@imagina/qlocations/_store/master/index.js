import state from '@imagina/qlocations/_store/master/state'
import * as getters from '@imagina/qlocations/_store/master/getters'
import * as mutations from '@imagina/qlocations/_store/master/mutations'
import * as actions from '@imagina/qlocations/_store/master/actions'

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
