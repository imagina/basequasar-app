import VueI18n from 'vue-i18n'
import Quasar from 'quasar'
import * as moment from 'moment';
import customFormats from 'src/i18n/formats/customFormats'
import numberFormats from 'src/i18n/formats/currencyFormats'
import dateTimeFormats from 'src/i18n/formats/dateTimeFormats'
import messages from 'src/i18n/index'

export default ({app, Vue}) => {
  Vue.use(VueI18n)// Use i18n
  //Get default language from app config
  let defaultLanguage = config('app.languages.default')

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: defaultLanguage,
    fallbackLocale: defaultLanguage,
    formatter: new customFormats(),
    numberFormats,
    dateTimeFormats,
    messages
  })

  //Set default language to quasar
  import(`quasar-framework/i18n/${defaultLanguage}`).then(lang => {
    Quasar.i18n.set(lang.default)
  })

  //Customs short-keys to locales
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
  Vue.prototype.$trd = (date, params = {type: 'short'}) => {
    return app.i18n.d(moment(date, 'YYYY-MM-DD HH:mm').toDate(), params.type)
  }
}
