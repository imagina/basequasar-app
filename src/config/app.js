import coreApp from '@imagina/qsite/_config/master/application/app'
import psjson from '../../package.json'

export default {
  ...coreApp,
  version: psjson.version, //Version
  //git submodule foreach --recursive git merge dev
  //baseUrl: 'https://ibuilder.ozonohosting.com',//Define base url
  //baseUrl: 'https://dev-colchones-amanecer.ozonohosting.com',//Define base url
  //mode: 'ipanel', //Define load mode
  //useLocalTranslations: true//Define from where use the translations
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
