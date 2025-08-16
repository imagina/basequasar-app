export default async ({ app, router, store }) => {
  await Promise.all([
    store.dispatch('qsiteApp/SET_AXIOS_TIMEZONE'),
    store.dispatch('qsiteApp/GET_SITE_SETTINGS', {refresh: false}),
    //v12.x store.dispatch('qsiteApp/GET_MODULE_CONFIGS', {refresh: false}),
    //v12.x store.dispatch('qsiteApp/GET_SITE_HOOKS', {refresh: false}),
  ])
}
