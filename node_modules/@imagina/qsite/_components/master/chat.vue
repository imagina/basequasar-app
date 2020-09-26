<template>
  <div id="chatComponentMaster" class="q-pa-sm">
    <!--content chat-->
    <div :style="`height: ${height-66}px`" ref="chatContent" id="chatcontent">
      <q-infinite-scroll id="infinitiScrollChat" @load="getMessages" ref="infiniteScroll"
                         :scroll-target="$refs.chatContent" reverse>
        <!--Label date-->
        <q-chat-message v-if="comment.label" v-for="(comment, key) in messages"
                        :label="comment.label" :key="key" :class="`text-${colorsChat.name}`"/>
        <!--Chat message-->
        <q-chat-message v-else :name="comment.sent ? '' : comment.userName" :sent="comment.sent"
                        :text="comment.message" :stamp="comment.time"
                        :text-color="comment.textColor" :bg-color="comment.bgColor">
          <template slot="avatar">
            <avatar-image size="40px" class="q-mx-xs" :src="comment.userImage"/>
          </template>
        </q-chat-message>
        <!--Loading scroll-->
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px"/>
          </div>
        </template>
      </q-infinite-scroll>
    </div>

    <!--Input comment-->
    <div class="text-center q-mt-sm">
      <q-input outlined dense :label="`${$tr('ui.label.message')}...`" v-model="message" @keyup.enter="sendMessage()"
               rounded :color="colorsChat.input" :bg-color="colorsChat.bgInput" :label-color="colorsChat.labelInput"
               ref="inputComment">
        <template v-slot:after v-if="$q.platform.is.desktop">
          <q-btn round :color="colorsChat.buttonSend" dense flat icon="send" @click="sendMessage()"/>
        </template>
      </q-input>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      chatData: {
        default: () => {
          return {}
        }
      },
      height: {default: '300'},
      colors: {
        default: () => {
          return {}
        }
      }
    },
    components: {},
    watch: {
      chatData: {
        deep: true,
        handler: function (newValue) {
          this.init()
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        chatUid: this.$uid(),
        loading: false,
        messagesData: [],
        totalMessages: 0,
        message: null
      }
    },
    computed: {
      //Styles of chat
      colorsChat() {
        return {
          bgLeft: this.colors.bgLeft || 'teal',
          textLeft: this.colors.textLeft || 'white',
          bgRight: this.colors.bgRight || 'amber-7',
          textRight: this.colors.textRight || 'white',
          bgInput: this.colors.bgInput || 'grey-8',
          input: this.colors.input || 'white',
          labelInput: this.colors.labelInput || 'white',
          buttonSend: this.colors.buttonSend || 'grey-8',
          name: this.colors.name || 'grey',
        }
      },
      //comment Data
      messages() {
        let messages = this.$clone(this.messagesData)
        let user = this.$store.state.quserAuth.userData
        let response = []

        //Order comments
        messages.forEach(message => {
          let lastComment = (response.length) ? this.$clone(response[response.length - 1]) : {}

          //Add label date
          if (lastComment.date != this.$trd(message.createdAt)) {
            response.push({label: this.$trd(message.createdAt), message: []})
            lastComment.userId = 'fake'
          }

          //Add message to last comment if is same user
          if (lastComment.userId == message.user.id) {
            response[response.length - 1].message.push(message.comment)
            response[response.length - 1].time = this.$trd(message.createdAt, {type: 'time'})
          } else {//Add new comment
            response.push({
              userId: message.user.id,
              sent: message.user.id == user.id,
              message: [message.comment],
              userName: `<span class='text-${this.colorsChat.name}'>${message.user.firstName}</span>`,
              userImage: message.user.mainImage,
              date: this.$trd(message.createdAt),
              time: this.$trd(message.createdAt, {type: 'time'}),
              bgColor: (message.user.id == user.id) ? this.colorsChat.bgRight : this.colorsChat.bgLeft,
              textColor: (message.user.id == user.id) ? this.colorsChat.textRight : this.colorsChat.textLeft,
            })
          }
        })

        return response//Response
      },
      //User Data
      userData() {
        return this.$store.state.quserAuth.userData
      }
    },
    methods: {
      init() {
        //Init data
        this.messagesData = []
        this.totalMessages = 0
        this.message = null
        this.$refs.infiniteScroll.reset()
        this.$refs.infiniteScroll.resume()
        //Open channel to pusher
        this.watchChannel()
        //Set color label input
        setTimeout(() => {
          this.$refs.inputComment.$refs.input.style.color = this.colorsChat.labelInput
        }, 500)
      },
      //pusher event
      watchChannel() {
        //Close channel
        this.$notification.Echo.leave('global')
        //Open channel
        this.$notification.Echo.channel('global').listen(
          `.${this.chatData.commentableType}${this.chatData.commentableId}`,
          response => {
            //Add message
            if (parseInt(response.data.options.chatUid) != parseInt(this.chatUid))
              this.messagesData.push(response.data)
          })
      },
      //Get attendants of selected event
      getMessages(index, done) {
        let messagesData = this.$clone(this.messagesData)

        if ((index == 1) || messagesData.length < this.totalMessages) {
          //Request params
          let requestParams = {
            refresh: true,
            params: {filter: this.chatData, page: index, take: 10}
          }

          //Request
          this.$crud.index('apiRoutes.qsite.comments', requestParams).then(response => {
            this.messagesData.splice(0, 0, ...response.data.reverse())
            this.totalMessages = response.meta.page.total
            if (index == 1) this.chatToBotton()
            done()
          }).catch(error => this.$refs.infiniteScroll.stop())
        } else this.$refs.infiniteScroll.stop()
      },
      //Send message
      sendMessage() {
        this.$refs.inputComment.focus()//Re focus input
        if (this.message && this.message.length) {
          let messageData = {
            comment: this.message,
            options: {chatUid: this.chatUid},
            ...this.chatData
          }
          //Request
          this.$crud.create('apiRoutes.qsite.comments', messageData)
          //Set to list comments
          this.messagesData.push({
            userId: this.$store.state.quserAuth.userId,
            user: this.$store.state.quserAuth.userData,
            comment: this.message,
            createdAt: new Date()
          })
          this.message = ''//Clear input
          this.chatToBotton()//Set scroll to end
        }
      },
      chatToBotton() {
        setTimeout(() => {
          if (this.$refs.chatContent)
            this.$refs.chatContent.scrollTop = this.$clone(this.$refs.chatContent.scrollHeight)
        }, 200)
      }
    }
  }
</script>
<style lang="stylus">
  #chatComponentMaster
    background-color transparent

    #chatcontent
      overflow-y scroll

    .q-message
      .q-message-name
        max-width 100px
        text-overflow ellipsis
        white-space nowrap
        overflow hidden

      .q-message-text
        min-height 26px
        padding 5px

      .q-message-stamp
        margin-top 0
        font-size 10px
        letter-spacing initial
</style>
