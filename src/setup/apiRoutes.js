import appConfig from 'src/setup/app'

class AutoLoadApiRoutes {
  constructor() {
    this.routes = {}
    this.modules = appConfig.modules
    this.loadModuleApiRoutes()
  }

  //Load Module apiRoutes
  loadModuleApiRoutes() {
    if (appConfig && appConfig.modules) {
      this.modules.forEach(name => {
        let moduleApiRoutes = false

        //Search module in project
        try {
          moduleApiRoutes = require(`src/modules/${name}/_config/apiRoutes`).default
        } catch (e) {
        }

        //Add api Routes
        this.routes[name] = moduleApiRoutes || {}
      })
    }
  }
}

//Define new class
const apiRoutes = new AutoLoadApiRoutes()

//response
export default apiRoutes.routes
