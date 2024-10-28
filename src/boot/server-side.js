export default async ({ app, router, store }) => {
  await Promise.all([
    store.dispatch('qsiteApp/SET_AXIOS_TIMEZONE'),
    store.dispatch('qsiteApp/GET_SITE_SETTINGS', {refresh: false}),
    store.dispatch('qsiteApp/GET_MODULE_CONFIGS', {refresh: false}),
    store.dispatch('qsiteApp/GET_SITE_HOOKS', {refresh: false}),
  ])
}
