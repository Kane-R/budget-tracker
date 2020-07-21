// List of data to cache
var FILES_TO_CACHE = [
  '/',
  '/styles.css',
  '/index.js',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

//Name of website files cache
const CACHE_NAME = "static-cache-v2";
//Name of fetch cached data
const DATA_CACHE_NAME = "data-cache-v1";

// install the website pages based off website cache name
self.addEventListener("install", function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Handles caching fetch data
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// makes fetch request
self.addEventListener("fetch", function(evt) {
  

  if(evt.request.url.includes("/api/transaction") && evt.request.method === "POST" ){
    console.log("Yes");

    /***********  My Sync Code Start ***********/
    /*
    self.onsync = function(evt) {
      fetch(event.request).then(response => {
        return cache.put(evt.request, response.clone()).then(() => {
          return response;
        });
      })
    } */
    /***********  My Sync Code End ***********/

    /***********  My add Request to IndexDB Code Start ***********/

    evt.respondWith((evt) => {
      if(true){
        let response =  await fetch(evt.request);
        await IDB.add(response, evt.request.body.id)
        return response
      }
    })

    /***********  My add Request to IndexDB Code End ***********/




   }else if (evt.request.url.includes("/api/") && evt.request.method !== "POST" ) {

    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            
          });
      }).catch(err => {
        console.log(err)
      })
    );

    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});


//Handle Outbound Fetch Calls

