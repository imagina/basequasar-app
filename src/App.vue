<template>
  <router-view />
</template>

<script>
import eventBus from '@imagina/qsite/_plugins/eventBus'

export default {
  name: 'App',
  beforeDestroy() {
    eventBus.off('service-worker.update.available')
  },
  created() {
    this.$nextTick(async function () {
      //Manage badges to button actions
      eventBus.on('service-worker.update.available', () => {
        this.$alert.info({
          message: this.$tr('isite.cms.message.swUpdateAvailable'),
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
