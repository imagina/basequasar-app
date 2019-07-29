<template>
  <q-layout view="lHh LpR fFf">
    <!-- === ROUTER VIEW === -->
    <q-page-container>
      <router-view/>
      <q-ajax-bar />
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    meta() {
      let routetitle = (this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : null
      let siteName = this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name')
      let iconHref = this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::favicon').path
      return {
        title: `${siteName} | ${this.$tr(routetitle)}`,
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    components: {},
    mounted() {
      this.$nextTick(async function () {
        //Call to config when is mounted
        let params = this.$route.params
      })
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>
