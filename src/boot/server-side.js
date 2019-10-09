import { Loading } from 'quasar'

export default async ({ app, router, store, Vue }) => {
  Loading.show()//Kepp as firts

  await store.dispatch('qsiteSettings/GET_SITE_SETTINGS')
}
