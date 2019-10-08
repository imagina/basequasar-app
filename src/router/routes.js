import Route from 'vue-routisan'
//Create all routes from pages
const pages = config('pages')//Get pages from config

//Redirect
Route.redirect('/', pages.app.home.path);

for (var nameGroupPage in pages) {
  let groupPages = pages[nameGroupPage]//Get group pages
  //Loop group pages
  if (Object.keys(groupPages).length) {
    for (var namePage in groupPages) {
      let page = groupPages[namePage]//Get page
      let middlewares = (page.middleware ? page.middleware : [])

      if (page.activated) {//Check if page is activated
        //Create Route
        Route.view(page.path, page.layout)
          .children(() => {
            Route.view('/', page.page).options({
              name: page.name,
              meta: {
                permission: (page.permission ? page.permission : null),
                title : page.title,
                icon : page.icon,
                authenticated : page.authenticated
              },
              beforeEnter: middlewares,
            });
          })
      }
    }
  }
}

export default Route.all()
