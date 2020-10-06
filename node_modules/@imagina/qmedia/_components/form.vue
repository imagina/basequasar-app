<template>
  <div id="mediaForm" class="row full-width">
    <div v-if="label" class="col-12 q-heading q-caption q-my-sm label">{{ this.label }}</div>
    <!--= image viewer =-->
    <div class="col-12">
      <!--= if is multiple =-->
      <q-scroll-area v-if="multiple" style="width: 100%; height: 150px;">
        <draggable @change="pushData(false)" class="row  q-col-gutter-x-xs full-width" v-model="files" group="people">
          <div
            v-for="(file,index) in files"
            :key="index"
            :style="'background-image:url(' + file.mediumThumb + ')'"
            class="image-multiple col-6 col-md-3 col-lg-2"
          >
            <q-btn round color="red" @click="deleteFile(index)" icon="fas fa-times" size="sm"/>

          </div>
        </draggable>

      </q-scroll-area>
      <!--= if not multiple =-->
      <div v-else class="row q-col-gutter-x-sm">
        <div v-for="(file,index) in files"
             :key="index"
             class="col-12 col-md-6 ">
          <img class="img-fluid" :src="file ? file.mediumThumb : ''"/>
          <q-btn class="absolute-top-left" style="top: 0; left: 0;" round color="red" @click="deleteFile(index)"
                 icon="fas fa-times"
                 size="sm"/>
        </div>
      </div>
    </div>

    <!--= Add File Button =-->
    <q-btn
      :label="buttonLabel ? buttonLabel : $tr('ui.label.addFile')"
      :icon="buttonIcon ? buttonIcon : 'fas fa-upload'"
      color="primary"
      class="q-my-xs"
      size="sm"
      @click="modalMedia = true"/>


    <!--= Media List Modal =-->
    <q-dialog id="modalMedia" v-model="modalMedia" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-card>
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{$tr('qmedia.layout.selectMedia')}}</q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>
        <q-card-section class="q-pa-md">
          <media-list embebed @data="pushData"/>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>
<script>
  /*Components*/
  import mediaList from '@imagina/qmedia/_components/list'
  import draggable from 'vuedraggable'
  /*Services*/
  import mediaService from '@imagina/qmedia/_services/index'

  export default {
    props: {
      zone: {
        type: String,
        default: 'image'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        default: () => {
          return {}
        }
      },
      entity: {type: String, required: true},
      entityId: {default: null},
      label: {type: String, default: ''},
      buttonLabel: {type: String, default: ''},
      buttonIcon: {type: String, default: ''}
    },
    components: {
      mediaList,
      draggable
    },
    watch: {
      entityId() {
        if (this.entityId) {
          this.getData()
        }
      },
      zone() {
        if (this.entityId) {
          this.getData()
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        // if has entity id, get the files associated
        if (this.entityId) {

          this.getData()
        }
      })
    },
    data() {
      return {
        modalMedia: false,
        ids: [],
        files: []
      }
    },
    methods: {
      getData() {
        let params = {
          refresh: true,
          params: {
            zone: this.zone,
            entity: this.entity,
            entity_id: this.entityId
          },
        }

        // if is multiple media, call diff routes and transform diff the response.data
        if (this.multiple) {
          this.$crud.index('apiRoutes.qmedia.find', params).then(response => {
            if (response.data)
              this.files = response.data;
            this.pushData()
          }).catch(error => {
          })
        } else {
          this.$crud.index('apiRoutes.qmedia.findFirst', params).then(response => {

            if (response.data)
              this.files = [response.data];
            this.pushData()
          }).catch(error => {
          })
        }

      },
      /**
       * push data to v-model
       * @param file
       */
      pushData(file = false) {

        if (this.multiple) {
          // if file is not false, its pusher on files list
          if (file) {
            this.files.push(file)
            this.$alert.success("image: " + file.filename + " added")
          }

          let vmodel = {}, ids = []
          this.files.forEach(file => {
            ids.push(file.id)
          })
          vmodel = JSON.parse(JSON.stringify(this.value))
          if (!vmodel[this.zone])
            vmodel[this.zone] = {}

          vmodel[this.zone].files = ids
          vmodel[this.zone].orders = ids.join();
          this.$emit('input', vmodel)

        } else {
          if (file)
            this.files = [file]
          let vmodel = JSON.parse(JSON.stringify(this.value))
          if (!vmodel[this.zone])
            vmodel[this.zone] = {}
          vmodel[this.zone] = file ? file.id : this.files[0] ? this.files[0].id : ''
          this.$emit('input', vmodel)
          this.modalMedia = false
        }

      },
      /**
       * delete files and push data to the v-model
       * @param index
       */
      deleteFile(index) {
        this.files.splice(index, 1)
        this.pushData()
      },
    }

  }
</script>
<style lang="stylus">
  #mediaForm
    .image-multiple
      background-repeat no-repeat
      background-size 100% auto
      background-position center center
      height 150px
      overflow hidden

    .label
      text-transform capitalize

  #modalMedia
    .q-card
      min-width 80vw

      .q-card__section
        max-height calc(100vh - 148px) !important
        overflow-y scroll
</style>
