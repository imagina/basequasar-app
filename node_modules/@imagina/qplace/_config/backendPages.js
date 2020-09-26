export default {
  places: {
    permission: 'iplaces.places.manage',
    activated: true,
    path: '/iplaces/places/index',
    name: 'qplace.admin.places.index',
    page: () => import('@imagina/qplace/_pages/admin/places/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplace.sidebar.adminPlaces',
    icon: 'fas fa-map-marked-alt',
    authenticated: true,
  },

  placesCreate: {
    permission: 'iplaces.places.create',
    activated: true,
    path: '/iplaces/places/create',
    name: 'qplace.admin.places.create',
    page: () => import('@imagina/qplace/_pages/admin/places/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplace.sidebar.adminPlacesCreate',
    icon: 'fas fa-map-marked-alt',
    authenticated: true,
  },

  placesUpdate: {
    permission: 'iplaces.places.edit',
    activated: true,
    path: '/iplaces/places/:id',
    name: 'qplace.admin.places.edit',
    page: () => import('@imagina/qplace/_pages/admin/places/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplace.sidebar.adminPlacesUpdate',
    icon: 'fas fa-map-marked-alt',
    authenticated: true,
  },

  categories: {
    permission: 'iplaces.categories.manage',
    activated: true,
    path: '/iplaces/categories/index',
    name: 'qplace.admin.categories',
    page: () => import('@imagina/qplace/_pages/admin/categories/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplace.sidebar.adminCategories',
    icon: 'fas fa-layer-group',
    authenticated: true,
  }
}
