<template>
  <div>
    <div id="componentRenderForm" v-if="formData && success">
      <!--Title-->
      <div class="titleForm text-h5 col-12 text-primary text-center text-uppercase">
        {{formData.title}}
      </div>

      <!--Form-->
      <q-form @submit="sendForm()" ref="formContent" autocomplete="off"
              @validation-error="$alert.error($tr('ui.message.formInvalid'))"
              class="row q-col-gutter-x-md relative-position backend-page q-pa-md">
        <!--Load dynamic fields-->
        <div v-for="(field, key) in fields" :class="fields.length >= 6 ? 'col-12 col-md-6' : 'col-12'">
          <dynamic-field v-model="form[field.name]" :key="key" :field="field"
                         @enter="$refs.formContent.submit()" />
        </div>

        <!--captcha-->
        <captcha v-model="form.captcha" class="col-12" ref="captcha"/>

        <!--Button send form-->
        <div class="text-right col-12">
          <q-btn color="primary" name="submit" type="submit" label="Enviar"/>
        </div>

        <!--inner loading-->
        <inner-loading />
      </q-form>
    </div>

    <!--Not Found-->
    <not-result v-else />
  </div>
</template>
<script>
  //components
  import captcha from '@imagina/qsite/_components/master/captcha'

  export default {
    components : {captcha},
    props : {
      formName : {default : false}
    },
    created() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        loading: false,
        success: false,
        form: {
          captcha : false
        }
      }
    },
    computed: {
      //Return form data if exist
      formData() {
        let form = this.$store.state.qcrudMaster.show[`qform-forms-${this.formName}`]
        return form ? form.data : false
      },
      //Return field with format to load in dynamic field component
      fields() {
        let response = []
        if (this.formData && this.formData.fields) {
          this.formData.fields.forEach(item => {
            //Get daulft atributes to field
            response.push({
              name: item.name,
              value: '',
              type : 'input',
              props : {
                type: item.type,
                label: item.required ? `${item.label} *` : item.label,
                rules: item.required ? [val => !!val || this.$tr('ui.message.fieldRequired')] : []
              }
            })
          })
        }
        return response
      }
    },
    methods: {
      //Init form
      init() {
        if (this.formName) {
        }
        this.createFormModels()
      },
      //Create dynamic models of form
      createFormModels() {
        this.$set(this.form, 'formId', this.formData.id)
        this.fields.forEach(item => {
          this.$set(this.form, item.name, '')
        })
        this.success = true
      },
      //Send data form
      async sendForm() {
        this.loading = true;
        this.$crud.create('apiRoutes.qform.leads', this.form).then(response => {
          if (response.status === "error") {
            this.loading = false;
            this.$alert.error({message: 'Ha ocurrido un error al enviar el correo.'});
          } else {
            this.loading = false;
            this.$alert.success({message: 'Mensaje enviado exitosamente!'});
            this.clearForm()
          }
        }).catch(error => {
        });
      },
      //Reset Form
      clearForm() {
        this.createFormModels()
        this.$refs.captcha.reset()
        this.$refs.formContent.reset()
      }
    }
  }
</script>
<style lang="stylus">
</style>
