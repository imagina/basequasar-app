<template>
  <div id="shoppingCartIndex" class="q-container">

    <!--TITLE-->
    <h1 class="q-headline text-primary">
      <q-icon name="fas fa-shopping-cart"></q-icon>
      Carro de compras
    </h1>

    <div class="backend-page q-mb-xl relative-position">
      <div class="row gutter-x-sm">
        <!--List products-->
        <div class="col-12 col-md-8">
          <!--Table-->
          <q-table
            v-if="cart.products && cart.products.length"
            :data="cart.products"
            :columns="columns"
            hide-header
            class="border-top-color shadow-1"
          >
            <!--Image product-->
            <q-td slot="body-cell-img-prodct" slot-scope="props" :props="props">
              <!---Delete buttom-->
              <div class="content-btn-delete">
                <q-btn size="sm" rounded color="negative" flat
                       @click="deleteItem(props.row, false)" icon="fas fa-trash">
                  <q-tooltip class="q-subheading">Remove: {{props.row.name}}</q-tooltip>
                </q-btn>
              </div>
              <div class="img-product"
                   :style="'background-image: url('+props.row.mainImage.path+')'">
              </div>
            </q-td>
            <!--Product description-->
            <q-td slot="body-cell-description" slot-scope="props" :props="props">
              <div>
                <!--Title-->
                <div class="q-title text-grey-7">{{props.row.name}}</div>
                <!--Price-->
                <div class="text-blue-grey-9">
                  <p class="q-body-2 text-weight-bold">
                    $ {{$n(props.row.product.price)}}
                  </p>
                </div>
                <!--Options-->
                <div v-if="props.row.productOptionValues && props.row.productOptionValues.length">
                  <div class="inline-block option-content" :key="key"
                       v-for="(option, key) in props.row.productOptionValues">
                    <!--Option title-->
                    <div class="option-title">{{option.option}}</div>
                    <!--Value title-->
                    <div class="value-title">
                      <q-icon name="fas fa-caret-right" />
                      {{option.optionValue}}
                    </div>
                  </div>
                </div>
              </div>
            </q-td>
            <!--Actions-->
            <q-td slot="body-cell-actions" slot-scope="props" class="text-right">
              <!--Sub total-->
              <div class="text-blue-grey-9 q-title">
                <div class="q-subheading">Subtotal</div>
                <p class="q-body-2 text-weight-bold q-ma-none">
                  $ {{ $n(props.row.total) }}
                </p>
              </div>
              <!--Quantity-->
              <div class="q-my-sm">
                <div class="q-subheading q-mb-xs">Cantidad</div>
                <select-quantity v-model="props.row.quantity" @enter="update(props.row)"
                                 @blur="update(props.row)" @btn="update(props.row)"/>
              </div>
            </q-td>
          </q-table>
          <!--Message not found items-->
          <div v-else class="border-top-color shadow-1">
            Your cart is empty...
          </div>
        </div>

        <!-- Summary -->
        <div class="col-12 col-md-4">
          <div class="border-top-color shadow-1">
            <q-list no-border class="q-pa-none">
              <q-list-header class="q-pa-none q-headline">
                RESUMEN DE TU PEDIDO
              </q-list-header>
              <q-item class="q-pa-none">
                <q-item-main label="TOTAL" class="q-subheading"/>
                <q-item-side right>
                  <p class="q-ma-none text-primary">
                    $ {{ cart.total ? $n(cart.total) : '0'}}
                  </p>
                </q-item-side>
              </q-item>
              <q-item class="text-center q-pb-none">
                <q-item-main>
                  <q-btn label="comprar" color="positive" :to="{name: 'checkout.index'}"/>
                </q-item-main>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>

<script>
  //Components
  import selectQuantity from '@imagina/qcommerce/_components/selectQuantity'
  //Services
  import icommerceService from '@imagina/qcommerce/_services/index'

  export default {
    props: {
      simple: {
        type: Boolean,
        default: false
      },
    },
    components: {selectQuantity},
    data() {
      return {
        test: 1,
        loading: true,
        cart: false,
        products: false,
        columns: [
          {name: 'img-prodct', align: 'center'},
          {name: 'description', align: 'left'},
          {name: 'actions', align: 'right'}
        ],
        tmpQuantity : 0
      }
    },
    mounted() {
      this.getCart()
    },
    methods: {
      async getCart() {
        this.loading = true
        await this.$store.dispatch('qcommerceCart/GET_CART', true)
        this.cart = this.$store.state.qcommerceCart.cart
        this.$root.$emit('updateCart')
        this.loading = false
      },
      async deleteItem(item) {
        this.$q.dialog({
          title: item.name,
          message: 'Do you want delete this Product?',
          color: 'negative',
          ok: 'Delete',
          cancel: true
        }).then(async data => {
          this.loading = true
          await this.$store.dispatch('qcommerceCart/DEL_PRODUCT_FROM_CART', item.id)
          await this.getCart()
          this.loading = false
        }).catch(() => {})
      },
      async update(item) {
        setTimeout(() => {
          //If quantity was change, update it
          if (item.quantity) {
            //Update product quantity
            this.loading = true
            let formData = {
              "productId": item.productId,
              "productOptionValues" : item.productOptionValues,
              "quantity": item.quantity,
              "cartId": this.cart.id,
              "id": item.id
            }

            //Request
            this.$store.dispatch('qcommerceCart/UPDATE_PRODUCT_INTO_CART', formData).then(async response => {
              await this.getCart()
              this.loading = false
            }).catch(error => {
              this.$helper.alert.error('Failed edit product')
              this.loading = false
            })
          }
        },100)
      },
    }
  }
</script>

<style lang="stylus">
  #shoppingCartIndex
    .q-table
      .content-btn-delete
        position absolute
        top 5px
        left 0
      .img-product
        height 150px
        width 150px
        background-position center
        background-repeat no-repeat
        background-size cover
        margin 0 auto

      .option-content
        margin-right 15px
        .option-title
          color $grey-10
          font-weight bold
          font-size 16px
        .value-title
          color $grey-8
</style>
