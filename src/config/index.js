import { findValue } from 'src/utils'

export default function (value = '', fallback = null) {

  const values = {
    app : require('src/config/app').default,//Get config APP,
    sidebar : require('src/config/sidebar').default,
    pages : require('src/config/pages/index').default,
    apiRoutes : require('src/config/apiRoutes/index').default,
    auth : require('@imagina/quser/_config/auth').default,
  }

  return findValue(value, values) || fallback
}
