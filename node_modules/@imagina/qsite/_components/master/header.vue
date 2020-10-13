<template>
  <div id="masterHeader">
    <!-- HEADER -->
    <q-header>
      <q-toolbar color="primary">
        <!--= TITLE =-->
        <q-toolbar-title class="items-center q-pl-none">
          <!--Toogle Menu-->
          <div>
            <q-icon :name="$route.meta.icon"/>
            {{$tr($route.meta.headerTitle || $route.meta.title)}}
          </div>
        </q-toolbar-title>
        <!--Search-->
        <dynamic-field v-if="false" :field="fields.search"/>
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
               @click="()=> {drawer.config = !drawer.config; $refs.subHeader.drawer.filter = false}"/>
      </q-toolbar>

      <!--Sub header--->
      <q-toolbar class="q-pa-none" style="min-height: auto">
        <sub-header ref="subHeader" @openFilter="drawer.config = false"/>
      </q-toolbar>
    </q-header>

    <!-- MENU -->
    <q-drawer id="menuMaster" class="no-shadow" v-model="drawer.menu" bordered
              :mini="miniState" @click.capture="miniState = false" behavior="desktop">
      <!--Actions-->
      <div class="text-white">
        <!--Menu buttom-->
        <q-item clickable class="bg-primary q-pa-none text-weight-bold" v-if="miniState"
                style="min-height: 50px">
          <!--Menu buttom-->
          <q-item-section avatar>
            <q-icon size="18px" color="white" name="fas fa-bars"/>
          </q-item-section>
        </q-item>
        <!--Opened menu header-->
        <div v-else style="min-height: 50px">
          <!--Information-->
          <div class="bg-primary q-pl-sm q-pr-sm row items-center justify-between full-width" style="min-height: 50px">
            <!--Title-->
            <div class="ellipsis" style="max-width: calc(100% - 50px)">{{projectName}}</div>
            <!--Button close-->
            <q-btn dense round flat unelevated color="white" icon="fas fa-bars" size="12px"
                   @click="miniState = true"/>
          </div>
          <!--Logo-->
          <div class="q-pa-md">
            <q-img contain :src="logo" style="height: 120px; min-height: 120px"/>
          </div>
          <q-separator/>
        </div>
      </div>
      <!--= MENU =-->
      <menu-list ref="menuList" group :menu="menu"/>
    </q-drawer>

    <!-- Config -->
    <q-drawer bordered id="configMaster" :overlay="true" v-model="drawer.config" side="right">
      <config-list/>
    </q-drawer>
  </div>
</template>
<script>
  //Components
  import configList from '@imagina/qsite/_components/master/configList'
  import menuList from '@imagina/qsite/_components/master/recursiveItem'

  export default {
    props: {},
    components: {configList, menuList},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        projectName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name'),
        miniState: true,
        drawer: {
          menu: true,
          config: false,
        },
        menu: config('sidebar'),
        logo: this.$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path
      }
    },
    computed: {
      quserState() {
        return this.$store.state.quserAuth
      },
      fields() {
        return {
          search: {
            value: null,
            type: 'search',
            props: {
              label: this.$tr('ui.form.globalSearch'),
              dark: true,
              standout: true,
              outlined: false,
              bgColor: '',
            }
          }
        }
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

    .q-drawer--mini
      width 57px !important

      .q-item__section
        padding 0px 20px !important

    #menuMaster
      hr
        background-color $grey-3

      .q-expansion-item
        background-color $grey-3

      .q-expansion-item__container
        .q-expansion-item__content
          padding 0 0 0 1px
          border-left 15px solid white

      .q-item
        padding-left 0px
        min-height 40px

        .q-item__section--avatar
          padding 0 8px 0 20px

        &:hover
          background-color $grey-4
          color $primary

          .q-icon
            color $primary

        &.item-is-active
          background-color white

          .q-item__section, .q-icon
            color $primary

      .expansion-selected
        background-color $primary
</style>
