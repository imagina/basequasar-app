<template>
  <div>
  <q-btn round dense flat icon="fas fa-bell"  @click="showNotifications">
    <q-chip floating color="red" v-if="this.$store.state.notification.news">{{this.$store.state.notification.news }}</q-chip>
  </q-btn>

  <q-modal
    v-model="opened"
    position="top">
    <q-list highlight inset-separator>
      <q-item-main>
        <div class="q-heading q-pa-sm">{{'Notifications: '+this.$store.state.notification.total}}</div>
      </q-item-main>
      <q-item v-for="(notification,index) in this.$store.state.notification.notifications" :key="index">
        <q-item-side :avatar="notification.from == 'me' ? 'statics/icons/icon-128x128.png' : notification.avatar" />
        <q-item-main :label="notification.message" label-lines="1" />

          <q-item-side right>

            <q-item-tile stamp>
              <q-btn
                v-if="notification.type == 'requestFailed'"
                @click="goToRoute(notification)"
                flat
                color="primary"
                icon="fas fa-wrench">

            </q-btn>
              1 week ago
            </q-item-tile>

          </q-item-side>

      </q-item>

    </q-list>
    <q-btn
      color="primary"
      @click="opened = false"
      label="Close"
    />
  </q-modal>
  </div>
</template>
<script>
  import {alert} from '@imagina/qsite/_plugins/alert';
  import {helper} from '@imagina/qsite/_plugins/helper';

  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.getNotifications();
      })
    },
    data() {
      return {
        opened: false
      }
    },
    methods: {
      async getNotifications(){
        let notifications = await helper.storage.get.item("notifications") || [];
        this.$store.dispatch('notification/PUSH_NOTIFICATION',notifications);
      },
      showNotifications(){
        this.opened = true;
        this.$store.dispatch("notification/FLUSH_NEWS");
      },
      goToRoute(notification){
        this.$router.push({name:notification.data.frontUrl,query:notification.data.request.data})
      }
    }

  }
</script>
<style lang="stylus">
</style>
