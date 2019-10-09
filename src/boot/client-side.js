import { Loading } from 'quasar'

export default async ({ app, router, store, Vue }) => {
  store.dispatch('qsiteSettings/SET_SITE_COLORS')

  setTimeout(() => Loading.hide(), 500)//Kepp at last
}
