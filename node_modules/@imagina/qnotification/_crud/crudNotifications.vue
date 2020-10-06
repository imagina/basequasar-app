<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          apiRoute: 'apiRoutes.qnotification.notifications',
          permission: 'notification.notifications',
          create: {
            title: this.$tr('qnotification.layout.newNotification'),
          },
          read: {
            columns: [
              {
                name: 'id', label: this.$tr('ui.form.id'),
                field: 'id',
                sortable: true,
              },
              {
                name: 'title', label: this.$tr('ui.form.title'),
                field: 'title',
                sortable: true,
              },
              {
                name: 'message', label: this.$tr('qnotification.layout.form.subtitle'),
                field: 'message',
                sortable: true,
              },
              {
                name: 'actions', label: this.$tr('ui.form.actions'), align: 'center'
              },
            ],
            requestParams: {
              filter: {
                me: true
              },
            },
            actions : [
              {
                icon : 'fas fa-times',
                color : 'red',
                //route : 'app.home', //method add data from record as params of route
                action : () => {
                  this.$alert.info({message : 'Tes!'})
                }
              }
            ]
          },
          update: {
            title: this.$tr('qnotification.layout.updateNotification'),
            requestParams: {
              filter: {
                me: true
              },
            }
          },
          delete: false,
          formLeft: {
            id: {value: ''},
          },
          formRight: {},
        }
      }
    },
  }
</script>
