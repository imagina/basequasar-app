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
          apiRoute: 'apiRoutes.qlocations.neighborhoods',
          //permission: 'icommerce.manufacturers',
          create: {
            title: this.$tr('qlocations.layout.newNeighborhood'),
            to: {name: 'qlocations.admin.neighborhoods.create'}
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
              province: {
                value: null,
                type: 'select',
                props : {
                  label: this.$tr('qlocations.layout.form.province'),
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qlocations.provinces',
                  select: {label: 'name', id: 'id'},
                }
              },
            }
          },
          update: {
            title: this.$tr('qlocations.layout.updateNeighborhood'),
            to: 'qlocations.admin.neighborhoods.edit'
            //requestParams: {include: 'parent'}
          },
          delete: true,
          /*formLeft: {
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
