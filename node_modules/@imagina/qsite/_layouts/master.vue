<template>
  <q-layout view="lHh LpR lff" class="bg-grey-1">
    <!-- HEADER -->
    <header-component v-if="appState.loadPage"/>

    <!-- ROUTER VIEW -->
    <q-page-container>
      <q-scroll-area style="height: calc(100vh - 98px)">
        <router-view v-if="appState.loadPage" class="layout-padding"/>
      </q-scroll-area>
    </q-page-container>

    <!-- FOOTER -->
    <footer-componen v-if="appState.loadPage"/>
  </q-layout>
</template>

<script>
  /*Components*/
  import headerComponent from '@imagina/qsite/_components/master/header'
  import footerComponen from '@imagina/qsite/_components/master/footer'

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
    components: {headerComponent, footerComponen},
    mounted() {
      this.$nextTick(async function () {
      })
    },
    data() {
      return {}
    },
    computed: {
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
