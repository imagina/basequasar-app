<template>
  <div id="emptyComponent" class="text-center">
    <p>
      <q-icon name="far fa-meh" color="grey-5" size="150px"></q-icon>
    </p>
    <p class="text-faded">Sorry, nothing here...</p>
    <q-btn
      color="primary"
      style="width:200px;"
      @click="$router.push({name: 'home'})"
    >Go to Home</q-btn>
  </div>
</template>

<script>
  export default {
    name: 'Error404'
  }
</script>

<style lang="stylus">
  @import "~variables";
  #emptyComponent
    padding 100px 0 100px 0
</style>
