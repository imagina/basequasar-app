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
          apiRoute: 'apiRoutes.qcommerce.options',
          permission: 'icommerce.options',
          create: {
            title: this.$tr('qcommerce.layout.newOption'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'description', label: this.$tr('ui.form.description'), field: 'description', align: 'rigth'},
              {name: 'type', label: this.$tr('ui.form.type'), field: 'type', align: 'left'},
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {include: ''}
          },
          update: {
            title: this.$tr('qcommerce.layout.updateOption'),
            requestParams: {include: ''},
            to : 'qcommerce.admin.options.edit',
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            description: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: `${this.$tr('ui.form.description')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            type: {
              value: null,
              type: 'select',
              isTranslatable: false,
              props : {
                label: `${this.$tr('ui.form.type')}*`,
                options : [
                    {label: 'Text', value: 'text'},
                    {label: 'Textarea', value: 'textarea'},
                    {label: 'Select', value: 'select'},
                    {label: 'Radio', value: 'radio'},
                    {label: 'Checkbox', value: 'checkbox'},
                    {label: 'Image', value: 'image'},
                    {label: 'Color', value: 'color'},
                ],
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            sortOrder: {
              value: 0,
              type: 'input',
              isTranslatable: false,
              props : {
                type : 'number',
                label: this.$tr('ui.form.sort'),
              }
            },
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    },
  }
</script>
