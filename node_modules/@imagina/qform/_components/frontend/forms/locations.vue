<template>
  <div class="row q-my-md">
    
    <!--Countries-->
    <div class="col-md-12">
    
    </div>
    
    <!--Provinces-->
    <div class="col-md-12"></div>
  
    <!--Cities-->
    <div class="col-md-12"></div>
    
  </div>
</template>

<script>
  export default {
    data () {
      return{
        loading: false,
        countries: {
          loading: false,
          data:[]
        },
        provinces: {
          loading: false,
          data:[]
        },
        cities: {
          loading: false,
          data:[]
        },
      }
    },
    mounted(){
      //this.getCountries()
    },
    methods:{
      getCountries() {
        this.countries.loading = true
        let params = {params: ''}
        this.$crud.index('apiRoutes.qlocations.countries', params)
        .then( response => {
          this.countries.data = response.data
          this.countries.loading = false
        })
        .catch( error => {
          this.countries.loading = false
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      getProvinces(countryId) {
      
      },
      getCities(provinceId){
      
      }
    }
  }
</script>

<style scoped>

</style>
