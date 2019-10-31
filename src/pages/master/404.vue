<template>
  <div class="fixed-center text-center">
    <img src="~assets/sad.svg" style="width:30vw;max-width:150px;">
    <p class="text-faded">{{$tr('ui.message.notFound')}}...<strong>(404)</strong></p>
    <q-btn color="grey-10" style="width:200px;" @click="$router.push({name : 'app.home'})"
           :label="$tr('ui.message.goToHome')"/>
  </div>
</template>

<script>
  export default {
    name: 'Error404'
  }
</script>
