<template>
  <q-layout :view="(appIsBackend || $q.platform.is.mobile) ? 'lHh LpR lff' : 'lhh LpR lFr'"
            :class="appIsBackend ? 'bg-grey-1' : ''">
    <!-- HEADER -->
    <admin-header v-if="appIsBackend && appState.loadPage"/>
    <!--<frontend-header v-else />-->

    <!-- ROUTER VIEW -->
    <q-page-container>
      <q-pull-to-refresh @refresh="refreshPage">
        <router-view v-if="appState.loadPage" :class="appIsBackend ? 'layout-padding' : ''"/>
      </q-pull-to-refresh>
    </q-page-container>

    <!-- FOOTER -->
    <admin-footer v-if="appIsBackend"/>
    <!--<frontend-footer v-else />-->
  </q-layout>
</template>

<script>
  /*Components*/
  import adminHeader from 'src/components/master/admin/header'
  import adminFooter from 'src/components/master/admin/footer'
  //import frontendHeader from 'src/components/master/frontend/header'
  //import frontendFooter from 'src/components/master/frontend/footer'

  export default {
    meta () {
      let routetitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
      let siteName = this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name')
      let siteDescription = this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-description')
      let iconHref = this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::favicon').path

      return {
        title: `${this.$tr(routetitle)} | ${siteName}`,
        meta: {
          description: { name: 'description', content: (siteDescription || siteName) },
        },
        link: [{ rel: 'icon', href: iconHref, id: 'icon' }],
      }
    },
    components: {
      adminHeader,
      adminFooter,
      //frontendHeader,
      //frontendFooter
    },
    mounted () {
      this.$nextTick(async function () {
      })
    },
    data () {
      return {
        appIsBackend: config('app.isBackend')
      }
    },
    computed: {
      quserState () {
        return this.$store.state.quserAuth
      },
      appState () {
        return this.$store.state.app
      }
    },
    methods: {
      async refreshPage(done){
        await this.$store.dispatch('app/REFRESH_PAGE')
        done()
      }
    }
  }
</script>

<style lang="stylus">

</style>
