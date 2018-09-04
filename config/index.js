import { findValue } from 'src/utils'
import api from './api'
import sidebar from  './sidebar'
import auth from '@imagina/quser/_config/auth'; //Import this file

export default function (value = '', fallback = null) {
  const values = {
    api,
    sidebar,
    auth
  };
  return findValue(value, values) || fallback
}
