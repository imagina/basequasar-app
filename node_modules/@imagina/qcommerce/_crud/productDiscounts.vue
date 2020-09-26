<template></template>

<script>
  export default {
    data() {
      return {
        crudId: this.$uid(),
        optionsCriteria: {
          'fixed': 'Fixed Value',
          'percentage': 'Percentage',
        },
      }
    },
    computed: {
      crudData() {
        return {
          crudId: this.crudId,
          apiRoute: 'apiRoutes.qcommerce.productDiscounts',
          //permission: 'icommerce.manufacturers',
          create: {
            title: this.$tr('qcommerce.layout.newProductDiscount'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'quantity', label: this.$tr('ui.form.quantity'), field: 'quantity', align: 'left'},
              {name: 'discount', label: this.$tr('qcommerce.layout.form.discount'), field: 'discount', align: 'left'},
              {name: 'priority', label: this.$tr('qcommerce.layout.form.priority'), field: 'priority', align: 'left'},
              {
                name: 'date_start', label: this.$tr('qcommerce.layout.form.dateStart'), field: 'dateStart', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {
                name: 'date_end', label: this.$tr('qcommerce.layout.form.dateEnd'), field: 'dateEnd', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {
                name: 'criteria', label: this.$tr('qcommerce.layout.form.criteria'), field: 'criteria', align: 'left',
                format: val => val ? this.optionsCriteria[val] : '-',
              },
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            //requestParams: {include: 'parent'}
          },
          update: {
            title: this.$tr('qcommerce.layout.updateProductDiscount'),
            //to: 'qcommerce.admin.taxClasses.edit'
            //requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            departmentId: {
              value: '',
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.departments',
                select: {label: 'title', id: 'id'},
              },
              props : {
                clearable: true,
                label: `${this.$tr('qcommerce.layout.form.customerGroup')}*`,
              }
            },
            quantity: {
              value: '',
              type: 'input',
              props : {
                label: `${this.$tr('ui.form.quantity')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
                type: 'number',
              }
            },
            discount: {
              value: '',
              type: 'input',
              props : {
                label: `${this.$tr('qcommerce.layout.form.discount')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
                type: 'number',
              }
            },
            priority: {
              value: '',
              type: 'input',
              props : {
                label: `${this.$tr('qcommerce.layout.form.priority')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
                type: 'number',
              }
            },
          },
          formRight: {
           dateStart:{
             value: '',
             type: 'date',
             props : {
               label: `${this.$tr('qcommerce.layout.form.dateStart')}*`,
             }
           },
            dateEnd:{
              value: '',
              type: 'date',
              props : {
                label: `${this.$tr('qcommerce.layout.form.dateEnd')}*`,
              }
            },
            criteria: {
              value: '',
              type: 'select',
              props : {
                label: `${this.$tr('qcommerce.layout.form.criteria')}*`,
                options:[
                  {label: this.$tr('qcommerce.layout.options.fixedValue'), value: 'fixed'},
                  {label: this.$tr('qcommerce.layout.options.percentage'), value: 'percentage'},
                ],
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
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
