export default {
  version: '1.0.2',
  isBackend : true, //Define if project is to admin
  //UI Languages
  languages : {
    default : 'es',
    availables : ['en-us', 'es']
  },
  //Modules
  modules : [
    'qhelper',
    'qcrud',
    'quser',
    'qblog',
    'qcommerce',
    'qplace',
    //'qmenu',
    'qmedia',
    'qslider',
    'qsite'
  ],
  //Cache
  saveCache : {
    refresh : [
      'sessionData',
      'auth.department.id',
      'auth.role.id',
      'site.default.locale',
      'impersonatorData'
    ],
    logout : [
      'offlineRequests',
      'site.default.locale',
    ]
  },
  //Reset Store
  resetStores : [
    'quserAuth/RESET'
  ]
}
