const appConfig = config('app')

class AutoLoadSidebar {
  constructor() {
    this.sidebar = {}
    this.modules = config('app.modules')
    this.pages = config('pages')
    this.addDefaultItems()
    this.loadModulesSidebar()
  }

  //Add extra fields to sidebar
  addDefaultItems() {
    if (this.pages.app)
      this.sidebar['app'] = this.pages.app.home || {}
  }


  //Load node_modules sidebar
  loadModulesSidebar() {
    this.modules.forEach((name) => {
      let sidebarNode = false
      //Search module in node_modules
      try {
        sidebarNode = require(`@imagina/${name}/_config/sidebar`).default
      } catch (e) {
      }

      //Search module in project
      try {
        sidebarNode = require(`src/modules/${name}/_config/sidebar`).default
      } catch (e) {
      }

      if (sidebarNode && sidebarNode.length) {
        sidebarNode.forEach((node, index) => {
          this.sidebar[`${name}${index ? (index + 1) : ''}`] = node
        })
      }
    })
  }
}


//Create Class
const autoLoadSidebar = new AutoLoadSidebar()
const customSidebar = autoLoadSidebar.sidebar

//Custom export
export {customSidebar}

//Default export
export default Object.values(autoLoadSidebar.sidebar)
