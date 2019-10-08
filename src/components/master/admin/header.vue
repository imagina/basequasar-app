<template>
  <div id="masterHeader">
    <!-- HEADER -->
    <q-header class="no-shadow">
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
        <q-no-ssr>
          <q-btn :to="{name: 'user.profile.me'}" flat no-caps v-if="quserState.authenticated">
            <q-avatar size="25px">
              <img :src="quserState.userData.mainImage">
            </q-avatar>
            <div class="q-ml-xs">{{quserState.userData.firstName}}</div>
          </q-btn>
        </q-no-ssr>

        <!--== Button Config ==-->
        <q-btn round dense flat icon="fas fa-cog"
               @click="drawer.config = !drawer.config">
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- MENU -->
    <q-drawer id="menu_master" class="no-shadow" v-model="drawer.menu">
      <!-- === LOGO === -->
      <div class="text-center q-py-md q-px-sm full-width">
        <router-link :to="{ name: 'app.home'}" tag="a">
          <img :src="logo">
        </router-link>
      </div>

      <!--= MENU =-->
      <menu-list :menu="menu"/>
    </q-drawer>

    <!-- Config -->
    <q-drawer id="menu_master" :overlay="true" v-model="drawer.config" side="right">
      <config-list/>
    </q-drawer>
  </div>
</template>
<script>
  import configList from '../configList'
  import menuList from '../recursiveItem'

  export default {
    props: {},
    components: {
      configList,
      menuList
    },
    watch: {},
    mounted () {
      this.$nextTick(function () {
      })
    },
    data () {
      return {
        projectName: this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name'),
        drawer: {
          menu: false,
          config: false,
          notification: false
        },
        menu: config('sidebar'),
        logo: this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path
      }
    },
    computed: {
      quserState () {
        return this.$store.state.quserAuth
      }
    },
    methods: {
      //Show drawer specific
      toggleDrawer (name, show) {
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
  #masterHeader
    img
      max-width 100% !important
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
