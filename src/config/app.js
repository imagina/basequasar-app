export default {
  version: '0.0.1',
  modules: {
    apiRoutes: {//All api routes
      api: require('src/config/apiRoutes/api').default,
      app: require('src/config/apiRoutes/application').default,
      site: require('@imagina/qsite/_config/site').default,
      profile: require('@imagina/quser/_config/profile').default,
    },
    pages: {//All Pages
      users: require('@imagina/quser/_config/pages').default,
      media: require('@imagina/qmedia/_config/pages').default,
      site: require('@imagina/qsite/_config/pages').default,
      application: require('src/config/pages/application').default, //<-----Always last
    },
    store: {//All Store's
      app: require('src/store/app/index').default,
      auth: require('@imagina/quser/_store/index').default,
      site: require('@imagina/qsite/_store/index').default,
    }
  },
  storageKeysToSave: [
    'userToken',
    'userId',
    'userData',
    'offlineRequests',
    'notifications',
    'auth.department.id',
    'auth.role.id'
  ]
}