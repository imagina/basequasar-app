export default {
  home: {//Page home
    permission: null,
    activated: true,
    path: '/',
    name: 'app.home',
    layout: () => import('src/layouts/master.vue'),
    page: () => import('src/modules/app/_pages/frontend/index'),
    title: 'app.sidebar.pageHome',
    icon: 'fas fa-home',
    authenticated: false
  }
}
