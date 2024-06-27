import alert from './alert.js';
import array from './array.js';
import date from './date.js';
import helper from './helper.js';
import cache from './cache.js';
import { remember } from './remember.js';
import hook from './hook.js';
import eventBus from './eventBus.js';
import filter from './filter.js';
import cacheOffline from './cacheOffline.js';
import lodash from 'lodash';
import moment from 'moment';
import { uid } from 'quasar';
import { openURL } from 'quasar';
import i18n from './i18n';
import store from './store';
import router from './router'

const clone = <T>(dataToClone: T): T => {
  return lodash.cloneDeepWith(dataToClone, (value: any) => {
    //Not clone File or Blob  type
    // @ts-ignore
    if (value instanceof File || value instanceof Blob || typeof value == 'function') {
      return value
    }
  })
}

export default {
  alert,
  array,
  date,
  helper,
  cache,
  remember,
  hook,
  eventBus,
  filter,
  cacheOffline,
  lodash,
  moment,
  uid,
  openURL,
  i18n,
  store,
  router,
  clone
};

export {
  alert,
  array,
  date,
  helper,
  cache,
  remember,
  hook,
  eventBus,
  filter,
  cacheOffline,
  lodash,
  moment,
  uid,
  openURL,
  i18n,
  store,
  router,
  clone
};
