<template>
  <q-inner-loading id="innerLoadingMaster" :showing="visible">
    <div class="q-box-inner-loading">
      <q-spinner size="50px" color="primary"/>
      <h6 class="q-ma-none text-primary q-title">{{message}}</h6>
    </div>
  </q-inner-loading>
</template>
<script>
  export default {
    props: {
      visible: {default: false},
      label: {default: false}
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        if(this.label) this.labelMessage = this.$clone(this.label)
        else this.labelMessage = this.message
      })
    },
    data() {
      return {
        labelMessage : ''
      }
    },
    computed : {
      message(){
        return this.$tr('ui.label.loading')
      }
    },
    methods: {}

  }
</script>
<style lang="stylus">
  #innerLoadingMaster
    &.q-inner-loading
      .q-box-inner-loading
        text-align center
        background-color $grey-1
        margin 20px 10px 10px 10px
        padding 5px 15px
        border-radius 10px
</style>
