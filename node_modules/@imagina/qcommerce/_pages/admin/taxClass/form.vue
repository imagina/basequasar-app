<template>
  <div id="pageId" class="q-layout-page layout-padding">

    <div class="relative-position q-mb-lg backend-page" v-if="success">
      <div class="box">

        <div class="col-12">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
        </div>

        <!--Form-->
        <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width q-my-sm" v-if="locale.success"
                @submit="itemId?updateItem():createItem()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <q-input outlined dense v-model="locale.formTemplate.name"
                   :label="`${$tr('ui.form.name')} (${locale.language})*`"
                   :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
          <div class="input-title">{{`${$tr('ui.form.description')} (${locale.language})*`}}</div>
          <q-field borderless v-model="locale.formTemplate.description" :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
            <q-editor class="full-width" v-model="locale.formTemplate.description" />
          </q-field>
          <div class="row" v-if="this.itemId">
            <div class="col-12 text-right q-py-sm">
              <q-btn color="positive" :loading="loading" @click="locale.formTemplate.rates.push(defaultRate)"
                     icon="fas fa-plus">
                <q-tooltip>
                  {{ $tr('qcommerce.layout.newTaxRate') }}
                </q-tooltip>
              </q-btn>
            </div>
            <div v-if="locale.formTemplate.rates" v-for="(rate,i) in locale.formTemplate.rates" :key="i" class="col-12 q-py-xs">
              <div class="row q-col-gutter-sm">
                <div class="col-4">
                  <!--<q-select outlined dense bg-color="white" v-model="rate.taxRateId"
                            :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                            :label="`${$tr('qcommerce.layout.form.taxRate')}*`" style="width: 100%;"
                            emit-value map-options :options="optionsRate"
                  />-->
                  <!--Crud tax rate-->
                  <crud :crud-data="import('@imagina/qcommerce/_crud/taxRates')"
                        type="select" :crud-props="{label:`${$tr('qcommerce.layout.form.taxRate')}*`}"
                        v-model="rate.taxRateId" :config="{options: {label: 'name', value: 'id'}}"
                  />
                </div>
                <div class="col-4">
                  <q-select outlined dense bg-color="white" v-model="rate.based"
                            :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                            :label="`${$tr('qcommerce.layout.form.taxBased')}*`" style="width: 100%;"
                            emit-value map-options :options="optionsBased"
                  />
                </div>
                <div class="col-2 col-sm-3">
                  <q-input type="number" outlined dense v-model="rate.priority"
                           :label="`${$tr('qcommerce.layout.form.priority')}`"
                           :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
                </div>
                <div class="col-2 col-sm-1 text-right">
                  <q-btn color="negative" :loading="loading" @click="deleteRateItem(i)"
                         icon="fas fa-trash" />
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-else>

          </div>
          <q-page-sticky
                  position="bottom-right"
                  :offset="[18, 18]">
            <!--Update button-->
            <q-btn v-if="$route.params.id" color="positive" :loading="loading"
                   icon="fas fa-edit" :label="$tr('ui.label.update')" type="submit"/>
            <!--Save button-->
            <q-btn v-else color="positive" :loading="loading" icon="fas fa-edit"
                   :label="$tr('ui.label.create')" type="submit"/>
          </q-page-sticky>
        </q-form>
      </div>
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
        itemId: false,
        optionsRate: [],
        optionsBased: [
          {
            value: '1',
            label: this.$tr('qcommerce.layout.options.taxRateBased.shippingAddress'),
          },
          {
            value: '2',
            label: this.$tr('qcommerce.layout.options.taxRateBased.paymentAddress'),
          },
          {
            value: '3',
            label: this.$tr('qcommerce.layout.options.taxRateBased.storeAddress'),
          }
        ]
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            rates: []
          },
          fieldsTranslatable: {
            description: '',
            name: '',
          }
        }
      },
      defaultRate(){
        return {
          taxRateId: '',
          based: '',
          priority: 0
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
        //await this.getTaxRates()
        console.warn(this.locale.form)
        this.success = true
        this.loading = false
      },
      async getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qcommerce.taxClasses'
            //Params
            let params = {
              refresh: true,
              params: {
                include: 'rates',
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
      deleteRateItem(i){
        this.locale.formTemplate.rates.splice(i,1)
      },
      orderDataItemToLocale(data) {
        let orderData = this.$clone(data)
        this.locale.form = this.$clone(orderData)
        setTimeout(()=>{
          this.locale.form.rates = orderData.rates
        },1000)
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qcommerce.taxClasses'
          this.$crud.update(configName, this.itemId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            this.$router.push({name: 'qcommerce.admin.taxClasses.index'})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qcommerce.taxClasses'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            this.$router.push({name: 'qcommerce.admin.taxClasses.index'})
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
          if (valueItem == null || valueItem == undefined || valueItem.length === 0)
            delete response[item]
        }
        //response.selectable = JSON.stringify(response.selectable)
        return response
      },
    }
  }
</script>

<style scoped>

</style>
