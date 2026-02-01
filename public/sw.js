self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("nexus-cache").then(cache =>
      cache.addAll(["/"])
    )
  );
});
