export default {
  version: '0.0.1',
  registerUsers : true,//Permit register users
  isBackend : false, //Define if project is to admin
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
