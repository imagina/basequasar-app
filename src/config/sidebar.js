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

export default [
  pages.application.home,//Home
]
