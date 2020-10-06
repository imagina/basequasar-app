<template>
  <div id="galleryWithModalContainer">
    <div class="q-ml-none">
      <div class="row justify-center" v-if="gallery">
        <div v-for="(picture , i) in position" :key="i"
             class="img-container col-xs-12 col-sm-6 col-md-4 col-lg-3" @click="openModal(i)">
          <div v-if="picture.type==='360'" class="gallery-img">
            <q-no-ssr>
              <Pano :source="picture.imageUrl"/>
            </q-no-ssr>
          </div>
          <div v-if="picture.type==='video'" class="gallery-img">
            <embed width="100%" height="100%" :src="picture.externalImageUrl">
          </div>
          <div v-if="picture.type==='image'" class="gallery-img"
               :style="'background-image: url('+picture.imageUrl+')'">
          </div>
          <div v-if="picture.type==='auto'||picture.type===''" class="gallery-img"
               :style="!ifVideoUrl(picture.externalImageUrl)?'background-image: url('+picture.imageUrl+')':''">
            <embed width="100%" height="100%"
                   v-if="ifVideoUrl(picture.externalImageUrl)&&picture.externalImageUrl===picture.imageUrl"
                   :src="picture.externalImageUrl">
          </div>
        </div>
        <q-list v-if="gallery.length===0&&loading===false" class="text-center bg-white col-12">
          <span class="text-weight q-caption">No hay imágenes</span>
        </q-list>
      </div>
    </div>

    <q-carousel v-model="currentCarousel" class="text-white q-mb-sm" arrows height="60%" quick-nav
                ref="carouselGallery" v-show="visibleCarousel">
      <q-carousel-slide :name="i" v-for="(picture , i) in gallery" :key="i" class="bg-grey-2">
        <div class="img-fluid absolute-center" :style="'background-image: url('+picture.imageUrl+')'"></div>
      </q-carousel-slide>
      <template v-slot:control>
        <q-carousel-control position="top-right">
          <q-btn round dense color="primary" icon="close"
                 @click="$refs.carouselGallery.toggleFullscreen();visibleCarousel=false"/>
        </q-carousel-control>
      </template>
    </q-carousel>
    <q-inner-loading :visible="loading">
      <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
    </q-inner-loading>
  </div>
</template>

<script>

  export default {
    name: "galleryWithModal",
    props: {
        systemName:{
            type: String,
            default: null
        },
    },
    beforeRouteLeave(to, from, next) {
      // closing modal details if is opened
      if (!this.visibleCarousel) {
        next()
      } else {
        this.visibleCarousel = false
        next(false)
      }
    },
    watch: {
      systemName() {
        this.init()
      },
    },
    mounted() {
      /**
       * set page toolbar title
       * */
      document.addEventListener('keyup', (evt) => {
        if (evt.keyCode === 27) {
          this.visibleCarousel = false
        }
      });
    },
    data() {
      return {
        currentCarousel: 0,
        loading: true,
        visibleCarousel: false,
        position: {},
      }
    },
    computed:{
      gallery(){
          let params = {
              params: {
                  filter: {
                      field: 'system_name'
                  }
              }
          }
          this.loading = true
          this.$crud.show('apiRoutes.qslider.sliders', this.systemName, params).then(response => {
              this.position = response.data
              console.log(this.position)

              this.loading = false
          }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              this.loading = false
          })
      }
    },
    methods: {
      ifVideoUrl($url) {
        if ($url == null) {
          return false
        }

        let $yt_rx = '/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/';
        let $has_match_youtube = $url.match($yt_rx);


        let $vm_rx = '/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([‌​0-9]{6,11})[?]?.*/';
        let $has_match_vimeo = $url.match($vm_rx);


        //Then we want the video id which is:
        let $video_id = '';
        let $type = '';
        console.warn($has_match_vimeo, $has_match_youtube);
        if ($has_match_youtube != null) {
          $video_id = $has_match_youtube[5];
          $type = 'youtube';
        } else if ($has_match_vimeo != null) {
          $video_id = $has_match_vimeo[5];
          $type = 'vimeo';
        } else {
          return false
        }

        let $data = [];

        $data['video_id'] = $video_id;
        $data['video_type'] = $type;

        return $data;

      },
      openModal(i) {
        if (this.gallery[i].type === '360') {
          return;
        }
        this.$refs.carouselGallery.toggleFullscreen()
        this.$refs.carouselGallery.goTo(i)
        this.visibleCarousel = true
      }
    }
  }
</script>

<style lang="stylus">
  .q-carousel
    .img-fluid
      width 100vw
      height 85vh
      background-size contain
      background-position center
      background-repeat no-repeat
      cursor pointer
      padding 0

    .q-btn__content
      background-color $grey-9
      border-radius 50%

  #galleryWithModalContainer
    .img-container
      overflow hidden

      .gallery-img
        margin 3px
        overflow hidden
        width 100%
        max-height 30vh
        height 30vh
        background-repeat no-repeat
        background-size cover
        background-position center center
        cursor pointer

      &:first-child .gallery-img
        @media screen and (min-width: $breakpoint-md) {
          height 60vh
        }
</style>
