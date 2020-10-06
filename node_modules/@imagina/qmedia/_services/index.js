import crud from '@imagina/qcrud/_services/baseService'
import http from "axios/index";
import remember from "@imagina/qhelper/_plugins/remember"
import config from '@imagina/qsite/_config/master/index'

export default {
  crud,
  breadcrumb(configName, criteria, params){
    return new Promise((resolve, reject) => {
      //Validations
      if (!configName) return reject('Config name is required')
      if (!criteria) return reject('Criteria is required')
      params.refresh == undefined ? params.refresh = false : true

      let urlApi = config(configName) + '/' + criteria//Get url from config
      let requestParams = (params && params.params) ? params.params : false//Get request params

      if (params && params.remember) {//Remember request
        let key = !requestParams ? configName : configName + JSON.stringify(requestParams)//Key for rememeber
        remember.async(//Call method remember
          key, (3600 * 3),
          () => {
            return http.get(urlApi, {params: requestParams})
          },params.refresh
        ).then(response => {
          resolve(response)//Successful response
        }).catch(error => {
          reject(error)//Failed response
        })
      } else {//Request without remember
        http.get(urlApi, {params: requestParams}).then(response => {
          resolve(response)//Successful response
        }).catch(error => {
          reject(error.response.data.errors)//Failed Response
        })
      }
    })
  },
  postRequest(configName, data) {

    return new Promise((resolve, reject) => {
      //Validations
      if (!configName) return reject('Config name is required')
      if (!data) return reject('Data is required')
      let urlApi = config(configName)//Get url from config
      //Request
      http.post(urlApi, data).then(response => {
        resolve(response.data)//Successful response
      }).catch(error => {
        reject(error.response.data.errors)//Failed response
      })
    })
  },

  editItem(configName, criteria, data) {

    return new Promise((resolve, reject) => {
      //Validations
      if (!configName) return reject('Config name is required')
      if (!data) return reject('Data is required')
      let urlApi = config(configName) + '/' + criteria//Get url from config
      //Request
      http.post(urlApi, data).then(response => {
        resolve(response.data)//Successful response
      }).catch(error => {
        reject(error.response.data.errors)//Failed response
      })
    })
  },

  createItem(configName, criteria, data) {

    return new Promise((resolve, reject) => {
      //Validations
      if (!configName) return reject('Config name is required')
      if (!data) return reject('Data is required')
      let urlApi = config(configName) + '/' + criteria//Get url from config
      //Request
      http.put(urlApi, data).then(response => {
        resolve(response.data)//Successful response
      }).catch(error => {
        reject(error.response.data.errors)//Failed response
      })
    })
  },

  folderList(configName) {

    return new Promise((resolve, reject) => {
      //Validations
      if (!configName) return reject('Config name is required')
      let urlApi = config(configName)//Get url from config
      //Request
      http.get(urlApi).then(response => {
        resolve(response.data)//Successful response
      }).catch(error => {
        reject(error.response.data.errors)//Failed response
      })
    })
  },
}
