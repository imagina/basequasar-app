
import { 
  createRouter, 
  createWebHistory, 
  createMemoryHistory, 
  createWebHashHistory 
} from 'vue-router'
import localRoutes from '@imagina/qsite/_config/master/application/localRoutes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {

  const routes = localRoutes.getRoutes()

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(
      process.env.VUE_ROUTER_BASE
    ),
    base: process.env.VUE_ROUTER_BASE,
  })

  return Router
}
