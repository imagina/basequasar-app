const pages = config('pages') // Get Pages from config

//Forms
export default [
  {
    title: 'qform.sidebar.adminGroup',
    icon: 'fas fa-clipboard-list',
    children: [
      pages.qform.forms,
      pages.qform.leads,
    ]
  },
]
