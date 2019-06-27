<template>
  <q-list separator link no-border id="listMenu" class="q-pa-none">
  
    <div v-for="(item,key) in menu" :key="key">
      
      <!-- Internal Single-->
      <q-item
        style="cursor: pointer"
        v-if="checkItemSingle(item)"
        @click.native="goTo(item)"
        exact>
          <q-item-side :icon="item.icon"/>
          <q-item-main>{{item.title}}</q-item-main>
      </q-item>
      
      <!-- Internal Dropdwon-->
      <q-collapsible
        v-else-if="checkItemMultiple(item)"
        :icon="item.icon"
        :label="item.title">
          <recursive-menu
            :key="key"
            :menu="item.children"/>
      </q-collapsible>
    
    </div>
  </q-list>
</template>

<script>
	//Plugins
	import auth from '@imagina/quser/_plugins/auth'

	export default {
		name: 'recursiveMenu',
		components: {},
		props: {
			menu: {default: false}
		},
    filters:{
      url(val){
        return `https://${val}`
      }
    },
		created() {
			this.$nextTick(function () {
				this.checkCollapsibles()
			})
		},
		methods: {
			checkItemSingle(item) {
				let response = true
				if (!item.activated) response = false
				if (item.children) response = false
				if (!item.name) response = false
				if (item.permission && !auth.hasAccess(item.permission)) response = false
				return response//Response
			},
			checkItemMultiple(item) {
				let response = true
				if (!item.children) response = false
				if (item.children && !item.children.length) response = false
				if (item.permission && !auth.hasAccess(item.permission)) response = false
				return response//Response
			},
			checkCollapsibles() {
				let collapsibles = this.$el.getElementsByClassName('q-collapsible')
				if(collapsibles.length){
					for(var group of collapsibles){
						let items = group.getElementsByClassName('q-link')
						if(!items.length)
							group.style.display = 'none'
					}
				}
			},
      checkItemExternalLink(item){
			  if (item.linkType == 'external'){
			    return true
        }
        return false
      },
      goTo(item){
        if (item.linkType == 'external'){
          window.open(`https://${item.url}`,item.target);
        }else{
          this.$router.push({name: item.name})
        }
      }
		}
	}
</script>
<style lang="stylus">
	@import "~variables";
	#listMenu
		.q-icon
			font-size 16px

		.q-collapsible-inner
			a, .q-collapsible
				border-top none !important

		.q-item, q-collapsible
			min-height 38px !important
			padding 6px 10px
</style>


