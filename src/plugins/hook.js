import crud from 'modules/qcrud/_services/baseService'
import { helper } from 'src/plugins/utils'

export default class Hook {
  constructor(store) {
    this.store = store
  }

  //Return Autocomplete events
  getEventNames(params = {}) {
    //Default events
    let eventNames = {}

    //Generate events by entity Name
    if (params && params.entityName) {
      eventNames.isCreating = `${helper.toCapitalize(params.entityName)}IsCreating`
      eventNames.wasCreated = `${helper.toCapitalize(params.entityName)}WasCreated`
      eventNames.isUpdating = `${helper.toCapitalize(params.entityName)}IsUpdating`
      eventNames.wasUpdated = `${helper.toCapitalize(params.entityName)}WasUpdated`
      eventNames.wasDeleted = `${helper.toCapitalize(params.entityName)}WasDeleted`
    }

    //Response
    return eventNames
  }

  //Dispatch hook event
  dispatchEvent(eventName, params = {}) {
    return new Promise(async (resolve, reject) => {
      //Parse event Name
      eventName = this.getEventNames(params)[eventName] || eventName
      //Get event hook
      let eventHook = this.store.state.qsiteApp.hooks.filter(item => item.eventName == eventName)
      //Validate reuqest hook
      if (eventHook && eventHook.length) await crud.get(eventHook[0].endPoint)
      //resolve
      resolve(true)
    })
  }
}
