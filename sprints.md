# React wrappers

**Goal.** One implementation (the custom element) + generated React wrappers + JSX types. React is a binding, not a fork.

**Default DX.** `import { RowanButton } from "@rowan-ui/core/react"` (or `@rowan-ui/core/react/button`). Raw `<rowan-button>` stays first-class. `useRowanElement` remains an escape hatch.

**Non-negotiables.** Vanilla hosts. No React-only behavior. Objects/arrays stay property-only. Events stay `rowan-*` (`onRowanChange`, never `onChange`). Wrappers do not register as Server Components. CEM is the contract.

**Status.** Sprint 1 in progress (CEM plugin + public-API check landed locally).

---

## Sprint 1 — CEM public contract

**Status:** in progress

The published `custom-elements.json` is the source of truth for wrappers, docs, and types. Today it includes private fields, static internals, and lifecycle methods that must not become React props.

### Done when

- [x] Analyzer plugin strips private/`#` members, statics, and host lifecycle from published CEM (core, icons, MapLibre).
- [ ] `npm run analyze` is still the only generator; CI `Verify generated artifacts` stays green.
- [x] A check fails if a `tagName` is missing or a private member leaks into the published manifest.
- [x] Public instance fields (including property-only `config`) and `@event` names remain.

### Out of scope

Wrapper files, new package exports, Storybook React rewrite.

---

## Sprint 2 — Generate wrappers from CEM

**Status:** not started

Generate checked-in React bindings from the public CEM. Prefer a small Rowan generator (vanilla hosts, property-only objects) over Lit-only helpers. `@wc-toolkit/react-wrappers` is the fallback if it assigns properties for objects and maps `rowan-change` → `onRowanChange` without aliases.

### Done when

- [ ] `npm run analyze` (or a follow-on `npm run react:generate`) emits wrapper modules from CEM.
- [ ] Barrel: `@rowan-ui/core/react` exports components + existing JSX types + `useRowanElement`.
- [ ] Per-component: `@rowan-ui/core/react/button` (tree-shakeable).
- [ ] Wrapper import loads the element module (client define). No `defineAll()` as the only path.
- [ ] Generated output is committed; CI fails if it is stale.

### Out of scope

Storybook rewrite, dropping the hook.

---

## Sprint 3 — Wrapper runtime

**Status:** not started

Thin `forwardRef` facades. No extra React state.

| Prop kind                      | Behavior                                         |
| ------------------------------ | ------------------------------------------------ |
| Scalar (string/number/boolean) | Attribute or matching property                   |
| Object/array/function          | Property assignment only                         |
| `onRowan*`                     | `addEventListener("rowan-*")` with `CustomEvent` |
| `ref`                          | The host element                                 |
| `children`                     | Default slot; named slots stay `slot="..."`      |

### Done when

- [ ] Button: `onRowanClick` fires from user activation only.
- [ ] Table: `config` / `selected` assigned as properties; caption lives on `config`.
- [ ] React 18: boolean `disabled={false}` does not stringify onto the attribute.
- [ ] Existing `useRowanElement` tests still pass.
- [ ] `test:package` still proves registration is import-time, not a React-only side path.

---

## Sprint 4 — Types

**Status:** not started

### Done when

- [ ] Each wrapper is `ForwardRefExoticComponent<Props & RefAttributes<HostElement>>`.
- [ ] Props use host property names (camelCase); events are `onRowan*`.
- [ ] JSX intrinsic types for `<rowan-button>` remain.
- [ ] `type-tests/` cover wrapper props, event detail, and tag JSX.

---

## Sprint 5 — Docs and Storybook

**Status:** not started

### Done when

- [ ] README recommends the wrapper for React; shows tag + `RowanButton` side by side.
- [ ] Storybook **Using Rowan from React** uses wrappers as the default example; raw tag remains.
- [ ] Copilot brief: wrappers are generated from CEM; do not hand-edit them.
- [ ] CHANGELOG records the React export as the binding layer.

---

## Later / not this track

- MapLibre / icons wrapper barrels (follow the same generator once core is proven).
- Vue/Svelte wrappers.
- Dropping `useRowanElement` (keep until wrappers cover property-only + events).
