<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">
      {{$t('ui.messages.notFound')}}...<strong>(404)</strong>
    </p>
    <q-btn
      color="blue-grey"
      style="width:200px;"
      @click="$router.push({name: 'app.home'})">
      {{$t('ui.messages.goToHome')}}
    </q-btn>
  </div>
</template>

<script>
  export default {
    meta() {
      let routetitle = (this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : ''
      let siteName = this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name')
      let iconHref = this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::favicon').path
      return {
        title: `${siteName} | ${routetitle}`,
        link: [{rel: 'icon', href: iconHref, id: 'icon'}],
      }
    },
    mounted() {
      this.$nextTick(async function () {
        //Call to config when is mounted
        let params = this.$route.params
        if (!this.$route.params.fromConfig)
          this.$router.push({name: 'app.config'})
      })
    },
  }
</script>
