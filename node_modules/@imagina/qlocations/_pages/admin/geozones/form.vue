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
            <div class="col-12">
              <q-input outlined dense v-model="locale.formTemplate.name"
                       :label="`${$tr('ui.form.name')}*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
              <div class="input-title">{{ `${$tr('ui.form.description')}*` }}</div>
              <q-field borderless v-model="locale.formTemplate.description" :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
                <q-editor class="full-width" v-model="locale.formTemplate.description"/>
              </q-field>
            </div>
          </div>
          <div class="row q-col-gutter-md q-py-md">
            <div class="col-12 col-md-6">
              <!--Crud countries-->
              <div class="row q-col-gutter-md">
                <div class="col-8 col-md-10">
                  <q-select
                          outlined
                          dense
                          multiple
                          use-chips
                          v-model="locale.formTemplate.countries"
                          :options="countriesOptions"
                          :label="$tr('qlocations.layout.form.countries')"
                          map-options
                          emit-value
                          use-input
                          @filter="(val, update)=>update(()=>{countriesOptions = $helper.filterOptions(val,countries,locale.formTemplate.countries)})"
                          option-label="label"
                  />
                </div>
                <div class="col-2 text-right">
                  <crud :crud-data="import('@imagina/qlocations/_crud/countries')" type="button-create" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!--Crud provinces-->
              <div class="row q-col-gutter-md">
                <div class="col-8 col-md-10">
                  <q-select
                    outlined
                    dense
                    multiple
                    use-chips
                    v-model="locale.formTemplate.provinces"
                    :options="provincesOptions"
                    :label="$tr('qlocations.layout.form.provinces')"
                    map-options
                    emit-value
                    use-input
                    @filter="(val, update)=>update(()=>{provincesOptions = $helper.filterOptions(val,provinces,locale.formTemplate.provinces)})"
                    option-label="label"
                  />
                </div>
                <div class="col-2 text-right">
                  <crud :crud-data="import('@imagina/qlocations/_crud/provinces')" type="button-create" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!--Crud cities-->
              <div class="row q-col-gutter-md">
                <div class="col-8 col-md-10">
                  <q-select
                    outlined
                    dense
                    multiple
                    use-chips
                    v-model="locale.formTemplate.cities"
                    :options="citiesOptions"
                    :label="$tr('qlocations.layout.form.cities')"
                    map-options
                    emit-value
                    use-input
                    @filter="(val, update)=>update(()=>{citiesOptions = $helper.filterOptions(val,cities,locale.formTemplate.cities)})"
                    option-label="label"
                  />
                </div>
                <div class="col-2 text-right">
                  <q-btn size="md" class="btn-small" color="positive" icon="fas fa-plus" @click="showCityCreate = true">
                    <q-tooltip :offset="[10, 10]">
                      {{ $tr('qlocations.layout.newCity') }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!--Crud neighborhoods-->
              <div class="row q-col-gutter-md">
                <div class="col-8 col-md-10">
                  <q-select
                      outlined
                      dense
                      multiple
                      use-chips
                      v-model="locale.formTemplate.neighborhoods"
                      :options="neighborhoodsOptions"
                      :label="$tr('qlocations.layout.form.neighborhoods')"
                      map-options
                      emit-value
                      use-input
                      @filter="(val, update)=>update(()=>{neighborhoodsOptions = $helper.filterOptions(val,neighborhoods,locale.formTemplate.neighborhoods)})"
                      option-label="label"
                  />
                </div>
                <div class="col-2 text-right">
                  <q-btn size="md" class="btn-small" color="positive" icon="fas fa-plus" @click="showNeighborhoodCreate = true">
                    <q-tooltip :offset="[10, 10]">
                      {{ $tr('qlocations.layout.newNeighborhood') }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!--Crud polygons-->
              <div class="row q-col-gutter-md">
                <div class="col-8 col-md-10">
                  <q-select
                      outlined
                      dense
                      multiple
                      use-chips
                      v-model="locale.formTemplate.polygons"
                      :options="polygonsOptions"
                      :label="$tr('qlocations.layout.form.polygons')"
                      map-options
                      emit-value
                      use-input
                      @filter="(val, update)=>update(()=>{polygonsOptions = $helper.filterOptions(val,polygonsOptions,locale.formTemplate.polygons)})"
                      option-label="label"
                  />
                </div>
                <div class="col-2 text-right">
                  <q-btn size="md" class="btn-small" color="positive" icon="fas fa-plus" @click="showPolygonCreate = true">
                    <q-tooltip :offset="[10, 10]">
                      {{ $tr('qlocations.layout.newPolygon') }}
                    </q-tooltip>
                  </q-btn>
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
    <q-dialog content-class="modal-form-crud" @hide="getCities"
              v-model="showCityCreate" v-if="showCityCreate" no-esc-dismiss no-backdrop-dismiss>
      <q-card class="bg-grey-1 backend-page row" style="max-width: 80vw!important;">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <label>{{$tr('qlocations.layout.newCity')}}</label>
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>
        <!--Content-->
        <q-card-section class="relative-position col-12">
          <cityForm :id="false" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog content-class="modal-form-crud" @hide="getPolygons"
              v-model="showPolygonCreate" v-if="showPolygonCreate" no-esc-dismiss no-backdrop-dismiss>
      <q-card class="bg-grey-1 backend-page row" style="max-width: 80vw!important;">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <label>{{$tr('qlocations.layout.newPolygon')}}</label>
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>
        <!--Content-->
        <q-card-section class="relative-position col-12">
          <polygonForm :id="false" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog content-class="modal-form-crud" @hide="getNeighborhoods"
              v-model="showNeighborhoodCreate" v-if="showNeighborhoodCreate" no-esc-dismiss no-backdrop-dismiss>
      <q-card class="bg-grey-1 backend-page row" style="max-width: 80vw!important;">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <label>{{$tr('qlocations.layout.newNeighborhood')}}</label>
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>
        <!--Content-->
        <q-card-section class="relative-position col-12">
          <neighborhoodForm :id="false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import cityForm from '@imagina/qlocations/_pages/admin/cities/form'
  import polygonForm from '@imagina/qlocations/_pages/admin/polygons/form'
  import neighborhoodForm from '@imagina/qlocations/_pages/admin/neighborhoods/form'
  export default {
    components: {
      cityForm,
      polygonForm,
      neighborhoodForm,
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
        countriesOptions: [],
        provincesOptions: [],
        citiesOptions: [],
        neighborhoodsOptions: [],
        polygonsOptions: [],
        countries: [],
        provinces: [],
        cities: [],
        neighborhoods: [],
        polygons: [],
        loading: false,
        success: false,
        itemId: false,
        showCityCreate: false,
        showPolygonCreate: false,
        showNeighborhoodCreate: false,
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
            name: '',
            description: '',
            countries: [],
            provinces: [],
            cities: [],
            polygons: [],
            neighborhoods: [],
          },
          fieldsTranslatable: {
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
        this.getProvinces()
        this.getCities()
        this.getNeighborhoods()
        this.getPolygons()
        await this.getData()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qlocations.geozones'
            //Params
            let params = {
              refresh: true,
              params: {
                include: 'provinces,countries,cities,polygons,neighborhoods',
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, itemId, params).then(response => {
              this.orderDataItemToLocale(response.data)
              this.locale.form.countries = response.data.countries.map(item =>{
                return item.id
              })
              this.locale.form.provinces = response.data.provinces.map(item =>{
                return item.id
              })
              this.locale.form.cities = response.data.cities.map(item =>{
                return item.id
              })
              this.locale.form.neighborhoods = response.data.neighborhoods.map(item =>{
                return item.id
              })
              this.locale.form.polygons = response.data.polygons.map(item =>{
                return item.id
              })
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
          let configName = 'apiRoutes.qlocations.geozones'
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
        this.$crud.index(configName).then(response => {
          this.provinces = this.$array.select(response.data, { label: 'name', id: 'id' })
          this.provincesOptions = this.$clone(this.provinces)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      //Search cities
      getCities(){
        let configName = 'apiRoutes.qlocations.cities'
        //Request
        this.$crud.index(configName).then(response => {
          this.cities =  this.$array.select(response.data, { label: 'name', id: 'id' })
          this.citiesOptions = this.$clone(this.cities)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },

      //Get neighborhoods
      getNeighborhoods() {
        let configName = 'apiRoutes.qlocations.neighborhoods'
        //Request
        this.$crud.index(configName).then(response => {
          this.neighborhoods = this.$array.select(response.data, { label: 'name', id: 'id' })
          this.neighborhoodsOptions = this.$clone(this.neighborhoods)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      //Search polygons
      getPolygons() {
        let configName = 'apiRoutes.qlocations.polygons'
        //Request
        this.$crud.index(configName).then(response => {
          this.polygons = this.$array.select(response.data, { label: 'name', id: 'id' })
          this.polygonsOptions = this.$clone(this.polygons)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qlocations.geozones'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            this.$router.push({name: 'qlocations.admin.geozones.index'})
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

<style lang="stylus">
  .location-form
    .modal-form-crud
      .layout-padding
        padding 0!important
    #crudContentPage
      .q-btn
        .q-btn__content
          div
            display none
</style>
