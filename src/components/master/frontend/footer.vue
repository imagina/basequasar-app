<template>
  <div id="footer">
    <!-- Menu -->
    <div class="menuFooter">
      <menu-list class="q-container" :menu="menu"/>
    </div>

    <!-- Copi right -->
    <div class="q-hide q-md-show text-center bg-dark q-caption text-white q-pb-sm">
      <!--Copyright 2019 © {{ $store.getters['qsiteSettings/getSettingValueByName']('core::site-name') }}. Todos Los
      Derechos Reservados-->
    </div>
  </div>
</template>
<script>
  import menuList from "../recursiveItem";

  export default {
    props: {},
    components: {
      menuList
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    created() {
      this.executeScript()
    },
    data() {
      return {}
    },
    computed: {
      menu() {
        let menu = config('sidebar')
        let menufooter = ['app.home', 'app.reservations', 'app.branchOffices', 'app.contact']
        let response = []
        //Get just menufooter items
        menu.forEach(item => {
          if(menufooter.indexOf(item.name) != -1) response.push(item)
        })
        return response//Response
      }
    },
    methods: {
      executeScript() {
        let scriptValue = false//this.$store.getters['qsiteSettings/getSettingValueByName']('core::analytics-script')
        if (JSON.stringify(scriptValue).indexOf('script') != -1) {
          let script = scriptValue.replace(/<\/?script>/g, "")
          eval(script)
        }
      }
    }

  }
</script>
<style lang="stylus">
  #footer
    @media screen and (max-width: $breakpoint-md)
      padding-bottom 50px
    .menuFooter
      text-align center
      background-color $dark
      color white
      padding 5px 0
      @media screen and (max-width: $breakpoint-md)
        padding 2px 0
        position fixed
        bottom 0
        width 100%
      @media screen and (max-width: $breakpoint-sm)
        padding 0

      .q-item
        display inline-block
        border 0px !important

        .q-item-side
          display inline-block

          .q-icon
            font-size 17px
            color white
            @media screen and (max-width: $breakpoint-sm)
              font-size 10px !important

        .q-item-main
          display inline-block
          margin-left 5px
          font-size 17px !important
          @media screen and (max-width: $breakpoint-sm)
            font-size 10px !important

        &.router-link-active
          background transparent !important
</style>
