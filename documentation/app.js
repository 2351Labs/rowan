import "../src/tokens/tokens.css";
import "../src/tokens/themes/light.css";
import "../src/tokens/themes/dark.css";

import "../src/index.js";
import "../packages/maplibre/src/map/map.js";
import { ArrowRight } from "../packages/icons/src/icons/arrow-right.js";
import { CalendarDays } from "../packages/icons/src/icons/calendar-days.js";
import { CircleCheck } from "../packages/icons/src/icons/circle-check.js";
import { Download } from "../packages/icons/src/icons/download.js";
import { Menu } from "../packages/icons/src/icons/menu.js";
import { Search } from "../packages/icons/src/icons/search.js";
import { Settings2 } from "../packages/icons/src/icons/settings-2.js";
import { ShieldCheck } from "../packages/icons/src/icons/shield-check.js";
import { SlidersHorizontal } from "../packages/icons/src/icons/sliders-horizontal.js";
import { X } from "../packages/icons/src/icons/x.js";
import customElementsManifest from "../custom-elements.json";
import { formatCurrency, formatDate, formatNumber, formatRelativeTime } from "../src/lib/format.js";
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
import { formatDocumentationRoute, parseDocumentationRoute } from "./navigation.js";
import {
  COMPONENT_CATEGORY_ORDER,
  createComponentNavigationSections,
  getComponentCategoryLabel,
  matchesDocumentationNavigationItem,
} from "./taxonomy.js";

const DEFAULT_PAGE_ID = "getting-started";
const THEME_STORAGE_KEY = "rowan-docs-theme";
const OPEN_FREE_MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const OPEN_FREE_MAP_ATTRIBUTION = [
  { label: "OpenFreeMap", href: "https://openfreemap.org/" },
  { label: "© OpenMapTiles", href: "https://www.openmaptiles.org/" },
  {
    label: "Data from OpenStreetMap",
    href: "https://www.openstreetmap.org/copyright",
  },
];

const ICON_IMPORT_SNIPPET = `import { ArrowRight } from "@rowan-ui/icons/icons/arrow-right";

const button = document.querySelector("rowan-icon-button");
button.label = "Continue";
button.append(ArrowRight());`;

const MEANINGFUL_ICON_SNIPPET = `import { CircleCheck } from "@rowan-ui/icons/icons/circle-check";

const statusIcon = CircleCheck({
  label: "Deployment completed",
  size: 24,
});`;

const ICON_GALLERY = [
  { create: ArrowRight, label: "Continue", name: "arrow-right" },
  { create: CalendarDays, label: "Schedule", name: "calendar-days" },
  { create: Download, label: "Download", name: "download" },
  { create: Menu, label: "Open navigation", name: "menu" },
  { create: Search, label: "Search", name: "search" },
  { create: Settings2, label: "Settings", name: "settings-2" },
  { create: ShieldCheck, label: "Security", name: "shield-check" },
  { create: SlidersHorizontal, label: "Adjust filters", name: "sliders-horizontal" },
  { create: X, label: "Close", name: "x" },
];

const QUICKSTART_SNIPPET = `npm install @rowan-ui/core

import "@rowan-ui/core";
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";`;

const FORMAT_SNIPPET = `import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "@rowan-ui/core/format";

const locale = "de-DE";
const amount = formatCurrency(1234.56, {
  currency: "EUR",
  locale,
  options: { currencyDisplay: "code" },
});

const deploymentDate = formatDate("2026-09-13T14:30:00Z", {
  locale: "en-GB",
  timeZone: "UTC",
  options: { dateStyle: "long", timeStyle: "short" },
});

const change = formatRelativeTime(-1, { locale: "en-US", unit: "day" });
const fallback = formatNumber("unavailable", { fallback: "Not available" });`;

const REACT_TABLE_SNIPPET = `import { useState } from "react";
import { RowanButton } from "@rowan-ui/core/react/button";
import { RowanTable } from "@rowan-ui/core/react/table";

const config = {
  rowId: "id",
  selectable: "multiple",
  caption: "Members",
  columns: [{ id: "name", header: "Name" }],
  rows: [{ id: "1", name: "Ada" }],
};

export function MembersTable() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <RowanTable
        config={config}
        selected={selected}
        onRowanSelect={(event) => setSelected(event.detail.selected)}
      />
      <RowanButton onRowanClick={() => save()}>Save</RowanButton>
    </>
  );
}`;

const REACT_EVENTS_SNIPPET = `useRowanElement(fieldRef, {
  events: {
    "rowan-change": (event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail;
      updateName(detail.value);
    },
  },
});

useRowanElement(buttonRef, {
  properties: { disabled },
  events: { "rowan-click": () => save() },
});`;

const REACT_18_BOOLEAN_SNIPPET = `const booleanAttributes = disabled ? { disabled: true } : {};

return <rowan-button {...booleanAttributes}>Save</rowan-button>;`;

const NEXT_JS_SNIPPET = `"use client";

import { RowanButton } from "@rowan-ui/core/react/button";
import { RowanTable } from "@rowan-ui/core/react/table";

export function RowanClientBoundary() {
  return <RowanButton onRowanClick={() => save()}>Save</RowanButton>;
}`;

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
table.sort = { id: "name", dir: "asc" };
table.page = { index: 0, size: 25, total: totalMembers };`;

const TABLE_CUSTOM_CELL_SNIPPET = `const table = document.querySelector("#orders-table");

const template = document.createElement("template");
template.slot = "status-cell";
template.innerHTML = '<span data-status></span>';
table.append(template);

table.addEventListener("rowan-cell-bind", (event) => {
  const { row, cellEl } = event.detail;
  cellEl.querySelector("[data-status]").textContent = row.status;
});

table.config = {
  rowId: "id",
  columns: [
    {
      id: "approval",
      header: "Approval",
      type: "checkbox",
      headerCell: { tooltip: "Current approval status" },
      cell: {
        indeterminate: (_value, row) => row.pending,
        title: (_value, row) => "Approval for " + row.name,
      },
    },
    { id: "status", header: "Status", type: "custom", cell: { slot: "status-cell" } },
    {
      id: "name",
      header: "Name",
      type: "custom",
      cell: { render: ({ value }) => "Member: " + value },
    },
  ],
  rows: [{ id: "1", name: "Ada", status: "Pending", pending: true }],
};`;

const VIRTUAL_LIST_SNIPPET = `<rowan-virtual-list id="member-list" item-size="44" overscan="4"></rowan-virtual-list>

<script type="module">
  import "@rowan-ui/core/virtual-list";

  const list = document.querySelector("#member-list");
  list.items = Array.from({ length: 500 }, (_value, index) => ({
    id: "member-" + (index + 1),
    name: "Member " + (index + 1),
  }));
  list.itemKey = "id";
  list.renderItem = (item) => {
    const row = document.createElement("div");
    row.textContent = item.name;
    return row;
  };
</script>`;

const TABLE_VIRTUALIZED_SNIPPET = `const table = document.querySelector("#member-table");

table.config = {
  rowId: "id",
  selectable: "multiple",
  stickyHeader: true,
  virtualized: true,
  virtualItemSize: 40,
  virtualOverscan: 4,
  columns: [
    { id: "name", header: "Member", sortable: true },
    { id: "team", header: "Team", type: "badge" },
  ],
  rows: members,
};`;

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

const COLOR_PICKER_SNIPPET = `<rowan-color-picker
  id="project-color"
  name="projectColor"
  label="Project color"
  value="#1d432f"
></rowan-color-picker>

<script type="module">
  import "@rowan-ui/core/color-picker";

  const picker = document.querySelector("#project-color");
  picker.palette = [
    { value: "#1d432f", label: "Forest" },
    { value: "#24543c", label: "Canopy" },
    { value: "#b4392d", label: "Signal" },
  ];

  picker.addEventListener("rowan-change", (event) => {
    console.log(event.detail.value);
  });
</script>`;

const RATING_SNIPPET = `<rowan-rating
  id="service-quality"
  name="serviceQuality"
  label="Service quality"
  value="4"
  required
></rowan-rating>

<script type="module">
  import "@rowan-ui/core/rating";

  const rating = document.querySelector("#service-quality");
  rating.addEventListener("rowan-change", (event) => {
    console.log(event.detail.value);
  });
</script>`;

const RICH_TEXT_EDITOR_SNIPPET = `<rowan-rich-text-editor
  id="incident-guidance"
  name="incidentGuidance"
  label="Incident guidance"
  placeholder="Describe the response steps"
></rowan-rich-text-editor>

<script type="module">
  import "@rowan-ui/core/rich-text-editor";

  const editor = document.querySelector("#incident-guidance");
  editor.value = {
    blocks: [
      {
        type: "paragraph",
        children: [{ text: "Escalate to the incident lead.", bold: true }],
      },
      {
        type: "unordered-list",
        items: [
          [{ text: "Open the incident record" }],
          [{ text: "Notify the on-call team" }],
        ],
      },
    ],
  };

  editor.addEventListener("rowan-change", (event) => {
    console.log(event.detail.value);
  });
</script>`;

const TREND_CHART_SNIPPET = `<rowan-trend-chart
  id="on-call-workload"
  label="On-call workload"
  description="Incoming and resolved incidents by day."
  interactive
></rowan-trend-chart>

<script type="module">
  import "@rowan-ui/core/trend-chart";

  const chart = document.querySelector("#on-call-workload");
  chart.config = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    interactive: true,
    series: [
      { id: "incoming", label: "Incoming incidents", values: [18, 24, null, 12, 15, 9] },
      { id: "resolved", label: "Resolved incidents", values: [13, 19, 20, 15, 16, 12] },
    ],
    valueFormatter: (value, context) =>
      context.tick ? String(value) : \`\${value} incidents\`,
  };
</script>`;

const MAPLIBRE_MAP_SNIPPET = `<rowan-maplibre-map
  id="dispatch-coverage"
  label="Dispatch coverage"
  description="Scheduled field work by coordinate."
></rowan-maplibre-map>

<script type="module">
  import "@rowan-ui/core/tokens";
  import "@rowan-ui/maplibre/map";

  const map = document.querySelector("#dispatch-coverage");
  map.mapStyle = "https://tiles.openfreemap.org/styles/liberty";
  map.attribution = [
    { label: "OpenFreeMap", href: "https://openfreemap.org/" },
    { label: "© OpenMapTiles", href: "https://www.openmaptiles.org/" },
    {
      label: "Data from OpenStreetMap",
      href: "https://www.openstreetmap.org/copyright",
    },
  ];
  map.layers = [{ id: "scheduled", label: "Scheduled work", visible: true }];
  map.locations = [
    {
      id: "dispatch-17",
      label: "Generator inspection",
      latitude: 47.6062,
      longitude: -122.3321,
      description: "Priority inspection",
      layerId: "scheduled",
    },
  ];

  map.addEventListener("rowan-location-activate", (event) => {
    console.log(event.detail);
  });
</script>`;

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

const CAROUSEL_SNIPPET = `<rowan-carousel id="release-carousel" label="Release highlights" active-index="1">
  <article>
    <h3>Release readiness</h3>
    <p>Rollback coverage is in place for the deployment window.</p>
  </article>
  <article>
    <h3>Service coverage</h3>
    <p>Confirm the weekend handoff before the window opens.</p>
  </article>
  <article>
    <h3>Customer communication</h3>
    <p>The customer notice is scheduled with the impact summary.</p>
  </article>
</rowan-carousel>

<script type="module">
  import "@rowan-ui/core/carousel";

  const carousel = document.querySelector("#release-carousel");
  carousel.addEventListener("rowan-change", (event) => {
    console.log(event.detail.activeIndex);
  });
</script>`;

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

const LISTBOX_SNIPPET = `<rowan-listbox id="team-list" name="team" label="Teams" selection="multiple">
  <rowan-option value="design">Design</rowan-option>
  <rowan-option value="engineering">Engineering</rowan-option>
  <rowan-option value="operations">Operations</rowan-option>
</rowan-listbox>

<script type="module">
  import "@rowan-ui/core/listbox";

  const listbox = document.querySelector("#team-list");
  listbox.selected = ["design", "operations"];

  listbox.addEventListener("rowan-change", (event) => {
    console.log(event.detail.selected);
  });
</script>`;

const MULTI_SELECT_COMBOBOX_SNIPPET = `<rowan-multi-select-combobox
  id="assigned-teams"
  name="team"
  label="Assigned teams"
  placeholder="Search teams"
></rowan-multi-select-combobox>

<script type="module">
  import "@rowan-ui/core/multi-select-combobox";

  const teams = document.querySelector("#assigned-teams");
  teams.options = [
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "operations", label: "Operations" },
  ];
  teams.selected = ["design", "operations"];

  teams.addEventListener("rowan-change", (event) => {
    console.log(event.detail.selected);
  });
</script>`;

const SEGMENTED_CONTROL_SNIPPET = `<rowan-segmented-control id="view-mode" name="view" label="View mode"></rowan-segmented-control>

<script type="module">
  import "@rowan-ui/core/segmented-control";

  const viewMode = document.querySelector("#view-mode");
  viewMode.options = [
    { value: "board", label: "Board" },
    { value: "list", label: "List" },
    { value: "timeline", label: "Timeline" },
  ];
  viewMode.value = "board";

  viewMode.addEventListener("rowan-change", (event) => {
    console.log(event.detail.value);
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

const SLIDER_SNIPPET = `<rowan-slider name="capacity" min="0" max="100" step="5"></rowan-slider>

<script type="module">
  const slider = document.querySelector("rowan-slider");
  slider.value = 65;
  slider.formatValue = (value) => String(value) + "% capacity";
</script>`;

const RANGE_SLIDER_SNIPPET = `<rowan-slider name="budget" range min="0" max="500" step="25"></rowan-slider>

<script type="module">
  const slider = document.querySelector("rowan-slider");
  slider.value = { start: 100, end: 300 };
  slider.formatValue = ({ start, end }) => "$" + start + " - $" + end;
</script>`;

const FORM_FIELD_SNIPPET = `<rowan-form-field
  label="Workspace name"
  hint="Used in workspace URLs."
  description="Choose a concise, recognizable name."
>
  <rowan-text-field name="workspace"></rowan-text-field>
</rowan-form-field>`;

const FORM_LAYOUT_SNIPPET = `<rowan-form-layout columns="2" label-position="start" label-align="end" label-width="8rem">
  <rowan-form-field label="Project name">
    <rowan-text-field name="project"></rowan-text-field>
  </rowan-form-field>
  <rowan-form-field label="Monthly budget" span="2">
    <rowan-slider name="budget" min="0" max="500" step="25"></rowan-slider>
  </rowan-form-field>
</rowan-form-layout>`;

const SPLIT_PANE_SNIPPET = `<rowan-split-pane id="workspace-pane" position="32" min="20" max="80">
  <aside slot="start">Navigation</aside>
  <main slot="end">Workspace content</main>
</rowan-split-pane>

<script type="module">
  import "@rowan-ui/core/split-pane";

  const pane = document.querySelector("#workspace-pane");
  pane.snapPoints = [25, 50, 75];

  pane.addEventListener("rowan-resize", (event) => {
    console.log(event.detail.value);
  });
</script>`;

const APP_LAYOUT_SNIPPET = `<rowan-app-layout id="project-shell">
  <header slot="header">Northstar</header>
  <rowan-side-nav slot="navigation" label="Project navigation" value="overview">
    <rowan-side-nav-item value="overview" href="/overview">Overview</rowan-side-nav-item>
    <rowan-side-nav-item value="members" href="/members">Members</rowan-side-nav-item>
  </rowan-side-nav>
  <main>Project overview</main>
</rowan-app-layout>

<script type="module">
  import "@rowan-ui/core/app-layout";
  import "@rowan-ui/core/side-nav";

  const shell = document.querySelector("#project-shell");
  shell.addEventListener("rowan-change", (event) => {
    console.log(event.detail.navigationOpen);
  });
</script>`;

const SIDE_NAV_SNIPPET = `<rowan-side-nav id="project-nav" label="Project navigation" value="overview">
  <rowan-side-nav-section label="Workspace">
    <rowan-side-nav-item value="overview">Overview</rowan-side-nav-item>
    <rowan-side-nav-item value="activity">Activity</rowan-side-nav-item>
  </rowan-side-nav-section>
</rowan-side-nav>

<script type="module">
  import "@rowan-ui/core/side-nav";
  import "@rowan-ui/core/side-nav-section";

  const nav = document.querySelector("#project-nav");
  nav.addEventListener("rowan-change", (event) => {
    event.preventDefault();
    router.push(event.detail.value);
  });
</script>`;

const SIDE_NAV_ITEM_SNIPPET = `<rowan-side-nav-item value="overview" href="/overview" active>
  Overview
</rowan-side-nav-item>`;

const CONFIRM_DIALOG_SNIPPET = `<rowan-confirm-dialog
  id="archive-dialog"
  label="Archive project"
  confirm-label="Archive"
  confirm-variant="danger"
>
  <span slot="title">Archive this project?</span>
  Archived projects remain available to workspace administrators.
</rowan-confirm-dialog>

<script type="module">
  import "@rowan-ui/core/confirm-dialog";

  const dialog = document.querySelector("#archive-dialog");
  dialog.addEventListener("rowan-confirm", () => {
    // Persist the archive action.
  });
</script>`;

const CONTEXT_MENU_SNIPPET = `<button id="project-target" type="button">Trail map</button>

<rowan-context-menu for="project-target" label="Project actions">
  <rowan-menu-item value="rename">Rename</rowan-menu-item>
  <rowan-menu-item value="archive">Archive</rowan-menu-item>
</rowan-context-menu>

<script type="module">
  import "@rowan-ui/core/context-menu";
  import "@rowan-ui/core/menu-item";

  const menu = document.querySelector("rowan-context-menu");
  menu.addEventListener("rowan-change", (event) => {
    console.log(event.detail.value);
  });
</script>`;

const STATUS_INDICATOR_SNIPPET = `<rowan-status-indicator tone="success" label="Operational"></rowan-status-indicator>
<rowan-status-indicator tone="info" label="Syncing" pulse></rowan-status-indicator>

<script type="module">
  import "@rowan-ui/core/status-indicator";
</script>`;

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

function titleFromTagName(tagName) {
  return tagName
    .replace(/^rowan-/, "")
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
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
        category: getComponentCategoryLabel(tagName),
        attributes: collectManifestAttributes(declaration.attributes),
        events: collectManifestEvents(declaration.events),
        slots: collectManifestSlots(declaration.slots),
      });
    }
  }

  return [...byTagName.values()].sort((left, right) => left.tagName.localeCompare(right.tagName));
}

const SUPPORTED_COMPONENTS = collectSupportedComponents();
const SUPPORTED_COMPONENT_TAG_NAMES = new Set(
  SUPPORTED_COMPONENTS.map((component) => component.tagName),
);
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
      "Named after the rowan tree: vanilla Web Components, composition, config where reuse matters, quiet theming.",
    tags: ["esm", "web-components", "shadow-dom"],
    keywords: ["install", "import", "quick start", "setup", "why rowan", "brief"],
    content: () => `
      <section class="doc-section" data-doc-section id="start-why">
        <h2>Why Rowan</h2>
        <p>Rowan is named after the rowan tree (<em>Sorbus aucuparia</em>): small, hardy, and easy to recognize without being loud. It grows at edges and in thin soil. The scarlet berries are a detail on the tree, not the tree itself.</p>
        <p>That is the brief for this library.</p>
        <ul>
          <li><strong>Vanilla first.</strong> Custom Elements, Shadow DOM, slots, CSS tokens. No framework runtime in the box.</li>
          <li><strong>Composition over inheritance.</strong> Public API is attributes, properties, slots, events, and parts. Components nest; they do not subclass each other.</li>
          <li><strong>Config where reuse matters.</strong> Tables and similar surfaces take data and cell config so the same component can be a checkbox column in one app and a link column in another.</li>
          <li><strong>Quiet theming.</strong> Primitive → semantic → component tokens. Dark mode is a token swap, not a fork.</li>
        </ul>
        <p>The mark is an R with a single berry in the counter. The letter is the product. The berry is the reminder: keep the accent small.</p>
      </section>

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
    id: "react",
    group: "Overview",
    title: "React",
    summary:
      "Generated wrappers are the React default. Raw tags and useRowanElement remain for odd bindings.",
    tags: ["react", "tsx", "ssr", "events", "wrappers"],
    keywords: ["react", "tsx", "next.js", "ssr", "useRowanElement", "RowanButton", "wrappers"],
    content: () => `
      <section class="doc-section" data-doc-section id="react-overview">
        <h2>Generated wrappers</h2>
        <p>The custom element is the product. Import <code>RowanButton</code> from <code>@rowan-ui/core/react/button</code> (and the same pattern for other tags). Wrappers load the element module, assign objects as properties, and map <code>onRowanClick</code> to <code>rowan-click</code>. <code>ref</code> is the host. They are not Server Components.</p>
        ${codeBlock(REACT_TABLE_SNIPPET, "tsx")}
      </section>

      <section class="doc-section" data-doc-section id="react-properties-events">
        <h2>Raw tags and useRowanElement</h2>
        <p>Raw <code>&lt;rowan-button&gt;</code> stays first-class. <code>@rowan-ui/core/react</code> still adds JSX types and <code>useRowanElement()</code> for odd bindings. Pass objects, arrays, and native events through the helper on the tag path; wrappers already do that as props.</p>
        ${codeBlock(REACT_EVENTS_SNIPPET, "tsx")}
      </section>

      <section class="doc-section" data-doc-section id="react-18-booleans">
        <h2>React 18 boolean attributes</h2>
        <p>Wrappers assign booleans as properties, so <code>disabled={false}</code> does not appear in markup. React 18 server rendering of a raw tag serializes false custom-element booleans as present attributes such as disabled=&quot;false&quot;. For raw tags, omit false booleans from server markup or set them through a client-side ref after hydration.</p>
        ${codeBlock(REACT_18_BOOLEAN_SNIPPET, "tsx")}
      </section>

      <section class="doc-section" data-doc-section id="react-ssr">
        <h2>Next.js and SSR</h2>
        <p>Import wrappers from a client component. Do not import them or registration modules from server-rendered code. The hook-only <code>@rowan-ui/core/react</code> entry does not register elements; generated wrappers do.</p>
        ${codeBlock(NEXT_JS_SNIPPET, "tsx")}
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
        <p>Set semantic tokens at the document root. Component tokens derive from them, so a semantic-only theme stays readable.</p>
        ${codeBlock(`:root {
  --rowan-color-bg: #f7f6ef;
  --rowan-color-fg: #1c2320;
  --rowan-color-accent: #214d36;
  --rowan-color-surface: #ffffff;
}

:root[data-theme="dark"] {
  --rowan-color-bg: #0f1612;
  --rowan-color-fg: #ebf0ea;
  --rowan-color-accent: #7ec197;
  --rowan-color-surface: #18211c;
  --rowan-color-accent-contrast: #0f1612;
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
    id: "formatting",
    group: "Foundations",
    title: "Locale Formatting",
    summary:
      "Pure Intl-backed utilities for number, currency, date, and relative-time display with explicit locale and time-zone ownership.",
    tags: ["intl", "locale", "time-zone", "formatting"],
    keywords: ["format number", "currency", "date", "relative time", "locale", "time zone", "intl"],
    content: () => `
      <section class="doc-section" data-doc-section id="formatting-preview-section">
        <h2>Application-owned display formatting</h2>
        <p>Rowan provides a small JavaScript utility rather than a display-only custom element. Call it where text is created, retain application ownership of locale and time zone, and write the returned string with textContent.</p>
        <div class="docs-format-preview" id="formatting-preview" role="list"></div>
      </section>

      <section class="doc-section" data-doc-section id="formatting-api">
        <h2>Explicit locale and time zone</h2>
        <p>All configuration is a JavaScript object, never an attribute. Omit locale to use the browser default. Supply timeZone to formatDate when a date must remain anchored to a known region or UTC.</p>
        ${codeBlock(FORMAT_SNIPPET, "js")}
      </section>

      <section class="doc-section" data-doc-section id="formatting-fallbacks">
        <h2>Fallback behavior</h2>
        <p>Invalid values, malformed or unsupported locale tags, invalid time zones, and invalid Intl option sets return fallback. The default fallback is an empty string so applications can provide localized absence text. Re-run the formatter with new configuration whenever locale or time-zone state changes.</p>
      </section>
    `,
    afterRender: setupFormattingDemo,
  },
  {
    id: "icons",
    group: "Integrations",
    title: "Icons",
    summary:
      "An optional, directly importable SVG icon set with deliberate accessibility defaults and no core registry.",
    tags: ["icons", "svg", "accessibility", "optional-package"],
    keywords: ["icons", "svg", "lucide", "decorative", "meaningful", "icon-button"],
    content: () => `
      <section class="doc-section" data-doc-section id="icons-imports">
        <h2>Individual imports</h2>
        <p>Use the optional icon package when a product needs a shared visual vocabulary. Import an icon from its own module so core remains asset-free and the application keeps the narrowest bundle boundary.</p>
        ${codeBlock(ICON_IMPORT_SNIPPET, "js")}
      </section>

      <section class="doc-section" data-doc-section id="icons-accessibility">
        <h2>Decorative and meaningful use</h2>
        <p>Icons are hidden from assistive technology by default. Keep that default inside a labeled control or next to visible text. Give an icon an explicit label only when it communicates independent status or information.</p>
        <div class="docs-icon-meaningful" id="docs-meaningful-icon"></div>
        ${codeBlock(MEANINGFUL_ICON_SNIPPET, "js")}
      </section>

      <section class="doc-section" data-doc-section id="icons-gallery">
        <h2>Selected icon gallery</h2>
        <p>The package ships 2,098 source icons from Lucide Static 1.45.0. This selection demonstrates direct module imports and composition with Rowan controls.</p>
        <div class="docs-icon-gallery" id="docs-icons-gallery" role="list"></div>
      </section>
    `,
    afterRender: setupIconDemo,
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
    id: "confirm-dialog",
    group: "Components",
    title: "Rowan Confirm Dialog",
    summary:
      "Composed confirmation surface for consequential actions with explicit confirm, cancel, and passive-dismiss events.",
    tags: ["overlay", "confirmation", "focus"],
    keywords: ["confirm dialog", "destructive action", "rowan-confirm", "rowan-cancel", "modal"],
    content: () => `
      <section class="doc-section" data-doc-section id="confirm-dialog-overview">
        <h2>Consequential actions</h2>
        <p>Use the built-in confirmation and cancellation controls for decisions that need a clear outcome. The component delegates modal focus handling to rowan-dialog while keeping outcome events explicit.</p>
        <div class="demo-row">
          <rowan-button id="docs-confirm-dialog-trigger" size="sm" variant="danger">Archive project</rowan-button>
        </div>
        <rowan-confirm-dialog
          id="docs-confirm-dialog-demo"
          label="Archive project"
          confirm-label="Archive"
          confirm-variant="danger"
        >
          <span slot="title">Archive this project?</span>
          Archived projects remain available to workspace administrators.
        </rowan-confirm-dialog>
        <pre id="confirm-dialog-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="confirm-dialog-contract">
        <h2>Outcome events</h2>
        <p>Parent changes to open remain silent. The default controls emit rowan-confirm or rowan-cancel, while Escape, the close control, and backdrop dismissal emit rowan-close.</p>
        ${codeBlock(CONFIRM_DIALOG_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupConfirmDialogDemo,
  },
  {
    id: "context-menu",
    group: "Components",
    title: "Rowan Context Menu",
    summary:
      "Target-bound contextual action menu with native pointer and keyboard invocation plus managed menu focus.",
    tags: ["overlay", "menu", "keyboard"],
    keywords: ["context menu", "right click", "shift f10", "menu actions", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="context-menu-overview">
        <h2>Contextual actions</h2>
        <p>Bind the menu with for or the target property. Users can invoke it with a context click or by focusing the target and pressing Shift+F10 or the Context Menu key.</p>
        <div class="docs-context-menu-demo">
          <button id="docs-context-menu-target" class="docs-context-menu-target" type="button">Trail map</button>
          <rowan-context-menu id="docs-context-menu-demo" for="docs-context-menu-target" label="Trail map actions">
            <rowan-menu-item value="rename">Rename</rowan-menu-item>
            <rowan-menu-item value="duplicate">Duplicate</rowan-menu-item>
            <rowan-menu-item value="archive">Archive</rowan-menu-item>
          </rowan-context-menu>
        </div>
        <pre id="context-menu-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="context-menu-contract">
        <h2>Target and selection contract</h2>
        <p>Context-menu opens are user interactions, while open remains available for silent parent-driven control. Selecting a rowan-menu-item emits rowan-change; Escape and outside dismissal emit rowan-close.</p>
        ${codeBlock(CONTEXT_MENU_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupContextMenuDemo,
  },
  {
    id: "status-indicator",
    group: "Components",
    title: "Rowan Status Indicator",
    summary:
      "Concise semantic status marker with toned visual state, visible labels, and optional restrained pulse.",
    tags: ["status", "feedback", "semantic"],
    keywords: ["status indicator", "operational", "syncing", "tone", "pulse"],
    content: () => `
      <section class="doc-section" data-doc-section id="status-indicator-overview">
        <h2>Persistent status</h2>
        <p>Use the indicator when a compact, continuously visible state is more useful than a transient alert. Supply text with the default slot or label attribute so the status remains understandable without color.</p>
        <div class="docs-status-indicator-demo">
          <rowan-status-indicator tone="neutral" label="Offline"></rowan-status-indicator>
          <rowan-status-indicator tone="info" label="Syncing" pulse></rowan-status-indicator>
          <rowan-status-indicator tone="success" label="Operational"></rowan-status-indicator>
          <rowan-status-indicator tone="warning" label="Needs attention"></rowan-status-indicator>
          <rowan-status-indicator tone="danger" label="Unavailable"></rowan-status-indicator>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="status-indicator-contract">
        <h2>Semantic tone</h2>
        <p>tone accepts neutral, info, success, warning, and danger. The component provides status semantics by default without replacing author-provided role or aria-label values.</p>
        ${codeBlock(STATUS_INDICATOR_SNIPPET, "html")}
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
    id: "color-picker",
    group: "Components",
    title: "Rowan Color Picker",
    summary:
      "Form-associated semantic color selection with approved swatches and an alpha-enabled custom color fallback.",
    tags: ["forms", "color", "validation"],
    keywords: ["color picker", "palette", "alpha", "opacity", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="color-picker-palette">
        <h2>Approved palette with custom entry</h2>
        <p>The default swatches use Rowan's forest, sand, ink, and danger primitive colors. Assign a custom palette through the palette property when a workflow has its own approved brand or status colors.</p>
        <div class="demo-row">
          <rowan-color-picker
            id="docs-color-picker"
            name="projectColor"
            label="Project color"
            description="Choose an approved swatch or tune a custom color."
            value="#24543c80"
          ></rowan-color-picker>
        </div>
        <pre id="color-picker-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="color-picker-contract">
        <h2>Value and event contract</h2>
        <p>value reflects as lowercase #rrggbb for opaque colors or #rrggbbaa when opacity is below 100%. palette remains property-only, and rowan-change fires only after user interaction.</p>
        ${codeBlock(COLOR_PICKER_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupColorPickerDemo,
  },
  {
    id: "rating",
    group: "Components",
    title: "Rowan Rating",
    summary:
      "Form-associated whole-star rating with a clearable state and complete keyboard selection.",
    tags: ["forms", "rating", "validation"],
    keywords: ["rating", "stars", "required", "keyboard", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="rating-control">
        <h2>Whole-star selection</h2>
        <p>Use the default one-to-five scale for quick reviews. An unset value remains available until the field is marked required.</p>
        <div class="demo-row">
          <rowan-rating
            id="docs-rating"
            name="serviceQuality"
            label="Service quality"
            description="Choose a rating or clear the current value."
            value="3"
          ></rowan-rating>
        </div>
        <pre id="rating-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="rating-contract">
        <h2>Value and event contract</h2>
        <p>value reflects an integer within min, max, and step, or an empty value for no rating. Arrow keys, Home, and End select ratings; the clear control restores the no-rating state. rowan-change fires only after user interaction.</p>
        ${codeBlock(RATING_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupRatingDemo,
  },
  {
    id: "rich-text-editor",
    group: "Components",
    title: "Rowan Rich Text Editor",
    summary:
      "Constrained, form-associated authoring for operational guidance with safe document data and native editing behavior.",
    tags: ["forms", "authoring", "content", "validation"],
    keywords: ["rich text", "editor", "runbook", "paste", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="rich-text-editor-control">
        <h2>Constrained operational guidance</h2>
        <p>Rich mode supports paragraphs, ordered and unordered lists, and bold, italic, or underline marks. The value is a property-only document object, while browser selection and undo remain native to the editable surface.</p>
        <div class="demo-row">
          <rowan-rich-text-editor
            id="docs-rich-text-editor"
            name="incidentGuidance"
            label="Incident response guidance"
            description="Record the steps an operator should take."
            placeholder="Describe the response steps"
          ></rowan-rich-text-editor>
        </div>
        <pre id="rich-text-editor-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="rich-text-editor-boundary">
        <h2>Storage and sanitization boundary</h2>
        <p>The component never accepts HTML as a value. It emits a normalized block-and-run document object, and rich clipboard data is inserted as plain text. Form submission serializes that document as JSON; applications own persistence, authorization, collaboration, and any rendering outside the component.</p>
        ${codeBlock(RICH_TEXT_EDITOR_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupRichTextEditorDemo,
  },
  {
    id: "trend-chart",
    group: "Components",
    title: "Rowan Trend Chart",
    summary:
      "Compact, accessible multi-series trend comparison with keyboard points and an equivalent data table.",
    tags: ["data display", "trends", "keyboard", "svg"],
    keywords: ["trend chart", "line chart", "metrics", "table summary", "rowan-point-activate"],
    content: () => `
      <section class="doc-section" data-doc-section id="trend-chart-comparison">
        <h2>Operational trend comparison</h2>
        <p>Compare incoming and resolved incidents across the operational week. Every visual value is also available in the data table below the chart.</p>
        <div class="demo-row">
          <rowan-trend-chart
            id="docs-trend-chart"
            label="On-call workload"
            description="Incoming and resolved incidents by day."
            interactive
          ></rowan-trend-chart>
        </div>
        <pre id="trend-chart-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="trend-chart-contract">
        <h2>Accessible data contract</h2>
        <p>series, labels, config, and valueFormatter are property-only. A null value is shown as a no-data gap: it breaks the line, has no interactive point, and appears as No data in the table. Interactive points are keyboard-focusable; Arrow keys move between points, and Enter or Space emits rowan-point-activate. The component has no charting runtime dependency and no motion-dependent information.</p>
        ${codeBlock(TREND_CHART_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupTrendChartDemo,
  },
  {
    id: "maplibre-map",
    group: "Integrations",
    title: "MapLibre Map",
    summary:
      "Optional, provider-aware map integration with application-owned styles, visible attribution, and accessible record alternatives.",
    tags: ["maplibre", "maps", "coordinates", "accessibility"],
    keywords: [
      "maplibre",
      "openfreemap",
      "map",
      "coordinates",
      "location list",
      "location table",
      "rowan-location-activate",
    ],
    content: () => `
      <section class="doc-section" data-doc-section id="maplibre-map-coverage">
        <h2>Dispatch coverage</h2>
        <p>This live example uses OpenFreeMap's public Liberty style as application-owned configuration. The optional MapLibre package retains the same location records in keyboard-operable list and table alternatives.</p>
        <div class="docs-maplibre-demo">
          <rowan-maplibre-map
            id="docs-maplibre-map"
            label="OpenFreeMap dispatch coverage"
            description="Scheduled field work by coordinate."
          ></rowan-maplibre-map>
        </div>
        <pre id="maplibre-map-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="maplibre-map-boundary">
        <h2>Provider and fallback boundary</h2>
        <p>Install <code>@rowan-ui/maplibre</code> and <code>maplibre-gl</code> only where map rendering is needed. Applications supply the style, permitted tile source, attribution, cost and privacy policy. Rowan stores no provider credential and performs no geocoding or address lookup. Without an available provider, the location list and table remain usable.</p>
        ${codeBlock(MAPLIBRE_MAP_SNIPPET, "html")}
      </section>

      <section class="doc-section" data-doc-section id="maplibre-map-scale">
        <h2>Scale and motion</h2>
        <p>The element preserves marker identity across routine updates and moves the camera only after an explicit location activation. It is intended for modest sets of individually actionable locations, not thousands of DOM markers or high-frequency feeds. For dense spatial data, use a MapLibre GeoJSON source/layer integration and retain an equivalent accessible record view.</p>
      </section>
    `,
    afterRender: setupMapLibreMapDemo,
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
    id: "slider",
    group: "Components",
    title: "Rowan Slider",
    summary:
      "Form-associated numeric slider with keyboard operation, property-only formatting, and ordered dual-handle ranges.",
    tags: ["forms", "numeric", "range", "validation"],
    keywords: ["slider", "range", "keyboard", "FACE", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="slider-values">
        <h2>Single values and formatted output</h2>
        <p>Use the value property for a numeric control. A formatter stays property-only, so application code can localize display text without serializing functions into markup.</p>
        <div class="demo-row">
          <rowan-slider id="docs-capacity-slider" label="Capacity" min="0" max="100" step="5" value="65"></rowan-slider>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="slider-range">
        <h2>Ordered ranges</h2>
        <p>Range mode keeps endpoints ordered, submits separate start and end values, and exposes a keyboard-operable native range control for each handle.</p>
        <div class="demo-row">
          <rowan-slider id="docs-budget-slider" label="Monthly budget" name="budget" range min="0" max="500" step="25" start="100" end="300"></rowan-slider>
        </div>
        ${codeBlock(RANGE_SLIDER_SNIPPET, "html")}
      </section>

      <section class="doc-section" data-doc-section id="slider-contract">
        <h2>Behavior contract</h2>
        <p>rowan-slider emits rowan-change for user-originated input only. Parent value assignments remain silent and form association stays synchronized in single and range modes.</p>
        ${codeBlock(SLIDER_SNIPPET, "html")}
      </section>
    `,
    afterRender: () => {
      const capacity = document.querySelector("#docs-capacity-slider");
      const budget = document.querySelector("#docs-budget-slider");
      if (capacity) capacity.formatValue = (value) => String(value) + "% capacity";
      if (budget) budget.formatValue = ({ start, end }) => "$" + start + " - $" + end;
    },
  },
  {
    id: "form-field",
    group: "Components",
    title: "Rowan Form Field",
    summary:
      "Accessible label and support-text composition around native, custom, and grouped form controls.",
    tags: ["forms", "accessibility", "labels", "validation"],
    keywords: ["form field", "label", "hint", "description", "error", "aria"],
    content: () => `
      <section class="doc-section" data-doc-section id="form-field-composition">
        <h2>Control composition</h2>
        <p>Place a Rowan control or native control in the default slot. Rowan adds label and support references while retaining any references the application has already supplied.</p>
        <form class="docs-form-stack">
          <rowan-form-field label="Workspace name" hint="Used in workspace URLs." description="Choose a concise, recognizable name.">
            <rowan-text-field name="workspace" placeholder="northstar"></rowan-text-field>
          </rowan-form-field>
          <rowan-form-field label="Launch notification" hint="Sent only to workspace owners." required>
            <rowan-checkbox name="launch-notice">Email the owner when the workspace launches</rowan-checkbox>
          </rowan-form-field>
        </form>
      </section>

      <section class="doc-section" data-doc-section id="form-field-contract">
        <h2>Behavior contract</h2>
        <p>Slots replace the label, hint, description, or error attributes where richer content is needed. Use for to associate a visible field wrapper with an external control.</p>
        ${codeBlock(FORM_FIELD_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "form-layout",
    group: "Components",
    title: "Rowan Form Layout",
    summary:
      "Responsive field grid with direct-child spans and coordinated top or start-aligned labels.",
    tags: ["forms", "layout", "responsive", "labels"],
    keywords: ["form layout", "grid", "span", "label alignment", "responsive"],
    content: () => `
      <section class="doc-section" data-doc-section id="form-layout-grid">
        <h2>Dense operational forms</h2>
        <p>Use direct-child span values for fields that need the full row. At narrower container widths the layout resolves to one column without changing the form markup.</p>
        <rowan-form-layout columns="2" label-position="start" label-align="end" label-width="8rem">
          <rowan-form-field label="Project name" hint="Shown in workspace navigation.">
            <rowan-text-field name="project" value="Northstar"></rowan-text-field>
          </rowan-form-field>
          <rowan-form-field label="Owner email" hint="Receives project notices.">
            <rowan-text-field name="owner" type="email" value="owner@example.com"></rowan-text-field>
          </rowan-form-field>
          <rowan-form-field label="Monthly budget" hint="Set an operating threshold." span="2">
            <rowan-slider id="docs-layout-slider" name="budget" min="0" max="500" step="25" value="250"></rowan-slider>
          </rowan-form-field>
        </rowan-form-layout>
      </section>

      <section class="doc-section" data-doc-section id="form-layout-contract">
        <h2>Behavior contract</h2>
        <p>The layout is visual only: field controls retain their own values, validation, form association, and user events.</p>
        ${codeBlock(FORM_LAYOUT_SNIPPET, "html")}
      </section>
    `,
    afterRender: () => {
      const slider = document.querySelector("#docs-layout-slider");
      if (slider) slider.formatValue = (value) => "$" + value;
    },
  },
  {
    id: "listbox",
    group: "Components",
    title: "Rowan Listbox",
    summary:
      "Form-associated single- or multi-selection list control with slotted options and roving keyboard focus.",
    tags: ["forms", "selection", "keyboard", "FACE"],
    keywords: ["listbox", "option", "selected", "multiple", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="listbox-selection">
        <h2>Slotted selection</h2>
        <p>Compose rowan-option children for a native custom-element list. In multiple mode, selected values stay property-only while the form receives one entry per selected value.</p>
        <div class="docs-selection-control">
          <rowan-listbox id="docs-listbox-demo" label="Teams" selection="multiple">
            <rowan-option value="design" selected>Design</rowan-option>
            <rowan-option value="engineering">Engineering</rowan-option>
            <rowan-option value="operations" selected>Operations</rowan-option>
          </rowan-listbox>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="listbox-contract">
        <h2>Keyboard and form contract</h2>
        <p>Arrow keys move the single tab stop between available options. Space and Enter update selection, while parent assignments remain silent.</p>
        ${codeBlock(LISTBOX_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "option",
    group: "Components",
    title: "Rowan Option",
    summary:
      "Selectable listbox child with reflected value, selected, disabled, and label state plus prefix and suffix slots.",
    tags: ["forms", "selection", "listbox"],
    keywords: ["option", "listbox", "selected", "disabled", "value"],
    content: () => `
      <section class="doc-section" data-doc-section id="option-composition">
        <h2>Listbox item composition</h2>
        <p>Use rowan-option inside rowan-listbox. The label attribute supplies a text fallback, while default, prefix, and suffix slots support richer option content.</p>
        <div class="docs-selection-control">
          <rowan-listbox label="Teams">
            <rowan-option value="design" selected>Design</rowan-option>
            <rowan-option value="engineering" label="Engineering"></rowan-option>
          </rowan-listbox>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="option-contract">
        <h2>Selection ownership</h2>
        <p>The surrounding listbox owns roving focus and selection changes. Options preserve their standalone reflected state when moved out of a listbox.</p>
        ${codeBlock('<rowan-option value="engineering" label="Engineering"></rowan-option>', "html")}
      </section>
    `,
  },
  {
    id: "multi-select-combobox",
    group: "Components",
    title: "Rowan Multi-select Combobox",
    summary:
      "Filterable form-associated multi-selection control with removable chips and property-only option data.",
    tags: ["forms", "selection", "combobox", "FACE"],
    keywords: ["multi-select", "combobox", "chips", "options", "selected", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="multi-select-combobox-selection">
        <h2>Filter and retain selections</h2>
        <p>Provide options and selected values as properties. Filtering does not discard selected values that are outside the current query, and Backspace removes the final chip when the query is empty.</p>
        <div class="docs-selection-control">
          <rowan-multi-select-combobox id="docs-multi-select-demo" label="Assigned teams" placeholder="Search teams"></rowan-multi-select-combobox>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="multi-select-combobox-contract">
        <h2>Property data and FACE values</h2>
        <p>Each selected value submits under the configured name. User changes emit one rowan-change event from the outer control, not an additional internal listbox event.</p>
        ${codeBlock(MULTI_SELECT_COMBOBOX_SNIPPET, "html")}
      </section>
    `,
    afterRender: () => {
      const control = document.querySelector("#docs-multi-select-demo");
      if (!control) return;

      control.options = [
        { value: "design", label: "Design" },
        { value: "engineering", label: "Engineering" },
        { value: "operations", label: "Operations" },
        { value: "support", label: "Support" },
      ];
      control.selected = ["design", "operations"];
    },
  },
  {
    id: "segmented-control",
    group: "Components",
    title: "Rowan Segmented Control",
    summary:
      "Compact form-associated radio-group control for mutually exclusive workspace or display modes.",
    tags: ["forms", "selection", "modes", "keyboard"],
    keywords: ["segmented control", "modes", "radio group", "options", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="segmented-control-modes">
        <h2>Mutually exclusive modes</h2>
        <p>Set the available modes through the property and bind the active mode through value. Arrow keys move and select the next enabled mode using radio-group conventions.</p>
        <div class="docs-selection-control">
          <rowan-segmented-control id="docs-segmented-control-demo" label="Project view"></rowan-segmented-control>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="segmented-control-contract">
        <h2>Scalar value contract</h2>
        <p>The selected value reflects as an attribute for declarative bindings, while the options array remains a property-only configuration surface.</p>
        ${codeBlock(SEGMENTED_CONTROL_SNIPPET, "html")}
      </section>
    `,
    afterRender: () => {
      const control = document.querySelector("#docs-segmented-control-demo");
      if (!control) return;

      control.options = [
        { value: "board", label: "Board" },
        { value: "list", label: "List" },
        { value: "timeline", label: "Timeline" },
      ];
      control.value = "board";
    },
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
        <p>rowan-dropzone applies accept to both picker and drop, then emits rowan-files-add. detail.files are matches; detail.rejected failed accept. Empty accept allows every file.</p>
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
        <p>rowan-file-upload combines rowan-dropzone and rowan-file-item, applies the same accept filter before queueing, emits normalized queue events, and supports max-files limits.</p>
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
    id: "carousel",
    group: "Components",
    title: "Rowan Carousel",
    summary:
      "A controlled, slot-based sequence for bounded related content with explicit navigation and no autoplay.",
    tags: ["navigation", "slots", "keyboard", "events"],
    keywords: ["carousel", "panels", "active index", "previous", "next", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="carousel-overview">
        <h2>Bounded panel navigation</h2>
        <p>Place each panel directly in the default slot. Rowan keeps one panel available at a time, retains the active zero-based index, and leaves progression entirely under user or application control.</p>
        <div class="docs-carousel-demo">
          <rowan-carousel id="docs-carousel-demo" label="Release readiness highlights" active-index="1">
            <article class="docs-carousel-panel" data-tone="ready">
              <p class="docs-carousel-eyebrow">Release readiness</p>
              <h3>Deploy with a clear rollback path</h3>
              <p>The operations checklist is complete, with the previous build retained for a controlled rollback.</p>
              <rowan-badge tone="success">Ready to deploy</rowan-badge>
            </article>
            <article class="docs-carousel-panel" data-tone="attention">
              <p class="docs-carousel-eyebrow">Service coverage</p>
              <h3>Two handoffs still need review</h3>
              <p>Confirm the weekend support schedule before the release window opens for the regional team.</p>
              <rowan-badge tone="warning">Attention needed</rowan-badge>
            </article>
            <article class="docs-carousel-panel" data-tone="scheduled">
              <p class="docs-carousel-eyebrow">Customer communication</p>
              <h3>Status update is scheduled</h3>
              <p>The customer notice will publish with the maintenance time and a plain-language impact summary.</p>
              <rowan-badge tone="info">Scheduled</rowan-badge>
            </article>
          </rowan-carousel>
        </div>
        <pre id="carousel-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="carousel-contract">
        <h2>Controlled behavior</h2>
        <p>Set activeIndex or call goTo, previous, and next from application code without emitting an event. User controls and viewport Arrow, Page, Home, and End keys emit rowan-change with only activeIndex and previousIndex. The component never advances automatically.</p>
        ${codeBlock(CAROUSEL_SNIPPET, "html")}
      </section>

      <section class="doc-section" data-doc-section id="carousel-accessibility">
        <h2>Keyboard and motion</h2>
        <p>Previous and next controls remain keyboard-operable, the viewport supports directional and boundary keys, and the visible position is announced as panels change. Panel entry motion is disabled when reduced motion is requested.</p>
      </section>
    `,
    afterRender: setupCarouselDemo,
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
    id: "app-layout",
    group: "Components",
    title: "Rowan App Layout",
    summary:
      "Responsive application shell that composes a header, primary navigation, and focused workspace content.",
    tags: ["layout", "navigation", "responsive"],
    keywords: ["app layout", "application shell", "navigation open", "workspace", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="app-layout-overview">
        <h2>Application composition</h2>
        <p>Place header and navigation content in their named slots, then use the default slot for main workspace content. At compact widths, the built-in navigation control opens an accessible off-canvas panel.</p>
        <div class="docs-app-layout-frame">
          <rowan-app-layout id="docs-app-layout-demo" class="docs-app-layout-demo">
            <div slot="header" class="docs-app-layout-header">
              <strong>Northstar</strong>
              <rowan-button size="sm">New project</rowan-button>
            </div>
            <rowan-side-nav slot="navigation" label="Northstar navigation" value="overview">
              <rowan-side-nav-item value="overview">Overview</rowan-side-nav-item>
              <rowan-side-nav-item value="activity">Activity</rowan-side-nav-item>
              <rowan-side-nav-item value="members">Members</rowan-side-nav-item>
              <rowan-side-nav-item value="settings">Settings</rowan-side-nav-item>
            </rowan-side-nav>
            <section class="docs-app-layout-content">
              <p class="docs-app-layout-eyebrow">Project workspace</p>
              <h3>Delivery health</h3>
              <p>Use the default slot for durable workspace views without coupling their state to the shell.</p>
            </section>
          </rowan-app-layout>
        </div>
        <pre id="app-layout-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="app-layout-contract">
        <h2>Responsive navigation state</h2>
        <p>navigation-open reflects the shell state for declarative control. Parent assignments remain silent; user use of the compact toggle, backdrop, or Escape emits rowan-change.</p>
        ${codeBlock(APP_LAYOUT_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupAppLayoutDemo,
  },
  {
    id: "split-pane",
    group: "Components",
    title: "Rowan Split Pane",
    summary:
      "Keyboard-operable two-pane workspace layout with constrained, snapping separator positions.",
    tags: ["layout", "keyboard", "resizable"],
    keywords: ["split pane", "resizable", "separator", "snap points", "rowan-resize"],
    content: () => `
      <section class="doc-section" data-doc-section id="split-pane-overview">
        <h2>Constrained workspace panes</h2>
        <p>Use start and end slots for independently scrolling workspace regions. Drag the separator, or focus it and use Arrow keys, Home, and End to adjust the start-pane percentage.</p>
        <div class="docs-split-pane">
          <rowan-split-pane id="docs-split-pane-demo" position="34" min="20" max="80">
            <aside slot="start" class="docs-split-pane-start">
              <strong>Project navigation</strong>
              <span>Resize handles stay available to keyboard users.</span>
            </aside>
            <section slot="end" class="docs-split-pane-end">
              <strong>Workspace</strong>
              <span>Content remains composed rather than owned by the pane.</span>
            </section>
          </rowan-split-pane>
        </div>
        <pre id="split-pane-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="split-pane-contract">
        <h2>Position and snap points</h2>
        <p>position, min, max, and step are reflected numeric APIs. snapPoints is property-only, so structured layout values never serialize into markup. User resizing emits rowan-resize; parent-set position remains silent.</p>
        ${codeBlock(SPLIT_PANE_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupSplitPaneDemo,
  },
  {
    id: "side-nav",
    group: "Components",
    title: "Rowan Side Navigation",
    summary:
      "Application navigation with optional labeled sections, empty-value none-selected, and cancelable in-app href.",
    tags: ["navigation", "keyboard", "selection"],
    keywords: ["side nav", "navigation", "roving focus", "active", "rowan-change"],
    content: () => `
      <section class="doc-section" data-doc-section id="side-nav-overview">
        <h2>Application navigation</h2>
        <p>Compose rowan-side-nav-item children, optionally wrapped in rowan-side-nav-section. The parent keeps one value. An empty value clears selection. Arrow keys move the sole tab stop between enabled items; Enter or Space activates the focused item.</p>
        <div class="docs-side-nav-demo">
          <rowan-side-nav id="docs-side-nav-demo" label="Project navigation" value="overview">
            <rowan-side-nav-item value="overview">Overview</rowan-side-nav-item>
            <rowan-side-nav-item value="activity">Activity</rowan-side-nav-item>
            <rowan-side-nav-item value="members">Members</rowan-side-nav-item>
            <rowan-side-nav-item value="settings" disabled>Settings</rowan-side-nav-item>
          </rowan-side-nav>
        </div>
        <pre id="side-nav-events" class="table-events"></pre>
      </section>

      <section class="doc-section" data-doc-section id="side-nav-contract">
        <h2>Controlled active value</h2>
        <p>Set value from application state to update the active item without an event. User activation emits one composed rowan-change. For SPA routing, omit href or preventDefault on rowan-change when href is set.</p>
        ${codeBlock(SIDE_NAV_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupSideNavDemo,
  },
  {
    id: "side-nav-item",
    group: "Components",
    title: "Rowan Side Navigation Item",
    summary:
      "Composable navigation destination with link semantics, active-state styling, and prefix or suffix slots.",
    tags: ["navigation", "link", "composition"],
    keywords: ["side nav item", "navigation item", "active", "href", "prefix", "suffix"],
    content: () => `
      <section class="doc-section" data-doc-section id="side-nav-item-overview">
        <h2>Destination content</h2>
        <p>Use href for full navigation, or omit it and route from the parent rowan-change for SPA destinations. Items receive roving focus when they belong to a rowan-side-nav, including inside a section.</p>
        <div class="docs-side-nav-item-demo">
          <rowan-side-nav-item value="overview" href="#side-nav-item-contract" active>
            <span slot="prefix" class="docs-side-nav-item-mark" aria-hidden="true"></span>
            Overview
            <span slot="suffix" class="docs-side-nav-item-meta">Current</span>
          </rowan-side-nav-item>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="side-nav-item-contract">
        <h2>Link and state contract</h2>
        <p>active reflects the current destination and maps to an internal aria-current page marker. disabled items are removed from the tab order and skipped by the side navigation controller.</p>
        ${codeBlock(SIDE_NAV_ITEM_SNIPPET, "html")}
      </section>
    `,
  },
  {
    id: "side-nav-section",
    group: "Components",
    title: "Rowan Side Navigation Section",
    summary: "Labeled group of destinations inside a single rowan-side-nav.",
    tags: ["navigation", "composition"],
    keywords: ["side nav section", "group", "navigation"],
    content: () => `
      <section class="doc-section" data-doc-section id="side-nav-section-overview">
        <h2>Labeled groups</h2>
        <p>Wrap rowan-side-nav-item children in rowan-side-nav-section. The parent nav still has one value and one keyboard sequence.</p>
      </section>
    `,
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
        <p>Changing max-visible reconciles the visible stack immediately while preserving the order of queued notifications.</p>
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
    id: "virtual-list",
    group: "Components",
    title: "Rowan Virtual List",
    summary:
      "Keyed, property-driven collection rendering that mounts a measured window for large item sets.",
    tags: ["collections", "performance", "ResizeObserver"],
    keywords: ["virtual list", "large collections", "items", "item key", "render item"],
    content: () => `
      <section class="doc-section" data-doc-section id="virtual-list-window">
        <h2>Measured item window</h2>
        <p>Pass item data, stable keys, and a renderer as properties. Only the visible rows and a small overscan buffer are mounted while native ResizeObserver measurements refine variable row heights.</p>
        <div class="docs-virtual-list">
          <rowan-virtual-list id="docs-virtual-list-demo" item-size="44" overscan="4"></rowan-virtual-list>
        </div>
        <div class="demo-row">
          <rowan-button id="docs-virtual-list-jump" size="sm" variant="secondary">Jump to member 251</rowan-button>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="virtual-list-contract">
        <h2>Property data contract</h2>
        <p>items, itemKey, and renderItem are property-only APIs. Use item-size as the estimate before the list measures visible content, and use scrollToIndex when application flow needs to reveal a record.</p>
        ${codeBlock(VIRTUAL_LIST_SNIPPET, "html")}
      </section>
    `,
    afterRender: setupVirtualListDemo,
  },
  {
    id: "table",
    group: "Components",
    title: "Rowan Table",
    summary:
      "The table supports config-driven rendering, typed cells, sorting, selection, pagination, and virtualized large collections.",
    tags: ["config", "selection", "events", "virtualization", "custom cells"],
    keywords: [
      "table",
      "rows",
      "columns",
      "selection",
      "sort",
      "pagination",
      "virtualized",
      "custom cells",
      "rowan-cell-bind",
    ],
    content: () => `
      <section class="doc-section" data-doc-section id="table-config">
        <h2>Config-first API</h2>
        <p>Use config mode for reusable data views. Keep row ownership in the consumer and listen for table events.</p>
        ${codeBlock(TABLE_SNIPPET)}
      </section>

      <section class="doc-section" data-doc-section id="table-updates">
        <h2>Configuration updates</h2>
        <p>Assigning config replaces the complete table model and resets omitted settings. Assign rows, columns, selected, sort, or page directly when only that part should change. Out-of-range page indexes normalize to the last available page, while selection remains available across page changes.</p>
        ${codeBlock(TABLE_UPDATE_SNIPPET)}
        <p>In local development, Rowan warns about missing or duplicate column IDs, unsupported cell types, and invalid or duplicate row IDs. Invalid columns are omitted, unsupported cells render as text, and duplicate row IDs use a full render.</p>
      </section>

      <section class="doc-section" data-doc-section id="table-custom-cells">
        <h2>Custom cells and metadata</h2>
        <p>Use headerCell.tooltip for a header description, cell.title for a cell description, and cell.indeterminate for checkbox state. Custom render callbacks return text or a Node. Slot templates emit rowan-cell-bind once for each newly cloned cell so application code can hydrate the clone with its row context.</p>
        ${codeBlock(TABLE_CUSTOM_CELL_SNIPPET)}
      </section>

      <section class="doc-section" data-doc-section id="table-virtualized">
        <h2>Large collection mode</h2>
        <p>Set virtualized for a bounded, measured body viewport. Sorting, selection, row activation, and cell events retain the existing table contract because mounted rows remain semantic table rows.</p>
        <div class="table-shell">
          <rowan-table id="docs-virtual-table-demo" caption="500 member records"></rowan-table>
        </div>
        ${codeBlock(TABLE_VIRTUALIZED_SNIPPET)}
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
    afterRender: () => {
      setupTableDemo();
      setupVirtualTableDemo();
    },
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

function getComponentNavigationLabel(page) {
  return page.title.replace(/^Rowan\s+/, "");
}

const NAV_SECTIONS = [
  {
    id: "introduction",
    label: "Introduction",
    defaultOpen: true,
    items: [
      { pageId: "getting-started", label: "What is Rowan?" },
      { pageId: "react", label: "React" },
      { pageId: "theming", label: "Theming" },
      { pageId: "tokens", label: "Tokens" },
      { pageId: "formatting", label: "Locale Formatting" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    defaultOpen: true,
    items: [
      { pageId: "icons", label: "Icons" },
      { pageId: "maplibre-map", label: "MapLibre Map" },
    ],
  },
  {
    id: "components",
    label: "Components",
    defaultOpen: true,
    items: [
      { pageId: "all-components", label: "All Components" },
      { pageId: "components", label: "Overview" },
    ],
  },
  ...createComponentNavigationSections(
    DOC_PAGES,
    getComponentNavigationLabel,
    SUPPORTED_COMPONENT_TAG_NAMES,
  ),
  {
    id: "quality",
    label: "Quality",
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
let pendingSectionScroll = 0;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
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

function getRouteId() {
  return getRoute().pageId;
}

function getRoute() {
  return parseDocumentationRoute(window.location.hash, PAGES_BY_ID, DEFAULT_PAGE_ID);
}

function navigateTo(pageId) {
  if (!PAGES_BY_ID.has(pageId)) return;

  const nextHash = formatDocumentationRoute(pageId);
  if (window.location.hash === nextHash) {
    renderCurrentPage();
    return;
  }

  window.location.hash = nextHash;
}

function renderNavigation() {
  const activeId = getRouteId();
  navEl.replaceChildren();

  let renderedItemCount = 0;

  for (const section of NAV_SECTIONS) {
    const sectionItems = section.items
      .map((item) => {
        const page = PAGES_BY_ID.get(item.pageId);
        return page ? { ...item, page, categoryLabel: section.label } : null;
      })
      .filter(
        (entry) =>
          entry &&
          matchesDocumentationNavigationItem(entry, entry.page, entry.categoryLabel, activeFilter),
      );

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
    const nextHash = formatDocumentationRoute(getRouteId(), section.id);
    anchor.href = nextHash;
    anchor.textContent = heading.textContent;

    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      if (window.location.hash === nextHash) {
        scrollToRouteSection(getRouteId());
        return;
      }

      window.location.hash = nextHash;
    });

    tocEl.append(anchor);
  }
}

function scrollToRouteSection(pageId) {
  const route = getRoute();
  window.clearTimeout(pendingSectionScroll);
  pendingSectionScroll = 0;

  if (route.pageId !== pageId || !route.sectionId) return;

  const sectionId = route.sectionId;
  pendingSectionScroll = window.setTimeout(() => {
    pendingSectionScroll = 0;

    const currentRoute = getRoute();
    if (currentRoute.pageId !== pageId || currentRoute.sectionId !== sectionId) return;

    const section = Array.from(mainEl.querySelectorAll("section[data-doc-section]")).find(
      (candidate) => candidate.id === sectionId,
    );

    if (!section) {
      history.replaceState(null, "", formatDocumentationRoute(pageId));
      return;
    }

    section.scrollIntoView({ behavior: "auto", block: "start" });
  }, 0);
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
  scrollToRouteSection(page.id);
}

function formatEventDetail(detail) {
  try {
    return JSON.stringify(detail, null, 2);
  } catch (_error) {
    return String(detail);
  }
}

function setupColorPickerDemo() {
  const picker = mainEl.querySelector("#docs-color-picker");
  const output = mainEl.querySelector("#color-picker-events");

  if (!(picker instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  picker.palette = [
    { value: "#1d432f", label: "Forest" },
    { value: "#24543c", label: "Canopy" },
    { value: "#b4392d", label: "Signal" },
    { value: "#424945", label: "Slate" },
  ];
  output.textContent =
    "Choose a swatch or adjust the custom color to inspect rowan-change payloads.";

  picker.addEventListener("rowan-change", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-change\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });
}

function setupRatingDemo() {
  const rating = mainEl.querySelector("#docs-rating");
  const output = mainEl.querySelector("#rating-events");

  if (!(rating instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  output.textContent = "Choose a star or clear the rating to inspect rowan-change payloads.";

  rating.addEventListener("rowan-change", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-change\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });
}

function setupRichTextEditorDemo() {
  const editor = mainEl.querySelector("#docs-rich-text-editor");
  const output = mainEl.querySelector("#rich-text-editor-events");

  if (!(editor instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  editor.value = {
    blocks: [
      {
        type: "paragraph",
        children: [
          { text: "Escalation guidance: ", bold: true },
          { text: "notify the incident lead before changing service routing." },
        ],
      },
      {
        type: "unordered-list",
        items: [
          [{ text: "Open the incident record" }],
          [{ text: "Record the current customer impact", italic: true }],
          [{ text: "Page the assigned on-call team" }],
        ],
      },
    ],
  };
  output.textContent = "Edit the guidance to inspect normalized rowan-change payloads.";

  editor.addEventListener("rowan-change", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-change\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });
}

function setupTrendChartDemo() {
  const chart = mainEl.querySelector("#docs-trend-chart");
  const output = mainEl.querySelector("#trend-chart-events");

  if (!(chart instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  chart.config = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    interactive: true,
    series: [
      { id: "incoming", label: "Incoming incidents", values: [18, 24, null, 12, 15, 9] },
      { id: "resolved", label: "Resolved incidents", values: [13, 19, 20, 15, 16, 12] },
    ],
    valueFormatter: (value, context) => (context.tick ? String(value) : `${value} incidents`),
  };
  output.textContent = "Activate a point to inspect its rowan-point-activate payload.";

  chart.addEventListener("rowan-point-activate", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-point-activate\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });
}

function setupCarouselDemo() {
  const carousel = mainEl.querySelector("#docs-carousel-demo");
  const output = mainEl.querySelector("#carousel-events");
  setupWorkspaceEventLog(
    carousel,
    output,
    ["rowan-change"],
    "Use the previous or next control, or focus the panel area and use Arrow, Home, or End.",
  );
}

function setupFormattingDemo() {
  const preview = mainEl.querySelector("#formatting-preview");
  if (!(preview instanceof HTMLElement)) return;

  const examples = [
    {
      label: "Number",
      detail: "de-DE with one decimal place",
      value: formatNumber(1234567.89, {
        locale: "de-DE",
        options: { maximumFractionDigits: 1 },
      }),
    },
    {
      label: "Currency",
      detail: "de-DE with an explicit EUR code",
      value: formatCurrency(1234.56, {
        currency: "EUR",
        locale: "de-DE",
        options: { currencyDisplay: "code" },
      }),
    },
    {
      label: "Date and time",
      detail: "en-GB pinned to UTC",
      value: formatDate("2026-09-13T14:30:00Z", {
        locale: "en-GB",
        timeZone: "UTC",
        options: { dateStyle: "long", timeStyle: "short" },
      }),
    },
    {
      label: "Relative time",
      detail: "en-US day with numeric auto",
      value: formatRelativeTime(-1, { locale: "en-US", unit: "day" }),
    },
  ];

  const fragment = document.createDocumentFragment();
  for (const example of examples) {
    const item = document.createElement("article");
    item.className = "docs-format-preview-item";
    item.setAttribute("role", "listitem");

    const label = document.createElement("p");
    label.className = "docs-format-preview-label";
    label.textContent = example.label;

    const value = document.createElement("output");
    value.className = "docs-format-preview-value";
    value.textContent = example.value;

    const detail = document.createElement("p");
    detail.className = "docs-format-preview-detail";
    detail.textContent = example.detail;

    item.append(label, value, detail);
    fragment.append(item);
  }

  preview.replaceChildren(fragment);
}

function setupIconDemo() {
  const gallery = mainEl.querySelector("#docs-icons-gallery");
  const meaningful = mainEl.querySelector("#docs-meaningful-icon");

  if (gallery instanceof HTMLElement) {
    const fragment = document.createDocumentFragment();

    for (const icon of ICON_GALLERY) {
      const item = document.createElement("article");
      item.className = "docs-icon-tile";
      item.setAttribute("role", "listitem");

      const button = document.createElement("rowan-icon-button");
      button.label = icon.label;
      button.title = icon.label;
      button.append(icon.create({ size: 22 }));

      const name = document.createElement("code");
      name.textContent = icon.name;

      item.append(button, name);
      fragment.append(item);
    }

    gallery.replaceChildren(fragment);
  }

  if (meaningful instanceof HTMLElement) {
    const icon = CircleCheck({ label: "Deployment completed", size: 26 });
    const text = document.createElement("span");
    text.textContent = "Deployment completed";
    meaningful.replaceChildren(icon, text);
  }
}

function setupMapLibreMapDemo() {
  const map = mainEl.querySelector("#docs-maplibre-map");
  const output = mainEl.querySelector("#maplibre-map-events");

  if (!(map instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return;
  }

  map.mapStyle = OPEN_FREE_MAP_STYLE;
  map.attribution = OPEN_FREE_MAP_ATTRIBUTION;
  map.layers = [{ id: "scheduled", label: "Scheduled work", color: "#24543c", visible: true }];
  map.locations = [
    {
      id: "dispatch-17",
      label: "Generator inspection",
      latitude: 47.6062,
      longitude: -122.3321,
      description: "Priority inspection",
      layerId: "scheduled",
      status: "assigned",
    },
    {
      id: "dispatch-18",
      label: "Signal check",
      latitude: 47.6097,
      longitude: -122.3331,
      description: "Routine verification",
      layerId: "scheduled",
      status: "scheduled",
    },
  ];
  output.textContent =
    "Activate a marker, location-list item, or table action to inspect rowan-location-activate.";

  map.addEventListener("rowan-location-activate", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-location-activate\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });

  map.addEventListener("rowan-layer-change", (event) => {
    const stamp = new Date().toLocaleTimeString();
    const next = `[${stamp}] rowan-layer-change\n${formatEventDetail(event.detail)}\n`;
    output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
  });
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

function setupVirtualListDemo() {
  const list = mainEl.querySelector("#docs-virtual-list-demo");
  const jumpButton = mainEl.querySelector("#docs-virtual-list-jump");

  if (!(list instanceof HTMLElement)) return;

  list.items = Array.from({ length: 500 }, (_value, index) => ({
    id: `member-${index + 1}`,
    name: `Member ${index + 1}`,
    team: index % 3 === 0 ? "Operations" : index % 3 === 1 ? "Design" : "Engineering",
  }));
  list.itemKey = "id";
  list.renderItem = (item) => {
    const row = document.createElement("div");
    row.style.alignItems = "center";
    row.style.borderBottom = "1px solid var(--rowan-color-border)";
    row.style.boxSizing = "border-box";
    row.style.display = "flex";
    row.style.gap = "var(--rowan-space-3)";
    row.style.minHeight = "44px";
    row.style.padding = "var(--rowan-space-2) var(--rowan-space-3)";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const team = document.createElement("span");
    team.textContent = item.team;
    team.style.color = "var(--rowan-color-muted)";
    team.style.fontSize = "var(--rowan-font-size-sm)";

    row.append(name, team);
    return row;
  };

  if (jumpButton instanceof HTMLElement) {
    jumpButton.addEventListener("rowan-click", () => {
      list.scrollToIndex(250, { align: "center" });
    });
  }
}

function setupWorkspaceEventLog(target, output, eventTypes, message) {
  if (!(target instanceof HTMLElement) || !(output instanceof HTMLElement)) return;

  output.textContent = message;
  for (const eventType of eventTypes) {
    target.addEventListener(eventType, (event) => {
      const stamp = new Date().toLocaleTimeString();
      const next = `[${stamp}] ${eventType}\n${formatEventDetail(event.detail)}\n`;
      output.textContent = `${next}\n${output.textContent}`.slice(0, 5000);
    });
  }
}

function setupAppLayoutDemo() {
  const layout = mainEl.querySelector("#docs-app-layout-demo");
  const output = mainEl.querySelector("#app-layout-events");
  setupWorkspaceEventLog(
    layout,
    output,
    ["rowan-change"],
    "Use the compact navigation control to inspect rowan-change payloads.",
  );
}

function setupSplitPaneDemo() {
  const pane = mainEl.querySelector("#docs-split-pane-demo");
  const output = mainEl.querySelector("#split-pane-events");
  if (pane instanceof HTMLElement) pane.snapPoints = [25, 50, 75];
  setupWorkspaceEventLog(
    pane,
    output,
    ["rowan-resize"],
    "Resize the separator to inspect user-originated rowan-resize payloads.",
  );
}

function setupSideNavDemo() {
  const navigation = mainEl.querySelector("#docs-side-nav-demo");
  const output = mainEl.querySelector("#side-nav-events");
  setupWorkspaceEventLog(
    navigation,
    output,
    ["rowan-change"],
    "Activate a destination to inspect rowan-change payloads.",
  );
}

function setupConfirmDialogDemo() {
  const trigger = mainEl.querySelector("#docs-confirm-dialog-trigger");
  const dialog = mainEl.querySelector("#docs-confirm-dialog-demo");
  const output = mainEl.querySelector("#confirm-dialog-events");

  if (trigger instanceof HTMLElement && dialog instanceof HTMLElement) {
    trigger.addEventListener("rowan-click", () => dialog.show());
  }

  setupWorkspaceEventLog(
    dialog,
    output,
    ["rowan-confirm", "rowan-cancel", "rowan-close"],
    "Confirm, cancel, or dismiss the dialog to inspect its user-originated event payload.",
  );
}

function setupContextMenuDemo() {
  const menu = mainEl.querySelector("#docs-context-menu-demo");
  const output = mainEl.querySelector("#context-menu-events");

  if (menu instanceof HTMLElement) menu.refresh();
  setupWorkspaceEventLog(
    menu,
    output,
    ["rowan-change", "rowan-close"],
    "Open the menu from the trail map, then select or dismiss an action to inspect its event payload.",
  );
}

function setupVirtualTableDemo() {
  const table = mainEl.querySelector("#docs-virtual-table-demo");
  if (!(table instanceof HTMLElement)) return;

  table.config = {
    rowId: "id",
    selectable: "multiple",
    stickyHeader: true,
    virtualized: true,
    virtualItemSize: 40,
    virtualOverscan: 4,
    columns: [
      { id: "name", header: "Member", sortable: true },
      { id: "team", header: "Team", type: "badge" },
      { id: "score", header: "Readiness", type: "number", align: "end", sortable: true },
    ],
    rows: Array.from({ length: 500 }, (_value, index) => ({
      id: `member-${index + 1}`,
      name: `Member ${index + 1}`,
      team: index % 3 === 0 ? "Operations" : index % 3 === 1 ? "Design" : "Engineering",
      score: 50 + (index % 51),
    })),
  };
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
  const route = getRoute();
  const canonicalHash = formatDocumentationRoute(route.pageId, route.sectionId);
  if (window.location.hash !== canonicalHash) {
    history.replaceState(null, "", canonicalHash);
  }

  wireSearch();
  wireThemeToggle();
  wireQuickstartDialog();

  window.addEventListener("hashchange", renderCurrentPage);
  renderCurrentPage();
}

initialize();
