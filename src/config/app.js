import coreApp from '@imagina/qsite/_config/master/application/app'

export default {
  ...coreApp,
  //version: '2.3.29', //Version
  //git submodule foreach --recursive git merge devbaseUrl: 'https://localhost:7116',//Define base url
  //mode: 'ipanel', //Define load mode
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
