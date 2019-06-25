<template>
  <div id="commentsFacebook" class="full-width" v-if="url">
    <div class="fb-comments"
         :data-href="url"
         data-width="100%"
         :data-mobile="false"
         data-numposts="5">
    </div>

    <div id="fb-root"></div>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {
      url(){
        setTimeout(() => {
          //refresh Comments
          window.FB.XFBML.parse()
        }, 0)
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getUrl()
      })
    },
    data() {
      return {
        url : false
      }
    },
    methods: {
      //generate url for plugin comments
      getUrl() {
        this.url =  window.location.href
      }
    }

  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
