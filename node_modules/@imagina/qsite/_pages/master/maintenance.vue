<template>
  <div id="pageMaintenanceMaster" class="flex flex-center">
    <!--Content-->
    <div class="text-center">
      <!--Logo-->
      <img style="max-height: 30vh" :src="siteLogo">
      <!--Separator-->
      <q-separator inset class="q-my-xl" />
      <!--title-->
      <div class="text-h5 text-capitalize text-grey-9">
        <q-icon name="fas fa-terminal" class="q-mr-sm" />
        {{$tr('qsite.layout.messages.maintenancePage')}}...
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      logo: {default: false}
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    computed: {
      siteLogo() {
        return this.logo || this.$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  #pageMaintenanceMaster
    min-height 100vh
</style>
