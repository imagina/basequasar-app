<template>
  <div id="selectMediaPage" class="q-pa-xl">
    <media-list embebed @data="selectImage"/>
  </div>
</template>
<script>
  //Components
  import mediaList from '@imagina/qmedia/_components/list'

  export default {
    props: {},
    components: {mediaList},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    computed: {},
    methods: {
      selectImage(file = false) {
        let CKEditorFuncNum = this.$route.query.CKEditorFuncNum
        window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, file.path);
        window.close()
      }
    }
  }
</script>
<style lang="stylus">
</style>
