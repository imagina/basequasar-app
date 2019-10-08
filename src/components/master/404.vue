<template>
  <div id="notFoundComponent" class="text-center">
    <p>
      <img src="~assets/sad.svg" style="width:30vw;max-width:150px;">
    </p>
    <p class="text-faded" v-html="message"></p>
    <q-btn
      color="primary"
      style="width:200px;"
      v-if="showButton"
      @click="$router.push({name: routeName})"
    >{{messageButton}}
    </q-btn>
  </div>
</template>

<script>
  export default {
    name: 'Error404',
    props: {
      showButton: {default: true},
      routeName: {default: 'app.home'},
      label: {default: false},
      buttonLabel: {default: 'Go to Home'},
    },
    computed : {
      message(){
        return this.label || `${this.$tr('ui.message.notFound')}... <b>404</b>`
      },
      messageButton(){
        return this.buttonLabel || this.$tr('ui.message.goToHome')
      }
    }
  }
</script>

<style lang="stylus">
  #notFoundComponent
    padding 160px 0 100px 0
</style>
