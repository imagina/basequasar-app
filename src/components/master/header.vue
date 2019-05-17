<template>
  <div id="masterHeader">
    <!-- ============= HEADER ======================= -->
    <q-layout-header class="no-shadow">
      <q-toolbar color="primary">
        <!--= BUTTON MENU =-->
        <q-btn flat dense round
               @click="toggleDrawer('menu',!drawer.menu)"
               aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>

        <!--= TITLE =-->
        <q-toolbar-title>
          <div class="content gt-xs">
            <router-link :to="{ name: 'app.home'}">
              <a class="text-white">
                {{projectName}}
              </a>
            </router-link>
          </div>
        </q-toolbar-title>

        <!--== Button User ==-->
        <q-btn :to="{name: 'user.profile.me'}" flat
               v-if="this.$q.platform.is.desktop && $store.state.auth.userToken">

          <img :src="getImageUrl"
               style="border-radius: 100%; margin-right: 5px; width: 25px;height: 25px;"
               width="28px">

          {{userData.firstName}}
        </q-btn>

        <!--== Button Config ==-->
        <q-btn round dense flat icon="fas fa-cog"
               @click="toggleDrawer('config',!drawer.config)">
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <!-- ============= DRAWERS ======================= -->
    <!-- MENU -->
    <q-layout-drawer id="menu_master" :overlay="true"
                     v-model="drawer.menu"
                     :content-class="'bg-grey-2'"
    >
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

    <!-- Config -->
    <q-layout-drawer id="menu_master" :overlay="true"
                     v-model="drawer.config"
                     :content-class="'bg-grey-2'"
                     side="right"
    >
      <config-list></config-list>
    </q-layout-drawer>
  </div>
</template>
<script>
  import WidgetUser from "@imagina/quser/_components/widget-user";
  import configList from 'src/components/master/configList';
  import menuList from "src/components/master/recursiveItem";

  export default {
    props: {},
    components: {
      WidgetUser,
      configList,
      menuList
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
        console.warn()
      })
    },
    data() {
      return {
        projectName: this.$store.getters['site/getSettingValueByName']('core::site-name'),
        userData: this.$store.state.auth.userData,
        drawer: {
          menu: false,
          config: false,
          notification: false
        },
        menu: config('sidebar'),
        logo : this.$store.getters['site/getSettingMediaByName']('isite::logo1').path
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