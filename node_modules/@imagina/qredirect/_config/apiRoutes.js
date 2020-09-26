const moduleName = 'iredirect';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  redirects: `${urlBase}/redirects`,
}
