import {Notify, Loading} from 'quasar'

export default async ({app, router, store, Vue}) => {
  //Loading
  Loading.show()
  //====== Reset Service Worker
  if (navigator && navigator.serviceWorker && navigator.serviceWorker.controller
    && navigator.serviceWorker.controller.postMessage) {//Reset Service Worker
    navigator.serviceWorker.controller.postMessage({
      msg: "clearCache"
    });
  }

  //====== Load colors
  store.dispatch('qsiteApp/SET_SITE_COLORS')
  //====== Load extra state in store
  store.dispatch('qsiteApp/SET_EXTRA')

  if (!config('app.isBackend')) {
    //====== Load Tawk
    let scriptString = store.getters['qsiteApp/getSettingValueByName']('core::analytics-script')
    if (scriptString && (typeof (scriptString) == 'string')) eval(scriptString.replace(/<\/?script>/g, ""))
  }

  //======= Load message Install as native APP(PWA)
  /*window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    console.warn('>>>>>>>>>',e)

    //Notify to install as Native APP
    Notify.create({
      message: 'Do you want install as native APP?',
      timeout: 0, // You can adjust this, use 0 for infinite
      closeBtn: 'Close',
      actions: [
        {
          label: 'Install',
          icon: 'get_app',
          color: 'white',
          handler () {
            e.prompt()
          }
        }
      ]
    })
  });*/
}
