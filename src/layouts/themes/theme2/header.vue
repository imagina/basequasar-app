<template>
  <div id="masterAdminHeader">
    <!-- HEADER -->
    <q-header>
      <!-- Toolbar  -->
      <div :class="'q-hide q-md-show'">
        <q-toolbar id="toolbarTop">
          <q-btn v-if="appConfig.mode === 'iadmin'" icon="fas fa-bars" unelevated
            class="text-primary buttonToogleMenuClose" @click="eventBus.emit('toggleMasterDrawer','menu')"/>
          <q-toolbar-title/>
          <!--Site Actions-->
          <site-actions/>
        </q-toolbar>
      </div>
    </q-header>
  </div>
</template>
<script>
//Components
import siteActions from 'src/components/siteActions/index.vue'
import { eventBus } from 'src/plugins/utils'

export default {
  name: 'masterAdminHeaderTheme2',
  components: {siteActions},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      projectName: this.$getSetting('core::site-name'),
      logo: this.$store.state.qsiteApp.logo,
      appConfig: config('app'),
      loadHeaderIpanel: false,
      eventBus
    }
  },
  computed: {
    //Quser state
    quserState() {
      return this.$store.state.quserAuth
    }
  },
  methods: {
    init() {
      //Get header ipanel
      //this.getHeaderIpanel()
    },
    //Get html header ipanel
    getHeaderIpanel() {
      if (config('app.mode') == 'ipanel') {
        this.$remember.async({
          key: 'headerIpanelHTML',
          seconds: (3600 * 3),
          refresh: false,
          callBack: () => {
            return new Promise((resolve, reject) => {
              let baseUrl = this.$store.state.qsiteApp.baseUrl
              this.$axios.get(baseUrl + '/isite/header').then(response => {
                resolve(response)
              }).catch(error => {
                console.error('[HEADER-IPANEL]', error.response)
                reject(error.response)
              })
            })
          }
        }).then(response => {
          //Define Template
          var template = document.createElement('template')
          template.innerHTML = response.data

          //Load weeb component
          window.customElements.define('embedded-header-ipanel', class EmbeddedWebview extends HTMLElement {
                connectedCallback() {
                  const shadow = this.attachShadow({mode: 'closed'});
                  shadow.appendChild(document.importNode(template.content, true))
                }
              }
          );

          //Allow load header web component
          this.loadHeaderIpanel = true
        }).catch(error => {
          console.error('[HEADER-IPANEL]', error)
        })
      }
    }
  }
}
</script>
<style lang="scss">
#masterAdminHeader {
  .q-header {
    background-color: white;
    .buttonToogleMenuClose {
      position: absolute;
      top: 8px;
      left: 5px;
    }
  }
  #toolbarTop {
    position: relative;
  }
}
</style>
