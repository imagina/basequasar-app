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
          apiRoute: 'apiRoutes.qcommerce.stores',
          //permission: 'icommerce.stores',
          create: {
            title: this.$tr('qcommerce.layout.newStore'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'left'},
              {name: 'address', label: this.$tr('ui.form.address'), field: 'address', align: 'left'},
              {name: 'phone', label: this.$tr('ui.form.phone'), field: 'phone', align: 'left'},
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            //requestParams: {include: 'parent'}
          },
          update: {
            title: this.$tr('qcommerce.layout.updateStore'),
            //requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            name: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('ui.form.name')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            address: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: `${this.$tr('ui.form.address')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            phone: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                  label: `${this.$tr('ui.form.phone')}*`,
                  rules: [
                      val => !!val || this.$tr('ui.message.fieldRequired')
                  ],
              }
            },
          },
          /*formRight: {
            mediasSingle: {
              name: 'mediasSingle',
              value: {},
              type: 'media',
              props : {
                label: this.$tr('ui.form.firstImage'),
                zone: 'mainimage',
                entity: "Modules\\Icommerce\\Entities\\Store",
                enitityId: null
              }
            },
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
