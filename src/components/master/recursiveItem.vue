<template>
	<q-list separator link no-border id="listMenu" class="q-pa-none">
		<!--Single Item-->
		<q-item :to="{name : item.name}" v-if="checkItemSingle(item)" exact
		        v-for="(item,key) in menu" :key="key">
			<q-item-side :icon="item.icon"/>
			<q-item-main>{{item.title}}</q-item-main>
		</q-item>

		<!-- Dropdwon Item -->
		<q-collapsible v-else-if="checkItemMultiple(item)"
		               :icon="item.icon" :label="item.title">
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
						let items = group.getElementsByClassName('q-link')
						if(!items.length)
							group.style.display = 'none'
					}
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


