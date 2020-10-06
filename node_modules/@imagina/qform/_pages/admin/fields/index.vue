<template>
  <div
    id="pageId"
    class="q-layout-page layout-padding">
    <div class=" q-mb-lg backend-page">

      <div class="box q-mb-sm" v-if="false">
        <render-form :formId="$route.params.id"/>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-md-5">
          <div class="box">
            <div class="row gutter-y-sm">
              <div class="col-md-12 ">
                <formForm/>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-7 relative-position">
          <div class="box">
            <div class="row gutter-y-sm">
              <div class="col-md-12 ">
                <div class="float-right">
                  <q-btn
                    icon="fas fa-arrow-alt-circle-left"
                    :to="{name: 'qform.admin.form.index'}"
                    label="Back to forms"
                    color="primary"
                    class="q-ml-xs"/>
                  <q-btn
                    v-if="false"
                    @click="updateOrder()"
                    icon="reorder"
                    label="Update Order"
                    color="primary"
                    class="q-ml-xs"/>
                  <q-btn
                    icon="fas fa-edit"
                    :to="{name: 'qform.admin.fields.create', params: {formId: $route.params.id} }"
                    label="new Redcord"
                    color="green"
                    class="q-ml-xs"/>
                  <q-btn
                    :to="{name: 'qform.admin.leads.show', params:{id: $route.params.id}}"
                    icon="fab fa-wpforms"
                    color="info"
                    class="q-ml-xs">
                    <q-tooltip :delay="300">
                      Leads
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    @click.native="getFields(true)"
                    icon="fas fa-sync-alt"
                    color="info"
                    class="q-ml-xs">
                    <q-tooltip :delay="300">
                      {{$tr('ui.label.refresh')}}
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div class="col-md-12 q-mt-md">
                <draggable @update="updateOrder" v-bind="dragOptions" v-model="fields">
                  <transition-group class="list-group">
                    <div class="row" v-for="(field, index) in fields" :key="field.id">
                      <div class="col-6 q-py-xs">
                        <q-icon class="cursor-pointer" name="fas fa-arrows-alt-v"/>
                        {{field.label}}
                      </div>
                      <div class="col-6 q-py-xs text-right">
                        <q-btn
                          icon="fas fa-pen"
                          @click="goTo(field)"
                          size="xs"
                          class="q-mr-sm"
                          color="positive"/>
                        <q-btn
                          @click="dialogDeleteItem = true; itemIdToDelete = field"
                          icon="fas fa-trash-alt"
                          size="xs"
                          class="q-mr-sm"
                          color="negative"/>
                      </div>
                      <div class="col-12">
                        <q-separator/>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
            </div>
          </div>
          <inner-loading :visible="loading"/>
        </div>
      </div>
    </div>

    <q-dialog v-model="dialogDeleteItem" prevent-close>
      <q-card class="backend-page">
        <q-card-section>
          <h5 class="q-ma-none text-negative">{{itemIdToDelete.label}}</h5>
          {{$tr('ui.message.deleteRecord')}}
        </q-card-section>

        <q-card-actions align="right">
          <!--Button cancel-->
          <q-btn color="blue-grey" label="Cancel" @click="dialogDeleteItem = false"/>
          <!--Button confirm delete category-->
          <q-btn color="negative" icon="fas fa-trash-alt" :loading="loading"
                 label="Delete" @click="deleteItem()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  import renderForm from '@imagina/qform/_components/frontend/forms/renderForm'
  import formForm from '@imagina/qform/_components/admin/forms/form'
  import draggable from 'vuedraggable'
  import {helper} from "@imagina/qhelper/_plugins/helper";


  export default {
    props: {},
    components: {
      draggable,
      renderForm,
      formForm
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
    watch: {
      fields: function () {
        this.fields.forEach((element, index) => {
          element.order = index
        })
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getFields(true)
      })
    },
    data() {
      return {
        loading: false,
        fields: [],
        dialogDeleteItem: false,
        itemIdToDelete: {},
      }
    },
    methods: {
      getFields(refresh = false) {
        this.loading = true
        let params = {
          refresh: refresh,
          params: {
            filter: {
              formId: this.$route.params.id,
              order: {
                field: 'order',
                way: 'asc'
              }
            }
          }
        }
        this.$crud.index('apiRoutes.qform.fields', params)
          .then(response => {
            this.fields = response.data.map(item => {
              return helper.toSnakeCase(item)
            })
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          })
      },
      handleEvents(event) {
        this.updateOrderInField(event.moved.element, event.moved.newIndex)
      },
      goTo(field) {
        this.$router.push({
          name: 'qform.admin.fields.update',
          params: {
            id: field.id
          }
        })
      },
      deleteItem() {
        this.loading = true
        this.$crud.delete('apiRoutes.qform.fields', this.itemIdToDelete.id)
          .then(response => {
            this.$alert.success({message: this.$tr('ui.message.recordDeleted')})
            this.dialogDeleteItem = false
            this.getFields(true)
            this.loading = false
          }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.recordNoDeleted'), pos: 'bottom'})
          this.loading = false
        })
      },
      updateOrder() {
        let data = {
          id: this.$route.params.id,
          fields: this.fields
        }
        this.loading = true
        this.$crud.create('apiRoutes.qform.updateOrders', data)
          .then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          })
      }
    }
  }
</script>
