<template>
  <div id="ckEditorComponent">
    <ck-editor v-if="true" v-model="responseValue" :config="configEditor"/>
  </div>
</template>
<script>
  //Components
  import CKEditor from 'ckeditor4-vue';

  export default {
    props: {
      value: {default: ''}
    },
    components: {ckEditor: CKEditor.component},
    watch: {
      value(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue))
          this.responseValue = this.$clone(newValue)
      },
      responseValue(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue))
          this.$emit('input', this.$clone(newValue))

      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        responseValue: '',
        configEditor: {
          allowebContent : true,
          filebrowserBrowseUrl: this.$router.resolve({name: 'app.media.select'}).href,
          extraPlugins: 'embed,autoembed,colorbutton,colordialog',
          embed_provider: '//iframe.ly/api/oembed?url={url}&callback={callback}&api_key=7e0aa12b0cd2c01651346b',
        }
      }
    },
    computed: {},
    methods: {
      init() {
        this.responseValue = this.$clone(this.value)
      }
    }
  }
</script>
<style lang="stylus">
</style>
