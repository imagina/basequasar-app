export default async ({app, router, store, Vue}) => {
  await store.dispatch('qsiteApp/GET_SITE_SETTINGS')
}
