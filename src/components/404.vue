<template>
  <div id="notFoundComponent" class="text-center">
    <p>
      <img src="~assets/sad.svg" style="width:30vw;max-width:150px;">
    </p>
    <p class="text-faded" v-html="label"></p>
    <q-btn
      color="primary"
      style="width:200px;"
      v-if="showButton"
      @click="$router.push({name: routeName})"
    >{{buttonLabel}}
    </q-btn>
  </div>
</template>

<script>
  export default {
    name: 'Error404',
    props: {
      showButton: {default: true},
      routeName: {default: 'app.home'},
      label: {default: 'Sorry, nothing here...<b>(404)</b>'},
      buttonLabel: {default: 'Go to Home'},
    },
  }
</script>

<style lang="stylus">
  @import "~variables";
  #notFoundComponent
    padding 160px 0 100px 0
</style>
