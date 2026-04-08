import fs from "node:fs"

const pkgPath = new URL("../package.json", import.meta.url)
const lockPath = new URL("../package-lock.json", import.meta.url)

const pkgRaw = fs.readFileSync(pkgPath, "utf8")
const lockRaw = fs.readFileSync(lockPath, "utf8")

const pkg = JSON.parse(pkgRaw)
const lock = JSON.parse(lockRaw)

const failures = []

if (pkg.workspaces) {
  failures.push("package.json must not declare a workspaces field.")
}

const rootSpark = pkg?.dependencies?.["@github/spark"]
if (rootSpark !== "0.46.0") {
  failures.push(`package.json dependency @github/spark must be pinned to 0.46.0 (found: ${String(rootSpark)}).`)
}

const sparkNode = lock?.packages?.["node_modules/@github/spark"]
if (!sparkNode) {
  failures.push("package-lock.json is missing packages['node_modules/@github/spark'].")
} else {
  if (sparkNode.link === true || String(sparkNode.resolved || "").includes("packages/spark-tools")) {
    failures.push("package-lock.json resolves @github/spark to a local workspace link (packages/spark-tools).")
  }

  const resolved = String(sparkNode.resolved || "")
  if (!resolved.startsWith("https://registry.npmjs.org/@github/spark/-/spark-")) {
    failures.push(`package-lock.json must resolve @github/spark from npm registry (found: ${resolved || "<empty>"}).`)
  }

  if (String(sparkNode.version || "") !== "0.46.0") {
    failures.push(`package-lock.json @github/spark version must be 0.46.0 (found: ${String(sparkNode.version)}).`)
  }
}

if (lockRaw.includes('"packages/spark-tools"')) {
  failures.push("package-lock.json contains packages/spark-tools workspace metadata.")
}

if (failures.length > 0) {
  console.error("\nLockfile guard failed:\n")
  failures.forEach((failure) => console.error(`- ${failure}`))
  console.error("\nResolution:\n- Keep @github/spark pinned to 0.46.0\n- Remove package.json workspaces\n- Regenerate lockfile with: npm install --package-lock-only\n")
  process.exit(1)
}

console.log("Lockfile guard passed.")
