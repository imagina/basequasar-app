<template>
  <!-- HEADER -->
  <q-header id="masterHeader">
    <q-toolbar color="primary">
      <!--= TITLE =-->
      <q-toolbar-title class="items-center">
        <div class="q-pl-xs">
          <q-icon :name="$route.meta.icon"/>
          {{$tr($route.meta.headerTitle || $route.meta.title)}}
        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>
<style lang="stylus">
</style>
