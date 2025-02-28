import moment from 'moment';

//Instance the internalization
let internalization = null;

//Instance helper methods
const methods = {
  setI18n (value)
  {
    internalization = value;
  },
  trc (num, lang)
  {
    return internalization.global.n(num, 'currency', lang);
  },

  trn (num, type)
  {
    if (type === 'percent') num /= 100;
    return type ? internalization.global.n(num, type) : internalization.global.n(num, 'decimal');
  },

  tr (key, params = {})
  {
    return internalization.global.tc(key, 1, params);
  },

  trp (key, params = {})
  {
    return internalization.global.tc(key, 2, params);
  },

  trd (date, params = { type: 'short', fromUTC: false })
  {
    if (params.fromUTC)
    {
      date = moment(date).local().format('YYYY-MM-DD HH:mm:ss');
    }
    return internalization.global.d(moment(date, 'YYYY-MM-DD HH:mm:ss').toDate(), params.type);
  },
  trdT (date, format = 'MMMM, DD, YYYY HH:mm')
  {
    return moment(date).format(format);
  }
};

/**
 * Instance proxy, this proxy validate if i18n is initialiced, else
 * return a empty string to prevent errors
 */
const I18nProxy = new Proxy(methods, {
  get: function(target, prop)
  {
    if (prop != 'setI18n' && !internalization) return '';
    return target[prop];
  }
});

export default I18nProxy;

