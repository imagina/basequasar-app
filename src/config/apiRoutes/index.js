import appConfig from 'src/config/app'

//Auto load api routes from modules available in: src/config/app.js "modules"
//Not edit
let apiRoutes = {}
if(appConfig && appConfig.modulesDev){
  const modules = appConfig.modulesDev

  modules.forEach(name => {
    try {
      let routes = require(`@imagina/${name}/_config/apiRoutes`).default
      apiRoutes[name] = routes
    }catch (e) {}
  })
}

//Add extra apiRoutes
//#example: apiRoutes.<name> = require('path-api-route').default

export default apiRoutes
