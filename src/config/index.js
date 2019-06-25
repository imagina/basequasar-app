import { findValue } from 'src/utils'

export default function (value = '', fallback = null) {

  const values = {
    pages : require('src/config/pages/index').default,
    apiRoutes : require('src/config/apiRoutes/index').default,
    sidebar : require('src/config/sidebar').default,
    auth : require('@imagina/quser/_config/auth').default,
    app : require('src/config/app').default//Get config APP,
  }

  return findValue(value, values) || fallback
}
