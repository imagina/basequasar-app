import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Quasar from 'quasar'
import * as moment from 'moment'
import cache from '@imagina/qhelper/_plugins/cache'

// i18n data
import customFormats from 'src/i18n/formats/customFormats'
import numberFormats from 'src/i18n/formats/currencyFormats'
import dateTimeFormats from 'src/i18n/formats/dateTimeFormats'
import messages from 'src/i18n/index'

Vue.use(VueI18n)

export default async ({ router, app, Vue, store, ssrContext  }) => {
  //===== Get default language
  let defaultLanguage = await cache.get.item('site.default.locale')
  if (!defaultLanguage) defaultLanguage = store.state.qsiteSettings.defaultLocale || config('app.languages.default')
  //Find language in URL
  if(ssrContext) {
    let fullUrl = ssrContext.req.protocol + "://" + ssrContext.req.headers.host + ssrContext.url
    let urlContext = new URL(fullUrl)
    let langFromUrl = urlContext.searchParams.get('lang')
    if(langFromUrl) defaultLanguage = langFromUrl
  }

  //====== Config i18n and set instance i18n
  app.i18n = new VueI18n({
    locale: defaultLanguage,
    fallbackLocale: defaultLanguage,
    formatter: new customFormats(),
    numberFormats,
    dateTimeFormats,
    messages
  })

  //===== Change language to quasar components
  await store.dispatch('qsiteSettings/SET_LOCALE', {
    locale: defaultLanguage,
    vue: app
  })

  //===== Customs short-keys to locales

  //Currency translate
  Vue.prototype.$trc = (num) => {
    return app.i18n.n(num, 'currency')
  }
  //Singular translate
  Vue.prototype.$tr = (key, params = {}) => {
    return app.i18n.tc(key, 1, params)
  }
  //Plural translate
  Vue.prototype.$trp = (key, params = {}) => {
    return app.i18n.tc(key, 2, params)
  }
  //Date translate
  Vue.prototype.$trd = (date, params = { type: 'short' }) => {
    return app.i18n.d(moment(date, 'YYYY-MM-DD HH:mm').toDate(), params.type)
  }
}
