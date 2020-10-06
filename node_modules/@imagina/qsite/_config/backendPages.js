export default {
  //Home Page
  index: {
    permission: 'isite.settings.manage',
    activated: true,
    path: '/site/index',
    name: 'app.site.index',
    page: () => import('@imagina/qsite/_pages/admin/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qsite.sidebar.adminIndex',
    icon: 'fas fa-cog',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
}
