/**
 * Inject custom manifest using Settings information
 * Change the name, description, colors and icons...
 *
 */

import { boot } from 'quasar/wrappers';
import { store } from 'src/plugins/utils';

export default boot(async (/* { app, router, ... } */) => {
  //Get the manifest link
  const manifestLink = document.querySelector('link[rel="manifest"]');
  const siteName = store.getSetting('isite::site-name')

  if (manifestLink) {
    const startUrl = `${window.location.origin}${window.location.pathname}`;
    const name = store.getSetting('isite::manifestName') ?? store.getSetting('isite::site-name');
    const shortName = store.getSetting('isite::manifestShortName') ?? name;
    const description = store.getSetting('isite::manifestDescription') ?? store.getSetting('isite::site-description') ?? siteName;
    const background = store.getSetting('isite::manifestBackgroundColor') ?? '#ffffff';
    const themeColor = store.getSetting('isite::manifestThemeColor') ?? store.getSetting('isite::brandPrimary');
    const iconsBaseUrl = store.getSetting('isite::manifestIconsBaseUrl') ?? `${startUrl}icons`;


    //============================================================== Manifest
    //Instance the manifest data
    const manifest = {
      name: name,
      short_name: shortName,
      description: description,
      display: 'standalone',
      orientation: 'portrait',
      background_color: background,
      theme_color: themeColor,
      start_url: startUrl,
      icons: [
        {
          src: `${iconsBaseUrl}/icon-128x128.png`,
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: `${iconsBaseUrl}/icon-192x192.png`,
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: `${iconsBaseUrl}/icon-256x256.png`,
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: `${iconsBaseUrl}/icon-384x384.png`,
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: `${iconsBaseUrl}/icon-512x512.png`,
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    };

    //Replace manifest as Data Url
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    manifestLink.href = url;


    //============================================================== Icons
    //Define elements to include in head
    const elementsHTML = [
      //Metas
      {
        type: 'meta',
        tags: {
          name: 'apple-mobile-web-app-title',
          content: name
        }
      },
      {
        type: 'meta',
        tags: {
          name: 'theme-color',
          content: themeColor
        }
      },
      {
        type: 'meta',
        tags: {
          name: 'msapplication-TileImage',
          content: `${iconsBaseUrl}/ms-icon-144x144.png`
        }
      },
      //Apple Icons
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-icon',
          href: `${iconsBaseUrl}/apple-icon-120x120.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-icon',
          sizes: '152x152',
          href: `${iconsBaseUrl}/apple-icon-152x152.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-icon',
          sizes: '167x167',
          href: `${iconsBaseUrl}/apple-icon-167x167.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: `${iconsBaseUrl}/apple-icon-180x180.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'mask-icon',
          href: `${iconsBaseUrl}/safari-pinned-tab.svg`,
          color: themeColor
        }
      },
      // Favicons
      {
        type: 'link',
        tags: {
          rel: 'icon',
          type: 'image/png',
          sizes: '128x128',
          href: `${iconsBaseUrl}/favicon-128x128.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: `${iconsBaseUrl}/favicon-96x96.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: `${iconsBaseUrl}/favicon-32x32.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: `${iconsBaseUrl}/favicon-16x16.png`
        }
      },
      // Splash Screens
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
          href: `${iconsBaseUrl}/apple-launch-828x1792.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
          href: `${iconsBaseUrl}/apple-launch-1125x2436.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
          href: `${iconsBaseUrl}/apple-launch-1242x2688.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
          href: `${iconsBaseUrl}/apple-launch-750x1334.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
          href: `${iconsBaseUrl}/apple-launch-1242x2208.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
          href: `${iconsBaseUrl}/apple-launch-640x1136.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
          href: `${iconsBaseUrl}/apple-launch-1536x2048.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)',
          href: `${iconsBaseUrl}/apple-launch-1668x2224.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
          href: `${iconsBaseUrl}/apple-launch-1668x2388.png`
        }
      },
      {
        type: 'link',
        tags: {
          rel: 'apple-touch-startup-image',
          media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
          href: `${iconsBaseUrl}/apple-launch-2048x2732.png`
        }
      }
    ];

    //Set the icons to head
    elementsHTML.forEach(item => {
      // Construct a selector based on the tag attributes, excluding the href attribute
      const selector = Object.entries(item.tags)
        .filter(([key]) => !['href', 'content', 'color'].includes(key))
        .map(([key, value]) => `[${key}="${value}"]`)
        .join('');

      // Check if an element with the same type and attributes (excluding href) already exists
      const existingElement = document.querySelector(`${item.type}${selector}`);

      if (existingElement) {
        // If the element exists, update the href attribute
        for (const key in item.tags) {
          existingElement.setAttribute(key, item.tags[key]);
        }
      } else {
        // If the element does not exist, create and append it
        const element = document.createElement(item.type);
        for (const key in item.tags) {
          element.setAttribute(key, item.tags[key]);
        }
        document.head.appendChild(element);
      }
    });
  }
});
