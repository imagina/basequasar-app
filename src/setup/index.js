//Get configs
function getConfigs() {
  //Import configs
  let app = require('src/setup/app').default
  let apiRoutes = require('src/setup/apiRoutes').default
  let main = require('src/setup/main').default

  return {
    app,
    apiRoutes,
    main
  }
}

export default getConfigs
