import { cache } from "src/plugins/utils";
import clone from 'lodash.clonedeep'

class Filter {
  constructor() {
    this.storeFilter = false;
    this.filters = []
    this.reset()
  }

  //Set filters in class
  setFilters(filters) {
    this.filters = filters || {}
  }

  //Reset filter
  reset() {
    this.cacheName = 'app.data.filters'
    this.name = false
    this.fields = {}
    this.values = {}
    this.callBack = false
    this.pagination = {}
    this.load = false
    this.hasValues = false
    this.storeFilter = false;
  }

  //Load filter
  setFilter(params = {}) {
    return new Promise(async (resolve, reject) => {
      this.storeFilter = params.storeFilter ? params.storeFilter : false;
      this.setfilterByName(params.name)//load filter by name
      this.addFields(params.fields)//Add fields
      this.setCallBack(params.callBack)//set callBack
      await this.restoreValuesFromCache()//Restore data filter from cache
      await this.setPagination()//Set pagination
      await this.validateIfLoadFilter()//Validate if load filter
      resolve(true)//Response
    })
  }

  //Set filter by name
  setfilterByName(name) {
    if (name) {
      this.name = name//Set name filter
      let filterData = this.filters[name] || false//Get filter data

      if (filterData) {
        this.setFields(filterData)//Set fields
        this.setFieldValues()//Set values
      }
    }
  }

  //Set fields
  setFields(fields) {
    if (fields && Object.keys(fields).length)
      this.fields = clone(fields)
  }

  //Add fields
  addFields(fields) {
    if (fields && Object.keys(fields).length) {
      this.fields = clone({...this.fields, ...fields})
      this.setFieldValues()
    }
  }

  //Set values to filter
  setValues(values) {
    //values temporary
    let tmpValues = {}

    //filter only values distinc of null an undefined
    if (values && Object.keys(values).length) {
      for (var itemName in values) {
        let itemValue = values[itemName]
        if ((itemValue !== null) && (itemValue !== undefined)) tmpValues[itemName] = itemValue
      }
    }

    this.values = clone(tmpValues)// Set values
    this.cacheValuesFilter()//Cache data
    this.validateHasValues()//Validate if has selected values
  }

  //add values to filter
  addValues(values) {
    if (values && Object.keys(values).length) {
      this.setValues({...this.values, ...values})//Merge values
    }
  }

  //Set default values of fields
  setFieldValues() {
    let values = {}//Default values

    //parse fields to set defautl values
    for (var name in this.fields) {
      let field = this.fields[name]//Get field data
      //case values by name
      switch (name) {
        case'date':
          values[name] = {
            field: field.field ? field.field.value || null : null,
            type: field.type || null,
            from: field.from || null,
            to: field.to || null
          }
          break;
        case'pagination':
          break;
        default:
          values[name] = field.value
          break;
      }
    }

    this.setValues(values)//Set values
  }

  //Set Call Back
  setCallBack(callBack) {
    if (callBack) this.callBack = callBack
  }

  //Save data filter in cache
  cacheValuesFilter() {
    return new Promise(async (resolve, reject) => {
      // Update data filter in cache
      if (this.name) {
        let filters = await cache.get.item(this.cacheName) || {}
        filters[this.name] = {...(filters[this.name] || {}), values: this.values}
        //await cache.set(this.cacheName, filters)
      }
      //Response
      resolve(true)
    })
  }

  //Search data filter in cache
  restoreValuesFromCache() {
    return new Promise(async (resolve, reject) => {
      // Search and set data filter in cache
      if (this.name) {
        let filters = await cache.get.item(this.cacheName) || {}
        let values = filters[this.name] ? filters[this.name].values : {}
        this.addValues(values)
      }
      //Response
      resolve(true)
    })
  }

  //Set pagination
  setPagination(params = {}) {
    return new Promise(async resolve => {
      let field = this.fields['pagination'] || {} //Get field pagination
      //Get filter from cache
      let filters = await cache.get.item(this.cacheName) || {}
      let filter = filters[this.name] || {}

      //Merge priority pagination
      let paginationData = {
        ...(field || {}),
        ...(filter.pagination || {}),
        ...(params || {})
      }

      //Set Filter
      this.pagination = {
        page: paginationData.page || 1,
        rowsPerPage: paginationData.rowsPerPage || 10,
        lastPage: paginationData.lastPage || 1
      }

      //Save in cache
      filters[this.name] = {...(filters[this.name] || {}), pagination: this.pagination}
      //cache.set(this.cacheName, filters)

      //Response
      resolve(true)
    })
  }

  //Validate if load Filter
  validateIfLoadFilter() {
    if (this.fields && Object.keys(this.fields).length) {
      this.load = true
    }
  }

  //Validate if filter has selected values
  validateHasValues() {
    this.hasValues = false

    for (var nameValue in this.values) {
      let value = this.values[nameValue]//Get value
      //Validate if value is array
      if (Array.isArray(value)) {
        if (value.length) this.hasValues = true
      }
      //Validate if value is Object
      else if (value && Object.is(value)) {
        if (Object.keys(value).length) this.hasValues = true
      }
      //Validate value
      else if ((value !== undefined) && (value !== null) && (value !== false)) {
        this.hasValues = true
      }
    }
  }
  // returns a new intance with custom cache name
  getInstance(cacheName = false){
    const filter = new Filter()
    if(cacheName){
      filter.cacheName = `${filter.cacheName}__${cacheName}`
    }
    return filter
  }
}

//Define new class
const filter = new Filter()
//export class
export default filter
