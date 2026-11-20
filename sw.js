// MLQ Study reminders: shows the nudges the cloud sends (Block A, Block B, MCQ time, the evening check) and opens the app.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: "MLQ Study", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "MLQ Study", { body: d.body || "", tag: d.tag || "study", renotify: true, icon: "icon-192.png", badge: "icon-192.png", data: { go: d.go || "" } }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL("./", self.registration.scope);
  if (e.notification.data && e.notification.data.go) url.searchParams.set("go", e.notification.data.go);
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { if ("focus" in c) { await c.focus(); if ("navigate" in c) { try { await c.navigate(url.href); } catch (_) {} } return; } }
    if (self.clients.openWindow) await self.clients.openWindow(url.href);
  })());
});
