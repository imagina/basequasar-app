<template>
  <div id="notResult" :class="`text-center text-${color}`">
    <q-icon name="fas fa-search-minus" :color="color" size="20px" class="q-mr-sm"/>
    <label v-html="label || $tr('ui.message.searchNotFound')"></label>
  </div>
</template>

<script>
  export default {
    name: 'notResult',
    props: {
      label: {default: false},
      color : {default : 'grey-6'}
    }
  }
</script>

<style lang="stylus">
</style>
