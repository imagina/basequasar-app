<template>
  <q-inner-loading id="innerLoadingMaster" :visible="visible">
    <div class="q-box-inner-loading">
      <q-spinner size="50px" color="primary"/>
      <h6 class="q-ma-none text-primary q-title">{{label}}</h6>
    </div>
  </q-inner-loading>
</template>
<script>
  export default {
    props: {
      visible: {default: false},
      label: {default: 'Loading...'}
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
    methods: {}

  }
</script>
<style lang="stylus">
  @import "~variables";
  #innerLoadingMaster
    &.q-inner-loading
      .q-box-inner-loading
        text-align center
        background-color $grey-1
        margin 20px 10px 10px 10px
        padding 5px 15px
        border-radius 10px
</style>