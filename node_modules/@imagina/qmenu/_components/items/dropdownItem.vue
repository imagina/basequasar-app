<template>
  <!-- Dropdwon Item Desktop -->
  <q-collapsible :label="item.title" v-if="$q.platform.is.desktop">
    <slot></slot>
  </q-collapsible>

  <!-- Dropdwon Item Mobile -->
  <q-collapsible :icon="item.icon ? item.icon : null"
                 v-else
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
</style>
