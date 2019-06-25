<template>
  <q-page class="flex flex-center">
    <div>
      label: {{ $t('success') }}<br>
      lang: {{ $q.i18n.lang }}<br>
    </div>
    <img alt="Logo" :src="logo" width="20%">
  </q-page>
</template>

<style>
</style>

<script>
  export default {
    name: 'PageIndex',
    watch: {
      lang(lang) {
        // dynamic import, so loading on demand only
        import(`quasar-framework/i18n/${lang}`).then(lang => {
          this.$q.i18n.set(lang.default)
        })
        import(`src/i18n/${lang}`).then(({ default: messages}) => {
          this.$i18n.locale = lang
          this.$i18n.setLocaleMessage(lang, messages)
        })
      }
    },
    data() {
      return {
        lang: this.$q.i18n.lang,
        logo: this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path
      }
    }
  }
</script>
