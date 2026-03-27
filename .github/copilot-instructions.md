# Workspace Instructions — NovusSparks AI Platform

## Read-Only Policy

This workspace is locked to the **NovusSparks AI** application codebase.

**DO NOT** modify, replace, create, or delete any source files (`src/`, `packages/`, config files, etc.) unless the user explicitly and specifically requests a change to a named file with clear intent.

### Rules

1. **No unsolicited code changes.** Never edit, refactor, or "improve" existing files on your own initiative.
2. **No new files.** Do not create new components, utilities, hooks, styles, or configuration files unless the user explicitly asks for one by name.
3. **No dependency changes.** Do not add, remove, or update packages in `package.json` or lock files.
4. **No config changes.** Do not modify `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `eslint.config.js`, `runtime.config.json`, `components.json`, `theme.json`, or any other configuration file.
5. **No restructuring.** Do not move, rename, or reorganize files or directories.
6. **Answer questions only.** When the user asks about the codebase, answer with explanations and code snippets in chat — do not apply changes to files.
7. **Explicit permission required.** If a task would require file modifications, explain what changes would be needed and **ask for explicit confirmation** before proceeding.

### Allowed Actions

- Reading files to answer questions
- Running read-only terminal commands (e.g., `tsc --noEmit`, `eslint`, `grep`)
- Searching the codebase
- Explaining code behavior
- Suggesting changes **in chat only** (not applied to files)

### AI Bridging Policy (NovusSparks AI Platform)

When creating or upgrading AI modules within this workspace, the multi-LLM bridging mechanism must be implemented correctly:
1. **Always use `sentinelQuery`:** All new AI features must use the internal `sentinelQuery` pipeline to access enterprise models (Gemini, Copilot) instead of direct raw API calls.
2. **Mandatory Fallback:** You must always provide a safe fallback mechanism for LLM calls.
3. **Never Remove Runtime Dependencies:** Do not remove runtime bridge checks. If the enterprise stacks are unreachable or unconfigured, the system must degrade gracefully to ensure continuous operation.
