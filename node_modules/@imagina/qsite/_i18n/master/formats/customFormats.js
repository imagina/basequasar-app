export default // Custom Formatter implementation
class CustomFormatter {
  constructor() {
  }

  //Interpolation formats
  interpolate(message, values) {
    //Replace keys
    if (values) {
      Object.keys(values).forEach(key => {
        if (message.indexOf(`{${key}}`) != -1)
          message = message.replace(`{${key}}`, values[key])
      })
    }

    //Convert to upper case string
    if (values && values.upperCase) {
      let strings = message.split(' | ')//split all words
      strings.forEach((word, index) => {
        strings[index] = word.toUpperCase()
      })
      message = strings.join(' | ')//Join
    }
    //Convert to capitalize string
    if (values && values.capitalize) {
      let strings = message.split(' | ')//split all words
      strings.forEach((word, index) => {
        strings[index] = word.charAt(0).toUpperCase() + word.slice(1);
      })
      message = strings.join(' | ')//Join
    }

    return [message]//Return message
  }
}
