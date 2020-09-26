import helper from '@imagina/qhelper/_plugins/helper'
import cache from '@imagina/qhelper/_plugins/cache'

class Remember {
  constructor () {
  }

  /*Return data in cache*/
  sync (key, seconds, callback) {
    cache.get.item(key).then(response => {
      let data = response
      let difference = data ? this.timestamp() - data.updated_at : seconds
      if (difference >= seconds || !data) {
        return callback()
      } else {
        return data.data
      }
    }).catch(error => {})
  }

  /*Return data in cache*/
  async (key, seconds, callback, refresh) {
    return new Promise((resolve, reject) => {
      cache.get.item(key).then(response => {
        let data = response
        let difference = data ? helper.timestamp() - data.updated_at : seconds
        if (difference >= seconds || !data || refresh) {
          callback().then(response => {
            try {
              cache.set(key, {
                data: response.data.data,
                meta: response.data.meta ? response.data.meta : '',
                updated_at: helper.timestamp()
              })
            } catch (error) {
              console.log(error)
            }
            resolve(response.data)
          })
            .catch(error => {
              console.log(error)
              reject(error)
            })
        } else {
          resolve(data)
        }
      }).catch(error => {})
    })
  }

  refresh (key, data) {
    cache.get.item(key).then(response => {
      try {
        cache.set(key, {
          data: data,
          meta: response.data.meta ? response.data.meta : '',
          updated_at: helper.timestamp()
        })
      } catch (error) {
        console.log(error)
      }
    }).catch(error => {})

  }

  flush (key) {
    cache.remove(key)
  }

}

const remember = new Remember()

export default ({ Vue }) => {

  Vue.prototype.$remember = remember

}

export { remember }
