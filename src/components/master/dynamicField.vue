<template>
  <div id="dynamicFieldComponent" class="backend-page q-mt-xs" v-if="success">
    <!--Label-->
    <div class="input-title capitalize"
         v-if="['select','html','multiSelect'].indexOf(field.type) != -1">
      <!--Label-->
      {{fieldLabel}}
      <!--Crud component-->
      <crud :crud-data="field.create.component" v-if="field.create && field.create.component"
            :key="field.name" ref="crudComponent" just-create @created="getOptions"/>
    </div>
    <!--Text-->
    <q-input v-model="responseValue"
             v-if="['text','email'].indexOf(field.type) != -1"
             :stack-label="fieldLabel" @keyup.enter="$emit('enter')"/>
    <!--Number-->
    <q-input v-model="responseValue" v-if="field.type == 'number'"
             type="number" :stack-label="fieldLabel" @keyup.enter="$emit('enter')"/>
    <!--Password-->
    <q-input v-model="responseValue"
             v-if="['password','checkPassword'].indexOf(field.type) != -1"
             type="password" :stack-label="fieldLabel" @keyup.enter="$emit('enter')"/>
    <!--Textarea-->
    <q-input v-model="responseValue" v-if="field.type == 'textarea'"
             type="textarea" rows="3" :stack-label="fieldLabel"/>
    <!--Chips-->
    <q-chips-input v-model="responseValue" v-if="field.type == 'chips'"
                   :stack-label="fieldLabel" @input="matchTags()"/>
    <!--Date - time - datetime-->
    <q-datetime v-if="['date','time','datetime'].indexOf(field.type) != -1"
                :format="field.format || formatDateTime"
                v-model="responseValue" :type="field.type" :stack-label="fieldLabel"/>
    <!--HTML-->
    <q-editor v-model="responseValue" v-if="field.type == 'html'"
              :toolbar="editorText.toolbar"/>
    <!--multiSelect-->
    <recursive-select v-if="field.type == 'multiSelect'"
                      v-model="responseValue" :items="options"/>
    <!--Checkbox-->
    <q-checkbox v-model="responseValue" class="q-my-sm"
                v-if="field.type == 'checkbox'" :label="fieldLabel"/>
    <!--Select-->
    <tree-select
      :multiple="field.multiple || false"
      v-if="field.type == 'select'"
      :clearable="field.clearable || false"
      :options="options"
      :append-to-body="true"
      :value-consists-of="field.valueConsistsOf || 'BRANCH_PRIORITY'"
      v-model="responseValue"
      placeholder=""
    >
      <label slot="option-label" slot-scope="{node}" class="q-px-sm capitalize">
        {{node.label.toLowerCase()}}
      </label>
    </tree-select>
    <!--Media-->
    <upload-img
      :multiple="field.zone == 'gallery'"
      v-if="field.type == 'media'"
      :entity="field.entity"
      :entity-id="field.enitityId || itemId"
      v-model="responseValue"
      :label="field.label"
      :zone="field.zone"
    />
    <!--Manage Permission-->
    <manage-permissions v-model="responseValue" class="q-mt-sm" v-if="field.type == 'permissions'"
                        @input="watchValue" :get-all="field.getAll ? true : false"/>
    <!--Manage Settings-->
    <manage-settings v-model="responseValue" class="q-mt-sm" :settings="field.settings"
                     v-if="field.type == 'settings'" @input="watchValue"/>
    <!--Loading-->
    <q-progress
      v-if="loading"
      indeterminate
      color="blue-grey"
      style="height: 2px"
    />
  </div>
</template>
<script>
  //Component
  import uploadImg from '@imagina/qmedia/_components/form'
  import recursiveSelect from 'src/components/master/recursiveListSelect'
  import managePermissions from '@imagina/qsite/_components/managePermissions'
  import manageSettings from '@imagina/qsite/_components/manageSettings'

  export default {
    name: 'dynamicField',
    beforeDestroy() {
      //Close listen event
      if (this.$refs.crudComponent)
        this.$root.$off(`crudForm${this.$refs.crudComponent.params.apiRoute}Created`)
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
        if (newValue != oldValue)
          this.setDefaultVModel(newValue)//Order Value
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
          if (this.field.isRequired) response = `${response} *`
        }
        return response
      },
      //Return format of datetime
      formatDateTime(){
        let response = ''

        if(this.field.type == 'date') response = 'MMM DD, YYYY'
        if(this.field.type == 'time') response = 'HH:mm a'
        if(this.field.type == 'datetime') response = 'MMM DD, YYYY - HH:mm a'

        return response
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
          if (['select', 'multiSelect'].indexOf(this.field.type) != -1)
            if (this.field.loadOptions) await this.getOptions()//Get options
            else if (this.field.options) this.options = this.field.options
        }
      },
      //Set default values by type
      setDefaultVModel(value) {
        let propValue = this.$clone(value)
        switch (this.field.type) {
          case 'text':
            this.responseValue = propValue || null
            break;
          case 'number':
            this.responseValue = (propValue >= 0) ? propValue : null
            break;
          case 'textarea':
            this.responseValue = propValue || null
            break;
          case 'chips':
            this.responseValue = propValue || []
            break;
          case 'html':
            this.responseValue = propValue || ''
            break;
          case 'select':
            this.responseValue = (propValue != undefined) ? propValue : null
            break;
          case 'multiSelect':
            this.responseValue = propValue || []
            break;
          case 'checkbox':
            this.responseValue = propValue || false
            break;
          case 'media':
            this.responseValue = propValue || {}
            break;
          case 'permissions':
            this.responseValue = (propValue.length == undefined) ? propValue : {}
            break;
          case 'settings':
            this.responseValue = propValue || {}
            break;
          default :
            ''
            this.responseValue = propValue || null
            break;
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
              if (this.field.tree == false) {
                formatedOptions = this.$helper.array.select(response.data, loadOptions.select || fieldSelect)
                //Format response as select
              } else
                formatedOptions = this.$helper.array.tree(response.data, loadOptions.select || fieldSelect)

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
  @import "~variables";
</style>
