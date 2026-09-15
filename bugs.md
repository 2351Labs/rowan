# Rowan bug log

Findings from the staff frontend review of the public `@rowan-ui/core` surface.
IDs `F-NN` are stable and referenced by the review write-up.

## Triage summary

| ID   | Title                                                                    | Severity | Status                            |
| ---- | ------------------------------------------------------------------------ | -------- | --------------------------------- |
| F-01 | Component tokens hard-code light literals, breaking documented theming   | Blocker  | **Fixed** — closes BUG 1/2/3      |
| F-02 | Eight components bypass tokens entirely and cannot be themed             | High     | **Fixed** (switch thumb deferred) |
| F-03 | `useRowanElement` re-assigns properties and listeners every React render | High     | Open                              |
| F-04 | `reflectStringAttribute` cannot represent an empty string                | Medium   | Open                              |
| F-05 | `#syncFormDisabledState` disables inner controls but never re-enables    | Medium   | Open (latent)                     |
| F-06 | No standard validity surface on any form-associated component            | High     | **Fixed**                         |
| F-07 | Every render resets validity, erasing consumer-set custom errors         | High     | **Fixed**                         |
| F-08 | `type="password"` reflects the secret into a DOM attribute               | High     | **Fixed**                         |
| F-09 | Per-keystroke attribute reflection risks IME and caret behavior          | Medium   | Open (unreproduced)               |
| F-10 | External `<label for>` never names the control                           | High     | Open                              |
| F-11 | Four similar controls use four different interaction architectures       | Medium   | Open                              |
| F-12 | Overlay focusable allowlist omits most Rowan form controls               | High     | **Fixed**                         |
| F-13 | Document-wide focus recapture with no overlay stack                      | High     | **Fixed**                         |
| F-14 | No scroll lock or background inert while a modal is open                 | Medium   | **Fixed** (scroll lock; see note) |
| F-15 | No forced-colors support                                                 | Medium   | Open                              |
| F-16 | `0.1.0` surface is not marked for stability                              | Medium   | Open                              |
| F-17 | Dark-theme test validates the shipped theme, not the documented one      | High     | **Fixed**                         |
| F-18 | Untested axes                                                            | Medium   | Open                              |

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

### F-03: `useRowanElement` re-assigns properties and listeners every React render

- **Severity:** High
- **Area:** `src/react/index.js` — both `useEffect` calls
- **Contract:** React support is "types + `useRowanElement()` only"; parent-assigned values stay silent and cheap.
- **Evidence:** Neither `useEffect` has a dependency array. The first re-runs `element[name] = value` for every entry on every render; the second removes and re-adds every listener on every render.
- **Impact:** For the property-only object/array APIs this hook exists to serve (`table.config`, `.rows`, `.columns`, `combobox.options`), a new literal each render means new object identity each render, so the table re-reconciles continuously. A parent re-rendering on scroll or hover silently degrades into repeated full table work.
- **Fix:** Assign only when `element[name] !== value`, and give the event effect a dependency list derived from `Object.keys(events)` so listeners rebind only when handlers change.
- **Test:** Render twice with an unchanged `config`; assert the property setter ran once and `addEventListener` was called once.

### F-04: `reflectStringAttribute` cannot represent an empty string

- **Severity:** Medium
- **Area:** `src/lib/reflect.js` — `reflectStringAttribute`
- **Contract:** Attribute/property reflection for scalars.
- **Evidence:** `if (value == null || value === "") { element.removeAttribute(...) }` treats `""` and `null` identically.
- **Impact:** "Explicitly empty" and "absent" are indistinguishable in the DOM. It round-trips for `value` because the getter defaults to `""`, but it defeats any token where empty is meaningful and makes attribute-driven debugging misleading.
- **Fix:** Remove only on `null`/`undefined`; set `""` explicitly. Preserve the current collapse where intentional by passing `value || null` at the call site, as several components already do.
- **Test:** Set `el.value = ""` and assert `el.hasAttribute("value")` matches the documented intent.

### F-05: `#syncFormDisabledState` disables inner controls but never re-enables

- **Severity:** Medium (latent/conditional)
- **Area:** `src/lib/base-element.js` — `#syncFormDisabledState`
- **Contract:** Disabled `<fieldset>` support must be reversible.
- **Evidence:** The method force-sets `control.disabled = true` for every `input, select, textarea, button` in the shadow root when disabled, but the `if (disabled)` branch has no `else` restoring `false`.
- **Impact:** Recovery depends on each component re-asserting `control.disabled = this.disabled` in `render()`. `text-field` does and recovers; any component that does not stays permanently disabled after a fieldset is re-enabled. The base-class asymmetry and the `text-field` recovery path were verified; all 19 controls were not audited.
- **Fix:** Make it symmetric — track which controls the base class disabled and restore them, instead of relying on subclass discipline.
- **Test:** Wrap each FACE control in `<fieldset disabled>`, re-enable it, and assert the inner control is interactive.

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

### F-10: External `<label for>` never names the control

- **Severity:** High
- **Area:** `text-field`, `date-picker`, `number-field`, `textarea`, `checkbox`, `radio`, `select`, `combobox`
- **Contract:** "Associate labels via `<label for>` using the host id, plus an internal visually-hidden label fallback from the `label` attribute."
- **Evidence:** `render()` names the inner input only from the `label` attribute via `aria-label`. Nothing reads an external `<label for="host-id">`, and `label`/`for` association does not cross the shadow boundary.
- **Impact:** `<label for="email">Email</label><rowan-text-field id="email">` gives click-to-focus through `delegatesFocus`, so it looks wired up, but the accessible name is empty. Invisible in normal use and only surfaces in a screen reader or audit. The documented pattern does not do what it says.
- **Fix:** On connect, resolve `label[for=<host id>]`, mirror its text into the internal hidden label, and observe it for changes; or set `internals.ariaLabel` from it. Keep the `label` attribute as the override.
- **Test:** Render an external `<label for>` with no `label` attribute; assert the computed accessible name equals the label text.

### F-11: Four similar controls use four different interaction architectures

- **Severity:** Medium
- **Area:** `src/select/select.js`, `src/combobox/combobox.js`, `src/listbox/listbox.js`, `src/multi-select-combobox/multi-select-combobox.js`, `src/command-palette/command-palette.js`
- **Contract:** Pick `aria-activedescendant` or roving tabindex and apply consistently.
- **Evidence:** `select` wraps native `<select>`. `combobox` builds native `<option>` elements into a datalist-style list with no `role`, no `keydown`, and no `aria-activedescendant`. `listbox` implements a custom roving-tabindex listbox over `rowan-option`. `multi-select-combobox` implements its own panel/listbox. `command-palette` is the only user of `aria-activedescendant`.
- **Impact:** Keyboard behavior, stylability, and event timing differ across controls that look like siblings in the docs. `rowan-combobox` inherits datalist's cross-browser inconsistency and near-zero stylability, and sets `internals.ariaExpanded` even though the browser owns that state. Teams needing a styled filterable single-select find only the multi-select variant has one.
- **Fix:** Do not rewrite now. Document the divergence for `0.1.0`, and converge `combobox` onto the `multi-select-combobox` listbox as the single-select case.
- **Test:** One shared keyboard conformance suite (Arrow/Home/End/Enter/Escape/typeahead) run against every list-like control.

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

---

## Theming / accessibility

### F-15: No forced-colors support

- **Severity:** Medium
- **Area:** all component CSS
- **Evidence:** Zero occurrences of `forced-colors` across `src/**/*.css`. `prefers-reduced-motion` is handled in only six files: `button`, `icon-button`, `carousel`, `skeleton`, `slider`, `status-indicator`.
- **Impact:** In Windows High Contrast, components conveying state purely through background color — chip tones, badge tones, switch on/off, selected table rows — collapse to indistinguishable surfaces. F-02's raw hex makes this unavoidable, since the system cannot override what it cannot see through a token.
- **Fix:** Add a `@media (forced-colors: active)` block for state-bearing components using system colors and `forced-color-adjust`. Audit remaining animated components for reduced motion.
- **Test:** Emulate forced-colors and assert selected/unselected states remain distinguishable by border or outline, not background alone.

---

## Packaging / types

### F-16: `0.1.0` surface is not marked for stability

- **Severity:** Medium
- **Area:** `README.md`, `package.json`
- **Evidence:** Table virtualization, `rich-text-editor`, `filter-builder`, and `trend-chart` are documented identically to `button` and `card`.
- **Impact:** Consumers cannot tell which APIs are safe to depend on. The riskiest components carry the most implementation surface and the highest likelihood of breaking changes.
- **Fix:** Add an explicit stability table to the README and mark those four experimental for `0.1.0`.
- **Test:** Documentation gate; not automatable.

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
