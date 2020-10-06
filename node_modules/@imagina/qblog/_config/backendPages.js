export default {
  posts: {
    permission: 'iblog.posts.manage',
    activated: true,
    authenticated: true,
    path: '/blog/posts/index',
    name: 'qblog.admin.posts',
    page: () => import('@imagina/qblog/_pages/admin/posts/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qblog.sidebar.adminPosts',
    icon: 'fas fa-newspaper',
    subHeader: {
      refresh: true,
    }
  },
  categories: {
    permission: 'iblog.categories.manage',
    activated: true,
    authenticated: true,
    path: '/blog/categories/index',
    name: 'qblog.admin.categories',
    page: () => import('@imagina/qblog/_pages/admin/categories/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qblog.sidebar.adminCategories',
    icon: 'fas fa-layer-group',
    subHeader: {
      refresh: true,
    }
  },

}
