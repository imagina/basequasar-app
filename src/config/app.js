export default {
  version: '0.0.1',
  registerUsers : true,//Permit register users
  modules: {
    apiRoutes: {//All api routes
      api: require('src/config/apiRoutes/api').default,
      app: require('src/config/apiRoutes/application').default,
      site: require('@imagina/qsite/_config/site').default,
      profile: require('@imagina/quser/_config/profile').default,
      blog: require('@imagina/qblog/_config/blog').default,
      slider: require('@imagina/qslider/_config/slider').default,
    },
    pages: {//All Pages
      users: require('@imagina/quser/_config/pages').default,
      media: require('@imagina/qmedia/_config/pages').default,
      site: require('@imagina/qsite/_config/pages').default,
      blog : require('@imagina/qblog/_config/pages').default,
      slider : require('@imagina/qslider/_config/pages').default,
      application: require('src/config/pages/application').default, //<-----Always last
    },
    store: {//All Store's
      app: require('src/store/app/index').default,
      auth: require('@imagina/quser/_store/index').default,
      site: require('@imagina/qsite/_store/index').default,
      blog: require('@imagina/qblog/_store/index').default,
    }
  },
  saveStorage : {
    refresh : [
      'userToken',
      'userId',
      'userData',
      'offlineRequests',
      'notifications',
      'auth.department.id',
      'auth.role.id',
      'redirect.to.from.login',
      'dataAddress'
    ],
    logout : [
      'offlineRequests',
    ]
  }
}
