<template>
  <div class="row gutter-x-sm relative-position q-mb-lg">
    <div class="col-12" v-if="success">
      <div class="row">
        <div class="col-12 q-mb-md">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
        </div>
        <q-form @submit="itemId ? updateItem() : createItem()"
                ref="formContent" class="row q-col-gutter-x-sm full-width" autocomplete="off"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <!--Form left-->
          <div class="col-12" v-if="locale.success">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input outlined dense v-model="locale.formTemplate.description"
                         :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                         :label="`${$tr('ui.form.description')} (${locale.language})*`"/>
                <q-select outlined dense v-model="locale.formTemplate.options.type"
                          :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                          :label="`${$tr('ui.form.type')} *`"
                          :options="typeOptions"
                          map-options
                          emit-value
                />
                <div class="row q-col-gutter-xs" v-if="locale.form.options.type == 3">
                  <div class="col-8 col-md-10">
                    <q-input outlined dense v-model="locale.formTemplate.options.color"
                             :rules="['anyColor']"
                             :label="`${$tr('qcommerce.layout.form.color')} *`">
                      <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-color v-model="locale.formTemplate.options.color"/>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-4 col-md-2">
                    <q-chip class="full-width no-border-radius q-ma-none"
                            :style="'height: 40px;background-color: '+locale.formTemplate.options.color"/>
                  </div>
                </div>
                <div v-if="locale.form.options.type == 2" class="relative-position">
                  <div class="input-title">{{$tr('ui.form.image')}}</div>
                  <upload-media
                    v-model="locale.formTemplate.mediasSingle"
                    entity="Modules\Icommerce\Entities\OptionValue"
                    :entity-id="itemId || null"
                    zone='mainimage'
                  />
                </div>
              </div>
            </div>
          </div>
          <!--Button Actions-->
          <div class="col-12 text-right">
            <q-btn color="positive" :loading="loading" icon="fas fa-edit"
                   :label="itemId ? $tr('ui.label.update') : $tr('ui.label.create') " type="submit" rounded/>
          </div>
        </q-form>
      </div>
    </div>
    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'
  import uploadMedia from '@imagina/qmedia/_components/form'

  export default {
    components: {
      uploadMedia
    },
    watch: {
      $route(to, from) {
        this.initForm()
      },
      id() {
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
        loading: false,
        success: false,
        users: [],
        itemId: false,
        optionValues: [],
        pages: [],
        typeOptions: [
          {label: this.$tr('ui.label.text'), value: 1},
          {label: this.$tr('ui.label.image'), value: 2},
          {label: this.$tr('qcommerce.layout.form.color'), value: 3},
        ]
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            optionId: this.optionId || this.$route.params.optionId,
            sortOrder: 1,
            options: {
              type: 1,
              color: '#000000',
            },
            mediasSingle: {},
            mediasMulti: {},
          },
          fieldsTranslatable: {
            description: '',
          }
        }
      }
    },
    props: {
      optionId: {
        default: 0,
      },
      id: {
        default: 0,
      }
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        if (this.id == 0) {
          this.itemId = this.$route.params.id || 0
        } else {
          this.itemId = this.id > -1 ? this.id : 0
        }
        if (this.locale.success) this.$refs.localeComponent.vReset()
        await this.getData()
        this.getoptionValues()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          //console.warn(itemId)
          if (itemId > 0) {
            let configName = 'apiRoutes.qcommerce.optionValues'
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
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qcommerce.optionValues'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')} ID: ${response.data.id}`})
            if (this.$route.params.optionId) {
              this.$router.push({name: 'qcommerce.admin.options.edit', params: {id: this.$route.params.optionId}})
            }
            this.$emit('updated')
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoCreated'), pos: 'bottom'})
          })
        }
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qcommerce.optionValues'
          this.$crud.update(configName, this.itemId, this.getDataForm()).then(response => {
            this.$emit('updated')
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
      getoptionValues() {
        return new Promise((resolve, reject) => {
          let configName = 'apiRoutes.qcommerce.optionValues'
          let params = {//Params to request
            refresh: true,
            params: {
              filter: {
                allTranslations: true,
                optionId: this.$route.params.optionId || this.optionId
              }
            },
          }
          //Request
          this.$crud.index(configName, params).then(response => {
            this.optionValues = this.$array.tree(response.data)
            resolve(true)
          }).catch(error => {
            this.$alert.error('Failed: ' + error, 'bottom')
            reject(true)
          })
        })
      },
      arrayUnique(arrayWithRepeats) {
        return arrayWithRepeats.filter((currentValue, currentIndex, newArray) => {
          return newArray.findIndex(
            valueOfArray => JSON.stringify(valueOfArray) === JSON.stringify(currentValue)
          ) === currentIndex
        });
      },
    }
  }
</script>
