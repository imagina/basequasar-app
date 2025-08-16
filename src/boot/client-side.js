import { helper } from 'src/plugins/utils'
import crud from 'modules/qcrud/_components/crud'
import {GET_CLARITY} from "modules/qsite/_store/app/actions";
// fontawesome
import '@fortawesome/fontawesome-pro/css/fontawesome.css'
import '@fortawesome/fontawesome-pro/css/light.css'
import '@fortawesome/fontawesome-pro/css/thin.css'
import '@fortawesome/fontawesome-pro/css/duotone.css'
import '@fortawesome/fontawesome-pro/css/brands.css'
import '@fortawesome/fontawesome-pro/css/solid.css'
import '@fortawesome/fontawesome-pro/css/regular.css'

export default async ({app, router, store, Vue}) => {
  //====== Reset Service Worker
  if (navigator && navigator.serviceWorker && navigator.serviceWorker.controller
    && navigator.serviceWorker.controller.postMessage) {//Reset Service Worker
    navigator.serviceWorker.controller.postMessage({
      msg: "clearCache"
    });
  }

  //====== Load colors
  store.dispatch('qsiteApp/SET_SITE_COLORS')
  //====== Load extra state in store
  store.dispatch('qsiteApp/SET_EXTRA')
  //====== Load Clarity
  store.dispatch('qsiteApp/LOAD_CLARITY')
}
