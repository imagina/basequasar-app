<template>
  <div class="q-mt-md">

  </div>
</template>

<script>
  export default {
    props:{
      slide:{
        type: Object,
        default: ()=>({
          imageUrl: '',
        }),
        required: true
      },
      index:{
        type: Number,
        required: true
      }
    },
    methods:{
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
      deleteSlide (slideId, pos) {

      },
    }
  }
</script>
