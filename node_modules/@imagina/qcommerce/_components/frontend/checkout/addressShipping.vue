<template>
  <div class="row">
    <div class="col-xs-12 q-px-sm q-mb-md border-botton">
      <p> <q-icon name="local_shipping"/> Dirección de Envío</p>
    </div>
    <div class="col-xs-3 q-px-sm">
      <input
        disabled
        type="text"
        v-model="addrees.form.typeStreet"
        float-label="Calle, Carrera, Avenida"
        class="no-shadow vue-treeselect__control"/>
    </div>
    <div class="col-xs-3 q-px-sm">
      <input
        disabled
        type="text"
        v-model="addrees.form.street"
        float-label="Calle, Carrera, Avenida"
        class="no-shadow vue-treeselect__control"/>
    </div>
    <div class="col-xs-1 q-px-sm text-center">
      <p>#</p>
    </div>
    <div class="col-xs-2 q-px-sm">
      <input
        disabled
        type="text"
        v-model="addrees.form.number1"
        float-label="Calle, Carrera, Avenida"
        class="no-shadow vue-treeselect__control"/>
    </div>
    <div class="col-xs-1 q-px-sm text-center">
      <p>-</p>
    </div>
    <div class="col-xs-2 q-px-sm q-pb-sm">
      <input
        disabled
        type="text"
        v-model="addrees.form.number2"
        float-label="Calle, Carrera, Avenida"
        class="no-shadow vue-treeselect__control"/>
    </div>
  </div>
</template>

<script>
  import {helper} from '@imagina/qhelper/_plugins/helper'
  export default {
    data(){
      return{
        addrees:{
          typeOrder: false,
          form: {
            typeStreet: '',
            street: '',
            number1: '',
            number2: ''
          },
          addresslatLng: {
            lat: 0,
            lng: 0
          },
          coverage: {
            status: false,
            price: '',
            area: 0
          }
        }
      }
    },
    mounted(){
      this.$nextTick(() => {
				this.getAddress()
			})
    },
    methods:{
      getAddress(){
				helper.storage.get.item('dataAddress').then(res => {
          if (res !== null) {
						this.addrees = res
          }
        })
      },
    }
  }
</script>
