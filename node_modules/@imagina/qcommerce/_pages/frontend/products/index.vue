<template>
  <div class="bg-grey-2">
    <div class="q-container relative-position q-px-md">
      <div class="row gutter-x-sm q-py-md">
        <!--Left-->
        <div class="col-12 col-md-4 col-lg-3">
          <!--Search-->
          <div class="backend-page q-mb-md bg-white">
            <q-search ref="search" v-model="search" clearable
                      :debounce="700" @input="getProducts()"/>
          </div>

          <!--Categories-->
          <menu-categories class="widgetMenuCategories"
                           title="Nuestro Menú" icon="fas fa-list"/>
        </div>

        <!--Right-->
        <div class="col-12 col-md-8 col-lg-9">
          <div
            class="row gutter-x-sm"
            v-if="products.length">
            <router-link
              tag="div" :key="index"
              v-for="(product, index) in products"
              class="col-12 col-md-4 text-center product"
              :to="{name:'product.show', params: { slugProduct: product.slug }}">
              <div
                :style="`background-image: url(${product.mainImage.path});`"
                class="product-img">
                <q-btn
                  :to="{name:'product.show', params: { slugProduct: product.slug }}"
                  label="Pedir"
                  color="primary"
                  class="q-btn inline q-my-md btn-product"/>
              </div>
              <div class="q-mt-lg">
                <span class="q-display-1 color-baked-title">
                  {{product.name}}
                </span>
                <p class="">
                  $ {{$n(product.price)}}
                </p>
              </div>
            </router-link>
          </div>
          <div
            class="row"
            v-else>
            <div class="col-md-12">
              <span class="q-display-1">
                No hay productos que concuerden con la selección.
              </span>
            </div>
          </div>
          <div
            class="row"
            v-if="paginate.maxPages > 1">
            <div class="col-md-12 flex justify-end q-pt-xl">
              <q-pagination
                direction-links
                @input="getProducts()"
                v-model="paginate.page"
                :min="paginate.minPages"
                :max="paginate.maxPages"/>
            </div>
          </div>
        </div>
      </div>
      <!--Inner Loading-->
      <inner-loading :visible="visible"></inner-loading>
    </div>
  </div>
</template>

<script>
  // Services
  import icommerceService from '@imagina/qcommerce/_services/index';

  // Components
  import menuCategories from '@imagina/qcommerce/_components/frontend/categories/menu'

  export default {
    components: {
      menuCategories
    },
    beforeRouteLeave(to, from, next) {
      next()
      this.focusSearch()//Check if load search
    },
    watch: {
      $route(to, from) {
        this.getProducts()
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    data() {
      return {
        showProduct: false,
        visible: false,
        products: [],
        paginate: {
          page: 1,
          take: 10,
          minPages: 1,
          maxPages: 0
        },
        search: ''
      }
    },
    methods: {
      //Init
      init() {
        this.focusSearch()//Check if load search
        this.getProducts()//Get products
      },
      //Focus search
      focusSearch() {
        if (this.$route.params.search)
          this.$refs.search.focus()
      },
      // Get all products by category :slug
      getProducts() {
        this.visible = true
        let params = {
          params: {
            filter: {
              categorySlug: this.$route.params.slugCategory,
              locale: 'es',
               search: this.search
            },
            include: 'productOptions,optionValues',
            take: this.paginate.take,
            page: this.paginate.page,
          }
        }

        icommerceService.crud
          .index('apiRoutes.qcommerce.products', params)
          .then(response => {
            this.paginate.maxPages = response.meta.page.lastPage
            this.products = response.data
            this.visible = false
          })
          .catch(error => {
            this.$alert.error({message: 'Failed: ' + error, pos: 'bottom'})
            this.visible = false
          })
      }
    }
  }

</script>

<style lang="stylus">
  div.product
    cursor pointer

  .product-img
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%
    height 260px
    border: 1px solid #dddddd52
    border-radius 10px

  .btn-product
    margin-top 240px

  .color-secondary
    color: $secondary

  .color-primary
    color: $secondary

</style>
