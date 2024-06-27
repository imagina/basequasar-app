/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxPluginMode is set to "InjectManifest"
 */

// @ts-ignore Disable worbox Logs
self.__WB_DISABLE_DEV_LOGS = true;

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
// import { registerRoute } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
// import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { Queue } from 'workbox-background-sync';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';

cleanupOutdatedCaches()

// clientsClaim() is used so that a new Service Worker
// takes control of existing client windows (browser tabs)
// that are still controlled by a previous Service Worker.
clientsClaim();

setCacheNameDetails({
  prefix: 'compile-time',
  precache: 'precache',
  suffix: 'v2',
})

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

const requestPOST = new Map<string, Request>();
const sentPOST = new Map<string, any>();
const QUEUE_NAME = 'requests';
// const CACHE_NAME = 'runtime-cache';

// const plugins = [
//   new ExpirationPlugin({
//     maxEntries: 50,
//     maxAgeSeconds: 60 * 60 // 1 Hour
//   })
// ];

// const match = request => {
//   const url = new URL(request.request.url);
//   const isApi = url.pathname.startsWith('/api/');

//   const isRefresh = request.request.headers.get('x-refresh');
//   const cache = request.request.headers.get('x-cache');

//   return { isApi, isRefresh, cache };
// };

// const matchNetworkFirst = request => {
//   const { isApi, isRefresh, cache } = match(request);

//   return isApi && isRefresh && !cache;
// };

// const matchCacheFirst = request => {
//   const { isApi, isRefresh, cache } = match(request);

//   return isApi && !isRefresh && !cache;
// };

// registerRoute(
//   matchNetworkFirst,
//   new NetworkFirst({
//     cacheName: CACHE_NAME,
//     plugins
//   }));

// registerRoute(
//   matchCacheFirst,
//   new CacheFirst({
//     cacheName: CACHE_NAME,
//     plugins
//   })
// );

const postMessage = (message: string) => {
  (self as any).clients.matchAll()
    .then(clients => {
      clients.forEach(client => client.postMessage(message));
    });
};

const transformReadableStreamToObject = async (data: ReadableStream): Promise<any> => {
  if (!data) return;
  try {
    const reader = data.getReader();
    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
    }
    const isString = typeof result === 'string';
    return isString ? JSON.parse(result) : {}
  } catch (err) {
    console.error('Error reading ReadableStream in transformReadableStreamToObject', err);
    throw new Error(err);
  }
};

const parseUrlSegment = (fullUrl: string, segment: 'pathname' | 'id') => {
  if (!fullUrl) return;
  const url = new URL(fullUrl);
  const pathName = url.pathname;

  if (segment === 'pathname') return pathName;

  if (segment === 'id') {
    const pathParts = pathName.split('/');
    return pathParts[pathParts.length - 1];
  }
};

const createNewRequest = async (url: string, request, attr?) => {
  const requestClone = request.clone();

  const newRequest = {
    body: requestClone.body,
    cache: requestClone.cache,
    credentials: requestClone.credentials,
    headers: requestClone.headers,
    integrity: requestClone.integrity,
    keepalive: requestClone.keepalive,
    method: requestClone.method,
    mode: requestClone.mode,
    redirect: requestClone.redirect,
    referrer: requestClone.referrer,
    referrerPolicy: requestClone.referrerPolicy,
    signal: requestClone.signal,
    ...attr
  };

  return new Request(url ? url : requestClone.url, newRequest);
};

const replaceRequestUrlWithStoredUrl = async (
  clonedRequest,
  requestId: number | string,
  requestAttributes
) => {
  if (sentPOST.has(String(requestId))) {
    const url = clonedRequest.url.replace(requestId, sentPOST.get(String(requestId)));
    const newRequest = await createNewRequest(url, clonedRequest, { ...requestAttributes });

    return newRequest;
  }
};

const prepareRequest = async (entry) => {
  // If a POST or PUT request is successful and then that same record
  // is deleted during the disconnected state, then the fake ID
  // contained in the URL is replaced by the real ID generated
  // by the database as a response to the successful request.
  try {
    const method = entry.request.method;
    const requestId = entry.metadata?.requestId;

    const dataBody = await transformReadableStreamToObject(entry.request.clone().body);
    const idAttribute = dataBody?.attributes?.id;
    const databaseGeneratedId = sentPOST.get(requestId);

    // The sent id in the payload is updated with the real
    // id of the record in the database.
    if (idAttribute && databaseGeneratedId) {
      dataBody.attributes.id = databaseGeneratedId;
    }

    const body = JSON.stringify(dataBody);

    const requestAttributes = method === 'DELETE' ? { body: null, method: 'DELETE' } : { body };
    const newRequest = await replaceRequestUrlWithStoredUrl(
      entry.request.clone(),
      requestId,
      requestAttributes
    );

    return newRequest;
  } catch (err) {
    console.error('Error preparing request', err);
  }
};

const nameDB = () => {
  const hostname = self.location.hostname.split('.')
  const response = hostname

  //Set capitalize to all words
  hostname.forEach((word, index) => {
    if (index >= 1) {
      hostname[index] = word.charAt(0).toUpperCase() + word.slice(1)
    }
  })

  //Remove .com .org....
  if (hostname.length >= 2) response.pop()

  return `${response.join('')}DB`
}

const updateCacheData = (response) => {
  try {
    const openDB = indexedDB.open(nameDB());
    const KEY = 'apiRoutes.qramp.workOrders::offline'

    openDB.onsuccess = (event) => {
      const db = openDB.result;
      const transaction = db.transaction('storage', 'readwrite')
      const storage = transaction.objectStore('storage')
      const request = storage.get(KEY)

      request.onsuccess = (event) => {
        const data = request.result?.data;
        const newData = data.map(item => {
          const match = String(item.offlineId) === String(response.offlineId)
          return match ? response : item;
        })
        storage.put(
          { ...request.result, data: newData, },
          KEY
        )
      }
    }
  } catch (error) {
    console.error('error', error)
  }
}

const queue = new Queue(QUEUE_NAME, {
  onSync: async ({ queue }) => {
    let entry;
    const retryCounters = new Map<string, number>();

    while (entry = await queue.shiftRequest()) {
      try {
        const method = entry.request.method;

        if (
          method === 'PUT' ||
          method === 'DELETE'
        ) {
          const newRequest = await prepareRequest(entry);
          if (newRequest) entry.request = newRequest;
        }

        const response = await fetch(entry.request);

        if (method === 'POST') {
          const { data } = await response.json();
          if (data?.offlineId) updateCacheData(data)
          // Save the ID generated by the server
          // to later use it in the URL of the DELETE or PUT
          // request corresponding to the created record.
          sentPOST.set(data?.offlineId, data?.id);
        }

        postMessage('successful');

        retryCounters.delete(entry.request.url);
      } catch (err) {
        // If a queued request fails, it will try two more times,
        // and if unsuccessful, it will remove it from the queue.
        const retryCounter = retryCounters.get(entry.request.url) || 0;
        const ATTEMPTS = 3;

        if (retryCounter < ATTEMPTS) {
          retryCounters.set(entry.request.url, retryCounter + 1);
          await queue.unshiftRequest(entry);
        } else {
          retryCounters.delete(entry.request.url);
        }

        console.error('Error sending request', err);
      }
    }

    postMessage('sync-data');
  }
});

self.addEventListener('fetch', (event: any) => {
  const supportedMethods = [
    'POST',
    'PUT',
    'DELETE'
  ];

  if (!supportedMethods.includes(event.request.method)) {
    return;
  }

  const bgSyncLogic = async () => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      const path = new URL(event.request.url).pathname;
      if (path.startsWith('/api/') && !navigator.onLine) {

        let requestId = null;

        if (event.request.method === 'POST') {
          const {
            attributes: { offline_id }
          } = await transformReadableStreamToObject(event.request.clone().body);
          requestPOST.set(String(offline_id), event.request.clone());
        }

        if (event.request.method === 'PUT') {
          const id = parseUrlSegment(event.request.url, 'id');

          if (requestPOST.has(String(id))) {
            requestId = id;
          }
        }

        if (event.request.method === 'DELETE') {
          const id = parseUrlSegment(event.request.url, 'id');

          if (requestPOST.has(String(id))) {
            requestId = id;
          }
        }

        await queue.pushRequest({
          request: event.request,
          metadata: {
            requestId
          }
        });

        postMessage('queue-request');
      }

      return error;
    }
  };

  event.respondWith(bgSyncLogic());
});

self.addEventListener('message', e => {
  postMessage('activate');
});