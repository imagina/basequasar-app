import LocalForage from 'localforage'

class localCache {
  constructor () {
    if (process.env.CLIENT) {
      //Order config to localForage
      let configDrivers = () => {
        let drivers = env('LOCALFORAGE_DRIVERS', 'INDEXEDDB,LOCALSTORAGE,WEBSQL').split(',')
        let data = []
        drivers.forEach((driver) => {
          data.push(LocalForage[driver])
        })
        return data
      }

      //Config for LocalForage
      LocalForage.config({
        driver: configDrivers(),
        name: this.nameDB(),
        version: 1,
        storeName: 'storage',
      })
    }

    //Contructor of method get
    this.get = {
      //Return data by index name
      item: (index) => {
        return new Promise((resolve, reject) => {
          if (index) {
            if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server
            LocalForage.getItem(index).then(value => resolve(value)).catch(error => {})
          } else {
            return reject('Error: index requiered')
          }
        })
      },
      //Return data of one or more items
      //param type {array} require
      items: (items) => {
        if (Array.isArray(items) && items.length) {
          return new Promise(async (resolve, reject) => {
            if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server

            let dataItems = {}

            //Get data from all items
            for (var index in items) {
              dataItems[items[index]] = await LocalForage.getItem(items[index])
            }

            resolve(dataItems) //Return data
          })
        } else {
          return 'Error: param type {array} require'
        }
      },
      //return all data
      all: () => {
        return new Promise((resolve, reject) => {
          if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server

          //Get all keys in storage
          LocalForage.keys().then(function (keys) {
            if (keys.length) {
              let allStorage = {}
              //Get data by key
              keys.forEach((key, index) => {
                LocalForage.getItem(key).then(value => {
                  allStorage[key] = value //Add data from storage
                  if (keys.length == index) {
                    resolve(allStorage)
                  }
                }).catch(error => {})
              })
            } else {
              resolve(allStorage)
            }
          }).catch(error => {})
        })
      }
    }
  }

  //Insert or update
  set (index, data) {
    if (index) {
      return new Promise((resolve, reject) => {
        if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server

        LocalForage.setItem(index, data).then(value => {
          resolve(value)
        }).catch(error => {
          console.error('Error: Localforage method SET. ', error)
          reject(error)
        })
      })
    }
  }

  //Remove an item from storage
  remove (index) {
    if (index) {
      return new Promise((resolve, reject) => {
        if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server

        LocalForage.removeItem(index).then(value => {
          resolve(true)
        }).catch(error => {})
      })
    }
  }

  //Return all keys fron storage
  keys () {
    return new Promise((resolve, reject) => {
      if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server

      LocalForage.keys().then(value => {
        resolve(value)
      }).catch(error => {})
    })

  }

  //Remove all items from storage
  clear () {
    return new Promise((resolve, reject) => {
      if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server

      LocalForage.clear().then(value => {
        resolve(true)
      }).catch(error => {})
    })
  }

  //Restore cache, save any data
  restore (keys = []) {
    return new Promise((resolve, reject) => {
      if (!process.env.CLIENT) return resolve(undefined) //Validate if is side Server

      let keysData = {}

      //Funtion with loop async, to get value keys
      const getValuesKey = async () => {
        for (var key of keys) {
          keysData[key] = await this.get.item(key)
        }
      }

      //Call method to get keys
      getValuesKey().then(async () => {
        await this.clear()//Clear all cache

        //Restore cache
        for (var keyName in keysData) {
          let value = keysData[keyName]
          if ((value != null) && (value != undefined)) {
            this.set(keyName, keysData[keyName])
          }
        }

        resolve(true)//Resolve promise
      }).catch(error => {})
    })
  }

  //Return name to DB according to domain
  nameDB () {
    let hostname = window.location.host.split('.')
    let response = hostname

    //Set capitalize to all words
    hostname.forEach((word, index) => {
      if (index >= 1) {
        hostname[index] = word.charAt(0).toUpperCase() + word.slice(1)
      }
    })

    //Remove .com .org....
    if (hostname.length >= 2) response.pop()

    return `${response.join('')}DB`//Response
  }
}

const cache = new localCache()

export default cache

export { cache }
