import { createRoot } from "react-dom/client"
import { ErrorBoundary } from "react-error-boundary"
import { Toaster } from "sonner"
import { initializeSparkShim } from "@/lib/spark-shim"

import App from "./App.tsx"
import { ErrorFallback } from "./ErrorFallback.tsx"

import "./main.css"
import "./styles/theme.css"
import "./index.css"

const removeSplash = () => {
  const splash = document.getElementById("app-splash")
  if (splash) {
    splash.classList.add("fade-out")
    setTimeout(() => splash.remove(), 500)
  }
}

const renderCriticalFallback = (message: string) => {
  const root = document.getElementById("root")
  if (!root) return

  root.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;padding:1rem;background:#0f172a;color:#f1f5f9;">
      <div style="max-width:480px;text-align:center;">
        <h2 style="margin:0 0 0.5rem;font-size:1.25rem;">Unable to start the application</h2>
        <p style="color:#94a3b8;font-size:0.85rem;margin:0 0 1rem;">${message}</p>
        <button onclick="window.location.reload()" style="background:#3b82f6;color:#fff;border:none;padding:0.5rem 1.25rem;border-radius:0.375rem;cursor:pointer;font-size:0.875rem;">
          Reload page
        </button>
      </div>
    </div>`
}

const bootstrap = async () => {
  try {
    if (typeof window !== "undefined" && !(window as unknown as { spark?: unknown }).spark) {
      const hasSparkEnv = Boolean(
        import.meta.env.GITHUB_RUNTIME_PERMANENT_NAME ||
        import.meta.env.VITE_GITHUB_RUNTIME_PERMANENT_NAME
      )

      if (hasSparkEnv) {
        await Promise.race([
          import("@github/spark/spark"),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Spark SDK import timed out")), 4000)),
        ])
      } else {
        console.info("Spark runtime environment not detected, using local shim")
      }
    }
  } catch (error) {
    console.warn("Spark SDK import failed or timed out, continuing with shim:", error)
  }

  initializeSparkShim()

  const rootEl = document.getElementById("root")
  if (!rootEl) {
    console.error("Root element not found - cannot mount application.")
    return
  }

  createRoot(rootEl).render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Toaster position="top-right" richColors closeButton />
      <App />
    </ErrorBoundary>
  )

  removeSplash()
}

bootstrap().catch((error) => {
  console.error("Bootstrap failed:", error)
  removeSplash()

  const safeMessage = import.meta.env.DEV
    ? String(error instanceof Error ? error.message : error)
    : "Please reload the page or try again later."

  renderCriticalFallback(safeMessage)
})

// Register PWA service worker (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.info('[PWA] Service worker registered:', reg.scope)
      })
      .catch((err) => {
        console.warn('[PWA] Service worker registration failed:', err)
      })
  })
}

