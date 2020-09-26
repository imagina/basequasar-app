const moduleName = 'inotification';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

export default {
  urlBase : urlBase,
  version: moduleVersion,
  notifications : `${urlBase}/notifications`,
  notifications : `${urlBase}/providers`,
  rules : `${urlBase}/rules`,
  rulesConfig : `${urlBase}/rules/config`,
}
