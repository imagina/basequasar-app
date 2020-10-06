<template>
  <div>
    <draggable
      tag="div"
      v-if="optionValues.length>0"
      v-bind="dragOptions"
      :list="optionValues"
      :group="{ name: 'g1' }">
      <div
        class="list-group-item"
        v-for="(optionValue, index) in optionValues"
        :key="optionValue.id">
        <div class="row justify-between q-mb-xs q-mt-xs">
          <div class="col-6 q-py-xs">
            <q-icon class="cursor-pointer" name="fas fa-arrows-alt"/>
            {{optionValue.description}}
          </div>
          <div class="col-6 text-right q-py-xs relative-position">
            <!--:to="{name: 'qcommerce.admin.optionValues.update', params: {optionId: $route.params.id, id: optionValue.id}}"-->
            <q-btn
              @click="$root.$emit('showEdit',optionValue.id)"
              icon="fas fa-pen"
              size="xs"
              class="q-mr-sm"
              color="positive"/>
            <q-btn
              @click="dialogDeleteItem = true; itemIdToDelete = optionValue"
              icon="fas fa-trash-alt"
              size="xs"
              color="negative"/>
          </div>
          <div class="col-12">
            <q-separator/>
          </div>
        </div>
        <nestedDraggable v-if="optionValue.children"
          :class="`${optionValue.children.length} ?: q-mb-xs`"
          :optionValues="optionValue.children"/>
      </div>
    </draggable>
    <div class="col-12 text-center text-h5" v-else>
      No Data
    </div>

    <q-dialog v-model="dialogDeleteItem">
      <q-card class="backend-page">
        <q-card-section>
          <h5 class="q-ma-none text-negative">{{itemIdToDelete.label}}</h5>
          {{$tr('ui.message.deleteRecord')}}
        </q-card-section>

        <q-card-actions align="right">
          <!--Button cancel-->
          <q-btn color="blue-grey" label="Cancel" @click="dialogDeleteItem = false"/>
          <!--Button confirm delete category-->
          <q-btn color="negative" icon="fas fa-trash-alt"
                 label="Delete" @click="deleteItem()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import optionValuesForm from '@imagina/qcommerce/_pages/admin/optionValues/form'
  export default {
    name: 'nestedDraggable',
    components: {
      draggable,
      optionValuesForm
    },
    props: {
      optionValues: {
        required: true,
        type: Array
      }
    },
    data() {
      return {
        dialogDeleteItem: false,
        dialogEditValue: false,
        itemIdToDelete: {},
        optionId: this.$route.params.id || null,
        id: null,
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
    methods: {
      deleteItem() {
        this.$crud.delete('apiRoutes.qcommerce.optionValues', this.itemIdToDelete.id)
          .then(response => {
            this.$alert.success({message: this.$tr('ui.message.recordDeleted')})
            this.dialogDeleteItem = false
            this.$emit('updated')
          }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.recordNoDeleted'), pos: 'bottom'})
        })
      },
    }
  };
</script>

<style lang="stylus">
  .list-group-item
    .list-group-item
      padding-left 15px !important
</style>
