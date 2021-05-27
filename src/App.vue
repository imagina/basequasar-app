<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeDestroy() {
    this.$eventBus.$off('service-worker.update.available')
  },
  created() {
    this.$nextTick(async function () {
      //Manage badges to button actions
      this.$eventBus.$on('service-worker.update.available', () => {
        this.$alert.info({
          message: this.$tr('ui.message.swUpdateAvailable'),
          pos: 'top',
          icon: 'fas fa-cloud-download-alt',
          timeOut: 15000,
          actions: [
            {
              label: 'Ok',
              icon: '',
              color: 'white',
              handler: () => window.location.reload(true)
            }
          ],
        })
      })
    })
  }
}
</script>

<style>
</style>
