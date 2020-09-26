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
          apiRoute: 'apiRoutes.qform.forms',
          permission: 'iforms.leads',
          create: false,
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'title', label: this.$tr('qform.layout.form.form'), field: 'title', align: 'left'},
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'right'},
            ],
            requestParams: {},
            filters: {
              userId: {
                value: '0',
                type: 'select',
                props : {
                  label: this.$tr('ui.label.user'),
                  options: [
                    {label: this.$tr('ui.label.all'), value: '0'}
                  ],
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.quser.users',
                  select: {label: 'fullName', id: 'id'},
                }
              }
            },
            actions : [
              {
                icon : 'fab fa-wpforms',
                color : 'teal',
                route : 'qform.admin.leads.show'
              }
            ]
          },
          update: false,
          delete: false
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    }
  }
</script>
