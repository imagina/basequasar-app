<template>
  <q-layout view="lHh LpR fFf">
    <!-- === ROUTER VIEW === -->
    <q-page-container>
      <router-view/>
      <q-ajax-bar/>
    </q-page-container>
  </q-layout>
</template>

<script>


  export default {
    meta() {
      return {
        title: 'Loading...',
        link: [{
          rel: 'icon',
          id: 'icon',
          href: this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::favicon').path
        }],
      }
    },
    components: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>
