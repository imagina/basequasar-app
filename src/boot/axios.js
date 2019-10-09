import axios from 'axios'
import alert from '@imagina/qhelper/_plugins/alert'

export default function ({ app, router, store, Vue, ssrContext }) {
  //=========== Set base url to axios
  //if not exist url in .env, set host as base url
  let host = env('BASE_URL') || (ssrContext ? ssrContext.req.get('host') : window.location.host)
  host = host.replace('http://', '').replace('https://', '')//Parse host
  axios.defaults.baseURL = `https://${host}/api`// Set base url

  //========== Set default params: setting
  axios.defaults.params = { setting: {} }

  //========== Response interceptor
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response) {
      let status = error.response.status;
      switch (status) {
        case 401:
          let routeName = router.currentRoute.name
          //Logout
          if ((routeName != 'auth.login') && (routeName != 'auth.change.password'))
            router.push({name: 'auth.logout'})
          break;
      }
    }
    return Promise.reject(error);//Return response error
  })

  //============= Set as global
  Vue.prototype.$axios = axios
}
