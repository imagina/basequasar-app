class Helper {
  constructor() {
  }

  //return timestamp in seconds unix
  timestamp(date = false) {
    if (!date) {
      date = new Date()
    }//Current date
    else {
      date = new Date(date)
    }
    return date.getTime()
  }

  //mask value with format phone US
  maskPhone(number) {
    if (number) {
      let value = this.getInt(number)
      let response = ''

      if (value) {
        value = value.toString()
        value.length >= 1 ? response += '(' : false
        response += value.substr(0, 3)
        value.length >= 4 ? response += ') ' : false
        response += value.substr(3, 3)
        value.length >= 7 ? response += '-' + value.substr(6, 4) : false
      } else {
        response = value ? value[0] : ''
      }

      return response
    } else {
      return number
    }
  }

  /*get only numbers from a string*/
  getInt(value) {
    let regex = /(\d+)/g
    let response = value.match(regex)
    response = response ? response.join('') : response

    return response
  }

  //Return alpanumeric and symbol (-)
  getSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  //Return range date
  rangeDate(type) {
    type ? true : type = 'today'

    let from = new Date() //Create object date
    let to = new Date() //Create object date
    switch (type) {
      case 'today':
        break
      case 'yesterday':
        from.setSeconds(-86400)
        to.setSeconds(-86400)
        break
      case 'tomorrow':
        from.setSeconds(86400)
        to.setSeconds(86400)
        break
      case 'currentMonth':
        from.setDate(1)
        to = new Date(to.getFullYear(), from.getMonth() + 1, 0)
        break
      case 'lastMonth':
        from = new Date(from.getFullYear(), from.getMonth() - 1, 1)
        to = new Date(to.getFullYear(), to.getMonth(), 0)
        break

    }

    return {
      from: from.getFullYear() + '/' + (from.getMonth() + 1) + '/' + from.getDate(),
      to: to.getFullYear() + '/' + (to.getMonth() + 1) + '/' + to.getDate(),
    }
  }

  //set names months in dom*/
  nameMonths() {
    var d = new Date()
    var mount = d.getMonth()
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return [
      {label: months[(mount != 0) ? (mount - 1) : 11], value: 'lastMonth'},
      {label: months[mount], value: 'currentMonth'},
      {label: 'Today', value: 'today'}
    ]
  }

  //load latitude and logitude
  async loadPosition() {
    try {
      const position = await this.getCurrentPosition()
      return position.coords
    } catch (error) {
    }
  }

  // get position of navigator
  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      navigator.permissions.query({'name': 'geolocation'})
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }

  //Convert fields to frontend
  convertToFrontField(fields = [], mergeFields = []) {
    let response = {}

    //Merge fields
    if (mergeFields.length) {
      mergeFields.forEach(mergeField => {
        //Search merge field name in fields

        var existField = false
        fields.forEach((field, index) => {
          if (field.name == mergeField.name) {
            existField = true
            if (mergeField.value) {
              fields[index] = mergeField
            } else {
              fields[index].id = mergeField.id
            }
          }
        })

        if (!existField) {
          fields.push(mergeField)
        }
      })
    }
    //Conver fields
    fields.forEach(field => {
      response[field.name] = field
    })
    return response
  }

  //Convert to backend fields
  convertToBackField(fields) {
    let response = []
    for (var field in fields) {
      response.push(fields[field])
    }
    return response
  }

  //Convert strings to snake_case
  convertStringToSnakeCase(string) {
    return string.replace(/[\w]([A-Z0-9])/g, function (m) {
      return m[0] + '_' + m[1]
    }).toLowerCase()
  }

  //Convert object keys to snake_case
  toSnakeCase(object) {
    //function recursive to loop all items from object
    let convertObject = (dataObject) => {
      let response = {}//Object to save fields vonverted
      //Loop all items for convert

      for (var item in dataObject) {

        let itemValue = dataObject[item]//Value from item
        if (item !== 'options'
          && item !== 'fields'
          && item !== 'settings'
          && item !== 'permissions') {
          //If value is object, also convert value
          if ((typeof itemValue === 'object' && itemValue !== null)) {
            itemValue = convertObject(dataObject[item])
          }
          //Add to response new Key with Value
          response[this.convertStringToSnakeCase(item)] = (itemValue !== undefined) ? itemValue : null
        } else {
          response[item] = itemValue
        }
      }
      return response
    }
    return convertObject(object)//Return response
  }

  checkPassword(password) {
    // Must be at least 8 characters and contain a at least 1 lowercase character, at least 1 uppercase character and a number.
    return password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
  }

  //redirect to google maps with encode address
  map(address) {
    if /* if we're on iOS, open in Apple Maps */
    ((navigator.platform.indexOf('iPhone') != -1) ||
      (navigator.platform.indexOf('iPod') != -1)) {
      window.open('maps://maps.google.com/maps?q=' + encodeURI(address))
    } else /* else use Google */{
      window.open('https://maps.google.com/maps?q=' + encodeURI(address))
    }
  }

  //Validate Format of email
  validateEmail(email) {
    var re = /\S+@\S+\.\S+/
    return re.test(email);
  }

  //Filter options to select
  filterOptions(val, options, permitValues) {
    if (val === '') return options
    let responseOptions = []//Response options
    //Filter
    for (let opt of options) {
      //Search in options
      if (JSON.stringify(opt).toLowerCase().indexOf(val.toLowerCase()) > -1)
        responseOptions.push(opt)
      //IF exist param permitvalues, compare if option exist
      else if (permitValues) {
        let optValue = opt.value.toString()//Parse value
        if (typeof (permitValues) == 'object') {
          permitValues.forEach(item => {
            if (item.toString() == optValue) responseOptions.push(opt)
          })
        } else if (permitValues.toString() == optValue) responseOptions.push(opt)
      }
    }
    //Response
    return responseOptions
  }

  //Open external URL
  openExternalURL(url, newWindow = true) {
    if (url.indexOf('http') == -1) url = `https://${url}`
    if (newWindow) window.open(url, '_blank')
    else window.open(url)
  }

  //Get locale from route name
  getLocaleRouteName(routeName = false) {
    let response = false//Default response
    let availablesLanguages = config('app.languages.availables') || []
    if (routeName) {
      let routeNameSegment = routeName.split('.')//Split route name
      let firstSegment = routeNameSegment[0]//Get first segment form route name
      //Validate if first segmente it's a locale and set as locale
      if (availablesLanguages.indexOf(firstSegment) != -1) response = firstSegment
    }
    return response//Response
  }

  //Get locale from route path
  getLocaleRoutePath(routePath = false) {
    let response = false//Default response
    let availablesLanguages = config('app.languages.availables') || []
    routePath = routePath.replace('#/', '')//Parse path
    if (routePath) {
      let routeNameSegment = routePath.split('/')//Split route name
      let firstSegment = routeNameSegment[0]//Get first segment form route name
      //Validate if first segmente it's a locale and set as locale
      if (availablesLanguages.indexOf(firstSegment) != -1) response = firstSegment
    }
    return response//Response
  }

  //Method to load google maps
  loadGoogleMaps(key) {
    let autocompleteGoogle = document.querySelector("script[rel=apiGmaps]")
    if (!autocompleteGoogle)
      autocompleteGoogle = document.createElement('script')
    autocompleteGoogle.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${key}&extension=.js&output=embed`)
    autocompleteGoogle.setAttribute('rel', 'apiGmaps')
    document.head.appendChild(autocompleteGoogle)
  }

  //validate rules
  validateRules(params = {}) {
    let response = true
    let rules = params.rules || []
    let value = params.value || false

    //Validate rules
    rules.forEach(rule => {
      if (typeof rule(value) == 'string') response = false
    })

    //Response
    return response
  }

  //Add history
  addHistory() {
    window.history.pushState("forward", null, "");
  }

  //Back history
  backHistory() {
    window.history.back()
  }
}

const helper = new Helper();

export default helper;

export {helper}
