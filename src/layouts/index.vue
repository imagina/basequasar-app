<template>
  <q-page class="flex flex-center">
    <img alt="Logo" :src="logo" width="20%">
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      logo : this.$store.getters['site/getSettingMediaByName']('isite::logo1').path
    }
  }
}
</script>
