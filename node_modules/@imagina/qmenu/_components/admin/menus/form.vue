<template>
  <div class="row gutter-x-sm relative-position" v-if="success">

    <div class="col-12">
      <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
    </div>

    <!--Form-->
    <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width q-my-sm" v-if="locale.success"
            @submit="updateItem()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">

      <q-input outlined dense v-model="locale.formTemplate.name" :label="`${$tr('ui.form.name')}*`"
               :rules="[val => !!val || this.$tr('ui.message.fieldRequired')]"/>

      <q-input outlined dense v-model="locale.formTemplate.title"
               :label="`${$tr('ui.form.title')} (${locale.language})*`"
               :rules="[val => !!val || this.$tr('ui.message.fieldRequired')]"/>

      <q-select :label="`${$tr('ui.form.status')} (${locale.language})`"
                v-model="locale.formTemplate.status"
                :options="[
                  {label: this.$tr('ui.label.enabled'), value: '1'},
                  {label: this.$tr('ui.label.disabled'), value: '0'}
                ]" outlined dense emit-value map-options/>

      <q-select :label="$tr('ui.form.default')"
                v-model="locale.formTemplate.isDefault"
                :options="[
                  {label: this.$tr('ui.label.yes'), value: '1'},
                  {label: this.$tr('ui.label.no'), value: '0'}
                ]" outlined dense emit-value map-options/>

      <q-btn class="float-right" v-if="itemId" color="positive" :loading="loading"
             icon="fas fa-save" :label="$tr('ui.label.save')" type="submit" rounded/>
    </q-form>
    <inner-loading :visible="loading"/>
  </div>
</template>

<script>

  export default {
    components: {
    },
    watch: {
      $route(to, from) {
        this.initForm()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.initForm()
      })
    },
    data() {
      return {
        locale: {},
        loading: false,
        success: false,
        itemId: false,
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            name: '',
            isDefault: '0',
          },
          fieldsTranslatable: {
            title: '',
            status: '1',
          }
        }
      }
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        this.itemId = this.$route.params.id
        if (this.locale.success) this.$refs.localeComponent.vReset()
        await this.getData()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qmenu.menus'
            //Params
            let params = {
              refresh: true,
              params: {
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, itemId, params).then(response => {
              this.orderDataItemToLocale(response.data)
              resolve(true)//Resolve
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              this.loading = false
              reject(false)//Resolve
            })
          } else {
            resolve(true)//Resolve
          }
        })
      },
      orderDataItemToLocale(data) {
        let orderData = this.$clone(data)
        this.locale.form = this.$clone(orderData)
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qmenu.menus'
          this.$crud.update(configName, this.itemId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      getDataForm() {
        let response = this.locale.form
        for (var item in response) {
          let valueItem = response[item]
          if (valueItem == null || valueItem == undefined)
            delete response[item]
        }
        response.selectable = JSON.stringify(response.selectable)
        return response
      },
    }
  }
</script>

<style scoped>

</style>
