/**
 * NovusSparks AI — Service Worker
 * Strategy:
 *  - App shell (HTML, JS, CSS): Cache-first, update in background (stale-while-revalidate)
 *  - API calls (/api/*): Network-only (always fresh data from server)
 *  - Static assets (icons, fonts): Cache-first with long TTL
 */

const CACHE_VERSION = 'v1'
const SHELL_CACHE = `novussparks-shell-${CACHE_VERSION}`
const STATIC_CACHE = `novussparks-static-${CACHE_VERSION}`

// App shell resources to pre-cache on install
const SHELL_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// ── Install: pre-cache the app shell ─────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      // Use individual adds so one 404 doesn't abort the whole install
      Promise.allSettled(SHELL_URLS.map((url) => cache.add(url).catch(() => null)))
    ).then(() => self.skipWaiting())
  )
})

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const validCaches = [SHELL_CACHE, STATIC_CACHE]
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !validCaches.includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

// Runtime interception is intentionally disabled.
// Reason: strict CSP on production blocks service worker network fetches,
// which can break navigation if respondWith() receives a rejected promise.
// We keep installability and cache lifecycle, but let the browser network
// stack handle all requests directly for maximum reliability.
