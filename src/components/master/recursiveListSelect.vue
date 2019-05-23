<template>
  <div id="treeListSelect" class="round-borders q-py-md q-px-sm">
    <div class="row header-list">
      <!-- Title -->
      <div class="col-12 col-md-6 q-title q-ma-none text-primary q-mb-sm">
        <q-icon :name="icon" v-if="icon && title" class="q-mr-md"></q-icon>
        <span v-if="title">{{title}}</span>
      </div>
      <!-- Search -->
      <div :class="'col-12 q-mb-md '+ (icon && title ? 'col-md-6 ' : '')">
        <q-search v-model="search" placeholder="Search..." clearable hide-underline/>
      </div>
    </div>
    <!-- List -->
    <q-scroll-area style="width: 100%; height: 250px;">
      <q-tree
        :nodes="items"
        default-expand-all
        color="primary"
        :ticked.sync="itemsSelected"
        tick-strategy="leaf-filtered"
        :filter="search"
        node-key="id"
        @input.sync="changeSelectedItems()"
      />
    </q-scroll-area>
  </div>
</template>
<script>
  //Plugins
  import auth from '@imagina/quser/_plugins/auth'

  export default {
    name: 'recursiveList',
    components: {},
    props: {
      items: {default: false},
      title: {default: false},
      icon: {default: false},
      value: {default: []},
    },
    watch: {
      itemsSelected() {
        this.changeSelectedItems()
      },
      value() {
        this.itemsSelected = this.value
      }
    },
    mounted() {
      this.$nextTick(function () {
        if (this.value && this.value.length)
          this.itemsSelected = this.value
      })
    },
    data() {
      return {
        itemsSelected: [],
        ticked: [],
        search: null
      }
    },
    methods: {
      //Event when change selected items
      changeSelectedItems() {
        this.$emit('input', this.itemsSelected)
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";

  #treeListSelect
    .header-list
      border-bottom 1px solid $grey-4
      margin-bottom 10px
</style>


