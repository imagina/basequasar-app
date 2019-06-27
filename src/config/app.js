export default {
  version: '0.0.1',
  registerUsers : true,//Permit register users
  isBackend : true, //Define if project is to admin
  //UI Languages
  languages : {
    default : 'es',
    availables : ['en-us', 'es'],
    select : [
      {label: 'English (en-us)', value: 'en-us'},
      {label: 'Español (es)', value: 'es'}
    ],
  },
  //Modules
  modules : [
    'qblog',
    'qcommerce',
    'quser',
    'qplace',
    'qcrud',
    'qhelper',
    'qmedia',
    'qmenu',
    'qnotification',
    'qoffline',
    'qsite',
    'qslider'
  ],
  //Storage
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
      'offlineRequests'
    ]
  }
}
