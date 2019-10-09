export default ({ router, store, Vue }) => {
  router.beforeEach(async (to, from, next) => {
    let redirectTo = false

    //===== Validate authentication
    if (to.meta.authenticated) {
      // Validate auth
      let isAuthenticated = process.env.CLIENT ? store.state.quserAuth.authenticated : true

      //try login If isn't authenticated
      if (!isAuthenticated) isAuthenticated = await store.dispatch('quserAuth/AUTH_TRYAUTOLOGIN')

      //Validate route to redirect
      if (isAuthenticated) {
        //Update data of user
        store.dispatch('quserAuth/AUTH_UPDATE')

        //Validate permission of route
        if (to.meta.permission) {
          if (to.meta && to.meta.permission && !store.getters['quserAuth/hasAccess'](to.meta.permission)) {
            redirectTo = { name: 'app.home' }
          }
        }

        // if page is login redirect to home
        if (!redirectTo && to.name == 'auth.login') redirectTo = { name: 'app.home' }
      } else {//Redirect if is not authenticated
        if (to.name != 'auth.login') redirectTo = { name: 'auth.login' }
      }
    }

    //====== Redirect and set default language
    let defaultLangue = store.state.qsiteSettings.defaultLocale

    if (redirectTo) {
      redirectTo.query = { lang: defaultLangue }
      return next()
    } else if (!to.query.lang) {
      next({ path: to.path, query: { lang: defaultLangue } })
    } else {
      next()
    }
  })
}
