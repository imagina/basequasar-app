import appConfig from 'src/setup/app'

class AutoLoadMainConfig {
  constructor() {
    this.mainConfigs = {}
    this.modules = appConfig.modules
    this.loadModuleMainConfig()
  }

  //Load Module main config
  loadModuleMainConfig() {
    if (appConfig && appConfig.modules) {
      this.modules.forEach(name => {
        let moduleMainConfig = false

        //Search module in project
        try {
          moduleMainConfig = require(`src/modules/${name}/_config/main`).default
        } catch (e) {
        }

        //Add api Routes
        this.mainConfigs[name] = moduleMainConfig || {}
      })
    }
  }
}

//Define new class
const mainConfigs = new AutoLoadMainConfig()

//response
export default mainConfigs.mainConfigs
