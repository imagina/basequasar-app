const moduleName = 'iplaces';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  categories: `${urlBase}/categories`,
  places: `${urlBase}/places`,
  schedules: `${urlBase}/schedules`,
}
