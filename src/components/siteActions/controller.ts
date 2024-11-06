import {computed, reactive, onMounted, toRefs, onBeforeUnmount, nextTick} from 'vue';
import {eventBus, store, clone, router, i18n} from 'src/plugins/utils';
import {Badge, ControllerProps, Organization} from './interface'

export default function controller(props: ControllerProps) {
  // States
  const state = reactive({
    configMode: config('app.mode'),
    badge: {
      chat: false,
      notification: false
    },
    defaultButtonProps: {
      round: true,
      dense: true,
      color: 'white',
      unelevated: true,
      class: 'btn-small',
      textColor: 'blue-grey',
      noCaps: true
    },
    customActions: {customBtns: [], customMenus: []}
  })

  // Computed
  const computeds = {
    isAppOffline: computed(() => {
      return store.state.qofflineMaster.isAppOffline;
    }),
    //Quser state
    quserState: computed(() => {
      return store.state.quserAuth;
    }),
    //Current Theme
    theme: computed(() => {
      return parseInt(store.getSetting('isite::iadminTheme'));
    }),
    //Return params of subHeader
    params: computed(() => {
      return clone(router.route.meta.subHeader || {});
    }),
    showGoToSiteButton: computed(() => {
      return store.getSetting('isite::showGoToSiteButton') || false;
    }),
    //Site Actions
    actions: computed(() => {
      let goToSiteUrl = store.state.qsiteApp.baseUrl;

      const quserState = computeds.quserState?.value || {}

      //define the organization url if there're someone selected
      if (quserState?.organizationId) {
        const organizationSelected = quserState.organizations.find((organization: Organization) => organization.id == quserState.organizationId);
        if (organizationSelected) goToSiteUrl = organizationSelected.url;
      }

      const { customBtns, customMenus } = state.customActions;

      return {
        buttons: [
          //Offline
          {
            vIf: store.getSetting('isite::offline'),
            name: 'offline',
            label: i18n.tr('isite.cms.label.offline'),
            badgeColor: 'orange',
            badgeLabel: store.state.qofflineMaster.pendingRequests,
            props: {
              icon: 'fa-light fa-cloud-slash',
              class: 'btn-small'
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'offline')
          },
          //Go To Site
          {
            vIf: computeds.showGoToSiteButton?.value,
            name: 'goToSite',
            label: i18n.tr('isite.cms.configList.goToSite'),
            props: {
              label: i18n.tr('isite.cms.showSite'),
              type: 'a',
              id: 'siteActionGoToSite',
              href: goToSiteUrl,
              target: '_blank',
              round: false,
              rounded: true,
              padding: 'xs md'
            }
          },
          //checking
          {
            name: 'checking',
            vIf: (config('app.mode') == 'ipanel') && store.hasAccess('icheckin.shifts.create'),
            label: i18n.tr('icheckin.cms.sidebar.checkin'),
            props: {
              icon: 'fas fa-stopwatch',
              round: true
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'checkin')
          },
          //Chat
          {
            name: 'chat',
            label: 'Chat',
            vIf: (config('app.mode') == 'iadmin') && store.hasAccess('ichat.conversations.index'),
            badge: state.badge.chat,
            props: {
              icon: 'fa-light fa-message-lines',
              class: 'btn-small'
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'chat')
          },
          //Notifications
          {
            name: 'notifications',
            label: i18n.trp('isite.cms.label.notification'),
            badge: state.badge.notification,
            props: {
              icon: 'fa-light fa-bell',
              class: 'btn-small'
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'notification')
          },
          //Help Center
          {
            name: 'helpCenter',
            desc: i18n.tr('isite.cms.message.descriptionHelpCenter'),
            label: i18n.trp('isite.cms.label.helpCenter'),
            vIf: parseInt(store.getSetting('isite::hcStatus') || '0'),
            props: {
              id: 'siteActionHelpCenter',
              icon: 'fal fa-question-circle'
            },
            menu: {
              actions: [
                {
                  icon: 'fa-light fa-question-circle',
                  rightIcon: 'fa-light fa-chevron-right',
                  label: 'FAQ',
                  action: () => eventBus.emit('toggleHelpSection', {sectionName: 'faq'})
                }
              ]
            }
          },
          // Clear Cache
          {
            name: 'clearCache',
            label: i18n.tr('isite.cms.configList.clearCache'),
            props: {
              icon: 'fa-light fa-broom'
            },
            vIf: !computeds.isAppOffline.value,
            action: () => router.push({
              name: 'app.update.app',
              query: {fromCache: 1}
            })
          },
          ...customBtns
        ],
        menu: [
          //Profile
          {
            name: 'profile',
            props: {
              label: i18n.tr('iprofile.cms.sidebar.panelProfile'),
              icon: 'fa-light fa-circle-user',
              round: false,
              square: true,
              align: 'left',
              id: 'profileButton'
            },
            action: () => (router.route.name != 'user.profile.me') ? router.push({name: 'user.profile.me'}) : null
          },
          //Settings
          {
            name: 'settings',
            vIf: (config('app.mode') == 'iadmin'),
            props: {
              label: i18n.trp('isite.cms.label.setting'),
              icon: 'fa-light fa-folder-gear',
              round: false,
              square: true,
              align: 'left'
            },
            action: () => eventBus.emit('toggleMasterDrawer', 'config')
          },
          //logout
          {
            name: 'settings',
            vIf: (config('app.mode') == 'iadmin') && !computeds.isAppOffline.value,
            props: {
              label: i18n.tr('isite.cms.configList.signOut'),
              icon: 'fa-light fa-right-from-bracket',
              round: false,
              square: true,
              textColor: 'red',
              align: 'left'
            },
            action: () => methods.logout()
          },
          ...customMenus
        ],
        ...(props.replaceActions || {})
      };
    }),
    profileImage() {
      return store.getters['quserAuth/profileImage'];
    }
  }

  // Methods
  const methods = {
    init() {
      //Manage badges to button actions
      eventBus.on('header.badge.manage', (response: Badge) => {
        Object.keys(response).forEach(name => state.badge[name] = response[name]);
      });
    },
    logout() {
      router.push({name: 'auth.logout'});
    },
    async getCustomHeaderActions() {
      const customBtns = [];
      const customMenus = [];
      const values = Object.values(config('main'))
      const headerActionsList = await Promise.allSettled(
        values.flatMap(async (item) => {
          const headerActions = item.headerActions;
          if (!headerActions) return [];
          if (typeof headerActions === 'function') {
            const result = await headerActions();
            return result || [];
          }
          return headerActions;
        }) // Add await for async request
      )
      const successfulActions = headerActionsList
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);
      successfulActions.forEach((config) => {
        const customConfig = {
          ...config,
          props: {
            ...state.defaultButtonProps,
            ...(config.props || {})
          }
        };
        // Separate btn and menu
        if (config.type === 'btn') customBtns.push(customConfig);
        else if (config.type === 'menu') customMenus.push(customConfig);
      });
      state.customActions = {customBtns, customMenus}
    },
  }

  onBeforeUnmount(() => {
    eventBus.off('header.badge.manage');
  })
  onMounted(() => {
    nextTick(() => {
      methods.init()
      methods.getCustomHeaderActions()
    })
  })

  return {...(toRefs(state)), ...computeds, ...methods}
}
