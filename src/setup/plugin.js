import {findValue} from 'src/plugins'

export default function (value = '', fallback = null) {
  let indexConfig = require('src/setup/index').default

  //Search Value
  let result = findValue(value, indexConfig()) || fallback

  //Response
  return result
}
