<template>
  <div id="pageId" class="q-pa-md">
    <!--TITLE-->
    <div class="text-h4 text-primary q-pb-md text-right">
      <q-icon v-if="$route.meta.icon" :name="$route.meta.icon"/>
      {{ $tr($route.meta.title) }} #{{ $route.params.id.toString().padStart(5,'0') }}
    </div>

    <div class="row">
      <div class="col-md-12 backend-page">
        <div class="row q-col-gutter-x-md">
          <div class="col-md-6">
            <q-card class="box-table q-px-md">
              <q-card-section>
                <div class="text-h5">{{$tr('qcommerce.layout.orderAccountInformation')}}</div>
              </q-card-section>
              <q-separator/>
              <q-card-section>
                <div class="row">
                  <div class="col-md-3">
                    {{$tr('qcommerce.layout.orderStatus')}}
                  </div>
                  <div class="col-md-6">
                    {{order.statusName}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    {{$tr('qcommerce.layout.orderDate')}}
                  </div>
                  <div class="col-md-9">{{(order.createdAt)}}</div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    {{$tr('qcommerce.layout.placedFromIP')}}
                  </div>
                  <div class="col-md-9">{{order.ip}}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-md-6">
            <q-card class="box-table q-px-md">
              <q-card-section>
                <div class="text-h5">{{$tr('qcommerce.layout.accountInformation')}}</div>
              </q-card-section>
              <q-separator/>
              <q-card-section>
                <div class="row">
                  <div class="col-md-3">
                    {{$tr('ui.form.name')}}
                  </div>
                  <div class="col-md-6">
                    {{order.customer.fullName}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    {{$tr('ui.form.email')}}
                  </div>
                  <div class="col-md-6">
                    {{order.customer.email}}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row q-mt-md q-col-gutter-md">
      <div class="col-md-6 backend-page">
        <div class="row gutter-x-sm">
          <div class="col-md-12">

            <q-card class="box-table q-px-md">
              <q-card-section>
                <div class="text-h5">{{$tr('qcommerce.layout.addressInformation')}}</div>
              </q-card-section>
              <q-separator/>
              <q-card-section>

                <div class="row">
                  <div class="col-md-12">
                    <b>{{$tr('qcommerce.layout.billingAddress')}}</b>
                  </div>
                  <div class="col-md-12 q-mt-sm">
                    {{order.shippingFirstName}},
                    {{order.shippingLastName}},
                    {{order.shippingAddress1}},
                    {{order.shippingCity}},
                    {{order.shippingDepartment ? order.shippingDepartment.name : order.shippingDepartment || ''}},
                    {{order.shippingCountry ? order.shippingCountry.name : order.shippingCountry || ''}}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-md-6 backend-page">
        <div class="row gutter-x-sm">
          <div class="col-md-12">

            <q-card class="box-table q-px-md">
              <q-card-section>
                <div class="text-h5">{{$tr('qcommerce.layout.paymentShippingMethod')}}</div>
              </q-card-section>
              <q-separator/>
              <q-card-section>
                <div class="row">
                  <div class="col-md-12">
                    <b>{{$tr('qcommerce.layout.paymentInformation')}}</b>
                  </div>
                  <div class="col-md-12 q-mt-sm">
                    {{order.paymentMethod}}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col-md-12 backend-page">
        <div class="row gutter-x-sm">
          <div class="col-md-12">

            <q-card class="box-table q-px-md">
              <q-card-section>
                <div class="text-h5">{{$tr('qcommerce.layout.itemsOrdered')}}</div>
              </q-card-section>
              <q-separator/>
              <q-card-section>

                <div class="row">
                  <div class="col-md-12">
                    <orderItems :items="order.items"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row q-mt-md q-col-gutter-md">
      <div class="col-md-6 backend-page">
        <div class="row gutter-x-sm">
          <div class="col-md-12">

            <q-card class="box-table q-px-md">
              <q-card-section>
                <div class="text-h5">{{$tr('qcommerce.layout.orderHistory')}}</div>
              </q-card-section>
              <q-separator/>
              <q-card-section>
                <order-status-history :items="order.histories"/>
                <addStatusOrder @orderHistoryCreated="getOrder()"/>
              </q-card-section>
            </q-card>

          </div>
        </div>
      </div>
      <div class="col-md-6 backend-page">
        <div class="row gutter-x-sm">
          <div class="col-md-12">
            <q-card class="box-table q-px-md">
              <q-card-section>
                <div class="text-h5">{{$tr('qcommerce.layout.orderTotal')}}</div>
              </q-card-section>
              <q-separator class="q-mx-sm"/>
              <q-card-section>

                <div class="row">
                  <div class="col-md-12">

                    <div class="row">
                      <div class="row q-mb-sm full-width">
                        <div class="col-6 secondary-font">
                          {{$tr('qcommerce.layout.subtotal')}}
                        </div>
                        <div class="col-6 text-right secondary-font">

                          $ {{$n(order.total - order.shippingAmount)}}
                        </div>
                      </div>
                      <div class="row q-mb-sm full-width">
                        <div class="col-6 secondary-font">
                          {{$tr('qcommerce.layout.shipping')}}
                        </div>
                        <div class="col-6 text-right secondary-font">
                          $ {{$n(order.shippingAmount)}}
                        </div>
                      </div>
                      <div class="row q-mb-sm q-title text-weight-bold full-width">
                        <div class="col-6  secondary-font">
                          {{$tr('qcommerce.layout.form.total')}}
                        </div>
                        <div class="col-6 text-right secondary-font">
                          $ {{$n(order.total)}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

          </div>
        </div>
      </div>
    </div>

    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  import orderStatusHistory from '@imagina/qcommerce/_components/admin/orders/orderStatusHistory';
  import orderItems from '@imagina/qcommerce/_components/frontend/orders/orderItems';
  import addStatusOrder from '@imagina/qcommerce/_components/admin/orders/addStatusOrder'

  export default {
    components: {
      orderItems,
      orderStatusHistory,
      addStatusOrder
    },
    beforeDestroy() {
      this.$root.$off('page.data.refresh')
    },
    data() {
      return {
        loading: false,
        order: {
          customer: {
            fullName: ''
          },
          items: [],
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        this.getOrder()
        //Listen refresh event
        this.$root.$on('page.data.refresh', () => this.getOrder())
      },
      //Get order data
      getOrder() {
        this.loading = true
        let params = {
          refresh : true,
          params: {
            include : 'shippingDepartment,shippingCountry'
          }
        }
        let criteria = this.$route.params.id
        this.$crud.show('apiRoutes.qcommerce.orders', criteria, params)
          .then(response => {

            this.order = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
          })
      }
    }
  }
</script>
