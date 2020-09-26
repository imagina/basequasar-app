export default {
  // Notifications List
  notifications: {
    permission: null,
    activated: true,
    path: '/notifications',
    name: 'qnotification.admin.notifications.index',
    page: () => import('@imagina/qnotification/_layouts/admin/notifications/index'),
    layout: () => import('@imagina/qsite/_layouts/master'),
    title: 'qnotification.sidebar.adminNotifications',
    icon: 'notifications',
    authenticated : true
  },
  // Notifications List
  providers: {
    permission: null,
    activated: true,
    path: '/notifications/providers',
    name: 'qnotification.admin.notifications.providers',
    layout: () => import('@imagina/qsite/_layouts/master'),
    page: () => import('@imagina/qnotification/_pages/admin/providers/index'),
    title: 'qnotification.sidebar.adminProviders',
    icon: 'fab fa-stack-exchange',
    authenticated : true
  },
}
