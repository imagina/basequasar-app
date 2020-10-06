<template>
  <div class="row">
		<div class="col-xs-12 q-px-sm q-mb-md border-botton">
			<p> <q-icon name="list_alt"/> Dirección de Facturación</p>
		</div>

    <div class="col-md-12">
      <div class="row">
        <div class="col-xs-3 q-px-sm">
          <tree-select
            v-model="addrees.form.typeStreet"
            :options="typesStreet"
            :clearable="false"/>
        </div>
        <div class="col-xs-3 q-px-sm">
          <p>
          <input
            type="text"
            v-model="addrees.form.street"
            float-label="Calle, Carrera, Avenida"
            class="no-shadow vue-treeselect__control"/>
          </p>
        </div>

        <div class="col-xs-1 q-px-sm text-center">
          <p>#</p>
        </div>

        <div class="col-xs-2 q-px-sm">
          <p>
          <input
            type="text"
            v-model="addrees.form.number1"
            float-label="Numero"
            class="no-shadow vue-treeselect__control"/>
          </p>
        </div>

        <div class="col-xs-1 q-px-sm text-center">
          <p>-</p>
        </div>

        <div class="col-xs-2 q-px-sm">
          <p>
          <input
            type="text"
            v-model="addrees.form.number2"
            float-label="Con"
            class="no-shadow vue-treeselect__control"/>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {helper} from '@imagina/qhelper/_plugins/helper'
  export default {
    data(){
      return{
        typesStreet:
				[
					{label : 'Calle', id : 'Calle'},
					{label : 'Carrera', id : 'Carrera'},
					{label : 'Avenida', id : 'Avenida'},
					{label : 'Diagonal', id : 'Diagonal'},
					{label : 'Transversal', id : 'Transversal'},
					{label : 'Vía', id : 'Vía'},
				],
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
    components: {
      Treeselect
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
