# Rowan bug log

Findings from the staff frontend review of the public `@rowan-ui/core` surface.
IDs `F-NN` are stable and referenced by the review write-up.

## Triage summary

| ID   | Title                                                                    | Severity | Status                                              |
| ---- | ------------------------------------------------------------------------ | -------- | --------------------------------------------------- |
| F-01 | Component tokens hard-code light literals, breaking documented theming   | Blocker  | **Fixed** — closes BUG 1/2/3                        |
| F-02 | Eight components bypass tokens entirely and cannot be themed             | High     | **Fixed**                                           |
| F-03 | `useRowanElement` re-assigns properties and listeners every React render | High     | **Fixed**                                           |
| F-04 | `reflectStringAttribute` cannot represent an empty string                | Medium   | **Won't fix** — documented                          |
| F-05 | `#syncFormDisabledState` disables inner controls but never re-enables    | Medium   | **Fixed**                                           |
| F-06 | No standard validity surface on any form-associated component            | High     | **Fixed**                                           |
| F-07 | Every render resets validity, erasing consumer-set custom errors         | High     | **Fixed**                                           |
| F-08 | `type="password"` reflects the secret into a DOM attribute               | High     | **Fixed**                                           |
| F-09 | Per-keystroke attribute reflection risks IME and caret behavior          | Medium   | **Fixed**                                           |
| F-10 | External `<label for>` never names the control                           | High     | **Fixed**                                           |
| F-11 | Four similar controls use four different interaction architectures       | Medium   | **Fixed** (combobox converged)                      |
| F-12 | Overlay focusable allowlist omits most Rowan form controls               | High     | **Fixed**                                           |
| F-13 | Document-wide focus recapture with no overlay stack                      | High     | **Fixed**                                           |
| F-14 | No scroll lock or background inert while a modal is open                 | Medium   | **Fixed** — all modal overlays on native `<dialog>` |
| F-15 | No forced-colors support                                                 | Medium   | **Fixed** (state-bearing surfaces)                  |
| F-16 | `0.1.0` surface is not marked for stability                              | Medium   | **Fixed**                                           |
| F-17 | Dark-theme test validates the shipped theme, not the documented one      | High     | **Fixed**                                           |
| F-18 | Untested axes                                                            | Medium   | Open                                                |

---

## Original reports (duplicates) — Fixed

The three reports below are **all the same defect**, not three separate bugs.
Each is an instance of **F-01**: the component token layer hard-coded light
literal colors, so a theme that only overrode the semantic layer flipped the text
color to light while leaving the surface light. `rowan-card` failed identically
and was never filed. All four are fixed by the F-01 change below.

Measured contrast in dark mode, before and after:

| Component         | Before | After |
| ----------------- | ------ | ----- |
| rowan-chip        | ~1     | 13.26 |
| rowan-date-picker | ~1     | 15.74 |
| rowan-dialog      | ~1     | 15.74 |
| rowan-card        | ~1     | 15.74 |
| rowan-alert       | 1.03   | 12.44 |

### BUG 1: rowan-chip dark mode

rowan-chip dark mode text is unreadable

> **Duplicate of F-01. Fixed.** Was caused by `--rowan-chip-bg: #eef3ef` in `src/tokens/tokens.css`.

### BUG 2: rowan-datepicker dark mode

rowan-datepicker dark mode text is unreadable

> **Duplicate of F-01. Fixed.** Was caused by `--rowan-field-bg: #ffffff` in `src/tokens/tokens.css`.

### BUG 3: rowan-dialog dark mode

rowan-dialog dark mode text is unreadable

> **Duplicate of F-01. Fixed.** Was caused by `--rowan-dialog-bg: #ffffff` in `src/tokens/tokens.css`.

---

## Foundation

### F-01: Component tokens hard-code light literals, breaking documented theming

- **Severity:** Blocker
- **Area:** `src/tokens/tokens.css`, `src/tokens/themes/dark.css`, `README.md` (Theming), `documentation/app.js` (theme override example)
- **Contract:** README states teams "theme once and keep component APIs stable", with the semantic layer as the entry point. Components read layer 3 falling back to layer 2.
- **Evidence:** The component layer defines literals rather than derivations: `--rowan-chip-bg: #eef3ef`, `--rowan-dialog-bg: #ffffff`, `--rowan-field-bg: #ffffff`, `--rowan-card-bg: #ffffff`. The README dark example sets only `--rowan-color-bg`, `--rowan-color-fg`, `--rowan-color-accent`, `--rowan-button-fg`. The shipped `dark.css` works only because it manually re-declares every literal component token.
- **Impact:** Any team theming the way the docs describe gets light surfaces with light dark-theme text. `--rowan-color-fg` flips to `#ecf0e9` while `--rowan-chip-bg` stays `#eef3ef`. Produces BUG 1, BUG 2, BUG 3, and an unfiled `rowan-card` failure.
- **Fix:** Derive literal component tokens from the semantic layer, e.g. `--rowan-dialog-bg: var(--rowan-color-bg)`, `--rowan-field-bg: var(--rowan-color-bg)`, `--rowan-chip-bg: color-mix(in srgb, var(--rowan-color-accent) 8%, var(--rowan-color-bg))`. `dark.css` then shrinks to the semantic layer. Any genuinely required literal must be listed in a documented "must override per theme" table.
- **Test:** Apply a dark theme setting **only** the six semantic tokens, then assert >= 4.5:1 contrast on chip, dialog, date-picker, and card. This is `theme.test.js` without the `dark.css` import; it fails today.

**Resolution (fixed).** Added four semantic tokens — `--rowan-color-surface`,
`--rowan-color-accent-contrast`, `--rowan-color-success`, `--rowan-color-warning`
— and rewrote the literal component tokens as derivations of the semantic layer
(`--rowan-dialog-bg: var(--rowan-color-surface)`, `--rowan-chip-bg: color-mix(…
var(--rowan-color-bg))`, and so on). `--rowan-color-surface` and
`--rowan-color-accent-contrast` both default to `var(--rowan-color-bg)`, so a
theme that sets only the semantic layer is readable by construction; themes may
still elevate the surface. Literal `var()` fallbacks in `chip.css`, `dialog.css`,
`date-picker.css`, and `card.css` were replaced with the same derivations.

**An important CSS constraint was found while fixing this.** A custom property
declared as `var(--other)` resolves _where it is declared_ and inherits as an
already-computed value. A derivation declared at `:root` therefore does **not**
re-resolve inside a nested `[data-theme]` wrapper. This is why the shipped
`dark.css` re-declares component tokens: it is required, not redundant.
Collapsing the theme files to the semantic layer regressed nested-scope theming
and was reverted; `light.css` and `dark.css` now re-declare the same tokens as
derivations. Root-level theming — the documented pattern — needs no duplication.
This constraint is now documented in the README theming section.

### F-02: Eight components bypass tokens entirely and cannot be themed

- **Severity:** High
- **Area:** `src/alert/alert.css`, `src/badge/badge.css`, `src/avatar/avatar.css`, `src/menu-item/menu-item.css`, `src/progress/progress.css`, `src/switch/switch.css`, `src/table/table.css`, `src/tooltip/tooltip.css`
- **Contract:** Layer-3 model — every themeable surface has a component token hook.
- **Evidence:** These declare raw hex with no `var()` at all. `alert.css` uses `background: #eef3ef` and `border: ... #c9d6cb` next to `color: var(--rowan-color-fg)`. `table.css` hard-codes both `background: #dce4d9` and `color: #2a3a2d`.
- **Impact:** Strictly worse than F-01 — unreachable from any stylesheet, including the shipped `dark.css`. `rowan-alert` renders a light panel with light text in dark mode. Also guarantees forced-colors failure.
- **Fix:** Route each through a component token defaulting to a semantic derivation, then add dark values to `dark.css`. No API or markup change.
- **Test:** Assert no file under `src/**/*.css` declares `background`, `color`, or `border-color` as a literal hex outside `tokens.css`. A lint rule makes this non-regressable.

**Resolution (fixed).** `rowan-alert` measured **1.03** contrast in dark mode on
the live documentation site, confirming this was user-visible and not theoretical.
Each hard-coded surface now goes through a token hook with a semantic-derived
fallback, for example
`background: var(--rowan-alert-bg, color-mix(in srgb, var(--rowan-color-accent) 10%, var(--rowan-color-bg)))`.
Because the fallback is evaluated at the component rather than at `:root`, it
re-resolves correctly in nested theme scopes and needs no per-theme duplication.
Fixed in `alert`, `badge`, `avatar`, `menu-item`, `progress`, `tooltip`, and
`table` (header and avatar fallback). `rowan-tooltip` now inverts through
`var(--rowan-tooltip-bg, var(--rowan-color-fg))`, so it stays inverted in both
themes. Alert tones now measure 12.44–13.33.

**Deferred:** `src/switch/switch.css` still hard-codes `#ffffff` for the thumb.
The thumb must contrast with both the accent-filled on-track and the neutral
off-track, so a single derivation is not obviously correct; it needs a design
decision rather than a mechanical substitution. It is not a readability failure
today because the thumb also carries a border.

> Superseded by the update below. The "not a readability failure" claim was wrong.

**Update — switch thumb fixed; the deferral note was wrong.**

The claim that this was "not a readability failure today because the thumb also carries a
border" was incorrect on both counts. The thumb carries a `box-shadow`, not a border, and
measured in a browser the white thumb sat at **1.39** contrast against the light off-track
— a genuine SC 1.4.11 failure, not merely an unthemeable value.

The reason a single derivation looked wrong is real, though: the accent inverts between
themes (`#1d432f` dark in light theme, `#7fc095` light in dark theme), so the thumb's
contrast partner flips. One colour cannot serve both tracks. The fix is that the thumb
changes with the track:

```css
.thumb {
  background: var(--rowan-switch-thumb-bg, var(--rowan-color-muted));
}
.input:checked + .track .thumb {
  background: var(--rowan-switch-thumb-checked-bg, var(--rowan-color-accent-contrast));
}
```

This also reads better: the thumb brightens as the track fills, so state is carried by
position, track colour, _and_ thumb colour rather than position alone. The track gained
`--rowan-switch-track-bg` / `--rowan-switch-track-checked-bg` hooks for layer-3 parity.
Worst case is now **6.66**, up from 1.39, and all four theme/state combinations clear 3:1.

**The lint rule this finding asked for now exists.** `scripts/check-css-tokens.mjs` runs in
`npm run lint` as `css:check`. It strips `var()` expressions innermost-first and fails on
any colour literal that remains, which encodes the actual contract: a hex is fine as a
`var()` fallback, but never as the only value. Surveying the codebase found 53 hex literals
of which 52 were legitimate `var(--token, #fallback)` fallbacks and exactly one — the switch
thumb — was unreachable. The `rowan-color-picker` swatch checkerboard was also routed
through `--rowan-color-picker-checker-light` / `-dark`.

Both guards were verified to fail before being trusted: reintroducing `background: #ffffff`
makes `css:check` exit 1 and makes the new theme test fail at 1.39.

### F-03: `useRowanElement` re-assigns properties and listeners every React render

- **Severity:** High
- **Area:** `src/react/index.js` — both `useEffect` calls
- **Contract:** React support is "types + `useRowanElement()` only"; parent-assigned values stay silent and cheap.
- **Evidence:** Neither `useEffect` has a dependency array. The first re-runs `element[name] = value` for every entry on every render; the second removes and re-adds every listener on every render.
- **Impact:** For the property-only object/array APIs this hook exists to serve (`table.config`, `.rows`, `.columns`, `combobox.options`), a new literal each render means new object identity each render, so the table re-reconciles continuously. A parent re-rendering on scroll or hover silently degrades into repeated full table work.
- **Fix:** Assign only when `element[name] !== value`, and give the event effect a dependency list derived from `Object.keys(events)` so listeners rebind only when handlers change.
- **Test:** Render twice with an unchanged `config`; assert the property setter ran once and `addEventListener` was called once.

**Resolution (fixed).** Properties are compared with `Object.is` against the last
applied value and assigned only on change, so a property-only object keeps its
identity across renders. The cache resets when React swaps the host element.
Listeners now bind once per event type and dispatch through a ref to the latest
handler, so a new inline handler no longer rebinds the listener.

### F-04: `reflectStringAttribute` cannot represent an empty string

- **Severity:** Medium
- **Area:** `src/lib/reflect.js` — `reflectStringAttribute`
- **Contract:** Attribute/property reflection for scalars.
- **Evidence:** `if (value == null || value === "") { element.removeAttribute(...) }` treats `""` and `null` identically.
- **Impact:** "Explicitly empty" and "absent" are indistinguishable in the DOM. It round-trips for `value` because the getter defaults to `""`, but it defeats any token where empty is meaningful and makes attribute-driven debugging misleading.
- **Fix:** Remove only on `null`/`undefined`; set `""` explicitly. Preserve the current collapse where intentional by passing `value || null` at the call site, as several components already do.
- **Test:** Set `el.value = ""` and assert `el.hasAttribute("value")` matches the documented intent.

**Resolution (won't fix; documented).** Changing the default would add `value=""`
and similar empty attributes across 76 components for no behavioural gain: every
Rowan getter defaults to `""`, so the property already round-trips. The collapse is
now stated in the `reflectStringAttribute` JSDoc, with the `value || null` idiom
noted for call sites that want it to be explicit. Revisit only if a token appears
where empty and absent must differ.

### F-05: `#syncFormDisabledState` disables inner controls but never re-enables

- **Severity:** Medium (latent/conditional)
- **Area:** `src/lib/base-element.js` — `#syncFormDisabledState`
- **Contract:** Disabled `<fieldset>` support must be reversible.
- **Evidence:** The method force-sets `control.disabled = true` for every `input, select, textarea, button` in the shadow root when disabled, but the `if (disabled)` branch has no `else` restoring `false`.
- **Impact:** Recovery depends on each component re-asserting `control.disabled = this.disabled` in `render()`. `text-field` does and recovers; any component that does not stays permanently disabled after a fieldset is re-enabled. The base-class asymmetry and the `text-field` recovery path were verified; all 19 controls were not audited.
- **Fix:** Make it symmetric — track which controls the base class disabled and restore them, instead of relying on subclass discipline.
- **Test:** Wrap each FACE control in `<fieldset disabled>`, re-enable it, and assert the inner control is interactive.

**Resolution (fixed).** `BaseElement` now records which controls it disabled and
re-enables exactly those, leaving controls the component disabled on its own
untouched. Covered by a `<fieldset disabled>` round-trip test.

---

## Forms / FACE

### F-06: No standard validity surface on any form-associated component

- **Severity:** High
- **Area:** all 19 components with `static formAssociated = true`
- **Contract:** "All FACE where they represent a value."
- **Evidence:** A repo-wide search for `setCustomValidity`, `get validity(`, `validationMessage`, `willValidate`, `get labels(`, `get form(` returns no public implementations — only internal reads of the inner input's `validationMessage`. Components expose `checkValidity`, `reportValidity`, and a non-standard `setValidity(flags, message, anchor)`.
- **Impact:** Consumers cannot use `el.validity.valueMissing`, `el.validationMessage`, `el.form`, `el.labels`, or `el.setCustomValidity(...)`. Rowan's own `src/form-wizard/form-wizard.js` and `src/validation-summary/validation-summary.js` read `control.validationMessage`, which resolves to `undefined` for a Rowan control, so Rowan's own error summary silently falls back to its generic string.
- **Fix:** Add thin forwarders on the shared base for FACE elements delegating to `this.internals`, plus a standard `setCustomValidity(message)`. Roughly 20 lines once, not per component.
- **Test:** Per control: set invalid, assert `el.validity.valueMissing === true`, `el.validationMessage` non-empty, and `el.form` resolves to the containing form.

**Resolution (fixed).** `BaseElement` now exposes `validity`, `validationMessage`,
`willValidate`, `form`, `labels`, and `setCustomValidity(message)`, each guarded by
`static formAssociated` so non-form components are unaffected. All 19 form controls
inherit the surface at once.

### F-07: Every render resets validity, erasing consumer-set custom errors

- **Severity:** High
- **Area:** `src/text-field/text-field.js` `render()` -> `#syncValidity()`; same shape in `date-picker`, `number-field`, `textarea`, `combobox`, `select`
- **Contract:** `customError` is part of FACE; server-side errors are the primary real-world use.
- **Evidence:** `render()` ends with `#syncFormValue()` then `#syncValidity()`. `#syncValidity()` mirrors the native inner input's validity and, when that input is valid, calls `setValidity({}, "", this.#input)` unconditionally.
- **Impact:** A consumer sets "Email already registered". Any later attribute change — including an unrelated one such as `placeholder`, since `attributeChangedCallback` calls `requestRender()` — wipes it on the next microtask, with no API call and no event. Silent failure in the async-validation flow teams need most.
- **Fix:** Track the custom-error message separately and merge it in `#syncValidity()`; clear `customError` only when the consumer clears it via `setCustomValidity("")`.
- **Test:** Set a custom error, change an unrelated attribute, flush microtasks, assert `validity.customError` is still `true`.

**Resolution (fixed).** `BaseElement.applyValidity(flags, message, anchor)` merges the
consumer's custom error into every validity write, so a render cannot erase it.
All 19 controls now route their `setValidity` through it instead of calling
`internals.setValidity` directly. `setCustomValidity("")` clears it.

### F-08: `type="password"` reflects the secret into a DOM attribute

- **Severity:** High
- **Area:** `src/text-field/text-field.js` — `set value` -> `reflectString("value", value)`, with the `input` listener assigning on every keystroke
- **Contract:** Scalars may reflect, but this is a security boundary; native `<input>` deliberately does not reflect its live value.
- **Evidence:** The `input` listener runs `this.value = this.#input.value`, and `set value` reflects to the `value` attribute. `type` documents `"password"` as supported.
- **Impact:** The typed password is live in the DOM as `<rowan-text-field type="password" value="hunter2">`, so it is captured by `outerHTML` serialization, DOM snapshots, and session-replay/error-reporting tools, which commonly scrub `input` values but read attributes verbatim. Turns a normal login form into a credential-leak vector.
- **Fix:** Keep `value` property-only for live user input, treating the attribute as the default value as HTML does; or at minimum suppress reflection when `type === "password"`. `formResetCallback` already uses the captured `#defaultValue`, so reset semantics survive.
- **Test:** Type into a `type="password"` field and assert `el.getAttribute("value")` does not contain the typed text.

**Resolution (fixed).** `rowan-text-field` keeps an internal value store. Reflection to
the `value` attribute is suppressed while `type="password"`, and a password value
supplied in markup is read once and then removed from the attribute. Every other
type keeps the documented attribute/property reflection unchanged.

### F-09: Per-keystroke attribute reflection risks IME and caret behavior

- **Severity:** Medium (mechanism identified; not reproduced)
- **Area:** `text-field`, `textarea`, `date-picker`, `number-field`
- **Contract:** Attribute reflection is for state, not a per-keystroke write channel.
- **Evidence:** keystroke -> `set value` -> attribute write -> `attributeChangedCallback` -> `requestRender()` -> `render()` reassigns `this.#input.value`, and `#syncValidity()` reassigns it again.
- **Impact:** Writing back into the input the user is actively typing in is the established way to break IME composition for Japanese/Chinese/Korean input, and forces an attribute mutation plus render per character. Not reproduced in a browser — the docs dev server was unavailable during review.
- **Fix:** Skip the write-back when the inner input already holds the value, and guard on `compositionstart`/`compositionend`.
- **Test:** Dispatch a composition sequence; assert composed text survives and `input.value` is not reassigned mid-composition.

**Resolution (fixed).** `rowan-text-field` tracks `compositionstart`/`compositionend`
and routes every write-back through a helper that skips the assignment while
composing, and skips it entirely when the input already holds the value. The value
is committed on `compositionend`.

### F-10: External `<label for>` never names the control

- **Severity:** High
- **Area:** `text-field`, `date-picker`, `number-field`, `textarea`, `checkbox`, `radio`, `select`, `combobox`
- **Contract:** "Associate labels via `<label for>` using the host id, plus an internal visually-hidden label fallback from the `label` attribute."
- **Evidence:** `render()` names the inner input only from the `label` attribute via `aria-label`. Nothing reads an external `<label for="host-id">`, and `label`/`for` association does not cross the shadow boundary.
- **Impact:** `<label for="email">Email</label><rowan-text-field id="email">` gives click-to-focus through `delegatesFocus`, so it looks wired up, but the accessible name is empty. Invisible in normal use and only surfaces in a screen reader or audit. The documented pattern does not do what it says.
- **Fix:** On connect, resolve `label[for=<host id>]`, mirror its text into the internal hidden label, and observe it for changes; or set `internals.ariaLabel` from it. Keep the `label` attribute as the override.
- **Test:** Render an external `<label for>` with no `label` attribute; assert the computed accessible name equals the label text.

**Resolution (fixed).** `BaseElement.externalLabelText` reads the native
`internals.labels` association, which `<label for>` does establish for a
form-associated custom element, and mirrors the text into the inner control's
accessible name. Wired into 15 controls; the `label` attribute still wins. A
`MutationObserver` re-renders when the external label's text changes.

### F-11: Four similar controls use four different interaction architectures

- **Severity:** Medium
- **Area:** `src/select/select.js`, `src/combobox/combobox.js`, `src/listbox/listbox.js`, `src/multi-select-combobox/multi-select-combobox.js`, `src/command-palette/command-palette.js`
- **Contract:** Pick `aria-activedescendant` or roving tabindex and apply consistently.
- **Evidence:** `select` wraps native `<select>`. `combobox` builds native `<option>` elements into a datalist-style list with no `role`, no `keydown`, and no `aria-activedescendant`. `listbox` implements a custom roving-tabindex listbox over `rowan-option`. `multi-select-combobox` implements its own panel/listbox. `command-palette` is the only user of `aria-activedescendant`.
- **Impact:** Keyboard behavior, stylability, and event timing differ across controls that look like siblings in the docs. `rowan-combobox` inherits datalist's cross-browser inconsistency and near-zero stylability, and sets `internals.ariaExpanded` even though the browser owns that state. Teams needing a styled filterable single-select find only the multi-select variant has one.
- **Fix:** Do not rewrite now. Document the divergence for `0.1.0`, and converge `combobox` onto the `multi-select-combobox` listbox as the single-select case.
- **Test:** One shared keyboard conformance suite (Arrow/Home/End/Enter/Escape/typeahead) run against every list-like control.

**Resolution (deferred, deliberately).** Converging these is a breaking change to
four public keyboard contracts and is not appropriate as part of a defect sweep.
The divergence is recorded here and should be scheduled against a `1.0` milestone,
with `rowan-combobox` moving onto the `multi-select-combobox` listbox as the
single-select case.

**Update — Phase 1 fixed; convergence is Phase 2.**

Re-reading the code turned up two concrete defects hiding inside the
"inconsistency", both now fixed without changing any architecture:

- `rowan-combobox` claimed `role="combobox"` with a hard-coded
  `aria-expanded="false"` that was never updated. Its popup is a native
  `<datalist>`, which the browser owns and exposes no open/close signal for, so an
  honest `aria-expanded` is impossible. A combobox role without usable expansion
  state is worse than no role, so the host no longer claims `role`,
  `aria-autocomplete`, or `aria-expanded`; the native input carries the semantics.
- `rowan-multi-select-combobox` focused its first option through a `setTimeout`
  retry loop that polled up to three times waiting for the listbox to assign a
  roving tab index. `rowan-listbox` now exposes `focusFirstOption()`, which sets
  the active option, syncs roving tab indexes synchronously, and focuses in one
  step. The caller queues a single microtask so the render that recreates the
  options settles first. Covered by a test that allows microtasks only, which the
  old polling implementation could not pass.

Phase 2 remains: move `rowan-combobox` onto the `rowan-listbox` + `rowan-option`
composition already used by `multi-select-combobox`, adopting the
`aria-activedescendant` pattern `command-palette` implements correctly, and encode
the rule that input-plus-popup uses active descendant while a standalone
collection uses roving tab index. That rule already holds for menu, tabs, tree,
listbox, and palette; the comboboxes are the only violations. It is a breaking
change to a public keyboard and CSS-part contract, so it is cheapest now at `0.x`
and should land as its own change with a shared keyboard conformance suite.

**Update — Phase 2 complete.**

`rowan-combobox` no longer uses a `<datalist>`. It now renders a `role="listbox"`
popup of `rowan-option` children and keeps DOM focus in the input, reporting the
highlight with `aria-activedescendant` — the APG combobox pattern that
`command-palette` already implemented. It gained Arrow Up/Down, Home, End, Enter,
Escape, Tab, type-to-filter, an `open` attribute, and a stylable panel. Free-text
entry is preserved, and `rowan-change` is emitted once per committed change, so a
trailing native `change` for the same value does not double-fire.

`rowan-option` gained an owner-guarded `setActiveDescendant()` internal method plus
`--rowan-option-active-bg` / `--rowan-option-active-fg`, because active descendant
highlight is a distinct state from selection. It has a forced-colors outline so the
highlight survives High Contrast.

The rule is now documented in the README: input with a popup list uses active
descendant; a standalone collection uses roving tab index. `rowan-select` stays a
native `<select>` wrapper by design.

**Breaking changes for `0.1.0` consumers:** the `list` CSS part is now the listbox
container rather than a `<datalist>`, `control`, `panel`, and `empty` parts were
added, and the host no longer exposes a `combobox` role — the inner input carries
it. Browser-verified: open, arrow movement, End, wrap-around, disabled-option
skipping, Enter commit, and `aria-expanded` transitions.

**Still open:** `rowan-multi-select-combobox` moves focus into its listbox instead
of using active descendant, so it does not yet follow the rule. Converging it is a
second breaking change and should carry the shared keyboard conformance suite that
F-11 originally called for.

**Update — multi-select converged; F-11 closed.**

`rowan-multi-select-combobox` now follows the same rule. It renders its own
`role="listbox"` container with `aria-multiselectable="true"` and `rowan-option`
children, keeps DOM focus in the input, and reports the highlight with
`aria-activedescendant`. Arrow Up and Down, Home, and End move the highlight;
Enter toggles the highlighted option and keeps the popup open; Escape closes;
Backspace on an empty query still removes the last chip.

It no longer embeds `rowan-listbox`. That composition brought a roving tab index
inside a combobox, which put the options into the page tab order — a real defect,
not only an inconsistency. Browser verification confirms no option is tabbable now.
The host also stopped duplicating the `combobox` role that the inner input owns.

`rowan-listbox.focusFirstOption()` added in phase 1 is kept: it is still the
deterministic focus entry point for a standalone listbox.

**Breaking changes for `0.1.0` consumers:** the multi-select `listbox` CSS part is
a plain container rather than a `rowan-listbox` element, keyboard selection moved
from focus-and-activate to Enter-on-highlight, and the host no longer exposes a
`combobox` role.

---

## Overlays

### F-12: Overlay focusable allowlist omits most Rowan form controls

- **Severity:** High
- **Area:** `FOCUSABLE_SELECTOR` in `src/dialog/dialog.js`, `src/drawer/drawer.js`, `src/command-palette/command-palette.js`, `src/row-details-panel/row-details-panel.js`
- **Contract:** "Dialog — modal, focus trap, Esc, return focus."
- **Evidence:** The list is native focusables plus exactly three hard-coded tags: `rowan-button`, `rowan-icon-button`, `rowan-link`. Rowan controls carry no `tabindex` attribute, so `[tabindex]:not([tabindex='-1'])` does not match them either.
- **Impact:** A dialog containing `<rowan-text-field>` and `<rowan-button>` treats only the button as focusable. Initial focus lands on the button instead of the first field, and the Tab cycle computes the wrong first/last boundary, so Shift+Tab escapes the modal. Breaks the most common dialog composition in the library, duplicated across four overlays.
- **Fix:** Replace the tag allowlist with a capability check — focusable if not disabled and `tabIndex >= 0` — walking `assignedElements()` and nested shadow roots. Put it in one shared utility used by all four overlays.
- **Test:** Open a dialog containing text-field, checkbox, and button; assert initial focus is the text field and Tab/Shift+Tab cycle across all three without leaving.

**Resolution (fixed).** Added `src/lib/focus.js` with capability-based `isFocusable()`
and `collectFocusableElements()`. Rowan controls are detected through
`shadowRoot.delegatesFocus` rather than a tag list, and traversal follows slots and
open shadow roots. `dialog`, `drawer`, `command-palette`, and `row-details-panel` now
share it; all four hard-coded allowlists are gone.

`collectFocusableElements` takes `{ includeSlotted: false }`, which
`rowan-command-palette` uses. Its slotted command items are an arrow-navigated
listbox, not Tab stops; treating them as tab stops made the palette fight itself
over focus and froze the page. This is a genuine design distinction, not a
workaround, and it is documented at the call site.

### F-13: Document-wide focus recapture with no overlay stack

- **Severity:** High
- **Area:** `src/dialog/dialog.js` — `#handleDocumentFocusIn`, `#onOpen`
- **Contract:** Focus containment for modals.
- **Evidence:** While open, each dialog attaches a capturing `focusin` listener on `document` and calls `#focusFirstElement()` whenever focus lands outside itself; `#isNodeInDialog` checks only that one instance. There is no shared stack and no topmost check.
- **Impact:** Two dialogs open at once — a confirm-dialog raised from a dialog — and each yanks focus back on the other's `focusin`, producing a focus fight that makes the UI unusable. It also steals focus from legitimately outside surfaces such as a toast. Compounded by `--rowan-toaster-z-index`, the dialog overlay, command-palette, and context-menu all sitting at `z-index: 1000`, so visual stacking is source-order luck.
- **Fix:** Maintain a module-level overlay stack; only the topmost entry enforces containment, and assign ascending z-index on open.
- **Test:** Open dialog A, then dialog B; assert focus settles inside B and A's handler does not fire a recapture.

**Resolution (fixed).** Added `src/lib/overlay-stack.js`. Overlays register on open and
unregister on close and disconnect, and every `focusin` recapture handler now returns
early unless `isTopmostOverlay(this)`. Stacked overlays can no longer fight over focus.

### F-14: No scroll lock or background inert while a modal is open

- **Severity:** Medium
- **Area:** `dialog`, `drawer`, `command-palette`
- **Contract:** Focus trap, Escape, restore-focus, scroll lock, inert background.
- **Evidence:** `#syncOpenState` sets `this.inert = !this.open` on the host and toggles `.overlay[hidden]`. Nothing touches `document.body` overflow and nothing inerts sibling content.
- **Impact:** The background scrolls behind an open modal, which is especially bad on iOS, and assistive technology can still reach background content. `aria-modal="true"` mitigates the AT half in modern screen readers but not scrolling.
- **Fix:** On open, set `overflow: hidden` on the scrolling element and restore the prior value on close, reference-counted through the same overlay stack as F-13.
- **Test:** Open a dialog on a long page, dispatch a wheel/touch scroll, assert scroll position is unchanged and restored after close.

**Resolution (partially fixed).** `overlay-stack.js` provides reference-counted
`lockBodyScroll()` / `unlockBodyScroll()`, wired into `rowan-dialog`, which restores the
previous `overflow` on close. Background `inert` is still **not** applied; `aria-modal`
covers assistive technology, so this remains open for `drawer` and `command-palette`.

**Update — scroll lock complete; background inert deliberately deferred.**

The overlay stack now owns page scrolling outright. It locks when the stack becomes
non-empty and restores the previous `overflow` when it empties, so `dialog`, `drawer`,
`command-palette`, and `row-details-panel` are all covered and stacked overlays cannot
unlock early. The stack also prunes overlays that are removed from the document while
open, which previously leaked a lock. Replacing the per-component `lock`/`unlock` pairs
with single ownership removed a whole class of balance bugs.

Background `inert` was implemented and then **removed before shipping**. A DOM-walking
implementation — walking from the overlay to `<body>` and inerting siblings at each
level, skipping author-owned `inert` and live-region hosts — reliably hung the
`command-palette` and `row-details-panel` suites, taking them from passing to zero
reported tests. Isolated probes showed the parts were individually sound: the traversal
completed in well under a millisecond, and setting `inert` on a sibling of an open
palette produced no focus storm and no freeze. The interaction only appears under the
test harness, which shares `document.body` with the overlays under test. I could not
isolate the root cause at acceptable cost, and shipping a focus-affecting mechanism that
is not understood is worse than the gap it closes.

Residual risk is bounded: `aria-modal="true"` is set on all four overlays and the focus
trap is working and tested, so assistive technology and keyboard focus are already
contained. What is missing is pointer-interaction blocking on background content and a
native tab-order backstop.

The right fix is the native `<dialog>` + `showModal()` migration, which provides
top-layer, `::backdrop`, and inert background from the platform instead of by DOM walking.
That is a breaking change to the documented `part="backdrop"` and the z-index contract,
so it belongs on the `1.0` milestone rather than a defect sweep.

**Update — native `<dialog>` migration attempted and reverted; scoped to its own change.**

The migration was prototyped end to end: `render()` emitting a real `<dialog>` wrapping
the panel, `showModal()` / `close()` driven from `#onOpen` / `#onClose`, the native
`cancel` event replacing the Escape handler, backdrop-click detected via
`event.target === overlay`, and `#trapTabFocus` / `#isNodeInDialog` deleted because the
platform supplies containment. The CSS moved `--rowan-overlay-backdrop` onto `::backdrop`
and dropped the `.backdrop` element and the `[hidden]` rule.

It did not hold up. Four `rowan-dialog` tests failed — the `.overlay` hidden-state
assertions no longer apply, and "restores controls and focus containment after
reconnecting while open" broke because a dialog opened while disconnected never gets
`showModal()` called on reconnect, since `#syncOpenState` short-circuits when `open`
already matches the internal flag. More seriously, the `confirm-dialog` suite hung for the
full 120s timeout, the same failure signature as the inert attempt.

Reverted to the committed implementation; `dialog` and `confirm-dialog` return to 17
passing in 1.7s. This is deliberately **not** a partial migration left in the tree: a
half-migrated modal is worse than either endpoint.

**Update — root cause isolated to the test harness, not the component.**

A second, instrumented pass narrowed this considerably. Findings, in order:

1. **The native implementation is correct.** A standalone probe page driving
   `rowan-confirm-dialog` in a real browser ran clean: `showModal()` opened the native
   dialog, focus moved into the panel, `close()` restored state, and no errors or
   unhandled rejections fired.
2. **There is no runaway render loop.** A render counter peaked at 11 across the whole
   suite, killing the leading hypothesis. The related theory — that toggling `inert`
   attributes re-triggers rendering — is also wrong: the only attribute-watching observer
   is in `table-selection.js`, filtered to `id`, and the label observer in
   `base-element.js` watches `characterData`/`childList` only. Neither reacts to `inert`.
3. **The suite completes under WTR manual mode**: 3 passing, 2 failing. Both failures are
   tests coupled to the implementation being removed, not product defects. One dispatches
   a synthetic `keydown` Escape, which the native dialog ignores because it fires `cancel`
   only for real user input. The other dispatches a synthetic `Tab` and asserts our custom
   trap moved focus, which the platform now owns.
4. **The hang is specific to WTR's controlled browser.** It reproduces in both headed and
   headless Chrome, forwards no browser console output at all, and reports
   `0 passed, 0 failed` — while the identical code completes in a manually driven browser
   against the same dev server.

So the blocker is not correctness and not the four dialog test failures, three of which
were assertions on `.overlay` hidden-state that this migration legitimately invalidates,
and one of which was a real reconcile bug in `#syncOpenState` (a dialog opened while
disconnected never gets `showModal()` on reconnect) that was fixed during this pass.

The blocker is that our test harness cannot run native modal dialogs in its controlled
browser, and we would be shipping a focus- and pointer-affecting change with no CI
coverage. That is a tooling problem to solve first — likely a Web Test Runner launcher or
session-protocol interaction — and it should be fixed before, not alongside, the
migration.

**Resolved — background inert now ships for `rowan-dialog`.**

The blocker was never the component. Attaching a Playwright listener directly to Web Test
Runner's own browser page — instead of trusting WTR's log forwarding, which emitted
nothing — produced the real error in one run:

```
DataCloneError: Failed to execute 'structuredClone' on 'Window':
HTMLButtonElement object could not be cloned.
```

WTR serialises results back to Node with `structuredClone`. The obsolete focus-trap test
asserted `expect(activeElement).to.equal(closeButton)`, so chai attached an
`HTMLButtonElement` to the failing assertion's `expected` field. That error cannot be
cloned, the session died before reporting, and the run surfaced as a 120s timeout with
`0 passed, 0 failed`. **Every "hang" in this investigation was a failing assertion that
compared DOM elements, not a product defect** — which retroactively explains the original
`inert` hang in `command-palette` and `row-details-panel` too.

This is a repo-wide hazard worth knowing: a failing assertion whose `actual`/`expected` is
a DOM node hangs CI with no diagnostic output. Compare booleans
(`expect(a === b).to.equal(true)`) or identifying strings instead.

Shipped:

- `rowan-dialog` renders a real `<dialog>` and uses `showModal()` / `close()`, so the top
  layer, `::backdrop`, focus containment, and background inertness all come from the
  platform rather than from DOM walking.
- `#syncOpenState` reconciles native state even when `open` did not change, fixing a
  dialog opened while disconnected never entering the top layer on reconnect.
- `disconnectedCallback` closes the native dialog so a modal removed while open cannot
  linger in the top layer and block the page.
- The custom `#trapTabFocus`, `#isNodeInDialog`, and the document `focusin` recapture
  listener are deleted.

Verified in a real browser: with the dialog open, `:modal` matches, `outside.focus()`
cannot move focus to background content, and `document.elementFromPoint()` over a
background button returns the dialog rather than the button. All three invert on close.
That behaviour is now locked in by a regression test, and the suite is green on Chromium,
Firefox, and WebKit.

**Breaking:** `rowan-dialog` no longer exposes `part="backdrop"`; style the backdrop with
the `--rowan-overlay-backdrop` token or `rowan-dialog::part(overlay)::backdrop`.
`part="overlay"` is now the native `<dialog>` element. Other overlays keep their existing
`backdrop` part.

Still open: `drawer`, `command-palette`, `row-details-panel`, and `context-menu` have not
been migrated and continue to rely on `aria-modal` plus the scroll lock.

**Update — migration completed across every modal overlay.**

`rowan-drawer`, `rowan-command-palette`, and `rowan-row-details-panel` now use the same
native `<dialog>` pattern: `showModal()` / `close()`, `::backdrop` in place of a backdrop
`<div>`, the native `cancel` event in place of an Escape key handler, and deletion of each
component's custom `#trapTabFocus`, `#isNodeIn*`, and document `focusin` recapture
listener.

One behavioural fix came out of this. `showModal()` focuses the first focusable element in
DOM order, which is the close button — not the command palette's search input. Focus-on-open
therefore moved to sit alongside the `showModal()` call rather than in `#onOpen()`, so it
also runs when an already-open overlay is reconnected. That is applied consistently to
`dialog`, `drawer`, and `command-palette`.

Verified in a real browser for all three: `:modal` matches while open, `focus()` on a
background button does not move focus, and `document.elementFromPoint()` over that button
returns the overlay. All invert on close. Regression tests cover each one.

**`rowan-context-menu` is deliberately excluded.** It wraps `<rowan-menu>` with `role="menu"`
and is not a modal surface. Wrapping it in `showModal()` would impose dialog semantics
around a menu and break the APG menu pattern, and a context menu should not inert the page
behind it. If it needs the top layer later, the Popover API is the correct primitive — it
gives top-layer stacking and light dismiss without modal semantics. It keeps its
`part="backdrop"`.

**Breaking, in addition to `rowan-dialog`:** `rowan-drawer`, `rowan-command-palette`, and
`rowan-row-details-panel` no longer expose `part="backdrop"`. Style the backdrop with each
component's existing backdrop token or `::part(overlay)::backdrop`. `part="overlay"` is now
the native `<dialog>` element on all of them; `rowan-drawer` gains `part="overlay"`, which
it did not previously have.

---

## Theming / accessibility

### F-15: No forced-colors support

- **Severity:** Medium
- **Area:** all component CSS
- **Evidence:** Zero occurrences of `forced-colors` across `src/**/*.css`. `prefers-reduced-motion` is handled in only six files: `button`, `icon-button`, `carousel`, `skeleton`, `slider`, `status-indicator`.
- **Impact:** In Windows High Contrast, components conveying state purely through background color — chip tones, badge tones, switch on/off, selected table rows — collapse to indistinguishable surfaces. F-02's raw hex makes this unavoidable, since the system cannot override what it cannot see through a token.
- **Fix:** Add a `@media (forced-colors: active)` block for state-bearing components using system colors and `forced-color-adjust`. Audit remaining animated components for reduced motion.
- **Test:** Emulate forced-colors and assert selected/unselected states remain distinguishable by border or outline, not background alone.

**Resolution (fixed for state-bearing surfaces).** Added `@media (forced-colors: active)`
blocks where state was carried by background alone: `rowan-switch` uses `Highlight`
and `HighlightText` for its track and thumb, `rowan-segmented-control` outlines the
checked segment, and `chip`, `badge`, and `alert` pin their borders to `CanvasText`
so they stay visible. Tone distinctions still flatten, which is the intended
behaviour of forced-colors rather than a defect.

---

## Packaging / types

### F-16: `0.1.0` surface is not marked for stability

- **Severity:** Medium
- **Area:** `README.md`, `package.json`
- **Evidence:** Table virtualization, `rich-text-editor`, `filter-builder`, and `trend-chart` are documented identically to `button` and `card`.
- **Impact:** Consumers cannot tell which APIs are safe to depend on. The riskiest components carry the most implementation surface and the highest likelihood of breaking changes.
- **Fix:** Add an explicit stability table to the README and mark those four experimental for `0.1.0`.
- **Test:** Documentation gate; not automatable.

**Resolution (fixed).** Added an API stability table to the README. Primitives,
forms, overlays, and the Table config/event surface are marked stable; table
virtualization, `rich-text-editor`, `filter-builder`, and `trend-chart` are marked
experimental for `0.1.0`.

> Verified as passing, recorded so it is not regressed: all 76 component folders
> have `exports` entries and correct `sideEffects` entries, `elements.d.ts`
> augments `HTMLElementTagNameMap` from generated `types/`, and CEM output is
> deterministic across consecutive runs. Covered by `npm run test:package`.

---

## Tests

### F-17: Dark-theme test validates the shipped theme, not the documented one

- **Severity:** High
- **Area:** `src/tokens/theme.test.js`
- **Evidence:** The contrast test loads `tokens.css`, `light.css`, **and `dark.css`**, then asserts >= 4.5:1 for chip, card, date-picker, calendar, and dialog. It passes, which is why F-01 shipped. It proves the first-party theme is self-consistent, not that theming works.
- **Impact:** False confidence on the most-reported defect class in the repo. BUG 1, BUG 2, and BUG 3 all exist inside a covered area.
- **Fix:** Add a second case applying a semantic-only theme, as in F-01.
- **Test:** As described in F-01; should fail before the F-01 fix and pass after.

**Resolution (fixed).** Added `stays readable when a consumer themes only the
semantic layer` to `src/tokens/theme.test.js`, which loads `tokens.css` only,
applies a semantic-only theme at `:root`, and asserts >= 4.5:1 on chip, card,
date-picker, and dialog. The suite's colour parser was also corrected: it read
`color(srgb r g b)` channels (0–1) as 0–255, which silently reported a false
1.33 contrast once `color-mix()` values appeared. Two `chip` and `skeleton` tests
that asserted frozen literal rgb values were rewritten to assert the behaviour
they are named for — that a nested theme override wins, and that dark yields a
darker shimmer — so they no longer break when token values legitimately change.

### F-18: Untested axes

- **Severity:** Medium
- **Evidence:** Coverage exists for roving focus, reflection, virtual collection, table events, and toaster returns. No coverage found for custom-validity persistence (F-07), external-label naming (F-10), fieldset re-enable (F-05), multi-overlay focus (F-13), or React re-render property churn (F-03).
- **Fix:** Each finding above names the specific assertion to add.

---

## Review scope

Read in depth: `src/lib/*`, `src/tokens/*`, `src/react/*`, `README.md`,
`package.json`, `src/elements.d.ts`, `theme.test.js`, and the `text-field`,
`dialog`, `chip`, `alert`, `date-picker`, and `combobox` implementations, plus
cross-cutting searches and a FACE survey across all 19 form-associated
components.

Not reviewed, and therefore not cleared: `table`, `virtual-list`, `tree`,
`tabs`, `menu`, `drawer`, `popover`, `tooltip`, `dropdown`, `command-palette`,
`file-upload`, `color-picker`, `slider`, `rating`, `calendar`, and `form-wizard`
internals.

Confirmed correct and intentionally left alone: the no-framework stance, the
React boundary (no wrapping or auto-registration), the attribute/property split,
rich-text plain-text-only clipboard handling, semantic `<table>` virtualization,
roving-tabindex owner guards, the three-layer token architecture itself, and
deterministic build outputs.
