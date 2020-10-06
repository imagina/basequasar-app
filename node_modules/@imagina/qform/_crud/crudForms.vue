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
          permission: 'iforms.forms',
          create: {
            title: this.$tr('qform.layout.newForm'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'title', label: this.$tr('ui.form.title'), field: 'title'},
              {name: 'slug', label: this.$tr('ui.form.systemName'), field: 'systemName'},
              {
                name: 'user', label: this.$tr('ui.label.user'), field: 'user',
                format: val => (val && val.fullName) ? val.fullName : '-'
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'right'},
            ],
            requestParams: {include: 'fields,leads,user'},
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
            actions: [
              {
                icon: 'view_compact',
                color: 'info',
                route: 'qform.admin.fields.index'
              }
            ]
          },
          update: false,
          delete: true,
          formLeft: {
            id: {value: ''},
            title: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: `${this.$tr('ui.form.title')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              }
            },
            systemName: {
              value: '',
              type: 'input',
              props : {
                label: `${this.$tr('ui.form.systemName')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              }
            },
            userId: {
              value: null,
              type: 'select',
              props : {
                label: this.$tr('ui.label.user'),
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                select: {label: 'fullName', id: 'id'},
              }
            }
          }
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    }
  }
</script>
