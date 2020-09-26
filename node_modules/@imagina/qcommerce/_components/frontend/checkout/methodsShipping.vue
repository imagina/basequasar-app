<template>
	<div class="row">
  	<div class="col-xs-12 q-px-sm q-mb-md border-botton">
			<p> <q-icon name="motorcycle"/> Metodo de envío</p>
		</div>

		<div class="col-md-12">
			<q-item tag="label" v-for="(store, index) in shippingMethods" :key="index">
				<q-item-side>
					<q-radio v-model="shippingMethod" :val="item.id"/>
					{{item.id}} <b>{{item.id}}</b> {{item.id}}
				</q-item-side>
			</q-item>
		</div>
			<div class="col-md-12">
        <p class="q-display">
					{{addrees.typeOrder ? 'Domicilio' : 'Recoger en tienda'}}
				</p>
		</div>
    <div class="col-md-12">
      <p class="q-display">
        {{priceShipping}}
      </p>
    </div>
	</div>
</template>

<script>
  import {helper} from '@imagina/qhelper/_plugins/helper'
  export default {
    data(){
      return{
				shippingMethods: [],
				shippingMethod: '',
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
		computed:{
			priceShipping(){
				if(this.addrees.coverage.price != null){
					return `Costo $${this.$n(this.addrees.coverage.price)}`
				} 
			}
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
