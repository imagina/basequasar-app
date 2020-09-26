<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          apiRoute: 'apiRoutes.qcommerce.orders',
          permission: 'icommerce.orders',
          create: false,
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id'},
              {name: 'customer', label: this.$tr('ui.form.name'), field: 'customer', format: val => val ? val.fullName : '-', align: 'left'},
              {name: 'total', label: this.$tr('qcommerce.layout.form.total'), field: 'total'},
              {name: 'statusName', label: this.$tr('ui.form.status'), field: 'statusName'},
              //{name: 'paymentCity', label: this.$tr('qcommerce.layout.form.city'), field: 'paymentCity'},
              //{name: 'paymentCountry', label: this.$tr('qcommerce.layout.form.country'), field: 'paymentCountry'},
              {name: 'shippingMethod', label: this.$tr('qcommerce.layout.form.shippingMethod'), field: 'shippingMethod'},
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'right'},
            ],
            requestParams: {
                filter: {
                    order: {
                        field: 'id',
                        way: 'desc',
                    },
                },
            },
              filters: {
                  status: {
                      label: `${this.$tr('ui.form.status')}:`,
                      value: null,
                      type: 'select',
                      isRequired: true,
                      isTranslatable: false,
                      props: {
                          label: `${this.$tr('ui.form.status')}:`,
                          clearable:true
                      },
                      loadOptions: {
                          apiRoute: 'apiRoutes.qcommerce.orderStatus'
                      }
                  },
              },
            actions : [
              {
                icon : 'fas fa-info-circle',
                color : 'info',
                route : 'qcommerce.admin.shipping.orders.show',
                action : () => {

                }
              }
            ]
          },
          update: false,
          delete: false,
          formLeft: {},
        }
      }
    }
  }
</script>
