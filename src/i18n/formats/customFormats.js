export default // Custom Formatter implementation
class CustomFormatter {
  constructor() {
  }

  //Interpolation formats
  interpolate(message, values) {
    let strings = message.split(' | ')//split all words

    //Convert to upper case string
    if (values && values.upperCase) {
      strings.forEach((word, index) => {
        strings[index] = word.toUpperCase()
      })
    }
    //Convert to capitalize string
    if (values && values.capitalize) {
      strings.forEach((word, index) => {
        strings[index] = word.charAt(0).toUpperCase() + word.slice(1);
      })
    }

    return [strings.join(' | ')]//Return message
  }
}
