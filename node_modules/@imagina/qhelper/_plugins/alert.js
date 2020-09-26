import { Notify } from 'quasar'

class Alert {
  constructor () {
    this.defaultParams = {
      message: 'Notify',
      pos: 'top-right',
      action: false,
      timeOut: 4000
    }
  }

  //Alert success
  success (params = {}) {
    if (!params.message) params = { message: params }
    params = Object.assign({}, this.defaultParams, params)
    params.icon = params.icon || 'notifications'
    params.color = 'positive'
    this.show(params)
  }

  //ALert Error
  error (params = {}) {
    if (!params.message) params = { message: params }
    params = Object.assign({}, this.defaultParams, params)
    params.icon = params.icon || 'error'
    params.color = 'negative'
    this.show(params)
  }

  //ALert info
  info (params = {}) {
    if (!params.message) params = { message: params }
    params = Object.assign({}, this.defaultParams, params)
    params.icon = params.icon || 'info'
    params.color = 'cyan'
    this.show(params)
  }

  //ALert warning
  warning (params = {}) {
    if (!params.message) params = { message: params }
    params = Object.assign({}, this.defaultParams, params)
    params.icon = params.icon || 'warning'
    params.color = 'warning'
    this.show(params)
  }

  //ALert light
  light (params = {}) {
    if (!params.message) params = { message: params }
    params = Object.assign({}, this.defaultParams, params)
    params.icon = params.icon || 'notifications'
    params.color = 'faded'
    this.show(params)
  }

  //ALert dark
  dark (params = {}) {
    if (!params.message) params = { message: params }
    params = Object.assign({}, this.defaultParams, params)
    params.icon = params.icon || 'notifications'
    params.color = 'black'
    this.show(params)
  }

  //Show alert
  show (params) {
    Notify.create({
      message: params.message,
      icon: params.icon,
      timeout: params.action ? 0 : params.timeOut,
      color: params.color,
      //position: params.pos,
      position: 'bottom-right',
      actions: params.action || [
        {
          label: 'Ok',
          icon: '',
          handler: () => {
            false
          }
        }
      ],
    })
  }
}

const alert = new Alert()

export default alert

export { alert }
