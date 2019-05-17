import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

/*=== Number Formats ===*/
const numberFormats = {
  'en-us': {
    currency: {
      style: 'currency',
      currency: 'USD'
    }
  }
}

/*=== Date Formats ===*/
const dateTimeFormats = {
  'en-us': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: 'numeric'
    },
    time:{
      hour: 'numeric', minute: 'numeric'
    }
  },
}

export default ({ app, Vue }) => {
  Vue.use(VueI18n)

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'en-us',
    fallbackLocale: 'en-us',
    numberFormats,
    dateTimeFormats,
    messages
  })
}
