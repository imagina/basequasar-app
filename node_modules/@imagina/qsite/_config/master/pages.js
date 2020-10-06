import appConfig from 'src/config/app'

class AutoLoadPages {
  constructor() {
    this.pages = {}
    this.modules = appConfig.modules
    this.updatePages = []
    //Load backend pages
    if (appConfig.isBackend || appConfig.loadBackendPages) this.loadPages({name: 'backendPages'})
    //Load frontend pages
    if (!appConfig.isBackend) this.loadPages({prefix: 'front', name: 'frontendPages'})
    //Add default pages
    this.addDefaultPages()
    //Update pages
    this.loadUpdatePages()
  }

  //Add default pages
  addDefaultPages() {
    //Add page home when it's backend
    if (appConfig.isBackend) {
      this.pages.app = {
        home: {//Page home
          permission: null,
          activated: true,
          path: '/',
          name: 'app.home',
          layout: () => import('@imagina/qsite/_layouts/master.vue'),
          page: () => import('@imagina/qsite/_pages/master/index.vue'),
          title: 'sidebar.pageHome',
          icon: 'fas fa-home',
          authenticated: appConfig.isBackend
        }
      }
    }
  }

  //Load modules backend page
  loadPages(params = {}) {
    this.modules.forEach(moduleName => {
      let configPage = false
      let namePage = `${params.prefix || ''}${moduleName}`

      //Search module in node_modules
      try {
        configPage = require(`@imagina/${moduleName}/_config/${params.name}`)
      } catch (e) {
      }

      //Search module in project (src)
      try {
        configPage = require(`src/modules/${moduleName}/_config/${params.name}`)
      } catch (e) {
      }

      if (configPage) this.pages[namePage] = configPage.default//Add pages
      if (configPage.updatePages) this.updatePages.push(configPage.updatePages)//Add method to updated pages
    })
  }

  //Load changes in pages
  loadUpdatePages() {
    this.updatePages.forEach(updatedPages => {
      this.pages = updatedPages(this.pages)
    })
  }
}

//Create new class
const autoLoadPages = new AutoLoadPages()

//Response
export default autoLoadPages.pages
