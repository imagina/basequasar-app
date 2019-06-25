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
        title: `${siteName} | ${routetitle}`,
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    components: {},
    mounted() {
      this.$nextTick(async function () {
        //Call to config when is mounted
        let params = this.$route.params
        if (!this.$route.params.fromConfig)
          this.$router.push({name: 'app.config'})
      })
    },
    data() {
      return {}
    },
    methods: {    }
  }
</script>
