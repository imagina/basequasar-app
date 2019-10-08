<template>
  <div id="listMenu">
    <div v-for="(item,key) in props.menu" :key="key">
      <!--Single Item-->
      <q-item :class="getClassItem(item)" v-if="checkItemSingle(item)" @click.native="redirectTo(item)">
        <q-item-section v-if="item.icon && props.showIcons" avatar>
          <q-icon :name="item.icon"/>
        </q-item-section>
        <q-item-section> {{props.translatable ? $tr(item.title) : item.title}}</q-item-section>
      </q-item>

      <!-- Dropdwon Item -->
      <q-expansion-item v-else-if="checkItemMultiple(item)" :icon="item.icon" :key="key"
                        :label="props.translatable ? $tr(item.title) : item.title"
                        :header-class="selectedChildren(item)"
                        :class="selectedChildren(item) ? 'bg-primary' : ''">
        <!--Recursive item-->
        <recursive-menu :translatable="props.translatable" :show-icons="props.showIcons"
                        :key="key" :menu="item.children"/>
      </q-expansion-item>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'recursiveMenu',
    components: {},
    props: {
      menu: { default: false },
      showIcons: { type: Boolean, default: true },
      translatable: { type: Boolean, default: true }
    },
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    },
    data () {
      return {
        props: {}
      }
    },
    methods: {
      //init
      init () {
        this.props = this.$clone(this.$props)
        setTimeout(() => {
          this.checkCollapsibles()
        }, 100)
      },
      //Validate if should load single-item
      checkItemSingle (item) {
        let response = true
        if (!item.activated) response = false
        if (item.children) response = false
        if (!item.name) response = false
        if (item.permission && !this.$auth.hasAccess(item.permission)) response = false
        return response//Response
      },
      //Validate if should load multi-item
      checkItemMultiple (item) {
        let response = true
        if (!item.children) response = false
        if (item.children && !item.children.length) response = false
        if (item.permission && !this.$auth.hasAccess(item.permission)) response = false
        return response//Response
      },
      //Validate if should load all multi-item
      checkCollapsibles () {
        let collapsibles = this.$el.getElementsByClassName('q-expansion-item')

        for (let group of collapsibles) {
          let items = group.getElementsByClassName('single-item')
          if (!items.length) group.style.display = 'none'
        }
      },
      //Redirect to route of pages
      redirectTo (item) {
        if (item.linkType && (item.linkType == 'external')) {
          window.open(`https://${item.url}`, item.target)
        } else {
          this.$router.push({ name: item.name, params: item.params || {} })
        }
      },
      //Validate if children of multi-item is selected
      selectedChildren (item) {
        let response = ''//Defualt response

        //If has children's
        if (item.children) {
          let routeName = this.$route.name
          let isSelectedChildren = item.children.find(item => item.name == routeName)
          if (isSelectedChildren) response = ' item-is-active'
        }

        return response //Response
      },
      //Validate if item is same of current page
      getClassItem (item) {
        let response = 'single-item'

        if (this.$route.name == item.name) {
          if (JSON.stringify(this.$route.params) == JSON.stringify(item.params || {})) {
            response += ' item-is-active'
          }
        }

        return response
      }
    }
  }
</script>
<style lang="stylus">
  #listMenu
    .q-expansion-item__container
      .q-expansion-item__content
        padding 0 0 0 7px
        border-left 8px solid white

    .q-item
      cursor pointer
      background-color white
      color $grey-9
      .q-item__section--avatar
        min-width 20px
        padding-right 10px
      .q-icon
        font-size 16px
      &:hover
        background-color $grey-4
        color $primary
        .q-icon
          color $primary
      &.item-is-active
        background-color $primary
        .q-item__section, .q-icon
          color white
</style>


