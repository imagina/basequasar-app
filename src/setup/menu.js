import ArrayMethods from 'src/plugins/array'

class AutoLoadSidebars {
  getMenu(menuItems, pages) {
    const menu = []
    if (menuItems && pages) {
      menuItems.map((menuItem) => {
        //Search menu item page
        let itemPage = pages.find(({id}) => id == menuItem.pageId)
        //Add menuItem to response
        menu.push({
          id: menuItem.id,
          parentId: menuItem.parentId,
          title: menuItem.title,
          icon: menuItem.icon,
          name: itemPage ? itemPage.options.name : null,
          permission: itemPage ? itemPage.options.permission : null,
          activated: !parseInt(menuItem.status) ? false : (itemPage ? itemPage.status : true)
        })
      });
      //Response
      return ArrayMethods.builTree(menu)
    }
  }
}

//Create Class
const autoLoadSidebar = new AutoLoadSidebars()
//Default export
export default autoLoadSidebar
