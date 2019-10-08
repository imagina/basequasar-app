<template>
  <div id="notResult" class="text-center">
    <q-icon name="fas fa-search-minus" color="grey-5" size="20px"/>
    {{$tr('ui.message.searchNotFound')}}...
  </div>
</template>

<script>
  export default {
    name: 'notResult'
  }
</script>

<style lang="stylus">
</style>
