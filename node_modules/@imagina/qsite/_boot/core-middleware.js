import helper from '@imagina/qsite/_plugins/helper'
import {Loading} from "quasar";

class Middleware {
  constructor(router, store) {
    this.router = router
    this.store = store
    this.availablesLanguages = config('app.languages.availables')
    this.defaultLanguage = config('app.languages.default')
    this.redirectTo = false
    this.allowNavigate = true
    this.historyPage()//Handler to history page
  }

  //CHeck login
  checkLogin() {
    return new Promise(async resolve => {
      // Validate auth
      let isAuthenticated = process.env.CLIENT ? this.store.state.quserAuth.authenticated : true
      //try login
      if (!isAuthenticated) isAuthenticated = await this.store.dispatch('quserAuth/AUTH_TRYAUTOLOGIN')
      //Update user data
      else this.store.dispatch('quserAuth/AUTH_UPDATE')
      //Response
      resolve(isAuthenticated)
    })
  }

  //Catch history page
  historyPage() {
    //Get Event change route, if was for navigator
    window.popStateDetected = false
    window.addEventListener('load', () => {
      window.history.pushState({}, '')
    })
    window.addEventListener('popstate', async () => {
      window.popStateDetected = true
      //Close modals
      let closedModal = await this.closeModals()
      //Emit back action
      if (!closedModal) this.emitBackAction()
    })
  }

  //handler to back action in navigator
  closeModals() {
    return new Promise((resolve, reject) => {
      let doBackAction = window.popStateDetected
      let closedModal = false

      if (doBackAction) {
        //Close modals
        let modals = document.getElementsByClassName('q-dialog')
        if (modals && modals.length) {
          modals[modals.length - 1].__vue__.$parent.hide()//close modal
          closedModal = true
        }
      }

      window.popStateDetected = false//Reset prop
      resolve(closedModal)//Response
    })
  }

  //Emit back event
  emitBackAction() {
    //Watch if event was catch
    this.router.app.$root.$on('back.handler.catch', () => this.allowNavigate = false)
    //Dispatch event
    this.router.app.$root.$emit('back.handler')
    //Close Event
    this.router.app.$root.$off('back.handler.catch')
  }

  //Validate if route require authentication
  async validateRoute(to) {
    return new Promise(async (resolve, reject) => {
      if (to.meta.authenticated) {
        //If user is authenticated
        if (await this.checkLogin()) {
          //Validate permissions of route
          if (to.meta && to.meta.permission)
            if (!this.store.getters['quserAuth/hasAccess'](to.meta.permission)) this.redirectTo = {name: 'app.home'}

          //If is authenticated, redirec page from login to home
          if (!this.redirectTo && to.name == 'auth.login') this.redirectTo = {name: 'app.home'}
        } else {//If user not is authenticate
          if (to.name != 'auth.login') this.redirectTo = {name: 'auth.login'}
        }
      }
      //Response
      resolve(true)
    })
  }

  //go to next route
  goToNextRoute(to, from, next) {
    let locale = (from && from.name) ? helper.getLocaleRouteName(from.name) : false//Locale to route
    let nextRoute = (this.redirectTo && (this.redirectTo.name != to.name)) ? this.redirectTo : to//Get next route
    this.store.commit('qsiteApp/SET_CURRENT_ROUTE', (nextRoute))//Update current route

    //Validate if require locale
    if (locale && !helper.getLocaleRouteName(nextRoute.name))
      nextRoute = {...nextRoute, name: `${locale}.${nextRoute.name}`}

    //Go to route
    if (nextRoute.name == to.name) return next()
    if (from.name != nextRoute.name) return this.router.push(nextRoute)
  }
}

//Boot
export default async ({router, store, Vue, app}) => {
  let middleware = new Middleware(router, store)//Define class middleware
  await middleware.checkLogin()//Check login

  //Handler to any route
  router.beforeEach(async (to, from, next) => {
    middleware.redirectTo = false//Reset redirect to

    //Validate if go to next route
    if (!middleware.allowNavigate) {
      middleware.allowNavigate = true
      return next(false)
    }

    //Validate route authentication and permissions
    await middleware.validateRoute(to)

    //Go to next route
    middleware.goToNextRoute(to, from, next)

    //Hidde loading
    Loading.hide()
  })
}
