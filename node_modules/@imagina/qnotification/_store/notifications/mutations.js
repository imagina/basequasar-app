// ADD DATA TO STATE NOTIFICATIONS
export const PUSH_NOTIFICATIONS = (state, payload) => {
  state.notifications = payload.data
  state.total = payload.meta.page.total
  state.page = payload.meta.page.currentPage
  state.take = payload.meta.page.perPage
};

// ADD NEW NOTIFICATION
export const PUSH_NOTIFICATION = (state, payload) => {
  let ifNotificationExist = state.notifications.find(notification => notification.id == payload.id)
  if (!ifNotificationExist) {
    state.notifications.unshift(payload)
  }
}

// CHANGE STATUS VIEWED TO NOTIFICATION
export const UPDATE_NOTIFICATION = (state, data) => {
  for (var index in state.notifications) {
    let item = state.notifications[index]
    if (item.id == data.id) {
      state.notifications[index] = data
      break;
    }
  }
}

//Refresh notifications
export const REFRESH_NOTIFICATIONS = (state) => {
  let notifications = state.notifications
  state.notifications = []
  state.notifications = notifications
}

//Refresh notifications
export const RESET = (state) => {
  state.notifications = []
  state.total = 0
  state.news = 0
  state.page = 1
}
