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
          apiRoute: 'apiRoutes.qlocations.countries',
          //permission: 'icommerce.manufacturers',
          create: {
            title: this.$tr('qlocations.layout.newCountry'),
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
          },
          update: {
            title: this.$tr('qlocations.layout.updateCountry'),
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
            fullName: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: `${this.$tr('qlocations.layout.form.fullName')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
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
            regionCode: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.regionCode')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            subRegionCode: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.subRegionCode')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            countryCode: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.countryCode')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            callingCode: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.callingCode')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
          },
          formRight: {
            currency: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.currency')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            currencySymbol: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.currencySymbol')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            currencyCode: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.currencyCode')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            currencySubUnit: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.currencySubUnit')}*`,
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
            iso3: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('qlocations.layout.form.iso3')}*`,
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
