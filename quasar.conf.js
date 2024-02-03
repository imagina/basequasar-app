// Configuration for your app
var webpack = require('webpack')
var path = require('path')
const nodeExternals = require('webpack-node-externals')

// Get our env variables
const envparser = require('./env/envparser')
const { configure } = require('quasar/wrappers');

module.exports =  configure(function (ctx) {
  return {
    supportTS: true,
    preFetch: true,
    boot: [//Keep this order
      //==== Core [Do not remove]
      '~@imagina/qsite/_boot/core-axios',
      '~@imagina/qsite/_boot/core-server-side',
      { server: false, path: '~@imagina/qsite/_boot/core-middleware' },
      '~@imagina/qsite/_boot/core-helper',
      '~@imagina/qsite/_boot/core-i18n',
      { server: false, path: '~@imagina/qsite/_boot/core-client-side' },
      { server: false, path: '~@imagina/qsite/_boot/core-components-client-side' },
      '~@imagina/qsite/_boot/core-components',
      //==== boot from project
      'server-side',
      { server: false, path: 'client-side' },
    ],
    css: [
      'app.sass'
    ],
    extras: [
      'fontawesome-v5',
      'material-icons',
    ],
    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language
      all: true, // --- includes everything; for dev only!
      config: {
        loadingBar : {
          skipHijack : true
        }
      }
    },
    supportIE: false,
    build: {
      scopeHoisting: true,
      env: envparser(),
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        // Make our helper function Global, for example to use it in js files you should call it env('MY_VALUE')
        cfg.plugins.push(
          new webpack.ProvidePlugin({
            env: [path.resolve(__dirname, 'env/env'), 'default'],
            config: [path.resolve(__dirname, 'node_modules/@imagina/qsite/_config/master/index'), 'default']
          })
        )
      },
      chainWebpack (chain, { isServer, isClient }) {
        if (isServer) {
          chain.externals(nodeExternals({
            // do not externalize CSS files in case we need to import it from a dep
            whitelist: /(\.css$|\.vue$|\.ts|\?vue&type=style|@imagina|@quasar|quasar[\\/])/
          }))
        }
      }
    },
    devServer: {
      //https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // animations: 'all', // --- includes all animations
    animations: [],
    ssr: {
      pwa: true
    },
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        name: 'My APP',
        short_name: 'My APP',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        serviceWorker: {
          src: "service-worker.js",
          scope: "/",
          use_cache: true,
          skipWaiting: true,
          debug: false
        },
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ],
        "prefer_related_applications": true,
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },
    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'front-end-v1'
      }
    }
  }
})
