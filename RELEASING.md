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
   npm run test:package
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

## Optional Integration Packages

Optional packages publish separately from `@rowan-ui/core`. Before releasing one,
install from the workspace lockfile and run its own package gate. For the MapLibre
adapter, this verifies that the provider remains a peer dependency rather than
entering the core package:

```sh
npm run lint --workspace=@rowan-ui/maplibre
npm run types --workspace=@rowan-ui/maplibre
npm run typecheck --workspace=@rowan-ui/maplibre
npm run test --workspace=@rowan-ui/maplibre
npm run analyze --workspace=@rowan-ui/maplibre
npm pack --dry-run --workspace=@rowan-ui/maplibre
```

For the icon package, this verifies that the generated source and declarations
remain complete, directly importable, and source-attributed without introducing a
runtime dependency into core:

```sh
npm run lint --workspace=@rowan-ui/icons
npm run verify --workspace=@rowan-ui/icons
npm run types --workspace=@rowan-ui/icons
npm run typecheck --workspace=@rowan-ui/icons
npm run test --workspace=@rowan-ui/icons
npm pack --dry-run --workspace=@rowan-ui/icons
```

Commit each optional package's generated `types/` artifacts with its source.
Packages defining custom elements must also commit `custom-elements.json`. Before
publishing MapLibre, verify that provider tokens, default tile URLs, and
application-owned credentials are absent. Before publishing icons, verify that
the generated icon count, `NOTICE`, and Lucide source-license attribution are
present in the packed file set.

## First 0.5.0 cut

`@rowan-ui/core` publishes first. Icons and MapLibre peer on core `^0.5.0`, so
they follow. The workflow skips a package if that version is already on the
registry.

1. Create the npm org `rowan-ui` if it does not exist, and a granular access
   token with publish permission for `@rowan-ui/core` and `@rowan-ui/icons`.
2. Store that token as the repo secret `NPM_TOKEN`.
3. Merge the release commit, then push an annotated tag:

   ```sh
   git tag -a v0.5.0 -m "v0.5.0"
   git push origin v0.5.0
   ```

4. `.github/workflows/publish.yml` publishes core, then icons, then MapLibre,
   with provenance. To publish from a machine instead:

   ```sh
   npm publish --access public
   npm publish --access public --workspace=@rowan-ui/icons
   npm publish --access public --workspace=@rowan-ui/maplibre
   ```

## 0.6.0 cut

Version in `package.json` is `0.6.0` for core, icons, and MapLibre. Do **not**
call this `1.0`. Experimental KPI/sparkline/bar/donut may still change. Publish
is a separate step after this catalog commit is on `main`: tag `v0.6.0` so the
workflow publishes core, then icons. MapLibre is included in the publish
workflow only if that step is present.

## 0.10.0 cut

Version in `package.json` is `0.10.0` for core, icons, and MapLibre. Do **not**
call this `1.0`. Experimental source-meta, data-state, area, stacked-bar,
bullet, gauge, and image may still change. Publish is a separate step after
this catalog commit is on `main`: tag `v0.10.0`.

## Publish

1. Confirm the CI quality and browser-matrix workflows passed for the release commit.
2. Create an annotated version tag after the release commit is merged.
3. The publish workflow publishes `@rowan-ui/core`, then `@rowan-ui/icons`, then
   `@rowan-ui/maplibre`. It skips a version that is already on the registry. Do
   not use `npm publish --workspaces` (that would include test fixtures).
   To publish a single package from a machine:

   ```sh
   npm publish --access public
   npm publish --access public --workspace=@rowan-ui/icons
   npm publish --access public --workspace=@rowan-ui/maplibre
   ```

4. Verify the npm package contains `LICENSE`, `README.md`, `src/`, and `types/`; packages with third-party assets must also include their source notice, and packages defining custom elements must include `custom-elements.json`. The tarball must not include `*.test.js`, `*.stories.js`, or `src/storybook/`.
5. Publish release notes with the version tag and any browser-support changes.

## Storybook Pages

https://2351labs.github.io/rowan/ is Storybook, deployed by `.github/workflows/storybook-pages.yml`.

GitHub Pages **Source** must be **GitHub Actions**. If it is set to Deploy from a branch (`main`), GitHub runs Jekyll on `README.md` and the Storybook UI disappears.

```sh
gh api repos/2351Labs/rowan/pages --jq .build_type
# must print: workflow
```

To restore:

```sh
gh api repos/2351Labs/rowan/pages -X PUT -f build_type=workflow
gh workflow run storybook-pages.yml --ref main
```

## Browser Baseline

Rowan's automated compatibility baseline covers Chromium, Firefox, and WebKit supplied by the pinned Playwright release. The CI browser matrix runs component contracts against each engine. This verifies current engine-family behavior, not a historical browser-version support window or Safari-specific integrations. Form-associated behavior remains capability-dependent: browsers without `ElementInternals` retain the internal native-control fallback, but cannot provide host-level form association.
