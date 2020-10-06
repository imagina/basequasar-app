<template>
  <div
    id="pageId"
    class="q-layout-page layout-padding">
    <div class="relative-position q-mb-lg backend-page">
      <div class="box">
        <div class="row gutter-x-sm" v-if="success">

          <!--Language-->
          <div class="col-12">
            <locales v-model="locale" ref="localeComponent" @validate="$v.$touch()"/>
          </div>

          <!--Form left-->
          <div class="col-12 col-md-8" v-if="locale.success">

            <q-field
              class="q-mt-sm"
              :error="$v.locale.formTemplate.name.$error"
              :error-label="$tr('ui.message.fieldRequired')">
              <q-input
                v-model="locale.formTemplate.name"
                :stack-label="`${$tr('ui.form.name')}*`"/>
            </q-field>

            <q-field
              :error="$v.locale.formTemplate.label.$error"
              :error-label="$tr('ui.message.fieldRequired')">
              <q-input
                v-model="locale.formTemplate.label"
                :stack-label="`${$tr('qform.layout.form.label')} (${locale.language})*`"/>
            </q-field>

            <q-field
              :error="$v.locale.formTemplate.placeholder.$error"
              :error-label="$tr('ui.message.fieldRequired')">
              <q-input
                v-model="locale.formTemplate.placeholder"
                :stack-label="`${$tr('qform.layout.form.placeholder')} (${locale.language})*`"/>
            </q-field>

            <q-field
              :error="$v.locale.formTemplate.description.$error"
              :error-label="$tr('ui.message.fieldRequired')">
              <q-input
                v-model="locale.formTemplate.description"
                :stack-label="`${$tr('ui.form.description')} (${locale.language})*`"/>
            </q-field>

            <div class="input-title">{{$tr('ui.form.type')}}</div>
            <tree-select
              v-model="locale.formTemplate.type"
              :clearable="false"
              :options="types"
              placeholder=""/>

            <div v-if="locale.formTemplate.type == 5 || locale.formTemplate.type == 6 || locale.formTemplate.type == 8">
              <optionsForSelect :model="locale.formTemplate"/>
            </div>

          </div>

          <!--Form right-->
          <div class="col-12 col-md-4" v-if="locale.success">

            <div class="input-title q-mt-xs">{{$tr('qform.layout.form.form')}}</div>
            <tree-select
              v-model="locale.formTemplate.formId"
              :clearable="false"
              :options="forms"
              placeholder=""/>

            <q-checkbox
              :label="$tr('ui.form.required')"
              v-model="locale.formTemplate.required"
              class="q-mt-lg"/>

            <q-field>
              <q-input
                v-model="locale.formTemplate.order"
                :stack-label="`${$tr('qform.layout.form.order')}`"/>
            </q-field>

          </div>
        </div>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        v-if="productId"
        color="positive" :loading="loading"
        icon="fas fa-edit" :label="$tr('ui.label.update')" @click="updateItem()"
        rounded/>
      <q-btn
        v-else
        color="positive" :loading="loading"
        icon="fas fa-edit" :label="$tr('ui.label.create')" @click="createItem()"
        rounded/>
    </q-page-sticky>

    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  import optionsForSelect from '@imagina/qform/_components/admin/fields/optionsForSelect'

  //Plugins
  import _cloneDeep from 'lodash.clonedeep'
  import {required} from 'vuelidate/lib/validators'
  import {scroll} from 'quasar'

  const {getScrollTarget, setScrollPosition} = scroll

  export default {
    components: {
      optionsForSelect,
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
    validations() {
      return this.getObjectValidation()
    },
    data() {
      return {
        locale: {},
        vTab: 'data',
        loading: false,
        loadingCategory: false,
        success: false,
        productId: false,
        optionsTemplate: {
          categories: [],
          products: [],
          relatedProducts: []
        },
        buttonActions: {label: '', value: 1},
        modalShow: {
          category: false
        },
        types: [],
        forms: [],
        fields: [],
      }
    },
    computed: {
      //Data locale component
      dataLocale() {
        return {
          fields: {
            type: null,
            name: '',
            required: false,
            formId: this.$route.params.formId,
            selectable: [],
            order: 0,
          },
          fieldsTranslatable: {
            label: '',
            placeholder: '',
            description: '',
          },
          validations: {
            name: {required},
            type: {required},
            required: {required},
            formId: {required},
            label: {required},
            placeholder: {required},
            description: {required},
          },
        }
      },
      //Check if update options
      updateOptions() {
        if (this.$route.params.editOptions)
          setTimeout(() => {
            this.vTab = 'options'
            let target = getScrollTarget(this.$refs.productFormPage)
            let offset = this.$refs.productFormPage.scrollHeight
            setScrollPosition(target, offset, 1000)
          }, 500)
      },
      //Options translatables
      options() {
        return {
        }
      },
      //Has manage master record
      canManageRecordMaster(){
        return true
      }
    },
    methods: {
      //Init Form
      async initForm() {
        this.loading = true
        this.success = false//Disable status of page
        this.vTab = 'data'
        this.locale = _cloneDeep(this.dataLocale)//Add fields
        this.productId = this.$route.params.id//Update param from route
        if (this.locale.success) this.$refs.localeComponent.vReset()//Reset locale
        await this.getData()//Get Data Item
        this.$v.$reset()//Reset validations
        this.getTypes()
        this.getForms()
        this.getFields()
        this.success = true//Activate status of page
        this.updateOptions
        this.loading = false
      },
      //Get product if is edit
      getData() {
        return new Promise((resolve, reject) => {
          const productId = _cloneDeep(this.productId)
          if (productId) {
            let configName = 'apiRoutes.qform.fields'
            //Params
            let params = {
              refresh: true,
              params: {
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, productId, params).then(response => {
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
      //order data item to locale component
      orderDataItemToLocale(data) {
        let orderData = _cloneDeep(data)
        this.locale.form = _cloneDeep(orderData)
      },
      //Create Product
      createItem() {
        this.$refs.localeComponent.vTouch()//Validate component locales
        //Check validations
        if (!this.$v.$error) {
          this.loading = true
          let configName = 'apiRoutes.qform.fields'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')} ID: ${response.data.id}`})
            //this.$router.push({name: 'qform.admin.fields.index'})
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoCreated'), pos: 'bottom'})
          })
        } else {
          this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
        }
      },
      //Update Product
      updateItem() {
        this.$refs.localeComponent.vTouch()//Validate component locales
        //Check validations
        if (!this.$v.$error) {
          this.loading = true
          let configName = 'apiRoutes.qform.fields'
          this.$crud.update(configName, this.productId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            this.initForm()
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        } else {
          this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
        }
      },
      //Get just values not null from form
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
      //Action after created

      //Return object to validations
      getObjectValidation() {
        let response = {}
        if (this.locale && this.locale.formValidations)
          response = {locale: this.locale.formValidations}
        return response
      },
      getTypes() {
        this.loading = true
        let params = { params: {} }
        this.$crud.index('apiRoutes.qform.types', params)
          .then( response => {
            this.types = response.data.map( item => {
              return {
                id: item.id,
                label: item.name
              }
            })
            this.loading = false
          })
          .catch( error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
          })
      },
      getForms() {
        this.loading = true
        let params = { params: {} }
        this.$crud.index('apiRoutes.qform.forms', params)
          .then( response => {
            this.forms = response.data.map( item => {
              return {
                id: item.id,
                label: item.title
              }
            })
            this.loading = false
          })
          .catch( error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
          })
      },
      getFields() {
        this.loading = true
        let params = { params: {} }
        this.$crud.index('apiRoutes.qform.fields', params)
          .then( response => {
            this.fields = response.data.map( item => {
              return {
                id: item.id,
                label: item.label
              }
            })
            this.loading = false
          })
          .catch( error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
          })
      },
    }
  }
</script>
