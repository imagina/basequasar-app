<template>
  <div class="row relative-position">
    <div class="col-12">
      <!---Component CRUD Slided -->
      <div class="text-right q-mb-md">
        <crud :crud-data="import('@imagina/qslider/_crud/slides')" ref="crudSlide"
              type="button-create" :crud-props="{unelevated : true, rounded : true}"
              @updated="$emit('refresh')" @created="$emit('refresh')"
              :custom-data="{formLeft : {sliderId: {value : $route.params.id}}}"/>
      </div>
      <!--Items-->
      <draggable @change="updateOrderSlides" v-model="slider.slides" group="slides">
        <!--Item-->
        <q-card class="my-card q-mb-md" v-for="(slide,index) in slider.slides" :key="'slide'+index">
          <div class="row items-center q-pa-sm">
            <!--Title-->
            <div class="col-6">
              <q-chip square icon="fas fa-images" text-color="white" :color="slide.active ? 'positive' : 'grey'">
                {{slide.title}}
              </q-chip>
            </div>
            <!--Actions-->
            <div class="col-6 text-right">
              <q-btn color="blue-4" size="sm" round icon="fas fa-pen" unelevated class="q-mr-sm"
                     @click="$refs.crudSlide.update(slide.id)"/>
              <q-btn @click="deleteSlideDialog(slide.id, index)" color="negative" unelevated
                     size="sm" round icon="far fa-trash-alt"/>
            </div>
          </div>
          <q-separator/>
          <iframe
            v-if="slide.imageUrl && slide.imageUrl.indexOf('youtube.com')"
            width="100%"
            height="300"
            :src="slide.imageUrl"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
          <video
            width="100%"
            height="300"
            v-else-if="slide.imageUrl && slide.imageUrl.indexOf('.mp4')"
            class='img-responsive center-block'
            loop
            controls='false'>
            <source :src="slide.imageUrl" type='video/mp4'>
          </video>
          <div
            v-else
            :style="`
        background: url('${slide.imageUrl}');
        background-size: cover;
        background-position: center;
        height: 300px;
        display: block;
        max-width: 100%;`">
          </div>
        </q-card>
      </draggable>
    </div>
    <!--Loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  import renderMedia from '@imagina/qslider/_components/admin/slide/renderMedia'
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable,
      renderMedia
    },
    data() {
      return {
        loading: false
      }
    },
    props: {
      slider: {
        type: Object,
        default: () => ({
          id: 0,
        })
      },
    },
    watch: {},
    methods: {
      hasPermissionRecordMAster(record) {
        let options = record.options || false
        let response = {
          create: true,
          edit: true,
          index: true,
          destroy: true,
        }
        if (options && parseInt(options.masterRecord)) {
          response = {
            create: this.$auth.hasAccess('isite.master.records.create'),
            edit: this.$auth.hasAccess('isite.master.records.edit'),
            index: this.$auth.hasAccess('isite.master.records.index'),
            destroy: this.$auth.hasAccess('isite.master.records.destroy')
          }
        }
        return response
      },
      log() {
        let slides = this.slider.slides.map(slide => ({id: slide.id}))
        console.error(slides)
      },
      updateOrderSlides() {
        let slides = this.slider.slides.map(slide => ({id: slide.id}))
        let data = {
          slider: slides
        }
        this.loading = true
        this.$crud.create('apiRoutes.qslider.orderSlides', data).then(response => {
          this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
          this.loading = false
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          console.warn(error)
          this.loading = false
        })
      },
      deleteSlideDialog(slideId, pos){
        this.$q.dialog({
          title: 'Confirm',
          ok: 'Delete',
          message: 'You are sure to eliminate this slide?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.$crud.delete('apiRoutes.qslider.slides', slideId).then(response => {
            this.$alert.info({ message: this.$tr('ui.message.recordDeleted') })
            //this.slider.slides.splice(pos, 1)
            this.$root.$emit('deleteSlide', 'deleteSlide')
          }).catch(error => {
            this.$alert.error({ message: this.$tr('ui.message.recordNoDeleted'), pos: 'bottom' })
          })
        }).onCancel(() => {})
      },
    }
  }
</script>

<style scoped>

</style>
