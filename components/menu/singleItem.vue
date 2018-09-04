<template>
  <!-- Single Item -->
  <q-item link :to="{name : item.to}" v-if="item">
    <q-item-side v-if="item.icon" :icon="item.icon"/>
    <q-item-main>{{item.title}}</q-item-main>
  </q-item>
</template>
<script>
  export default {
    props: {
      item: {default: false}
    },
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
