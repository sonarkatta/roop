const CACHE='roop-trial-shell-v2';const SHELL=['./','./index.html','./2-trial.js','./style.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||Response.error())))});
self.addEventListener('message',e=>{if(e.data?.type!=='TRIAL_AUDIT'||!e.ports[0])return;e.waitUntil((async()=>{const c=await caches.open(CACHE),missing=[];for(const s of SHELL)if(!await c.match(new URL(s,self.location.href).href))missing.push(s);e.ports[0].postMessage({cache:CACHE,missing})})())});
