# Electron Desktop Packaging Plan
> NovusSparks AI — Windows x64 Installer

## Overview

Package the existing React + Vite frontend and Node.js backend (`backend/server.mjs`) into a standalone Windows `.exe` installer using Electron + electron-builder.

---

## Stack Context

| Layer | Technology |
|---|---|
| Frontend | React + Vite (builds to `dist/`) |
| Backend | Node.js ESM (`backend/server.mjs`) |
| Database | Neon Serverless Postgres (cloud, requires internet) |
| Auth | OAuth (Google/GitHub) via `backend/oauth.mjs` |
| AI | LLM bridge via `backend/llm-service.mjs` |
| Package type | `"type": "module"` in `package.json` |

---

## Implementation Steps

### Step 1 — Install Dependencies

```bash
npm install --save-dev electron electron-builder
npm install --save-dev @electron/rebuild
```

> Do NOT use `electron-forge` — conflicts with the existing Vite build pipeline.

---

### Step 2 — Create `electron/main.cjs`

> Must use `.cjs` extension because root `package.json` has `"type": "module"`.

```js
// electron/main.cjs
const { app, BrowserWindow, shell } = require('electron')
const { fork } = require('child_process')
const path = require('path')
const http = require('http')

const BACKEND_PORT = 5000
let backendProcess = null
let mainWindow = null

function waitForBackend(retries = 20) {
  return new Promise((resolve, reject) => {
    const check = (n) => {
      http.get(`http://localhost:${BACKEND_PORT}/api/health`, (res) => {
        if (res.statusCode === 200) resolve()
        else if (n > 0) setTimeout(() => check(n - 1), 500)
        else reject(new Error('Backend did not start in time'))
      }).on('error', () => {
        if (n > 0) setTimeout(() => check(n - 1), 500)
        else reject(new Error('Backend failed to start'))
      })
    }
    check(retries)
  })
}

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'server.mjs')
    : path.join(__dirname, '..', 'backend', 'server.mjs')

  backendProcess = fork(backendPath, [], {
    execArgv: [],
    env: {
      ...process.env,
      PORT: String(BACKEND_PORT),
      ELECTRON_RUN: 'true',
    },
    stdio: 'inherit',
  })

  backendProcess.on('error', (err) => console.error('Backend error:', err))
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    title: 'NovusSparks AI',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const indexPath = app.isPackaged
    ? path.join(__dirname, '..', 'dist', 'index.html')
    : 'http://localhost:5173'

  if (app.isPackaged) {
    mainWindow.loadFile(indexPath)
  } else {
    mainWindow.loadURL(indexPath)
  }

  // Open external links in system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(async () => {
  startBackend()
  try {
    await waitForBackend()
  } catch (e) {
    console.error(e.message)
  }
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  if (backendProcess) backendProcess.kill()
})
```

---

### Step 3 — Create `electron-builder.yml`

```yaml
appId: com.novussparks.ai
productName: NovusSparks AI
copyright: Copyright © 2026 NovusSparks

directories:
  buildResources: build-assets
  output: dist-electron

files:
  - dist/**
  - electron/**
  - backend/**
  - node_modules/**
  - "!node_modules/.cache"

extraResources:
  - from: backend/
    to: backend/
    filter:
      - "**/*"

win:
  target:
    - target: nsis
      arch:
        - x64
  icon: build-assets/icon.ico

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  installerIcon: build-assets/icon.ico
  uninstallerIcon: build-assets/icon.ico
  installerHeaderIcon: build-assets/icon.ico
  createDesktopShortcut: true
  createStartMenuShortcut: true
  shortcutName: NovusSparks AI
```

---

### Step 4 — Add Scripts to `package.json`

Add these to the `"scripts"` section:

```json
"electron:dev": "electron electron/main.cjs",
"electron:build": "npm run build && electron-builder --win --x64",
"electron:build:all": "npm run build && electron-builder --win --mac --linux"
```

> `electron:build` runs Vite build first, then packages.

---

### Step 5 — Add `main` Entry to `package.json`

```json
"main": "electron/main.cjs"
```

> electron-builder requires this to locate the Electron entry point.

---

### Step 6 — Create App Icon

Place the following files in `build-assets/`:
- `icon.ico` — Windows (256×256 recommended, multi-size ICO)
- `icon.png` — Linux (512×512 PNG)
- `icon.icns` — macOS

Tools: Use https://convertio.co or `icotool` to convert from PNG.

---

### Step 7 — Handle OAuth Redirects (Critical)

OAuth providers (Google, GitHub) cannot redirect to `localhost` in a packaged app without explicit configuration.

**Option A — Register a custom protocol (`novussparks://`)**

In `electron/main.cjs`:
```js
if (process.defaultApp) {
  app.setAsDefaultProtocolClient('novussparks', process.execPath, [path.resolve(process.argv[1])])
} else {
  app.setAsDefaultProtocolClient('novussparks')
}

app.on('open-url', (event, url) => {
  event.preventDefault()
  // Parse token/code from url and pass to renderer
})
```

Update OAuth provider redirect URIs to: `novussparks://auth/callback`

**Option B — Keep localhost redirect (easier, less secure)**

Register `http://localhost:5000/auth/callback` in OAuth provider settings. Works in packaged app since the backend runs on localhost.

---

### Step 8 — Environment Variables

Env vars cannot use `.env` files in the packaged app. Options:

1. **Prompt on first launch** — show a setup screen, store to `electron-store`
2. **Bundle non-sensitive defaults** in `electron/main.cjs` as fallbacks
3. **Use OS keychain** via `keytar` for secrets (API keys, DB URLs)

Never hardcode: `DATABASE_URL`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_SECRET`, LLM API keys.

---

## Known Issues to Resolve Before Implementation

| Issue | Risk | Notes |
|---|---|---|
| `"type": "module"` conflict | High | `electron/main.cjs` must use `.cjs` extension |
| Neon DB WebSocket in packaged env | Medium | May need `ws` polyfill or explicit WS config |
| `@github/spark` package in Electron | Medium | Verify it doesn't assume browser-only globals |
| `backend/server.mjs` port conflict | Low | Add port-in-use detection and fallback port |
| Native modules rebuild | Low | Run `@electron/rebuild` if any native deps added |

---

## Build Command (When Ready)

```bash
# 1. Build frontend
npm run build

# 2. Package Windows x64 installer
npx electron-builder --win --x64

# Output: dist-electron/NovusSparks AI Setup 1.0.0.exe
```

---

## File Structure After Implementation

```
electron/
  main.cjs          ← Electron entry point
build-assets/
  icon.ico          ← Windows icon
  icon.png          ← Linux icon
  icon.icns         ← macOS icon
electron-builder.yml
dist-electron/      ← Generated installer output (gitignored)
```

Add to `.gitignore`:
```
dist-electron/
```

---

## References

- [Electron Docs](https://www.electronjs.org/docs/latest)
- [electron-builder NSIS](https://www.electron.build/configuration/nsis)
- [Electron + ESM guide](https://www.electronjs.org/docs/latest/tutorial/esm)
- [electron-store](https://github.com/sindresorhus/electron-store) — persistent app config
- [keytar](https://github.com/atom/node-keytar) — OS keychain integration
