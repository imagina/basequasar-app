<template>
	<q-list separator link no-border id="listMenu" class="q-pa-none">
		<!--Single Item-->
		<q-item v-for="(item,key) in menu" :key="key"
            v-if="checkItemSingle(item)"
						:class="`single-item ${$route.name == item.name ? 'router-link-active' : ''}`"
            @click.native="redirectTo(item)">
			<q-item-side :icon="item.icon"/>
			<q-item-main>{{$tr(item.title)}}</q-item-main>
		</q-item>

		<!-- Dropdwon Item -->
		<q-collapsible v-else-if="checkItemMultiple(item)" :class="selectedChildren(item)">
			<!--Custom Header-->
			<template slot="header">
				<q-item-main>
					<q-icon :name="item.icon" class="icon-collapsible q-mr-sm text-grey-8" />
					<span class="icon-collapsible">{{$tr(item.title)}}</span>
				</q-item-main>
			</template>
			<!--Recursive item-->
			<recursive-menu :key="key" :menu="item.children"/>
		</q-collapsible>
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
						let items = group.getElementsByClassName('single-item')
						if(!items.length)
							group.style.display = 'none'
					}
				}
			},
      redirectTo(item){
				let itemClone = this.$clone(item)
        if (itemClone.linkType == 'external'){
          window.open(`https://${itemClone.url}`,itemClone.target);
        }else{
          this.$router.push({name: itemClone.name})
        }
      },
			selectedChildren(item){
				let response = ''//Defualt response

				//If has children's
				if(item.children){
					let routeName = this.$route.name
					let isSelectedChildren = item.children.find(item => item.name == routeName)
					if(isSelectedChildren) response = 'collapsible-active'
				}

				return response //Response
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
			.q-collapsible-sub-item
				padding 0 15px
				padding-right 0

		.collapsible-active
			.icon-collapsible
				transition .5s
				color $primary !important
				font-weight bold

		.router-link-active
			transition .5s
			background-color $primary
			color white
			.q-icon
				transition .5s
				color white !important

		.q-item, q-collapsible
			min-height 38px !important
			padding 6px 10px
</style>


