//Watch documentation of formats type here: http://www.ecma-international.org/ecma-402/2.0/#sec-intl-datetimeformat-constructor

export default {
  'en-us': {
    day: {weekday: 'long',},
    month: {month: 'long'},
    year: {year: 'numeric'},
    short: {
      year: 'numeric', month: 'long', day: '2-digit'
    },
    long: {
      year: 'numeric', month: 'long', day: '2-digit',
      hour: 'numeric', minute: 'numeric', hour12: true
    },
    time: {
      hour: '2-digit', minute: 'numeric', hour12: true
    }
  },
  'es': {
    day: {weekday: 'long',},
    month: {month: 'long'},
    year: {year: 'numeric'},
    short: {
      year: 'numeric', month: 'long', day: '2-digit'
    },
    long: {
      year: 'numeric', month: 'long', day: '2-digit',
      hour: 'numeric', minute: 'numeric', hour12: true
    },
    time: {
      hour: '2-digit', minute: 'numeric', hour12: true
    }
  },
}
