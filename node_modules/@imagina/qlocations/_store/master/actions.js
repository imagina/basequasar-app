import locationsService from '@imagina/qlocations/_services/index'

export const GET_COUNTRIES = ({ commit, state, dispatch }, params = {}) => {
  return new Promise(async (resolve, reject) => {
    await locationsService.crud.index('apiRoutes.qlocations.countries', params)
     .then(response => {
        commit('SET_COUNTRIES',  response.data)
        resolve(true)
     })
     .catch(error=>{
       reject(error)
     })
  })
}

export const GET_CITIES = ({ commit, state, dispatch }, params = {}) => {
  return new Promise(async (resolve, reject) => {
    await locationsService.crud.index('apiRoutes.qlocations.cities', params)
      .then(response => {
        commit('SET_CITIES', response.data)
        resolve(true)
      })
      .catch(error=>{
        reject(error)
      })
  })
}

export const GET_PROVINCES = ({ commit, state, dispatch }, params = {}) => {
  return new Promise(async (resolve, reject) => {
    await locationsService.crud.index('apiRoutes.qlocations.provinces', params)
      .then(response => {
        commit('SET_PROVINCES', response.data)
        resolve(true)
      })
      .catch(error=>{
        reject(error)
      })
  })
}
