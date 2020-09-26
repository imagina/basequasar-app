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
          apiRoute: 'apiRoutes.qlocations.provinces',
          //permission: 'icommerce.manufacturers',
          create: {
            title: this.$tr('qlocations.layout.newProvince'),
            //to: {name: 'qcommerce.admin.taxRates.create'}
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
            filters:{
              country: {
                value: null,
                type: 'select',
                props : {
                  label: this.$tr('qlocations.layout.form.country'),
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qlocations.countries',
                  select: {label: 'name', id: 'id'},
                }
              },
            }
          },
          update: {
            title: this.$tr('qlocations.layout.updateProvince'),
            //to: 'qcommerce.admin.taxRates.edit'
            //requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
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
            iso2: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.iso2')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            countryId: {
              value: 48,
              type: 'crud',
              props: {
                crudType: 'select',
                crudData: import('@imagina/qlocations/_crud/countries'),
                crudProps: {
                  label: `${this.$tr('qlocations.layout.form.country')}*`,
                  rules: [
                    val => !!val || this.$tr('ui.message.fieldRequired')
                  ],
                },
                config: {
                  options: {label: 'name', value: 'id'},
                }
              },
            },
          },
          /*formRight: {

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
