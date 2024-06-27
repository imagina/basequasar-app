import crud from 'modules/qcrud/_services/baseService'
import notificationPlugin from 'modules/qnotification/_plugins/notification'
import {tour} from 'modules/qgamification/_plugins/tour'
import apiResponse from 'modules/qcrud/_plugins/apiResponse'
import utils from 'src/plugins/utils.ts'

export default function ({app, router, store, Vue, ssrContext}) {
  app.config.globalProperties.$alert = utils.alert
  app.config.globalProperties.$array = utils.array
  app.config.globalProperties.$date = utils.date
  app.config.globalProperties.$helper = utils.helper
  app.config.globalProperties.$cache = utils.cache
  app.config.globalProperties.$lodash = utils.lodash
  app.config.globalProperties.$remember = utils.remember
  app.config.globalProperties.$tour = tour
  app.config.globalProperties.$hook = new utils.hook(store)
  app.config.globalProperties.$notification = new notificationPlugin(store)
  app.config.globalProperties.$clone = utils.clone
  app.config.globalProperties.$crud = crud
  app.config.globalProperties.$openUrl = utils.openURL
  app.config.globalProperties.$eventBus = utils.eventBus
  app.config.globalProperties.$filter = utils.filter
  app.config.globalProperties.$uid = utils.uid
  app.config.globalProperties.$apiResponse = apiResponse
  app.config.globalProperties.$moment = utils.moment

  //Set as global the store helper methods
  Object.keys(utils.store).forEach(methodName => {
    app.config.globalProperties[`$${methodName}`] = utils.store[methodName];
  });
}
