import crud from '@imagina/qcrud/_services/baseService'
import http from "axios/index";
import config from '@imagina/qsite/_config/master/index'

export default {
  crud,
  updateOrCreate(configName, data){
    return new Promise((resolve, reject) => {
      //Validations
      if (!configName) return reject('Config name is required')
      if (!data) return reject('Data is required')
      let urlApi = config(configName)//Get url from config
      //Request
      http.post(urlApi, {attributes:data}).then(response => {
        resolve(response.data)//Successful response
      }).catch(error => {
        reject(error.response.data.errors)//Failed response
      })
    })
  }
}
