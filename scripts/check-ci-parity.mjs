#!/usr/bin/env node
/**
 * Verify that scripts/ci-local.mjs includes all CI steps from ci.yml.
 * This prevents the local runner from silently going stale.
 * 
 * Parses .github/workflows/ci.yml and checks that each `run:` step
 * is represented in ci-local.mjs.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("\nChecking CI parity between ci.yml and ci-local.mjs...\n");

// Read CI workflow
const ciYmlPath = join(rootDir, ".github/workflows/ci.yml");
const ciYml = readFileSync(ciYmlPath, "utf-8");

// Read ci-local.mjs
const ciLocalPath = join(rootDir, "scripts/ci-local.mjs");
const ciLocal = readFileSync(ciLocalPath, "utf-8");

// Extract all `run:` steps from ci.yml (quality and browser-compatibility jobs).
// Covers `- run: cmd`, `run: cmd` (named steps), and `run: |` blocks.
const runSteps = [];
const lines = ciYml.split("\n");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const runMatch = line.match(/^(\s*)(?:-\s*)?run:\s*(.*)$/);
  if (!runMatch) continue;

  const baseIndent = runMatch[1].length;
  const inline = runMatch[2].trim();

  if (inline && inline !== "|" && inline !== ">") {
    runSteps.push(inline);
    continue;
  }

  let command = "";
  let j = i + 1;
  while (j < lines.length) {
    const nextLine = lines[j];
    if (!nextLine.trim()) {
      j++;
      continue;
    }
    const nextIndent = nextLine.search(/\S/);
    if (nextIndent <= baseIndent) break;
    command += (command ? " " : "") + nextLine.trim();
    j++;
  }
  if (command) runSteps.push(command);
  i = j - 1;
}

console.log(`Found ${runSteps.length} run steps in ci.yml:\n`);

let hasErrors = false;

/**
 * A CI `run:` command is represented when ci-local.mjs contains the same argv.
 * Workspace and script names must match; a generic `npm run lint` does not
 * cover `npm run lint --workspace=@rowan-ui/icons`.
 */
function stepIsRepresented(step) {
  const compact = step.replace(/\s+/g, " ").trim();

  if (compact.includes("git status --porcelain")) {
    return (
      ciLocal.includes('status",') &&
      ciLocal.includes('"--porcelain"') &&
      ciLocal.includes('"custom-elements.json"') &&
      ciLocal.includes('"packages/maplibre/src/react/generated"')
    );
  }

  if (compact.includes("playwright install")) {
    return ciLocal.includes('"playwright", "install", "--with-deps"');
  }

  const nodeScript = compact.match(/^node\s+(\S+)/);
  if (nodeScript) {
    return ciLocal.includes(`"${nodeScript[1]}"`);
  }

  const workspaceRun = compact.match(/^npm run (\S+) --workspace=(\S+)$/);
  if (workspaceRun) {
    const [, script, workspace] = workspaceRun;
    return ciLocal.includes(`["run", "${script}", "--workspace=${workspace}"]`);
  }

  const plainRun = compact.match(/^npm run (\S+)$/);
  if (plainRun) {
    return ciLocal.includes(`["run", "${plainRun[1]}"]`);
  }

  if (compact === "npm test") {
    return ciLocal.includes('["test"]');
  }

  if (compact === "npm ci") {
    return ciLocal.includes('["ci"]');
  }

  const pack = compact.match(/^npm pack --dry-run(?: --workspace=(\S+))?$/);
  if (pack) {
    if (pack[1]) {
      return ciLocal.includes(`["pack", "--dry-run", "--workspace=${pack[1]}"]`);
    }
    return ciLocal.includes('["pack", "--dry-run"]');
  }

  const tokens = compact.split(" ").filter((token) => token.length > 1 && !token.startsWith("$"));
  return tokens.length > 0 && tokens.every((token) => ciLocal.includes(token));
}

// Check each step is represented in ci-local.mjs
for (const step of runSteps) {
  const found = stepIsRepresented(step);
  
  if (found) {
    console.log(`  ✓ ${step}`);
  } else {
    console.error(`  ❌ ${step}`);
    console.error(`     ^ This step is missing from ci-local.mjs`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error("\n❌ CI parity check failed");
  console.error("   scripts/ci-local.mjs is missing steps from .github/workflows/ci.yml");
  console.error("   Update ci-local.mjs to include all CI steps.\n");
  process.exit(1);
} else {
  console.log("\n✓ All CI steps are represented in ci-local.mjs\n");
  process.exit(0);
}
