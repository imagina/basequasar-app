export default function (key, fallback) {
  let value = process.env[key]
  //If not found base url, do dynamic url
  if ((key == 'BASE_URL') && !value){
    let domain = window.location.host.split('.')
    if(domain[0] == 'www') domain[0] = 'backend'
    else domain.unshift('backend')
    value = 'https://'+domain.join('.')
  }
  if (!value) return fallback//Check if must return fallback
  return value.replace(/["]/g, '')
}