<template>
  <div id="masterFooter">
    <!-- === FOOTER === -->
    <q-footer class="bg-white">
    </q-footer>
  </div>
</template>
<script>
import { eventBus } from 'src/plugins/utils'
export default {
  name: 'masterFooterIpanel',
  beforeUnmount() {
    eventBus.off('setMobileMainAction')
  },
  props: {},
  components: {},
  watch: {
    $route: {
      deep: true,
      handler: function () {
        this.mainAction = config('app.mobilMainAction')
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      mainAction: config('app.mobilMainAction'),
      appConfig: config('app'),
      loadFooterIpanel: false,
      modal: {
        show: false
      },
      eventBus
    }
  },
  computed: {
    quserState() {
      return this.$store.state.quserAuth
    },
    routeSubHeader() {
      return this.$route.meta.subHeader || {}
    },
    currentRoute() {
      return this.$route
    },
    //Return params of subHeader
    params() {
      return this.currentRoute.meta.subHeader || {}
    },
    profileImage(){
      return this.$store.getters['quserAuth/profileImage']
    }
  },
  methods: {
    init() {
      eventBus.on('setMobileMainAction', (data) => {
        this.mainAction = {...this.mainAction, ...data}
      })
    },
  }
}
</script>
<style lang="scss">
#panelFooterContent {
  background-color: white;
  color: $grey-7;

  .item-footer {
    text-align: center;
    font-size: 11px;
    padding: 10px 0;

    .item-icon {
      font-size: 20px;
      margin-bottom: 3px;
    }
  }

  #item-main {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin: auto;
    font-size: 26px;
    color: white;
  }
}

#footerIpanel {
  background-color: transparent;
  border-top: 1px solid $grey-4;

  #webComponent {
    all: initial;
  }
}
</style>
