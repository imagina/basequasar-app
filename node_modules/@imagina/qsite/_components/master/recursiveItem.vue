<template>
  <div>
    <div id="listMenu">
      <q-no-ssr v-for="(item,key) in props.menu" :key="key" :class="`content-item ${inLine ? 'inline-block' : ''}`">
        <!--Single Item-->
        <q-item :class="getClassItem(item)" v-if="checkItemSingle(item)" tag="a"
                :to="{name: item.name, params: item.params || {}}" clickable :key="key">
          <q-item-section v-if="item.icon && props.showIcons" avatar>
            <q-icon :name="item.icon"/>
          </q-item-section>
          <q-item-section class="text-capitalize"> {{props.translatable ? $tr(item.title) : item.title}}
          </q-item-section>
        </q-item>

        <!-- Dropdwon Item -->
        <q-expansion-item v-else-if="checkItemMultiple(item)" :icon="item.icon" :key="key"
                          :label="props.translatable ? $tr(item.title) : item.title"
                          v-bind="group ? {group : listUid} : {}"
                          :header-class="selectedChildren(item)" :default-opened="selectedChildren(item) ? true : false"
                          :class="selectedChildren(item) ? 'expansion-selected' : ''">
          <!--Recursive item-->
          <recursive-menu :translatable="props.translatable" :show-icons="props.showIcons"
                          :key="key" :menu="item.children" :group="group"/>
        </q-expansion-item>
      </q-no-ssr>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'recursiveMenu',
    components: {},
    props: {
      menu: {default: false},
      showIcons: {type: Boolean, default: true},
      translatable: {type: Boolean, default: true},
      inLine: {type: Boolean, default: false},
      group: {type: Boolean, defualt: false}
    },
    watch: {
      menu() {
        this.init()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        listUid: this.$uid().toString(),
        props: {}
      }
    },
    methods: {
      //init
      init() {
        this.props = this.$clone(this.$props)
        setTimeout(() => {
          this.checkCollapsibles()
        }, 300)
      },
      //Validate if should load single-item
      checkItemSingle(item) {
        let response = true
        if (!item.activated) response = false
        if (item.children) response = false
        if (!item.name) response = false
        if (item.permission && !this.$auth.hasAccess(item.permission)) response = false
        return response//Response
      },
      //Validate if should load multi-item
      checkItemMultiple(item) {
        let response = true
        if (!item.children) response = false
        if (item.children && !item.children.length) response = false
        if (item.permission && !this.$auth.hasAccess(item.permission)) response = false
        return response//Response
      },
      //Validate if should load all multi-item
      checkCollapsibles() {
        let collapsibles = this.$el.getElementsByClassName('q-expansion-item')

        for (let group of collapsibles) {
          let items = group.getElementsByClassName('single-item')
          if (!items.length) group.style.display = 'none'
        }
      },
      //Redirect to route of pages
      redirectTo(item) {
        if (item.linkType && (item.linkType == 'external')) {
          window.open(`https://${item.url}`, item.target)
        } else if(item.name) {
          this.$router.push({name: item.name, params: item.params || {}})
        }
      },
      //Validate if children of multi-item is selected
      selectedChildren(item) {
        let response = ''//Defualt response

        //Validate if current route name is like children
        let validateRouteName = (children) => {
          let routeName = this.$route.name//Route name
          let response = false// Default response
          if (children)
            children.forEach(element => {
              if (element.name == routeName) response = true
              if (element.children && validateRouteName(element.children)) response = true
            })
          return response
        }

        //If has children's
        if (item.children && validateRouteName(item.children)) response = ' item-is-active'

        return response //Response
      },
      //Validate if item is same of current page
      getClassItem(item) {
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
        padding 0 0 0 15px

    .q-item
      cursor pointer
      background-color white
      color $grey-9

      .q-item__section--avatar
        min-width 20px
        padding-right 10px

      .q-icon
        font-size 16px
</style>


