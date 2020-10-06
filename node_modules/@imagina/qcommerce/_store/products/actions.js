//plugins
import crud from '@imagina/qcrud/_services/baseService'


//Get product and set as current product
export function GET_PRODUCT({commit, state}, params) {
  return new Promise((resolve, reject) => {
    if (!params.slug) return reject('Slug is required')
    let products = Object.assign({}, state.products)

    let defaultParams = {filter: {field: 'slug'}}
    let paramsRequest = {refresh: true, params: {...defaultParams, ...params.params || {}}}

    crud.show('apiRoutes.qcommerce.products', params.slug, paramsRequest).then(response => {
      if (response.data) products[params.slug] = response.data
      commit('SET_PRODUCT', products)
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

//Get product and set as current product
export function GET_CATEGORY({commit, state}, params) {
  return new Promise((resolve, reject) => {
    if (!params.slug) return reject('Slug is required')
    let categories = Object.assign({}, state.categories)

    let defaultParams = {filter: {field: 'slug'}}
    let paramsRequest = {refresh: true, params: {...defaultParams, ...params.params || {}}}

    crud.show('apiRoutes.qcommerce.categories', params.slug, paramsRequest).then(response => {
      if (response.data) categories[params.slug] = response.data
      commit('SET_CATEGORY', categories)
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}
