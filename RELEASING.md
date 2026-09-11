# Releasing Rowan

Rowan publishes its source ESM modules directly. A release must contain the `src/` runtime modules, generated `types/` declarations, and the generated Custom Elements Manifest; it does not create a JavaScript bundle.

## Prepare

1. Update `package.json` using semantic versioning and record user-visible API changes in the release notes.
2. Install from the lockfile with `npm ci`.
3. Run the local quality gate:

   ```sh
   npm run lint
   npm run types
   npm run typecheck
   npm test
   npm run analyze
   npm run build-storybook
   ```

4. When rendering, lifecycle, module-registration, or table reconciliation changes, refresh and review the Chromium benchmark baseline:

   ```sh
   npm run benchmark
   ```

5. Confirm generated artifacts are committed and current, including newly generated declaration files:

   ```sh
   changes="$(git status --porcelain --untracked-files=all -- custom-elements.json types)"
   if [[ -n "$changes" ]]; then
     printf '%s\n' "$changes"
     exit 1
   fi
   ```

6. Inspect the published file set without publishing:

   ```sh
   npm pack --dry-run
   ```

## Publish

1. Confirm the CI quality and browser-matrix workflows passed for the release commit.
2. Create an annotated version tag after the release commit is merged.
3. Publish the scoped public package:

   ```sh
   npm publish --access public
   ```

4. Verify the npm package contains `LICENSE`, `README.md`, `custom-elements.json`, `src/`, and `types/`.
5. Publish release notes with the version tag and any browser-support changes.

## Browser Baseline

Rowan's automated compatibility baseline covers Chromium, Firefox, and WebKit supplied by the pinned Playwright release. The CI browser matrix runs component contracts against each engine. This verifies current engine-family behavior, not a historical browser-version support window or Safari-specific integrations. Form-associated behavior remains capability-dependent: browsers without `ElementInternals` retain the internal native-control fallback, but cannot provide host-level form association.
