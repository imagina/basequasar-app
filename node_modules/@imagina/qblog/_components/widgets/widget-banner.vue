<template>
  <div id="bannerIblog"
       :class="'bg-widget-banner ' + (this.$q.platform.is.desktop ? 'desktop' : 'mobile')">
    <div class="q-container text-right full-height">
      <div class="row items-center full-height">
        <div class="col-12 text-right">
          <!--BreadCrum-->
          <breadcrum-component :items="dataBanner.breadCrum"></breadcrum-component>
          <!--Title-->
          <h1 class="q-headline q-ma-none q-mt-lg text-secondary text-center uppercase">
            {{dataBanner.title}}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /*Components*/
  import breadcrumComponent from '@imagina/qblog/_components/widgets/widget-breadcrum'

  export default {
    props: {
      dataBanner: {default: 'Category'},
    },
    components: {
      breadcrumComponent
    },
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
  #bannerIblog
    background-color $grey-2
    background-size cover
    background-position center
    padding-top 60px
    h1
      font-weight bold !important
    &.desktop
      height 245px
    &.mobile
      padding 10px 0 15px 0
      h1
        margin-top 10px !important

</style>
