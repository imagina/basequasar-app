# Installation

Clone the project.
```bash
  git clone https://github.com/imagina/basequasar-app.git
```

:::danger Prerequisites

To run the project, make sure you are using the following versions:

- Node 12.13.0
- NPM 6.13.0
- quasar/cli 1.3.2  (`npm install -g @quasar/cli@1.3.2`) 
:::


Install npm dependencies.
```bash
  npm install
```
:::caution 
Whenever `npm install` or update package it’s possible lost the `sub-modules` reference in folder `node-modules/@imagina` this can remove also the code changes, so if you need install a new package, before yo should do a backup of your local changes manually or doing a commit (no use stash also can be remove). 

To restore the reference as `sub-modules` do this:
1. Delete the folder `node-modules/@imagina`
2. Revert all local git change  `git checkout .`
3. Pull all project from the repository
4. Finally do the next step…
:::

Initialize github `submodules`. this will clone all repositories into `node-modules/@imagina`

````bash
git submodule update --init --recursive
````

Before, run this line to switch the submodules
```bash
git submodule foreach --recursive git checkout staging
```

## Configuration
The available configurations are in `src/config/app`.
- Base url: Define your base url
- Mode: Define load app mode (iadmin or ipanel).
```js
export default {
  baseUrl: 'https://example.com', //Define base url
  mode: 'ipanel', //Define load mode
  // Rest of object
}
```

## Build
To build as developer

````bash
quasar dev
````
To build as production (compile)
:::caution
Remember to comment the variables baseUrl and mode in src/config/app before you compile
:::
````bash
quasr build -m pwa
````

## Issues
- Template compiler: The package `vue` and `vue-template-compiler` should be in the same version, this is a requirement to `vue-cli`.