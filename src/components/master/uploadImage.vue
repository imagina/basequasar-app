<template>
  <div id="uploadImageComponent">
    <!--Preview of image-->
    <div class="img-file" :style="stylesImage">
      <!--Content to upload image-->
      <div class="content-manage-file text-center">
        <!--Button edit image-->
        <q-btn icon="fas fa-camera" :color="color" :loading="loading">
          <q-menu>
            <!--Change or upload image-->
            <q-item @click.native="uploadFile()" clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="fas fa-file-image" :color="color"/>
              </q-item-section>
              <q-item-section>
                {{(this.file == '') ? $tr('ui.message.uploadImage') : $tr('ui.message.changeImage')}}
              </q-item-section>
            </q-item>
            <!--Remove image-->
            <q-item v-if="this.file != ''" clickable v-close-popup
                    @click.native="removeFile()">
              <q-item-section avatar>
                <q-icon name="fas fa-trash" :color="color"/>
              </q-item-section>
              <q-item-section>{{$tr('ui.message.deleteImage')}}</q-item-section>
            </q-item>
          </q-menu>
        </q-btn>
      </div>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
    <!--Uploader image-->
    <q-uploader url="" ref="uploadComponent"
                v-model="file" v-show="false"
                @added="setFile" extensions=".jpg"/>
  </div>
</template>

<script>
  export default {
    props: {
      color: { default: 'primary' },
      rounded: { type: Boolean, default: false },
      width: { default: '180px' },
      height: { default: '180px' },
      value: { default: null }
    },
    components: {},
    watch: {
      value () {
        this.loadImage()
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.loadImage()
      })
    },
    data () {
      return {
        loading: false,
        file: ''
      }
    },
    computed: {
      //Return path image
      getImageUrl () {
        let path = '/modules/iprofile/img/default.jpg'//Default path
        if (this.file != '') return this.file//If file exist, add to path
        return `${config('apiRoutes.api.base_url')}/${path}`//Return path image
      },
      //Return styles to image
      stylesImage () {
        return `
        background-image: url(${this.getImageUrl});
        width : ${this.width};
        height: ${this.height};
        border-radius: ${this.rounded ? '50%' : '10px'}
      `
      },
    },
    methods: {
      //load image from value prop if exist
      loadImage () {
        if (this.value) this.file = this.$clone(this.value)
      },
      //Dispath upload file event
      async uploadFile () {
        await this.removeFile()
        this.$refs.uploadComponent.pickFiles()
      },
      //Add image to data file
      setFile (files) {
        this.loading = true
        setTimeout(() => {
          this.file = files[0].__img.src
          this.$emit('input', this.file)
          this.loading = false
        }, 500)
      },
      //Remove file
      removeFile () {
        return new Promise((resolve, reject) => {
          if (this.file != '') {
            this.loading = true
            setTimeout(() => {
              this.$refs.uploadComponent.reset()
              this.file = ''
              this.loading = false
              this.$emit('input', this.file)
              return resolve(true)
            }, 500)
          } else {
            return resolve(true)
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  #uploadImageComponent
    margin 0 auto 20px auto

    .img-file
      position relative
      margin 0 auto
      width 180px
      height 180px
      margin-bottom 30px
      background-size cover
      background-position center
      background-repeat no-repeat
      max-width 100%

      .content-manage-file
        width 100%
        position absolute
        bottom 0

        .q-btn
          border-radius 10px
          height 40px !important
          width 40px !important
          margin-bottom -20px
          width max-content
</style>
