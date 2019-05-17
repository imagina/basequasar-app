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
      return {
        title: 'Loading...',
        link: [{
          rel: 'icon',
          id: 'icon',
          href: this.$store.getters['site/getSettingMediaByName']('isite::favicon').path
        }],
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