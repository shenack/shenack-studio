// Shenack Studio — service worker : la page est toujours prise sur internet en priorité (mises à jour immédiates), le reste est mis en cache.
const C='shenack-studio-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const fresh=u.pathname.endsWith('/')||u.pathname.endsWith('index.html')||u.pathname.endsWith('version.json');
  e.respondWith(fresh
    ?fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request))
    :caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r;})));
});
