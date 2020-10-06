import http from "axios"
import config from '@imagina/qsite/_config/master/app'
import {remember} from '@imagina/qsite/_plugins/remember'

export default {
  index(filter, take, page, fields, include) {
    return new Promise((resolve, reject) => {
      http.get(config('api.api.api_url') + '/notification/user', {
        params: {
          filter: filter,
          take: take,
          page: page,
          fields: fields,
          include: include
        }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },

  create(data) {
    return new Promise((resolve, reject) => {
      http.post(config('api.api.api_url') + '/notification/create', data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  update(notificationId){
    return new Promise((resolve, reject) => {
      http.put(config('api.api.api_url') + '/notification/update/'+notificationId)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
