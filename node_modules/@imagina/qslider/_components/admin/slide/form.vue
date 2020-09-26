<template>
  <div class="row relative-position"  v-if="success">
    <div class="col-12 q-mb-md">
      <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
    </div>
    <q-form
      @submit="itemId ? updateItem() : createItem()"
      ref="formContent"
      class="row q-col-gutter-x-md full-width"
      autocomplete="off"
      @validation-error="$alert.error($tr('ui.message.formInvalid'))">
      <!--Form left-->
      <div class="col-7 q-gutter-y-md" v-if="locale.success">
  
        <q-input
          :label="`${$tr('ui.form.title')} (${locale.language}) `"
          type="text" v-model="locale.formTemplate.title" outlined dense/>
        <q-input
          :label="`${$tr('ui.form.caption')} (${locale.language}) `"
          type="text" outlined dense
          v-model="locale.formTemplate.caption"/>
        <q-input
          :label="'URI ('+locale.language+')'" outlined dense
          type="text" v-model="locale.formTemplate.uri"/>
        <q-input
          :label="'URL ('+locale.language+')'" type="text"
          v-model="locale.formTemplate.url" outlined dense/>
        <q-input
          :label="`${$tr('ui.form.image')} URL (${locale.language}) `"
          type="text" outlined dense
          v-model="locale.formTemplate.externalImageUrl"/>
        <q-editor
          :label="`${$tr('ui.form.description')} (${locale.language}) `"
          v-model="locale.formTemplate.customHtml" style="width: 100%"/>
      
      </div>
      <!--Form Right-->
      <div class="col-5 q-gutter-y-md" v-if="locale.success">
  
        <q-select
          v-model="locale.formTemplate.options.masterRecord"
          :label="$tr('ui.form.masterRecord')"
          v-if="canManageRecordMaster" outlined dense
          emit-value map-options
          :options="[
          {label: this.$tr('ui.label.yes'), value: 1},
          {label: this.$tr('ui.label.no'), value: 0},
        ]"/>
        <q-select
          :label="`${$tr('ui.form.status')} (${locale.language})`"
          v-model="locale.formTemplate.active" outlined dense
          emit-value map-options
          :options="[
            {label : $tr('ui.label.enabled'), value : true},
            {label : $tr('ui.label.disabled'), value : false},
          ]"/>
        <q-select
          :label="`${$tr('ui.form.option')}`" v-model="locale.formTemplate.target"
          emit-value map-options
          outlined dense :options="[
            {value: '_self', label: 'Same tab'},
            {value: '_blank', label: 'New tab'}
          ]"/>
        <q-select
          :label="`${$tr('ui.form.type')}`" v-model="locale.formTemplate.type"
          emit-value map-options
          outlined dense :options="[
            {value: 'auto', label: 'Auto'},
            {value: '360', label: '360'},
            {value: 'video', label: 'Video'},
            {value: 'image', label: 'Image'}
          ]"/>
        <div class="input-title">{{`${$tr('ui.form.image')}`}}</div>
        <mediaForm
          entity="Modules\Slider\Entities\Slide"
          :entity-id="itemId ? itemId : ''"
          v-model="locale.formTemplate.mediasSingle"
          zone="slideimage"
          :key="mediaKey"
        />
      </div>
      <div class="col-12 text-right">
        <q-btn
          v-if="itemId" color="positive"
          :loading="loading"
          icon="fas fa-edit"
          :label="$tr('ui.label.update')"
          type="submit"
          rounded/>
        <q-btn
          v-else color="positive"
          :loading="loading"
          icon="fas fa-edit"
          :label="$tr('ui.label.create')" type="submit" rounded/>
      </div>
    </q-form>
    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  import mediaForm from '@imagina/qmedia/_components/form'
  
  export default {
    components:{
      mediaForm
    },
    watch: {
      $route(to, from) {
        this.initForm()
      }
    },
    mounted() {
      this.$nextTick( () => {
        this.initForm()
      })
    },
    data () {
      return {
        locale: {},
        loading: false,
        success: false,
        itemId: false,
        mediaKey: this.$uid(),
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            sliderId: this.$route.params.sliderId,
            target: null,
            type: 'auto',
            mediasSingle: {},
            externalImageUrl: '',
            options: {
              masterRecord: 0
            }
          },
          fieldsTranslatable: {
            title: '',
            caption: '',
            active: true,
            url: '',
            uri: '',
            customHtml: '',
          }
        }
      },
      canManageRecordMaster () {
        let response = true
        if (this.$route.params.sliderId.id && !this.$auth.hasAccess('isite.master.records.edit')) {
          response = false
        }
        if (!this.$route.params.sliderId.id && !this.$auth.hasAccess('isite.master.records.create')) {
          response = false
        }
        return response
      },
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        this.itemId = this.$route.params.id
        if (this.locale.success) this.$refs.localeComponent.vReset()
        await this.getData()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qslider.slides'
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
          let configName = 'apiRoutes.qslider.slides'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')} ID: ${response.data.id}`})
            this.$router.push({name: 'qslider.admin.sliders.show', params: {id: this.$route.params.sliderId}})
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoCreated'), pos: 'bottom'})
          })
        }
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qslider.slides'
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

<style scoped>

</style>
