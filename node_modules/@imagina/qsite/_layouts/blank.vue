<template>
  <q-layout view="lHh LpR fFf">
    <!-- === ROUTER VIEW === -->
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    meta () {
      let routetitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
      let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
      let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
      let iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon').path

      return {
        title: `${this.$tr(routetitle)} | ${siteName}`,
        meta : {
          description: { name: 'description', content: (siteDescription || siteName) },
        },
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    async mounted () {
    }
  }
</script>
