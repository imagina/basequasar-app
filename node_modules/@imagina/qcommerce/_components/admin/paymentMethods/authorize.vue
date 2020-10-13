<template>
  <q-dialog id="formCategory" v-model="show" v-if="show"
            no-esc-dismiss no-backdrop-dismiss class="backend-page">
    <q-card class="backend-page bg-grey-1">
      <!--Header-->
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          {{`${$tr('qcommerce.layout.updatePaymentMethod')}: ${item.title}`}}
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
            <div class="input-title">
              {{`${$tr('ui.form.description')} (${locale.language})*`}}
            </div>
            <q-input v-model="locale.formTemplate.description" type="textarea" rows="3" outlined dense
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>

            <!--Api Login-->
            <q-input v-model="locale.formTemplate.apiLogin" outlined dense
                     :label="$tr('qcommerce.layout.form.apilogin')"/>

            <!--Transaction Key-->
            <q-input v-model="locale.formTemplate.transactionKey" outlined dense
                     :label="$tr('qcommerce.layout.form.transactionKey')"/>

            <!--Client Key-->
            <q-input v-model="locale.formTemplate.clientKey" outlined dense
                     :label="$tr('qcommerce.layout.form.clientKey')"/>
          </div>
          <!--Form right-->
          <div class="col-12 col-md-4" v-if="locale.success">
            <!--Mode-->
            <q-select v-model="locale.formTemplate.mode"
                      :options="[
                        {label:'SANDBOX',value:'sandbox'},
                        {label:'LIVE',value:'live'}
                        ]"
                      outlined dense emit-value
                      :label="$tr('qcommerce.layout.form.mode')"/>
            <!--Status-->
            <q-select v-model="locale.formTemplate.status"
                      :options="[
                        {label:$tr('ui.label.enabled'),value:true},
                        {label:$tr('ui.label.disabled'),value:false}
                        ]"
                      outlined dense emit-value
                      :label="$tr('ui.form.status')"/>
            <!--Main Image-->
            <div class="input-title">
              {{$tr('ui.form.image')}}
            </div>
            <upload-img
              v-model="locale.formTemplate.mediasSingle"
              entity="Modules\Icommerce\Entities\PaymentMethod"
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

  //Components
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
    components: {uploadImg},
    watch: {
      value(newValue) {
        this.show = this.value
      },
      show(newValue) {
        this.$emit('input', this.show)
        this.initForm()
      },
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
            apiLogin: '',
            transactionKey: '',
            clientKey: '',
            mode: 'sandbox',
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
            apiLogin: data.apiLogin,
            transactionKey: data.transactionKey,
            clientKey: data.clientKey,
            mode: data.mode,
            init: data['init']
          }
          //Request
          this.$crud.update('apiRoutes.qcommerce.paymentMethods', this.item.id, data).then(response => {
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
