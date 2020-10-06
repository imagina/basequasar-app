<template>
  <div id="OrderIndexPage" class="q-layout-page layout-padding">

    <!--TITLE-->
    <h1 class="q-headline text-primary">
      Mis Pedidos
    </h1>

    <!--Content-->
    <div class="relative-position backend-page">
      <!--Table-->
      <div class="col-12">
        <q-table
          :data="table.data"
          :columns="table.columns"
          :pagination.sync="table.pagination"
          @request="getdata"
          :filter="table.filter"
          class="shadow-1 border-top-color">

          <!--Header Table-->
          <template slot="top" slot-scope="props">
            <div class="row full-width">
              <!--Search-->
              <div class="col-12 col-md-6 q-mt-sm">
                <div class="col-12 col-md-6">
                  <q-search hide-underline clearable v-model="table.filter.search"
                            @input="getDataTable"/>
                </div>
              </div>
              <!--Button Actions-->
              <div class="col-12 col-md-6 q-mt-sm text-right">
                <!--Button refresh data-->
                <q-btn icon="fas fa-sync-alt" color="info" class="q-ml-xs"
                       @click="getDataTable(true)" rounded>
                  <q-tooltip :delay="300">Refresh Data</q-tooltip>
                </q-btn>
              </div>
              <!--Filters-->
              <div class="col-12 q-mt-sm">
                <!--By category-->


              </div>
            </div>
          </template>

          <!--= Custom Columns =-->
          <q-td slot="body-cell-actions" slot-scope="props" class="text-right">
            <q-btn
              icon="visibility"
              color="green"
              size="sm"
              round
              :to="{name : 'order.show' , params : {id : props.row.id}}"/>
          </q-td>


          <q-td slot="body-cell-total" slot-scope="props" class="text-right">
            $ {{ $n(props.row.total) }}
          </q-td>

          <q-td slot="body-cell-status" slot-scope="props" class="text-right">
            {{props.row}}
          </q-td>

        </q-table>
      </div>

      <!--Loading-->
      <inner-loading :visible="loading" />
    </div>
  </div>
</template>

<script>
  //Services
  import commerceServices from '@imagina/qcommerce/_services/index';

  export default {
    components: {
    },
    mounted() {
      this.$nextTick(function () {
        this.getDataTable()
      })
    },
    data() {
      return {
        table: {
          data: [],
          columns: [
          {
            name: 'id',
            label: 'Numero de pedido',
            field: 'id',
          },
          {
            name: 'total',
            label: 'TOTAL',
            field: 'total',
          },
          {
            name: 'statusName',
            label: 'ESTADO',
            field: 'statusName',
          },
          {
            name: 'paymentCity',
            label: 'CIUDAD',
            field: 'paymentCity',
          },
          {
            name: 'paymentZone',
            label: 'DEPARTAMENTE',
            field: 'paymentZone',
          },
          {
            name: 'paymentCountry',
            label: 'PAIS',
            field: 'paymentCountry',
          },
          {
            name: 'email',
            label: 'E-MAIL',
            field: 'email',
          },
          {
            name: 'shippingMethod',
            label: 'MÉTODO DE ENVÍO',
            field: 'shippingMethod',
          },
          {
            name: 'actions',
            label: 'ACCIONES',
            field: 'actions',
          },
        ],
          pagination: {
            page: 1,
            rowsNumber: '',
            rowsPerPage: 10
          },
          filter: {
            search: null,
            customer:this.$store.state.quserAuth.userId,
            order:{
              field:'id',
              way:'DESC'
            }
          },
          filters: {

          },
          options: {
            statuses: [],
          }
        },
        loading: false,
      }
    },
    methods: {
      //Request products with params from server table
      getDataTable(refresh = false) {
        this.getdata({pagination: this.table.pagination}, refresh)
      },
      //Get products
      getdata({pagination, filter}, refresh = false) {
        this.loading = true
        //Params to request
        let params = {
          refresh: refresh,
          params: {
            filter: Object.assign({}, this.table.filter, this.table.filters),
            page: pagination.page,
            take: pagination.rowsPerPage,
          }
        }
        //Request
        commerceServices.crud.index('apiRoutes.qcommerce.orders', params)
        .then(response => {
          this.table.data = response.data
          this.table.pagination.page = response.meta.page.currentPage
          this.table.pagination.rowsNumber = response.meta.page.total
          this.table.pagination.rowsPerPage = pagination.rowsPerPage
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$helper.alert.error('Failed: ' + error, 'bottom')
        })
      },
    }
  }
</script>

<style lang="stylus">
  #OrderIndexPage
      .q-search
        width 258px
</style>
