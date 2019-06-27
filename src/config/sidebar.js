const pages = config('pages') // Get Pages from config
const appConfig = config('app')

//Autoload sidebars of modules
//Not edit
let localSidebar = []//Response

if (appConfig.isBackend) {
  let modules = appConfig.modules
  modules.forEach((name) => {
    try {
      let moduleSidebar = require(`@imagina/${name}/_config/sidebar`).default
      if (moduleSidebar && moduleSidebar[0]) {
        localSidebar = localSidebar.concat(moduleSidebar)
      }
    } catch (e) {
    }
  })
}


//Add extra items to sidebar
/*Example group item. April 04, 2019
{
	title: "title",
	icon: "fas fa-icon",
	children: [
    pages.groupPage.pageName, //Single Item in group items
    {//Sub group into group pages
      title: 'title',
      icon: 'fas fa-icon',
      children: [
        pages.groupPage.pageName, //Single Item in group items
      ]
    },
  ]
}
*/

//Add items tu sidebar
let sidebar = [
  pages.app.home,//Home
]

//Return merge between local sidebar and sidebar of qMenu
export default sidebar.concat(localSidebar)
