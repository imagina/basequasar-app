export default async ({app, router, store, Vue}) => {
  await store.dispatch('qsiteSettings/GET_SITE_SETTINGS')
}
