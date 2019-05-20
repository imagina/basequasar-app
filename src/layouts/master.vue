<template>
  <q-layout view="lHh LpR lFr" v-if="$store.state.app.active && loadedApp">
    <!-- HEADER -->
    <master-header></master-header>

    <!-- ROUTER VIEW -->
    <q-page-container>
      <router-view v-if="loadedApp" />
    </q-page-container>

    <!-- FOOTER -->
    <master-footer></master-footer>
  </q-layout>
</template>

<script>
  /*Components*/
  import masterHeader from 'src/components/master/header'
  import masterFooter from 'src/components/master/footer'

  //Services
  import appServices from 'src/services/application/index'

  export default {
    meta() {
      let siteName = this.$store.getters['site/getSettingValueByName']('core::site-name')
      let iconHref = this.$store.getters['site/getSettingMediaByName']('isite::favicon').path
      return {
        title: siteName,
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    components: {
      masterHeader,
      masterFooter
    },
    mounted() {
      this.$nextTick(async function () {
        //Call to config when is mounted
        let params = this.$route.params
        if (!this.$route.params.fromConfig)
          this.$router.push({name: 'app.config'})
        this.loadedApp = true//Load route view
      })
    },
    watch: {
      $route(to, from) {
        this.checkVersionApp(to)
      }
    },
    data() {
      return {
        loadedApp: false
      }
    },
    computed: {
      showApp() {
        return this.$store.state.app.show
      },
    },
    methods: {
      isInStandaloneMode() {
        (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone);
      },

      //Check if app is update
      checkVersionApp(toRoute) {
        if (toRoute.name != 'config') {
          let currentVersion = parseInt(config('app.version').split('.').join(''))
          appServices.crud.index('apiRoutes.site.appVersion', {remember: false}).then(response => {
            let version = parseInt(response.data.split('.').join(''))
            if (currentVersion < version) {
              this.$router.push({name: 'app.config'})
            }
          })
        }
      }
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


</style>