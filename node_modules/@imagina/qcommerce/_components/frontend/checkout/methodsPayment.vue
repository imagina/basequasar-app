<template>
	<div class="row">
		<div class="col-xs-12 q-px-sm q-mb-md border-botton">
			<p> <q-icon name="credit_card"/> Método de Pago</p>
		</div>

		<div class="col-xs-12">

			<q-radio
				class="q-mb-md"
				style="font-family: Muli;font-size: 1.25rem; display:block"
				v-for="(item, index) in paymentMethods"
				:key="index"
				:label="item.title"
				v-model="paymentMethod"
				:val="item" />

		</div>
	</div>
</template>

<script>
	// SERVICES
	import eCommerceService from '@imagina/qcommerce/_services/index'
	export default {
		data(){
			return {
				loading:false,
				paymentMethods:[],
				paymentMethod:'',
			}
		},
		mounted(){
			this.$nextTick(function () {
				this.getPaymentMethods()
			})
		},
		methods:{
			getPaymentMethods(){
				this.visible = true
				eCommerceService.crud.index('apiRoutes.qcommerce.paymentMethods')
				.then(response=>{
					this.loading = false
					this.paymentMethods = response.data
				})
			},
		},
	}
</script>
