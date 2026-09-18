# React wrappers

**Goal.** One implementation (the custom element) + generated React wrappers + JSX types. React is a binding, not a fork.

**Default DX.** `import { RowanButton } from "@rowan-ui/core/react/button"`. Raw `<rowan-button>` stays first-class. `useRowanElement` remains an escape hatch.

**Non-negotiables.** Vanilla hosts. No React-only behavior. Objects/arrays stay property-only. Events stay `rowan-*` (`onRowanChange`, never `onChange`). Wrappers do not register as Server Components. CEM is the contract.

**Status.** Sprints 1–9 landed on main.

---

## Sprint 1 — CEM public contract

**Status:** done

The published `custom-elements.json` is the source of truth for wrappers, docs, and types. Today it includes private fields, static internals, and lifecycle methods that must not become React props.

### Done when

- [x] Analyzer plugin strips private/`#` members, statics, and host lifecycle from published CEM (core, icons, MapLibre).
- [x] `npm run analyze` is still the only generator; CI `Verify generated artifacts` stays green.
- [x] A check fails if a `tagName` is missing or a private member leaks into the published manifest.
- [x] Public instance fields (including property-only `config`) and `@event` names remain.
- [x] Positive pins: `rowan-button` variant/disabled/`rowan-click`, `rowan-table` config/selected/`rowan-select`.

### Out of scope

Wrapper files, new package exports, Storybook React rewrite.

---

## Sprint 2 — Generate wrappers from CEM

**Status:** done

Generate checked-in React bindings from the public CEM. Prefer a small Rowan generator (vanilla hosts, property-only objects) over Lit-only helpers. `@wc-toolkit/react-wrappers` is the fallback if it assigns properties for objects and maps `rowan-change` → `onRowanChange` without aliases.

### Done when

- [x] `npm run analyze` (or a follow-on `npm run react:generate`) emits wrapper modules from CEM.
- [x] `@rowan-ui/core/react` stays the hook + JSX types (no define-all).
- [x] Per-component: `@rowan-ui/core/react/button`. All wrappers: `@rowan-ui/core/react/components`.
- [x] Wrapper import loads the element module (client define). No `defineAll()` as the only path.
- [x] Generated output is committed; CI fails if it is stale.

### Out of scope

Storybook rewrite, dropping the hook.

---

## Sprint 3 — Wrapper runtime

**Status:** done

Thin `forwardRef` facades. No extra React state.

| Prop kind                      | Behavior                                         |
| ------------------------------ | ------------------------------------------------ |
| Scalar (string/number/boolean) | Attribute or matching property                   |
| Object/array/function          | Property assignment only                         |
| `onRowan*`                     | `addEventListener("rowan-*")` with `CustomEvent` |
| `ref`                          | The host element                                 |
| `children`                     | Default slot; named slots stay `slot="..."`      |

### Done when

- [x] Button: `onRowanClick` fires from user activation only.
- [x] Table: `config` / `selected` assigned as properties; caption lives on `config`.
- [x] React 18: boolean `disabled={false}` does not stringify onto the attribute.
- [x] Existing `useRowanElement` tests still pass.
- [x] `test:package` still proves registration is import-time, not a React-only side path.

---

## Sprint 4 — Types

**Status:** done

### Done when

- [x] Each wrapper is `ForwardRefExoticComponent<Props & RefAttributes<HostElement>>`.
- [x] Props use host property names (camelCase); events are `onRowan*`.
- [x] JSX intrinsic types for `<rowan-button>` remain.
- [x] `type-tests/` cover wrapper props, event detail, and tag JSX.

---

## Sprint 5 — Docs and Storybook

**Status:** done

### Done when

- [x] README recommends the wrapper for React; shows tag + `RowanButton` side by side.
- [x] Storybook **Using Rowan from React** uses wrappers as the default example; raw tag remains.
- [x] Copilot brief: wrappers are generated from CEM; do not hand-edit them.
- [x] CHANGELOG records the React export as the binding layer.

---

## Sprint 6 — Icons and MapLibre wrappers

**Status:** done

### Done when

- [x] Same generator emits `@rowan-ui/icons/react/icon` and `@rowan-ui/maplibre/react/map`.
- [x] Wrappers import `createRowanComponent` from core; HTML icon usage stays core-free.
- [x] CI fails if those generated trees are stale.

## Sprint 7 — Side nav: none-selected and sections

**Status:** done

Admin apps need one rail with labeled groups and a way to clear selection (no dummy `__none__` values).

### Done when

- [x] `value=""` (or clearing `value`) means no item is active. Do not revive an item marked `active`.
- [x] Initial HTML without `value` may still adopt a child with `active`.
- [x] `rowan-side-nav-section` renders a group label; items inside stay on the parent nav’s single `value` and keyboard sequence.
- [x] Tests cover clear-selection, explicit empty vs declared `active`, and sectioned items.

## Sprint 8 — Side nav: SPA destinations

**Status:** done

### Done when

- [x] In-app `href` still uses a real `<a>`. `rowan-change` is cancelable; `preventDefault` blocks navigation (same idea as table link actions).
- [x] No-`href` items stay `role="button"` and emit `rowan-change` only.
- [x] README documents both SPA patterns.

## Sprint 9 — Slotted dropdown trigger and touched-invalid fields

**Status:** done

### Done when

- [x] `rowan-dropdown` keeps the default secondary button and accepts a `trigger` slot (avatar / icon-only).
- [x] FACE text fields do not paint `invalid` until the user has interacted or the form was submitted (`:user-invalid` / touched).

## Release — npm 0.5.0

**Status:** `@rowan-ui/core@0.6.1` is on npm. Git is `0.6.2` (dark Storybook chrome, bulk confirm recipe). Publish `0.6.2` after this lands on `main`.

- [x] README, Storybook Home, and docs install `@rowan-ui/core @rowan-ui/icons`.
- [x] Package metadata (`repository`, `publishConfig.access`) on core and icons.
- [x] Tag workflow publishes core, then icons. `v0.5.0` is tagged.
- [x] npm org `rowan-ui` and repo secret `NPM_TOKEN`.

## Admin-shell follow-through

**Goal.** Fix the CSS bugs that make shipped widgets look broken in a real admin app, then the APIs that app had to invent.

**Status.** Sprint 4 done. Admin-shell follow-through is complete.

### Sprint 1 — P0 layout bugs

**Status:** done

- [x] `rowan-row-details-panel`: native `<dialog>` fills the viewport so the absolute drawer is not ~0px tall.
- [x] Table `.pagination[hidden]` is `display: none` (author `display: inline-flex` must not beat `hidden`).
- [x] Compact `rowan-app-layout` closed nav does not peek over content (`visibility`, `pointer-events`, no leftover shadow).

### Sprint 2 — P1 details panel and table cells

**Status:** done

- [x] Details panel queue: walk a multi-select (`rowIds` / prev-next or a documented pager slot).
- [x] Details panel `size` (`sm | md | lg`) mapping to `--rowan-row-details-panel-width`.
- [x] Document `panel.show(row)` as the open API; stop React `open={false}` from clobbering an open panel.
- [x] Table `type: "sparkline"` (`value` is `number[]`, optional `tone`).
- [x] React wrappers keep chart `labels` (do not drop it because of FACE `BaseElement.labels`).

### Sprint 3 — P2 composition and packaging

**Status:** done

- [x] One table chrome: toolbar = filters/density; bulk bar = selection count. Docs, no duplicate “N selected.”
- [x] `applyFilters(rows, filters)` from `@rowan-ui/core/filter-builder`.
- [x] Icons peer on published core `^0.6.0` (consume `@rowan-ui/icons@0.6.0`).
- [x] `caption-visually-hidden` (or equivalent) so a caption can name the table without duplicating a page `h1`.

### Sprint 4 — P3 docs

**Status:** done

- [x] Storybook recipe: table + bulk actions + `rowan-dialog` alert (Flag / Assign).
- [x] Do not promote KPI / sparkline / donut until Sprint 2 sparkline cell type and wrapper `labels` land.

## Later / not this track

- Vue/Svelte wrappers.
- Dropping `useRowanElement` (keep until wrappers cover property-only + events).
- Data/dashboard track: `sprints-data.md` (Sprints 1–8 done; KPI / sparkline / donut promoted to Stable).
