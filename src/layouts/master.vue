<template>
  <q-layout id="layoutMaster" :view="(appConfig.mode == 'iadmin') ? 'lHh LpR lFf' : 'lHr LpR lFf'">
    <!-- HEADER -->
    <component :is="components.header" />

    <!-- Drawers -->
    <component :is="components.drawer" />

    <!-- ROUTER VIEW -->
    <q-page-container>
      <!--Page route-->
      <bannerAlert v-bind="configBanner()" v-if="isAppOffline || isWarning" />
      <div id="routeInformationContent" v-if="appConfig.mode == 'iadmin'"
           :class="`q-hide q-md-show ${iadminTheme == 1 ? 'bg-primary' : 'bg-white'}`">
        <div id="subContent" class="row justify-between items-center">
          <div class="row items-center">
            <!-- Back Button -->
            <q-btn icon="fas fa-arrow-left" unelevated round color="primary" dense class="btn-small q-mr-md"
                   @click="$helper.backHistory()">
              <q-tooltip>{{ $tr('isite.cms.label.back') }}</q-tooltip>
            </q-btn>
            <!--Breadcrumb-->
            <q-breadcrumbs class="text-blue-grey">
              <q-breadcrumbs-el v-for="(item, key) in breadcrumbs" :key="key" :label="item.label" :icon="item.icon"
                                :to="item.to ? {name : item.to} : false" />
            </q-breadcrumbs>
          </div>
          <!-- Help Center -->
          <activities v-bind="globalActivities.helpCenter" />
        </div>
      </div>
      <div id="fakeRouteInformationContent" class="q-hide q-md-show" v-if="appConfig.mode == 'iadmin'"></div>
      <!--Router view-->
      <div id="routerPageContent" class="layout-padding">
        <router-view v-if="appState.loadPage" />
        <Alert/>
      </div>
    </q-page-container>

    <!---Cropper-->
    <cropper-component ref="cropperComponent" />

    <!-- Admin popUp -->
    <activities v-bind="globalActivities.adminPopup" />

    <!-- Activities Actions -->
    <activities-actions />

    <!-- FOOTER -->
    <component :is="components.footer" />

    <notification-dialog />
  </q-layout>
</template>

<script>
import metaDataMixin from './metaDataMixin'
//Components Admin
import headerAdminTheme1 from 'modules/qsite/_components/admin/theme1/header';
import headerAdminTheme2 from 'modules/qsite/_components/admin/theme2/header';
import drawersAdminTheme1 from 'modules/qsite/_components/admin/theme1/drawers';
import drawersAdminTheme2 from 'modules/qsite/_components/admin/theme2/drawers';
import footerAdminTheme1 from 'modules/qsite/_components/admin/theme1/footer';
import footerAdminTheme2 from 'modules/qsite/_components/admin/theme2/footer';
//Components Panel
import headerPanel from 'modules/qsite/_components/panel/header';
import drawersPanel from 'modules/qsite/_components/panel/drawers';
import footerPanel from 'modules/qsite/_components/panel/footer';
//Components
import cropperComponent from 'modules/qsite/_components/master/cropper';
import activitiesActions from 'modules/qgamification/_components/activitiesActions/index.vue';
import Alert from 'modules/qoffline/_components/alert.vue'
import bannerAlert from 'modules/qsite/_components/master/bannerAlert.vue'
import _pages from 'src/setup/pages';
import _ from 'lodash';
import { eventBus } from 'src/plugins/utils.ts';
import notificationDialog from 'src/modules/qnotification/_components/notificationDialog/index.vue'

export default {
  name: 'MasterLayout',
  mixins: [metaDataMixin],
  components: {
    cropperComponent,
    activitiesActions,
    //Admin
    headerAdminTheme1,
    headerAdminTheme2,
    drawersAdminTheme1,
    drawersAdminTheme2,
    footerAdminTheme1,
    footerAdminTheme2,
    //Panel
    headerPanel,
    drawersPanel,
    footerPanel,
    //Offline
    Alert,
    bannerAlert,
    //Notification
    notificationDialog
  },
  watch: {
    shouldChangePassword(data) {
      //Validate messages
      if (data && data.shouldChangePassword) {
        data.messages.forEach(item => {
          this.$alert[item.type || 'info'](item);
        });
      }
    }
  },
  mounted() {
    this.$nextTick(async function() {
      this.init();
    });
  },
  data() {
    return {
      appConfig: config('app'),
      homePage: 'isite_cms_main_home',
      modalForce: {
        shouldChangePassword: false
      },
      bannerType: {
        offline: {
          icon: {
            name: 'fa-regular fa-wifi-slash',
          },
          message: this.$tr('isite.cms.message.appOffline'),
          classWrapper: 'tw-text-white tw-bg-gray-900',
          action: () => eventBus.emit('toggleMasterDrawer', 'offline')
        },
        notification: {
          marquee: true,
          message: this.$store.getters['qsiteApp/getSettingValueByName']('isite::globalWarningMessage'),
          classWrapper: 'tw-bg-yellow-400 tw-text-black tw-font-semibold',
        }
      }
    };
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    appState() {
      return this.$store.state.qsiteApp;
    },
    //Get them id
    iadminTheme() {
      //Get theme Id
      return this.$getSetting('isite::iadminTheme') || 1;
    },
    //instance components by mode and thems
    components() {
      if (this.appConfig.mode == 'iadmin') {//Return components to iadmin
        //Instance thems componenst to iadmin
        const themes = {
          theme1: {
            header: headerAdminTheme1,
            drawer: drawersAdminTheme1,
            footer: footerAdminTheme1
          },
          theme2: {
            header: headerAdminTheme2,
            drawer: drawersAdminTheme2,
            footer: footerAdminTheme2
          }
        };
        //Return theme components
        return themes[`theme${this.iadminTheme}`];
      } else { //Reutn components to ipanel
        return {
          header: headerPanel,
          drawer: drawersPanel,
          footer: footerPanel
        };
      }
    },
    pagesConfig() {
      return this.$store.state.qsiteApp.pages;
    },
    //Return data breadcrumd
    breadcrumbs() {
      let response = [];
      //Get breadcrumbs from params
      let breadcrumbs = (this.$route.meta?.subHeader?.breadcrumb || []).reverse();
      //Set Home page and current page
      const home  = _pages.mainapp.home
      const pages = this.$route.name.indexOf('app.home') == -1 ? [home, this.$route.meta] : [home]
      //Get page from breadcrum
      breadcrumbs.forEach((pageName) => {
        pages.splice(1, 0, _.get(_pages, pageName));
      });
      //Format all routes to breadcrum
      pages.forEach((page) => {
        if (!page) return;
        const isActive = page.options ? page.options.activated : page.activated;
        if (page && isActive && this.$hasAccess(page.permission)) {
          response.push({
            label: this.$tr(page.title),
            icon: page.icon,
            to: page.name
          });
        }
      });
      //Response
      return response;
    },
    //Should change password state
    shouldChangePassword() {
      return this.$store.state.quserAuth.shouldChangePassword;
    },
    //Activities
    globalActivities() {
      return {
        helpCenter: {
          systemName: 'help_center',
          view: 'button',
          vIf: this.$q.platform.is.desktop,
          btnProps: {
            color: 'info',
            flat: true
          }
        },
        adminPopup: {
          systemName: 'admin_popup',
          view: 'popup'
        }
      };
    },
    isWarning() {
      return this.$store.getters['qsiteApp/getSettingValueByName']('isite::globalWarningMessage')
    }
  },
  methods: {
    init() {
      this.idlTime();
    },
    /** idl Time */
    idlTime() {
      const idlTime = parseInt(this.$getSetting('iprofile::logoutIdlTime') || 0);
      if (idlTime) {
        var time;

        const resetTimer = () => {
          clearTimeout(time);
          if (this.$store.state.quserAuth.authenticated) {
            time = setTimeout(async () => {
              //Logout
              this.$store.dispatch('quserAuth/AUTH_LOGOUT');
              //Show message
              this.$alert.warning({
                mode: 'modal',
                title: this.$tr('iprofile.cms.message.logout'),
                message: this.$tr('iprofile.cms.message.logoutIdlTime'),
                actions: [
                  {
                    label: this.$tr('iprofile.cms.label.login'),
                    handler: async () => {
                      clearTimeout(time);
                      this.$router.push({ name: 'auth.login', query: this.$route.query });
                    }
                  }
                ]
              });
            }, ((idlTime * 60) * 1000));
          }
        };

        //Start Timer
        resetTimer();
        // DOM Events
        document.onmousemove = resetTimer;
        document.onkeydown = resetTimer;
      }
    },
    configBanner() {
      if (this.isAppOffline) return this.bannerType.offline
      if (this.isWarning) return this.bannerType.notification
    }
  }
};
</script>

<style lang="scss">
#layoutMaster {
  #routerPageContent {
    position: relative;
  }

  #routeInformationContent {
    width: -webkit-fill-available;
    position: fixed;
    z-index: 2;
    background: linear-gradient(180deg, #F1F4FA 0%, #FFFFFF 100%);

    #subContent {
      padding: 8px 10px 8px 16px;
      border-radius: $custom-radius 0 0 0;
      background: linear-gradient(180deg, #F1F4FA 0%, #FFFFFF 100%)
    }
  }

  #fakeRouteInformationContent {
    height: 35px;
    width: 100%;
  }
}
</style>
