import http from "axios"
import config from '@imagina/qsite/_config/master/app'
import {remember} from '@imagina/qsite/_plugins/remember'

export default {
  index(){
    return new Promise((resolve, reject) => {
      http.get(config('apirRoutes.api.api_url') + '/notification/platforms')
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
}
