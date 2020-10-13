<template>
  <div id="settingPage" class="relative-position">
    <!--Empty result-->
    <not-result class="q-my-md" v-if="!loading && !dataSettings"/>
    <!--Content-->
    <div class="row q-col-gutter-md" v-else>
      <!--Menu settings-->
      <div class="col-12 col-md-3">
        <div class="box">
          <!--Title-->
          <div class="text-primary text-subtitle1 row items-center q-mb-sm">
            <q-icon name="fas fa-boxes" class="q-mr-sm"/>
            {{$trp('ui.label.module')}}
          </div>
          <!--List Modules-->
          <q-list separator>
            <q-item v-for="(module, key) in dataSettings" :key="key" clickable v-ripple dense
                    @click.native="moduleSelected = key" :active="moduleSelected == key"
                    active-class="bg-primary text-white" class="q-pl-sm q-pr-md">
              <q-item-section>{{key}}</q-item-section>
              <q-item-section side :class="(moduleSelected == key) ? 'text-white' : 'text-grey-8'">
                {{Object.keys(module).length}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <!--Form-->
      <div class="col-12 col-md-9">
        <div class="box">
          <!--Title-->
          <div class="text-primary text-subtitle1 row items-center q-mb-sm">
            <q-icon name="fas fa-cog" class="q-mr-sm"/>
            {{moduleSelected || ''}}
          </div>
          <!--Language-->
          <locales v-model="locale" class="q-mb-md"
                   v-show="locale.fieldsTranslatable && Object.keys(locale.fieldsTranslatable).length"/>
          <!--Fields content-->
          <div class="row full-width q-mb-md" v-if="locale.success">
            <div v-for="(field, key) in dataSettings[moduleSelected]" :key="key" :ref="key" class="col-12 q-mb-sm">
              <!--Dynamic field-->
              <dynamic-field v-if="!field.fakeFieldName" :field="field" :item-id="getSettingId(field,key)"
                             v-model="locale.formTemplate[field.name || key]" :language="locale.language"/>
              <!--Dynamic fake field-->
              <dynamic-field v-else-if="locale.formTemplate[field.fakeFieldName]"
                             :language="locale.language" :field="field" :item-id="getSettingId(field,key)"
                             v-model="locale.formTemplate[field.fakeFieldName][field.name || key]"/>
            </div>
          </div>
          <!--Actions-->
          <div class="full-width text-right">
            <!--Save button-->
            <q-btn :label="$tr('ui.label.save')" icon="fas fa-save" unelevated rounded color="positive"
                   @click="saveSettings()"/>
          </div>
        </div>
      </div>
    </div>
    <!--Loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>
<script>
  export default {
    beforeDestroy() {
      this.$root.$off('page.data.refresh')
    },
    props: {},
    components: {},
    watch: {
      moduleSelected(newValue) {
        if (newValue) this.setLocaleConfig()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        loading: false,
        locale: {fields: {}, fieldsTranslatable: {}},
        dataSettings: false,
        moduleSelected: false
      }
    },
    computed: {
      //Return current settings values
      settingsValuesToLocale() {
        let response = {}//Default response
        let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
        selectedLocales.forEach(item => response[item] = {})//set locales to response
        let settingValues = this.$clone(this.$store.state.qsiteApp.settings)//Get all setting values
        let fields = this.$clone(Object.values(this.dataSettings[this.moduleSelected]))//Get current fields

        //Set values to response
        fields.forEach(field => {
          //Get setting value
          let settingValue = settingValues.find(item => {
            if (field.fakeFieldName && (item.name == field.fakeFieldName)) return item
            if (item.name == field.name) return item
          })

          //Set translatable value
          if (field.isTranslatable) {
            selectedLocales.forEach(lang => {
              //Search translatables values
              let langValue = settingValue ? settingValue.translations.find(item => item.locale == lang) : false
              //Set value per locale
              response[lang][field.name] = langValue ? langValue.value : field.value
            })
          } else {//Set no translatable value
            if (field.fakeFieldName) {
              //Define response
              if (!response[field.fakeFieldName]) response[field.fakeFieldName] = {}
              //Set value
              if (settingValue && settingValue.value && settingValue.value[field.name])
                response[field.fakeFieldName][field.name] = settingValue.value[field.name]
              else response[field.fakeFieldName][field.name] = field.value
            } else {
              response[field.name] = settingValue ? settingValue.value : field.value
            }
          }
        })

        //Response
        return response
      }
    },
    methods: {
      //Init method
      init() {
        this.getData()//Get data
        this.$root.$on('page.data.refresh', () => this.getData())//Listen refresh event
      },
      //Get Data
      async getData() {
        this.loading = true
        await Promise.all([
          this.$store.dispatch('qsiteApp/GET_SITE_SETTINGS'),//Get settings
          this.getSettingFields()//Get setting fields
        ])
        //Set module selected
        if (!this.moduleSelected && this.dataSettings) this.moduleSelected = Object.keys(this.dataSettings)[0]
        this.$store.dispatch('qsiteApp/SET_SITE_COLORS')//Set colors
        this.setLocaleConfig()//Set locale data
        this.loading = false
      },
      //Get settings Fields
      getSettingFields() {
        return new Promise((resolve, reject) => {
          this.dataSettings = false//Reset data settings
          //Request Params
          let requestParams = {refresh: true, params: {filter: {allTranslations: true}}}
          //Request
          this.$crud.index('apiRoutes.qsite.settingsFields', requestParams).then(response => {
            if (response.data && Object.keys(response.data).length) this.dataSettings = response.data//Set data
            resolve(response.data)
          }).catch(e => {
            this.$alert.error(this.$tr('ui.message.errorRequest'))
            resolve([])
          })
        })
      },
      //Set locale config
      setLocaleConfig() {
        let fieldLocale = {fields: {}, fieldsTranslatable: {}}
        //Set field to locale
        if (this.moduleSelected) {
          let fields = this.$clone(this.dataSettings[this.moduleSelected])//Get fields
          //Set fields
          Object.keys(fields).forEach(itemName => {
            let field = fields[itemName]//Get field data
            //Set translatables fields
            if (field.isTranslatable) {
              fieldLocale.fieldsTranslatable[field.name] = field.value
            } else {//SEt plain fields
              //Set fake fields
              if (field.fakeFieldName) {
                if (!fieldLocale.fields[field.fakeFieldName]) fieldLocale.fields[field.fakeFieldName] = {}
                fieldLocale.fields[field.fakeFieldName][field.name] = {}
              } else {//Set plain field
                fieldLocale.fields[field.name] = field.value
              }
            }
          })
        }

        //Set data
        this.locale.form = this.$clone(this.settingsValuesToLocale)
        this.locale.fields = this.$clone(fieldLocale.fields)
        this.locale.fieldsTranslatable = this.$clone(fieldLocale.fieldsTranslatable)
      },
      //Return item Id to field
      getSettingId(field, key) {
        //Get setting name
        let settingName = field.fakeFieldName || field.name || key
        //Get all setting values
        let settingValue = this.$store.state.qsiteApp.settings.find(item => item.name == settingName)
        //Response
        return settingValue ? settingValue.id : null
      },
      //Get dataForm. order data to backend
      getDataForm() {
        let formData = this.$clone(this.locale.form)//Get form data
        let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
        let response = {}//Default response

        Object.keys(formData).forEach(fieldName => {
          //Set no translatable fields
          if (selectedLocales.indexOf(fieldName) == -1) response[fieldName] = formData[fieldName]
          else {//Set translatables values. Order translate values
            Object.keys(formData[fieldName]).forEach(transfieldName => {
              if (!response[transfieldName]) response[transfieldName] = {}
              response[transfieldName][fieldName] = formData[fieldName][transfieldName]
            })
          }
        })

        //Response
        return response
      },
      //Save settings
      saveSettings() {
        this.loading = true
        //Request
        this.$crud.post('apiRoutes.qsite.settings', {attributes: this.getDataForm()}).then(async response => {
          this.$alert.info(this.$tr('ui.message.recordUpdated'))
          this.getData()
        }).catch(error => {
          this.$alert.error(this.$tr('ui.message.recordNoUpdated'))
          console.error('[UPDATE-SETTINGS]::error:', error)
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="stylus">
</style>
