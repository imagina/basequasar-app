<template>
  <div>
    <div id="showProductPage" class="q-container">
      <div class="row gutter-x-sm q-mt-md">
        <div class="col-12 col-md-3">
          <menu-categories class="widgetMenuCategories" title="· Nuestro Menú ·"/>
        </div>

        <!--== Content ==-->
        <div id="showProductContent" class="col-12 col-md-9">
          <div class="relative-position" style="min-height: 150px">
            <!--Product-->
            <div class="row justify-end" v-if="productData">
              <!--Products of same category-->
              <div class="selectorOtherProducts col-12 col-md-7">
                <div class="q-title q-py-sm q-mr-sm title">
                  Seleccione un Producto:
                </div>
                <select-products :category-id="productData.categoryId" v-model="productSelectd"
                                 @input="$router.push({name: 'product.show', params : {slugProduct : productSelectd}})"/>
              </div>

              <!--Data product-->
              <div class="col-12 row gutter-x-sm content q-mt-lg">
                <!--Image-->
                <div class="col-12 col-md-5">
                  <img :src="productData.mainImage.path"
                       class="responsive m-w-100 full-width">
                </div>
                <!--Name and description-->
                <div class="col-12 col-md-7 q-mt-sm">
                  <div class="q-display-2 color-baked-title">
                    {{productData.name}}
                  </div>
                  <div v-html="productData.description" class="q-title">{{productData.description}}</div>
                  <add-to-cart :product-id="productData.id" :price="productData.price" />
                </div>
              </div>
            </div>
            <!--Not found-->
            <not-found route-name="products.index" button-label="Go to Products"
                       v-else-if="!loading"/>
            <!--Inner Loading-->
            <inner-loading :visible="loading"></inner-loading>
          </div>
          <!--Inner Loading-->
          <inner-loading :visible="loading"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // Components
  import menuCategories from '@imagina/qcommerce/_components/frontend/categories/menu'
  import selectProducts from '@imagina/qcommerce/_components/frontend/products/widgets/selectProducts'
  import addToCart from '@imagina/qcommerce/_components/frontend/cart/widgets/addToCartOptions'

  // Services
  import icommerceService from '@imagina/qcommerce/_services/index';

  import {helper} from '@imagina/qhelper/_plugins/helper'

  export default {
    props: {},
    components: {
      menuCategories,
      selectProducts,
      addToCart,
    },
    mounted() {
      this.$nextTick(function () {
        this.getData()
      })
    },
    watch: {
      $route(to, from) {
        this.getData()
      }
    },
    data() {
      return {
        loading: false,
        productData: false,
        productSelectd: false,
      }
    },
    computed: {},
    methods: {
      //Get data
      getData() {
        this.loading = true
        let slugProduct = this.$route.params.slugProduct
        let params = {
          refresh: true,
          params: {filter: {field: 'slug'}, include: 'productOptions,optionValues'}
        }
        icommerceService.crud.show('apiRoutes.qcommerce.products', slugProduct, params).then(response => {
          this.productData = response.data//Add data
          this.productSelectd = response.data.slug//Set product selected
          this.loading = false
        }).catch(error => {
          this.$alert.error({message : 'Failed: ' + error, pos : 'bottom'})
          this.loading = false
        })
      },
    }
  }
</script>

<style lang="stylus">
  #showProductPage
    margin 25px auto
    #showProductContent
      .border-top
        border-top 2px solid $grey-3

      .selectorOtherProducts
        display flex

        .title
          min-width max-content

      .content
        img
          border 1px solid $grey-3
          border-radius 20px

      #widgetSelectProducts
        .vue-treeselect
          border 0px
          border-bottom 2px solid $tertiary

          .vue-treeselect__single-value
            font-size 22px
            color $tertiary
            line-height 1.3

          .vue-treeselect__control-arrow-container
            svg
              color $primary

</style>
