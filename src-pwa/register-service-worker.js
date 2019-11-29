/*
 * This file is picked up by the build system only
 * when building for PRODUCTION
 */

import {register} from 'register-service-worker'

register(process.env.SERVICE_WORKER_FILE, {
  ready(registration) {
    console.log('[SERVICE-WORKER] Service worker is active.')
  },

  registered(reg) { // registration -> a ServiceWorkerRegistration instance
    var newSW = reg.active;
    console.log('[SERVICE-WORKER] Service worker has been registered.')
    if (newSW)
      newSW.postMessage({
        msg: "clearCache",
        baseUrl: process.env.BASE_URL
      });
  },

  cached(registration) {
    console.log('[SERVICE-WORKER] Content has been cached for offline use.')
  },

  updatefound(registration) {
    console.log('[SERVICE-WORKER] New content is downloading.')
  },

  updated(registration) {
    console.log('[SERVICE-WORKER] New content is available; please refresh.')
  },

  offline() {
    console.log('[SERVICE-WORKER] No internet connection found. App is running in offline mode.')
  },

  error(error) {
    console.error('[SERVICE-WORKER] Error during service worker registration:', error)
  }
})

// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
