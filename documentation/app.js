import "../src/tokens/tokens.css";
import "../src/tokens/themes/light.css";
import "../src/tokens/themes/dark.css";

import "../src/index.js";
import customElementsManifest from "../custom-elements.json";
import {
  componentTokens,
  primitiveColorTokens,
  primitiveRadiusTokens,
  primitiveSpaceTokens,
  primitiveStructuralTokens,
  primitiveTypographyTokens,
  semanticTokens,
  themeComparisonTokens,
  tokenSourcePaths,
} from "../src/tokens/token-data.js";

const DEFAULT_PAGE_ID = "getting-started";
const THEME_STORAGE_KEY = "rowan-docs-theme";

const QUICKSTART_SNIPPET = `npm install @rowan-ui/core

import "@rowan-ui/core";
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";`;

const TABLE_SNIPPET = `const table = document.querySelector("rowan-table");

table.config = {
  selectable: "multiple",
  stickyHeader: true,
  rowId: "id",
  columns: [
    {
      id: "name",
      header: "Name",
      type: "link",
      sortable: true,
      cell: { href: (_value, row) => \`/users/\${row.id}\` },
    },
    { id: "role", header: "Role", type: "badge" },
    { id: "active", header: "Active", type: "switch", align: "center" },
    { id: "quota", header: "Quota", type: "progress" },
  ],
  rows: [
    { id: "1", name: "Ada", role: "Admin", active: true, quota: 72 },
    { id: "2", name: "Alan", role: "Editor", active: false, quota: 18 },
  ],
};`;

const TABLE_UPDATE_SNIPPET = `// Replace the entire model. Omitted values reset to defaults.
table.config = {
  rowId: "id",
  columns: nextColumns,
  rows: nextRows,
};

// Update one part of the existing model.
table.rows = nextRows;
table.selected = selectedIds;
table.sort = { id: "name", dir: "asc" };`;

const TABLE_TOOLBAR_SNIPPET = `<rowan-table id="members-table">
  <rowan-table-toolbar slot="toolbar" label="Member table controls">
    <span slot="start">Active members</span>
  </rowan-table-toolbar>
</rowan-table>

<script type="module">
  const table = document.querySelector("#members-table");
  table.config = {
    selectable: "multiple",
    rowId: "id",
    columns: [{ id: "name", header: "Name" }],
    rows: [{ id: "1", name: "Ada" }],
  };
</script>`;

const BULK_ACTIONS_BAR_SNIPPET = `<rowan-table id="members-table">
  <rowan-bulk-actions-bar id="member-actions" slot="toolbar"></rowan-bulk-actions-bar>
</rowan-table>

<script type="module">
  const actions = document.querySelector("#member-actions");
  actions.actions = [
    { id: "archive", label: "Archive", variant: "secondary" },
    { id: "remove", label: "Remove", variant: "danger" },
  ];

  actions.addEventListener("rowan-bulk-action", (event) => {
    console.log(event.detail.action, event.detail.selectedRows);
  });
</script>`;

const FILTER_BUILDER_SNIPPET = `<rowan-table id="members-table">
  <rowan-filter-builder id="member-filters" slot="toolbar"></rowan-filter-builder>
</rowan-table>

<script type="module">
  const rows = [
    { id: "1", name: "Ada", role: "Admin" },
    { id: "2", name: "Alan", role: "Editor" },
  ];
  const table = document.querySelector("#members-table");
  const filters = document.querySelector("#member-filters");

  table.config = {
    rowId: "id",
    columns: [
      { id: "name", header: "Name" },
      { id: "role", header: "Role" },
    ],
    rows,
  };

  filters.fields = [
    { id: "name", label: "Name", operators: ["contains"] },
    { id: "role", label: "Role", options: ["Admin", "Editor"], operators: ["equals"] },
  ];

  filters.addEventListener("rowan-filter-change", (event) => {
    table.rows = rows.filter((row) =>
      event.detail.filters.every((filter) => {
        const value = String(row[filter.field] ?? "").toLowerCase();
        const expected = filter.value.toLowerCase();
        return filter.operator === "equals" ? value === expected : value.includes(expected);
      }),
    );
  });
</script>`;

const ROW_DETAILS_PANEL_SNIPPET = `<rowan-table id="members-table"></rowan-table>
<rowan-row-details-panel for-table="members-table"></rowan-row-details-panel>

<script type="module">
  const table = document.querySelector("#members-table");

  table.config = {
    rowId: "id",
    columns: [
      { id: "name", header: "Name" },
      { id: "role", header: "Role" },
    ],
    rows: [{ id: "1", name: "Ada", role: "Admin" }],
  };

  // Double-click a row or press Enter on its focused row.
</script>`;

const ALERT_SNIPPET = `<rowan-alert tone="info">Heads up: deployment starts at 4pm.</rowan-alert>
<rowan-alert tone="success">Your profile was saved.</rowan-alert>
<rowan-alert tone="warning">Review required fields before continuing.</rowan-alert>
<rowan-alert tone="danger" dismissible>Connection lost. Retry?</rowan-alert>`;

const BUTTON_SNIPPET = `<rowan-button>Primary action</rowan-button>
<rowan-button variant="secondary">Secondary action</rowan-button>
<rowan-button variant="ghost" size="sm">Quiet action</rowan-button>
<rowan-button><span slot="prefix" aria-hidden="true">+</span>Create project</rowan-button>
<rowan-button loading>Saving</rowan-button>`;

const BUTTON_TOKENS_SNIPPET = `:root {
  --rowan-button-bg: #1d432f;
  --rowan-button-border-width: 1px;
  --rowan-button-hover-bg: #153224;
  --rowan-button-active-bg: #10261c;
  --rowan-button-radius: 0.5rem;
}`;

const DIALOG_SNIPPET = `<rowan-button id="open-dialog">Open dialog</rowan-button>
<rowan-dialog id="confirm-dialog">
  <h2 slot="title">Delete workspace?</h2>
  <p>This action cannot be undone.</p>
  <div slot="actions">
    <rowan-button variant="secondary">Cancel</rowan-button>
    <rowan-button variant="danger">Delete</rowan-button>
  </div>
</rowan-dialog>`;

const DATE_PICKER_SNIPPET = `<rowan-date-picker
  name="startDate"
  label="Start date"
  value="2026-09-15"
  min="2026-09-10"
  max="2026-09-20"
></rowan-date-picker>`;

const TIME_PICKER_SNIPPET = `<rowan-time-picker
  name="startTime"
  label="Start time"
  value="09:30"
  min="08:00"
  max="18:00"
  step="900"
></rowan-time-picker>`;

const DATE_RANGE_PICKER_SNIPPET = `<rowan-date-range-picker
  name="reportDate"
  label="Report range"
  start="2026-09-10"
  end="2026-09-20"
  min="2026-09-01"
  max="2026-09-30"
></rowan-date-range-picker>`;

const DROPZONE_SNIPPET = `<rowan-dropzone
  label="Drop files to upload"
  description="or click to browse from your device"
  accept=".csv,.xlsx,.pdf"
  multiple
></rowan-dropzone>`;

const FILE_ITEM_SNIPPET = `<rowan-file-item
  file-id="invoice-q3"
  filename="invoice-q3.csv"
  filesize="183200"
  status="uploading"
  progress="62"
></rowan-file-item>`;

const FILE_UPLOAD_SNIPPET = `<rowan-file-upload
  label="Upload attachments"
  accept=".csv,.xlsx,.pdf"
  multiple
  max-files="5"
></rowan-file-upload>`;

const STEPPER_SNIPPET = `<rowan-stepper
  current-step="2"
  steps="Draft,Review,Publish,Complete"
></rowan-stepper>`;

const TREE_SNIPPET = `<rowan-tree id="docs-tree" label="Documentation">
  <rowan-tree-item value="guides" expanded>
    Guides
    <rowan-tree-item slot="children" value="getting-started">
      Getting started
    </rowan-tree-item>
  </rowan-tree-item>
  <rowan-tree-item value="reference">Reference</rowan-tree-item>
</rowan-tree>

<script type="module">
  import "@rowan-ui/core/tree";

  const tree = document.querySelector("#docs-tree");
  tree.selected = ["getting-started"];

  tree.addEventListener("rowan-change", (event) => {
    console.log(event.detail.selected);
  });
</script>`;

const COMMAND_PALETTE_SNIPPET = `<rowan-button id="open-commands">Open commands</rowan-button>

<rowan-command-palette
  id="workspace-commands"
  label="Workspace commands"
  hotkey="mod+k"
>
  <rowan-command-item
    value="open-settings"
    label="Open settings"
    description="Update workspace preferences"
    keywords="workspace preferences account"
    shortcut="G S"
  ></rowan-command-item>
  <rowan-command-item
    value="invite-member"
    label="Invite member"
    keywords="team people invite"
    shortcut="I"
  ></rowan-command-item>
</rowan-command-palette>

<script type="module">
  import "@rowan-ui/core/button";
  import "@rowan-ui/core/command-palette";

  const trigger = document.querySelector("#open-commands");
  const palette = document.querySelector("#workspace-commands");

  trigger.addEventListener("rowan-click", () => palette.show());
  palette.addEventListener("rowan-command", (event) => {
    console.log(event.detail.value, event.detail.item);
  });
</script>`;

const VALIDATION_SUMMARY_SNIPPET = `<form id="profile-form">
  <label for="profile-name">Name</label>
  <input id="profile-name" name="name" required />

  <label for="profile-email">Email</label>
  <input id="profile-email" name="email" type="email" required />
</form>

<rowan-validation-summary
  for-form="profile-form"
  heading="Please fix these fields"
></rowan-validation-summary>`;

const FORM_WIZARD_SNIPPET = `<rowan-form-wizard id="onboarding-wizard">
  <section slot="step-account" data-step-label="Account">
    <rowan-text-field name="organization" label="Organization" required></rowan-text-field>
  </section>
  <section slot="step-review" data-step-label="Review">
    Confirm the account details before completing setup.
  </section>
</rowan-form-wizard>

<script type="module">
  const wizard = document.querySelector("#onboarding-wizard");
  wizard.steps = [
    { id: "account", label: "Account" },
    { id: "review", label: "Review" },
  ];

  wizard.addEventListener("rowan-invalid", (event) => {
    console.log(event.detail.errors);
  });
</script>`;

const NUMBER_FIELD_SNIPPET = `<rowan-number-field
  name="minimumUnits"
  label="Minimum units"
  value="25"
  min="0"
  max="500"
  step="5"
></rowan-number-field>`;

const CALENDAR_SNIPPET = `<rowan-calendar
  name="serviceDate"
  selection-mode="range"
  label="Service window"
  month="2026-10"
  start="2026-10-12"
  end="2026-10-18"
  min="2026-10-10"
  max="2026-10-20"
  required
></rowan-calendar>`;

const TOAST_SNIPPET = `<rowan-toast tone="success" dismissible>
  <span slot="title">Profile updated</span>
  Team member preferences were saved.
  <rowan-button slot="actions" size="sm" variant="secondary">View changes</rowan-button>
</rowan-toast>`;

const TOASTER_SNIPPET = `const toaster = document.querySelector("rowan-toaster");

toaster.show({
  tone: "success",
  title: "Sync complete",
  message: "42 records were processed.",
});

toaster.addEventListener("rowan-toast-show", (event) => {
  console.log(event.detail.id);
});

toaster.addEventListener("rowan-toast-dismiss", (event) => {
  console.log(event.detail.reason);
});`;

const PRIMITIVE_TOKEN_TOTAL =
  primitiveColorTokens.length +
  primitiveSpaceTokens.length +
  primitiveRadiusTokens.length +
  primitiveTypographyTokens.length +
  primitiveStructuralTokens.length;

const COMPONENT_CATEGORY_SETS = {
  Primitives: new Set([
    "alert",
    "avatar",
    "badge",
    "button",
    "card",
    "chip",
    "divider",
    "empty-state",
    "file-item",
    "icon-button",
    "link",
    "progress",
    "skeleton",
    "spinner",
    "toast",
    "toaster",
  ]),
  Forms: new Set([
    "calendar",
    "checkbox",
    "combobox",
    "date-picker",
    "date-range-picker",
    "dropzone",
    "file-upload",
    "form-wizard",
    "number-field",
    "radio",
    "radio-group",
    "select",
    "switch",
    "text-field",
    "textarea",
    "time-picker",
    "validation-summary",
  ]),
  Overlays: new Set([
    "command-item",
    "command-palette",
    "dialog",
    "drawer",
    "dropdown",
    "menu",
    "menu-item",
    "popover",
    "tooltip",
  ]),
  Navigation: new Set([
    "accordion",
    "breadcrumb",
    "pagination",
    "stepper",
    "tab",
    "tab-panel",
    "tabs",
    "tree",
    "tree-item",
  ]),
  "Data Display": new Set([
    "bulk-actions-bar",
    "filter-builder",
    "row-details-panel",
    "table",
    "table-toolbar",
  ]),
};

const COMPONENT_CATEGORY_ORDER = [
  "Primitives",
  "Forms",
  "Overlays",
  "Navigation",
  "Data Display",
  "Other",
];

function titleFromTagName(tagName) {
  return tagName
    .replace(/^rowan-/, "")
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function inferComponentCategory(tagName) {
  const key = tagName.replace(/^rowan-/, "");

  for (const [category, values] of Object.entries(COMPONENT_CATEGORY_SETS)) {
    if (values.has(key)) {
      return category;
    }
  }

  return "Other";
}

function normalizeComponentDescription(description, tagName) {
  if (typeof description === "string" && description.trim().length > 0) {
    return description.trim();
  }

  return `${titleFromTagName(tagName)} component.`;
}

function normalizeManifestTypeText(typeText) {
  if (typeof typeText !== "string") return "";
  return typeText.replace(/\s+/g, " ").trim();
}

function collectManifestAttributes(attributes) {
  if (!Array.isArray(attributes)) return [];

  return attributes
    .map((attribute) => {
      const name = typeof attribute?.name === "string" ? attribute.name.trim() : "";
      if (!name) return "";

      const typeText = normalizeManifestTypeText(attribute?.type?.text);
      return typeText ? `${name}: ${typeText}` : name;
    })
    .filter(Boolean);
}

function collectManifestEvents(events) {
  if (!Array.isArray(events)) return [];

  return events
    .map((event) => (typeof event?.name === "string" ? event.name.trim() : ""))
    .filter(Boolean);
}

function collectManifestSlots(slots) {
  if (!Array.isArray(slots)) return [];

  return slots
    .map((slot) => {
      const slotName = typeof slot?.name === "string" ? slot.name.trim() : "";
      return slotName || "default";
    })
    .filter(Boolean);
}

function collectSupportedComponents() {
  const modules = Array.isArray(customElementsManifest.modules)
    ? customElementsManifest.modules
    : [];
  const byTagName = new Map();

  for (const moduleEntry of modules) {
    const declarations = Array.isArray(moduleEntry.declarations) ? moduleEntry.declarations : [];

    for (const declaration of declarations) {
      const tagName = declaration?.tagName;
      if (declaration?.customElement !== true) continue;
      if (typeof tagName !== "string" || !tagName.startsWith("rowan-")) continue;
      if (byTagName.has(tagName)) continue;

      byTagName.set(tagName, {
        tagName,
        className: declaration.name || `Rowan${titleFromTagName(tagName).replace(/\s+/g, "")}`,
        description: normalizeComponentDescription(declaration.description, tagName),
        modulePath: moduleEntry.path || "",
        category: inferComponentCategory(tagName),
        attributes: collectManifestAttributes(declaration.attributes),
        events: collectManifestEvents(declaration.events),
        slots: collectManifestSlots(declaration.slots),
      });
    }
  }

  return [...byTagName.values()].sort((left, right) => left.tagName.localeCompare(right.tagName));
}

const SUPPORTED_COMPONENTS = collectSupportedComponents();
const COMPONENTS_BY_CATEGORY = SUPPORTED_COMPONENTS.reduce((groups, component) => {
  if (!groups[component.category]) {
    groups[component.category] = [];
  }

  groups[component.category].push(component);
  return groups;
}, {});

const DOC_PAGES = [
  {
    id: "getting-started",
    group: "Overview",
    title: "Getting Started",
    summary:
      "Rowan ships unbundled ESM components with token-based theming, open shadow roots, and composable APIs.",
    tags: ["esm", "web-components", "shadow-dom"],
    keywords: ["install", "import", "quick start", "setup"],
    content: () => `
      <section class="doc-section" data-doc-section id="start-install">
        <h2>Install and register</h2>
        <p>Import the full catalog for app-level installs or cherry-pick specific components for focused bundles.</p>
        ${codeBlock(QUICKSTART_SNIPPET)}
        <rowan-alert tone="info">
          Rowan component modules are unbundled. Your app build pipeline handles optimization.
        </rowan-alert>
      </section>

      <section class="doc-section" data-doc-section id="start-structure">
        <h2>Project structure expectation</h2>
        <p>Each component lives in its own folder with JavaScript, CSS, stories, tests, and an index entry file.</p>
        <div class="info-grid">
          <rowan-card>
            <p slot="title"><strong>Public API</strong></p>
            <p>Attributes, properties, slots, events, CSS custom properties, and documented parts.</p>
          </rowan-card>
          <rowan-card>
            <p slot="title"><strong>Events</strong></p>
            <p>Custom events follow rowan-verb naming and emit with bubbles and composed enabled.</p>
          </rowan-card>
        </div>
      </section>
    `,
  },
  {
    id: "theming",
    group: "Foundations",
    title: "Theming",
    summary:
      "Theme Rowan through semantic tokens while preserving stable component APIs. This docs site uses the same model.",
    tags: ["tokens", "light-dark", "css"],
    keywords: ["theme", "tokens", "dark", "light", "css variables"],
    content: () => `
      <section class="doc-section" data-doc-section id="theme-layers">
        <h2>Token layers</h2>
        <p>Rowan separates primitives, semantic tokens, and component-level hooks to keep theming predictable.</p>
        <div class="info-grid">
          <rowan-card>
            <p slot="title"><strong>Primitives</strong></p>
            <p>Color ramps, space scales, radii, and typography primitives.</p>
            <rowan-badge tone="success">Stable</rowan-badge>
          </rowan-card>
          <rowan-card>
            <p slot="title"><strong>Semantic</strong></p>
            <p>App-level meaning: background, foreground, accent, border, and danger.</p>
            <rowan-badge>App surface</rowan-badge>
          </rowan-card>
          <rowan-card>
            <p slot="title"><strong>Component hooks</strong></p>
            <p>Per-control defaults like rowan-button-bg and rowan-field-border.</p>
            <rowan-badge tone="warning">Override carefully</rowan-badge>
          </rowan-card>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="theme-overrides">
        <h2>Theme override example</h2>
        <p>Set semantic tokens at the document root. Component tokens can still point back to semantic values.</p>
        ${codeBlock(`:root {
  --rowan-color-bg: #f7f6ef;
  --rowan-color-fg: #1c2320;
  --rowan-color-accent: #214d36;
}

[data-theme="dark"] {
  --rowan-color-bg: #0f1612;
  --rowan-color-fg: #ebf0ea;
  --rowan-color-accent: #7ec197;
}`)}
      </section>
    `,
  },
  {
    id: "tokens",
    group: "Foundations",
    title: "Tokens",
    summary:
      "Reference tables for primitive, semantic, and component tokens generated directly from Rowan token source files.",
    tags: ["tokens", "css-variables", "theming"],
    keywords: ["tokens", "variables", "theme", "rowan-color", "rowan-space", "rowan-radius"],
    content: () => `
      <section class="doc-section" data-doc-section id="tokens-overview">
        <h2>Token model</h2>
        <p>Rowan token documentation on this page is generated from the same source files used by Storybook to keep both surfaces in sync.</p>
        <div class="docs-token-layer-grid">
          <article class="docs-token-layer-card">
            <h3>Primitive layer</h3>
            <p>Raw design scales for color, spacing, radius, typography, and structural constants.</p>
            <p class="docs-token-layer-count">${PRIMITIVE_TOKEN_TOTAL} tokens</p>
          </article>
          <article class="docs-token-layer-card">
            <h3>Semantic layer</h3>
            <p>Theme-level intent values consumed by components.</p>
            <p class="docs-token-layer-count">${semanticTokens.length} tokens</p>
          </article>
          <article class="docs-token-layer-card">
            <h3>Component layer</h3>
            <p>Component hooks with defaults mapped to semantic tokens.</p>
            <p class="docs-token-layer-count">${componentTokens.length} tokens</p>
          </article>
        </div>
        <p class="docs-token-hint">Source of truth files:</p>
        <ul class="docs-token-source-list">
          ${tokenSourcePaths
            .map(
              (sourcePath) =>
                `<li><span class="docs-token-name">${escapeHtml(sourcePath)}</span></li>`,
            )
            .join("")}
        </ul>
      </section>

      <section class="doc-section" data-doc-section id="tokens-primitives-color">
        <h2>Primitive color tokens</h2>
        <p>Color primitives define Rowan ramps and semantic foundations.</p>
        ${renderTokenTable(primitiveColorTokens, "color")}
      </section>

      <section class="doc-section" data-doc-section id="tokens-primitives-space">
        <h2>Primitive space tokens</h2>
        <p>Spacing primitives provide consistent rhythm for layout and component internals.</p>
        ${renderTokenTable(primitiveSpaceTokens, "space")}
      </section>

      <section class="doc-section" data-doc-section id="tokens-primitives-radius">
        <h2>Primitive radius tokens</h2>
        <p>Radius primitives keep component corners visually coherent across the system.</p>
        ${renderTokenTable(primitiveRadiusTokens, "radius")}
      </section>

      <section class="doc-section" data-doc-section id="tokens-primitives-typography">
        <h2>Primitive typography and structural tokens</h2>
        <p>Typography scale and border-width primitives support readable type rhythm and consistent edge treatment.</p>
        ${renderTokenTable([...primitiveTypographyTokens, ...primitiveStructuralTokens], "text")}
      </section>

      <section class="doc-section" data-doc-section id="tokens-semantic">
        <h2>Semantic tokens</h2>
        <p>Semantic tokens are the preferred theme override layer for product teams.</p>
        ${renderTokenTable(semanticTokens, "auto")}
      </section>

      <section class="doc-section" data-doc-section id="tokens-component">
        <h2>Component tokens</h2>
        <p>Component-level hooks expose focused styling controls while preserving public APIs.</p>
        ${renderTokenTable(componentTokens, "auto")}
      </section>

      <section class="doc-section" data-doc-section id="tokens-theme-compare">
        <h2>Theme comparison</h2>
        <p>Light and dark mappings for every token present in theme files.</p>
        ${renderThemeComparisonTable()}
      </section>
    `,
  },
  {
    id: "all-components",
    group: "Components",
    title: "All Components",
    summary:
      "Generated inventory of every supported Rowan custom element from the custom elements manifest.",
    tags: ["components", "inventory", "manifest"],
    keywords: ["all components", "supported", "catalog", "rowan-button", "rowan-table"],
    content: () => `
      <section class="doc-section" data-doc-section id="components-inventory-overview">
        <h2>Supported component inventory</h2>
        <p>Rowan currently ships ${SUPPORTED_COMPONENTS.length} custom elements. This list is generated from custom-elements.json to stay aligned with the shipped API surface.</p>
        <div class="docs-component-chip-row">
          ${renderComponentCategoryChips()}
        </div>
      </section>

      <section class="doc-section" data-doc-section id="components-inventory-list">
        <h2>Component catalog</h2>
        <p>Each entry includes the tag name, class export, source module path, and summary from component JSDoc.</p>
        <div class="docs-component-groups">
          ${renderComponentGroups()}
        </div>
      </section>
    `,
  },
  {
    id: "components",
    group: "Components",
    title: "Component Gallery",
    summary: "Compose actions, feedback, and layout primitives without framework wrappers.",
    tags: ["composition", "primitives", "a11y"],
    keywords: ["button", "card", "alert", "accordion", "gallery"],
    content: () => `
      <section class="doc-section" data-doc-section id="gallery-primitives">
        <h2>Primitive composition</h2>
        <div class="info-grid">
          <rowan-card>
            <p slot="title"><strong>Actions</strong></p>
            <div class="demo-row">
              <rowan-button size="sm">Save</rowan-button>
              <rowan-button size="sm" variant="secondary">Cancel</rowan-button>
              <rowan-icon-button label="Settings" variant="ghost">⚙</rowan-icon-button>
            </div>
          </rowan-card>
          <rowan-card>
            <p slot="title"><strong>Status</strong></p>
            <div class="demo-row">
              <rowan-badge tone="success">Healthy</rowan-badge>
              <rowan-chip tone="warning">Review</rowan-chip>
              <rowan-chip tone="info">Preview</rowan-chip>
            </div>
          </rowan-card>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="gallery-disclosure">
        <h2>Progressive disclosure</h2>
        <p>Use Rowan disclosure and dialog patterns when information should appear on-demand.</p>
        <rowan-accordion summary="When should I use rowan-dialog?">
          Use rowan-dialog for blocking confirmation flows, focused editing, and task completion sequences.
        </rowan-accordion>
      </section>
    `,
  },
  {
    id: "alert",
    group: "Components",
    title: "Rowan Alert",
    summary:
      "Status messaging surface with semantic tones and optional dismissal for actionable notices.",
    tags: ["feedback", "status", "tone"],
    keywords: ["alert", "tone", "dismissible", "status"],
    content: () => `
      <section class="doc-section" data-doc-section id="alert-variants">
        <h2>Alert tones</h2>
        <p>Use tone to map urgency and intent without custom classes.</p>
        <div class="docs-alert-showcase">
          <rowan-alert tone="info">Informational notices for context and guidance.</rowan-alert>
          <rowan-alert tone="success">Success messages after completed actions.</rowan-alert>
          <rowan-alert tone="warning">Warnings for recoverable validation or policy issues.</rowan-alert>
          <rowan-alert tone="danger" dismissible>Critical alerts that may need immediate action.</rowan-alert>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="alert-snippet">
        <h2>Usage snippet</h2>
        ${codeBlock(ALERT_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "button",
    group: "Components",
    title: "Rowan Button",
    summary:
      "Primary action control with variant, size, loading, and disabled states for consistent call-to-action hierarchy.",
    tags: ["actions", "cta", "state"],
    keywords: ["button", "variant", "size", "loading", "disabled"],
    content: () => `
      <section class="doc-section" data-doc-section id="button-variants">
        <h2>Variants and size</h2>
        <p>Use variants for hierarchy and sizes for context density while keeping behavior consistent.</p>
        <div class="demo-row">
          <rowan-button>Primary</rowan-button>
          <rowan-button variant="secondary">Secondary</rowan-button>
          <rowan-button variant="ghost">Ghost</rowan-button>
          <rowan-button variant="danger">Danger</rowan-button>
        </div>
        <div class="demo-row">
          <rowan-button size="sm">Small</rowan-button>
          <rowan-button size="md">Medium</rowan-button>
          <rowan-button size="lg">Large</rowan-button>
        </div>
        <div class="demo-row">
          <rowan-button><span slot="prefix" aria-hidden="true">+</span>Create project</rowan-button>
          <rowan-button variant="secondary">Continue<span slot="suffix" aria-hidden="true">&gt;</span></rowan-button>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="button-states">
        <h2>State examples</h2>
        <p>Hover, pressed, focus, disabled, and loading states use the same variant hierarchy in light and dark themes.</p>
        <div class="demo-row">
          <rowan-button loading>Saving</rowan-button>
          <rowan-button disabled>Disabled</rowan-button>
          <rowan-button variant="secondary" disabled>Disabled secondary</rowan-button>
        </div>
        ${codeBlock(BUTTON_SNIPPET, "html")}
      </section>

      <section class="doc-section" data-doc-section id="button-tokens">
        <h2>Visual tokens</h2>
        <p>Use the button token layer to tune visual hierarchy while preserving the component's state behavior.</p>
        ${codeBlock(BUTTON_TOKENS_SNIPPET, "css")}
      </section>
    `,
  },
  {
    id: "dialog",
    group: "Components",
    title: "Rowan Dialog",
    summary:
      "Modal surface for focused tasks with open-state control, keyboard escape handling, and focus return behavior.",
    tags: ["overlay", "focus", "modal"],
    keywords: ["dialog", "modal", "open", "focus trap", "escape"],
    content: () => `
      <section class="doc-section" data-doc-section id="dialog-behavior">
        <h2>Behavior contract</h2>
        <p>Rowan dialog supports keyboard dismissal with Escape, focus containment while open, and restoring focus to the trigger after close.</p>
        <rowan-alert tone="info">
          Pair rowan-dialog with task-specific actions and concise copy to keep modal flows predictable.
        </rowan-alert>
      </section>

      <section class="doc-section" data-doc-section id="dialog-snippet">
        <h2>Usage snippet</h2>
        ${codeBlock(DIALOG_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "date-picker",
    group: "Components",
    title: "Rowan Date Picker",
    summary:
      "Form-associated date control with min/max range support and rowan-change events on user commits.",
    tags: ["forms", "date", "validation"],
    keywords: ["date picker", "min", "max", "required", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="date-picker-range">
        <h2>Range and required validation</h2>
        <p>Use min and max to constrain dates and required for mandatory schedule fields in B2B workflows.</p>
        <div class="demo-row">
          <rowan-date-picker
            label="Cutoff date"
            value="2026-09-15"
            min="2026-09-10"
            max="2026-09-20"
          ></rowan-date-picker>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="date-picker-contract">
        <h2>Behavior contract</h2>
        <p>rowan-date-picker emits rowan-change only for user-committed changes and keeps value reflection synchronized with form submission.</p>
        ${codeBlock(DATE_PICKER_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "time-picker",
    group: "Components",
    title: "Rowan Time Picker",
    summary:
      "Form-associated time control with min/max and step constraints for scheduling and operations workflows.",
    tags: ["forms", "time", "validation"],
    keywords: ["time picker", "step", "min", "max", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="time-picker-range">
        <h2>Range and step handling</h2>
        <p>Use step to constrain increments and min/max to enforce operating windows such as support or dispatch hours.</p>
        <div class="demo-row">
          <rowan-time-picker
            label="Dispatch window"
            value="09:30"
            min="08:00"
            max="18:00"
            step="900"
          ></rowan-time-picker>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="time-picker-contract">
        <h2>Behavior contract</h2>
        <p>rowan-time-picker emits rowan-change on user commit and does not emit that event when parent code assigns value directly.</p>
        ${codeBlock(TIME_PICKER_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "date-range-picker",
    group: "Components",
    title: "Rowan Date Range Picker",
    summary:
      "Form-associated date-range control with start/end values, ordered range validation, and clear action support.",
    tags: ["forms", "date", "range", "validation"],
    keywords: ["date range", "start", "end", "min", "max", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="date-range-picker-range">
        <h2>Range validation and clear behavior</h2>
        <p>Use start and end values for reporting windows, approvals, and batch operations where range boundaries matter.</p>
        <div class="demo-row">
          <rowan-date-range-picker
            label="Submission window"
            start="2026-09-10"
            end="2026-09-20"
            min="2026-09-01"
            max="2026-09-30"
          ></rowan-date-range-picker>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="date-range-picker-contract">
        <h2>Behavior contract</h2>
        <p>rowan-date-range-picker emits rowan-change when users commit start or end dates and when they clear the current range.</p>
        ${codeBlock(DATE_RANGE_PICKER_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "calendar",
    group: "Components",
    title: "Rowan Calendar",
    summary:
      "Form-associated calendar grid with keyboard navigation, month controls, and two-click range selection.",
    tags: ["forms", "calendar", "validation"],
    keywords: ["calendar", "date grid", "date range", "keyboard", "min", "max", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="calendar-navigation">
        <h2>Keyboard and month navigation</h2>
        <p>Arrow keys move day focus, Enter selects a date, and range mode chooses a start followed by an end date.</p>
        <div class="demo-row">
          <rowan-calendar
            name="scheduleDate"
            selection-mode="range"
            label="Schedule window"
            month="2026-10"
            start="2026-10-12"
            end="2026-10-18"
            min="2026-10-10"
            max="2026-10-20"
          ></rowan-calendar>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="calendar-contract">
        <h2>Behavior contract</h2>
        <p>rowan-calendar emits rowan-change only for user selection actions. In range mode, start and end reflect the selected endpoints and submit as name-start and name-end.</p>
        ${codeBlock(CALENDAR_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "number-field",
    group: "Components",
    title: "Rowan Number Field",
    summary:
      "Form-associated numeric input with min/max/step validation and touch-friendly increment/decrement controls.",
    tags: ["forms", "numeric", "validation"],
    keywords: ["number field", "min", "max", "step", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="number-field-filter">
        <h2>Report criteria and thresholds</h2>
        <p>Use rowan-number-field for B2B filter criteria such as minimum quantity, budget limits, or approval thresholds.</p>
        <div class="demo-row">
          <rowan-number-field
            label="Minimum order quantity"
            value="25"
            min="0"
            max="500"
            step="5"
          ></rowan-number-field>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="number-field-contract">
        <h2>Behavior contract</h2>
        <p>rowan-number-field emits rowan-change on user commits and keeps form value + validity in sync via FACE APIs.</p>
        ${codeBlock(NUMBER_FIELD_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "dropzone",
    group: "Components",
    title: "Rowan Dropzone",
    summary: "Drag-and-drop file selection surface with keyboard activation and picker fallback.",
    tags: ["forms", "upload", "drag-drop"],
    keywords: ["dropzone", "files", "upload", "picker", "rowan-files-add"],
    content: () => `
      <section class="doc-section" data-doc-section id="dropzone-behavior">
        <h2>Drag-drop and picker fallback</h2>
        <p>rowan-dropzone supports both drag-and-drop and click-to-browse selection so upload flows work on desktop and touch-first mobile devices.</p>
        <div class="demo-row">
          <rowan-dropzone
            label="Drop monthly reports"
            description="or click to browse files"
            accept=".csv,.xlsx"
            multiple
          ></rowan-dropzone>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="dropzone-contract">
        <h2>Behavior contract</h2>
        <p>rowan-dropzone emits rowan-files-add with selected File objects and a source field indicating picker or drop.</p>
        ${codeBlock(DROPZONE_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "file-item",
    group: "Components",
    title: "Rowan File Item",
    summary:
      "Upload queue row showing file status, progress, and action hooks for retry, cancel, and remove.",
    tags: ["upload", "status", "actions"],
    keywords: ["file item", "retry", "remove", "cancel", "progress"],
    content: () => `
      <section class="doc-section" data-doc-section id="file-item-states">
        <h2>Status-driven actions</h2>
        <p>Use rowan-file-item to render upload rows and handle action events without mutating queue state implicitly.</p>
        <div class="demo-row" style="max-width: 40rem;">
          <rowan-file-item
            file-id="audit-q3"
            filename="audit-q3.csv"
            filesize="194560"
            status="failed"
          ></rowan-file-item>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="file-item-contract">
        <h2>Behavior contract</h2>
        <p>rowan-file-item emits rowan-retry, rowan-cancel, and rowan-remove for explicit queue orchestration in parent components.</p>
        ${codeBlock(FILE_ITEM_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "file-upload",
    group: "Components",
    title: "Rowan File Upload",
    summary: "Composed upload workflow component that combines dropzone input and queue rendering.",
    tags: ["forms", "upload", "composition"],
    keywords: ["file upload", "dropzone", "queue", "retry", "remove"],
    content: () => `
      <section class="doc-section" data-doc-section id="file-upload-workflow">
        <h2>Attachment workflow composition</h2>
        <p>rowan-file-upload combines rowan-dropzone and rowan-file-item, emits normalized queue events, and supports max-files limits.</p>
        <div class="demo-row" style="width: 100%; max-width: 42rem;">
          <rowan-file-upload
            label="Upload supporting documents"
            accept=".csv,.xlsx,.pdf"
            multiple
            max-files="5"
          ></rowan-file-upload>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="file-upload-contract">
        <h2>Behavior contract</h2>
        <p>rowan-file-upload emits rowan-files-add, rowan-file-remove, rowan-file-retry, and rowan-file-cancel with queue-aware detail payloads.</p>
        ${codeBlock(FILE_UPLOAD_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "stepper",
    group: "Components",
    title: "Rowan Stepper",
    summary:
      "Step progress indicator for guided workflows with keyboard navigation and explicit step-change events.",
    tags: ["navigation", "workflow", "events"],
    keywords: ["stepper", "wizard", "progress", "rowan-step-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="stepper-overview">
        <h2>Guided workflow progress</h2>
        <p>rowan-stepper shows where users are in a process and allows direct activation of a step when the flow permits it.</p>
        <div class="demo-row" style="width: 100%;">
          <rowan-stepper
            current-step="2"
            steps="Details,Review,Publish,Complete"
          ></rowan-stepper>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="stepper-contract">
        <h2>Behavior contract</h2>
        <p>rowan-stepper emits rowan-step-change when users activate a different step and does not emit that event for parent-driven property updates.</p>
        ${codeBlock(STEPPER_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "tree",
    group: "Components",
    title: "Rowan Tree",
    summary:
      "Hierarchical navigation composed from nested tree items with roving focus, disclosure, and controlled selection.",
    tags: ["navigation", "keyboard", "selection"],
    keywords: ["tree", "tree item", "hierarchy", "arrow keys", "rowan-change", "rowan-toggle"],
    content: () => `
      <section class="doc-section" data-doc-section id="tree-overview">
        <h2>Hierarchical navigation</h2>
        <p>Compose nested rowan-tree-item nodes through the children slot. The tree keeps one visible node in the tab order and supports standard tree navigation with Arrow, Home, and End keys.</p>
        <div class="demo-row" style="width: 100%; max-width: 28rem;">
          <rowan-tree id="docs-tree-demo" label="Documentation navigation">
            <rowan-tree-item value="guides" expanded>
              Guides
              <rowan-tree-item slot="children" value="getting-started">Getting started</rowan-tree-item>
              <rowan-tree-item slot="children" value="theming">Theming</rowan-tree-item>
            </rowan-tree-item>
            <rowan-tree-item value="components">Components</rowan-tree-item>
            <rowan-tree-item value="tokens">Tokens</rowan-tree-item>
          </rowan-tree>
        </div>
        <pre id="tree-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="tree-contract">
        <h2>Selection and disclosure</h2>
        <p>Set selection to none, single, or multiple. Assign selected values through the property; user selection emits rowan-change and user disclosure emits rowan-toggle.</p>
        ${codeBlock(TREE_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupTreeDemo,
  },
  {
    id: "command-palette",
    group: "Components",
    title: "Rowan Command Palette",
    summary:
      "Keyboard-first modal command surface with filtered slotted actions, focus containment, and explicit activation events.",
    tags: ["overlay", "keyboard", "commands"],
    keywords: ["command palette", "command item", "hotkey", "search", "rowan-command"],
    content: () => `
      <section class="doc-section" data-doc-section id="command-palette-overview">
        <h2>Keyboard-first commands</h2>
        <p>Compose rowan-command-item actions in the palette. Users can filter labels, descriptions, values, groups, and keywords; Arrow Up and Arrow Down move through enabled matches, and Enter activates the active command.</p>
        <div class="demo-row">
          <rowan-button id="docs-command-palette-trigger" size="sm">Open command palette</rowan-button>
        </div>
        <rowan-command-palette
          id="docs-command-palette"
          label="Workspace commands"
          placeholder="Search workspace commands"
          hotkey="mod+k"
        >
          <rowan-command-item
            value="open-settings"
            label="Open settings"
            description="Update workspace preferences"
            group="Workspace"
            shortcut="G S"
            keywords="workspace preferences account"
          ></rowan-command-item>
          <rowan-command-item
            value="invite-member"
            label="Invite member"
            description="Send a workspace invitation"
            group="Workspace"
            shortcut="I"
            keywords="team people invite"
          ></rowan-command-item>
          <rowan-command-item
            value="open-reports"
            label="Open reports"
            description="Review workspace activity"
            group="Navigation"
            shortcut="G R"
            keywords="analytics activity usage"
          ></rowan-command-item>
          <rowan-command-item
            value="delete-workspace"
            label="Delete workspace"
            description="Unavailable in this example"
            group="Workspace"
            keywords="remove"
            disabled
          ></rowan-command-item>
        </rowan-command-palette>
        <pre id="command-palette-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="command-palette-contract">
        <h2>Composition and events</h2>
        <p>The optional hotkey uses mod for Command on macOS and Control elsewhere. Programmatic open, hide, and query updates are silent; user activation emits rowan-command, while Escape, backdrop, and close-control dismissal emit rowan-close.</p>
        ${codeBlock(COMMAND_PALETTE_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupCommandPaletteDemo,
  },
  {
    id: "validation-summary",
    group: "Components",
    title: "Rowan Validation Summary",
    summary:
      "Form error summary that collects invalid fields and helps users jump directly to the control that needs attention.",
    tags: ["forms", "validation", "accessibility"],
    keywords: ["validation summary", "error list", "rowan-jump", "forms"],
    content: () => `
      <section class="doc-section" data-doc-section id="validation-summary-overview">
        <h2>Summarize form errors</h2>
        <p>Use rowan-validation-summary to present grouped errors and quickly return focus to invalid fields in longer forms.</p>
        <form id="docs-validation-form" class="demo-column" novalidate>
          <label for="docs-company-name">Company name</label>
          <input id="docs-company-name" name="companyName" required />

          <label for="docs-contact-email">Contact email</label>
          <input id="docs-contact-email" name="contactEmail" type="email" required />

          <rowan-button id="docs-validate-form" type="button" size="sm">Validate form</rowan-button>
        </form>
        <rowan-validation-summary
          id="docs-validation-summary"
          for-form="docs-validation-form"
          heading="Please fix these fields"
        ></rowan-validation-summary>
        <pre id="validation-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="validation-summary-contract">
        <h2>Behavior contract</h2>
        <p>rowan-validation-summary emits rowan-jump when users activate an error entry and keeps host accessibility defaults through ElementInternals.</p>
        ${codeBlock(VALIDATION_SUMMARY_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupValidationSummaryDemo,
  },
  {
    id: "form-wizard",
    group: "Components",
    title: "Rowan Form Wizard",
    summary:
      "Guided multi-step form workflow with slotted panels, scoped validation recovery, and explicit transition events.",
    tags: ["forms", "workflow", "validation"],
    keywords: ["form wizard", "steps", "validation", "rowan-invalid", "rowan-complete"],
    content: () => `
      <section class="doc-section" data-doc-section id="form-wizard-overview">
        <h2>Guarded form progression</h2>
        <p>rowan-form-wizard validates only the active panel before users move forward, then exposes invalid controls through a local summary.</p>
        <rowan-form-wizard id="docs-form-wizard">
          <section slot="step-1" data-step-label="Account" class="demo-column">
            <label for="docs-wizard-organization">Organization</label>
            <input id="docs-wizard-organization" name="organization" required />
          </section>
          <section slot="step-2" data-step-label="Review" class="demo-column">
            <p>Review the organization details and complete setup.</p>
          </section>
        </rowan-form-wizard>
        <pre id="form-wizard-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="form-wizard-contract">
        <h2>Behavior contract</h2>
        <p>Configure semantic step IDs with the steps property, map panels through step-ID slots, and react to user-only transition, validation, and completion events.</p>
        ${codeBlock(FORM_WIZARD_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupFormWizardDemo,
  },
  {
    id: "toast",
    group: "Components",
    title: "Rowan Toast",
    summary:
      "Compact status notification with tone variants, optional actions, and dismiss behavior for asynchronous feedback.",
    tags: ["feedback", "notification", "events"],
    keywords: ["toast", "dismissible", "tone", "rowan-dismiss"],
    content: () => `
      <section class="doc-section" data-doc-section id="toast-variants">
        <h2>Tone and content composition</h2>
        <p>Use tone to communicate urgency. Optional title and actions slots support richer notification context.</p>
        <div class="docs-alert-showcase">
          <rowan-toast tone="info" dismissible>
            <span slot="title">Background task started</span>
            Daily reconciliation is now running.
          </rowan-toast>
          <rowan-toast tone="success" dismissible>
            <span slot="title">Changes saved</span>
            Workspace policy was updated successfully.
          </rowan-toast>
          <rowan-toast tone="warning" dismissible>
            <span slot="title">Manual review required</span>
            3 records could not be auto-mapped.
          </rowan-toast>
          <rowan-toast tone="danger" dismissible>
            <span slot="title">Export failed</span>
            Reporting service is unavailable.
          </rowan-toast>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="toast-contract">
        <h2>Behavior contract</h2>
        <p>rowan-toast emits rowan-dismiss only on user-triggered dismissal and does not fire it when parents toggle visibility programmatically.</p>
        ${codeBlock(TOAST_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "toaster",
    group: "Components",
    title: "Rowan Toaster",
    summary:
      "Queue manager for toast notifications with placement control, max visible limits, and timeout dismissal.",
    tags: ["feedback", "queue", "events"],
    keywords: ["toaster", "toast queue", "rowan-toast-show", "rowan-toast-dismiss"],
    content: () => `
      <section class="doc-section" data-doc-section id="toaster-queue">
        <h2>Queue and placement behavior</h2>
        <p>rowan-toaster manages queueing and timeout dismissal while keeping at most max-visible notifications onscreen.</p>
        <p>For mobile-first behavior, default placement keeps notifications anchored to the bottom edge with safe-area support, while larger screens support directional placement options.</p>
        ${codeBlock(TOASTER_SNIPPET)}
      </section>

      <section class="doc-section" data-doc-section id="toaster-demo">
        <h2>Live event demo</h2>
        <p>Trigger sample notifications and inspect rowan-toast-show and rowan-toast-dismiss payloads.</p>
        <div class="demo-row">
          <rowan-button id="toaster-success" size="sm">Success toast</rowan-button>
          <rowan-button id="toaster-warning" size="sm" variant="secondary">Warning toast</rowan-button>
          <rowan-button id="toaster-danger" size="sm" variant="danger">Sticky danger</rowan-button>
        </div>
        <rowan-toaster id="docs-toaster-demo" placement="bottom-center" max-visible="2" duration="2800"></rowan-toaster>
        <pre id="toaster-events" class="table-events"></pre>
      </section>
    `,
    afterRender: setupToasterDemo,
  },
  {
    id: "table",
    group: "Components",
    title: "Rowan Table",
    summary:
      "The table supports config-driven rendering, typed cells, sorting, selection, pagination, and action events.",
    tags: ["config", "selection", "events"],
    keywords: ["table", "rows", "columns", "selection", "sort", "pagination"],
    content: () => `
      <section class="doc-section" data-doc-section id="table-config">
        <h2>Config-first API</h2>
        <p>Use config mode for reusable data views. Keep row ownership in the consumer and listen for table events.</p>
        ${codeBlock(TABLE_SNIPPET)}
      </section>

      <section class="doc-section" data-doc-section id="table-updates">
        <h2>Configuration updates</h2>
        <p>Assigning config replaces the complete table model and resets omitted settings. Assign rows, columns, selected, sort, or page directly when only that part should change.</p>
        ${codeBlock(TABLE_UPDATE_SNIPPET)}
        <p>In local development, Rowan warns about missing or duplicate column IDs, unsupported cell types, and invalid or duplicate row IDs. Invalid columns are omitted, unsupported cells render as text, and duplicate row IDs use a full render.</p>
      </section>

      <section class="doc-section" data-doc-section id="table-demo">
        <h2>Live table demo</h2>
        <p>Interact with sorting, selection, and cell actions. Recent events appear below the table.</p>
        <div class="table-shell">
          <rowan-table id="docs-table-demo" caption="Team access matrix"></rowan-table>
        </div>
        <pre id="table-events" class="table-events"></pre>
      </section>
    `,
    afterRender: setupTableDemo,
  },
  {
    id: "table-toolbar",
    group: "Components",
    title: "Rowan Table Toolbar",
    summary:
      "Composable table controls surface that tracks selected rows from an adjacent or explicitly referenced Rowan table.",
    tags: ["table", "selection", "composition"],
    keywords: ["table toolbar", "selected rows", "for-table", "rowan-select"],
    content: () => `
      <section class="doc-section" data-doc-section id="table-toolbar-overview">
        <h2>Selection-aware table controls</h2>
        <p>Place rowan-table-toolbar in the table toolbar slot to keep filters, view context, and the selected-row count in one operational surface.</p>
        <div class="table-shell">
          <rowan-table id="docs-table-toolbar-demo">
            <rowan-table-toolbar slot="toolbar" label="Member table controls">
              <span slot="start">Active members</span>
            </rowan-table-toolbar>
          </rowan-table>
        </div>
        <pre id="table-toolbar-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="table-toolbar-contract">
        <h2>Behavior contract</h2>
        <p>The toolbar reads selected IDs and rows as properties, responds to table selection updates, and stays silent when application code updates the table state.</p>
        ${codeBlock(TABLE_TOOLBAR_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupTableToolbarDemo,
  },
  {
    id: "bulk-actions-bar",
    group: "Components",
    title: "Rowan Bulk Actions Bar",
    summary:
      "Contextual action bar for selected table rows with property-only action configuration and explicit user events.",
    tags: ["table", "selection", "actions"],
    keywords: ["bulk actions", "selected rows", "clear selection", "rowan-bulk-action"],
    content: () => `
      <section class="doc-section" data-doc-section id="bulk-actions-bar-overview">
        <h2>Act on selected rows</h2>
        <p>rowan-bulk-actions-bar remains out of the way until rows are selected, then emits an explicit event for each configured operation without mutating consumer data.</p>
        <div class="table-shell">
          <rowan-table id="docs-bulk-actions-demo">
            <rowan-bulk-actions-bar id="docs-bulk-actions-bar" slot="toolbar"></rowan-bulk-actions-bar>
          </rowan-table>
        </div>
        <pre id="bulk-actions-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="bulk-actions-bar-contract">
        <h2>Behavior contract</h2>
        <p>Pass actions through the property, listen for rowan-bulk-action to persist work, and use the built-in clear action to return the table to an unselected state.</p>
        ${codeBlock(BULK_ACTIONS_BAR_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupBulkActionsBarDemo,
  },
  {
    id: "filter-builder",
    group: "Components",
    title: "Rowan Filter Builder",
    summary:
      "Configurable table filter controls that report a user-owned filter model without mutating table rows.",
    tags: ["table", "filters", "composition"],
    keywords: ["filter builder", "filters", "table rows", "rowan-filter-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="filter-builder-overview">
        <h2>Filter with application-owned rows</h2>
        <p>Use the filter builder in a table toolbar or next to a table. It emits filter state; application code decides how to derive and assign the resulting rows.</p>
        <div class="table-shell">
          <rowan-table id="docs-filter-builder-demo">
            <rowan-filter-builder id="docs-filter-builder" slot="toolbar"></rowan-filter-builder>
          </rowan-table>
        </div>
        <pre id="filter-builder-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="filter-builder-contract">
        <h2>Behavior contract</h2>
        <p>Pass field and filter arrays through properties. User edits emit rowan-filter-change with a copied filter array, while parent-set filters remain silent.</p>
        ${codeBlock(FILTER_BUILDER_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupFilterBuilderDemo,
  },
  {
    id: "row-details-panel",
    group: "Components",
    title: "Rowan Row Details Panel",
    summary:
      "A read-only detail panel that opens from table row activation or controlled row properties.",
    tags: ["table", "details", "overlay"],
    keywords: ["row details", "panel", "row activation", "rowan-row-activate"],
    content: () => `
      <section class="doc-section" data-doc-section id="row-details-panel-overview">
        <h2>Inspect an activated row</h2>
        <p>Double-click a row or press Enter on a focused row to open its details. The panel reads the row record and does not mutate consumer data.</p>
        <div class="table-shell">
          <rowan-table id="docs-row-details-table"></rowan-table>
        </div>
        <rowan-row-details-panel id="docs-row-details-panel" for-table="docs-row-details-table"></rowan-row-details-panel>
        <pre id="row-details-panel-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="row-details-panel-contract">
        <h2>Behavior contract</h2>
        <p>The panel can be controlled through row, rowId, and open properties or bound to table activation through for-table. It emits rowan-close only for user dismissal.</p>
        ${codeBlock(ROW_DETAILS_PANEL_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupRowDetailsPanelDemo,
  },
  {
    id: "quality",
    group: "Quality",
    title: "Accessibility and Verification",
    summary:
      "Rowan components are verified through public API contract tests and host-level accessibility semantics.",
    tags: ["a11y", "testing", "verification"],
    keywords: ["aria", "internals", "test", "lint", "cem"],
    content: () => `
      <section class="doc-section" data-doc-section id="quality-a11y">
        <h2>Accessibility defaults</h2>
        <p>Default ARIA roles and states are applied through ElementInternals when supported, without overriding author-defined roles.</p>
        <rowan-alert tone="success">
          Form-associated controls synchronize validity and form values via ElementInternals APIs.
        </rowan-alert>
      </section>

      <section class="doc-section" data-doc-section id="quality-checklist">
        <h2>Verification checklist</h2>
        <p>Run these commands before release to keep tests, docs metadata, and Storybook output healthy.</p>
        ${codeBlock(`npm run test\nnpm run lint\nnpm run analyze\nnpm run build-storybook`, "bash")}
      </section>
    `,
  },
];

const NAV_SECTIONS = [
  {
    id: "introduction",
    label: "Introduction",
    defaultOpen: true,
    items: [
      { pageId: "getting-started", label: "What is Rowan?" },
      { pageId: "theming", label: "Theming" },
      { pageId: "tokens", label: "Tokens" },
    ],
  },
  {
    id: "components",
    label: "Components",
    defaultOpen: true,
    items: [
      { pageId: "all-components", label: "All Components" },
      { pageId: "components", label: "Overview" },
      { pageId: "alert", label: "Alert" },
      { pageId: "button", label: "Button" },
      { pageId: "dialog", label: "Dialog" },
      { pageId: "command-palette", label: "Command Palette" },
      { pageId: "date-picker", label: "Date Picker" },
      { pageId: "time-picker", label: "Time Picker" },
      { pageId: "date-range-picker", label: "Date Range Picker" },
      { pageId: "calendar", label: "Calendar" },
      { pageId: "number-field", label: "Number Field" },
      { pageId: "dropzone", label: "Dropzone" },
      { pageId: "file-item", label: "File Item" },
      { pageId: "file-upload", label: "File Upload" },
      { pageId: "stepper", label: "Stepper" },
      { pageId: "tree", label: "Tree" },
      { pageId: "validation-summary", label: "Validation Summary" },
      { pageId: "form-wizard", label: "Form Wizard" },
      { pageId: "toast", label: "Toast" },
      { pageId: "toaster", label: "Toaster" },
      { pageId: "table", label: "Data Table" },
      { pageId: "table-toolbar", label: "Table Toolbar" },
      { pageId: "bulk-actions-bar", label: "Bulk Actions Bar" },
      { pageId: "filter-builder", label: "Filter Builder" },
      { pageId: "row-details-panel", label: "Row Details Panel" },
    ],
  },
  {
    id: "tools-workflow",
    label: "Tools and Workflows",
    defaultOpen: false,
    items: [{ pageId: "quality", label: "Accessibility and Verification" }],
  },
];

const PAGES_BY_ID = new Map(DOC_PAGES.map((page) => [page.id, page]));
const DEFAULT_OPEN_SECTION_IDS = NAV_SECTIONS.filter((section) => section.defaultOpen).map(
  (section) => section.id,
);

const mainEl = document.querySelector("#docs-main");
const navEl = document.querySelector("#docs-nav");
const tocEl = document.querySelector("#docs-toc");
const searchEl = document.querySelector("#docs-search");
const themeToggleEl = document.querySelector("#theme-toggle");
const quickstartTriggerEl = document.querySelector("#quickstart-trigger");
const quickstartDialogEl = document.querySelector("#quickstart-dialog");
const copyQuickstartEl = document.querySelector("#copy-quickstart");
const closeQuickstartEl = document.querySelector("#close-quickstart");
const quickstartCodeEl = document.querySelector("#quickstart-code");

let activeFilter = "";
let openNavSections = new Set(DEFAULT_OPEN_SECTION_IDS);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function codeBlock(code, language = "js") {
  return `<pre class="code-block" data-language="${language}"><code>${escapeHtml(code)}</code></pre>`;
}

function isColorLikeToken(token) {
  return (
    token.name.includes("color") ||
    token.name.endsWith("-bg") ||
    token.name.endsWith("-border") ||
    token.name.endsWith("-backdrop")
  );
}

function renderTokenPreview(token, previewType) {
  if (previewType === "color") {
    return `<span class="docs-token-preview docs-token-preview-color" style="background: var(${escapeHtml(token.name)})"></span>`;
  }

  if (previewType === "space") {
    return `<span class="docs-token-preview docs-token-preview-space" style="width: var(${escapeHtml(token.name)})"></span>`;
  }

  if (previewType === "radius") {
    return `<span class="docs-token-preview docs-token-preview-radius" style="border-radius: var(${escapeHtml(token.name)})"></span>`;
  }

  if (previewType === "auto" && isColorLikeToken(token)) {
    return `<span class="docs-token-preview docs-token-preview-color" style="background: var(${escapeHtml(token.name)})"></span>`;
  }

  return '<span class="docs-token-preview docs-token-preview-font">Ag</span>';
}

function renderTokenRows(tokens, previewType) {
  return tokens
    .map(
      (token) => `
      <tr>
        <td class="docs-token-name">${escapeHtml(token.name)}</td>
        <td class="docs-token-value">${escapeHtml(token.value)}</td>
        <td>${renderTokenPreview(token, previewType)}</td>
      </tr>
    `,
    )
    .join("");
}

function renderTokenTable(tokens, previewType) {
  return `
    <div class="docs-token-table-wrap">
      <table class="docs-token-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          ${renderTokenRows(tokens, previewType)}
        </tbody>
      </table>
    </div>
  `;
}

function renderThemeComparisonTable() {
  const rows = themeComparisonTokens
    .map(
      (token) => `
      <tr>
        <td class="docs-token-name">${escapeHtml(token.name)}</td>
        <td class="docs-token-value">${escapeHtml(token.light)}</td>
        <td class="docs-token-value">${escapeHtml(token.dark)}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <div class="docs-token-table-wrap">
      <table class="docs-token-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Light</th>
            <th>Dark</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function renderComponentCategoryChips() {
  return COMPONENT_CATEGORY_ORDER.map((category) => {
    const count = (COMPONENTS_BY_CATEGORY[category] || []).length;
    if (count === 0) return "";

    return `<span class="docs-component-chip">${escapeHtml(category)}: ${count}</span>`;
  }).join("");
}

function getDedicatedComponentRoute(tagName) {
  const pageId = tagName.replace(/^rowan-/, "");
  return PAGES_BY_ID.has(pageId) ? pageId : null;
}

function renderComponentApiLine(label, values) {
  const badges = values
    .map((value) => `<span class="docs-component-api-token">${escapeHtml(value)}</span>`)
    .join("");

  return `
    <div class="docs-component-api-line">
      <span class="docs-component-api-label">${escapeHtml(label)}</span>
      ${badges}
    </div>
  `;
}

function renderComponentApiSnippet(component) {
  const groups = [
    { label: "attrs", values: component.attributes || [] },
    { label: "events", values: component.events || [] },
    { label: "slots", values: component.slots || [] },
  ].filter((group) => group.values.length > 0);

  if (groups.length === 0) {
    return "";
  }

  return `
    <div class="docs-component-api" aria-label="Component API snippet">
      ${groups.map((group) => renderComponentApiLine(group.label, group.values)).join("")}
    </div>
  `;
}

function renderComponentItem(component) {
  const componentRoute = getDedicatedComponentRoute(component.tagName);
  const tagMarkup = componentRoute
    ? `<a href="#${componentRoute}">${escapeHtml(component.tagName)}</a>`
    : escapeHtml(component.tagName);

  return `
    <li class="docs-component-item">
      <p class="docs-component-tag">${tagMarkup}</p>
      <p class="docs-component-description">${escapeHtml(component.description)}</p>
      <p class="docs-component-meta">${escapeHtml(component.className)} | ${escapeHtml(component.modulePath)}</p>
      ${renderComponentApiSnippet(component)}
    </li>
  `;
}

function renderComponentGroups() {
  return COMPONENT_CATEGORY_ORDER.map((category) => {
    const components = COMPONENTS_BY_CATEGORY[category] || [];
    if (components.length === 0) return "";

    return `
      <article class="docs-component-group">
        <div class="docs-component-group-header">
          <h3>${escapeHtml(category)}</h3>
          <span class="docs-component-count">${components.length}</span>
        </div>
        <ul class="docs-component-list">
          ${components.map((component) => renderComponentItem(component)).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

function pageMatchesFilter(page, query) {
  if (!query) return true;

  const haystack = [
    page.title,
    page.summary,
    page.group,
    ...(page.tags || []),
    ...(page.keywords || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function getRouteId() {
  const hash = window.location.hash.replace(/^#/, "").trim();
  return PAGES_BY_ID.has(hash) ? hash : DEFAULT_PAGE_ID;
}

function navigateTo(pageId) {
  if (!PAGES_BY_ID.has(pageId)) return;

  if (window.location.hash === `#${pageId}`) {
    renderCurrentPage();
    return;
  }

  window.location.hash = pageId;
}

function navItemMatchesFilter(item, page, query) {
  if (!query) return true;

  const haystack = [
    item.label,
    page.title,
    page.group,
    page.summary,
    ...(page.tags || []),
    ...(page.keywords || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function renderNavigation() {
  const activeId = getRouteId();
  navEl.replaceChildren();

  let renderedItemCount = 0;

  for (const section of NAV_SECTIONS) {
    const sectionItems = section.items
      .map((item) => {
        const page = PAGES_BY_ID.get(item.pageId);
        return page ? { ...item, page } : null;
      })
      .filter((entry) => entry && navItemMatchesFilter(entry, entry.page, activeFilter));

    if (sectionItems.length === 0) continue;
    renderedItemCount += sectionItems.length;

    const hasActiveItem = sectionItems.some((item) => item.pageId === activeId);
    if (hasActiveItem) {
      openNavSections.add(section.id);
    }

    const shouldForceOpen = activeFilter.length > 0;
    const isOpen = shouldForceOpen || openNavSections.has(section.id);
    const listId = `docs-nav-section-${section.id}`;

    const groupEl = document.createElement("section");
    groupEl.className = "nav-section";
    groupEl.dataset.open = isOpen ? "true" : "false";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-section-toggle";
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-controls", listId);

    const chevron = document.createElement("span");
    chevron.className = "nav-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "▾";

    const label = document.createElement("span");
    label.className = "nav-section-label";
    label.textContent = section.label;

    toggle.append(chevron, label);

    toggle.addEventListener("click", () => {
      if (openNavSections.has(section.id)) {
        openNavSections.delete(section.id);
      } else {
        openNavSections.add(section.id);
      }

      renderNavigation();
    });

    const list = document.createElement("ul");
    list.id = listId;
    list.className = "nav-list";
    list.hidden = !isOpen;

    for (const item of sectionItems) {
      const listItem = document.createElement("li");
      listItem.className = "nav-item";

      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = `#${item.pageId}`;
      link.textContent = item.label;

      if (item.pageId === activeId) {
        link.setAttribute("aria-current", "page");
      }

      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(item.pageId);
      });

      listItem.append(link);
      list.append(listItem);
    }

    groupEl.append(toggle, list);
    navEl.append(groupEl);
  }

  if (renderedItemCount === 0) {
    const empty = document.createElement("p");
    empty.className = "nav-empty";
    empty.textContent = "No topics match this search.";
    navEl.append(empty);
  }
}

function renderToc() {
  tocEl.replaceChildren();

  const sectionHeadings = Array.from(mainEl.querySelectorAll("section[data-doc-section] > h2"));

  if (sectionHeadings.length === 0) {
    const empty = document.createElement("p");
    empty.className = "toc-empty";
    empty.textContent = "No section headings.";
    tocEl.append(empty);
    return;
  }

  for (const heading of sectionHeadings) {
    const section = heading.closest("section[data-doc-section]");
    if (!section || !section.id) continue;

    const anchor = document.createElement("a");
    anchor.href = `#${getRouteId()}:${section.id}`;
    anchor.textContent = heading.textContent;

    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${getRouteId()}`);
    });

    tocEl.append(anchor);
  }
}

function renderCurrentPage() {
  const page = PAGES_BY_ID.get(getRouteId()) ?? PAGES_BY_ID.get(DEFAULT_PAGE_ID);
  if (!page) return;

  const tagMarkup = (page.tags || [])
    .map((tag) => `<rowan-chip size="sm">${escapeHtml(tag)}</rowan-chip>`)
    .join("");

  mainEl.innerHTML = `
    <article class="doc-page">
      <header class="doc-header">
        <rowan-breadcrumb>
          <a href="#${DEFAULT_PAGE_ID}">Docs</a>
          <span aria-current="page">${escapeHtml(page.title)}</span>
        </rowan-breadcrumb>
        <h1>${escapeHtml(page.title)}</h1>
        <p>${escapeHtml(page.summary)}</p>
        <div class="doc-meta">${tagMarkup}</div>
      </header>
      ${page.content()}
    </article>
  `;

  document.title = `Rowan Documentation - ${page.title}`;
  renderNavigation();
  renderToc();
  page.afterRender?.();
}

function formatEventDetail(detail) {
  try {
    return JSON.stringify(detail, null, 2);
  } catch (_error) {
    return String(detail);
  }
}

function setupToasterDemo() {
  const toaster = mainEl.querySelector("#docs-toaster-demo");
  const output = mainEl.querySelector("#toaster-events");
  const successButton = mainEl.querySelector("#toaster-success");
  const warningButton = mainEl.querySelector("#toaster-warning");
  const dangerButton = mainEl.querySelector("#toaster-danger");

  if (
    !(toaster instanceof HTMLElement) ||
    !(output instanceof HTMLElement) ||
    !(successButton instanceof HTMLElement) ||
    !(warningButton instanceof HTMLElement) ||
    !(dangerButton instanceof HTMLElement)
  ) {
    return;
  }

  output.textContent = "Trigger notifications to stream rowan-toast-* payloads here.";

  const pushLog = (type, detail) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] ${type}\n${formatEventDetail(detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  };

  const eventTypes = ["rowan-toast-show", "rowan-toast-dismiss"];
  for (const eventType of eventTypes) {
    toaster.addEventListener(eventType, (event) => {
      pushLog(eventType, event.detail);
    });
  }

  successButton.addEventListener("rowan-click", () => {
    toaster.show({
      tone: "success",
      title: "Sync complete",
      message: "42 invoices were processed.",
    });
  });

  warningButton.addEventListener("rowan-click", () => {
    toaster.show({
      tone: "warning",
      title: "Policy reminder",
      message: "2 teams still require approval.",
    });
  });

  dangerButton.addEventListener("rowan-click", () => {
    toaster.show({
      tone: "danger",
      title: "Export failed",
      message: "The analytics pipeline timed out.",
      duration: 0,
    });
  });
}

function setupTableDemo() {
  const table = mainEl.querySelector("#docs-table-demo");
  const output = mainEl.querySelector("#table-events");

  if (!(table instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  table.config = {
    selectable: "multiple",
    stickyHeader: true,
    rowId: "id",
    page: { index: 0, size: 2, total: 3 },
    columns: [
      {
        id: "name",
        header: "Name",
        type: "link",
        sortable: true,
        cell: { href: (_value, row) => `/users/${row.id}` },
      },
      {
        id: "role",
        header: "Role",
        type: "badge",
        cell: { tone: (value) => (value === "Admin" ? "warning" : "info") },
      },
      { id: "active", header: "Active", type: "switch", align: "center" },
      { id: "quota", header: "Quota", type: "progress" },
      {
        id: "edit",
        header: "",
        type: "icon-button",
        cell: { label: "Edit", icon: "edit" },
        width: "3rem",
      },
    ],
    rows: [
      { id: "1", name: "Ada", role: "Admin", active: true, quota: 72 },
      { id: "2", name: "Alan", role: "Editor", active: false, quota: 18 },
      { id: "3", name: "Grace", role: "Editor", active: true, quota: 44 },
    ],
  };

  output.textContent = "Interact with the table to stream rowan-* event payloads here.";

  const pushLog = (type, detail) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] ${type}\n${formatEventDetail(detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  };

  const eventTypes = [
    "rowan-sort",
    "rowan-select",
    "rowan-cell-change",
    "rowan-cell-action",
    "rowan-page-change",
    "rowan-row-activate",
  ];

  for (const eventType of eventTypes) {
    table.addEventListener(eventType, (event) => {
      pushLog(eventType, event.detail);
    });
  }
}

function createTableOperationsConfig() {
  return {
    selectable: "multiple",
    rowId: "id",
    columns: [
      { id: "name", header: "Name", type: "text" },
      { id: "team", header: "Team", type: "text" },
    ],
    rows: [
      { id: "1", name: "Ada", team: "Platform" },
      { id: "2", name: "Alan", team: "Research" },
      { id: "3", name: "Grace", team: "Operations" },
    ],
  };
}

function filterOperationRows(rows, filters) {
  return rows.filter((row) =>
    filters.every((filter) => {
      const value = String(row[filter.field] ?? "").toLocaleLowerCase();
      const expected = String(filter.value ?? "").toLocaleLowerCase();

      if (filter.operator === "is-empty") return value.length === 0;
      if (filter.operator === "is-not-empty") return value.length > 0;
      if (filter.operator === "equals") return value === expected;
      if (filter.operator === "not-equals") return value !== expected;
      if (filter.operator === "starts-with") return value.startsWith(expected);
      if (filter.operator === "ends-with") return value.endsWith(expected);
      return value.includes(expected);
    }),
  );
}

function setupTableToolbarDemo() {
  const table = mainEl.querySelector("#docs-table-toolbar-demo");
  const output = mainEl.querySelector("#table-toolbar-events");

  if (!(table instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  table.config = createTableOperationsConfig();
  output.textContent =
    "Select rows to observe rowan-table-toolbar synchronization with rowan-select.";

  table.addEventListener("rowan-select", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-select\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });
}

function setupBulkActionsBarDemo() {
  const table = mainEl.querySelector("#docs-bulk-actions-demo");
  const bar = mainEl.querySelector("#docs-bulk-actions-bar");
  const output = mainEl.querySelector("#bulk-actions-events");

  if (
    !(table instanceof HTMLElement) ||
    !(bar instanceof HTMLElement) ||
    !(output instanceof HTMLElement)
  ) {
    return;
  }

  table.config = createTableOperationsConfig();
  bar.actions = [
    { id: "archive", label: "Archive", variant: "secondary" },
    { id: "assign", label: "Assign owner" },
    { id: "remove", label: "Remove", variant: "danger" },
  ];
  output.textContent = "Select rows, then trigger a bulk action or clear the current selection.";

  const pushLog = (type, detail) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] ${type}\n${formatEventDetail(detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  };

  table.addEventListener("rowan-select", (event) => {
    pushLog("rowan-select", event.detail);
  });

  for (const eventType of ["rowan-bulk-action", "rowan-clear-selection"]) {
    bar.addEventListener(eventType, (event) => {
      pushLog(eventType, event.detail);
    });
  }
}

function setupFilterBuilderDemo() {
  const table = mainEl.querySelector("#docs-filter-builder-demo");
  const builder = mainEl.querySelector("#docs-filter-builder");
  const output = mainEl.querySelector("#filter-builder-events");

  if (
    !(table instanceof HTMLElement) ||
    !(builder instanceof HTMLElement) ||
    !(output instanceof HTMLElement)
  ) {
    return;
  }

  const config = createTableOperationsConfig();
  const sourceRows = config.rows.map((row) => ({ ...row }));
  table.config = config;
  builder.fields = [
    { id: "name", label: "Name" },
    { id: "team", label: "Team", options: ["Platform", "Research", "Operations"] },
  ];
  output.textContent = "Add or update filters to derive the table rows in application code.";

  builder.addEventListener("rowan-filter-change", (event) => {
    table.rows = filterOperationRows(sourceRows, event.detail.filters).map((row) => ({ ...row }));
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-filter-change\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });
}

function setupRowDetailsPanelDemo() {
  const table = mainEl.querySelector("#docs-row-details-table");
  const panel = mainEl.querySelector("#docs-row-details-panel");
  const output = mainEl.querySelector("#row-details-panel-events");

  if (
    !(table instanceof HTMLElement) ||
    !(panel instanceof HTMLElement) ||
    !(output instanceof HTMLElement)
  ) {
    return;
  }

  table.config = createTableOperationsConfig();
  output.textContent = "Double-click a row or focus it and press Enter to inspect its details.";

  const pushLog = (type, detail) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] ${type}\n${formatEventDetail(detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  };

  table.addEventListener("rowan-row-activate", (event) => {
    pushLog("rowan-row-activate", event.detail);
  });

  panel.addEventListener("rowan-close", (event) => {
    pushLog("rowan-close", event.detail);
  });
}

function setupValidationSummaryDemo() {
  const summary = mainEl.querySelector("#docs-validation-summary");
  const form = mainEl.querySelector("#docs-validation-form");
  const validateButton = mainEl.querySelector("#docs-validate-form");
  const output = mainEl.querySelector("#validation-events");

  if (
    !(summary instanceof HTMLElement) ||
    !(form instanceof HTMLFormElement) ||
    !(validateButton instanceof HTMLElement) ||
    !(output instanceof HTMLElement)
  ) {
    return;
  }

  output.textContent =
    "Select Validate form to collect errors. Activate an error to focus its field.";

  const runValidation = () => {
    summary.collectFromForm();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runValidation();
  });

  validateButton.addEventListener("rowan-click", runValidation);

  summary.addEventListener("rowan-jump", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-jump\n${formatEventDetail({ fieldId: event.detail?.fieldId })}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });

  runValidation();
}

function setupFormWizardDemo() {
  const wizard = mainEl.querySelector("#docs-form-wizard");
  const output = mainEl.querySelector("#form-wizard-events");

  if (!(wizard instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  output.textContent = "Progress through the workflow to inspect rowan-form-wizard event payloads.";

  for (const eventType of ["rowan-step-change", "rowan-invalid", "rowan-complete"]) {
    wizard.addEventListener(eventType, (event) => {
      const stamp = new Date().toLocaleTimeString();
      const next = `[${stamp}] ${eventType}\n${formatEventDetail(event.detail)}\n`;
      output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
    });
  }
}

function setupTreeDemo() {
  const tree = mainEl.querySelector("#docs-tree-demo");
  const output = mainEl.querySelector("#tree-events");

  if (!(tree instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  output.textContent = "Select a node or expand a branch to inspect rowan-tree event payloads.";

  for (const eventType of ["rowan-change", "rowan-toggle"]) {
    tree.addEventListener(eventType, (event) => {
      const stamp = new Date().toLocaleTimeString();
      const next = `[${stamp}] ${eventType}\n${formatEventDetail(event.detail)}\n`;
      output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
    });
  }
}

function setupCommandPaletteDemo() {
  const palette = mainEl.querySelector("#docs-command-palette");
  const trigger = mainEl.querySelector("#docs-command-palette-trigger");
  const output = mainEl.querySelector("#command-palette-events");

  if (
    !(palette instanceof HTMLElement) ||
    !(trigger instanceof HTMLElement) ||
    !(output instanceof HTMLElement)
  ) {
    return;
  }

  output.textContent = "Open the palette, filter commands, then activate an enabled result.";

  trigger.addEventListener("rowan-click", () => {
    palette.show();
  });

  for (const eventType of ["rowan-command", "rowan-close"]) {
    palette.addEventListener(eventType, (event) => {
      const detail =
        eventType === "rowan-command"
          ? { query: event.detail?.query, value: event.detail?.value }
          : event.detail;
      const stamp = new Date().toLocaleTimeString();
      const next = `[${stamp}] ${eventType}\n${formatEventDetail(detail)}\n`;
      output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
    });
  }
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  themeToggleEl.checked = nextTheme === "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

function wireSearch() {
  const onChange = () => {
    activeFilter = searchEl.value.trim().toLowerCase();
    renderNavigation();
  };

  searchEl.addEventListener("input", onChange);
  searchEl.addEventListener("rowan-change", onChange);
}

function wireThemeToggle() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "light";
  applyTheme(savedTheme);

  themeToggleEl.addEventListener("rowan-change", (event) => {
    applyTheme(event.detail?.checked ? "dark" : "light");
  });
}

function wireQuickstartDialog() {
  quickstartCodeEl.textContent = QUICKSTART_SNIPPET;

  quickstartTriggerEl.addEventListener("rowan-click", () => {
    quickstartDialogEl.show();
  });

  closeQuickstartEl.addEventListener("rowan-click", () => {
    quickstartDialogEl.hide();
  });

  copyQuickstartEl.addEventListener("rowan-click", async () => {
    try {
      await navigator.clipboard.writeText(QUICKSTART_SNIPPET);
      copyQuickstartEl.textContent = "Copied";
      window.setTimeout(() => {
        copyQuickstartEl.textContent = "Copy snippet";
      }, 1400);
    } catch (_error) {
      copyQuickstartEl.textContent = "Copy failed";
      window.setTimeout(() => {
        copyQuickstartEl.textContent = "Copy snippet";
      }, 1400);
    }
  });
}

function initialize() {
  if (!window.location.hash || !PAGES_BY_ID.has(window.location.hash.replace(/^#/, ""))) {
    history.replaceState(null, "", `#${DEFAULT_PAGE_ID}`);
  }

  wireSearch();
  wireThemeToggle();
  wireQuickstartDialog();

  window.addEventListener("hashchange", renderCurrentPage);
  renderCurrentPage();
}

initialize();
