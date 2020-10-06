import {helper} from '@imagina/qsite/_plugins/helper'; //LocalForage
import Echo from "laravel-echo";
import store from 'src/store/index';
import Pusher from "pusher-js";
import {alert} from '@imagina/qsite/_plugins/alert'

class Notification {
  constructor() {
    if (process.env.MODE !== 'ssr') {
      if (env('PUSHER_ACTIVE') && (env('PUSHER_ACTIVE') != 'false')) {
        this.Echo = new Echo({
          broadcaster: env('BROADCAST_DRIVER', 'pusher'),
          key: env('PUSHER_APP_KEY'),
          cluster: env('PUSHER_APP_CLUSTER'),
          encrypted: env('PUSHER_APP_ENCRYPTED'),
        });
      }
    }
  }

  leave() {
    this.Echo.leave('global')
  }

  global(user) {
    this.Echo.leave('global')
    let userId = store.state.auth.userData.id
    this.Echo.channel('global')
      .listen('.clearCache', (message) => {
        helper.clearCache(message["key"]);
      })
      .listen('.notification' + userId, (response) => {
        store.commit('notification/PUSH_NOTIFICATION', response.data);
      })
      .listen('.report' + userId, (response) => {
        let data = response.data
        // server failed
        if (store.getters['report/isGeneratingReport'](data.reportId ? data.reportId : data.reportName)) {
          let storeData = {
            id: data.reportId ? data.reportId : data.reportName,
            isGenerating: false,
            isAvailable: data.failed ? false : true,
            generatedAt: data.failed ? false : data.generatedAt,
            failed: data.failed ? data.failed : false,
            reportTitle: data.failed ? '' : data.reportTitle,
            reportName: data.reportName
          }
          store.dispatch('report/SET_REPORT_DATA', storeData)
          if (!data.failed)
            alert.success('Report: ' + data.reportTitle + ', is available', 'top')
          else
            alert.error('Report: ' + helper.convertStringToSnakeCase(data.reportName) + ', failed', 'bottom')
        }
      });
  }
}

const notification = new Notification();
export default notification
