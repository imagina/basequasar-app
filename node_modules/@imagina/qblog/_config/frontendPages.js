export default {
  index: {
    permission: null,
    activated: true,
    path: '/categoria/categoria/:category',
    name: 'qblog.index',
    page: () => import('@imagina/qblog/_pages/frontend/index'),
    layout: () => import('src/layouts/master.vue'),
    title: 'Posts',
    icon: 'fas fa-newspaper'
  },
  show: {
    permission: null,
    activated: true,
    path: '/articulo/:category/:slugPost',
    name: 'qblog.show',
    page: () => import('@imagina/qblog/_pages/frontend/show'),
    layout: () => import('src/layouts/master.vue'),
    title: 'Categories',
    icon: 'fas fa-layer-group',
  },
}
