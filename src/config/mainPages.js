import appConfig from 'src/setup/app'

export default {
  //Home Page
  home: {
    permission: null,
    activated: true,
    path: '/',
    name: 'app.home',
    layout: () => import('layouts/master.vue'),
    page: (appConfig.mode == 'iadmin') ? () => import('src/pages/adminHome.vue') :
      () => import('src/pages/panelHome.vue'),
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fal fa-home',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
  //Not authorize
  notAuthorized: {
    permission: null,
    activated: true,
    path: '/not-authorized',
    name: 'app.not.authorized',
    layout: () => import('layouts/blank'),
    page: () => import('src/pages/notAuthorized'),
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fas fa-home',
    authenticated: true,
  },
  //test PAge
  testPage: {
    permission: null,
    activated: true,
    path: '/test-page',
    name: 'app.test.page',
    layout: () => import('layouts/master'),
    page: () => import('src/pages/testPage'),
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fal fa-flask',
    authenticated: true,
  },
  //Dynamic Fields Page
  dynamicFieldsPage: {
    permission: null,
    activated: true,
    path: '/dynamic-fields',
    name: 'app.dynamic.fields.page',
    layout: () => import('layouts/master'),
    page: () => import('src/pages/dynamicFieldPage'),
    title: 'isite.cms.sidebar.pageHome',
    icon: 'fas fa-flask',
    authenticated: true,
  },
  //Page to update cache
  updateApp: {
    permission: null,
    activated: true,
    path: '/update-app',
    name: 'app.update.app',
    layout: () => import('layouts/blank'),
    page: () => import('src/pages/updateApp'),
    title: 'sidebar.updateApp',
    icon: 'fas fa-flask',
    authenticated: false,
  },
}
