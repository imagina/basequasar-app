//Plugins
import config from 'src/config/index'
import cache from '@imagina/qhelper/_plugins/cache'
import { Loading } from 'quasar'

export const REFRESH_PAGE = ({ commit }) => {
  return new Promise(async (resolve, reject) => {
    Loading.show()
    commit('LOAD_PAGE', false)
    await cache.restore(config('app.saveCache.refresh'))//Reset cache
    commit('LOAD_PAGE', true)
    Loading.hide()
    resolve(true)
  })
}

export const TEST_ACTION = ({ commit }) => {
  commit('TEST_MUTATION')
}

//Reset values form Store
export const RESET_STORE = ({ commit, dispatch }) => {
  return new Promise((resolve, reject) => {
    let stores = config('app.resteStores') || []
    stores.forEach(name => commit(name, null, { root: true }))
    resolve(true)
  })
}
