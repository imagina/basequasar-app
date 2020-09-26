<template>
  <div id="pageId" class="q-layout-page layout-padding location-form">

    <div class="relative-position q-mb-lg backend-page">
      <div class="box" v-if="success">

        <div class="col-12">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
        </div>

        <!--Form-->
        <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width q-my-sm" v-if="locale.success"
                @submit="itemId?updateItem():createItem()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input outlined dense v-model="locale.formTemplate.name"
                       :label="`${$tr('ui.form.name')} (${locale.language})*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
            </div>
            <div class="col-12 col-md-6">
              <q-input outlined dense v-model="locale.formTemplate.code"
                       :label="`${$tr('qlocations.layout.form.code')} (${locale.language})*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
            </div>
            <div class="col-12">
              <!--Crud countries-->
              <div class="row q-col-gutter-md">
                <div class="col-8 col-md-10">
                  <q-select
                      outlined
                      dense
                      v-model="locale.formTemplate.countryId"
                      :options="countriesOptions"
                      :label="$tr('qlocations.layout.form.country')"
                      map-options
                      emit-value
                      use-input
                      clearable
                      option-label="label"
                      @change="getProvinces"
                      @filter="(val, update)=>update(()=>{countriesOptions = $helper.filterOptions(val,countries,locale.formTemplate.countryId)})"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                  />
                </div>
                <div class="col-2 text-right">
                  <crud :crud-data="import('@imagina/qlocations/_crud/countries')" type="button-create" />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <!--Crud provinces-->
                <div class="col-8 col-md-10">
                  <q-select
                      outlined
                      dense
                      v-model="locale.formTemplate.provinceId"
                      :options="provincesOptions"
                      :label="$tr('qlocations.layout.form.provinces')"
                      map-options
                      emit-value
                      use-input
                      clearable
                      option-label="label"
                      @filter="(val, update)=>update(()=>{provincesOptions = $helper.filterOptions(val,provinces,locale.formTemplate.provinceId)})"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                  />
                </div>
                <div class="col-2 text-right">
                  <crud :crud-data="import('@imagina/qlocations/_crud/provinces')" type="button-create" />
                </div>
              </div>
            </div>
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
      <inner-loading :visible="loading"/>
    </div>
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
        countries: [],
        provinces: [],
        countriesOptions: [],
        provincesOptions: [],
        loading: false,
        success: false,
        itemId: false,
      }
    },
    props:{
      id:{
        default: null
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            code: '',
            countryId: null,
            provinceId: null,
          },
          fieldsTranslatable: {
            name: '',
          }
        }
      },
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        this.itemId = this.id !==null?this.id:this.$route.params.id
        if (this.locale.success) this.$refs.localeComponent.vReset()
        this.getCountries()
        await this.getData()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qlocations.cities'
            //Params
            let params = {
              refresh: true,
              params: {
                include: 'province,country',
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, itemId, params).then(response => {
              this.orderDataItemToLocale(response.data)
              this.locale.form.countryId = parseInt(response.data.countryId)
              this.locale.form.provinceId = parseInt(response.data.provinceId)
              this.getProvinces()
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
          let configName = 'apiRoutes.qlocations.cities'
          this.$crud.update(configName, this.itemId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            this.$router.push({name: 'qlocations.admin.cities.index'})
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
          let configName = 'apiRoutes.qlocations.cities'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      //Search countries
      getCountries() {
        let configName = 'apiRoutes.qlocations.countries'
        //Request
        this.$crud.index(configName).then(response => {
          this.countries = this.$array.select(response.data, { label: 'name', id: 'id' })
          this.countriesOptions = this.$clone(this.countries)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      //Search provinces
      getProvinces() {
        let configName = 'apiRoutes.qlocations.provinces'
        //Request
        let params = {
          params:{
            filter: {allTranslations: true}
          }
        }
        if(typeof this.locale.form.countryId != 'undefined'){
          params.params.filter.country = this.locale.form.countryId
        }
        this.$crud.index(configName,params).then(response => {
          this.provinces = this.$array.select(response.data, { label: 'name', id: 'id' })
          this.provincesOptions = this.$clone(this.provinces)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
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

<style lang="stylus">
  .location-form
    #crudContentPage
      .q-btn
        .q-btn__content
          div
            display none
</style>
