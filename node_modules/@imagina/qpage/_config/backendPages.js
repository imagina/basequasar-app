export default {
  pages: {
    permission: 'pages.pages.manage',
    activated: true,
    authenticated: true,
    path: '/page/pages/index',
    name: 'qpage.admin.pages',
    page: () => import('@imagina/qpage/_pages/admin/pages/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qpage.sidebar.adminPages',
    icon: 'fas fa-columns',
    subHeader: {
      refresh: true,
    }
  }
}
