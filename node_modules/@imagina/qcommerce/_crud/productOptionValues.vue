<template></template>
<script>
  export default {
    data() {
      return {
        crudId: this.$uid()
      }
    },
    computed: {
      crudData () {
        return {
          crudId: this.crudId,
          apiRoute: 'apiRoutes.qcommerce.optionValues',
          permission: 'icommerce.optionvalues',
          create: {
            title: this.$tr('qcommerce.layout.newOptionValue'),
          },
          read: {
            columns: [
              { name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px' },
              {
                name: 'description', label: this.$tr('ui.form.description'),
                field: 'description', align: 'rigth'
              },
              {
                name: 'option', label: this.$tr('ui.form.option'), field: 'option',
                format: val => val && val.description || '-', align: 'left'
              },
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-'
              },
              { name: 'actions', label: this.$tr('ui.form.actions'), align: 'left' },
            ],
            requestParams: { include: 'option' },
            filters: {
              optionId: {
                value: '0',
                type: 'select',
                props : {
                  label: `${this.$tr('ui.form.option')}:`,
                  options: [
                    { label: this.$tr('ui.label.all'), value: '0' }
                  ],
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qcommerce.options',
                  select: { label: 'description', id: 'id' }
                }
              },
            }
          },
          update: {
            title: this.$tr('qcommerce.layout.updateOptionValue'),
            requestParams: { include: '' }
          },
          delete: true,
          formLeft: {
            id: { value: '' },
            userId: { value: this.$store.state.quserAuth.userId },
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
            sortOrder: {
              value: 0,
              type: 'input',
              isTranslatable: false,
              props : {
                type : 'number',
                label: this.$tr('ui.form.sort'),
              }
            },
            mediasSingle: {
              name: 'mediasSingle',
              value: {},
              type: 'media',
              props : {
                label: this.$tr('ui.form.firstImage'),
                zone: 'mainimage',
                entity: 'Modules\\Icommerce\\Entities\\OptionValue',
                enitityId: null
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
