import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getApiBase(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_API_BASE_URL) {
    return import.meta.env.VITE_BACKEND_API_BASE_URL
  }
  return ""
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("sentinel-auth-token")
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" }
  try {
    const csrfMatch = document.cookie
      .split(";")
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith("__csrf="))
    if (csrfMatch) {
      headers["X-CSRF-Token"] = csrfMatch.slice("__csrf=".length)
    }
  } catch {
    // cookie unavailable
  }
  return headers
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers: { ...getAuthHeaders(), ...(init?.headers || {}) },
    credentials: "include",
  })
  return res.json() as Promise<T>
}
