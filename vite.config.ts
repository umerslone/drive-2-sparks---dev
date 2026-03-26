import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

/**
 * Dev-only plugin: exposes /__github-user endpoint that proxies the
 * Codespace's GITHUB_TOKEN to api.github.com so the browser can
 * authenticate the real GitHub user without exposing the token client-side.
 */
function codespaceGitHubUserPlugin(): PluginOption {
  return {
    name: 'codespace-github-user',
    configureServer(server) {
      server.middlewares.use('/__github-user', async (_req, res) => {
        const token = process.env.GITHUB_TOKEN
        if (!token) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'No GITHUB_TOKEN in environment' }))
          return
        }
        try {
          const resp = await fetch('https://api.github.com/user', {
            headers: { Authorization: `token ${token}`, Accept: 'application/json' },
          })
          if (!resp.ok) {
            res.writeHead(resp.status, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'GitHub API error' }))
            return
          }
          const data = await resp.json() as Record<string, unknown>
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            id: String(data.id),
            login: data.login,
            email: data.email || null,
            avatar_url: data.avatar_url || null,
          }))
        } catch {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to reach GitHub API' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    codespaceGitHubUserPlugin(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
