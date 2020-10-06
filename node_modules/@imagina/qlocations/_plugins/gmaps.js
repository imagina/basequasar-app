import store from '../../../../src/store'

class Gmaps {

  constructor() {

  }
  initializeGoogleApi(apiKey){
    let autocompleteGoogle = document.querySelector("script[rel=apiGmaps]")
    if(!autocompleteGoogle)
      autocompleteGoogle= document.createElement('script')
    autocompleteGoogle.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key='+apiKey+'&libraries=drawing&extension=.js')
    autocompleteGoogle.setAttribute('rel', 'apiGmaps')
    document.head.appendChild(autocompleteGoogle)
  }
}

export default ({ app, router, Vue }) => {

}

const gmaps = new Gmaps();

export {gmaps};
