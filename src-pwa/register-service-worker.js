/*
 * This file is picked up by the build system only
 * when building for PRODUCTION
 */

import { register } from 'register-service-worker'

register( env('SERVICE_WORKER_FILE','service-worker.js'), {
  ready () {

  },
  registered (reg) { // registration -> a ServiceWorkerRegistration instance
    var newSW = reg.active;
    if(newSW)
      newSW.postMessage({
        msg: "clearCache"
      });
  },
  cached (registration) { // registration -> a ServiceWorkerRegistration instance
  },
  updatefound (registration) { // registration -> a ServiceWorkerRegistration instance
  },
  updated (registration) { // registration -> a ServiceWorkerRegistration instance
  },
  offline () {},
  error (err) {}
})

// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration