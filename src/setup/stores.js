class AutoLoadStore {
  constructor() {
    this.stores = {}
    this.appConfig = require('src/setup/app').default
    this.loadDefaultStore()
    this.loadModulesStore()
  }

  //Load default stores
  loadDefaultStore() {
    //this.stores.app = require('@imagina/qsite/_store/app').default
  }

  //Load modules store
  loadModulesStore() {
    this.appConfig.modules.forEach(moduleName => {
      let storeModule = false

      //Search module in project
      try {
        storeModule = require(`src/modules/${moduleName}/_store/index`).default
      } catch (e) {
      }

      //Load stores
      if (storeModule)
        for (var storeName in storeModule) {
          let keyName = moduleName + (storeName.charAt(0).toUpperCase() + storeName.slice(1))
          this.stores[keyName] = storeModule[storeName]
        }
    })
  }
}

//create class
const autoLoadStore = new AutoLoadStore()

export default autoLoadStore.stores
