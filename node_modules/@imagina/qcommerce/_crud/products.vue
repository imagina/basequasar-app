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
          apiRoute: 'apiRoutes.qcommerce.products',
          permission: 'icommerce.products',
          create: {
            title: this.$tr('qcommerce.layout.newProduct'),
            to: {name: 'qcommerce.admin.products.create'}
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.title'), field: 'name', style: 'width: 50px', align: 'rigth'},
              {name: 'sku', label: this.$tr('ui.form.sku'), field: 'sku', align: 'left'},
              {
                name: 'category', label: this.$tr('ui.form.category'), field: 'category', align: 'left',
                format: val => (val && val.title) ? val.title : ''
              },
              {
                name: 'status', label: this.$tr('ui.form.status'), field: 'status', align: 'left'
              },
              {
                name: 'quantity', label: this.$tr('ui.form.stock'), field: 'quantity', align: 'left',
                format: val => !val ? this.$tr('ui.label.soldOut') :
                  `${this.$tr('ui.label.available')} (${(val <= 100) ? val : '100+'})`
              },
              {name: 'slug', label: this.$tr('ui.form.slug'), field: 'slug', align: 'left'},
              {
                name: 'price', label: this.$tr('ui.form.price'), field: 'price', align: 'left',
                format: val => this.$trc(val)
              },
              {
                name: 'createdAt', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {include: 'category', filter: {order: {field: 'id', way: 'desc'}}},
            filters: {
              categories: {
                value: null,
                type: 'treeSelect',
                props: {
                  label: `${this.$tr('ui.form.category')}:`,
                  clearable: true,
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qcommerce.categories'
                }
              },
              status: {
                value: '1',
                type: 'select',
                props: {
                  label: `${this.$tr('ui.form.status')}:`,
                  clearable: true,
                  options: [
                    {label: this.$tr('ui.label.enabled'), value: 1},
                    {label: this.$tr('ui.label.disabled'), value: 0}
                  ],
                },
              },
              stockStatus: {
                value: 1,
                type: 'select',
                props: {
                  label: `${this.$tr('ui.form.stock')}:`,
                  clearable: true,
                  options: [
                    {label: this.$tr('ui.label.available'), value: 1},
                    {label: this.$tr('ui.label.soldOut'), value: 0}
                  ],
                },
              }
            },
          },
          update: {
            to: 'qcommerce.admin.products.edit'
          },
          delete: true
        }
      }
    }
  }
</script>
