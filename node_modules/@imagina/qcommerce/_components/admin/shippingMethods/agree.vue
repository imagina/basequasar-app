<template>
  <q-dialog id="formCategory" v-model="show" v-if="show">
    <q-card class="backend-page bg-grey-1">
      <!--Header-->
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          {{`${$tr('qcommerce.layout.updateShippingMethod')}: ${item.title}`}}
        </q-toolbar-title>
        <q-btn flat v-close-popup icon="fas fa-times"/>
      </q-toolbar>

      <!--Content-->
      <div class="relative-position q-pa-md">
        <q-form @submit="updateItem" class="row q-col-gutter-x-md" ref="formContent" autocomplete="off"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <!--Language-->
          <div class="col-12 q-mb-md">
            <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
          </div>
          <!--Form left-->
          <div class="col-12 col-md-8" v-if="locale.success">
            <!--Title-->
            <q-input v-model="locale.formTemplate.title" outlined dense
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('ui.form.title')} (${locale.language})*`"/>

            <!--Description-->
            <q-input v-model="locale.formTemplate.description" outlined dense
                     :label="`${$tr('ui.form.description')} (${locale.language})*`"
                     type="textarea" rows="3" :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
          </div>
          <!--Form right-->
          <div class="col-12 col-md-4" v-if="locale.success">
            <!--Status-->
            <q-select v-model="locale.formTemplate.status"
                      :options="[
                        {label:$tr('ui.label.enabled'),value:true},
                        {label:$tr('ui.label.disabled'),value:false}
                      ]"
                      outlined dense
                      :label="$tr('ui.form.status')"/>
            <!--Main Image-->
            <div class="input-title">
              {{$tr('ui.form.image')}}
            </div>
            <upload-img
              v-model="locale.formTemplate.mediasSingle"
              entity="Modules\Icommerce\Entities\ShippingMethod"
              :entity-id="itemId ? itemId : null"
              zone='mainimage'
            />
          </div>
        </q-form>
        <!--Loading-->
        <inner-loading :visible="loading"/>
      </div>

      <!--Footer-->
      <q-toolbar color="white">
        <q-toolbar-title></q-toolbar-title>
        <!--Button Update-->
        <q-btn :label="$tr('ui.label.update')" icon="fas fa-pen" color="positive"
               :loading="loading" @click="$refs.formContent.submit()"/>
      </q-toolbar>
    </q-card>
  </q-dialog>
</template>
<script>
  //Plugins
  import _cloneDeep from 'lodash.clonedeep'
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import uploadImg from '@imagina/qmedia/_components/form'

  export default {
    props: {
      value: {default: false},
      itemId: {default: false},
      item: {
        default: () => {
          return {}
        },
      },
    },
    components: {
      uploadImg
    },
    watch: {
      value(newValue) {
        this.show = this.value
      },
      show(newValue) {
        this.$emit('input', this.show)
        this.initForm()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.show = this.value//Assign props value to show modal

      })
    },
    data() {
      return {
        show: false,
        locale: _cloneDeep(this.dataLocale),
        loading: false
      }
    },
    computed: {
      //Data locale component
      dataLocale() {
        return {
          fields: {
            init: '',
            status: false,
            mediasSingle: {}
          },
          fieldsTranslatable: {
            title: null,
            description: '',
          }
        }
      }
    },
    methods: {
      //Init form
      async initForm() {
        this.loading = true
        //If ther is category Id, request data, else set default data
        this.locale = _cloneDeep(this.dataLocale)

        //initialize item data
        if (this.item) {
          this.locale.form = _cloneDeep(this.item)
        }
        this.show = this.value//Assign props value to show modal
        this.loading = false
      },

      //update item
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let data = _cloneDeep(this.locale.form)
          data['options'] = {
            init: data['init']
          }
          //Request
          this.$crud.update('apiRoutes.qcommerce.shippingMethods', this.item.id, data).then(response => {
            this.$alert.success({message: this.$tr('ui.message.recordUpdated')})
            this.$emit('updated')
            this.loading = false
            this.show = false
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
            this.loading = false
          })
        }
      }
    }

  }
</script>
<style lang="stylus">
</style>
