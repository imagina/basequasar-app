<template>
  <div id="uploadImageComponent">
    <!--Preview of image-->
    <div class="img-file" :style="stylesImage">
      <!--Content to upload image-->
      <div class="content-manage-file text-center">
        <!--Button edit image-->
        <q-btn icon="fas fa-edit" :color="color">
          <!--tooltip-->
          <q-tooltip>{{$tr('ui.message.editImage')}}</q-tooltip>
          <!--actions popover-->
          <q-popover anchor="bottom middle" self="bottom middle">
            <q-list separator link>
              <!--Change or upload image-->
              <q-item v-close-overlay @click.native="uploadFile()">
                <q-item-side :color="color" icon="fas fa-file-image"/>
                <q-item-main>
                  {{(this.file == '') ? $tr('ui.message.uploadImage') : $tr('ui.message.changeImage')}}
                </q-item-main>
              </q-item>
              <!--Remove image-->
              <q-item v-close-overlay v-if="this.file != ''"
                      @click.native="removeFile()">
                <q-item-side :color="color" icon="fas fa-trash"/>
                <q-item-main>{{$tr('ui.message.deleteImage')}}</q-item-main>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </div>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
    <!--Uploader image-->
    <q-uploader url="" ref="uploadComponent"
                v-model="file" v-show="false"
                @add="setFile" extensions=".jpg"/>
  </div>
</template>
<script>
  export default {
    props: {
      color: {default: 'blue-grey'},
      rounded: {type: Boolean, default: false},
      width: {default: '180px'},
      height: {default: '180px'},
      value: {default: null}
    },
    components: {},
    watch: {
      value(){
        this.loadImage()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.loadImage()
      })
    },
    data() {
      return {
        loading: false,
        file: ''
      }
    },
    computed: {
      //Return path image
      getImageUrl() {
        let path = '/modules/iprofile/img/default.jpg'//Default path
        if (this.file != '') return this.file//If file exist, add to path
        return `${config('apiRoutes.api.base_url')}/${path}`//Return path image
      },
      //Return styles to image
      stylesImage() {
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
      loadImage(){
        if(this.value) this.file = this.$clone(this.value)
      },
      //Dispath upload file event
      async uploadFile() {
        await this.removeFile()
        this.$refs.uploadComponent.pick()
      },
      //Add image to data file
      setFile(files) {
        this.loading = true
        setTimeout(() => {
          this.file = files[0].__img.src
          this.$emit('input',this.file)
          this.loading = false
        }, 500)
      },
      //Remove file
      removeFile() {
        return new Promise((resolve, reject) => {
          if(this.file != ''){
            this.loading = true
            setTimeout(() => {
              this.$refs.uploadComponent.reset()
              this.file = ''
              this.loading = false
              this.$emit('input',this.file)
              return resolve(true)
            }, 500)
          }else return resolve(true)
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #uploadImageComponent
    .img-file
      position relative
      margin 0 auto
      width 180px
      height 180px
      background-size cover
      background-position center
      background-repeat no-repeat
      overflow hidden

      .content-manage-file
        width 100%
        position absolute
        bottom 0

        .q-btn
          border-radius 0 !important
          width 100%
</style>
