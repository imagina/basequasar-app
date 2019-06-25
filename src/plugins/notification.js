import {helper} from '@imagina/qhelper/_plugins/helper'; //LocalForage
import Echo from "laravel-echo";
import store from 'src/store/index';
import Pusher from "pusher-js";

class Notification {
  constructor() {
    //Check in .env to enable pusher
    if(env('PUSHER_ACTIVE') == 'true'){
      this.Echo = new Echo({
        broadcaster: env('BROADCAST_DRIVER', 'pusher'),
        key: env('PUSHER_APP_KEY'),
        cluster: env('PUSHER_APP_CLUSTER'),
        encrypted: env('PUSHER_APP_ENCRYPTED'),
      });
    }
  }

  global() {
    this.Echo.leave('global')

    let userId = store.state.quserAuth.userData.id

    this.Echo.channel('global')
      .listen('.clearCache', (message) => {
        helper.clearCache(message["key"]);
      })
      .listen('.notification'+userId, (response) => {
        store.commit('qnotificationMaster/PUSH_NOTIFICATION', response.data);
      })
  }

  leave(){
    this.Echo.leave('global')
  }
}

const notification = new Notification();

export default ({Vue}) => {
  Vue.prototype.$notification = notification;
}

export {notification};
