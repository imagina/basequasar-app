<template>
  <div id="dynamicFieldComponent" class="backend-page" v-if="success">
    <div class="row">
      <!--Label-->
      <div class="col-6">
        <div class="input-title text-capitalize"
             v-if="['html','multiSelect'].indexOf(field.type) != -1">
          {{fieldLabel}}
        </div>
      </div>
      <!--Crud component-->
      <div class="col-6">
        <crud class="text-right q-mb-xs" :crud-data="field.create.component"
              v-if="field.create && field.create.component"
              :key="field.name" ref="crudComponent" just-create @created="getOptions"/>
      </div>
    </div>
    <!--Text-->
    <q-input v-model="responseValue" bg-color="white" outlined dense :rules="field.rules"
             v-if="['text','email'].indexOf(field.type) != -1"
             :label="fieldLabel" @keyup.enter="$emit('enter')"/>
    <!--Number-->
    <q-input v-model="responseValue" bg-color="white" v-if="field.type == 'number'"
             outlined dense :rules="field.rules" type="number" :label="fieldLabel"
             @keyup.enter="$emit('enter')"/>
    <!--Phone-->
    <q-input v-model="responseValue" bg-color="white" v-if="field.type == 'phone'" unmasked-value
             outlined dense :rules="field.rules" :label="fieldLabel"
             @keyup.enter="$emit('enter')" mask="phone"/>
    <!--Password-->
    <q-input v-model="responseValue" bg-color="white" outlined dense :rules="field.rules"
             v-if="['password','checkPassword'].indexOf(field.type) != -1"
             type="password" :label="fieldLabel" @keyup.enter="$emit('enter')"/>
    <!--Textarea-->
    <q-input v-model="responseValue" bg-color="white" v-if="field.type == 'textarea'" outlined dense
             type="textarea" rows="3" :label="fieldLabel" :rules="field.rules"/>
    <!--Chips-->
    <q-select :label="fieldLabel" bg-color="white" v-model="responseValue" use-input use-chips multiple
              hide-dropdown-icon input-debounce="0" new-value-mode="add-unique" :rules="field.rules"
              v-if="field.type == 'chips'" style="width: 100%" @input="matchTags()" outlined dense/>
    <!--Select-->
    <q-select outlined dense bg-color="white" v-model="responseValue" :options="formatOptions" :label="fieldLabel"
              style="width: 100%;" :rules="field.rules" v-if="field.type == 'select'" :loading="loading"
              :multiple="field.multiple || false" :clearable="field.clearable || false" emit-value map-options/>
    <!--Date - time - datetime-->
    <q-input dense mask="date" bg-color="white" v-model="responseValue" color="primary" :rules="field.rules"
             :label="fieldLabel" outlined placeholder="YYYY/MM/DD" v-if="field.type == 'date'">
      <template v-slot:append>
        <q-icon name="fas fa-calendar-day"/>
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date v-model="responseValue" @input="() => $refs.qDateProxy.hide()"/>
        </q-popup-proxy>
      </template>
    </q-input>
    <!--HTML-->
    <q-field v-model="responseValue" borderless :rules="field.rules" v-if="field.type == 'html'">
      <q-editor v-model="responseValue" class="full-width" :toolbar="editorText.toolbar"
                content-class="text-grey-9" toolbar-text-color="grey-9"/>
    </q-field>
    <!--multiSelect-->
    <q-field dense v-model="responseValue" borderless :rules="field.rules" v-if="field.type == 'multiSelect'">
      <recursive-select v-model="responseValue" class="bg-white full-width" :items="options"/>
    </q-field>
    <!--Checkbox-->
    <q-field v-model="responseValue" borderless :rules="field.rules" v-if="field.type == 'checkbox'">
      <q-checkbox v-model="responseValue" class="q-my-sm" :label="fieldLabel"/>
    </q-field>
    <!--Media-->
    <q-field v-model="responseValue" borderless :rules="field.rules" v-if="field.type == 'media'">
      <upload-img
        class="bg-white"
        :multiple="field.zone == 'gallery'"
        :entity="field.entity"
        :entity-id="field.enitityId || itemId"
        v-model="responseValue"
        :label="field.label"
        :zone="field.zone"
      />
    </q-field>
    <!--Manage Permission-->
    <manage-permissions v-model="responseValue" class="q-mb-sm" v-if="field.type == 'permissions'"
                        @input="watchValue" :get-all="field.getAll ? true : false"/>
    <!--Manage Settings-->
    <manage-settings v-model="responseValue" class="q-mb-sm" :settings="field.settings"
                     v-if="field.type == 'settings'" @input="watchValue"/>
  </div>
</template>
<script>
  //Component
  import recursiveSelect from 'src/components/master/recursiveListSelect'
  import managePermissions from '@imagina/qsite/_components/managePermissions'
  import manageSettings from '@imagina/qsite/_components/manageSettings'
  import uploadImg from '@imagina/qmedia/_components/form'

  export default {
    name: 'dynamicField',
    beforeDestroy() {
      //Close listen event
      if (this.$refs.crudComponent) {
        this.$root.$off(`crudForm${this.$refs.crudComponent.params.apiRoute}Created`)
      }
    },
    props: {
      value: {default: false},
      field: {default: false},
      language: {default: false},
      itemId: {default: ''}
    },
    components: {managePermissions, manageSettings, recursiveSelect, uploadImg},
    watch: {
      value(newValue, oldValue) {
        if (newValue != oldValue) {
          this.setDefaultVModel(newValue)
        }//Order Value
      },
      responseValue(value) {
        this.watchValue(value)
      }
    },
    validations() {
      return {}
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        success: false,//global component status
        loading: false,
        responseValue: null,//value to response
        options: [],//Options
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
      }
    },
    computed: {
      //Return label to field
      fieldLabel() {
        let response = ''
        if (this.field.label) {
          response = this.field.label
          if (this.field.isTranslatable) response = `${response} (${this.language})`
        }
        return response
      },
      //Return format of datetime
      formatDateTime() {
        let response = ''

        if (this.field.type == 'date') response = 'MMM DD, YYYY'
        if (this.field.type == 'time') response = 'HH:mm a'
        if (this.field.type == 'datetime') response = 'MMM DD, YYYY - HH:mm a'

        return response
      },
      //Convert value of options to string
      formatOptions() {
        let options = this.$clone(this.options)

        //Convert to string
        options.forEach(item => {
          if (item.value || item.value >= 0) item.value = item.value.toString()
        })

        return options
      }
    },
    methods: {
      //initi
      async init() {
        if (this.field.type) {
          this.setDefaultVModel(this.field.value)//Set default values by field type
          this.listenEventCrud()//config dynamic component
          this.success = true//sucess
          //Set options if is type select
          if (['select', 'multiSelect'].indexOf(this.field.type) != -1) {
            if (this.field.loadOptions) {
              await this.getOptions()
            }//Get options
            else if (this.field.options) this.options = this.field.options
          }
        }
      },
      //Set default values by type
      setDefaultVModel(value) {
        let propValue = this.$clone(value)
        switch (this.field.type) {
          case 'text':
            this.responseValue = propValue || null
            break
          case 'number':
            this.responseValue = (propValue >= 0) ? propValue : null
            break
          case 'textarea':
            this.responseValue = propValue || null
            break
          case 'chips':
            this.responseValue = propValue || []
            break
          case 'html':
            this.responseValue = propValue || ''
            break
          case 'select':
            this.responseValue = (propValue != undefined) ? propValue.toString() : null
            break
          case 'multiSelect':
            this.responseValue = propValue || []
            break
          case 'checkbox':
            this.responseValue = propValue || false
            break
          case 'media':
            this.responseValue = propValue || {}
            break
          case 'permissions':
            this.responseValue = (propValue.length == undefined) ? propValue : {}
            break
          case 'settings':
            this.responseValue = propValue || {}
            break
          default :
            ''
            this.responseValue = propValue || null
            break
        }
        this.orderOptions()//Order Value
      },
      //Order options if is a object
      orderOptions() {
        //If field is select, order values
        if (['select', 'multiSelect'].indexOf(this.field.type) != -1) {
          if (Array.isArray(this.responseValue) && this.responseValue.length) {
            if (this.responseValue[0].id) {
              let values = []
              this.responseValue.forEach(item => {
                values.push(item.id)
              })
              this.responseValue = this.$clone(values)
            }
          }
        }
      },
      //Config dynamic component
      listenEventCrud() {
        setTimeout(() => {
          if (this.field.create && this.field.create.component) {
            let componentCrud = this.$refs.crudComponent
            if (componentCrud) {
              //Activate listen to chanel
              this.$root.$on(`crudForm${componentCrud.params.apiRoute}Created`, async () => {
                this.getOptions()//Get options
              })
            }
          }
        }, 500)
      },
      //Get options if is load options
      getOptions() {
        return new Promise((resolve, reject) => {
          let loadOptions = this.$clone(this.field.loadOptions)
          this.loading = true//Open loading

          //==== Request options
          if (loadOptions.apiRoute) {
            this.options = []//Reset options
            let fieldSelect = {label: 'title', id: 'id'}

            let params = {//Params to request
              refresh: true,
              params: loadOptions.requestParams || {}
            }

            //add filter
            if (!params.params.filter) params.params.filter = {}
            params.params.filter.allTranslations = true

            //Request
            this.$crud.index(loadOptions.apiRoute, params).then(response => {
              let formatedOptions = []
              //Format response as tree
              formatedOptions = this.$array.tree(response.data, loadOptions.select || fieldSelect)

              //Assign options
              this.options = this.$clone((this.field.options || []).concat(formatedOptions))//set option
              this.loading = false
              resolve(true)
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              this.loading = false
              reject(true)
            })
            //==== Delayed loading options
          } else if (loadOptions.delayed) {
            loadOptions.delayed.then(response => {
              this.options = this.$clone(response)
              this.loading = false
              resolve(true)
            }).catch(error => {
              this.loading = false
              resolve(true)
            })
          } else {
            this.loading = false
            resolve(true)
          }
        })
      },
      //Reges to tags
      matchTags() {
        let tags = []
        //only letters and spaces
        this.responseValue.forEach((tag, index) => {
          let tagString = tag.trim()//Trim
          tagString = tagString.match(/^[a-zA-Z\-\s]*$/)//Regex
          if (tagString && tagString.length) tags.push(tagString.join(''))
        })
        this.responseValue = this.$clone(tags)
      },
      //Check if value change
      watchValue() {
        let value = this.$clone(this.value)
        let response = this.$clone(this.responseValue)

        if (JSON.stringify(value) !== JSON.stringify(response)) {
          this.$emit('input', response)
        }
      }
    }
  }
</script>
<style lang="stylus">
</style>
