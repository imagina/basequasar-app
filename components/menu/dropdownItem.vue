<template>
  <!-- Dropdwon Item -->
  <q-collapsible :icon="item.icon ? item.icon : ''"
                 :label="item.title">
    <slot></slot>
  </q-collapsible>
</template>
<script>
  export default {
    props: {
      item : {default :false}
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
