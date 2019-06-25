import indexSidebar from '@imagina/qmenu/_config/sidebar/index'//Side bar of qMenu
const pages = config('pages') // Get Pages from config

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
export default sidebar.concat(indexSidebar)
