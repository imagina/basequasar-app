<template>
  <div id="masterHeader">
    <q-layout-header class="no-shadow bg-primary">
      <div class="q-container">
        <div class="flex justify-between">
          <q-toolbar-title class="" >
            <div class="content gt-xs">
              <router-link :to="{ name: 'app.home'}">
                <a class="text-white" style="line-height: 48px;">
                  {{projectName}}
                </a>
              </router-link>
            </div>
          </q-toolbar-title>
          <div>
          <menuComponent :menu="menu" class="desktop-only"/>
  
            <q-btn
              flat dense round
             class="mobile-only"
             color="white"
             @click="toggleDrawer('menu',!drawer.menu)"
             aria-label="Menu">
              <q-icon name="menu"/>
            </q-btn>
  
            <q-layout-drawer
              id="menu_master"
              :overlay="true"
              v-model="drawer.menu"
              :content-class="'bg-grey-2'">
              <q-list no-border link inset-delimiter>
                <!-- === LOGO === -->
                <q-list-header class="text-center">
                  <router-link :to="{ name: 'app.home'}">
                    <a>
                      <img :src="logo" width="90%">
                    </a>
                  </router-link>
                </q-list-header>
      
                <!--= MENU =-->
                <menu-list :menu="menu"/>
              </q-list>
            </q-layout-drawer>
            
        </div>
      </div>
    </div>
    </q-layout-header>
  </div>
</template>
<script>
  import WidgetUser from "@imagina/quser/_components/widget-user";
  import configList from '../configList';
  import menuList from "../recursiveItem";
  import menuComponent from 'src/components/master/frontend/menu'

  export default {
    props: {},
    components: {
      WidgetUser,
      configList,
      menuList,
      menuComponent
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        projectName: this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name'),
        userData: this.$store.state.quserAuth.userData,
        drawer: {
          menu: false,
          config: false,
          notification: false
        },
        menu: (this.$store.getters['qmenuMaster/menu'](9)).items,
        logo : this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path
      }
    },
    computed: {
      getImageUrl() {
        return config('apiRoutes.api.base_url') + '/' + this.userData.smallImage;
      }
    },
    methods: {
      //Show drawer specific
      toggleDrawer(name, show) {
        //Hidden all drawers
        for (var drawer in this.drawer) {
          this.drawer[drawer] = false
        }
        this.drawer[name] = show//Show only drawer specific
      },
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
