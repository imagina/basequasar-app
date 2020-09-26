<template>
  <q-page class="flex flex-center">
    <img style="max-width: 40vw"
         :src="$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path">
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
