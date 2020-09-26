<template></template>

<script>
  export default {
    data() {
      return {
        crudId: this.$uid()
      }
    },
    computed: {
      crudData() {
        return {
          crudId: this.crudId,
          apiRoute: 'apiRoutes.qcommerce.manufacturers',
          permission: 'icommerce.manufacturers',
          create: {
            title: this.$tr('qcommerce.layout.newManufacturer'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'left'},
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            //requestParams: {include: 'parent'}
          },
          update: {
            title: this.$tr('qcommerce.layout.updateManufacturer'),
            //requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            storeId: {value: 1},
            name: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: `${this.$tr('ui.form.name')}*`,
              }
            },
            status: {
              value: null,
              type: 'select',
              isTranslatable: false,
              props : {
                  label: `${this.$tr('ui.form.status')}*`,
                  options : [
                      {label: this.$tr('ui.label.enabled'), value: 1},
                      {label: this.$tr('ui.label.disabled'), value: 0}
                  ],
                  rules: [
                      val => !!val || this.$tr('ui.message.fieldRequired')
                  ],
              }
            },
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    }
  }
</script>
