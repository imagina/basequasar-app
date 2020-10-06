<template>
  <div class="row">
    <div class="col-12" style="width: 100%">
      <q-form
        class="q-mt-lg"
        @submit="updateOrCreateSlider(form)"
        ref="formContent"
        @validation-error="$alert.error($tr('ui.message.formInvalid'))"
        autocomplete="off">
        <q-input
          :label="`${$tr('ui.form.name')} *`"
          type="text"
          outlined
          dense
          :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
          v-model="form.name"/>
        <q-input
          :label="`${$tr('ui.form.slug')} *`"
          type="text"
          outlined
          dense
          :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
          v-model="form.systemName"/>
        <q-select
          :label="$tr('ui.form.status')"
          v-model="form.active"
          emit-value
          map-options
          :options="[
            {label : $tr('ui.label.enabled'), value : 1},
            {label : $tr('ui.label.disabled'), value : 0},
          ]"
          outlined
          dense/>
        <q-select
          class="q-mt-md"
          :label="$tr('ui.form.masterRecord')"
          v-if="canManageRecordMaster && form.options"
          emit-value
          map-options
          v-model="form.options.masterRecord"
          :options="[
            {label: this.$tr('ui.label.yes'), value: 1},
            {label: this.$tr('ui.label.no'), value: 0},
          ]"
          outlined
          dense/>
      </q-form>
      <div class="text-right">
        <q-btn
          @click="$refs.formContent.submit()"
          icon="fas fa-save"
          class="btn-small"
          color="positive"
          :label="$tr('ui.label.save')"
          unelevated
          rounded
          :loading="loading"/>
      </div>
    </div>
    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  export default {
    props: {
      form: {
        type: Object,
        default: () => {
          return {
            id: '',
            name: '',
            systemName: '',
            active: false,
            options: {
              masterRecord: 1
            }
          }
        }
      }
    },
    data() {
      return {
        loading: false
      }
    },
    computed: {
      canManageRecordMaster() {
        let response = true
        if (this.form.id && !this.$auth.hasAccess('isite.master.records.edit')) {
          response = false
        }
        if (!this.form.id && !this.$auth.hasAccess('isite.master.records.create')) {
          response = false
        }
        return response
      },
    },
    methods: {
      updateOrCreateSlider(data) {
        this.loading = true
        if (this.form.id) {
          this.$crud.update('apiRoutes.qslider.sliders', data.id, data).then(response => {
            this.$alert.info({message: this.$tr('ui.message.recordUpdated')})
            this.loading = false
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
            this.loading = false
          })
        }
      },
      hasPermissionRecordMAster(record) {
        let options = record.options || false
        let response = {
          create: true,
          edit: true,
          index: true,
          destroy: true,
        }
        if (options && parseInt(options.masterRecord)) {
          response = {
            create: this.$auth.hasAccess('isite.master.records.create'),
            edit: this.$auth.hasAccess('isite.master.records.edit'),
            index: this.$auth.hasAccess('isite.master.records.index'),
            destroy: this.$auth.hasAccess('isite.master.records.destroy')
          }
        }
        return response
      }
    }
  }
</script>

<style scoped>

</style>
