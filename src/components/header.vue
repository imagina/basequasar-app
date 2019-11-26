<template>
  <div id="masterHeader">
    <!-- ============= HEADER ======================= -->
    <q-header class="no-shadow">
      <q-toolbar color="primary">

        <!--= BUTTON MENU =-->
        <q-btn flat dense round class="q-md-hide"
               @click="drawer.menu = !drawer.menu"
               aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>

        <!--Logo-->
        <router-link :to="{ name: 'app.home'}">
          <img class="q-md-hide" :src="logo" style="max-height: 30px">
        </router-link>

        <!--= TITLE =-->
        <q-toolbar-title class="text-center">
          <!--= MENU =-->
          <menu-list class="q-hide q-md-show" :show-icons="false"
                     :menu="menu" id="menuDesktop"/>
        </q-toolbar-title>

        <!--Right toolbar-->
        <div class="absolute-right">
          <!--Facebook-->
          <q-btn icon="fab fa-facebook" flat round v-if="socialNetworks.facebook"
                 @click="openUrl(socialNetworks.facebook)"/>
          <!--Instagram-->
          <q-btn icon="fab fa-instagram" flat round v-if="socialNetworks.instagram"
                 @click="openUrl(socialNetworks.instagram)"/>
          <!--Full Screen-->
          <q-btn icon="fullscreen" @click="$q.fullscreen.toggle()" flat round/>
        </div>
      </q-toolbar>

      <!--Sub header-->
      <div class="text-center bg-white">
        <!--Logo-->
        <div class="q-py-sm q-hide q-md-show">
          <img :src="logo" style="max-height: 150px">
        </div>
        <hr class="q-hr q-my-none">
      </div>
    </q-header>

    <!-- MENU LEFT -->
    <q-drawer id="menu_master" class="no-shadow q-md-hide" v-model="drawer.menu">
      <q-list no-border link inset-delimiter>
        <!-- === LOGO === -->
        <q-item-section class="text-center">
          <router-link :to="{ name: 'app.home'}">
            <a>
              <img :src="logo" width="90%">
            </a>
          </router-link>
        </q-item-section>

        <!--= MENU =-->
        <menu-list :menu="menu"/>
      </q-list>
    </q-drawer>
  </div>
</template>
<script>
  import menuList from "@imagina/qsite/_components/master/recursiveItem";

  export default {
    props: {},
    components: {
      menuList
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        projectName: 'Test',//this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name'),
        drawer: {
          menu: false
        },
        menu: config('sidebar'),
        logo: '',//this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path,
        modal: {
          show: true,
          search: ''
        },
        phones: [],//this.$store.getters['qsiteSettings/getSettingValueByName']('isite::phones')
      }
    },
    computed: {
      getImageUrl() {
        return config('apiRoutes.api.base_url') + '/' + this.userData.smallImage;
      },
      userData() {
        return []//this.$store.state.quserAuth.userData
      },
      socialNetworks() {
        let response = {}
        let socialNetworks = []//this.$store.getters['qsiteSettings/getSettingValueByName']('isite::socialNetworks')
        //format social networks
        socialNetworks.forEach(item => {
          if (item.label == 'facebook') response[item.label] = `https://facebook.com/${item.value}`
          if (item.label == 'instagram') response[item.label] = `https://instagram.com/${item.value}`
        })

        return response//Response
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
      //open URL
      openUrl(url) {
        window.open(url, '_blank')
      }
    }
  }
</script>
<style lang="stylus">
  #masterHeader
    .q-layout-drawer-delimiter
      box-shadow $shadow-1

    .q-toolbar
      #menuDesktop
        .q-item
          display inline-block
          border 0px !important

          .q-item-main
            font-size 17px !important

          &.router-link-active
            background transparent !important

            .q-item-main
              transition .1s
              padding-bottom 3px
              border-bottom 2px solid white
</style>
