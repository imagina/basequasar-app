<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          apiRoute: 'apiRoutes.qcommerce.coupons',
          permission: 'icommerce.coupons',
          create: {
            title: this.$tr('qcommerce.layout.newCoupon'),
            to: {name: 'qcommerce.admin.coupons.create'}
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', align: 'left'},
              {name: 'code', label: this.$tr('qcommerce.layout.form.code'), field: 'code', align: 'left'},
              {name: 'dateStart', label: this.$tr('qcommerce.layout.form.dateStart'), field: 'dateStart', align: 'left'},
              {name: 'dateEnd', label: this.$tr('qcommerce.layout.form.dateEnd'), field: 'dateEnd', align: 'left'},
              {name: 'quantityTotal', label: this.$tr('qcommerce.layout.form.quantityTotal'), field: 'quantityTotal', align: 'left'},
              {name: 'quantityTotalCustomer', label: this.$tr('qcommerce.layout.form.quantityTotalCustomer'), field: 'quantityTotalCustomer', align: 'left'},
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'right'},
            ],
            requestParams: {},
            filters: {},
          },
          update: {
            to : 'qcommerce.admin.coupons.edit'
          },
          delete: true,
          formLeft: {},
        }
      }
    }
  }
</script>
