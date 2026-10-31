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

// Extract all `run:` steps from ci.yml (quality and browser-compatibility jobs)
const runSteps = [];

// Simple YAML parser for `run:` steps
const lines = ciYml.split("\n");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Look for `- run:` followed by command on same line
  const inlineRunMatch = line.match(/^\s*-\s*run:\s*(.+)$/);
  if (inlineRunMatch) {
    runSteps.push(inlineRunMatch[1].trim());
    continue;
  }
  
  // Look for `run: |` or `run:` with command on next line
  if (line.match(/^\s*run:\s*\|?\s*$/)) {
    // Read continuation lines (indented more than current)
    const baseIndent = line.search(/\S/);
    let command = "";
    let j = i + 1;
    
    while (j < lines.length) {
      const nextLine = lines[j];
      const nextIndent = nextLine.search(/\S/);
      
      // Stop if we hit a line at same or less indentation
      if (nextLine.trim() && nextIndent <= baseIndent) {
        break;
      }
      
      if (nextLine.trim()) {
        command += (command ? " " : "") + nextLine.trim();
      }
      j++;
    }
    
    if (command) {
      runSteps.push(command);
    }
    i = j - 1;
  }
}

console.log(`Found ${runSteps.length} run steps in ci.yml:\n`);

let hasErrors = false;

// Check each step is represented in ci-local.mjs
for (const step of runSteps) {
  // Normalize step for matching
  const normalized = step
    .replace(/\$/g, "")
    .replace(/\{|\}/g, "")
    .replace(/matrix\.browser/g, "")
    .trim();
  
  // Check if this step appears in ci-local.mjs
  // We look for the key command parts
  let found = false;
  
  // Extract the core npm command or node script
  if (normalized.includes("npm ci")) {
    found = ciLocal.includes('["ci"]') || ciLocal.includes("npm ci");
  } else if (normalized.includes("npm run lint")) {
    found = ciLocal.includes('["run", "lint"]') || ciLocal.includes('"lint"');
  } else if (normalized.includes("npm run types")) {
    found = ciLocal.includes('["run", "types"]') || ciLocal.includes('"types"');
  } else if (normalized.includes("npm run typecheck")) {
    found = ciLocal.includes('["run", "typecheck"]') || ciLocal.includes('"typecheck"');
  } else if (normalized.includes("npm run analyze")) {
    found = ciLocal.includes('["run", "analyze"]') || ciLocal.includes('"analyze"');
  } else if (normalized.includes("npm run verify --workspace=@rowan-ui/icons")) {
    found = ciLocal.includes('"verify", "--workspace=@rowan-ui/icons"');
  } else if (normalized.includes("npm test")) {
    found = ciLocal.includes('["test"]');
  } else if (normalized.includes("npm run test:package")) {
    found = ciLocal.includes('"test:package"');
  } else if (normalized.includes("npm run test:browser")) {
    found = ciLocal.includes('"test:browser"');
  } else if (normalized.includes("npm run size:check")) {
    found = ciLocal.includes('"size:check"');
  } else if (normalized.includes("npm run documentation:build")) {
    found = ciLocal.includes('"documentation:build"');
  } else if (normalized.includes("npm run build-storybook")) {
    found = ciLocal.includes('"build-storybook"');
  } else if (normalized.includes("scripts/check-docs-version.mjs")) {
    found = ciLocal.includes("check-docs-version.mjs");
  } else if (normalized.includes("scripts/check-component-docs-coverage.mjs")) {
    found = ciLocal.includes("check-component-docs-coverage.mjs");
  } else if (normalized.includes("npm pack --dry-run")) {
    found = ciLocal.includes('"pack", "--dry-run"');
  } else if (normalized.includes("npx playwright install") || normalized.includes("playwright install")) {
    found = ciLocal.includes("playwright install") || ciLocal.includes("ensurePlaywrightBrowsers");
  } else if (normalized.includes("git status --porcelain")) {
    found = ciLocal.includes("git status --porcelain") || 
            ciLocal.includes("checkGeneratedArtifacts");
  } else {
    // For other steps, do a fuzzy check
    const key = normalized
      .replace(/^npm\s+(run\s+)?/, "")
      .replace(/--workspace[^\s]*/, "")
      .replace(/--with-deps/, "")
      .trim()
      .split(/\s+/)[0];
    
    if (key) {
      found = ciLocal.includes(key);
    }
  }
  
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
