//Plugins
import store from 'src/store/index'
import {helper} from '@imagina/qhelper/_plugins/helper'
import config from 'src/config/index'
import router from 'src/router/index'
//Services
import appServices from 'src/services/application/index'

//Set configuration status
export const CHECK_VERSION = ({commit, state, dispatch}) => {
  return new Promise(async (resolve, reject) => {
    let inRequest = await helper.storage.get.item('app.requesting.version')
    let currentVersion = parseInt(config('app.version').split('.').join(''))
    let apiRoute = 'apiRoutes.qsite.appVersion'

    //Request version to backend
    if (!inRequest) {
      helper.storage.set('app.requesting.version',true)
      appServices.crud.index(apiRoute, {remember: false}).then(response => {
        helper.storage.set('app.requesting.version',false)
        let version = parseInt(response.data.split('.').join(''))//Parse version of backend
        if (currentVersion < version){
          state.updateAvailable = true//update status
          router.push({name: 'app.config'})//Redirect to config
        }
      })
    }
  })
}

//Reset values form Store
export const RESET_STORE = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    store.commit('quserAuth/RESET')
    resolve(true)
  })
}

//Set configuration status
export const SET_CONFIGURATION_STATE = ({commit, state, dispatch}) => {
  return new Promise((resolve, reject) => {
    commit('UPDATE_CONFIGURATION_SATE')
    resolve(true)
  })
}
