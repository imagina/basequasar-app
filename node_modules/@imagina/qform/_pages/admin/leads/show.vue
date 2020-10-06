<template>
  <div id="componentCrudIndex">
    <div class="backend-page">
      <div class="relative-position col-12">
        <q-table
        class="box-table"
        :title="form.title"
        :data="table.data"
        :columns="table.columns"
        row-key="name">
        <template slot="top">
          <div class="table-top-left col-12 col-md-4 col-xl-3">
            <div class="q-title text-primary ellipsis">
              <span>{{form.title}}</span>
            </div>
          </div>
          <div class="table-top-right col-12 col-md-8 col-xl-9 text-right">

            <q-btn
              @click="forceDownload()"
              icon="fas fa-download"
              color="primary"
              class="q-ml-xs"/>
            <q-btn
              @click="getLeads(true)"
              icon="fas fa-sync-alt"
              color="info"
              class="q-ml-xs"/>
          </div>
        </template>
      </q-table>
        <inner-loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        form:{
          title:''
        },
        leads:[],
        table:{
          columns:[],
          data:[],
        },
      }
    },
    created() {
      this.getLeads()
      this.getFields()
      this.getForm()
    },
    methods : {
      getForm(){
        this.loading = true
        let params = {
          params :{}
        }
        this.$crud.show('apiRoutes.qform.forms',this.$route.params.id, params)
        .then( response => {
          this.form = response.data
          this.loading = false
        })
        .catch( error => {
          this.loading = false
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      getFields(){
        this.loading = true
        let params = {
          params :{
            filter: {
              formId: this.$route.params.id
            },
          }
        }
        this.$crud.index('apiRoutes.qform.fields', params)
        .then( response => {
          this.loading = false
          this.table.columns = this.orderColumnsForTable(response.data)
        })
        .catch( error => {
          this.loading = false
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      orderColumnsForTable(array){
        return  array.map( item => {
          return {
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
          }
        })
      },
      getLeads( refresh = false){
        let params = {
          refresh: refresh,
          params:{
            filter:{
              formId: this.$route.params.id
            },
          }
        }
        this.loading = true
        this.$crud.index('apiRoutes.qform.leads',params)
        .then( response => {
          this.leads =  response.data
          this.table.data =  this.orderDataForTable(response.data)
          this.loading = false
        })
        .catch( error => {
          this.loading = false
          console.error(error)
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
        })
      },
      orderDataForTable(array){
        let values = array.map( item => {
          return typeof item.values == "object" ? item.values : JSON.parse(item.values)
        })
        let response = [...values]
        for( let x in values ){
          for ( let y in values[x]){
            response[x][ values[x][y].name ] = values[x][y].model
          }
        }
        return response
      },
      forceDownload(){
        let url = `${config('apiRoutes.qform.leads')}?filter={"formId":${this.$route.params.id},"export":"true"}`
        window.open(url, '_blank');
      }

    }
  }
</script>

<style scoped>

</style>
