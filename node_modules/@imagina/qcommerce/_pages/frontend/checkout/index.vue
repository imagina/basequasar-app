<template>
  <section>
    <div class="q-container" v-if="!loading">
      <div class="q-display-1 text-primary text-center">
        Checkout
      </div>
      <div class="row gutter-x-sm">
        <div class="col-md-8">
          <div class="backend-page q-mb-xl">
            <div class="row">
              <div class="col-12">
                <div class="border-top-color shadow-1">
                  <UserInformation/>
                </div>
              </div>
            </div>
          </div>
          <div class="backend-page q-mb-xl">
            <div class="row">
              <div class="col-12">
                <div class="border-top-color shadow-1">
                  <addressShipping/>
                </div>
              </div>
            </div>
          </div>
          <div class="backend-page q-mb-xl">
            <div class="row">
              <div class="col-12">
                <div class="border-top-color shadow-1">
                  <addressBilling/>
                </div>
              </div>
            </div>
          </div>
          <div class="backend-page q-mb-xl">
            <div class="row">
              <div class="col-12">
                <div class="border-top-color shadow-1">
                  <methodsShipping/>
                </div>
              </div>
            </div>
          </div>
          <div class="backend-page q-mb-xl">
            <div class="row">
              <div class="col-12">
                <div class="border-top-color shadow-1">
                  <methodsPayment/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="backend-page q-mb-xl">
            <div class="row">
              <div class="col-12">
                <div class="border-top-color shadow-1">
                  <p>Detalles de la compra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading :visible="loading">
      <q-spinner size="50px" color="primary"></q-spinner>
    </q-inner-loading>
  </section>
</template>

<script>
  // Components
  import UserInformation from '@imagina/qcommerce/_components/frontend/checkout/UserInformation'
  import addressShipping from '@imagina/qcommerce/_components/frontend/checkout/addressShipping'
  import addressBilling from '@imagina/qcommerce/_components/frontend/checkout/addressBilling'
  import methodsShipping from '@imagina/qcommerce/_components/frontend/checkout/methodsShipping'
  import methodsPayment from '@imagina/qcommerce/_components/frontend/checkout/methodsPayment'

  // Helpers
  import {helper} from '@imagina/qhelper/_plugins/helper';
  import alert from '@imagina/qhelper/_plugins/alert'

  // Services
  import eCommerceService from '@imagina/qcommerce/_services/index'

  export default{
    name: 'Checkout',
    components:{
      UserInformation,
      addressShipping,
      addressBilling,
      methodsShipping,
      methodsPayment,
    },
    data(){
      return{
        loading: true,
        cartAvailable: false,
        dataCheckout:{
          user:{},
          shippingAddress:{},
          cart: {}
        }
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.initCheckout()
      })
    },
    methods:{
      async initCheckout(){
        let sessionData = await helper.storage.get.item('sessionData')
        this.dataCheckout.cart = this.$store.state.qcommerceCart.cart;
        this.dataCheckout.user = sessionData.userData
        /*if(!this.dataCheckout.user){
          alert.error('Favor, inicia sesión para continuar','top')
          this.$router.push({name:'auth.login'})
          return
        }*/
        this.isAddressValidated()
        if (!this.dataCheckout.cart) {
          alert.error('No hay productos en el carrito. Favor agregue uno', 'top', [
            {
              label: 'Ir a Categorías',
              handler: () => {
                this.$router.push({name: 'app.categories'})
              }
            },
            {
              label: 'Ok'
            }
          ])
          this.cartAvailable = false
        }else{
          //await this.$store.dispatch('shoppingCart/ADD_USER_TO_CART');
          this.cartAvailable = true
        }
        this.loading = false
      },
      isAddressValidated(){
        helper.storage.get.item('dataAddress').then(response => {
          if (response == null) {
            alert.error('No ha validado cobertura','top')
          }
        })
      },
      saveOrder(){
        if(!this.cartAvailable){
          alert.error('No hay productos en el carrito. Favor agregue uno','top')
          return false
        }
        let data = {
          cart_id: 25,
          address_payment:{
            first_name: "Imagina",
            last_name: "Colombia",
            company: "Lino 2",
            address_1: {
              address: "calle 100 · 5 -3",
            },
            zip_code: "654987",
            city_id: "458",
            province_id: "773",
            country_id: "48"
          },
          address_shipping:{
            first_name: "Imagina",
            last_name: "Colombia",
            company: "Lino",
            address_1: {
              address: "calle 100 · 5 -3",
              lat: 4.635460160206706,
              lng: -74.16265425050966
            },
            zip_code: "654987",
            city_id: "458",
            province_id: "773",
            country_id: "48"
          },
          payment_id:3,
          shipping_name: "icommerceagree",
          store_id: 1
        }
        eCommerceService.crud.create('apiRoutes.qcommerce.orders',data)
          .then(response=>{
            // Here
          })
          .catch(error=>{
            console.warn(error)
          })
      },
    }
  }
</script>
<style>
  .border-botton{
    border-bottom: 1px solid #c4c4c47a;
  }
</style>
