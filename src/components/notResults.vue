<template>
  <div id="notResultsComponent" class="text-center">
    <h4 class="q-ma-none text-dark">
      Ups!
      <q-icon name="far fa-meh" color="secondary"></q-icon>
    </h4>
    <p class="text-faded">
      No Se encontrarón resultados
    </p>
    <q-btn
      color="primary"
      icon-right="fas fa-home"
      style="width:200px;"
      label="Regresar"
      @click="$router.push({name: 'home'})">
    </q-btn>
  </div>
</template>

<script>
  export default {
    name: 'Error404'
  }
</script>

<style lang="stylus">
  @import "~variables";
  #notResultsComponent
    padding 100px 0
</style>
