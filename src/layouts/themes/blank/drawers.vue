<template>
    <div id="blackDrawers2">
      <!--Master filter-->
      <q-drawer bordered id="drawerFilterMaster" v-model="drawer.filter" side="right" v-if="filter.load" :overlay="false">

      </q-drawer>
    </div>
  </template>
  <script>
  //mixins
  import sidebarMixins from 'layouts/themes/_mixins/sidebar'
  //Components

  import { eventBus } from 'src/plugins/utils'

  export default {
    name: 'masterBlankDrawer',
    beforeUnmount() {
      eventBus.off('toggleMasterDrawer')
      eventBus.off('openMasterDrawer')
    },
    mixins:[sidebarMixins],
    props: {},
    components: {},
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
        logo: this.$store.state.qsiteApp.logo,
        miniState: false,
        drawer: {
          filter: false,
        },
        appConfig: config('app'),
        filter: this.$filter
      }
    },
    watch: {
      routeSubHeader() {
        this.drawer.recommendation = false
      }
    },
    computed: {
      windowSize() {
        return this.windowWith >= '992' ? 'desktop' : 'mobile'
      },
      primaryContrast() {
        return  this.$getSetting('isite::primaryContrast')
      },
      secondaryContrast() {
        return  this.$getSetting('isite::secondaryContrast')
      },
      minilogo() {
        return this.$getMediaSetting('isite::logoIadminSM')['path']
      },
      routeSubHeader() {
        return this.$route.meta.subHeader || {}
      },
      //Version app text
      versionText() {
        return 'v' + config('app.version')
      },
    },
    methods: {
      //init
      init() {
        this.handlerEvent()
        this.contrast()
        //Watch window size
        window.addEventListener('resize', () => {
          this.windowHeight = window.innerHeight
          this.windowWith = window.innerWidth
        })
        this.openMenu = this.windowSize == 'mobile' ? false : true;
      },
      //contrast color alter
      contrast() {
        const master = document.querySelector('#blackDrawers2')
        if(!master) return '#000000';
        const bgColor = getComputedStyle(master).getPropertyValue('--q-primary')
        const contrast = this.$helper.pickTextColor(bgColor)
        const bgColor2 = getComputedStyle(master).getPropertyValue('--q--secondary')
        const contrast2 = this.$helper.pickTextColor(bgColor2)
        this.primaryContrast ? master.style.setProperty('--q-color-contrast',this.primaryContrast) : master.style.setProperty('--q-color-contrast',contrast)
        this.secondaryContrast ? master.style.setProperty('--q-color-contrast-two',this.secondaryContrast) : master.style.setProperty('--q-color-contrast-two',contrast2)
        return this.primaryContrast ? this.primaryContrast : contrast
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
            } else if (drawer == 'recommendation') {
              this.drawer[drawer] = (this.windowSize == 'mobile') ? false : true
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
  #blackDrawers2 {
    background-color: $primary;
    #menuMaster2 {
      aside {
        background: $primary;
        z-index: 3000;
      }
      #logoSite2 {
        padding: 20px 25px 26px 25px;
        height: 120px;
        background-color: #FFFFFF;
      }
      #miniLogoSite {
        padding: 30px 7px;
        height: 120px;
        background-color: #FFFFFF;
      }
      #versionContent {
        padding: 3px 15px;
        font-size: 13px;
      }
      .q-item {
        padding-left: 0;
        background-color: $primary;
        min-height: 50px;
        color: var(--q-color-contrast);
        .q-focus-helper {
          opacity: 0;
        }
        .q-item__section--avatar {
          padding: 0 18px !important;
        }
        .q-item__section,
        .q-icon {
          color: var(--q-color-contrast);
        }
      }
      .content-item > .q-item {
        .q-item__section--main {
          font-size: 16px;
        }
        .q-icon {
          font-size: 20px;
        }
        &:hover,
        &.item-is-active {
          background-color: $secondary;
          border-radius: 0 15px 15px 0;
          font-weight: 900;
        }
      }
      .content-item > .q-expansion-item {
        background-color: $primary;
        .q-expansion-item__container > .q-item {
          .q-item__label {
            font-size: 15px;
          }
          .q-icon {
            font-size: 20px;
          }
          &:hover,
          &.item-is-active {
            border-radius: 0 15px 15px 0;
            background-color: $secondary;
            font-weight: 900;
          }
        }
        .q-expansion-item__container > .q-expansion-item__content {
          padding: 0 0 0 3px;
          border-left: 18px solid $primary;
          #listMenu {
            .content-item {
              border-left: 3px solid $secondary;
            }
          }
          .q-item {
            min-height: 40px;
            margin-left: -1px;
            .q-item__section,
            .q-icon {
              color: var(--q-color-contrast);
              font-size: 14px;
              font-weight: 600;
            }
            .q-icon {
              display: none;
            }
            &:hover,
            &.item-is-active {
              background-color: $secondary;
              .q-item__section,
              .q-icon {
                color: var(--q-color-contrast);
              }
            }
          }
        }
      }
      .expansion-selected {
        background-color: $primary;
      }
      .q-drawer--mini .q-item {
        border-radius: 0 !important;
      }
    }
  }
  </style>
