import axios from 'axios'

export default function ({app, router, store, Vue, ssrContext}) {
  //=========== Set base url to axios
  let tagsToParceHost = ['http://', 'https://', ':8080', ':3000', 'www.']
  //Get base url
  let rootHost = env('BASE_URL') || (ssrContext ? ssrContext.req.get('host') : window.location.host)
  let host = rootHost
  //Parse host if not exist in .env
  if (!env('BASE_URL')) {
    tagsToParceHost.forEach(tagToReplace => host = host.replace(tagToReplace, ''))
    if (env('SET_PREFIX_HOST')) host = `${env('SET_PREFIX_HOST')}.${host}`//Add prefix to baseURl
    if (rootHost.indexOf('www') != -1) host = `www.${host}`//Set again WWW
    host = env('NO_HTTPS') ? `http://${host}` : `https://${host}` //Define protocol
  }

  store.commit('qsiteApp/SET_BASE_URL', host) //Set base Url in store
  store.commit('qsiteApp/SET_ORIGIN_URL', (ssrContext ? ssrContext.req.get('origin') : window.location.origin)) //Set origin Url in store
  axios.defaults.baseURL = `${host}/api`// Set base url in axios
  console.log(`[AXIOS] Registered Host: ${host}`)

  //========== Set default params: setting
  axios.defaults.params = {setting: {}}

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

  //============ Set ignore SSL
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  //axios.defaults.httpsAgent = new https.Agent({rejectUnauthorized: false})

  //============= Set as global
  Vue.prototype.$axios = axios
}
