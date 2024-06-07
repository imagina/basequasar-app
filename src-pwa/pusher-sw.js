importScripts('https://js.pusher.com/7.0/pusher.worker.min.js');

let pusher = null;
let channel = null;
let eventBinding = null;

self.addEventListener('message', event => {
  const { type, payload } = event.data;
  if (type === 'eventBindingChanged') {
    eventBinding = payload.eventName;
    if (channel) {
      channel.unbind(); // Unbind current event
      channel.bind(eventBinding, function(data) {
        self.registration.showNotification('New Message', {
          body: data.message,
        });
      });
    }
  }
});

// Function to initialize Pusher and subscribe to the channel
function initializePusher(authUserId) {
  if (pusher) {
    pusher.disconnect();
  }
  pusher = new Pusher('YOUR_APP_KEY', {
    cluster: 'YOUR_APP_CLUSTER',
    // Add any other options you need
  });
  const channelName = `notification.new.${authUserId}`;
  channel = pusher.subscribe(channelName);
  channel.bind(eventBinding, function(data) {
    self.registration.showNotification('New Message', {
      body: data.message,
    });
  });
}

// Export initializePusher function to be used in custom-service-worker.js
self.initializePusher = initializePusher;
