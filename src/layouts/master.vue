<template>
  <q-layout view="lhh LpR lff">
    <!--Maintenance Page-->
    <maintenance-page v-if="inMaintenance"/>
    <!--Master estructure-->
    <div v-else>
      <!-- HEADER -->
      <header-component v-if="appState.loadPage"/>

      <!-- ROUTER VIEW -->
      <q-page-container>
        <router-view v-if="appState.loadPage"/>
      </q-page-container>

      <!-- FOOTER -->
      <footer-componen v-if="appState.loadPage"/>

      <!--modal-login-->
      <modal-auth/>
    </div>
  </q-layout>
</template>

<script>
  /*Components*/
  import maintenancePage from '@imagina/qsite/_pages/master/maintenance'
  import headerComponent from 'src/modules/app/_components/header'
  import footerComponen from 'src/modules/app/_components/footer'
  import modalAuth from '@imagina/quser/_components/auth/modal-form'
  import eventBus from '@imagina/qsite/_plugins/eventBus'

  export default {
    meta() {
      let routetitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
      if (this.$route.meta && this.$route.meta.headerTitle) routetitle = this.$route.meta.headerTitle
      let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
      let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
      let iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon').path

      return {
        title: `${this.$tr(routetitle)} | ${siteName}`,
        meta: {
          description: {name: 'description', content: siteDescription || siteName},
        },
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    components: {maintenancePage, headerComponent, footerComponen, modalAuth},
    beforeDestroy() {
      eventBus.off('global-event-test')
    },
    created() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    computed: {
      inMaintenance() {
        return this.$store.getters['qsiteApp/getSettingValueByName']('isite::maintenancePage')
      },
      appState() {
        return this.$store.state.qsiteApp
      }
    },
    methods: {
      async refreshPage(done) {
        await this.$store.dispatch('qsiteApp/REFRESH_PAGE')
        done()
      }
    }
  }
</script>
