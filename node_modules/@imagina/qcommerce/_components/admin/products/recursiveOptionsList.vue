<template>
  <q-list no-border separator link id="listOptionsCommerce" class="q-pa-none" v-if="!loading">
    <!-- Dropdwon Item -->
      <draggable
          tag="div"
          v-if="productOptions.length>0"
          v-bind="dragOptions"
          :list="productOptions"
          :group="{ name: 'g1' }"
          @change="vEmit"
          >
        <q-expansion-item v-for="item in productOptions" :key="item.id" expand-icon-class="hidden">
          <template slot="header">
            <q-radio v-model="optionSelected" :val="item.id" @input="vEmit()"/>
            <q-item-section>{{item.description}}</q-item-section>
            <q-item-section side>
              <div>
                <q-btn icon="fas fa-plus" color="positive" v-if="permitChildren(item)"
                       size="xs" @click="vEmitAddOption(item.id)">
                  <q-tooltip>{{`${$tr('ui.label.add')} ${$tr('ui.label.option')}`}}</q-tooltip>
                </q-btn>
                <q-btn icon="far fa-trash-alt" color="negative"
                       class="q-ml-xs" size="xs" @click="vEmitDelete(item.id)">
                  <q-tooltip>{{`${$tr('ui.label.delete')}`}}</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </template>
          <recursive-options-list v-if="item.children" :list-items="item.children"
                                  :parent-id="item.id" v-model="optionSelected" @add="vEmitAddOption(optionSelected)"
                                  @delete="vEmitDelete(optionSelected)" @input="vEmit"/>
        </q-expansion-item>
    </draggable>
  </q-list>
</template>
<script>
  //Services
  import draggable from 'vuedraggable'
  export default {
    name: 'recursiveOptionsList',
    components: {
      draggable
    },
    props: {
      listItems: { default: false },
      parentId: { default: 0 },
      value: { default: null }
    },
    watch: {
      listItems () {
        this.init()
      },
      value () {
        this.optionSelected = this.value
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    },
    data () {
      return {
        loading: false,
        productOptions: [],
        optionSelected: null
      }
    },
    methods: {
      //Init Form
      init () {
        this.loading = true
        this.productOptions = this.$clone(this.$array.builTree(this.listItems, this.parentId))
        this.loading = false
      },
      permitChildren (item) {
        let types = ['select', 'radio']
        let response = types.indexOf(item.type)
        return (response == -1) ? false : true
      },
      vEmit () {
        this.$emit('input', this.optionSelected)
      },
      vEmitAddOption (optionId) {
        this.optionSelected = optionId
        this.vEmit()
        this.$emit('add')
      },
      vEmitDelete (optionId) {
        this.optionSelected = optionId
        this.vEmit()
        this.$emit('delete')
      },
      vRefresh () {
        this.init()
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
  }
</script>
<style lang="stylus">
  #listOptionsCommerce
    .q-item
      padding 0px

      .q-item-side
        &.relative-position
          display: none

    .q-expansion-item
      .q-expansion-item__content
        padding 0px 0px 0px 15px
</style>


