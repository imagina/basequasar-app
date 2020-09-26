<template>
  <div
    id="pageId"
    class="q-layout-page layout-padding">
    <div class="relative-position q-mb-lg backend-page">
      <div class="box">
        <div class="row gutter-x-sm gutter-y-sm">
          <div class="col-md-12">
            <div class="q-title">{{form.title}}</div>
            <div class="q-subheading">{{form.user.fullName}}</div>
          </div>
          <div class="col-md-12">
            <draggable
              @change="handleEvents"
              v-bind="dragOptions"
              v-model="fields">
              <transition-group class="list-group">
                <div
                  class="list-group-item"
                  v-for="(field, index) in fields"
                  :key="field.id">
                  {{field.label}} (<small>{{field.typeName}}</small>)
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    display: "Transitions",
    components:{
      draggable
    },
    data() {
      return {
        loading: false,
        form: {
          user:{
            fullName: '',
          }
        },
        fields: [],
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      },
    },
    created() {
      this.getForm()
      this.getFields()
    },
    methods : {
      getForm(){
        this.loading = true
        let params = {
          params: {
            include: 'user'
          }
        }
        this.$crud.show('apiRoutes.qform.forms', this.$route.params.id, params)
          .then( response => {
            this.form = response.data
            this.loading = false
          })
          .catch( error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
          })
      },
      getFields(){
        this.loading = true
        let params = {
          params : {
            filter:{
              formId: this.$route.params.id,
              order:{
                field:'order'
              }
            }
          }
        }
        this.$crud.index('apiRoutes.qform.fields', params)
          .then( response => {
            this.fields = response.data
            this.loading = false
          })
          .catch( error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
          })
      },
      updateOrderInField(data, newOrder){
        data.order = newOrder
        this.$crud.update('apiRoutes.qform.fields', data.id, data)
          .then( respose => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
          })
          .catch( error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          })
      },
      handleEvents(event){
        this.updateOrderInField(event.moved.element, event.moved.newIndex)
      }
    }
  }
</script>

<style>
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    margin: 5px;
    cursor: move;
    display: block;
    padding: 5px;
    border: lightgray 1px solid;
  }
</style>
