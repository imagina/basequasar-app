<template>
  <div class="q-container row backend-page">
    <div class="col-12 relative-position">


      <div class="row gutter-sm" v-if="!loading && order.id">
        <!-- order number -->
        <div class="col-12 text-right">
          <div class="q-title secondary-font">
            Número de Pedido
            <q-chip color="primary">
              {{order.id}}
            </q-chip>
          </div>
        </div>

        <!-- order items -->
        <div class="col-12 col-md-8 ">
          <div class="row full-width q-mb-md ">
            <div class="col-12 border-top-color shadow-1">
              <order-items :items="order.items"/>
            </div>


          </div>
          <!-- Total Order -->

          <div class="row q-mb-md text-primary text-weight-bold border-top-color shadow-1">
            <div class="row q-mb-sm full-width">
              <div class="col-6 secondary-font">
                Subtotal:
              </div>
              <div class="col-6 text-right secondary-font">

                $ {{$n(order.total - order.shippingAmount)}}
              </div>
            </div>
            <div class="row q-mb-sm full-width">
              <div class="col-6 secondary-font">
                Envío:
              </div>
              <div class="col-6 text-right secondary-font">
                $ {{$n(order.shippingAmount)}}
              </div>
            </div>
            <div class="row q-mb-sm q-title text-weight-bold full-width">
              <div class="col-6  secondary-font">
                Total:
              </div>
              <div class="col-6 text-right secondary-font">
                $ {{$n(order.total)}}
              </div>
            </div>

          </div>


          <!-- Customer Data -->
          <div class="row full-width">
            <div class="col-12 q-mb-md border-top-color shadow-1">
              <div class="q-heading  secondary-font text-primary text-weight-bold ">
                Customer Data
              </div>
              <customerData :items="[order.customer]"/>
            </div>
          </div>

        </div>

        <!-- status history, transactions -->
        <div class="col-12 col-md-4 ">

          <!-- status history -->
          <div class="row backend-base">
            <div class="col-12 q-mb-md border-top-color shadow-1">
              <order-status-history :items="order.histories" />
            </div>
          </div>

          <!-- transactions -->
          <div class="row backend-base">
            <div class="col-12 q-mb-md border-top-color shadow-1">
              <transactions :items="order.transactions" />
            </div>
          </div>

          <!-- Addresses -->
          <div class="row backend-base ">
            <!-- Payment Address -->
            <div class="col-12 q-mb-md border-top-color shadow-1">
              <div class="row">
                <div class="q-heading secondary-font text-primary text-weight-bold "> Payment Address</div>
              </div>
              <div class="row q-py-xs text-right secondary-font text-weight-bold">

                {{JSON.parse(order.paymentAddress1).address}}


              </div>
            </div>

            <!-- Shipping Address -->
            <div class="col-12 q-mb-md border-top-color shadow-1">
              <div class="row">
                <div class="q-heading secondary-font text-primary text-weight-bold "> Shipping Address</div>
              </div>
              <div class="row q-py-xs text-right secondary-font text-weight-bold">

                {{JSON.parse(order.shippingAddress1).address}}


              </div>
            </div>

          </div>

        </div>


      </div>
      <div class="row" v-else>
        <div class="col-12">

          <not-results />
        </div>
      </div>
      <inner-loading :visible="loading"/>
    </div>

  </div>

</template>

<script>
  // Services
  import icommerceService from '@imagina/qcommerce/_services/index';

  //components
  import orderItems from '@imagina/qcommerce/_components/frontend/orders/orderItems';
  import orderStatusHistory from '@imagina/qcommerce/_components/frontend/orders/orderStatusHistory';
  import transactions from '@imagina/qcommerce/_components/frontend/orders/transactions';
  import customerData from '@imagina/qcommerce/_components/frontend/orders/customerData';

  export default {
    components:{
      orderItems,
      orderStatusHistory,
      transactions,
      customerData
    },
    data(){
      return {
        loading:false,
        order:[]
      }
    },
    mounted() {
      this.getOrder()
    },
    methods: {
      getOrder(){
        let orderId = this.$route.params.id
        this.loading = true
        let params = {
          params:{}
        }
        icommerceService.crud
          .show('apiRoutes.qcommerce.orders',orderId, params)
          .then(response=>{
            this.order = response.data
            this.loading = false
          })
          .catch(error=>{
            this.$helper.alert.error('Failed: ' + error, 'bottom')
            this.loading = false
          })
      }
    },
  }
</script>
