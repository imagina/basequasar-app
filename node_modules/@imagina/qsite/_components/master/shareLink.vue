<template>
  <q-no-ssr id="shareLinkcomponent" class="inline-block" v-if="link">
    <!--Buttons-->
    <div id="contentButtons">
      <!--Available buttons to share-->
      <div v-for="(button, key) in availableButtons" :key="key" class="inline-block">
        <q-btn :icon="button.icon" unelevated :label="showLabel ? key : ''" v-if="buttons.indexOf(key) != -1"
               :color="button.color" flat @click="shareLink(key)"/>
      </div>
      <!--Button to open modal to share-->
      <q-btn icon="fas fa-share-alt" color="grey-9" flat unelevated @click="showModal = true" v-if="!noModal"/>
    </div>
    <!--Modal Buttons-->
    <q-dialog id="shareLinkModalButtons" v-model="showModal" v-if="!noModal">
      <q-card>
        <q-card-section class="row items-center">
          <!--Title-->
          <div class="text-h6 text-primary">
            <q-icon name="fas fa-share-alt" class="q-mr-xs"/>
            {{$tr('ui.label.share')}}
          </div>
          <q-space/>
          <!--Close button-->
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <!--Available buttons to share-->
        <q-card-section class="q-pt-none row q-gutter-y-sm">
          <div v-for="(button, key) in availableButtons" :key="key" class="buttonContent col-12">
            <q-btn :icon="button.icon" unelevated :label="key" :color="button.color" align="left"
                   @click="shareLink(key)"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-no-ssr>
</template>
<script>
  export default {
    props: {
      buttons: {
        type: Array,
        default: () => {
          return []
        }
      },
      showLabel: {type: Boolean, default: false},
      noModal: {type: Boolean, default: false},
      link: {default: true}
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        showModal: false
      }
    },
    computed: {
      availableButtons() {
        return {
          facebook: {icon: 'fab fa-facebook', color: 'blue'},
          whatsapp: {icon: 'fab fa-whatsapp', color: 'green'},
          twitter: {icon: 'fab fa-twitter', color: 'cyan'},
          copy: {icon: 'fas fa-copy', color: 'grey'},
        }
      },
      stylePupop() {
        let windowH = window.innerHeight
        let windowW = window.innerWidth

        return `resizable,height=${windowH - 100},width=600,top=${50},left=${((windowW - 600) / 2)}`
      }
    },
    methods: {
      init() {
        this.stylePupop
      },
      //Share link
      shareLink(platform) {
        if (this.link) {
          let linkOrigin = window.location.origin
          let link = this.$clone(this.link)

          //Order vue router to share
          if (link && link.routeName) {
            //Genarate vue route
            link = this.$router.resolve({
              name: link.routeName,
              params: link.params ?? {},
              query: link.query ?? {},
            })
            //Get fullpath
            //link = `${linkOrigin}${link.route.fullPath}`
            link = `https://www.soloparches.com${link.route.fullPath}`
          }

          switch (platform) {
            case 'facebook':
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`, '_blank', this.stylePupop)
              break;
            case 'whatsapp':
              window.open(`whatsapp://send?text=${link}`, '_blank', this.stylePupop)
              break;
            case 'twitter':
              window.open(`http://www.twitter.com/share?url=${link}`, '_blank', this.stylePupop)
              break;
            case 'copy':
              navigator.clipboard.writeText(link).then(() => {
                this.$alert.info(this.$tr('ui.message.copiedToClipboard'))
              })
              break;
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
  #shareLinkcomponent
    #contentButtons
      .q-btn__wrapper
        padding 4px
        min-height 24px

        .q-icon
          font-size 20px

  //Modal
  #shareLinkModalButtons
    .q-card
      max-width 230px

      .buttonContent
        display block

        .q-btn
          width 100%
          display block
          text-transform capitalize
</style>
