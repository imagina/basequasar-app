import axios from 'axios'
import store from 'src/store/index'
import {alert} from '@imagina/qhelper/_plugins/alert'
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if(error.response){
    let status = error.response.status

    switch (status) {
      case 401:
        store.dispatch("auth/AUTH_CLEAR")
        break
      case 403:
        alert.error('Does not have the necessary permits')
        break
      case 403:
        alert.error('The requested content was not found')
        break
      case 500:
        alert.error('Internal Server Error')
        break
      case 502:
        alert.error('Bad Gateway')
        break
      case 504:
        alert.error('Gateway Time Out')
        break
      default:
        return Promise.reject(error);
        break
    }
  }else{
    store.dispatch("auth/AUTH_CLEAR")
  }
});

export default ({Vue}) => {
  Vue.prototype.$axios = axios
}
