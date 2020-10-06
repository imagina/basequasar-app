class AutoLoadTranslations {
  constructor() {
    this.languages = {}
    this.availablesLanguages = config('app.languages.availables')
    this.modules = config('app.modules')
    this.setAvailableLanguages()
    this.loadCoreTranslations()
    this.loadModulesTranslations()
  }

  //Set availables languages
  setAvailableLanguages() {
    this.availablesLanguages.forEach(lang => this.languages[lang] = {})
  }

  //Load core translations
  loadCoreTranslations() {
    Object.keys(this.languages).forEach(lang => {
      //Load core translations
      try {
        let core = require(`@imagina/qsite/_i18n/master/${lang}/index`).default
        this.languages[lang] = {...this.languages[lang], ...core}
      } catch (e) {
      }

      //Load locale translations
      try {
        let folderName = this.modules.indexOf('app') >= 0 ? lang : `i18n/${lang}`
        let locale = require(`src/${folderName}/index`).default
        this.languages[lang]['app'] = {...this.languages[lang]['app'], ...locale}
      } catch (e) {
      }
    })
  }

  //Load modules translations
  loadModulesTranslations() {
    Object.keys(this.languages).forEach(lang => {
      this.modules.forEach(moduleName => {
        //Search module y node_modules
        try {
          let translation = require(`@imagina/${moduleName}/_i18n/${lang}/index`).default
          this.languages[lang][moduleName] = translation
        } catch (e) {
        }

        //Search module in project
        try {
          let translation = require(`src/modules/${moduleName}/_i18n/${lang}/index`).default
          this.languages[lang][moduleName] = translation
        } catch (e) {
        }
      })
    })
  }
}

//Create new clase
const translations = new AutoLoadTranslations()

//Export languages
export default translations.languages
