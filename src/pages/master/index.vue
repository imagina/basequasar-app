<template>
  <q-page class="flex flex-center">
    <img :src="$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path">
    <div class="test"></div>
  </q-page>
</template>

<style lang="stylus">

</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
