//Watch documentation of params to format currency "JS" here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
//Watch currency types here: https://www.techonthenet.com/js/currency_codes.php

export default {
  'en-us': {
    currency: {
      style: 'currency',
      currency: 'USD'
    }
  },
  'es': {
    currency: {
      style: 'currency',
      currency: 'USD' //To show symbol "$". COP show as symbol "COP"
    },
  }
}
