let store = null;

const methods = {
  setStore (value)
  {
    store = value;
  },
  hasAccess (can: string, params?: any)
  {
    return store.getters['quserAuth/hasAccess'](can, params);
  },
  hasSetting (name: string)
  {
    return store.getters['quserAuth/hasSetting'](name);
  },
  getSetting (name: string)
  {
    return store.getters['qsiteApp/getSettingValueByName'](name);
  },
  getMediaSetting (name: string)
  {
    return store.getters['qsiteApp/getSettingMediaByName'](name);
  }
};

/**
 * Instance proxy, this proxy validate if store is initialiced, else
 * return a empty string to prevent errors
 */
const storeProxy = new Proxy(methods, {
  get: function(target, prop: string)
  {
    if ((prop != 'setStore') && !store) return '';
    if (Object.keys(target).includes(prop)) return target[prop];
    return store[prop];
  }
});
export default storeProxy;

