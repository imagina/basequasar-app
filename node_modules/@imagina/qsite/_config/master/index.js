import {findValue} from '@imagina/qsite/_plugins'

export default function (value = '', fallback = null) {
  //Import configs
  let app = require('src/config/app').default
  let apiRoutes = require('src/config/apiRoutes').default
  let pages = require('src/config/pages').default
  let sidebar = require('src/config/sidebar').default
  let routes = require('@imagina/qsite/_config/master/routes').default
  let stores = require('@imagina/qsite/_config/master/stores').default

  //Create constante
  const values = {
    app,
    apiRoutes,
    pages: orderPages(pages),
    sidebar,
    routes,
    stores
  }

  return findValue(value, values) || fallback
}

//Order pages
function orderPages(pages) {
  //=== Set app pages in last position
  let appPages = pages.app || {}
  delete pages.app
  pages.app = appPages

  return pages
}
