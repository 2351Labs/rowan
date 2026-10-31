#!/usr/bin/env node
/**
 * Verify that built documentation and Storybook contain the correct version
 * from package.json. This prevents deploying stale version strings.
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Read the current version from package.json
const packageJson = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf-8"));
const expectedVersion = packageJson.version;

console.log(`\nChecking built files for version ${expectedVersion}...\n`);

let hasErrors = false;

/**
 * Search for the version string in JavaScript bundles
 * @param {string} dir - Directory to search
 * @param {string} label - Label for error messages
 */
function checkVersionInDir(dir, label) {
  if (!existsSync(dir)) {
    console.error(`❌ ${label} directory not found: ${dir}`);
    console.error(`   Run the build first: npm run ${label.toLowerCase()}`);
    hasErrors = true;
    return;
  }

  const assetsDir = join(dir, "assets");
  if (!existsSync(assetsDir)) {
    console.error(`❌ ${label} assets directory not found: ${assetsDir}`);
    hasErrors = true;
    return;
  }

  const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
  
  if (jsFiles.length === 0) {
    console.error(`❌ No JS files found in ${label} assets`);
    hasErrors = true;
    return;
  }

  let versionFound = false;

  for (const file of jsFiles) {
    const filePath = join(assetsDir, file);
    const content = readFileSync(filePath, "utf-8");
    
    if (content.includes(expectedVersion)) {
      versionFound = true;
      console.log(`✓ ${label}: Found version ${expectedVersion} in ${file}`);
      break;
    }
  }

  if (!versionFound) {
    console.error(`❌ ${label}: Version ${expectedVersion} not found in any JS bundle`);
    console.error(`   Check that all version strings read from package.json at build time`);
    hasErrors = true;
  }
}

// Check documentation build
checkVersionInDir(
  join(rootDir, "documentation/documentation-static-check"),
  "Documentation"
);

// Check Storybook build
checkVersionInDir(
  join(rootDir, "storybook-static"),
  "Storybook"
);

if (hasErrors) {
  console.error("\n❌ Version check failed\n");
  process.exit(1);
} else {
  console.log(`\n✓ All builds contain version ${expectedVersion}\n`);
  process.exit(0);
}
