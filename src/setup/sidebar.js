import appConfig from 'src/setup/app';
import pagesConfig from 'src/setup/pages';

class AutoLoadSidebar {
  constructor() {
    this.sidebar = {};
    this.modules = appConfig.modules;
    this.pages = pagesConfig;
    this.addDefaultItems();
    //Load iadmin sidebar
    if (appConfig.mode == 'iadmin') this.loadModulesSidebar({ name: 'adminSidebar' });
    //Load ipanel sidebar
    if (appConfig.mode == 'ipanel') this.loadModulesSidebar({ name: 'panelSidebar' });
    //order sidebar
    this.orderSidebar();
  }

  //Add extra fields to sidebar
  addDefaultItems() {
    if (this.pages.mainapp)
      this.sidebar['app'] = this.pages.mainapp.home || {};
  }

  //Load node_modules sidebar
  loadModulesSidebar(params = {}) {
    this.modules.forEach((name) => {
      let sidebarNode = false;

      //Search module in project
      try {
        sidebarNode = require(`src/modules/${name}/_config/${params.name}`).default;
      } catch (e) {
      }

      if (sidebarNode && sidebarNode.length) {
        sidebarNode.forEach((node, index) => {
          this.sidebar[`${name}${index ? (index + 1) : ''}`] = node;
        });
      }
    });

    //Set root Pages
    let sidebarRoot = false;

    //Search module in project
    try {
      sidebarRoot = require(`src/config/${params.name}`).default;
    } catch (e) {
    }

    if (sidebarRoot && sidebarRoot.length) {
      sidebarRoot.forEach((node, index) => {
        this.sidebar[`${name}${index ? (index + 1) : ''}`] = node;
      });
    }
  }

  //Order sidebar
  orderSidebar() {
    //instance counters
    let multipleSidebar = {};
    let singleSidebar = {};

    //Group sidebar by type
    Object.keys(this.sidebar).forEach(name => {
      let sidebar = this.sidebar[name];
      if ((sidebar.name == 'app.home') || sidebar.children) multipleSidebar[name] = sidebar;
      else singleSidebar[name] = sidebar;
    });

    //Assign response
    this.sidebar = { ...multipleSidebar, ...singleSidebar };
  }
}


//Create Class
const autoLoadSidebar = new AutoLoadSidebar();
const customSidebar = autoLoadSidebar.sidebar;

//Custom export
export { customSidebar };

//Default export
export default Object.values(autoLoadSidebar.sidebar);
