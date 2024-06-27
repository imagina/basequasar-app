let router = null

const methods = {
  setRouter (value: any)
  {
    router = value;
  },
  get router() {
    return router
  },
  get route() {
    return router?.currentRoute?.value || {}
  }
};

/**
 * Instance proxy, this proxy validate if router is initialized, else
 * return a empty object to prevent errors
 */
const routerProxy = new Proxy(methods, {
  get: (target, prop: string) => {
    if ((prop != 'setRouter') && !router) return {};
    if (Object.keys(target).includes(prop)) return target[prop];
    return router[prop];
  }
});
export default routerProxy;

