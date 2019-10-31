import appConfig from 'src/config/app'

let pages = {
  //Home Page
  home: {
    permission: null,
    activated: true,
    path: '/home',
    name: 'app.home',
    layout: () => import('src/layouts/master'),
    page: () => import('pages/master/index.vue'),
    title: 'sidebar.pageHome',
    icon: 'fas fa-home',
    authenticated : appConfig.isBackend
  }
}

//Add pages "not found" only when it isn't SSR mode. Always leave this as last one
if (process.env.MODE !== 'ssr') {
  pages.notFound = {
    permission: null,
    activated: true,
    path: '*',
    name: 'app.not.found',
    layout: () => import('src/layouts/blank'),
    page: () => import('src/pages/master/404'),
    title: 'sidebar.pageNotFound',
    icon: 'fas fa-chart-bar'
  }
}

//Export pages
export default pages
