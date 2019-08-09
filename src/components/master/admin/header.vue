<template>
  <div id="masterHeader">
    <!-- ============= HEADER ======================= -->
    <q-layout-header class="no-shadow">
      <q-toolbar color="primary">
        <!--= BUTTON MENU =-->
        <q-btn flat dense round
               @click="drawer.menu = !drawer.menu"
               aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>

        <!--= TITLE =-->
        <q-toolbar-title class="items-center">
          <!--Toogle Menu-->
          <q-btn :label="$tr($route.meta.title)" flat
                 @click="drawer.menu = !drawer.menu"
                 class="btn-page-title"
                 :icon="$route.meta.icon"/>
        </q-toolbar-title>

        <!--== Button User ==-->
        <q-btn :to="{name: 'user.profile.me'}" flat no-caps>
          <div class="button-profile-image" :style="`background-image: url('${userData.smallImage}')`"/>
          <span class="q-hide q-md-show">
            {{userData.firstName}}
          </span>
        </q-btn>

        <!--== Button Config ==-->
        <q-btn round dense flat icon="fas fa-cog"
               @click="drawer.config = !drawer.config">
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <!-- ============= DRAWERS ======================= -->
    <!-- MENU -->
    <q-layout-drawer id="menu_master" class="no-shadow" v-model="drawer.menu">
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
                     v-model="drawer.config" side="right"
    >
      <config-list></config-list>
    </q-layout-drawer>
  </div>
</template>
<script>
  import WidgetUser from "@imagina/quser/_components/widget-user";
  import configList from '../configList';
  import menuList from "../recursiveItem";

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
      })
    },
    data() {
      return {
        projectName: this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name'),
        drawer: {
          menu: true,
          config: false,
          notification: false
        },
        menu: config('sidebar'),
        logo: this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path
      }
    },
    computed: {
      getImageUrl() {
        return config('apiRoutes.api.base_url') + '/' + this.userData.smallImage;
      },
      userData() {
        return this.$store.state.quserAuth.userData
      },
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
  #masterHeader
    .q-toolbar-title
      padding 0 5px
      .btn-page-title
        padding 5px
        .q-icon
          background-color white
          border-radius 50%
          height 25px
          width 25px
          color $primary
          font-size 15px
          padding 5px
          margin-right 5px
          transition .5s
          &.on-right
            margin-left 5px
          @media screen and (max-width: $breakpoint-xs)
            display none
        &.menu-openend
          .q-icon
            transform rotate(90deg)

    .q-layout-drawer-delimiter
      box-shadow $shadow-1

    .button-profile-image
      height 25px
      width 25px
      border-radius 50%
      background-repeat no-repeat
      background-position center
      background-size cover
      margin-right 5px
</style>
