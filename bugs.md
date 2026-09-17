# Rowan bug log

Findings from the staff frontend review of the public `@rowan-ui/core` surface
(F-01–F-25) and the 2026-09-16 whole-project review
(`documentation/code_review/2026-09-16T130711-0700_grok-4.6.md`, F-26–F-56).
IDs `F-NN` are stable and referenced by the review write-up.

Open items are listed first, High then Medium then Low. Closed items keep their
original ID order. F-26–F-56 are all fixed; the Open table is empty.

## Triage summary

### Open

None.

### Closed

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
| F-18 | Untested axes                                                            | Medium   | **Fixed**                                           |
| F-19 | Audit of the previously uncleared components                             | High     | **Fixed** — stepper contrast, forced colours        |
| F-20 | Second audit pass — keyboard, selection, virtualization                  | Medium   | **Fixed** — shift anchor, table row semantics       |
| F-21 | Virtualization measurement and scroll restoration                        | Low      | **Covered** — no defects found                      |
| F-22 | Scroll anchoring missing when rows change above the viewport             | Medium   | **Fixed** — table and virtual-list                  |
| F-23 | Radio group leaks both child and controller change events                | Medium   | **Fixed**                                           |
| F-24 | Enum properties accept values outside their documented unions            | Medium   | **Fixed**                                           |
| F-25 | Unnamed radio controls are incorrectly grouped together                  | Medium   | **Fixed**                                           |
| F-26 | Required radio-group stays invalid after a later option is selected      | High     | **Fixed**                                           |
| F-27 | Number field wipes in-progress input (`-`, `1.`)                         | High     | **Fixed**                                           |
| F-28 | `type="PASSWORD"` bypasses password-value eviction                       | High     | **Fixed**                                           |
| F-29 | Dropzone `accept` filters the picker, not drops                          | High     | **Fixed**                                           |
| F-30 | Row-details panel leaks body scroll lock on disconnect                   | High     | **Fixed**                                           |
| F-31 | `css:check` imports Node 22 `glob` while CI is Node 20                   | High     | **Fixed**                                           |
| F-32 | Date-only `formatDate` shifts a day west of UTC                          | High     | **Fixed**                                           |
| F-33 | `setCustomValidity` is not synchronous                                   | High     | **Fixed**                                           |
| F-34 | Outside-click dismisses popover and parent dialog together               | High     | **Fixed**                                           |
| F-35 | Fieldset-disabled FACE hosts still steal overlay focus                   | Medium   | **Fixed**                                           |
| F-36 | Drawer reconnect skips overlay-stack re-registration                     | Medium   | **Fixed**                                           |
| F-37 | Date-picker accepts impossible dates such as `2026-02-31`                | Medium   | **Fixed**                                           |
| F-38 | Multi-select combobox does not close on Tab                              | Medium   | **Fixed**                                           |
| F-39 | Command palette Home/End steal the caret                                 | Medium   | **Fixed**                                           |
| F-40 | Toaster paints under native modal top layer                              | Medium   | **Fixed**                                           |
| F-41 | Closed row-details panel remains `aria-modal`                            | Medium   | **Fixed**                                           |
| F-42 | `.gitignore` is only `node_modules`; generated artifacts are tracked     | Medium   | **Fixed**                                           |
| F-43 | Core and MapLibre npm packs include tests and stories                    | Medium   | **Fixed**                                           |
| F-44 | `useRowanElement` never binds listeners if the host mounts late          | Medium   | **Fixed**                                           |
| F-45 | Context menu and dropdown do not dismiss on Tab                          | Medium   | **Fixed**                                           |
| F-46 | Popover is `role="dialog"` without focus move or top layer               | Medium   | **Fixed**                                           |
| F-47 | Nested dialog/tab/switch roles in the accessibility tree                 | Medium   | **Fixed**                                           |
| F-48 | External `<label for>` added after connect is never observed             | Medium   | **Fixed**                                           |
| F-49 | Table link cells always `preventDefault` so they never navigate          | Medium   | **Fixed**                                           |
| F-50 | `rowan-page-change` is 0-based on table and 1-based on pagination        | Medium   | **Fixed**                                           |
| F-51 | Confirm dialog initial focus lands on the × close button                 | Medium   | **Fixed**                                           |
| F-52 | Table-selection MutationObserver runs on every virtualized scroll        | Low      | **Fixed**                                           |
| F-53 | MapLibre model types are not exported; tests never load maplibre-gl      | Low      | **Fixed**                                           |
| F-54 | `#didFirstRender` is written and never read                              | Low      | **Fixed**                                           |
| F-55 | `isTopmostOverlay` is unused after the native-dialog migration           | Low      | **Fixed**                                           |
| F-56 | Hand-written `base-element.d.ts` omits FACE members                      | Low      | **Fixed**                                           |

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

**Resolution (fixed).** All five axes now have coverage. Four were added while fixing the
findings themselves; each is named here so the claim is checkable rather than asserted:

| Axis                               | Test                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Custom-validity persistence (F-07) | `text-field.test.js` — "keeps a consumer custom error through unrelated renders"                                                           |
| External-label naming (F-10)       | `text-field.test.js` — "takes its accessible name from an external label element" and "prefers the label attribute over an external label" |
| Fieldset re-enable (F-05)          | `text-field.test.js` — "re-enables its inner control when a disabled fieldset is re-enabled"                                               |
| Multi-overlay focus (F-13)         | `dialog.test.js` — "lets only the topmost dialog recapture focus"                                                                          |
| React property churn (F-03)        | `react.test.js` — "does not reassign unchanged properties on re-render"                                                                    |

The custom-validity test is the strongest of the four inherited ones: it sets a custom
error, triggers an unrelated re-render by changing `placeholder`, asserts the error
survives, then clears it and asserts `valid` returns.

The multi-overlay test was the weak one and was strengthened. It previously only asserted
where focus happened to land after opening a second dialog, which a broken implementation
could satisfy by accident. It now also calls `focus()` on a control inside the lower dialog
and asserts focus does not move there, which is the actual containment contract. Verified
non-vacuous: leaving the second dialog closed makes it fail.

Two caveats on the scope of this finding. First, it only ever named these five axes, so
closing it does not mean coverage is complete. Second, the "not reviewed, therefore not
cleared" list below still stands unchanged — those components have not been audited, and
their existing tests were not assessed for depth.

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

> **Audited — see F-19 below.** This list is no longer uncleared.

Confirmed correct and intentionally left alone: the no-framework stance, the
React boundary (no wrapping or auto-registration), the attribute/property split,
rich-text plain-text-only clipboard handling, semantic `<table>` virtualization,
roving-tabindex owner guards, the three-layer token architecture itself, and
deterministic build outputs.

---

## F-19: Audit of the previously uncleared components

Scope: the 16 components listed above, audited against the same non-negotiables as the
original review — structural contract, event contract, FACE completeness, template safety,
token layering, and forced-colors behaviour.

### Clean, with evidence

These were checked and found correct. Recording what was checked so the clearance means
something:

- **Structural contract** — all 16 declare `:host` display and `:host([hidden])`, and all
  register through the `define()` guard.
- **Event contract** — no component constructs a `CustomEvent` directly. `src/lib/events.js`
  is the only construction site, and it sets `bubbles` and `composed`.
- **Template safety** — no `innerHTML` assignment in any of the 16 interpolates dynamic
  values. Row and item data goes through `textContent`.
- **FACE completeness** — `color-picker`, `slider`, `rating`, and `calendar` are the four
  form-associated components in this set. All four implement `setFormValue`, `setValidity`,
  `formResetCallback`, `formStateRestoreCallback`, `checkValidity`, and `reportValidity`.
  `formDisabledCallback` and the `validity` / `validationMessage` / `willValidate` /
  `setCustomValidity` surface come from `BaseElement`, so an initial scan reporting them as
  "missing" was a false positive from not accounting for inheritance.
- **`rating` and forced colours** — initially suspected, then cleared. `.star.is-filled`
  differs only by colour, but the glyph itself changes
  (`star.textContent = isFilled ? "★" : "☆"`) and each star carries `role="radio"` with
  `aria-checked`, so state survives both forced colours and assistive technology.

### Defect: `rowan-stepper` current step is unreadable in dark mode

- **Severity:** High
- **Evidence:** `.step.is-current .step-button` defaulted to
  `color-mix(in srgb, var(--rowan-color-accent) 12%, white)`. Mixing toward the literal
  `white` produces a near-white background in every theme, while `color: inherit` resolves
  to the dark theme's light foreground.
- **Impact:** Measured **1.06** contrast in a dark theme wrapper — the same failure mode as
  the original `rowan-alert` bug at 1.03. The current step, which is the one piece of state
  a stepper exists to convey, is unreadable.
- **Fix:** Mix toward the background instead: `color-mix(in srgb, var(--rowan-color-accent)
12%, var(--rowan-color-bg))`, matching the pattern used by the F-02 fixes.
- **Test:** `rowan-stepper` is now part of the dark-theme contrast test, which fails at 1.06
  without the fix.

Worth noting why the existing guards missed this. `css:check` passes because the literal is
inside a `var()` fallback, which satisfies its contract — the token hook
`--rowan-stepper-current-bg` genuinely exists. This is not F-02 (unthemeable) but F-01
(the _default derivation_ is theme-broken). A line-based grep also missed it because
Prettier had wrapped the declaration across lines. The behavioural contrast test is what
actually catches this class, which is the better guard.

### Defect: state-bearing surfaces collapse under forced colours

- **Severity:** Medium
- **Area:** `calendar`, `slider`, `tab`, `stepper`
- **Evidence:** F-15 added forced-colors support to `alert`, `badge`, `chip`, `option`,
  `segmented-control`, and `switch` only. None of the 16 audited components had a
  `forced-colors` block.
- **Impact:** In High Contrast, `background` and `color` are replaced by system colours, so
  `calendar`'s selected day computes to an opaque Canvas white sitting on a Canvas-white
  grid. The computed values differ from an unselected day, but the rendered pixels do not —
  the selection is invisible. `slider`'s filled range, `tab`'s active underline, and
  `stepper`'s current step degrade the same way, though each retains a secondary cue
  (thumb position, `font-weight: 600`, and `aria-current` respectively).
- **Fix:** `forced-colors` blocks using `Highlight` / `HighlightText` / `CanvasText`,
  following the existing `switch.css` pattern.
- **Verification:** Confirmed with Playwright `emulateMedia({ forcedColors: "active" })`.
  The selected day and current step now resolve to `Highlight` and are distinct from their
  neighbours.

### Infrastructure: flaky contrast test

The `waitForStyles` helper in `theme.test.js` resolved as soon as the stylesheet link had a
`sheet`, before style recalculation had landed. That made the switch contrast test added in
F-02 fail roughly 2 runs in 5, reporting a contrast of 1 because both colours still computed
as transparent. It now waits for the shadow tree to exist and for a frame to pass, and
throws a named error if the stylesheet never loads. Verified stable across 6 consecutive
runs in Chromium. Firefox then exposed the same flake at a lower rate, because waiting a
frame is still a proxy rather than the condition under test. The switch assertion now polls
for the painted background it actually reads, and throws a named error if it never paints.
Stable across 4 consecutive Firefox runs plus Chromium and WebKit. A flaky test is worse
than no test, and this one was self-inflicted.

### Still not covered

This audit was a contract and theming pass. It did **not** assess keyboard interaction
depth, virtualization correctness under scroll, `table` selection/sort edge cases, or
`form-wizard` step validation. Those remain unaudited.

## F-20: Second audit pass — keyboard, selection, virtualization, wizard validation

Covers the four axes F-19 explicitly left open.

### Clean, with evidence

- **Keyboard depth** — `tree`, `menu`, `tabs`, `rating`, and `segmented-control` implement
  arrows, `Home`/`End`, `Enter`, and `Space` through the shared `keys` helper. `slider` and
  `calendar` add `PageUp`/`PageDown`. `menu` has no `Escape`, which is correct: both of its
  wrappers (`dropdown`, `context-menu`) own dismissal, and a bare menu has nothing to
  dismiss. `accordion` handles no keys because its trigger is a native `<button>` with
  `aria-expanded`, so `Enter` and `Space` come from the platform. `tabs` has no vertical
  orientation, so the absence of `ArrowUp`/`ArrowDown` is a scope decision rather than a gap.
- **`form-wizard` validation** — forward navigation validates every intermediate step and
  stops on the first invalid one, emitting `rowan-invalid`; backward navigation correctly
  skips validation. Control discovery walks assigned elements, `form.elements`, and
  descendants, so nested controls are found.
- **Virtualization spacers** — the `<tr>`/`<td>` spacer pair that pads the scroll window is
  already `aria-hidden="true"`, so it is not announced as an empty row.

### Defect: shift-range selection anchored to a stale row position

- **Severity:** Medium
- **Area:** `src/table/table.js`
- **Evidence:** Selection is stored by `rowId`, correctly surviving a sort, but the range
  anchor was `#lastSelectedIndex` — an index into the visible rows. It was reset by the
  `config` setter and `clearSelection()`, but **not** by `sortBy()` or `set page()`.
- **Impact:** Select a row, sort the column, then shift-select: the range runs from whatever
  row now occupies the old slot. In the added test the selection collapsed to `["1", "2"]`
  where `["1", "2", "3"]` was correct. Silent, and it corrupts a bulk action the user
  believes they scoped correctly.
- **Fix:** Anchor to `#selectionAnchorId` and resolve the index at use time. Paging falls out
  for free: when the anchor row is not on the current page the lookup returns `-1` and the
  shift-click behaves as a plain click.
- **Test:** "anchors a shift range to the selected row after sorting reorders it".

### Defect: virtualized and paginated tables misreport row counts to assistive technology

- **Severity:** Medium
- **Area:** `src/table/table.js`
- **Evidence:** `rowan-virtual-list` sets `aria-posinset` and `aria-setsize` on every
  rendered item, but `rowan-table` set neither `aria-rowcount` nor `aria-rowindex`. With
  `virtualized` or `page` active, only a window of `<tr>` exists in the DOM.
- **Impact:** A screen reader announces the size of the window rather than the dataset — "row
  2 of 6" on a 40-row table — so the user cannot tell where they are or how much remains.
  The inconsistency with `virtual-list`, which does this correctly, indicates an oversight
  rather than a decision.
- **Fix:** `#syncRowCountSemantics()` sets `aria-rowcount` on the table and `aria-rowindex`
  on the header and each rendered row, indexed against the full sorted set and offset by the
  page start. Applied only when rows are actually omitted, and skipped when duplicate row ids
  make the id-to-position mapping ambiguous. It runs as a post-render pass keyed by row id,
  so it stays correct through row diffing rather than only at creation.
- **Test:** "exposes the full row count when rows are omitted from the DOM" and "numbers
  paginated rows against the full row set".

### Still not covered

Scroll-position restoration after data changes, and `virtual-collection` measurement
behaviour with highly variable row heights, were not exercised beyond the existing unit
tests.

**Closed by the pass below.**

## F-21: Virtualization measurement and scroll restoration

The last two axes. **No defects found** — this pass produced coverage, not fixes, and the
honest result is that the existing implementation was already correct.

`virtual-collection` had exactly one test, covering key collisions. Variable-height layout,
which is the hard part, was untested. Four tests added:

- Offsets stack correctly from a mix of measured and estimated sizes.
- Remeasuring a row reflows every offset after it, and remeasuring to the same value returns
  `false` without invalidating the layout.
- `range()` resolves the window against real offsets rather than an average. With two 200px
  rows followed by 20px rows, offset 410 lands on `r2`; an average-size estimate would place
  it near the end of the list.
- Measurements are dropped when a row leaves the collection, so a row that returns does not
  inherit a stale height.

One expectation of mine was wrong and the code was right. At offset 400 with a 40px viewport,
`range()` includes the row starting exactly at 440 — the bottom edge. That is an inclusive
boundary that avoids gaps during fractional scrolling, not an off-by-one. The test now uses a
non-boundary offset and asserts the contract that matters: the returned window fully covers
the viewport.

For the table, scroll position survives an in-place data update, and shrinking the dataset
far below the current scroll offset still renders rows rather than blanking the viewport.
The in-place test asserts the updated text is present, so a table that silently failed to
re-render could not pass it by leaving the scroll untouched.

### Residual risk

Scroll anchoring is still not implemented: if a row _above_ the viewport changes height after
measurement, content below it shifts. In practice rows above the viewport have already been
measured, so this is confined to rows whose content changes while scrolled past. Not
observed, not fixed, and recorded here rather than claimed as covered.

**Update — implemented, and the note above was wrong about the trigger.**

The reasoning that this was "confined to rows whose content changes while scrolled past" was
incorrect. Rows above the viewport are virtualized out of the DOM, so the `ResizeObserver`
cannot remeasure them at all — that path was never the real risk.

The actual trigger is **rows inserted or removed above the current scroll position**, which
reflows every offset below them. That is not an edge case: it is what a live-updating table
does whenever a row arrives at the top, and the result is the user's view jumping while they
are reading. `clearMeasurements()` — reached by changing `virtual-item-size` — does the same
thing.

Implemented for both `rowan-table` and `rowan-virtual-list`, which had identical gaps:

- `#captureScrollAnchor()` records the key of the row at the top of the viewport and how far
  above it the container is scrolled, read from the layout **before** it is invalidated.
- `#applyScrollAnchor()` looks that row up after the reflow and corrects `scrollTop` by the
  difference, skipping adjustments below 1px so ordinary scrolling is untouched.
- Wired into both mutation points: the `items` assignment and the `ResizeObserver` callback
  that applies new measurements.
- `VirtualCollection.entryForKey()` was added with a key-to-index map built during
  `#ensureLayout`, so the lookup is O(1) rather than a scan of every row on each reflow.

Both fixes were verified non-vacuous by disabling the anchor call and confirming the tests
fail with exactly the expected shift: the table's top row moves from `21` to `19`, and the
list's from `Item 20` to `Item 18` — the two-row jump from prepending two rows.

Remaining genuine limit: anchoring corrects the scroll offset, it does not prevent a reflow.
A row whose height changes _while rendered_ still reflows rows after it, which is correct
behaviour. Anchoring only guarantees the row at the top of the viewport stays there.

## F-23: Radio group leaks both child and controller change events

- **Severity:** Medium
- **Area:** `src/radio-group/radio-group.js`
- **Contract:** `rowan-radio-group` documents `rowan-change` as the event fired when its
  selected value changes. Consumers listening on the group should receive one controller
  event for one user selection.
- **Evidence:** A slotted `rowan-radio` emits its bubbling, composed `rowan-change`. The
  group observed it, updated `value`, and emitted its own event with `{ value, radio }` but
  left the child event bubbling. A listener on the group therefore received two events for
  one click: first the radio's `{ checked, value }`, then the group's `{ value, radio }`.
- **Impact:** Consumers persisting selection from the group could execute the same action
  twice and receive two incompatible detail shapes from a single documented event surface.
- **Fix:** The controller now listens directly on each owned radio. It calls
  `stopPropagation()` at that event target before emitting one group-level event, so the child
  event cannot bubble into the group or its ancestors while listeners attached directly to the
  radio still receive it. The listener records are retained across disconnects, so
  `BaseElement.listen()` restores them synchronously on reconnect before its queued render. This
  also prevents an outer group from treating a nested group's radio as its own.
- **Test:** `radio-group.test.js` verifies a listener on the group receives exactly one
  composed event for a child selection, a direct child listener still receives the child's
  event, parent-driven updates stay silent, and a selection immediately after reconnection
  still emits only once.

**Resolution (fixed).** Discovered while expanding the low-test component baseline. The new
test failed with two events before the controller boundary was added and passes with the group's
own event detail after the fix. An immediate post-reconnect selection regression confirms the
retained listener records are restored before the render microtask.

## F-24: Enum properties accept values outside their documented unions

- **Severity:** Medium
- **Area:** `src/divider/divider.js`, `src/badge/badge.js`, `src/alert/alert.js`,
  `src/avatar/avatar.js`, `src/spinner/spinner.js`
- **Contract:** Each component documents finite property unions such as
  `"horizontal" | "vertical"`, `"info" | "success" | "warning" | "danger"`, and
  `"sm" | "md" | "lg"`. Properties must reflect only their supported public state.
- **Evidence:** Setters reflected arbitrary strings and getters returned them unchanged.
  For example, `divider.orientation = "diagonal"` returned `"diagonal"` while rendering
  and exposing horizontal separator semantics; badges, alerts, avatars, and spinners likewise
  retained unsupported `tone` or `size` values that no CSS variant could interpret. Raw
  declarative values such as `tone=" DANGER "` had the same mismatch: the getter normalized
  them while host-attribute CSS still selected the default state.
- **Impact:** Consumer state, reflected attributes, rendered output, and generated type/CEM
  declarations could disagree. Invalid variants silently fell back visually while remaining
  observable as invalid public values.
- **Fix:** Each affected component now normalizes at getter, property-setter, and observed
  attribute boundaries, canonicalizing supported case/whitespace variants and falling back to
  its documented default before reflection and rendering.
- **Test:** Focused component tests prove invalid property and declarative values normalize to
  the default and that canonical supported values continue to reflect correctly.

**Resolution (fixed).** Five focused regression tests failed before normalization and pass
afterward. The generated declarations already described the intended unions, so no public type
surface changed.

## F-25: Unnamed radio controls are incorrectly grouped together

- **Severity:** Medium
- **Area:** `src/radio/radio.js`
- **Contract:** Standalone `rowan-radio` controls should follow native radio grouping semantics:
  only radios with a shared non-empty `name` and form owner form a peer group. `rowan-radio-group`
  owns selection for its unnamed children.
- **Evidence:** `#uncheckPeers()` matched peers whose `radio.name === this.name`, including the
  default empty string. Selecting any unnamed Rowan radio silently unchecked every other unnamed
  radio in the same document root, including radios in a nested `rowan-radio-group`. A browser
  probe confirms two native `<input type="radio">` controls without `name` both remain checked.
- **Impact:** Independent unnamed controls and nested groups corrupted each other's selection.
  A nested group's radio could uncheck an outer group's active radio before either controller had
  a chance to reconcile its own value.
- **Fix:** The peer-uncheck path now returns for an empty name and reuses a captured non-empty
  name for comparisons. Named radios retain same-form grouping; `rowan-radio-group` continues to
  coordinate unnamed child selection through its own `value` state.
- **Test:** `radio.test.js` asserts two unnamed controls remain independently checked, and
  `radio-group.test.js` verifies a nested unnamed group changes only its own value.

**Resolution (fixed).** The direct radio regression and nested-group ownership test both fail
without the empty-name guard and pass with it.

---

## Open findings (2026-09-16 review)

Source: `documentation/code_review/2026-09-16T130711-0700_grok-4.6.md` at `c2f548d`.
Ordered High → Medium → Low. F-01–F-25 were not reopened. F-26 through F-56 are fixed.

### F-26: Required radio-group stays invalid after a later option is selected

- **Severity:** High
- **Area:** `src/radio-group/radio-group.js`, `src/radio/radio.js`
- **Contract:** Native radio `required` is group-level: any checked peer satisfies it. `rowan-form-wizard` and `rowan-validation-summary` walk descendant FACE `checkValidity()`.
- **Evidence:** The group is not form-associated. `required` is implemented by `radio.required = true` on index 0 only (`radio-group.js:97`). Each `rowan-radio` then validates independently (`radio.js:230`: `if (this.required && !this.checked)`). Selecting a later radio unchecks the first but leaves it `required`, so `north.checkValidity()` is still false. Tests assert that only the first child is required; they never assert form validity after selecting a later option.
- **Impact:** A completed required group still fails `form.checkValidity()`, blocks wizard Next/Complete, and shows a spurious error.
- **Fix:** `rowan-radio` treats required as satisfied when any selection peer is checked. Peers are radios in the same `rowan-radio-group` (including unnamed children the group owns), or same-name/same-form radios when standalone. Checking one radio re-syncs peer validity immediately so `form.checkValidity()` is correct in the same turn. Child radios still submit; the group does not become a second FACE control.
- **Test:** `radio.test.js` asserts a required named radio is valid after a same-name peer is checked. `radio-group.test.js` asserts a required group (named and unnamed) is valid after selecting the second option, including `form.checkValidity()`.

**Resolution (fixed).** Native group-level required is implemented on the radio, matching F-25's unnamed-vs-named grouping: unnamed standalone radios stay independent, unnamed children of a group share validity through the group, and named radios share it by form owner. The new tests failed before peer validity sync and pass after.

### F-27: Number field wipes in-progress input (`-`, `1.`)

- **Severity:** High
- **Area:** `src/number-field/number-field.js`, also `src/time-picker/time-picker.js`, `src/date-picker/date-picker.js`
- **Contract:** Users must be able to type a leading minus, a trailing decimal, and other intermediate number-input states. `rowan-text-field` already skips write-back while composing and when the inner value matches.
- **Evidence:** Every `input` event assigns `this.value = this.#input.value`, which runs `/^[+-]?(?:\d+|\d*\.\d+)$/` and stores `""` for `-`, `1.`, `.5` mid-edit, and `1e2`. Render then does `this.#input.value = this.value` (`number-field.js:304`). For `type="number"`, writing `""` (or a truncated `"1"`) clears the browser’s unsanitized text buffer.
- **Impact:** The user cannot type a negative or decimal number. The same write-back exists on time-picker and date-picker.
- **Fix:** Skip writing the committed value into the inner control while it is focused or `validity.badInput`. Incomplete `input` events no longer overwrite the committed value; `change` still normalizes. `normalizeNumberString` uses finite `Number(...)` so `1e2` and `.5` survive. Date and time pickers use the same write-back guard.
- **Test:** Focused inner input keeps its live buffer when the committed value is cleared; `1e2` / `.5` round-trip; `badInput` does not empty the committed value. Date and time pickers have the same focused write-back test.

**Resolution (fixed).** Matches `rowan-text-field`’s write-back skip. FACE still reflects the committed number; parent-driven `value` assignments apply on blur. Events still fire only from user `change` / stepper clicks.

### F-28: `type="PASSWORD"` bypasses password-value eviction

- **Severity:** High
- **Area:** `src/text-field/text-field.js`
- **Contract:** F-08: a password value must never enter a DOM attribute, and the inner control must be `type="password"`. F-24 canonicalized enums on divider/badge/alert/avatar/spinner; text-field `type` was not included.
- **Evidence:** `#isSecret()` is `this.type === "password"` (`text-field.js:318`). The public `type` getter returns the raw attribute. `#normalizedType` is used only for the inner `<input>`. Markup such as `type="PASSWORD"` or `type="Password"` does not evict `value` and falls through to an inner `type="text"` control.
- **Impact:** The secret is both visible and present in the DOM. A case mismatch reopens F-08.
- **Fix:** Canonicalize `type` at getter, setter, and observed-attribute boundaries: trim, lower-case, accept the documented union, otherwise `text`. Default `text` is omitted from the attribute. Any canonical `password` evicts `value` before first paint. The inner input uses the canonical type.
- **Test:** Markup `type="PASSWORD" value="secret"` has no `value` attribute, inner input is `type="password"`, and `el.type === "password"`. Unknown types collapse to `text`. Switching to `type="Password"` evicts a previously reflected value.

**Resolution (fixed).** Same F-24 rewrite path as `rowan-divider`. `#isSecret()` now sees canonical `password` for any case/whitespace variant, so F-08 eviction runs for markup and property assignment.

### F-29: Dropzone `accept` filters the picker, not drops

- **Severity:** High
- **Area:** `src/dropzone/dropzone.js`, `src/file-upload/file-upload.js`
- **Contract:** The documented `accept` attribute is the client-side file-type gate for both picker and drop.
- **Evidence:** `accept` is copied onto the hidden `<input type="file">` (`dropzone.js:190`) so the OS picker filters, but `#emitFiles` never matches files against `accept` (`dropzone.js:207`). `rowan-file-upload.#acceptFiles` only applies `multiple` and `max-files`. Tests only assert that the attribute reflects onto the input.
- **Impact:** A dropzone with `accept=".csv,.pdf"` still queues a dropped `.exe`. There is no size cap; drop is the bypass.
- **Fix:** Shared `src/lib/file-accept.js` matches HTML `accept` tokens: `.ext`, `type/subtype`, and `type/*`. Dropzone filters picker `change` and `drop` before `rowan-files-add`; `detail.files` are matches and `detail.rejected` failed `accept`. File-upload applies the same filter in `#acceptFiles` so a synthetic event cannot bypass it.
- **Test:** Drop a `.exe` onto `accept=".csv"`; `detail.files` is empty and `detail.rejected` holds the exe. Mixed drops, MIME wildcards, picker change, and a synthetic file-upload event are covered.

**Resolution (fixed).** Empty `accept` still allows every file. `multiple` still keeps only the first accepted file; extra accepted files are not reported as `rejected`. Events still fire only from user picker/drop (or a composed child event on file-upload), not from setting `accept`.

### F-30: Row-details panel leaks body scroll lock on disconnect

- **Severity:** High
- **Area:** `src/row-details-panel/row-details-panel.js`, `src/lib/overlay-stack.js`
- **Contract:** Removing the last open modal must restore `document.body.style.overflow`. `rowan-dialog` and `rowan-command-palette` unregister in `disconnectedCallback`.
- **Evidence:** An open panel calls `pushOverlay(this)` on open. `disconnectedCallback` (`row-details-panel.js:169`) closes the native `<dialog>` but never calls `removeOverlay(this)` and never clears `#isOpen`. `pruneDisconnectedOverlays()` runs only from `pushOverlay` / `removeOverlay` (`overlay-stack.js:29`). The dialog suite documents this lazy prune as needing a later overlay update.
- **Impact:** Removing the last open panel leaves `overflow: hidden`. The page is interactive (native modal is already closed) but cannot scroll until some other overlay mutates the stack.
- **Fix:** On disconnect, call `removeOverlay(this)` and reset `#isOpen`, matching `src/dialog/dialog.js:35`. Reconnect while `open` still re-enters the stack because `#syncOpenState` sees `#isOpen === false`.
- **Test:** Open a details panel, remove it from the document, assert body overflow is restored with no further overlay activity. Reconnect-while-open still restores focus containment.

**Resolution (fixed).** Disconnect unregisters immediately, so the last open panel no longer leaves `overflow: hidden`. `rowan-close` still fires only for user dismissal, not for parent `remove()`.

### F-31: `css:check` imports Node 22 `glob` while CI is Node 20

- **Severity:** High
- **Area:** `scripts/check-css-tokens.mjs`, `.github/workflows/ci.yml`
- **Contract:** F-02’s non-regression guard (`npm run lint` → `css:check`) must run in CI.
- **Evidence:** The script does `import { glob } from "node:fs/promises"` (`check-css-tokens.mjs:4`). That named export was added in Node 22. CI (`.github/workflows/ci.yml:19`) runs Node 20, where the import throws `does not provide an export named 'glob'`. Local Node 24 hides this.
- **Impact:** The F-02 colour-literal lint is not actually running in CI. A hard-coded hex can land on `main`.
- **Fix:** Walk `src/` with `readdir` + `withFileTypes` (Node 20) instead of `fs.promises.glob`. Still skip `src/tokens/`. Keep CI on Node 20.
- **Test:** `node@20 ./scripts/check-css-tokens.mjs` completes and reports no unthemeable colour literals.

**Resolution (fixed).** The F-02 lint now loads on the CI Node version. No new glob dependency; no CI version bump.

### F-32: Date-only `formatDate` shifts a day west of UTC

- **Severity:** High
- **Area:** `src/lib/format.js`
- **Contract:** A calendar date such as a due date, birth date, or schedule label must format as that calendar day. `rowan-calendar` already round-trips date-only values via `Date.UTC`.
- **Evidence:** `readDate` feeds date-only ISO strings through `new Date(value)` (`format.js:68`). Per spec those parse as UTC midnight, so `formatDate("2026-01-01", { locale: "en-US", timeZone: "America/Los_Angeles" })` returns `Dec 31, 2025`. The suite only exercises a full ISO datetime with an explicit zone.
- **Impact:** Any zone west of UTC shows the previous day. The same shift happens with the host timezone when no `timeZone` is passed.
- **Fix:** `YYYY-MM-DD` is parsed with `Date.UTC` and the same round-trip as `rowan-calendar` (impossible days such as `2026-02-31` are invalid). Formatting uses `timeZone: "UTC"` so a caller `timeZone` cannot shift the calendar day. Instants (`Date`, timestamps, datetimes) still honor `timeZone`.
- **Test:** `formatDate("2026-01-01", { locale: "en-US", timeZone: "America/Los_Angeles" })` equals the UTC medium date for 1 Jan 2026. `2026-02-31` uses `fallback`.

**Resolution (fixed).** Date-only strings are calendar dates, not UTC midnights displayed in local time. Datetime strings keep the previous zone behavior.

### F-33: `setCustomValidity` is not synchronous

- **Severity:** High
- **Area:** `src/lib/base-element.js`
- **Contract:** Native `setCustomValidity` is synchronous: `el.setCustomValidity("taken"); el.reportValidity()` / `el.validity.customError` must already reflect the error. F-07 only guaranteed that a later render would not wipe a custom error.
- **Evidence:** `setCustomValidity` stores `#customValidityMessage` and `requestRender()`s (`base-element.js:194`). `applyValidity` runs later in the render microtask, and that microtask no-ops when `!this.isConnected`. The F-07 test awaits a microtask before asserting.
- **Impact:** A consumer who reports validity in the same turn still sees the previous state. Disconnected hosts never apply the custom error at all.
- **Fix:** `setCustomValidity` writes `#customValidityMessage` and commits through `ElementInternals.setValidity` immediately, merging with the last `applyValidity` constraint flags/message/anchor. `requestRender()` still runs so inner inputs and `aria-invalid` catch up. Clearing the custom error restores the stored constraint state in the same turn.
- **Test:** `el.setCustomValidity("taken"); expect(el.validity.customError).to.equal(true)` with no `await`, including on a disconnected host. F-07 persist-through-render still holds.

**Resolution (fixed).** Custom errors are visible to `validity` / `checkValidity` / `reportValidity` in the same turn. Renders still cannot wipe them (F-07).

### F-34: Outside-click dismisses popover and parent dialog together

- **Severity:** High
- **Area:** `src/popover/popover.js`, `src/dropdown/dropdown.js`, `src/dialog/dialog.js`
- **Contract:** Native stacked `<dialog>`s only let the topmost receive `cancel`. An outside click or Escape must close only the topmost surface.
- **Evidence:** Popover and dropdown dismiss on a document `pointerdown` whenever `composedPath()` does not include themselves (`popover.js:255`). They are not registered in `overlay-stack`. A popover open inside a `rowan-dialog` therefore closes on backdrop `pointerdown`, and the same gesture’s later `click` hits `event.target === this.#overlay` on the native dialog (`dialog.js:91`) and closes that too. Nested popovers: `#handleKeydown` `preventDefault()`s but does not `stopPropagation()`.
- **Impact:** One outside click dismisses both layers. Nested popovers both close on Escape.
- **Fix:** Overlay stack has dismissible layers that do not lock scroll. Popover and dropdown push/remove as dismissibles and handle outside pointerdown / Escape only when topmost, with `preventDefault` + `stopPropagation`. Closing notes a same-turn consume so a parent dialog’s backdrop `click` / `cancel` does not also fire. Dialog backdrop and Escape no-op unless the dialog is topmost and no dismissible closed this turn.
- **Test:** Open a dialog, open a popover (or dropdown) inside it, pointerdown+click the dialog backdrop; only the nested surface closes. Nested popovers: Escape closes only the inner one.

**Resolution (fixed).** Lightweight overlays join the stack without locking page scroll. Parent modals stay open through the same dismiss gesture.

### F-35: Fieldset-disabled FACE hosts still steal overlay focus

- **Severity:** Medium
- **Area:** `src/lib/focus.js`
- **Contract:** A control disabled by an ancestor `<fieldset disabled>` must not receive initial focus after `showModal()`. Native `:disabled` matches that state.
- **Evidence:** `isFocusable` treats a host as disabled only via `hasAttribute("disabled")` or `aria-disabled="true"` (`focus.js:25`). `formDisabledCallback` sets `#formDisabled` and `internals.ariaDisabled`, but the host attribute stays off. Dialog, drawer, command-palette, and row-details-panel use `collectFocusableElements` to pick initial focus.
- **Impact:** A fieldset-disabled `rowan-text-field` can steal first focus from the first actually interactive control in a modal.
- **Fix:** `isFocusable` rejects `element.matches(":disabled")`, which covers FACE `formDisabledCallback` and native controls inside `<fieldset disabled>` (including the legend exception, which `closest("fieldset[disabled]")` would get wrong).
- **Test:** FACE host and native input inside `<fieldset disabled>` are not focusable and are omitted from `collectFocusableElements`. Opening a dialog with a disabled fieldset does not focus that field.

**Resolution (fixed).** Overlay initial-focus collection now follows the same disabled state the browser uses for Tab.

### F-36: Drawer reconnect skips overlay-stack re-registration

- **Severity:** Medium
- **Area:** `src/drawer/drawer.js`, `src/row-details-panel/row-details-panel.js`
- **Contract:** Reconnecting an open modal must re-enter the overlay stack so body scroll stays locked. Command-palette re-installs containment on the already-open path.
- **Evidence:** `rowan-drawer` calls `removeOverlay` on disconnect but does not set `#isOpen = false`. On reconnect while `open` is still true, `#syncOpenState` hits `if (this.open === this.#isOpen) return` (`drawer.js:144`) and skips `#onOpen()` / `pushOverlay`. `#reconcileNativeOpen()` still calls `showModal()`. Row-details-panel has the same short-circuit at line 566.
- **Impact:** The drawer looks modal but is absent from the stack and body scroll is not locked.
- **Fix:** On disconnect, `removeOverlay` only when `#isOpen` and then set `#isOpen = false`, matching `rowan-dialog`. Reconnect while `open` takes the open path and `pushOverlay`s again. Row-details-panel already did this in F-30.
- **Test:** Open a drawer, remove and re-append it; it is topmost and `overflow` is `hidden`. Row-details reconnect-while-open asserts the same stack lock.

**Resolution (fixed).** Reconnect-while-open re-enters the overlay stack. `rowan-change` still fires only for user close.

### F-37: Date-picker accepts impossible dates such as `2026-02-31`

- **Severity:** Medium
- **Area:** `src/date-picker/date-picker.js`
- **Contract:** Native `input type="date"` rejects impossible days (`input.value` becomes `""`). `rowan-calendar` and `rowan-date-range-picker` round-trip through `Date.UTC` and reject them.
- **Evidence:** `normalizeDateValue` only tests `/^\d{4}-\d{2}-\d{2}$/` (`date-picker.js:9`). `2026-02-31` is stored, reflected, submitted via FACE, and compared as a string for min/max. After render the inner control is empty while the host still holds `2026-02-31`.
- **Impact:** Invalid dates survive as form values and disagree with the visible control and with calendar/range.
- **Fix:** Shared `src/lib/calendar-date.js` UTC round-trip (`normalizeCalendarDate` / `parseCalendarDate`). Date-picker, calendar, date-range-picker, and `formatDate` all use it. Impossible days become `""` before reflect and `setFormValue`.
- **Test:** `el.value = "2026-02-31"`; host value is `""`, the attribute is gone, and FormData is empty.

**Resolution (fixed).** Date-picker now matches calendar/range and native `input type="date"`: `2026-02-31` is not a value. `rowan-change` still fires only from user commit.

### F-38: Multi-select combobox does not close on Tab

- **Severity:** Medium
- **Area:** `src/multi-select-combobox/multi-select-combobox.js`
- **Contract:** After F-11, both comboboxes follow the APG combobox pattern. `rowan-combobox` closes the popup on Tab (`combobox.js:406`).
- **Evidence:** The multi-select keydown handler has no Tab (or `focusout`) path (`multi-select-combobox.js:522`). The only dismissals are Escape and document `pointerdown`.
- **Impact:** Tabbing to the next field leaves the listbox open over the following control. Keyboard-only users cannot dismiss it without Escape.
- **Fix:** Tab sets `open = false` without `preventDefault`, so focus can move. `focusout` also closes when `relatedTarget` is outside the host (including nested shadow). Focus remaining on chips/options inside the control does not close.
- **Test:** Open the multi-select, press Tab; `open` is false. Moving focus to a following button also closes the popup.

**Resolution (fixed).** Matches `rowan-combobox`. Tab is not an option-commit key, so no `rowan-change`. Enter still toggles selection and keeps the popup open.

### F-39: Command palette Home/End steal the caret

- **Severity:** Medium
- **Area:** `src/command-palette/command-palette.js`, `src/multi-select-combobox/multi-select-combobox.js`
- **Contract:** APG combobox: Home/End move the caret in an editable input; they move options only when the popup itself is focused or the combobox is not editable.
- **Evidence:** The search field is `<input type="search" role="combobox">`. Home and End call `preventDefault()` and jump to the first/last enabled command (`command-palette.js:381`). Multi-select has the same intercept while the popup is open (`multi-select-combobox.js:538`).
- **Impact:** The caret can never move to the start or end of the query.
- **Fix:** Removed Home/End from the editable input keydown path on command palette, multi-select, and combobox (all `aria-activedescendant`, listbox never focused). Arrow keys still move the active option. `#moveActiveItemToBoundary` is gone.
- **Test:** Type a query, press Home; `defaultPrevented` is false, the active command/option is unchanged. Synthetic events cannot move the caret; not preventing default is what lets the UA do it.

**Resolution (fixed).** Home/End are caret keys on these editable comboboxes. ArrowDown/ArrowUp still move the highlight.

### F-40: Toaster paints under native modal top layer

- **Severity:** Medium
- **Area:** `src/toaster/toaster.css`
- **Contract:** Notifications shown while a modal is open must remain visible and reachable, or be explicitly queued.
- **Evidence:** `rowan-toaster` is `position: fixed; z-index: var(--rowan-toaster-z-index, 1000)` (`toaster.css:7`). Modal overlays use `showModal()`, which puts them in the top layer above every `z-index`.
- **Impact:** A toast shown while a dialog, drawer, command palette, or row-details panel is open is painted under the backdrop: not visible, not reachable, dismiss control inert.
- **Fix:** Toasts are parked (not dismissed) while a lock-scroll modal is in the overlay stack, then flushed when it closes. The toaster uses `popover="manual"` so shown toasts join the top layer when no modal is open. Chrome still paints modal dialogs above popovers, so deferral is the reachable path. No `rowan-toast-dismiss` on park; `rowan-toast-show` fires when the toast actually appears.
- **Test:** Open a dialog, `show()` a toast; nothing renders until the dialog closes, then the toast appears. A visible toast is parked when a dialog opens and restored after close.

**Resolution (fixed).** Toasts are never trapped under a modal backdrop. Events still fire only from show/dismiss, not from parent property sets.

### F-41: Closed row-details panel remains `aria-modal`

- **Severity:** Medium
- **Area:** `src/row-details-panel/row-details-panel.js`
- **Contract:** Closed `rowan-dialog`, `rowan-drawer`, and `rowan-command-palette` set `this.inert = true` and clear `internals.role` / `ariaModal` so they leave the accessibility tree.
- **Evidence:** The panel never sets `inert` from open state. `#applyDefaultA11y` always assigns `internals.role = "dialog"` and `internals.ariaModal = "true"` (`row-details-panel.js:605`), even when closed.
- **Impact:** A closed panel remains a modal dialog in the accessibility tree.
- **Fix:** Same as dialog/drawer: `this.inert = !this.open`; host `role`, `ariaModal`, and `ariaLabel` are set only while open; `ariaHidden` is `"true"` when closed.
- **Test:** Closed panel has `inert === true` and `internals.role == null`; open panel is a named dialog.

**Resolution (fixed).** Closed panels leave the accessibility tree. Author `role` / `aria-modal` attributes are still not overwritten.

### F-42: `.gitignore` is only `node_modules`; generated artifacts are tracked

- **Severity:** Medium
- **Area:** `.gitignore`, `storybook-static/`, `documentation/documentation-static-check/`, `documentation/documentation/documentation-static-check/`, `tmp/`
- **Contract:** Generated builds, nested Vite output, and temp CEM dumps do not belong in git. They are not part of the npm tarball.
- **Evidence:** `.gitignore` contains only `node_modules`. Tracked: `storybook-static/` (183 files), `documentation/documentation-static-check/` (including a bundled MapLibre build), a nested duplicate at `documentation/documentation/documentation-static-check/` from a mistaken Vite `outDir`, and `tmp/rowan-sprint36-cem.XFTknQ/custom-elements.json` (~2 MB). Nested static HTML loads `/assets/...` from domain root, so those snapshots 404 unless served at `/`.
- **Impact:** Git history is bloated. The nested copy looks like a published docs site and is not actually serveable.
- **Fix:** `.gitignore` (and `.prettierignore`) cover `storybook-static/`, `documentation/**/documentation-static-check/`, and `tmp/`. Those trees were removed from the index. `npm run documentation:build` uses `documentation/vite.build.mjs` with `base: "./"` so assets are relative. Lint only globs `documentation/*.js`, not generated bundles.
- **Test:** `git check-ignore` matches those paths. `npm run documentation:build` writes `./assets/...` and does not show up as untracked.

**Resolution (fixed).** Generated Storybook, static docs, and tmp CEM dumps are no longer source. History still contains the old blobs until a later rewrite; they will not grow on new commits.

### F-43: Core and MapLibre npm packs include tests and stories

- **Severity:** Medium
- **Area:** `package.json`, `packages/maplibre/package.json`
- **Contract:** Published files are the runtime surface. `@rowan-ui/icons` already uses an explicit allowlist and packs zero tests.
- **Evidence:** `"files": ["src", "types", …]` publishes 83 `*.test.js` files, 76 `*.stories.js` files, and `src/storybook/event-script.js`. MapLibre likewise packs tests and stories. `sideEffects` points only at registration modules, so consumers are not auto-executing tests.
- **Impact:** The tarball is larger and ships test/Storybook harness code to npm. Consumers can import `@rowan-ui/core/src/text-field/text-field.test.js`.
- **Fix:** Core and MapLibre `files` allow runtime `js`/`css`/`d.ts` and negate `*.test.js`, `*.stories.js`, and `src/storybook/`. `.npmignore` matches. `test:package` fails if a packed tarball still contains those paths.
- **Test:** `npm pack --dry-run` lists no `*.test.js` or `*.stories.js`. `npm run test:package` passes.

**Resolution (fixed).** Runtime `src/` and `types/` still ship. Tests, stories, and the Storybook event helper do not.

### F-44: `useRowanElement` never binds listeners if the host mounts late

- **Severity:** Medium
- **Area:** `src/react/index.js`
- **Contract:** F-03 fixed re-assignment on every render. Listeners must still attach when the host appears after the first effect, which is the Next.js client-boundary pattern the README describes.
- **Evidence:** The events effect depends on `[ref, eventTypes]` and returns early when `ref.current` is null (`index.js:48`). Property assignment has no dependency array, so it retries every render; listeners do not. The documented README example always renders `<rowan-table ref={tableRef}>`, so the happy path works.
- **Impact:** Conditional render, or a delayed custom-element mount, never attaches `rowan-select` (etc.). React 18 Strict Mode remount is fine because the effect re-runs.
- **Fix:** A layout effect snapshots `ref.current` into state after each commit. The listener effect depends on that host, so it binds when the element appears. Properties still assign only on `Object.is` change (F-03). The public `ref` API is unchanged.
- **Test:** Render the hook first without the host, then mount the host, and assert the listener fires. Existing rebind/unmount tests still pass.

**Resolution (fixed).** Delayed and conditional hosts get listeners. Handler identity can still change without rebinding; events still fire only from the custom element, not from property assignment.

### F-45: Context menu and dropdown do not dismiss on Tab

- **Severity:** Medium
- **Area:** `src/context-menu/context-menu.js`, `src/dropdown/dropdown.js`
- **Contract:** APG menus either trap focus or dismiss on Tab. Dropdown with `aria-haspopup="menu"` is the menu-button pattern: open moves focus to the first item, item activate closes.
- **Evidence:** Context-menu keydown has no Tab / Shift+Tab handler (`context-menu.js:281`). `:host { display: contents }` and a non-top-layer overlay leave the rest of the page interactive. Dropdown sets `aria-haspopup="menu"` (`dropdown.js:78`) but opening does not move focus into the menu, and activating a slotted `rowan-menu-item` does not close it.
- **Impact:** Tab moves to the next page control while the menu stays open. Keyboard users can interact with the background.
- **Fix:** Tab closes both surfaces without `preventDefault`, so focus can leave. Context menu skips restore-focus on Tab (unlike Escape). Dropdown follows menu-button: focus the first `rowan-menu-item` on open, close when a slotted menu emits `rowan-change` with an `item`.
- **Test:** Open the menu, press Tab; it is closed and Tab is not cancelled. Activate a dropdown item; the dropdown is closed.

**Resolution (fixed).** Tab dismisses the menu. Dropdown item activate closes the menu. Parent-driven `open` still does not emit `rowan-change`.

### F-46: Popover is `role="dialog"` without focus move or top layer

- **Severity:** Medium
- **Area:** `src/popover/popover.js`, `src/popover/popover.css`, also dropdown and tooltip CSS
- **Contract:** `role="dialog"` + `aria-haspopup="dialog"` is the non-modal dialog contract: focus moves into the dialog on open. Modals were moved to the top layer specifically to avoid clipping and z-index wars.
- **Evidence:** Opening leaves focus on the trigger (`popover.js:101`). There is no document-level Escape listener, so Tabbing out leaves an open dialog that keyboard users cannot dismiss without clicking. CSS is `position: absolute; z-index: 20` (`popover.css:22`). Dropdown and tooltip have the same clipping/top-layer gap.
- **Impact:** Keyboard users cannot dismiss after Tabbing out. Any `overflow: hidden` ancestor (table, dialog body, split pane) clips the panel. It cannot cover a native modal.
- **Fix:** The panel uses `popover="manual"` and is positioned `fixed` from the trigger, so it joins the top layer and is not clipped. On open, focus moves to the first focusable in the panel (or the panel). Document Escape and host Escape close it and restore the trigger. `focusout` closes when focus leaves the popover. Keeps `role="dialog"`. Dropdown/tooltip clipping is unchanged.
- **Test:** Open the popover; focus is the first panel control. Escape from that control closes it. A popover in an `overflow: hidden` box still paints below the clip edge.

**Resolution (fixed).** Non-modal dialog contract: focus in, Escape/focusout out, top layer so overflow ancestors cannot clip it. Parent-driven `open` still does not emit `rowan-change`.

### F-47: Nested dialog/tab/switch roles in the accessibility tree

- **Severity:** Medium
- **Area:** `src/dialog/dialog.js`, `src/tabs/tabs.js`, `src/tab/tab.js`, `src/switch/switch.js`
- **Contract:** One role per widget. Native `<dialog>` already supplies `role="dialog"`.
- **Evidence:** While open, each modal exposes three dialog objects: host `ElementInternals` (`role=dialog`, `aria-modal=true`), the native `<dialog>`, and the inner `.panel` with `role="dialog"` (`dialog.js:108`). Tests encode this (`dialog.test.js:286`). `rowan-tabs` / `rowan-tab` stamp `tablist` / `tab` on both host internals and inner nodes (`tabs.js:82`, `tab.js:109`). `rowan-switch` is host `role="switch"` wrapping a focused `<input type="checkbox">`.
- **Impact:** Screen readers can announce nested dialogs, tablist-in-tablist, or checkbox instead of switch.
- **Fix:** Native `<dialog>` is the only dialog: host `role`/`ariaModal` stay unset, `.panel` has no dialog role, and the overlay carries `aria-label` / `aria-labelledby`. Tablist/tab/tabpanel live on ElementInternals; inner wrappers are not those roles (tab’s inner button is `presentation`). Switch role and `aria-checked` are on the focused checkbox, not the host. Same overlay naming on drawer, command-palette, and row-details-panel.
- **Test:** Open dialog/drawer/palette: host `role` is null, overlay is named, panel has no dialog role. Tabs: one tablist, tab host `role=tab`, inner button `presentation`. Switch: host `role` null, input `role=switch`.

**Resolution (fixed).** One widget, one role. Author `role` on the host is still not overwritten.

### F-48: External `<label for>` added after connect is never observed

- **Severity:** Medium
- **Area:** `src/lib/base-element.js`
- **Contract:** F-10: an external `<label for>` names the control. That must still work if the label or host `id` appears after `connectedCallback`.
- **Evidence:** `#observeExternalLabels` snapshots `internals.labels` at connect and returns immediately when the list is empty (`base-element.js:477`). Labels added later never get a `MutationObserver`. Reconnect after the label exists does recover. Static `<label for>` + host `id` present at connect still works.
- **Impact:** Dynamic forms that attach labels after mount keep a stale `externalLabelText` until some unrelated render.
- **Fix:** FACE hosts observe their own `id` and the root’s `label[for]` insertions/changes. Matching labels get a text `MutationObserver` so later edits still `requestRender()`. Unrelated `for` mutations are ignored.
- **Test:** Append `<label for>` after connect, then change its text; `externalLabelText` and the inner `aria-label` update. Assigning `id` after a matching label exists also adopts it. F-10 static markup still works.

**Resolution (fixed).** Late labels and late host ids name the control. `label`/`for` still cannot cross a shadow boundary.

### F-49: Table link cells always `preventDefault` so they never navigate

- **Severity:** Medium
- **Area:** `src/table/table.js`
- **Contract:** A link cell renders a real `<a href>` after `sanitizeNavigationHref`. If it is a link, unmodified click and Cmd/Ctrl-click should navigate unless the consumer cancels.
- **Evidence:** Tbody click always `preventDefault()`s and emits `rowan-cell-action` (`table.js:1195`). Without a listener, the link does nothing. The default is already cancelled before the event is re-emitted, so consumers cannot restore navigation from `nativeEvent`. Protocol filtering itself is correct.
- **Impact:** Table links are inert unless the app reimplements navigation. Cmd/Ctrl-click cannot open a new tab.
- **Fix:** `rowan-cell-action` is cancelable. The native click is `preventDefault`ed only when a listener cancels that event. No listener (or a listener that does not cancel) lets the `<a href>` navigate, including modifier-clicks. `sanitizeNavigationHref` still rejects `javascript:` etc.
- **Test:** Uncancelled link click has `defaultPrevented === false`. A cancelling listener blocks the native click. Existing action tests cancel the link action so they do not navigate the runner.

**Resolution (fixed).** Links are links. Apps that want action-only behavior call `preventDefault()` on `rowan-cell-action`.

### F-50: `rowan-page-change` is 0-based on table and 1-based on pagination

- **Severity:** Medium
- **Area:** `src/pagination/pagination.js`, `src/table/table.js`
- **Contract:** A shared event name has one index space, documented on both JSDoc `@event` blocks.
- **Evidence:** `rowan-table` emits 0-based `page.index` (test expects `{ index: 1, size: 2 }` after leaving page 0). `rowan-pagination` emits the 1-based `page` attribute (test expects `{ index: 1, size: null }` for the first page) (`pagination.js:69`).
- **Impact:** A consumer wiring the two together skips a page or lands off-by-one.
- **Fix:** Both emit `detail.index` (0-based) and `detail.page` (1-based). Pagination’s `page` attribute stays 1-based. Table’s `page.index` property stays 0-based. Wire with `table.page = { ...table.page, index: event.detail.index }`.
- **Test:** Pagination first-page event is `{ index: 0, page: 1 }`. Table next-page is `{ index: 1, page: 2, size: 2 }`. Wiring pagination next into table lands on the second page.

**Resolution (fixed).** Shared event, two fields, one convention. Parent-driven `page` still does not emit.

### F-51: Confirm dialog initial focus lands on the × close button

- **Severity:** Medium
- **Area:** `src/confirm-dialog/confirm-dialog.js`, `src/dialog/dialog.js`
- **Contract:** APG alertdialog puts initial focus on a meaningful action, usually the least destructive one.
- **Evidence:** `rowan-confirm-dialog` reuses `rowan-dialog` unchanged. `#focusFirstElement` focuses the first focusable in the panel (`dialog.js:204`), which is the inner “×” close button (`dialog.js:72`). The × emits `rowan-close` rather than `rowan-cancel`.
- **Impact:** Enter/Space on open may dismiss via Close instead of Confirm/Cancel. The least-destructive action is not first.
- **Fix:** `rowan-dialog` has `alert`. Confirm sets it. The × is hidden, the native overlay is `role="alertdialog"`, and initial focus is the first control in the actions slot (Cancel). Escape still emits `rowan-close` via the inner dialog. Parent-driven `open` still does not emit confirm/cancel/close.
- **Test:** Open confirm; inner close is hidden, overlay is `alertdialog`, and Cancel is focused.

**Resolution (fixed).** Least-destructive action is first. The × is not a third dismiss path on confirm.

### F-52: Table-selection MutationObserver runs on every virtualized scroll

- **Severity:** Low
- **Area:** `src/lib/table-selection.js`
- **Contract:** Toolbar and bulk-actions-bar should track selection via `rowan-select`, not by watching the entire table shadow tree.
- **Evidence:** `observeTableSelection` attaches a `MutationObserver` to the table’s entire `shadowRoot` (`childList` + `subtree`) in addition to `rowan-select` (`table-selection.js:60`). A virtualized table mutates that tree on every scroll. Separately, `observeTableAvailability` observes `document.documentElement` with `subtree: true` until a matching `id` appears.
- **Impact:** Scroll of a large table is on the observer hot path. A missing `for-table` target observes the whole document until disconnect.
- **Fix:** Drop the shadow-tree MutationObserver. Listen to `rowan-select` and wrap the table `selected` setter so parent-driven assignment still notifies without a DOM event. `selectAll` / `clearSelection` go through that setter. Availability still watches the document until the `for-table` id appears, then disconnects.
- **Test:** Shadow `tbody` mutations do not notify. `selected = [...]` and `rowan-select` do. Toolbar still syncs parent-driven selection and `clearSelection`.

**Resolution (fixed).** Virtualized scroll no longer sits on the selection observer. Parent-driven `selected` still updates toolbar/bulk bar without emitting `rowan-select`.

### F-53: MapLibre model types are not exported; tests never load maplibre-gl

- **Severity:** Low
- **Area:** `packages/maplibre/src/index.d.ts`, `packages/maplibre/src/map/map.js`, `packages/maplibre/src/map/map.test.js`
- **Contract:** Public types used in the README (`RowanMapLocation`, layers, attribution) are importable from the package entry. CI exercises the production provider path at least once.
- **Evidence:** Public exports are only `"."` and `"./map"`. Model types live in `types/map/model.d.ts` but are not re-exported. Unit tests inject `FakeMap` and never execute `import("maplibre-gl")`, including error-during-load fallback (`map.js:542`).
- **Impact:** `import type { RowanMapLocation } from "@rowan-ui/maplibre"` does not work. A noisy provider during first load can take down the canvas in production while tests stay green.
- **Fix:** Re-export `RowanMapLocation`, `RowanMapLayer`, and attribution types from `src/index.d.ts` and `src/map/map.d.ts`. `#resolveProvider` accepts ESM named exports, `default.Map`, or the UMD `globalThis.maplibregl`. A browser test loads the real `maplibre-gl` dist, injects it, and uses a local background style.
- **Test:** `type-tests/maplibre-exports.ts` imports `RowanMapLocation` from the package entry. `map.provider.test.js` constructs the map with the real module.

**Resolution (fixed).** `import type { RowanMapLocation } from "@rowan-ui/maplibre"` typechecks. The adapter no longer assumes `module.default.Map` is the only browser shape.

### F-54: `#didFirstRender` is written and never read

- **Severity:** Low
- **Area:** `src/lib/base-element.js`
- **Contract:** Dead fields should not remain after the render rewrite.
- **Evidence:** `#didFirstRender` is set after every successful render (`base-element.js:87`) and never read.
- **Impact:** Noise only; no user-visible failure.
- **Fix:** Remove the field and the assignment in `requestRender`.
- **Test:** Grep shows no remaining references in `src/`.

**Resolution (fixed).** Dead field removed. CEM regenerated.

### F-55: `isTopmostOverlay` is unused after the native-dialog migration

- **Severity:** Low
- **Area:** `src/lib/overlay-stack.js`
- **Contract:** The stack either owns topmost focus (F-13) or only reference-counts scroll lock. Comments and exports should match.
- **Evidence:** `isTopmostOverlay` is exported and typed (`overlay-stack.js:24`) but unused after `showModal()`. The comment on line 23 (“Only the topmost overlay may contain focus…”) is stale. Lightweight overlays never call `pushOverlay`.
- **Impact:** Dead API. If something started using it for nested Escape (F-34), it would ignore popover/dropdown/context-menu.
- **Fix:** Keep the export. F-34 registered popover/dropdown as dismissible layers. Context-menu now `pushDismissible`s too and gates Escape/outside-click on `isTopmostOverlay`, with `noteDismissibleClose` so a parent dialog does not consume the same gesture. Comments describe modal vs dismissible layers.
- **Test:** Grep shows dialog, popover, dropdown, and context-menu callers. Context-menu Escape inside a dialog closes only the menu.

**Resolution (fixed).** One stack: modals lock scroll, dismissibles do not, `isTopmostOverlay` is the nested-dismiss source of truth.

### F-56: Hand-written `base-element.d.ts` omits FACE members

- **Severity:** Low
- **Area:** `src/lib/base-element.d.ts`, `src/react/index.d.ts`
- **Contract:** The source declaration next to `base-element.js` matches the generated `types/lib/base-element.d.ts` and the runtime class.
- **Evidence:** The hand-written file omits `form`, `labels`, `validity`, `validationMessage`, `willValidate`, `setCustomValidity`, `applyValidity`, `formDisabledCallback`, `externalLabelText`, and `componentTokenPrefixes`. Generated types have them. `src/react/index.d.ts` imports this hand-written type to exclude `keyof BaseElement` from React property maps.
- **Impact:** FACE getters can leak into `RowanElementProperties` as writable fields. Editors that resolve the source `.d.ts` show an incomplete class.
- **Fix:** Add the missing FACE members to the colocated `.d.ts` with DOM types (`ValidityState`, `ValidityStateFlags`, `NodeListOf<HTMLLabelElement>`). `useRowanElement` still excludes `keyof BaseElement` from writable properties.
- **Test:** `type-tests/base-element-react.ts` asserts `validity` and `setCustomValidity` exist on `BaseElement` and are omitted from `RowanElementProperties<RowanTextField>`.

**Resolution (fixed).** Editors that resolve `src/lib/base-element.js` see the FACE surface. React property maps no longer treat validity APIs as writable element props.
