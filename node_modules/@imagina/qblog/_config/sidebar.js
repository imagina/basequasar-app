const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'qblog.sidebar.adminGroup',
    icon: 'fab fa-blogger',
    children: [
      pages.qblog.posts, // posts setup
      pages.qblog.categories, // categories setup
    ]
  },
]
