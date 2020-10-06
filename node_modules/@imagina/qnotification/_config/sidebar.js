const pages = config('pages') // Get Pages from config

export default [
  {
    title: 'qnotification.sidebar.adminGroup',
    icon: 'fas fa-bell',
    children: [
      pages.qnotification.providers
    ]
  },
]
