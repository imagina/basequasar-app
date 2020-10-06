<template>
  <div id="adminPlacesFrom">
    <!--Content-->
    <div class="relative-position q-mb-lg backend-page">
      <!--Form-->
      <div class="box">
        <q-form @submit="itemId ? updateItem() : createItem()" ref="formContent"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))"
                class="row q-col-gutter-x-sm q-pt-sm " autocomplete="off">
          <!--Languages-->
          <div class="col-12 q-mb-md">
            <locales ref="localeComponent" v-model="locale" :form="$refs.formContent"/>
          </div>
          <!---Form Left-->
          <div class="col-12 col-md-8" v-if="locale.success">
            <!--Title-->
            <q-input :label="`${$tr('ui.form.title')} (${locale.language}) *`" outlined dense
                     :rules="[val => !!val || this.$tr('ui.message.fieldRequired')]"
                     type="text" v-model="locale.formTemplate.title" @input="setSlug"/>
            <!--Slug-->
            <q-input :label="`${$tr('ui.form.slug')} (${locale.language}) *`" outlined dense
                     :rules="[val => !!val || this.$tr('ui.message.fieldRequired')]"
                     type="text" v-model="locale.formTemplate.slug"/>
            <!--Summary-->
            <q-input :label="`${$tr('ui.form.summary')} (${locale.language}) *`" outlined dense
                     :rules="[val => !!val || this.$tr('ui.message.fieldRequired')]"
                     type="textarea" v-model="locale.formTemplate.summary" rows="3"/>
            <!--Description-->
            <div class="input-title">
              {{`${$tr('ui.form.description')} (${locale.language}) *`}}
            </div>
            <q-field v-model="locale.formTemplate.description" dense
                     :rules="[val => !!val || this.$tr('ui.message.fieldRequired')]">
              <q-editor v-model="locale.formTemplate.description" style="width: 100%" :toolbar="editorText.toolbar"
                        content-class="text-grey-9" toolbar-text-color="grey-9"/>
            </q-field>
            <!--Address-->
            <q-select outlined dense v-model="locale.formTemplate.address.address" use-input
                      hide-selected fill-input @input="selectAddress" input-debounce="800"
                      :options="options.maps" :label="`${$tr('ui.form.address')}`"
                      @filter="searchAddress" style="width: 100%">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!--Map-->
            <div id="mapCanvas" style="width:100%; height:300px"></div>
          </div>
          <!---Form Right-->
          <div class="col-12 col-md-4" v-if="locale.success">
            <!--Category-->
            <crud just-create @created="getCategories" type="select"
                  v-model="locale.formTemplate.categoryId" :crud-props="{
                      label : `${$tr('ui.form.category')}*`,
                      rules : [val => !!val || $tr('ui.message.fieldRequired')]}"
                  :crud-data="import('@imagina/qplace/_crud/categories')"/>
            <!--Categories-->
            <crud just-create @created="getCategories" type="select" v-model="locale.formTemplate.categories"
                  :crud-props="{label : `${$trp('ui.form.category')}`, multiple : true, useChips : true}"
                  :crud-data="import('@imagina/qplace/_crud/categories')"/>

            <!--schedules-->
            <schedules-form v-model="locale.formTemplate.schedules" class="q-mt-sm"/>
            <!--Image-->
            <media-form
              entity="Modules\Iplaces\Entities\Place"
              :entity-id="itemId ? itemId : ''"
              v-model="locale.formTemplate.mediasSingle"
              :label="`${$tr('ui.form.image')}`"
              zone="slideimage"
            />
            <!--Phone 1-->
            <q-input :label="`${$tr('ui.form.phone')} 1`" mask="phone" unmasked-value
                     v-model="locale.formTemplate.options.phone1" outlined dense/>
            <!--Phone 2-->
            <q-input :label="`${$tr('ui.form.phone')} 2`" type="number" unmasked-value
                     v-model="locale.formTemplate.options.phone2" outlined dense/>
            <!--Phone 3-->
            <q-input :label="`${$tr('ui.form.phone')} 3`" type="number" unmasked-value
                     v-model="locale.formTemplate.options.phone3" outlined dense/>
          </div>
        </q-form>
      </div>
    </div>

    <!--Buttons Actions-->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <!--Update button-->
      <q-btn v-if="itemId" color="positive" :loading="loading.page" icon="fas fa-edit"
             :label="$tr('ui.label.update')" @click="$refs.formContent.submit()"/>
      <!--Save button-->
      <q-btn-dropdown :label="buttonActions.label" split v-else :loading="loading.app"
                      content-style="min-width: 250px !important"
                      color="positive" icon="fas fa-save" @click="$refs.formContent.submit()"
                      rounded align="right">
        <q-list link>
          <q-item @click.native="buttonActions = {label : optionsFields.btn.saveAndReturn, value : 1}"
                  v-close-popup>
            {{optionsFields.btn.saveAndReturn}}
          </q-item>
          <q-item @click.native="buttonActions = {label : optionsFields.btn.saveAndCreate, value : 3}"
                  v-close-popup>
            {{optionsFields.btn.saveAndCreate}}
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-page-sticky>

    <!--Loading-->
    <inner-loading :visible="loading.page"/>
  </div>
</template>
<script>
  //Plugins
  import {required} from 'vuelidate/lib/validators'
  import {gmaps} from '@imagina/qplace/_plugins/gmaps'
  //Components
  import mediaForm from '@imagina/qmedia/_components/form'
  import recursiveList from '@imagina/qsite/_components/master/recursiveListSelect'
  import schedulesForm from '@imagina/qsite/_components/master/schedules'

  export default {
    props: {},
    components: {mediaForm, recursiveList, schedulesForm},
    watch: {},
    validations() {
      return this.getObjectValidation()
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        loading: {
          page: false,
          categories: false
        },
        configName: 'apiRoutes.qplace.places',
        itemId: false,
        map: {
          geocoder: '',
          marker: '',
          class: '',
        },
        options: {
          categories: [],
          schedules: [],
          maps: []
        },
        locale: {
          fields: {
            id: '',
            address: {
              address: '',
              latitude: '',
              longitude: ''
            },
            cityId: 0,
            zoneId: 0,
            serviceId: 0,
            provinceId: 0,
            rangeId: 0,
            gama: 0,
            quantityPerson: 0,
            weather: 0,
            housing: 0,
            transport: 0,
            userId: this.$store.state.quserAuth.userId,
            mediasSingle: {},
            options: {
              phone1: '',
              phone2: '',
              phone3: '',
            },
            categoryId: null,
            categories: [],
            schedules: false
          },
          fieldsTranslatable: {
            title: '',
            slug: '',
            description: '',
            summary: '',
            metaTitle: '',
            metaKeywords: '',
            metaDescription: ''
          },
          validations: {
            title: {required},
            slug: {required},
            summary: {required},
            description: {required},
            categoryId: {required}
          }
        },
        editorText: {
          toolbar: [
            ['bold', 'italic', 'strike', 'underline', 'removeFormat'],
            ['link'],
            [
              {
                label: 'Font Size',
                icon: 'format_size',
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
              }
            ],
            ['quote', 'unordered', 'ordered'],
            ['fullscreen']
          ]
        },
        buttonActions: {}
      }
    },
    computed: {
      //Options translatables
      optionsFields() {
        return {
          btn: {
            saveAndReturn: this.$tr('ui.message.saveAndReturn'),
            saveAndCreate: this.$tr('ui.message.saveAndCreate'),
          }
        }
      },
    },
    methods: {
      //Init
      async init() {
        //Search id in params URL
        if (this.$route.params.id) this.itemId = this.$route.params.id
        if (this.itemId) await this.getData()//Get data if is edit
        this.getCategories()//Get categories
        //Init Map
        gmaps.initializeGoogleApi(this.$store.getters['qsiteSettings/getSettingValueByName']('isite::api-maps'))
        this.initializeMap()
        //Set default button action
        this.buttonActions = {label: this.optionsFields.btn.saveAndReturn, value: 1}
      },
      //Get data item
      getData() {
        return new Promise((resolve, reject) => {
          this.loading.page = true
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            //Params
            let params = {
              refresh: true,
              params: {
                include: 'category,categories',
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(this.configName, itemId, params).then(response => {
              //Get categories ID
              let categories = []
              response.data.categories.forEach(category => {
                categories.push(category.id)
              })
              //Replace categories to response
              response.data.categories = this.$clone(categories)
              //Set response to form
              this.locale.form = this.$clone(response.data)
              this.loading.page = false
              resolve(true)//Resolve
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              this.loading.page = false
              reject(false)//Resolve
            })
          } else {
            resolve(true)//Resolve
          }
        })
      },
      //Init Map
      initializeMap() {
        setTimeout(() => {
          //MAP
          var latitude = this.locale.formTemplate.address.latitude
          var longitude = this.locale.formTemplate.address.longitude
          var OLD = new google.maps.LatLng(latitude, longitude)
          var options = {
            zoom: 16,
            center: OLD,
            mapTypeId: google.maps.MapTypeId.ROADMAP,// ROADMAP | SATELLITE | HYBRID | TERRAIN
          }

          this.map.class = new google.maps.Map(document.getElementById('mapCanvas'), options)

          //GEOCODER
          this.map.geocoder = new google.maps.Geocoder()

          this.map.marker = new google.maps.Marker({
            map: this.map.class,
            draggable: true,
            position: OLD
          })

          //Add a listener to the marker for reverse geocoding
          google.maps.event.addListener(this.map.marker, 'drag', () => {
            this.geocoder.geocode({'latLng': this.map.marker.getPosition()}, (results, status) => {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  this.locale.formTemplate.address = {
                    'address': results[0].formatted_address,
                    'longitude': results[0].geometry.location.lng(),
                    'latitude': results[0].geometry.location.lat()
                  }
                }
              }
            })
          })
        }, 500)
      },
      //Searchinto map
      searchAddress(val, update, abort) {
        let result = []
        this.map.geocoder.geocode({'address': val}, (results, status) => {
          results.forEach(address => {
            result.push({
              label: address.formatted_address,
              value: address.formatted_address,
              latitude: address.geometry.location.lat(),
              longitude: address.geometry.location.lng()
            })
          })
          update(() => {
            this.options.maps = result
          })
        })
      },
      //Get place categories
      getCategories() {
        this.loading.categories = true
        let configName = 'apiRoutes.qplace.categories'
        let params = {//Params to request
          refresh: true,
          params: {include: 'parent'},
        }
        //Request
        this.$crud.index(configName, params).then(response => {
          this.options.categories = this.$array.tree(response.data)

          if (response.data.length) {
            this.locale.fields.categoryId = response.data[0].id
          }

          this.loading.categories = false
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          this.loading.categories = false
        })
      },
      //Set address into map
      selectAddress(item, keyboard) {
        var location = new google.maps.LatLng(item.latitude, item.longitude)
        this.map.marker.setPosition(location)
        this.map.class.setCenter(location)
        this.locale.formTemplate.address = {
          'address': item.value,
          'longitude': item.longitude,
          'latitude': item.latitude
        }
      },
      //Return object to validations
      getObjectValidation() {
        let response = {}
        if (this.locale && this.locale.formValidations) {
          response = {locale: this.locale.formValidations}
        }
        return response
      },
      //Complete slug Only when is creation
      setSlug() {
        if (!this.itemId) {
          let title = this.$clone(this.locale.formTemplate.title)
          title = title.split(' ').join('-').toLowerCase()
          this.locale.formTemplate.slug = this.$clone(title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        }
      },
      //Create Product
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading.page = true
          this.$crud.create(this.configName, this.locale.form).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            this.actionAfterCreated()
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.recordNoCreated'), pos: 'bottom'})
            this.loading.page = false
          })
        }
      },
      //Action after created
      actionAfterCreated(id) {
        setTimeout(() => {
          let action = this.buttonActions.value
          switch (action) {
            case 1://redirect to index products
              this.$router.push({name: 'qplace.admin.places.index'})
              break
            case 3://Reset and init form
              this.$refs.localeComponent.vReset()
              this.loading.page = false
              break
          }
        }, 500)
      },
      //Update Product
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading.page = true
          this.$crud.update(this.configName, this.itemId, this.locale.form).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            this.$router.push({name: 'qplace.admin.places.index'})//Redirect to index
            this.loading.page = false
          }).catch(error => {
            this.loading.page = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
    }
  }
</script>
<style lang="stylus">
</style>
