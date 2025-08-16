<template>
  <div id="masterDrawers">
    <!-- MENU -->
    <q-drawer id="menuMaster" class="no-shadow" v-model="drawer.menu" ref="menuMaster"
              :mini="miniState" @click.capture="miniState ? eventBus.emit('toggleMasterDrawer','menu') : null">
      <!--Logo-->
      <div class="q-pa-md logo-bg-primary text-center" v-if="!miniState && drawer.menu">
        <q-img fit="contain" :src="logo" style="height: 120px; min-height: 120px; max-width: 80%"/>
      </div>
      <!--List iadmin-->
      <q-scroll-area
          :style="`height: calc(100vh - ${(miniState ? '50' : '202')}px`">
        <!--Menu-->
        <menu-list ref="menuList" group :translatable="menuTranslatable" :menu="menuSelect" :with-tooltip="miniState"/>
      </q-scroll-area>
      <!--== Button User ==-->
      <q-no-ssr>
        <div id="btnProfile" v-if="quserState.authenticated">
          <!--Content-->
          <div class="row items-center justify-between">
            <!--Title-->
            <div class="row items-center">
              <div id="profileImage" class="img-as-bg q-mr-sm items-center"
                   :style="`background-image: url('${profileImage.smallThumb}')`"></div>
              <div class="q-ml-xs" v-if="!miniState">{{ quserState.userData.firstName }}</div>
            </div>
            <!--Icon-->
            <div v-if="!miniState" class="q-pr-md">
              <q-icon name="fas fa-chevron-up"/>
            </div>
          </div>
          <!--Actions-->
          <q-menu anchor="bottom right" self="top right">
            <div class="row no-wrap q-pa-md">
              <!--Left content-->
              <div class="column">
                <div style="max-width: 110px">
                  <!--Image profile-->
                  <div class="text-center">
                    <q-avatar size="72px" class="q-mx-auto">
                      <img :src="profileImage.mediumThumb">
                    </q-avatar>
                  </div>
                  <!--User Data-->
                  <div class="text-subtitle1 ellipsis q-mt-md">{{ quserState.userData.fullName }}</div>
                  <div class="ellipsis text-caption">
                    {{ quserState.userData.roles.map(role => role.name).join(', ') }}
                  </div>
                </div>
              </div>
              <!--Seaprator-->
              <q-separator vertical inset class="q-mx-lg"/>
              <!--Right content-->
              <div class="column">
                <!--Title-->
                <div class="text-h6 q-mb-xs text-blue-grey">{{ $tr('isite.cms.label.profile') }}</div>
                <!--Actions-->
                <q-list>
                  <!--Profile-->
                  <q-item clickable v-close-popup :to="{name: 'user.profile.me'}" style="padding: 0; min-width: 130px">
                    <q-item-section>
                      <div class="row items-center text-blue-grey text-right">
                        <q-icon name="fas fa-user-circle" color="green" size="16px" class="q-mr-sm"/>
                        {{ $tr('iprofile.cms.sidebar.panelProfile') }}
                      </div>
                    </q-item-section>
                  </q-item>
                  <!--Logout-->
                  <q-item clickable v-close-popup :to="{name: 'auth.logout'}" style="padding: 0; min-width: 130px">
                    <q-item-section>
                      <div class="row items-center text-blue-grey">
                        <q-icon name="fas fa-sign-out-alt" color="red" size="16px" class="q-mr-sm"/>
                        {{ $t('isite.cms.configList.signOut') }}
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-menu>
        </div>
      </q-no-ssr>
    </q-drawer>

    <!--checking-->
    <q-drawer id="drawerCheckinMaster" v-model="drawer.checkin" side="right" bordered
              v-if="(appConfig.mode == 'ipanel') && $hasAccess('icheckin.shifts.create')">
      <checkin/>
    </q-drawer>

    <!--Recommendation-->
    <q-drawer id="drawerRecommendationMaster" v-model="drawer.recommendation" side="right"
              v-if="routeSubHeader.recommendations ? true : false">
      <master-recommendation/>
    </q-drawer>

    <!--Notification-->
    <master-notifications :is-open="drawer.notification" :isMobile="this.windowSize == 'mobile' ? true : false"/>
  </div>
</template>
<script>
//mixins
import sidebarMixins from 'layouts/themes/_mixins/sidebar'
//Components
import menuList from 'modules/qsite/_components/master/recursiveItem'
import checkin from 'modules/qcheckin/_components/checkin'
import masterRecommendation from 'modules/qsite/_components/master/masterRecommendations'
import masterNotifications from 'modules/qnotification/_components/drawerNotifications'
import { eventBus } from 'src/plugins/utils'

export default {
  name: 'masterDrawersPanel',
  beforeUnmount() {
    eventBus.off('toggleMasterDrawer')
    eventBus.off('openMasterDrawer')
  },
  mixins: [sidebarMixins],
  props: {},
  components: {menuList, checkin, masterRecommendation, masterNotifications},
  mounted() {
    this.$nextTick(function () {
      this.init()
      this.miniState = this.windowSize == 'mobile' ? false : true
      this.drawer.menu = this.windowSize == 'mobile' ? false : true
    })
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWith: window.innerWidth,
      projectName: this.$getSetting('isite::site-name'),
      logo: this.$store.state.qsiteApp.logo,
      miniState: false,
      drawer: {
        menu: false,
        config: false,
        chat: false,
        filter: false,
        checkin: false,
        recommendation: false,
        notification: false
      },
      appConfig: config('app'),
      filter: this.$filter,
      eventBus
    }
  },
  watch: {
    routeSubHeader() {
      this.drawer.recommendation = false
    }
  },
  computed: {
    //Quser state
    quserState() {
      return this.$store.state.quserAuth
    },
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    },
    routeSubHeader() {
      return this.$route.meta.subHeader || {}
    },
    profileImage(){
      return this.$store.getters['quserAuth/profileImage']
    }
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
          } else this.drawer[drawer] = false
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
.q-layout-drawer-delimiter {
  box-shadow: $shadow-1;
}

.q-drawer--mini {
  width: 57px !important;
}

.q-drawer--mini .q-item__section {
  padding: 0px 20px !important;
}

#menuMaster .q-drawer {
  background: $custom-accent-color;
}

#menuMaster .q-scrollarea {
  padding-top: 5px;
}

#menuMaster hr {
  background-color: $grey-3;
}

#menuMaster .q-expansion-item {
  background-color: $custom-accent-color;
}

#menuMaster .q-expansion-item .content-item {
  background-color: $custom-accent-color;
}

#menuMaster .q-expansion-item__container .q-expansion-item__content {
  padding: 0 0 0 1px;
  border-left: 15px solid $custom-accent-color;
}

#menuMaster .q-item {
  padding-left: 0;
  min-height: 40px;
  color: $blue-grey;
}

#menuMaster .q-item .q-item__section--avatar {
  padding: 0 18px !important;
}

#menuMaster .q-item .q-item__section--avatar .q-icon {
  font-size: 20px;
  color: $blue-grey;
}

#menuMaster .q-item:hover {
  background-color: $grey-4;
  color: $primary;
}

#menuMaster .q-item:hover .q-icon {
  color: $primary;
  font-size: 22px;
}

#menuMaster .q-item.item-is-active {
  background-color: $custom-accent-color;
}

#menuMaster .q-item.item-is-active .q-item__section,
#menuMaster .q-item.item-is-active .q-icon {
  color: $primary;
}

#menuMaster .expansion-selected {
  background-color: $primary;
}

#menuMaster #btnProfile {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: $primary;
  border-radius: 0;
  color: white;
  height: 50px;
  width: 100%;
  padding: 7px 8.5px;
}

#menuMaster #btnProfile #profileImage {
  height: 36px;
  width: 36px;
  border-radius: 50%;
}

#masterDrawers #drawerRecomendationMaster .q-drawer {
  max-height: max-content;
  background: $bg-custom-accent-color;
}

#masterDrawers #drawerRecomendationMaster .q-drawer__content {
  background: #ebf1fa;
}
</style>
