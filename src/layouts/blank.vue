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
      let siteName = this.$store.getters['site/getSettingValueByName']('core::site-name')
      let iconHref = this.$store.getters['site/getSettingMediaByName']('isite::favicon').path
      return {
        title: siteName,
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    components: {},
    mounted() {
      this.$nextTick(function () {
        //this.getInitData()
      })
    },
    data() {
      return {}
    },
    methods: {
      //dispath actions from store
      getInitData(){
        if(this.$route.name != 'auth.login'){
          this.$store.dispatch('fhia/GET_BRANCH_OFFICES')
          this.$store.dispatch('fhia/GET_SOURCES')
          this.$store.dispatch('fhia/GET_SOURCE_CATEGORIES')
          this.$store.dispatch('icommerce/GET_CATEGORIES')
        }
      }
    }
  }
</script>