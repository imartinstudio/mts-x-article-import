/**
 * Dist smoke check: verify the built extension is loadable —
 * manifest parses, every referenced asset exists, bundles are valid JS.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

const fail = (message) => {
  console.error(`dist-smoke: FAIL — ${message}`);
  process.exit(1);
};

if (!existsSync(join(dist, "manifest.json"))) fail("dist/manifest.json is missing; run pnpm build first.");

const manifest = JSON.parse(readFileSync(join(dist, "manifest.json"), "utf8"));
if (manifest.manifest_version !== 3) fail("manifest_version must be 3.");

const referencedFiles = [
  manifest.background?.service_worker,
  ...(manifest.content_scripts ?? []).flatMap((entry) => entry.js ?? []),
  ...Object.values(manifest.icons ?? {}),
  "main-world/draft-writer.js",
].filter(Boolean);

for (const file of referencedFiles) {
  if (!existsSync(join(dist, file))) fail(`referenced file missing in dist: ${file}`);
}

for (const bundle of referencedFiles.filter((file) => file.endsWith(".js"))) {
  try {
    execFileSync(process.execPath, ["--check", join(dist, bundle)], { stdio: "pipe" });
  } catch (error) {
    fail(`bundle failed syntax check: ${bundle}\n${error.stderr?.toString() ?? error}`);
  }
}

console.log(`dist-smoke: OK (${referencedFiles.length} files verified)`);
