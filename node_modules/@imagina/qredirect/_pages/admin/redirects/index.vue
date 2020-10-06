<template>
  <div id="pageId">
    <!---Component CRUD-->
    <crud :crud-data="import('@imagina/qredirect/_crud/redirects')"/>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {},
    validations() {
      return {}
    },
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>
<style lang="stylus">
</style>
