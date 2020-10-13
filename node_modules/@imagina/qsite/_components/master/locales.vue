<template>
  <div id="componentLocales">
    <!--Button Config language-->
    <q-btn icon="fas fa-cog" class="config-buttom q-mr-xs capitalize" size="12px"
           :label="`${$tr('ui.label.language')}`" color="blue-grey" unelevated rounded
           @click="options.typeOption = null" no-caps v-if="languageOptions.length >= 2">
      <!--Popover-->
      <q-popup-proxy class="popover-config-locale" ref="modalConfig" persistent>
        <div class="content q-pa-sm backend-page">
          <!--Title-->
          <q-toolbar class="q-pa-none title text-primary relative-positive">
            <q-toolbar-title>
              <q-icon name="fas fa-language" class="q-mr-xs"/>
              <label class="text-subtitle1 text-capitalize" v-html="$trp('ui.label.option')"></label>
            </q-toolbar-title>
          </q-toolbar>
          <!--Option replace-->
          <q-radio dense v-model="options.typeOption" val="duplicate">
            <label v-html="messageOpt.replace"/>
          </q-radio>
          <br>
          <!--Option duplicate-->
          <q-radio dense v-model="options.typeOption" val="replace">
            <label v-html="messageOpt.duplicate"/>
          </q-radio>
          <!--Languages to clone-->
          <q-select
            v-if="options.typeOption == 'replace'"
            class="capitalize q-mt-xs"
            outlined dense
            v-model="options.languageToClone"
            :label="$trp('ui.label.language')"
            :options="optionsLanguagesToClone"
          />
          <!--Button clone language-->
          <div class="text-right q-mt-sm q-gutter-x-sm">
            <q-btn color="negative" class="q-pa-none" :label="$tr('ui.label.cancel')"
                   @click="$refs.modalConfig.hide()" rounded unelevated size="sm"/>
            <q-btn icon="fas fa-save" color="positive" size="sm" @click="makeOptionLocale()"
                   :label="$tr('ui.label.save')" :disable="!options.typeOption" rounded unelevated/>
          </div>
        </div>
      </q-popup-proxy>
    </q-btn>
    <!--Button toogle with locales-->
    <q-btn-toggle
      v-model="locale.language"
      toggle-color="primary"
      color="grey-4" size="12px"
      text-color="grey-9"
      v-if="languageOptions.length >= 2"
      :options="languageOptions"
      @input="updateFormTempleate()"
      unelevated
      rounded
      no-caps
    />
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        default: () => {
          return {}
        }
      },
      form: {default: false}
    },
    components: {},
    watch: {
      //Watch form template from value, to update form by locale
      'value.formTemplate': {
        deep: true,
        handler: function (newValue) {
          this.setDataByLocale()//Set data in form by locale
        },
      },
      //Watch form from value, to init
      'value.form': {
        deep: true,
        handler: function (newValue) {
          this.init()//init all locale data
        },
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        languageOptions: this.$store.getters['qsiteApp/getSelectedLocalesSelect'],
        options: {
          typeOption: null,//type of option acoording language selected
          languageToClone: null//Language to clone data
        },
        locale: {
          form: {},//Return data with format to request
          fields: {},//Fields not translatable
          success: false,//Status  component
          validations: {},//Fields to validate
          formTemplate: {},//Form with fields to render template
          formValidations: {},//Object with validations structure
          fieldsTranslatable: {},//Fields Translatable
          language: this.$store.state.qsiteApp.defaultLocale,//Selected language in component
          languages: this.$store.state.qsiteApp.selectedLocales,//Selected locales from admin
        }
      }
    },
    computed: {
      //Return message to complete language config
      messageOpt() {
        let language = this.locale.language
        let label = this.languageOptions.find(item => item.value == language).label
        return {
          replace: this.$t('qsite.layout.messages.replaceLang', {lang: label}),
          duplicate: this.$t('qsite.layout.messages.duplicateLang', {lang: label})
        }
      },
      //Option languages to clone data
      optionsLanguagesToClone() {
        let response = []
        this.languageOptions.forEach(lang => {
          if (lang.value != this.locale.language) {
            response.push(this.$clone(lang))
          }
        })
        //Select first language
        this.options.languageToClone = response[0].value
        return response//Response
      },
      //Merge value and locale data
      interfaceSet() {
        const data = this.$clone(this.value)
        const locale = this.$clone(this.locale)
        this.locale = this.$clone(Object.assign(locale, data))
      },
      //Return clone from locale data
      interfaceGet() {
        return this.$clone(this.locale)
      },
      //Return clone from value data
      interfaceGetValue() {
        return this.$clone(this.value)
      },
      //Emmit a clone from locale data
      async interfaceEmit() {
        //Check if there is fields in from template to change status from component
        const lengthFormTemplate = Object.keys(this.locale.formTemplate).length
        this.locale.success = lengthFormTemplate ? true : false
        //Emmit data
        await this.$emit('input', this.$clone(this.locale))
      },
      //check if form template is same in value and local
      formTemplateIsSame() {
        const locale = this.interfaceGet//Get clone local data
        const value = this.interfaceGetValue//Get clone value data
        let response = false//Response
        if (!locale.formTemplate) return response
        if (JSON.stringify(locale.formTemplate) == JSON.stringify(value.formTemplate)) {
          response = true
        }
        return response//Response
      },
      //check if form is same in value and local
      formIsSame() {
        const locale = this.interfaceGet//Get clone local data
        const value = this.interfaceGetValue//Get clone value data
        let response = false//Response
        //not is same if there is not form
        if (!locale.form) return response
        //not is same if empty form
        if (!Object.keys(locale.form).length) return response
        if (JSON.stringify(locale.form) == JSON.stringify(value.form)) {
          response = true
        }
        return response//Response
      }
    },
    methods: {
      //Init component
      init() {
        if (!this.formIsSame) {
          this.interfaceSet//Set data form value
          this.orderFields()//Order fields
          this.orderValidations()//Order validations
          this.updateFormTempleate()//Update data of form template according to locale
          this.interfaceEmit//Emit clone of locale data
        }
      },
      //Load fields on form and form template
      orderFields() {
        const locale = this.$clone(this.locale)//Clone locale
        const locales = this.$store.state.qsiteApp.selectedLocales//Get selected locales from store
        this.setFormTemplate(Object.assign({}, locale.fields, locale.fieldsTranslatable))//Set fromTemplate

        //Create and sync fields translatable by locale
        let fieldsTranslatable = {}
        locales.forEach(language => {
          if (locale.form[language])//Sync fields translatable from form
          {
            Object.keys(locale.form[language]).forEach(fieldName => {
              if (!fieldsTranslatable[language]) fieldsTranslatable[language] = {}
              fieldsTranslatable[language][fieldName] = locale.form[language][fieldName]
            })
          } else//Set default fields translatable
          {
            fieldsTranslatable[language] = this.$clone(locale.fieldsTranslatable)
          }
        })

        //Create or sync fields with fields from form
        let fields = {}
        Object.keys(locale.fields).forEach(field => {
          fields[field] = (locale.form[field] != undefined) ? locale.form[field] : locale.fields[field]
        })

        //Merge all fields with fields by locale
        this.locale.form = this.$clone(Object.assign({}, fields, fieldsTranslatable))
      },
      //Order fields validations
      orderValidations() {
        //Order validations by locale
        if (Object.keys(this.locale.validations).length) {
          this.locale.formValidations = this.$clone({
            formTemplate: this.locale.validations
          })
        }
      },
      //Set data from formTemplate in form by locale
      setDataByLocale() {
        if (!this.formTemplateIsSame) {
          this.syncFormTemplate()//Sync data formTemplate
          const locale = this.interfaceGet//Get clone local data
          const value = this.interfaceGetValue//Get clone value data

          //Set fields not translatables
          for (var item in locale.fields) {
            locale.form[item] = locale.formTemplate[item]
          }

          //Set fields translatables
          for (var item in locale.fieldsTranslatable) {
            locale.form[locale.language][item] = locale.formTemplate[item]
          }

          this.locale.form = this.$clone(locale.form)
          this.interfaceEmit//Emit data
        }
      },
      //Sync form template
      syncFormTemplate() {
        const locale = this.interfaceGet//Get clone local data
        const value = this.interfaceGetValue//Get clone value data
        this.setFormTemplate(Object.assign({}, locale.formTemplate, value.formTemplate))//Set form Template
      },
      //Change data of form template about locale
      updateFormTempleate() {
        const locale = this.interfaceGet
        //Change fields by locale of form template
        Object.keys(locale.fieldsTranslatable).forEach(fieldName => {
          locale.formTemplate[fieldName] = locale.form[locale.language][fieldName]
        })

        //Change fields of form template
        Object.keys(locale.fields).forEach(fieldName => {
          locale.formTemplate[fieldName] = this.$clone(locale.form[fieldName])
        })

        this.setFormTemplate(locale.formTemplate)//Set form template
        this.interfaceEmit//Emit data
      },
      //Set formTemplate
      setFormTemplate(val = []) {
        let values = this.$clone(val)//Clone param

        //Check if exist options and decode it
        if (values.options && (typeof values.options == 'string')) {
          values.options = JSON.parse(values.options)
        }

        //Set formTemplate
        this.locale.formTemplate = this.$clone(values)
      },
      //Validate all fields
      validateForm() {
        return new Promise(async resolve => {
          if (this.form) {
            const locale = this.$clone(this.locale)
            const currentLanguage = locale.language

            //==== validate each language
            for (var lang of this.locale.languages) {
              this.locale.language = lang//Change language
              await this.updateFormTempleate()//Update form

              //Validate form
              let isValid = await this.form.validate()
              if (!isValid) return resolve(false)
            }

            //==== Return tu current langueage
            this.locale.language = currentLanguage//Change language
            await this.updateFormTempleate()//Update form
            resolve(true)//Default Response
          } else {
            resolve(false)
          }
        })
      },
      //Reset
      async vReset() {
        //Reset locale
        this.locale = Object.assign({}, this.interfaceGet, {
          form: {},//Return data with format to request
          success: false,//Status  component
          formTemplate: {},//Form with fields to render template
          formValidations: {},//Object with validations structure
        })
        await this.interfaceEmit//Emit locale
        this.init()//Init locale
      },
      //Replace o duplicate locale
      makeOptionLocale() {
        const locale = this.interfaceGet//Get clone local data
        let typeOption = this.options.typeOption//Get type option

        //Case of action options
        switch (typeOption) {
          case 'replace'://Replace info locale acoording other
            let languageToClone = this.options.languageToClone
            for (var item in locale.fieldsTranslatable) {
              locale.form[locale.language][item] = locale.form[languageToClone][item]
            }
            break
          case 'duplicate'://Duplicate data of current locale to all locales
            locale.languages.forEach(lang => {
              for (var item in locale.fieldsTranslatable) {
                locale.form[lang][item] = locale.form[locale.language][item]
              }
            })
            break
        }

        this.$refs.modalConfig.hide()//close popover options
        this.locale.form = this.$clone(locale.form)//sync locale
        this.updateFormTempleate()//Update for template
      }
    }
  }
</script>

<style lang="stylus">
  #componentLocales
    .config-buttom
      .q-icon
        margin-right 5px
        font-size 14px

  .popover-config-locale
    .content
      max-height 90vh !important

      .title
        .q-btn
          position absolute
          top 0
          right 0

</style>
