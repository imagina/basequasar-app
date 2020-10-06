<template>
  <div id="siteForm" class="position-relative">
    <locales v-model="locale" ref="locales" class="q-my-md"
             @validate="$v.$touch()" v-show="hasTranslatables" />

    <div v-for="(setting,index) in module" :key="index" v-if="locale.success">
      <field :key="index" :setting="setting" v-model="locale.formTemplate[setting.name]" :label="label(setting)"/>
    </div>

    <div class="col-12 text-right">
      <q-btn color="positive" :label="$tr('ui.label.save')" icon="fas fa-save" @click="submit" class="q-mt-sm"/>
    </div>

    <inner-loading :visible="submitModule"/>
  </div>
</template>
<script>
  /*Plugins*/
  import alert from '@imagina/qsite/_plugins/alert'

  /*Components*/
  import field from '@imagina/qsite/_components/field'

  /*Services*/
  import siteService from '@imagina/qsite/_services/index'

  export default {
    props: {
      module: {
        type: Object,
        default: () => {
          return {}
        }
      },
      moduleName: {
        type: String,
        default: ''
      },
    },
    components: {
      field
    },
    computed: {
      hasTranslatables() {
        for (const setting in this.module) {
          if (this.module[setting].translatable)
            return true
        }
        return false
      },
      hasNoTranslatables() {
        for (const setting in this.module) {
          if (!this.module[setting].translatable)
            return true
        }
        return false
      }
    },
    watch: {
      module() {
        this.transformToFrontData();
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.transformToFrontData();
      })
    },
    data() {
      return {
        locale: {},
        translatableCollapse: true,
        noTranslatableCollapse: true,
        submitModule: false,
        selectedLocales: this.$store.getters['qsiteApp/getSettingValueByName']('core::locales'),
        defaultLocale: this.$store.getters['qsiteApp/getDefaultLocale']
      }
    },
    methods: {

      submit() {
        this.submitModule = true
        let data = this.transformToBackData();
        siteService.updateOrCreate('apiRoutes.qsite.settings', data).then(response => {
          this.$alert.success({message: this.$tr('ui.message.recordUpdated')})
          this.submitModule = false
          this.$emit('getData', true)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
          this.submitModule = false
        })
      },
      transformToBackData() {
        let data = {}

        for (const field in this.locale.fields) {
          data[field] = this.locale.form[field]

          // generating form locales by setting
          this.selectedLocales.forEach(locale => {
            for (const fieldTrans in this.locale.form[locale]) {
              if (!data[fieldTrans])
                data[fieldTrans] = {}

              data[fieldTrans][locale] = this.locale.form[locale][fieldTrans]

            }
          })
        }

        return data
      },

      transformToFrontData() {
        let form = {}
        let fields = {}
        let fieldsTranslatable = {}

        for (const settingKey in this.module) {

          let setting = this.module[settingKey];

          // generating form locales by setting
          this.selectedLocales.forEach(locale => {
            if (setting[locale]) {
              if (!form[locale])
                form[locale] = {}
              form[locale][setting.name] = setting[locale].value;
            }
          })

          // generating transtalable and not translatable fields
          if (setting.translatable) {
            fieldsTranslatable[setting.name] = setting.value
          } else {
            fields[setting.name] = setting.value
          }
        }

        this.locale.form = form
        this.locale.fields = fields
        this.locale.fieldsTranslatable = fieldsTranslatable
      },

      label(setting) {
        if (setting.translatable)
          return setting.description + ' (' + this.locale.language + ')';
        else
          return setting.description;
      }
    }
  }
</script>
<style lang="stylus">
</style>
