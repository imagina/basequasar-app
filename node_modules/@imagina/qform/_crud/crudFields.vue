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
          apiRoute: 'apiRoutes.qform.fields',
          permission: 'iforms.fields',
          create: {
            title: this.$tr('qform.layout.newField'),
            to : {name:'qform.admin.fields.create'}
          },
          read: {
            search: false,
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'typeName', label: this.$tr('ui.form.type'), field: 'typeName'},
              {name: 'label', label: this.$tr('qform.layout.form.label'), field: 'label'},
              {name: 'order', label: this.$tr('qform.layout.form.order'), field: 'order'},
              {name: '_form.vue', label: this.$tr('qform.layout.form.form'), field: '_form.vue',
                format: val => (val && val.title) ? val.title : '-'},
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'right'},
            ],
            requestParams: {
              filter:{
                formId:this.$route.params.id
              },
              include: '_form.vue'
            },
          },
          update: {
            title: this.$tr('qform.layout.updateField'),
            to : 'qform.admin.fields.update'
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            type:{
              value: 0,
              type: 'select',
              props : {
                label: this.$tr('ui.form.type'),
                options: [
                  {label: 'Text', id: 0},
                  {label: 'Number', id: 1},
                  {label: 'Email', id: 2},
                  {label: 'Text Area', id: 3},
                ]
              }
            },
            name:{
              value: '',
              type: 'input',
              isTranslatable: false,
              props : {
                label: this.$tr('ui.form.name'),
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ]
              }
            },
            label:{
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: this.$tr('qform.layout.form.label'),
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ]
              }
            },
            placeholder:{
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: this.$tr('qform.layout.form.placeholder'),
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ]
              }
            },
            description:{
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: this.$tr('ui.form.description'),
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ]
              }
            },
          },
          formRight: {
            required:{
              value: false,
              type: 'checkbox',
              props : {
                label: this.$tr('ui.form.required'),
              }
            },
            parentId:{
              value: null,
              type: 'select',
              props : {
                label: this.$tr('ui.form.parent'),
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qform.fields',
                select: {label: 'label', id: 'id'},
              }
            },
            formId:{
              value: null,
              type: 'select',
              props : {
                label: this.$tr('qform.layout.form.form'),
                clearable: true,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qform.forms',
                select: {label: 'title', id: 'id'},
              }
            },
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    }
  }
</script>
