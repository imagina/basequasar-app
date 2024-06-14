importScripts('https://js.pusher.com/7.0/pusher.worker.min.js');

let pusher = null;
let channel = null;

self.addEventListener('message', event => {
  const {type, data} = event.data;
  //initializePusher
  if (type === 'initializePusher') initializePusher(data);
  //eventBindingChanged
  if (type === 'eventBindingChanged') bindEvent(data.eventName)
});

// Function to initialize Pusher and subscribe to the channel
function initializePusher(params) {
  //disconnect current pusher
  if (pusher) pusher.disconnect();
  //Init new pusher
  pusher = new Pusher(params.pusherAppKey, {
    cluster: params.pusherAppCluster,
    encrypted: params.pusherAppEncrypted
  });
  //Instance the channel and event
  channel = pusher.subscribe(params.channelName);
  bindEvent(params.eventName)
}

function bindEvent(eventName) {
  if (channel) {
    unbindEvent()
    channel.bind(eventName, function (params) {
      self.registration.showNotification(params.title, {
        body: params.message || params.body,
        icon: params.icon,
        data: params || {}
      });
    });
  }
}

// Unbind current event
function unbindEvent() {
  if (channel) channel.unbind();
}
