import appConfig from 'src/config/app'
import enUS from './en-us'
import es from './es'

let languagesAvailables = config('app.languages.availables')

//Auto load locales from modules available in: src/config/app.js "modules"
//Not edit
let languages = {}

languagesAvailables.forEach(lang => {
  languages[lang] = {} //Initialize languages
  //Load languages from modules
  appConfig.modules.forEach(name => {
    try {
      let locale = require(`@imagina/${name}/_i18n/${lang}/index`).default
      languages[lang][name] = locale
    } catch (e) {
    }
  })
  //Load languages from local project
  try {
    let locale = require(`src/i18n/${lang}/index`).default
    languages[lang] = Object.assign({},languages[lang],locale)
  } catch (e) {
  }
})

export default languages //Export languages
