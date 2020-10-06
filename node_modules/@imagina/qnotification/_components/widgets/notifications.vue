<template>
  <div id="widget-notification">
    <div class="relative-position q-mr-md">
      <q-chip
        round
        text-color="black"
        color="white"
        floating>{{notifications.pagination.total}}</q-chip>
    </div>
    <q-btn-dropdown
      dense
      flat
      rounded
      class="q-mr-lg"
      icon="notifications">
      <q-infinite-scroll :handler="loadMore" style="min-height: 100px;">
        <q-list  class="q-pr-sm">
          <q-list-header>
            <q-item-main>
              <q-btn
                :to="{name: 'qnotification.admin.notifications.index'}"
                dense
                flat
                color="primary"
                :label="$tr('qnotification.layout.allNotifications')"
                class="full-width"/>
            </q-item-main>
          </q-list-header>
          <div v-if="notifications.data.length">
            <q-item
              v-for="(notification, index) in notifications.data"
              :key="index">
              <q-item-side
                color="info"
                :icon="notification.icon_class" />
              <q-item-main
                :label="notification.title"
                :sublabel="notification.message"/>
              <q-item-side
                right
                :stamp="notification.timeAgo" />
              <q-item-side right >
                <q-btn
                  inverted
                  color="primary"
                  outline
                  dense
                  flat
                  round
                  @click="$router.push({name: notification.link})"
                  size="10px"
                  icon="fas fa-external-link-alt"/>
              </q-item-side>
              <q-item-side right >
                <q-btn
                  inverted
                  color="primary"
                  outline
                  flat
                  dense
                  round
                  @click="updateNotification(notification)"
                  size="15px"
                  icon="far fa-times-circle"/>
              </q-item-side>
            </q-item>
          </div>
          <div v-else class="row justify-center">
            <q-item>
              <q-item-side></q-item-side>
              <q-item-main>
                {{$tr('qnotification.layout.thereAreNoNotifications')}}
              </q-item-main>
            </q-item>
          </div>
        </q-list>
        <div
          class="row justify-center"
          v-if="this.notifications.pagination.page < this.notifications.pagination.lastPage">
          <q-spinner-dots
            color="primary"
            slot="message"
            :size="40"/>
        </div>
      </q-infinite-scroll>
    </q-btn-dropdown>
  </div>
</template>

<script>
  import Echo from "laravel-echo";
  export default {
    data () {
      return {
        loading: false,
        showNotifications: false,
        notifications: {
          data: [],
          pagination:{
            page: 1,
            take: 10,
            total: 0,
            lastPage:0,
          }
        },
        permissionForNotification: false,
        echo: null,
        tweenedNumber: 0,
        focused: true,
      }
    },
    computed:{
      unreadNotifications (){
        return 0
      },
      focusWindow(){
        window.onfocus = function() {
          this.focused = true;
          console.log(this.focused)
        };
        window.onblur = function() {
          this.focused = false;
          console.log(this.focused)
        };
        return this.focused
      }
    },
    watch: {

    },
    created() {
      this.$nextTick(()=> {
        this.getNotifications()
        this.initPusher()
        this.checkPermissionForNotification()
      })
    },
    methods: {
      getNotifications(){
        this.loading = true
        let params ={
          params: {
            filter: {
              me: true,
              read: false,
            },
            page: this.notifications.pagination.page,
            take: this.notifications.pagination.take
          },
        }
        this.$crud.index('apiRoutes.qnotification.notifications', params)
          .then( response => {
            response.data.forEach( item => {
              this.notifications.data.push(item)
            })
            this.notifications.pagination.total = response.meta.page.total
            this.notifications.pagination.lastPage = response.meta.page.lastPage
            this.loading = false
          })
          .catch( error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
          })
      },
      updateNotification(notification){
        notification.isRead= true
        this.loading = true
        let params = {params: {}}
        this.$crud.update('apiRoutes.qnotification.notifications', notification.id, notification, params)
          .then( response => {

            let indexOfNotificationUpdated = this.notifications.data.indexOf( notification )
            this.notifications.data.splice( indexOfNotificationUpdated, 1 )

            this.notifications.pagination.total --
            this.loading = false
          })
          .catch( error => {
            console.warn(error)
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
            this.loading = false
          })
      },
      loadMore(index, done){
        if (this.notifications.pagination.page <= this.notifications.pagination.lastPage){
          setTimeout(() => {
            this.notifications.pagination.page ++
            this.getNotifications()
            done()
          }, 2500)
        }
      },
      initPusher(){
        this.echo = new Echo({
          broadcaster: env('BROADCAST_DRIVER', 'pusher'),
          key: env('PUSHER_APP_KEY'),
          cluster: env('PUSHER_APP_CLUSTER'),
          encrypted: env('PUSHER_APP_ENCRYPTED'),
        })
        this.echo.channel('imagina.notifications')
          .listen(`.notification.new`, data => {
            this.notifications.data.unshift(data)
            this.notifications.pagination.total ++
            this.showPushNotitication(data)
          })
          .listen(`.notification.new.${this.$store.state.quserAuth.userData.id}`, data => {
            this.notifications.data.unshift(data)
            this.notifications.pagination.total ++
            this.showPushNotitication(data)
          })
      },
      checkPermissionForNotification(){
        window.Notification.requestPermission().then( response => {
          if (response === 'granted'){
            this.permissionForNotification = true
          }
        }).catch(error => {})
      },
      showPushNotitication(data){
        if (this.permissionForNotification && this.focused){
          //console.warn(window.Notification)
          navigator.serviceWorker.ready.then( registration => {
            registration.showNotification(data.title, {
              body: data.message,
              icon: 'https://enred-group.imaginacolombia.com/themes/imagina2018/img/logo/logo.png',
              click_action: ''
            })
          }).catch(error => {})
        }
      },
    }
  }
</script>
