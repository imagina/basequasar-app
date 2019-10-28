export default async ({app, router, store, Vue}) => {
  //====== Load colors
  store.dispatch('qsiteSettings/SET_SITE_COLORS')

  if(!config('app.isBackend')){
    //====== Load Tawk
    let scriptString = store.getters['qsiteSettings/getSettingValueByName']('core::analytics-script')
    if (scriptString) eval(scriptString.replace(/<\/?script>/g, ""))
  }
}
