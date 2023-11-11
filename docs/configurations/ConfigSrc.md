# Directory src
This is the project main directory, where load all CMS attributes, and you can do changes to `base-quasar` to project if is necessary. **The structure and configuration defined on this directory dependent of [qsite](/docs/VueJs/modules/Qsite) module.**

## Boot
This folder content two files `client-side` and `server-side` that work as `boot` files according to `Quasar` [documentation](https://quasar.dev/quasar-cli/boot-files#introduction).

## Config
The config files here, works as a `interceptors` of all config defined in `qsite` module. 
- **apiRoutes**: Manage the configuration to load all apiRoutes, the information are in `coreApiRoutes` variable from `qsite` module.
- **app**: Manage all available configurations to the project, all default configuration are in `coreApp` variable  from `qsite` module.
- **pages**: Manage the configuration to load all vue routes, the information are in `corePages` variable  from `qsite` module.
- **sidebar**: Manage the configuration to load the sidebar from each module. the information are in two variables `coreSidebar` and `customSidebar` both has the same information but with different structure.

## CSS
Contains the global styles files `app.styl` and `quasar.variables.styl` also both include respective styles files from `qsite`.

## Modules
This folder contains the default module `app` and is the place where should by created new custom modules.
:::caution
Any module named the same way like a module from `@imagina` instance on this directory, will overwrite everything related to this module.
:::

## Router
The index file create and load all [vue-routes](https://router.vuejs.org/) from each module, defined in `config.app`.

## Store
The index file create and load all [vue-stores](https://vuex.vuejs.org/) from each module, defined in `config.stores`.

## App.vue
This is the main vue file, here there is a listener to event `service-worker.update.available` that show an alert when detect changes on service worker and force to reload APP.