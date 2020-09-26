import alert from '@imagina/qhelper/_plugins/alert';
import {helper} from '@imagina/qhelper/_plugins/helper';
import axios from 'axios';
import config from '@imagina/qsite/_config/master/index'
import eCommerceService from '@imagina/qcommerce/_services/index'
import store from 'src/store/index'
import {remember} from "@imagina/qhelper/_plugins/remember";

export const GET_CART = ({commit, state, dispatch}, refresh = false) => {
  return new Promise(async (resolve, reject) => {
    let cartId = state.cartId
    let cart = await helper.storage.get.item('apiRoutes.qcommerce.cart')
    if (cart)
      cartId = cart.data.id

    if (cartId) {
      let params = {
        refresh: refresh,
        remember: true
      }
      eCommerceService.crud.show('apiRoutes.qcommerce.cart', cartId, params).then(response => {
        commit('SET_CART', response.data)
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    } else {
      resolve(true)
    }
  })
}

export const SET_PRODUCT_INTO_CART = ({commit, state, dispatch}, product) => {
  return new Promise(async (resolve, reject) => {
    let cartId = state.cartId

    if (!cartId) {
      let data = {
        total: 0,
        status: 1,
      }
      if (store.state.auth.userId) {
        data.userId = store.state.quserAuth.userId
      }
      let response = await eCommerceService.crud.create('apiRoutes.qcommerce.cart', data);
      commit('SET_CART', response.data)
    }
    product.cartId = state.cartId
    eCommerceService.crud.create('apiRoutes.qcommerce.cartProducts', product).then(async response => {
      await dispatch('GET_CART', true)
      alert.success({message : "Producto Añadido Exitosamente"})
      resolve(true)
    }).catch(error => {
      alert.error({message : "Ha ocurrido un error al añadir el producto", pos : 'bottom'})
      reject(error)
    })
  })
}

export const UPDATE_PRODUCT_INTO_CART = ({commit, state, dispatch}, item) => {
  return new Promise(async (resolve, reject) => {
    let cartId = state.cartId

    if (cartId) {
      item.cartId = cartId
      eCommerceService.crud.update('apiRoutes.qcommerce.cartProducts', item.id, item).then(response => {
        dispatch('GET_CART', true)
        alert.success({message : "Producto Actualizado Exitosamente"})
        resolve(true)
      }).catch(error => {
        alert.error({message : "Ha ocurrido un error al actualizar el producto", pos : 'bottom'})
        reject(error)
      })
    }
  })
}

export const DEL_PRODUCT_FROM_CART = ({commit, state, dispatch}, itemId) => {
  return new Promise(async (resolve, reject) => {
    let cartId = state.cartId
    if (cartId) {
      eCommerceService.crud.delete('apiRoutes.qcommerce.cartProducts', itemId).then(response => {
        dispatch('GET_CART', true)
        alert.success({message : "Producto Borrado Exitosamente"})
        resolve(true)
      }).catch(error => {
        alert.error({message : "Ha ocurrido un error al borrar el producto", pos : 'bottom'})
        reject(error)
      })
    } else {
      alert.error({message : "Ha ocurrido un error al borrar el producto", pos : 'bottom'})
      reject(error)
    }
  })
}

export const SELECT_PAYMENT_METHOD = ({commit, state, dispatch}, itemId) => {
  return new Promise(async (resolve, reject) => {
    commit('SET_PAYMENT_METHOD', response.data)
  })
}

export const ADD_USER_TO_CART = ({commit, state, dispatch}) => {
  return new Promise(async (resolve, reject) => {
    let cartId = state.cartId
    let cart = await helper.storage.get.item('apiRoutes.qcommerce.cart')
    if (cart)
      cartId = cart.data.id

    if (cartId) {
      let params = {
        user_id: store.state.quserAuth.userId
      }
      eCommerceService.crud.update('apiRoutes.qcommerce.cart', cartId, params).then(response => {
        commit('SET_CART', response.data)
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    } else {
      resolve(true)
    }
  })
}

export const CLEAR_CART = ({commit, state, dispatch}, product) => {
  return new Promise(async (resolve, reject) => {
    await commit('CLEAR_CART')//Clear Store
    helper.storage.remove('apiRoutes.qcommerce.cart')//Claer Cache
  })
}
