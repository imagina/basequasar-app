<template>
  <div id="masterDrawers1">
    <!-- MENU -->
    <q-drawer id="menuMaster" class="no-shadow" v-model="drawer.menu" ref="menuMaster"
              @click.capture="miniState ? eventBus.emit('toggleMasterDrawer','menu') : null">
      <!--Logo-->
      <div id="logoSite" class="relative-position">
        <q-img fit="contain" :src="logo" style="height: 80px; min-height: 80px"/>
        <!--Version-->
        <div id="versionContent" class="absolute absolute-bottom-right text-white">
          <q-icon name="fas fa-code-branch" class="q-mr-xs"/>
          {{ versionText }}
        </div>
      </div>
      <!--List iadmin-->
      <q-scroll-area id="adminMenu" :style="`height: calc(100vh - 146px`">
        <!--Menu-->
        <menu-list ref="menuList" group :translatable="menuTranslatable" :menu="menuSelect"/>
      </q-scroll-area>
    </q-drawer>

    <!-- Config -->
    <q-drawer bordered id="configMaster" overlay v-model="drawer.config" side="right">
      <config-list/>
    </q-drawer>

    <!-- Chat -->
    <q-drawer bordered id="chatMaster" overlay v-model="drawer.chat" side="right"
              v-if="$hasAccess('ichat.conversations.index')">
      <chat-list/>
    </q-drawer>


    <!--Recommendation-->
    <q-drawer id="drawerRecommendationMaster" v-model="drawer.recommendation" side="right" behavior="mobile"
              :overlay="true"
              v-if="routeSubHeader.recommendations ? true : false">
      <master-recommendation/>
    </q-drawer>

    <!--Notification-->
    <master-notifications :is-open="drawer.notification" :isMobile="this.windowSize == 'mobile' ? true : false"/>

    <!--Offline-->
    <q-drawer bordered id="drawerOfflineMaster" v-model="drawer.offline" side="right" overlay
              v-if="$getSetting('isite::offline')">
      <offline/>
    </q-drawer>
  </div>
</template>
<script>
//mixins
import sidebarMixins from 'src/layouts/themes/sidebarMixins'
//Components
import configList from 'modules/qsite/_components/master/configList'
import chatList from 'modules/qchat/_components/drawerChatList'
import menuList from 'modules/qsite/_components/master/recursiveItem'
import masterRecommendation from 'modules/qsite/_components/master/masterRecommendations'
import masterNotifications from 'modules/qnotification/_components/drawerNotifications'
import { eventBus } from 'src/plugins/utils'
import offline from 'modules/qoffline/_components/drawerOffline'

export default {
  name: 'masterDrawers1',
  beforeUnmount() {
    eventBus.off('toggleMasterDrawer')
    eventBus.off('openMasterDrawer')
  },
  mixins: [sidebarMixins],
  props: {},
  components: {
    menuList,
    configList,
    chatList,
    masterRecommendation,
    masterNotifications,
    offline
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
      this.miniState = this.windowSize == 'mobile' ? false : true
    })
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWith: window.innerWidth,
      projectName: this.$getSetting('core::site-name'),
      miniState: false,
      drawer: {
        menu: this.$q.platform.is.mobile ? false : true,
        config: false,
        chat: false,
        checkin: false,
        recommendation: false,
        notification: false,
        offline: false
      },
      appConfig: config('app'),
      eventBus
    }
  },
  watch: {
    routeSubHeader() {
      this.drawer.recommendation = false;
    }
  },
  computed: {
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    },
    routeSubHeader() {
      return this.$route.meta.subHeader || {}
    },
    //Version app text
    versionText() {
      return 'v' + config('app.version')
    },
    logo() {
      return this.$store.state.qsiteApp.logo;
    },
  },
  methods: {
    //init
    init() {
      this.handlerEvent()
      //Watch window size
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        this.windowWith = window.innerWidth
      })
    },
    handlerEvent() {
      //handler toggleMasterDrawer
      eventBus.on('toggleMasterDrawer', (drawerName) => this.toggleDrawer(drawerName))
      //handler openMasterDrawer
      eventBus.on('openMasterDrawer', (drawerName) => this.drawer[drawerName] = true)
    },
    //Show drawer specific
    toggleDrawer(drawerName) {
      //Hidden all drawers
      for (var drawer in this.drawer) {
        if (drawer != drawerName) {
          if ((drawer == 'menu') && (this.windowSize != 'mobile')) {
            this.miniState = true
          } else {
            this.drawer[drawer] = false
          }
        }
      }
      //Toogle drawer
      if (drawerName == 'menu') {
        if (this.windowSize == 'mobile') {
          this.miniState = false
          this.drawer.menu = !this.drawer.menu
        } else {
          this.drawer.menu = true
          this.miniState = !this.miniState
        }
      } else {
        this.drawer[drawerName] = !this.drawer[drawerName]
      }
    }
  }
}
</script>
<style lang="scss">
#masterDrawers1 {
  background-color: $custom-accent-color !important;
  #drawerRecomendationMaster {
    .q-drawer {
      max-height: max-content;
    }
    .q-drawer__content {
      background: $custom-accent-color;
    }
  }
  aside {
    background: $primary;
    background-color: $custom-accent-color !important;
  }
  #menuMaster {
    #logoSite {
      padding: 20px 25px 26px 25px;
      height: 120px;
      background-color: $primary;
    }
    #versionContent {
      padding: 3px 15px;
      font-size: 13px;
    }
    .q-expansion-item {
      background-color: $custom-accent-color !important;
    }
    .q-expansion-item__container {
      .q-expansion-item__content {
        padding: 0 0 0 2px;
        border-left: 15px solid $custom-accent-color;
      }
    }
    .q-item {
      padding-left: 0;
      min-height: 40px;
      color: $blue-grey;
      .q-item__section--avatar {
        padding: 0 18px !important;
        .q-icon {
          font-size: 20px;
          color: $blue-grey;
        }
      }
      &:hover {
        background-color: $grey-4;
        color: $primary;
        .q-icon {
          color: $primary;
          font-size: 16px;
        }
      }
      &.item-is-active {
        background-color: $custom-accent-color;

        .q-item__section,
        .q-icon {
          color: $primary;
        }

      }
    }
    .expansion-selected {
      background-color: $primary;
    }
  }
}
</style>
