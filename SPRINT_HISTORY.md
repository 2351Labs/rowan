# Rowan Sprint History

Last updated: 2026-09-10

## Current Product Snapshot

- Package: `@rowan-ui/core`
- Architecture: vanilla Web Components (Custom Elements, Shadow DOM, slots, ElementInternals)
- Current implemented catalog includes 47 components

## Completed Sprints

### Sprint 1: Feedback Workflows

Status: Completed

Delivered:

- `rowan-toast`
- `rowan-toaster`
- Queueing and auto-dismiss behavior
- User-driven dismiss and show event contracts
- Storybook stories, docs routes, CEM coverage, and contract tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 2: Date/Time Foundation

Status: Completed

Delivered:

- `rowan-date-picker`
- `rowan-time-picker`
- `rowan-calendar`
- FACE behavior for form value and validity
- Date/time range validation and keyboard interaction coverage
- Storybook stories, docs routes, exports, typings, tokens, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 3: Reporting Filters and Numeric Entry

Status: Completed

Delivered:

- `rowan-number-field`
- `rowan-date-range-picker`
- Min/max/step and ordered-range validation behavior
- User-only change event semantics
- Storybook report-filter usage scenarios
- Exports, typings, docs routing, README catalog updates, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 4: Document and Attachment Workflows

Status: Completed

Delivered:

- `rowan-file-upload`
- `rowan-dropzone`
- `rowan-file-item`
- Drag-and-drop plus click-to-picker file intake
- Upload queue states: queued, uploading, success, failed
- Event contracts for file add/remove/retry/cancel flows
- Storybook stories, docs routes, exports, typings, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

### Sprint 5: Guided Process Primitives

Status: Completed

Delivered:

- `rowan-stepper`
- `rowan-validation-summary`
- Step progression methods (`next`, `previous`, `goTo`) and `current-step` reflection contract
- Step activation event contract: `rowan-step-change` (user-triggered only)
- Form error aggregation support via `collectFromForm()` and jump event contract (`rowan-jump`)
- Storybook stories, docs routes, exports, typings, and tests

Verification completed at sprint close:

- `npm run lint`
- `npm test`
- `npm run analyze`
- `npm run build-storybook`

## Active Sprint

### Sprint 6: High-Level Workflow Component

Status: Next up

Planned sprint scope:

- `rowan-form-wizard`

## Remaining Roadmap (Sprint 7 onward)

### Sprint 7: Table Operations Layer (Part 1)

- `rowan-table-toolbar`
- `rowan-bulk-actions-bar`

### Sprint 8: Table Operations Layer (Part 2)

- `rowan-filter-builder`
- `rowan-row-details-panel`

### Sprint 9: Hierarchical Navigation

- `rowan-tree`
- `rowan-tree-item`

### Sprint 10: Power-User UX

- `rowan-command-palette`
- `rowan-command-item`

## Notes

- This workspace copy currently has no `.git` metadata, so sprint history is being tracked in-repo via this markdown file.
- `custom-elements.json` remains the API documentation source of truth and should be regenerated after each sprint increment.
