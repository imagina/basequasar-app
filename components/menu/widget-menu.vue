<template>
  <q-list id="list_menu" separator class="q-pt-none">
    <!--Level 1 Single-->
    <singleItem v-for="(lv1,key1) in sidebar"
                :item="lv1" :key="key1"
                v-if="!lv1.children && lv1.can">
    </singleItem>

    <!--Level 1 Dropdown-->
    <dropdownItem v-else-if="lv1.children && lv1.can"
                  :item="lv1">
      <!--Level 2 Single-->
      <singleItem v-for="(lv2,key2) in lv1.children"
                  :item="lv2" :key="key2"
                  v-if="!lv2.children && lv2.can"></singleItem>

      <!--Level 2 Dropdown-->
      <dropdownItem v-else-if="lv2.children && lv2.can"
                    :item="lv2">
        <singleItem v-for="(lv3,key3) in lv2.children"
                    :item="lv3" :key="key3"
                    v-if="lv3.can"></singleItem>
      </dropdownItem>
    </dropdownItem>

  </q-list>
</template>
<script>
  import Config from 'src/config/index'
  import authPlugin from "@imagina/quser/_plugins/auth"
  import {helper} from "@imagina/qhelper/_plugins/helper"
  import singleItem from 'src/components/menu/singleItem'
  import dropdownItem from 'src/components/menu/dropdownItem'
  import _cloneDeep from 'lodash.clonedeep'

  export default {
    components: {singleItem, dropdownItem},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        let dataMenu = _cloneDeep(Config('sidebar'))
        this.renderMenu(dataMenu)
      })
    },
    data() {
      return {
        sidebar: [],
      }
    },
    methods: {
      /*Chech if hasacces item menu*/
      async renderMenu(dataMenu) {
        //Function recursive for validate permissions
        let hasAccess = async (data) => {
          for (var item in data) {
            let itemAccess = data[item]

            itemAccess.can = itemAccess.can ? await authPlugin.hasAccess(itemAccess.can) : true
            if (itemAccess.children) {
              itemAccess.children = await hasAccess(itemAccess.children)
            }
          }
          return data//Return all data
        }

        this.sidebar = await hasAccess(dataMenu)
      },
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
