
class loadTranslations {
  constructor() {
    this.languages = {}
    this.modules = config('app.modules')
    this.availablesLanguages = config('app.languages.availables')
    this.availablesLanguages.forEach((language) => {
      this.loadModulesTranslations(language)
    })
  }

  //Load Module
  loadModulesTranslations(language) {
    const lang = language.split('-')[0]    //convert 'en-us' => 'en'

    this.languages[lang] = {}
      this.modules.forEach(name => {
        let translations = false  
        //Search module in project
        try {            
          translations = require(`src/modules/${name}/_i18n/${language}/index`).default
          if(translations){
            Object.keys(translations).forEach((key) => {
              this.languages[lang][key] = {...this.languages[lang][key], ...translations[key]}
            })
          }
        } catch (e) {}
    })
  }
}

//Define new class
const translations = new loadTranslations()
//response
export default translations.languages
