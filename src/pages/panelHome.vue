<template>
  <q-page id="panelIndexPage" class="flex flex-center">
    <div class="row justify-center q-gutter-y-lg relative-position">
      <!--Logo-->
      <div class="col-12 text-center">
        <img style="max-width: 30vw; margin: auto" :src="$store.state.qsiteApp.logo">
      </div>
      <!--Activities-->
      <activities system-name="panel_home" @loaded="loading = false"/>
      <!--inner-loading-->
      <inner-loading :visible="loading"/>
    </div>
  </q-page>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {},
  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss">
#panelIndexPage {
  min-height: calc(100vh - 131px) !important;
}

#gamificationActivities {
  width: 100%;
  @media screen and (min-width: $breakpoint-md) {
    width: 80%;
  }
  @media screen and (min-width: $breakpoint-lg) {
    width: 60%;
  }
}
</style>
