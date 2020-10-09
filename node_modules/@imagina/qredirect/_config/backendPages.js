export default {
  redirects: {
    permission: 'iredirect.redirects.manage',
    activated: true,
    authenticated: true,
    path: '/redirect/redirects/index',
    name: 'qredirect.admin.redirects',
    page: () => import('@imagina/qredirect/_pages/admin/redirects/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qredirect.sidebar.adminRedirects',
    icon: 'fas fa-random',
    subHeader: {
      refresh: true,
    }
  }
}
