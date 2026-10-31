#!/usr/bin/env node
/**
 * Run GitHub CI checks locally before pushing or opening a PR.
 * Mirrors .github/workflows/ci.yml and storybook-pages.yml.
 * 
 * Usage:
 *   npm run ci:local             # Full run (all browsers, all checks)
 *   npm run ci:local -- --quick  # Fast iteration (lint, types, tests only)
 *   npm run ci:local -- --browser=chromium  # Single browser
 *   npm run ci:local -- --keep-going  # Continue on errors
 *   npm run ci:local -- --clean  # Run npm ci first
 */

import { spawn } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Parse command-line arguments
const args = process.argv.slice(2);
const flags = {
  quick: args.includes("--quick"),
  keepGoing: args.includes("--keep-going"),
  clean: args.includes("--clean"),
  browser: null,
};

// Extract --browser=chromium|firefox|webkit
const browserArg = args.find((arg) => arg.startsWith("--browser="));
if (browserArg) {
  const browser = browserArg.split("=")[1];
  if (!["chromium", "firefox", "webkit"].includes(browser)) {
    console.error(`❌ Invalid browser: ${browser}`);
    console.error(`   Valid options: chromium, firefox, webkit`);
    process.exit(1);
  }
  flags.browser = browser;
}

const browsers = flags.browser ? [flags.browser] : ["chromium", "firefox", "webkit"];

// Track results
const results = [];
const timings = [];
let totalStart = Date.now();

/**
 * Execute a command and return exit code
 */
function runCommand(cmd, args, label, env = {}) {
  const start = Date.now();
  return new Promise((resolve) => {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`▶ ${label}`);
    console.log(`${"=".repeat(80)}\n`);

    const proc = spawn(cmd, args, {
      cwd: rootDir,
      stdio: "inherit",
      shell: true,
      env: { ...process.env, ...env },
    });

    proc.on("close", (code) => {
      const duration = Date.now() - start;
      const status = code === 0 ? "✓" : "✗";
      const result = { label, status, duration, code };
      results.push(result);
      timings.push(`${status} ${label} (${formatDuration(duration)})`);
      
      if (code !== 0) {
        console.error(`\n❌ ${label} failed with exit code ${code}\n`);
        if (!flags.keepGoing) {
          printSummary();
          process.exit(code);
        }
      } else {
        console.log(`\n✓ ${label} passed (${formatDuration(duration)})\n`);
      }
      
      resolve(code);
    });

    proc.on("error", (err) => {
      console.error(`\n❌ Failed to execute ${label}:`, err);
      const duration = Date.now() - start;
      results.push({ label, status: "✗", duration, code: 1 });
      if (!flags.keepGoing) {
        printSummary();
        process.exit(1);
      }
      resolve(1);
    });
  });
}

/**
 * Format duration in human-readable form
 */
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Check if node_modules is stale
 */
function checkNodeModulesStale() {
  const lockFile = join(rootDir, "package-lock.json");
  const nodeModules = join(rootDir, "node_modules");
  
  if (!existsSync(nodeModules)) {
    console.warn("⚠️  node_modules not found. Run npm ci first or use --clean.");
    return true;
  }
  
  if (existsSync(lockFile)) {
    const lockStat = statSync(lockFile);
    const nodeModulesStat = statSync(nodeModules);
    
    if (lockStat.mtime > nodeModulesStat.mtime) {
      console.warn("⚠️  package-lock.json is newer than node_modules.");
      console.warn("    Dependencies may be stale. Consider running: npm ci");
      console.warn("    Or use: npm run ci:local -- --clean\n");
    }
  }
  
  return false;
}

/**
 * Check for uncommitted generated artifact changes
 */
async function checkGeneratedArtifacts() {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`▶ Verify generated artifacts (git status check)`);
  console.log(`${"=".repeat(80)}\n`);
  
  const start = Date.now();
  
  return new Promise((resolve) => {
    const proc = spawn(
      "git",
      [
        "status",
        "--porcelain",
        "--untracked-files=all",
        "--",
        "custom-elements.json",
        "types",
        "packages/icons/custom-elements.json",
        "packages/icons/types",
        "packages/maplibre/custom-elements.json",
        "packages/maplibre/types",
        "src/react/generated",
        "packages/icons/src/react/generated",
        "packages/maplibre/src/react/generated",
      ],
      {
        cwd: rootDir,
        stdio: "pipe",
      }
    );

    let output = "";
    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.on("close", (_code) => {
      const duration = Date.now() - start;
      const changes = output.trim();
      
      if (changes) {
        console.error("❌ Generated artifacts have uncommitted changes:\n");
        console.error(changes);
        console.error("\nRegenerate artifacts with: npm run analyze");
        
        results.push({ 
          label: "Verify generated artifacts", 
          status: "✗", 
          duration, 
          code: 1 
        });
        timings.push(`✗ Verify generated artifacts (${formatDuration(duration)})`);
        
        if (!flags.keepGoing) {
          printSummary();
          process.exit(1);
        }
        resolve(1);
      } else {
        console.log("✓ No uncommitted generated artifact changes\n");
        results.push({ 
          label: "Verify generated artifacts", 
          status: "✓", 
          duration, 
          code: 0 
        });
        timings.push(`✓ Verify generated artifacts (${formatDuration(duration)})`);
        resolve(0);
      }
    });
  });
}

/**
 * Check if Playwright browsers are installed
 */
async function ensurePlaywrightBrowsers(browser) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`▶ Checking Playwright ${browser} installation`);
  console.log(`${"=".repeat(80)}\n`);
  
  // Try to check if browser is installed
  const proc = spawn("npx", ["playwright", "install", browser, "--dry-run"], {
    cwd: rootDir,
    stdio: "pipe",
  });
  
  return new Promise((resolve) => {
    let output = "";
    proc.stdout.on("data", (data) => {
      output += data.toString();
    });
    proc.stderr.on("data", (data) => {
      output += data.toString();
    });
    
    proc.on("close", (code) => {
      // If dry-run succeeds or shows already installed, we're good
      // Otherwise, install the browser
      if (output.includes("is already installed") || code === 0) {
        console.log(`✓ Playwright ${browser} is already installed\n`);
        resolve(0);
      } else {
        console.log(`Installing Playwright ${browser}...`);
        const installProc = spawn(
          "npx",
          ["playwright", "install", "--with-deps", browser],
          {
            cwd: rootDir,
            stdio: "inherit",
          }
        );
        
        installProc.on("close", (installCode) => {
          if (installCode === 0) {
            console.log(`✓ Playwright ${browser} installed\n`);
          }
          resolve(installCode);
        });
      }
    });
  });
}

/**
 * Print summary of all test results
 */
function printSummary() {
  const totalDuration = Date.now() - totalStart;
  const passed = results.filter((r) => r.code === 0).length;
  const failed = results.filter((r) => r.code !== 0).length;
  
  console.log(`\n${"=".repeat(80)}`);
  console.log(`CI LOCAL SUMMARY`);
  console.log(`${"=".repeat(80)}\n`);
  
  timings.forEach((t) => console.log(`  ${t}`));
  
  console.log(`\n${"=".repeat(80)}`);
  console.log(`Total: ${passed + failed} checks, ${passed} passed, ${failed} failed`);
  console.log(`Duration: ${formatDuration(totalDuration)}`);
  console.log(`${"=".repeat(80)}\n`);
  
  if (failed > 0) {
    console.error("❌ CI local checks FAILED\n");
    console.error("Fix the errors above before pushing or opening a PR.\n");
  } else {
    console.log("✅ All CI local checks PASSED\n");
    console.log("Safe to push and open a PR.\n");
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("\n" + "=".repeat(80));
  console.log("ROWAN CI LOCAL CHECKS");
  console.log("=".repeat(80));
  console.log(`Mode: ${flags.quick ? "QUICK" : "FULL"}`);
  console.log(`Fail fast: ${flags.keepGoing ? "NO (keep-going)" : "YES"}`);
  console.log(`Browsers: ${browsers.join(", ")}`);
  console.log("=".repeat(80) + "\n");

  // Step 0: Check dependencies (unless --clean)
  if (!flags.clean) {
    checkNodeModulesStale();
  }

  // Step 1: npm ci (only with --clean)
  if (flags.clean) {
    await runCommand("npm", ["ci"], "npm ci");
  }

  // QUALITY JOB STEPS (mirrors .github/workflows/ci.yml quality job)
  
  await runCommand("npm", ["run", "lint"], "Lint");
  
  await runCommand("npm", ["run", "types"], "Generate types");
  
  await runCommand("npm", ["run", "typecheck"], "Type check");
  
  await runCommand("npm", ["run", "analyze"], "Analyze (CEM + React wrappers)");
  
  // Icons workspace checks
  await runCommand(
    "npm",
    ["run", "lint", "--workspace=@rowan-ui/icons"],
    "Icons: Lint"
  );
  
  await runCommand(
    "npm",
    ["run", "verify", "--workspace=@rowan-ui/icons"],
    "Icons: Verify"
  );
  
  await runCommand(
    "npm",
    ["run", "types", "--workspace=@rowan-ui/icons"],
    "Icons: Generate types"
  );
  
  await runCommand(
    "npm",
    ["run", "typecheck", "--workspace=@rowan-ui/icons"],
    "Icons: Type check"
  );
  
  // Verify generated artifacts (git status check)
  await checkGeneratedArtifacts();
  
  // Unit tests
  await runCommand("npm", ["test"], "Unit tests");
  
  await runCommand("npm", ["run", "test:package"], "Test package registration");
  
  await runCommand("npm", ["run", "size:check"], "Check size budgets");
  
  await runCommand(
    "npm",
    ["run", "test", "--workspace=@rowan-ui/icons"],
    "Icons: Unit tests"
  );
  
  if (!flags.quick) {
    // Full mode: documentation and storybook builds
    await runCommand("npm", ["run", "documentation:build"], "Build documentation");
    
    await runCommand("npm", ["run", "build-storybook"], "Build Storybook");
    
    await runCommand(
      "node",
      ["scripts/check-docs-version.mjs"],
      "Verify documentation version"
    );
    
    await runCommand(
      "node",
      ["scripts/check-component-docs-coverage.mjs"],
      "Verify component docs coverage"
    );
    
    // npm pack dry runs
    await runCommand("npm", ["pack", "--dry-run"], "Pack core (dry-run)");
    
    await runCommand(
      "npm",
      ["pack", "--dry-run", "--workspace=@rowan-ui/icons"],
      "Pack icons (dry-run)"
    );
    
    await runCommand(
      "npm",
      ["pack", "--dry-run", "--workspace=@rowan-ui/maplibre"],
      "Pack maplibre (dry-run)"
    );
  }
  
  if (!flags.quick) {
    // BROWSER-COMPATIBILITY JOB (mirrors .github/workflows/ci.yml browser-compatibility)
    
    for (const browser of browsers) {
      // Ensure Playwright browser is installed
      const installCode = await ensurePlaywrightBrowsers(browser);
      if (installCode !== 0) {
        console.error(`❌ Failed to install Playwright ${browser}`);
        if (!flags.keepGoing) {
          printSummary();
          process.exit(1);
        }
        continue;
      }
      
      // Run browser tests
      await runCommand(
        "npm",
        ["run", "test:browser"],
        `Browser tests (${browser})`,
        { ROWAN_BROWSER: browser }
      );
      
      await runCommand(
        "npm",
        ["run", "test:browser", "--workspace=@rowan-ui/icons"],
        `Icons: Browser tests (${browser})`,
        { ROWAN_BROWSER: browser }
      );
    }
    
    // PAGES BUILD (mirrors .github/workflows/storybook-pages.yml PR dry-run)
    // Already ran documentation:build and build-storybook above
    
    // Now verify assembly
    console.log(`\n${"=".repeat(80)}`);
    console.log(`▶ Pages: Verify build assembly (dry-run)`);
    console.log(`${"=".repeat(80)}\n`);
    
    const start = Date.now();
    const docsDir = join(rootDir, "documentation/documentation-static-check");
    const storybookDir = join(rootDir, "storybook-static");
    
    let assemblyFailed = false;
    
    if (!existsSync(docsDir)) {
      console.error("❌ Documentation build output not found at documentation/documentation-static-check/");
      assemblyFailed = true;
    } else if (!existsSync(join(docsDir, "index.html"))) {
      console.error("❌ Documentation index.html not found");
      assemblyFailed = true;
    } else {
      console.log("✓ Documentation build found: documentation/documentation-static-check/index.html");
    }
    
    if (!existsSync(storybookDir)) {
      console.error("❌ Storybook build output not found at storybook-static/");
      assemblyFailed = true;
    } else if (!existsSync(join(storybookDir, "index.html"))) {
      console.error("❌ Storybook index.html not found");
      assemblyFailed = true;
    } else {
      console.log("✓ Storybook build found: storybook-static/index.html");
    }
    
    const duration = Date.now() - start;
    
    if (assemblyFailed) {
      console.error("\n❌ Pages assembly verification failed\n");
      results.push({
        label: "Pages: Verify build assembly",
        status: "✗",
        duration,
        code: 1,
      });
      timings.push(`✗ Pages: Verify build assembly (${formatDuration(duration)})`);
      
      if (!flags.keepGoing) {
        printSummary();
        process.exit(1);
      }
    } else {
      console.log("\n✓ Pages assembly verification passed\n");
      results.push({
        label: "Pages: Verify build assembly",
        status: "✓",
        duration,
        code: 0,
      });
      timings.push(`✓ Pages: Verify build assembly (${formatDuration(duration)})`);
    }
  }
  
  // Final check: verify no uncommitted generated artifacts after all steps
  console.log(`\n${"=".repeat(80)}`);
  console.log(`▶ Final: Verify no uncommitted changes from CI steps`);
  console.log(`${"=".repeat(80)}\n`);
  
  const finalStart = Date.now();
  const proc = spawn("git", ["status", "--porcelain"], {
    cwd: rootDir,
    stdio: "pipe",
  });
  
  let output = "";
  proc.stdout.on("data", (data) => {
    output += data.toString();
  });
  
  proc.on("close", (_code) => {
    const duration = Date.now() - finalStart;
    const changes = output.trim();
    
    if (changes) {
      console.error("❌ Working tree has uncommitted changes after CI steps:\n");
      console.error(changes);
      console.error("\nCI steps should not modify tracked files.");
      console.error("Commit or regenerate these changes before pushing.\n");
      
      results.push({
        label: "Final: No uncommitted changes",
        status: "✗",
        duration,
        code: 1,
      });
      timings.push(`✗ Final: No uncommitted changes (${formatDuration(duration)})`);
      
      printSummary();
      process.exit(1);
    } else {
      console.log("✓ Working tree is clean after CI steps\n");
      results.push({
        label: "Final: No uncommitted changes",
        status: "✓",
        duration,
        code: 0,
      });
      timings.push(`✓ Final: No uncommitted changes (${formatDuration(duration)})`);
      
      printSummary();
      
      const failed = results.filter((r) => r.code !== 0).length;
      process.exit(failed > 0 ? 1 : 0);
    }
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
