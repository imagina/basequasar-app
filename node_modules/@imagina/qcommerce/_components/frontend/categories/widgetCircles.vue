<template>
  <div class="row">
    <div class="col-md-12 flex flex-center">
      <router-link
        tag="a"
        v-for="(category, index) in categories"
        :key="index"
        class="q-mx-sm q-py-sm"
        :to="{name:'products.index', params: { slugCategory: category.slug }}">
        <div class="flex flex-center text-white border">
          <div
            class="flex flex-center text-white circle text-center"
            :style="formatImage(category.mainImage.path)">
            {{category.title}}
            <q-btn
              :label="btnLabel"
              color="primary"
              :to="{name:'products.index', params: { slugCategory: category.slug }}"
              rounded style="position: absolute; margin-top: 38px;"/>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
  // Services
  import icommerceService from '@imagina/qcommerce/_services/index';
  export default {
    props:{
      btnLabel:{
        type:String,
        default:'PEDIR'
      }
    },
    data(){
      return{
        categories:[],
      }
    },
    created(){
      this.getData()
    },
    methods:{
      // Format image of category in the style prop
      formatImage(path){
        return `background: url(${path}) no-repeat center;`
      },
      // Get all categories avaliables
      getData(){
        let params = {
          params:{}
        }
        icommerceService.crud
        .index('apiRoutes.eCommerce.categories',params)
        .then(response => {
          this.categories = response.data
        })
        .catch(error=>{
          this.$helper.alert.error('Failed: ' + error, 'bottom')
        })
      }
    }
  }
</script>

<style lang="stylus">
  .circle
    border-radius 50%
    background $primary
    height 90%
    width 90%
    font-size 25px

  .border
    &:hover
      background $primary
      border 2px $primary solid

  .border
    border-radius: 50%;
    height: 200px;
    width: 200px;
    border: 2px #8e7e7d dashed;
    transition: all .7s;

</style>
