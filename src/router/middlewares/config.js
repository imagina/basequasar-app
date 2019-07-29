//Plugins
import store from 'src/store/index'

//Middleware to redirect to config
export default async function (to, from, next) {
  try {
    let route = {name : 'app.config'}//Route to redirect
    let hasConfiguration = store.state.app.hasConfiguration
    let isPageConfig = (to.name == 'app.config') ? true : false
    let isLogout = (to.name == 'auth.logout') ? true : false
    if(!isPageConfig) store.dispatch('app/CHECK_VERSION')//Check version of APP

    //When reloaded page doesn't exist from route, so redirect after config to page "TO"
    if(from.name == null) route.params = {redirectTo : to}

    //Redirect
    if(isLogout) next()//Ever go Logout
    else if (!hasConfiguration && !isPageConfig) next(route)//Redirect to config
    else next()//Next page
  } catch (error) {
    next();
  }
}
