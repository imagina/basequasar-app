<template>
  <div id="widgetSelectProducts">
    <q-select outlined dense v-model="productSlug" emit-value map-options
              :options="products" @input="$emit('input',productSlug)"
              :style="'width: '+width+' !important'" />
  </div>
</template>
<script>
  export default {
    props: {
      value: {default: false},
      categoryId: {default: false},
      width: {default: 'auto'}
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.productSlug = this.value
        this.getData()
      })
    },
    data() {
      return {
        loading: false,
        products: [],
        productSlug: null
      }
    },
    methods: {
      //Get data
      getData(refresh = false) {
        if (this.categoryId) {
          this.loading = true
          let params = {
            refresh: refresh,
            params: {filter: {categoryId: this.categoryId}}
          }
          //Request
          this.$crud.index('apiRoutes.qcommerce.products', params).then(response => {
            this.products = this.$array.tree(response.data, {label: 'name', id: 'slug'})
            this.loading = false
          }).catch(error => {
            console.error('[select-product-widget] Error getting products by category', error)
            this.loading = false
          })
        }
      },
      //Method to refresh data
      vRefresh() {
        this.getData(true)
      }
    }
  }
</script>
<style lang="stylus">
  #widgetSelectProducts
    display: inline-block
    min-height 40px !important
</style>
