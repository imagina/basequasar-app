export default {
  //Home Page
  index: {
    permission: 'media.medias.index',
    activated: true,
    path: '/media/index',
    name: 'app.media.index',
    page: () => import('@imagina/qmedia/_pages/admin/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qmedia.sidebar.adminIndex',
    icon: 'fas fa-camera-retro',
    authenticated: true,
  },
  //Home Page
  selectMediackEditor: {
    permission: 'media.medias.index',
    activated: true,
    path: '/media/select',
    name: 'app.media.select',
    page: () => import('@imagina/qmedia/_pages/admin/selectCkEditor'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
    title: 'qmedia.sidebar.adminIndex',
    icon: 'fas fa-camera-retro',
    authenticated: true,
  },
}
