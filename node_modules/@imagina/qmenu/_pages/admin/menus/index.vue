<template>
  <div id="pageId" class="q-layout-page layout-padding">
    <!---Component CRUD-->
    <crud :crud-data="import('@imagina/qmenu/_crud/menus')"/>
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
