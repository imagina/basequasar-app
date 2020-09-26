<template>
  <div class="relative-position" v-if="success">
    <!--Languages-->
    <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>

    <!--Form-->
    <q-form autocorrect="off" autocomplete="off" ref="formContent" class="q-my-sm" v-if="locale.success"
            @submit="updateItem()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
      <!--Name-->
      <q-input outlined dense v-model="locale.formTemplate.title" :label="`${$tr('ui.form.name')} *`"
               :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>

      <!--systemName-->
      <q-input outlined dense v-model="locale.formTemplate.systemName" :label="`${$tr('ui.form.slug')} *`"
               :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>

      <!--Destinations email-->
      <q-select :label="`${$trp('ui.form.email')} *`" v-model="locale.formTemplate.destinationEmail"
                :rules="[val => val.length || $tr('ui.message.fieldRequired')]"
                use-input use-chips multiple hide-dropdown-icon input-debounce="0"
                new-value-mode="add-unique" style="width: 100%" outlined dense/>

      <!--Status-->
      <q-select outlined dense bg-color="white" v-model="locale.formTemplate.active"
                :label="$tr('ui.form.status')" style="width: 100%;"
                emit-value map-options :options="optionStatus"/>

      <!--User-->
      <q-select :label="$tr('ui.form.type')" v-model="locale.formTemplate.userId" :clearable="true"
                :options="users" outlined dense emit-value map-options/>

      <q-btn class="float-right" v-if="itemId" color="positive" :loading="loading" rounded
             icon="fas fa-edit" :label="$tr('ui.label.update')" type="submit"/>
    </q-form>

    <div class="q-my-sm" v-if="locale.success">


    </div>
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
        users: [],
        itemId: false,
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            systemName : '',
            userId: null,
            active: '1',
            destinationEmail: []
          },
          fieldsTranslatable: {
            title: '',
          }
        }
      },
      optionStatus() {
        return [
          {label: this.$tr('ui.label.enabled'), value: '1',},
          {label: this.$tr('ui.label.disabled'), value: '0',},
        ]
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
        this.getUsers()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qform.forms'
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
          //Check validations
          this.loading = true
          let configName = 'apiRoutes.qform.forms'
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
      getObjectValidation() {
        let response = {}
        if (this.locale && this.locale.formValidations)
          response = {locale: this.locale.formValidations}
        return response
      },
      getUsers() {
        this.loading = true
        let params = {params: {}}
        this.$crud.index('apiRoutes.quser.users', params)
          .then(response => {
            this.users = response.data.map(item => {
              return {
                value: item.id,
                label: item.fullName
              }
            })
            this.loading = false
          })
          .catch(error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
          })
      },
    }
  }
</script>

<style scoped>

</style>
