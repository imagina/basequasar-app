<template>
  <div id="backPageComponent">
    <div :class="`${fixed ? 'fixed-top' : ''} q-pa-sm row items-center full-width bg-${bgColor}`">
      <q-btn v-if="backButton" :color="color" :icon="icon" flat @click="$emit('back')"/>
      <img v-else src="statics/icons/icon-128x128.png" alt="logo-wegoo">
      <div :class="`ellipsis text-label text-${textColor}`">{{label}}</div>
      <q-space/>
      <!--Right slot-->
      <slot name="right"/>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      color: {default: 'primary'},
      bgColor: {default: 'secondary'},
      textColor: {default: 'white'},
      label: {default: ''},
      icon: {default: 'fas fa-arrow-left'},
      fixed: {type: Boolean, default: true},
      backButton: {type: Boolean, default: false}
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
    computed: {},
    methods: {}
  }
</script>
<style lang="stylus">
  #backPageComponent
    height 50px
    width 100%
    border-bottom 1px solid $blue-grey-9

    .fixed-top
      z-index 99
      min-height 50px

    .text-label
      display inline
      text-transform capitalize
      font-size 19px
      font-weight normal

    img
      width 66px
      padding 0 16px 0 8px
      height 34px
</style>
