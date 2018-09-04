<template>
  <q-layout view="lHh LpR lFr">

    <!-- === HEADER === -->
    <q-layout-header class="no-shadow">
      <q-toolbar color="primary">
        <!--= BUTTON MENU =-->
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>

        <!--= TITLE =-->
        <q-toolbar-title class="gt-xs">
          FHIA
        </q-toolbar-title>

        <!--= FULLSCREEN =-->
        <q-btn flat dense
               :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
               @click="toggleFullscreen()"></q-btn>

        <!--= DEPARTMENT SELECT =-->
        <widget-user-department></widget-user-department>

        <!--== USER DROPDOWN ==-->
        <widget-user></widget-user>
      </q-toolbar>

    </q-layout-header>

    <!-- === MENU === -->
    <q-layout-drawer id="menu_master"
                     v-model="leftDrawerOpen"
                     :content-class="'bg-grey-2'"
    >
      <q-list no-border link inset-delimiter>
        <!-- === LOGO === -->
        <q-list-header class="text-center">
          <a href="/">
            <img src="src/assets/imagina-logo.svg" width="30%">
          </a>
        </q-list-header>

        <!--= SEARCHERS =-->
        <!--<q-item class="bg-grey-4">
          <q-item-main>
            <textarea></textarea>
            <q-search v-model="search"
                      float-label="Global Search"
                      class="q-mb-sm">
            </q-search>
          </q-item-main>
        </q-item>-->

        <!--= MENU =-->
        <widget-menu></widget-menu>
      </q-list>
    </q-layout-drawer>

    <!-- === ROUTER VIEW === -->
    <q-page-container>
      <router-view/>
    </q-page-container>

    <!-- === FOOTER === -->
    <q-layout-footer class="no-shadow">
      <!--=== DATA LOGIN ===-->
      <div class="q-body-1 q-py-sm q-px-lg text-center bg-grey-2">
        <q-icon name="copyright"/>
        Copyright FHIAProducts.com
      </div>
    </q-layout-footer>

    <!-- === BACK TO TOP === -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        v-back-to-top.animate="{offset: 500, duration: 200}"
        round
        color="primary"
        icon="keyboard_arrow_up"
      />
    </q-page-sticky>

  </q-layout>
</template>

<script>
  import WidgetUser from "@imagina/quser/_components/widget-user";
  import WidgetUserDepartment from "@imagina/quser/_components/widget-user-department";
  import widgetMenu from "src/components/menu/widget-menu";

  export default {
    components: {
      widgetMenu,
      WidgetUserDepartment,
      WidgetUser},
    mounted() {
      this.$nextTick(function () {})
    },
    data() {
      return {
        leftDrawerOpen: false,
        drawerState: true,
      }
    },
    methods: {
      toggleFullscreen() {
        this.$q.fullscreen.toggle()
      },
    }
  }
</script>

<style lang="stylus">
  @import "~variables";

  #list_menu
    .q-icon
      font-size: 16px
    .q-item-side
      min-width 20px !important

  .q-item-main
    font-size: 15px !important

  #menu_leads
    .q-item
      padding: 8px 0px

  .q-item-side
    min-width: auto

  .border-content
    border 2px solid $grey-4
    border-radius 3px

  .text_title
    span
      border-bottom 2px red solid


</style>
