<template>
  <div id="masterPanelHeader">
    <!-- HEADER -->
    <q-header>
      <!--Toolbar panel-->
      <q-toolbar id="toolbarTop">
        <!--== Menu Button ==-->
        <q-btn id="buttonToogleMenu" icon="fas fa-bars" unelevated color="primary"
               @click="eventBus.emit('toggleMasterDrawer','menu')"/>
        <!--Breadcrumb-->
        <q-toolbar-title>
          <div id="breadCrumbContent" class="q-hide q-md-show">
            <q-breadcrumbs class="text-blue-grey" gutter="none">
              <q-breadcrumbs-el v-for="(item, key) in breadcrumbs" :key="key" :label="item.label"
                                :to="item.to ? {name : item.to} : false"/>
            </q-breadcrumbs>
          </div>
        </q-toolbar-title>
        <!--Site Actions-->
        <site-actions/>
      </q-toolbar>
    </q-header>
  </div>
</template>
<script>
//Components
import siteActions from 'src/components/siteActions/index.vue'
import { eventBus } from 'src/plugins/utils'

export default {
  name: 'masterPanelHeader',
  beforeUnmount() {
    eventBus.off('header.badge.manage')
  },
  components: {siteActions},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      projectName: this.$getSetting('isite::site-name'),
      logo: this.$store.state.qsiteApp.logo,
      appConfig: config('app'),
      badge: {
        chat: false,
        notification: false
      },
      loadHeaderIpanel: false,
      eventBus
    }
  },
  computed: {
    //Current route
    currentRoute() {
      return this.$route
    },
    //Return params of subHeader
    params() {
      return this.currentRoute.meta.subHeader || {}
    },
    //Return data breadcrumd
    breadcrumbs() {
      let response = []
      //Get breadcrumbs from params
      let breadcrumbs = this.params.breadcrumb ? this.$clone(this.params.breadcrumb) : []
      breadcrumbs = this.$clone(breadcrumbs.reverse())

      //Set Home page and current page
      let pages = (this.currentRoute.name.indexOf('app.home') == -1) ?
          [config('pages.mainqsite.home'), this.currentRoute.meta] : [config('pages.mainqsite.home')]

      //Get page from breadcrum
      breadcrumbs.forEach(pageName => pages.splice(1, 0, config(`pages.${pageName}`)))

      //Format all routes to breadcrum
      pages.forEach(page => {
        if (page && page.activated && this.$hasAccess(page.permission))
          response.push({
            label: this.$tr(page.headerTitle || page.title),
            icon: page.icon,
            to: page.name
          })
      })

      //Response
      return response
    }
  },
  methods: {
    init() {
      //Manage badges to button actions
      eventBus.on('header.badge.manage', (response) => {
        Object.keys(response).forEach(name => this.badge[name] = response[name])
      })
    },
  }
}
</script>
<style lang="scss">
#masterPanelHeader {
  .q-header {
    background: linear-gradient(180deg, #F1F4FA 0%, #FFFFFF 100%);
  }

  #toolbarTop {
    padding-left: 0;
    padding-right: 10px;

    #buttonToogleMenu {
      height: 36px;
      width: 36px;
      border-radius: 0 10px 10px 0;

      .q-icon {
        font-size: 16px;
      }
    }

    .q-breadcrumbs {
      .q-breadcrumbs__el {
        font-size: 14px;
      }

      .q-breadcrumbs__separator {
        font-size: 14px;
        padding: 0 3px;
      }
    }
  }

  #siteActionscomponent {
    .q-btn {
      box-shadow: $custom-box-shadow;
    }
  }
}
</style>
