<template>
  <div id="pageId" class="q-layout-page layout-padding">

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
                       :label="`${$tr('ui.form.name')} (${locale.language})*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
              <div class="input-title">{{ `${$tr('ui.form.description')} (${locale.language})*` }}</div>
              <q-field borderless v-model="locale.formTemplate.description" :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
                <q-editor class="full-width" v-model="locale.formTemplate.description"/>
              </q-field>
            </div>
            <div class="col-12">
              <q-no-ssr>
                <div id="map" class="full-width" style="height:300px"></div>
              </q-no-ssr>
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
  import {gmaps} from '@imagina/qlocations/_plugins/gmaps'
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
        map:{
          class: null,
          polygon: null,
          drawing: null
        },
        loading: false,
        success: false,
        itemId: false,
        mapApiKey: this.$store.getters['qsiteSettings/getSettingValueByName']('isite::api-maps'),
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
            points: [],
          },
          fieldsTranslatable: {
            name: '',
            description: '',
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
        await this.getData()
        gmaps.initializeGoogleApi(this.mapApiKey)
        this.initMap()
        this.success = true
        this.loading = false
      },
      initMap(){
        setTimeout(() => {
          //location
          let latitude = 4.4408112
          let longitude = -75.223417
          let OLD = this.locale.form.points[this.locale.form.points.length-1] || new google.maps.LatLng(latitude, longitude)
          //MAP
          this.map.class = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: OLD,
          });

          let polyOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: true
          }

          if(this.locale.form.points.length > 0){
            polyOptions.paths = this.locale.form.points
          }

          this.map.drawing = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ['polygon']
            },
            polygonOptions: polyOptions,

          });
          this.map.polygon = new google.maps.Polygon(polyOptions)

          this.map.polygon.setMap(this.map.class)

          this.map.drawing.setMap(this.map.class);
          google.maps.event.addListener(this.map.drawing, 'overlaycomplete', (event) => {
            let polygon = event.overlay
            let points = []
            let polPoints = polygon.getPath().getArray()
            console.log(polPoints)
            for(let x in polPoints){
              points[x] = {
                lat: polPoints[x].lat(),
                lng: polPoints[x].lng(),
              }
            }
            this.locale.form.points = points
          })

          let polygonEvent = ()=>{
            let points = []
            let polPoints = this.map.polygon.getPath().getArray()
            console.log(polPoints)
            for(let x in polPoints){
              points[x] = {
                lat: polPoints[x].lat(),
                lng: polPoints[x].lng(),
              }
            }
            this.locale.form.points = points
          }

          google.maps.event.addListener(this.map.polygon.getPath(), 'set_at', polygonEvent);
          google.maps.event.addListener(this.map.polygon.getPath(), 'insert_at', polygonEvent);
        }, 500)
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qlocations.polygons'
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
              setTimeout(()=>{
                this.locale.form.countryId = response.data.countryId
                this.locale.form.provinceId = response.data.provinceId
              },500)
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
        let pointItems = []
        for (let x in this.locale.form.points){
          pointItems.push(this.locale.form.points[x])
        }
        this.locale.form.points = pointItems
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qlocations.polygons'
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
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qlocations.polygons'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            this.$router.push({name: 'qlocations.admin.polygons.index'})
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
        //response.selectable = JSON.stringify(response.selectable)
        return response
      },
    }
  }
</script>

<style scoped>

</style>
