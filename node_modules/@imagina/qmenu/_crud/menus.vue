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
          apiRoute: 'apiRoutes.qmenu.menus',
          permission: 'menu.menus',
          create: {
            title: this.$tr('qmenu.layout.newMenu'),
          },
          read: {
            columns: [
              {
                name: 'id', label: this.$tr('ui.form.id'),
                field: 'id',
              },
              {
                name: 'title', label: this.$tr('ui.form.title'),
                field: 'title',
                align: 'left',
              },
              {
                name: 'name', label: this.$tr('ui.form.name'),
                field: 'name',
                align: 'left',
              },
              {
                name: 'status', label: this.$tr('ui.form.status'),
                field: 'status',
                align: 'left',
                format: val => val ? this.$tr(`ui.label.${parseInt(val) ? 'enabled' : 'disabled'}`) : '-',
              },
              {
                name: 'isDefault', label: this.$tr('ui.form.default'),
                field: 'isDefault',
                align: 'left',
                format: val => val ? this.$tr(`ui.label.${parseInt(val) ? 'yes' : 'no'}`) : '-',
              },
              {
                name: 'createdAt', label: this.$tr('ui.form.createdAt'), field: 'createdAt',
                format: val => val ? this.$trd(val) : '-',
                align: 'left'
              },
              {
                name: 'actions', label: this.$tr('ui.form.actions'), align: 'right'
              },
            ],
            filters: {
              status: {
                value: null,
                type: 'select',
                props: {
                  label: this.$tr('ui.form.status'),
                  options: [
                    {label: this.$tr('ui.label.enabled'), value: 1},
                    {label: this.$tr('ui.label.disabled'), value: 0},
                  ]
                }
              }
            }
          },
          update: {
            title: this.$tr('qmenu.layout.updateMenu'),
            to: 'qmenu.admin.menus.show'
          },
          delete: true,
          formLeft: {
            title: {
              value: null,
              type: 'input',
              isTranslatable: true,
              props : {
                label: this.$tr('ui.form.title'),
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              }
            },
            name: {
              value: null,
              type: 'input',
              props : {
                label: this.$tr('ui.form.name'),
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              }
            },
            status: {
              value: '1',
              type: 'select',
              isTranslatable: true,
              props : {
                label: this.$tr('ui.form.status'),
                options: [
                  {label: this.$tr('ui.label.enabled'), value: '1'},
                  {label: this.$tr('ui.label.disabled'), value: '0'},
                ]
              }
            },
            isDefault: {
              value: '0',
              type: 'select',
              props : {
                label: this.$tr('ui.form.default'),
                options: [
                  {label: this.$tr('ui.label.yes'), value: '1'},
                  {label: this.$tr('ui.label.no'), value: '0'},
                ]
              }
            },
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    },
  }
</script>
