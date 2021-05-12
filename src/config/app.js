import coreApp from '@imagina/qsite/_config/master/application/app'

export default {
  ...coreApp,
  //version: '2.3.29', //Version
  baseUrl: 'https://michael.modulos.imaginacolombia.com',//Define base url
  //mode: 'iadmin', //Define load mode
  //forceRoleAndDepartment : false,//Force to select role and department
  //UI Languages
  /*languages : {
    default : 'es',
    availables : ['en-us','es']
  },*/
  //Modules
  //modules : [],
  //Cache
  /*saveCache : {
    refresh : [
      'sessionData',
      'auth.department.id',
      'auth.role.id',
      'site.default.locale',
      'impersonatorData',
      'app.state.extra',
      'app.state.filters'
    ],
    logout : [
      'offlineRequests',
      'site.default.locale',
    ]
  },*/
  //Reset Store
  /*resetStores : [
    'quserAuth/RESET'
  ]*/
}
