<template>
  <div id="avatarImageComponent" class="inline-block"
       @click="() => {dialog.show = true; $emit('click')}">
    <!--Avatar-->
    <div v-if="src" class="avatar-img-content"
         :style="`background-image: url('${src}'); ${defaultSize}`"></div>

    <!--Full screen-->
    <q-dialog id="modalOpenImage" v-model="dialog.show" v-if="!noOpen">
      <div class="contentImage text-center">
        <!--Image-->
        <q-card class="q-pa-sm q-mb-sm"><img :src="src"></q-card>
        <!--Button close-->
        <q-btn icon="fas fa-times" unelevated round color="primary" @click="dialog.show = false"/>
      </div>
    </q-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      src: {default: false},
      noOpen: {type: Boolean, default: false},
      size: {default: false},
      width: {default: '60px'},
      height: {default: '60px'},
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        dialog: {show: false}
      }
    },
    computed: {
      defaultSize() {
        return `width : ${this.size || this.width}; height: ${this.size || this.height}`
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  #avatarImageComponent
    height max-content
    width max-content
    .avatar-img-content
      border-radius 50%
      background-position center
      background-repeat no-repeat
      background-size cover

  #modalOpenImage
    .contentImage
      max-height calc(100vh - 48px)
      box-shadow none
    .q-card
      max-height calc(100vh - 98px)
      max-width calc(100vw - 48px)
      position relative

      img
        max-height calc(100vh - 116px)
        max-width calc(90vw - 16px)

    .q-btn
      margin-right auto
      margin-left auto
</style>
