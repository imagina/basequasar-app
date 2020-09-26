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
          apiRoute: 'apiRoutes.qredirect.redirects',
          permission: 'iredirect.redirects',
          create: {
            title: this.$tr('qredirect.layout.newRedirect'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'from', label: this.$tr('qredirect.layout.label.redirectFrom'), field: 'from', align: 'rigth'},
              {name: 'to', label: this.$tr('qredirect.layout.label.redirectTo'), field: 'to', align: 'left'},
              {
                name: 'createdAt', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {
                name: 'updatedAt', label: this.$tr('ui.form.updatedAt'), field: 'updatedAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {}
          },
          update: {
            title: this.$tr('qredirect.layout.updateRedirect'),
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            redirectType: {value: '301'},
            from: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('qredirect.layout.label.redirectFrom')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              },
            },
            to: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('qredirect.layout.label.redirectTo')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              },
            },
          },
          formRight: {},
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    },
  }
</script>
