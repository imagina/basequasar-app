<template>
    <q-modal position="top" content-classes="full-width" v-model="show">
        <div class="q-py-sm row justify-center bg-grey-4">
            <div class="col-12">
                <q-search
                  id="searchComponent"
                  v-model="searchValue"
                  placeholder="¿Qué buscas?"
                  hide-underline
                  color="white"
                  inverted
                  class="text-light"
                  autocomplete="off"
                  autofocus
                  ref="searchText"
                >
                  <q-autocomplete
                    @search="searchProducts"
                    :min-characters="3"
                    @selected="selected"
                    :debounce="900"
                  />
              </q-search>
            </div>
        </div>
    </q-modal>
</template>
<script>
  import qcommerceService from '@imagina/qcommerce/_services/index'
  export default {
    props: {
      value: {default: false}
    },
    data(){

      return {
        searchValue: '',
        products: [],
        show: false
      }
    },
    watch: {
      value(newValue) {
        this.show = this.value
      },
      show(newValue) {
        this.$emit('input', this.show)
        this.initForm()
      }
    },
    beforeRouteLeave (to, from, next) {
      // closing modal details if is opened
      if (!this.show) {
        next()
      } else {
        this.show = false
        next(false)
      }
    },
    created(){
      this.$root.$on("toggleSearchLocal", this.toggleSearchLocal);
    },
    mounted(){
     this.initForm()
    },
    methods:{
      searchProducts(searchValue, done) {
        let token = searchValue.toLowerCase();
        let params = {params:{filter:{search: token}}};
        qcommerceService.crud.index('apiRoutes.qcommerce.products',params).then(response => {
          let prods = response.data;
          this.products = [];
          prods.forEach((product,i) => {
            this.products[i] = {
              value: product.name,
              id: product.slug,
              label: product.name,
              sublabel: product.summary
            };
          });

          if(!prods.length){
            this.products.push({
              value: "",
              id: "no",
              label: "No se encontraron coincidencias",
              sublabel: ""
            });
          }
          done(this.products);
        });

      },
      initForm(){
        this.searchValue = ''
      },
      selected(element){
        if(element.id!="no")
          this.$router.push({name: 'product.show', params: { slugProduct: element.id }});
      },
      toggleSearchLocal(){
        this.show = !this.show
        if(this.show===true) {
          setTimeout(() => {
            this.$refs['searchText'].$children[0].focus()
          }, 10)
        }
      }
    },
  }
</script>
<style lang="stylus">
    #searchComponent
      border-radius: 30px
</style>
