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
          apiRoute: 'apiRoutes.qcommerce.taxRates',
          //permission: 'icommerce.manufacturers',
          create: {
            title: this.$tr('qcommerce.layout.newTaxRate'),
            //to: {name: 'qcommerce.admin.taxRates.create'}
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'left'},
              {name: 'rate', label: this.$tr('qcommerce.layout.form.rate'), field: 'rate', align: 'left'},
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            //requestParams: {include: 'parent'}
          },
          update: {
            title: this.$tr('qcommerce.layout.updateTaxRate'),
            //to: 'qcommerce.admin.taxRates.edit'
            //requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            storeId: {
              value: 1
            },
            customer: {
              value: 0
            },
            name: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: `${this.$tr('ui.form.name')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            rate: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qcommerce.layout.form.rate')}*`,
                type: 'number',
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            type: {
              value: '',
              type: 'select',
              isTranslatable: false,
              props : {
                label: `${this.$tr('ui.form.type')}*`,
                options: [
                  {label: this.$tr('qcommerce.layout.options.fixedValue'), value: '0'},
                  {label: this.$tr('qcommerce.layout.options.percentage'), value: '1'},
                ],
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            geozoneId: {
              value: null,
              type: 'select',
              loadOptions: {
                  apiRoute: 'apiRoutes.qlocations.geozones',
                  select: {label: 'name', id: 'id'},
              },
              props: {
                  label: this.$tr('qlocations.layout.form.geozone'),
                  clearable: true,
              },
            },
          },
          /*formRight: {
            mediasSingle: {
              name: 'mediasSingle',
              value: {},
              type: 'media',
              props : {
                label: this.$tr('ui.form.firstImage'),
                zone: 'mainimage',
                entity: "Modules\\Icommerce\\Entities\\Store",
                enitityId: null
              }
            },
          },*/
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    }
  }
</script>
