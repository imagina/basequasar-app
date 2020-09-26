<template>
  <div id="pageNotifications"
       class="q-layout-page row layout-padding q-container">

    <div class="text-title-border text-blue-9 col-xs-12 q-title text-right">
      <span>My notifications</span>
    </div>

    <div class="col-12 q-mt-lg q-box">
      <div class="full-width row relative-position">
        <!--Empty notifications-->
        <div class="full-width" v-if="!$store.state.notification.notifications.length">
          <!--<empty-component></empty-component>-->
        </div>

        <!--Notifications-->
        <q-scroll-area style="height: 470px; width: 100%" v-else>
          <q-list no-border separator class="full-width">
            <!-- collapsible to hide sub-level menu entries -->
            <q-collapsible :label="notification.user.fullName" :avatar="notification.user.mainimage"
                           :key="key" @click.native="updateNotification(notification,key)"
                           :class="!notification.viewedDate ? 'bg-blue-1' : ''"
                           :sublabel="$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'long', $q.i18n.lang)"
                           v-for="(notification,key) in $store.state.notification.notifications">
              <div class="q-subheading-1 mesageNotification bg-grey-2">
                <!--User notification-->
                <q-chip :avatar="notification.user.mainimage"
                        color="teal-2" text-color="dark" small>
                  {{notification.user.fullName}}
                </q-chip>

                <!--Message-->
                <div class="bg-white full-width q-pa-sm q-body-1 q-my-md">
                  <!--Message-->
                  <p>{{notification.message}}</p>
                  <!--Created At-->
                  <div class="q-caption text-grey-7">
                  <span>
                    {{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'short', $q.i18n.lang)}}
                  </span>
                    <span class="float-right">
                    {{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'time', $q.i18n.lang)}}
                  </span>
                  </div>
                </div>

                <!--Button URL-->
                <div class="text-center">
                  <q-btn v-if="notification.options.url" label="Go"
                         @click="goToNotificationURL(notification.options.url)"
                         color="secondary" icon="fas fa-globe">
                  </q-btn>
                </div>
              </div>
            </q-collapsible>
          </q-list>

          <div class="text-center q-py-md" v-if="$store.state.notification.page">
            <q-btn label="Show more" color="primary"
                   @click="getNotifications()" v-if="!loading">
            </q-btn>

            <q-spinner-dots color="primary" size="40" v-if="loading"/>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>
<script>
  import notificationService from '@imagina/qnotification/_services/notifications'

  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        page: 2,
        loading: false,
        notificationsRead: []
      }
    },
    methods: {
      //Get users with infinite scroll
      getNotifications() {
        this.loading = true
        //Request Notifications
        this.$store.dispatch('notification/GET_NOTIFICATIONS').then(response => {
          this.loading = false
        }).catch(error => {})
      },
      //Redirec to URL from notification
      goToNotificationURL(url) {
        /*if (url)
          if (!url.match(/^https?:\/\//i)) {
            url = 'http://' + url;
          }
        window.open(url, '_blank')*/
        document.location.href = url;
      },
      //Update viewed at from notification
      updateNotification(notification, key) {
        if (this.notificationsRead.indexOf(notification.id) < 0) {
          this.notificationsRead.push(notification.id)
          if (!notification.viewedDate) {
            this.$store.dispatch('notification/UPDATE_NOTIFICATION', {id: notification.id})
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
  #pageNotifications
    .q-list
      padding 0
    .q-collapsible-sub-item
      background white
      padding 8px 0 8px 35px
      .mesageNotification
        padding 15px
</style>
