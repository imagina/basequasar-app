import axios from 'axios'
import store from 'src/store/index'
import config from 'src/config/index'
import {alert} from '@imagina/qhelper/_plugins/alert'
import router from 'src/router/index'

//Add default params, user Data
axios.defaults.params = {
  setting :{
    departmentId : store.state.app.departmentId,
    roleId : store.state.app.roleId
  }
}

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response) {
    let status = error.response.status;
    switch (status) {
      case 400://When register already exist
        //alert.error(error.response.data.errors, 'bottom')
        break;
      case 401:
        let currentRoute = router.currentRoute.name
        //Logout
        if((currentRoute != 'auth.login') && (currentRoute != 'auth.change.password'))
          router.push({name:'auth.logout'})
        break;
      case 403:
        alert.error('Does not have the necessary permissions.', 'bottom-left');
        break;
      case 404:
        alert.error('The requested content was not found', 'bottom-left');
        break;
      case 500:
        //alert.error('Internal Server Error', 'bottom-left');
        break;
      case 502:
        alert.error('Bad Gateway', 'bottom-left');
        break;
      case 504:
        alert.error('Gateway Time Out', 'bottom-left')
        break;
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    //alert.error('Connection Error: ' + error.message, 'bottom-left');
  }
  return Promise.reject(error);//Return response error
});

export default ({Vue}) => {
  Vue.prototype.$axios = axios
}
