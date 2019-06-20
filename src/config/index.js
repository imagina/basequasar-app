import { findValue } from 'src/utils'

export default function (value = '', fallback = null) {
  const configApp = require('src/config/app').default//Get config APP

  const values = {
    pages : configApp.modules.pages,
    apiRoutes : configApp.modules.apiRoutes,
    sidebar : require('src/config/sidebar').default,
    auth : require('@imagina/quser/_config/auth').default,
    testApiRoutes : require('src/config/apiRoutes/index').default,
    testPages : require('src/config/pages/index').default,
    app : configApp,
  }

  return findValue(value, values) || fallback
}
