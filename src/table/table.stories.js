import "./table.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const SELECTABLE_OPTIONS = ["none", "single", "multiple"];
const DENSITY_OPTIONS = ["sm", "md", "lg"];
const TONE_OPTIONS = ["info", "success", "warning", "danger"];

const TABLE_KNOB_ARG_TYPES = {
  selectable: {
    control: "inline-radio",
    options: SELECTABLE_OPTIONS,
    description: "Selection mode.",
  },
  density: {
    control: "inline-radio",
    options: DENSITY_OPTIONS,
    description: "Vertical spacing profile.",
  },
};

const EXACT_COLUMNS = [
  {
    id: "name",
    header: "Name",
    type: "link",
    sortable: true,
    cell: {
      href: (_value, row) => `/users/${row.id}`,
      label: (value) => value,
    },
  },
  {
    id: "role",
    header: "Role",
    type: "badge",
    cell: {
      tone: (value) => (value === "Admin" ? "warning" : "info"),
    },
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
];

const EXACT_DEFAULT_ROWS = [
  { id: "1", name: "Ada", role: "Admin", active: true, quota: 72 },
  { id: "2", name: "Alan", role: "Editor", active: false, quota: 18 },
];

const SLOT_DEFAULT_ROWS = [
  { id: "1", name: "Trail Mix", price: "$10", status: "Live" },
  { id: "2", name: "Camp Mug", price: "$25", status: "Draft" },
];

const PAGINATION_DEFAULT_ROWS = [
  { id: "1", name: "Ada", score: 11, joined: "2026-01-04" },
  { id: "2", name: "Alan", score: 19, joined: "2026-03-11" },
  { id: "3", name: "Grace", score: 7, joined: "2026-02-22" },
  { id: "4", name: "Linus", score: 24, joined: "2026-04-17" },
  { id: "5", name: "Ken", score: 15, joined: "2026-05-02" },
];

const COLUMNS_SANDBOX_DEFAULT_COLUMNS = [
  { id: "owner", header: "Owner", type: "avatar" },
  { id: "name", header: "Name", type: "text", sortable: true },
  { id: "team", header: "Team", type: "chip" },
  { id: "score", header: "Score", type: "number", align: "end", sortable: true },
  { id: "active", header: "Active", type: "switch", align: "center" },
];

const COLUMNS_SANDBOX_DEFAULT_ROWS = [
  { id: "1", owner: "Ada", name: "Ada", team: "Platform", score: 87, active: true },
  { id: "2", owner: "Alan", name: "Alan", team: "Research", score: 74, active: false },
  { id: "3", owner: "Grace", name: "Grace", team: "Ops", score: 92, active: true },
];

const FUNCTION_COMPARE_SOURCE_COLUMNS = [
  {
    id: "name",
    header: "Name",
    type: "link",
    sortable: true,
    cell: {
      href: (_value, row) => `/profiles/${row.id}`,
      label: (value, row) => `${value} (${row.id})`,
    },
  },
  {
    id: "role",
    header: "Role",
    type: "badge",
    cell: {
      tone: (value) => (value === "Admin" ? "warning" : "info"),
    },
  },
  { id: "score", header: "Score", type: "number", sortable: true },
  { id: "active", header: "Active", type: "switch", align: "center" },
];

const FUNCTION_COMPARE_CONTROLS_COLUMNS = [
  {
    id: "name",
    header: "Name",
    type: "link",
    sortable: true,
    cell: {
      href: "/profiles",
      label: "Open",
    },
  },
  {
    id: "role",
    header: "Role",
    type: "badge",
    cell: {
      tone: "warning",
    },
  },
  { id: "score", header: "Score", type: "number", sortable: true },
  { id: "active", header: "Active", type: "switch", align: "center" },
];

const FUNCTION_COMPARE_ROWS = [
  { id: "1", name: "Ada", role: "Admin", score: 98, active: true },
  { id: "2", name: "Alan", role: "Editor", score: 77, active: false },
  { id: "3", name: "Grace", role: "Editor", score: 89, active: true },
];

const VIRTUALIZED_ROWS = Array.from({ length: 500 }, (_value, index) => ({
  id: `member-${index + 1}`,
  name: `Member ${index + 1}`,
  team: index % 3 === 0 ? "Operations" : index % 3 === 1 ? "Design" : "Engineering",
  score: 50 + (index % 51),
}));

const SLOT_TEMPLATE_DEFAULT =
  '<span class="price-pill" style="font-weight: 600; color: var(--rowan-color-accent)">Price</span>';

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function cloneColumns(columns) {
  return columns.map((column) => ({
    ...column,
    cell:
      column && typeof column.cell === "object" && !Array.isArray(column.cell)
        ? { ...column.cell }
        : column?.cell,
    headerCell:
      column && typeof column.headerCell === "object" && !Array.isArray(column.headerCell)
        ? { ...column.headerCell }
        : column?.headerCell,
  }));
}

function normalizeRows(rows, fallbackRows) {
  const source = Array.isArray(rows) ? rows : fallbackRows;
  return source
    .filter((row) => row && typeof row === "object" && !Array.isArray(row))
    .map((row) => ({ ...row }));
}

function normalizeColumns(columns, fallbackColumns) {
  const source = Array.isArray(columns) ? columns : fallbackColumns;

  return source
    .filter((column) => column && typeof column === "object" && !Array.isArray(column))
    .map((column, index) => {
      const id =
        typeof column.id === "string" && column.id.trim().length > 0
          ? column.id
          : `column-${index + 1}`;
      const header =
        typeof column.header === "string" && column.header.trim().length > 0
          ? column.header
          : `Column ${index + 1}`;

      return {
        ...column,
        id,
        header,
        cell:
          column && typeof column.cell === "object" && !Array.isArray(column.cell)
            ? { ...column.cell }
            : column.cell,
        headerCell:
          column && typeof column.headerCell === "object" && !Array.isArray(column.headerCell)
            ? { ...column.headerCell }
            : column.headerCell,
      };
    });
}

function normalizeNumber(value, fallback, minimum = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(minimum, Math.trunc(parsed));
}

function normalizeOption(value, options, fallback) {
  return options.includes(value) ? value : fallback;
}

function normalizeTemplateMarkup(value, fallback) {
  if (typeof value !== "string") return fallback;
  return value.trim().length > 0 ? value : fallback;
}

function toCode(value) {
  return JSON.stringify(
    value,
    (_key, current) => {
      if (typeof current === "function") {
        return current.toString();
      }

      return current;
    },
    2,
  );
}

function createPanel(title, content) {
  const details = document.createElement("details");
  details.open = true;
  details.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
  details.style.borderRadius = "8px";
  details.style.background = "var(--rowan-color-bg, #ffffff)";

  const summary = document.createElement("summary");
  summary.textContent = title;
  summary.style.cursor = "pointer";
  summary.style.fontWeight = "600";
  summary.style.padding = "0.5rem 0.75rem";
  summary.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";
  summary.style.fontSize = "0.85rem";

  const pre = document.createElement("pre");
  pre.textContent = content;
  pre.style.margin = "0";
  pre.style.padding = "0.75rem";
  pre.style.overflow = "auto";
  pre.style.fontSize = "0.75rem";
  pre.style.lineHeight = "1.45";
  pre.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  pre.style.background = "#f6f8f5";
  pre.style.borderTop = "1px solid var(--rowan-color-border, #ced3ca)";

  details.append(summary, pre);
  return details;
}

function createNoticeCallout(notice) {
  const callout = document.createElement("p");
  callout.textContent = notice;
  callout.style.margin = "0 0 1rem 0";
  callout.style.padding = "0.6rem 0.75rem";
  callout.style.border = "1px solid #e5cc8e";
  callout.style.borderRadius = "8px";
  callout.style.background = "#fff7e8";
  callout.style.color = "#6f4c00";
  callout.style.fontSize = "0.82rem";
  callout.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";
  return callout;
}

function createStoryLayout({
  title,
  description,
  config,
  notice = "",
  templateMarkup = "",
  beforeAttach,
}) {
  const table = document.createElement("rowan-table");

  if (typeof beforeAttach === "function") {
    beforeAttach(table);
  }

  table.config = config;

  const wrapper = document.createElement("section");
  wrapper.style.display = "grid";
  wrapper.style.gap = "1rem";
  wrapper.style.alignItems = "start";
  wrapper.style.gridTemplateColumns = window.matchMedia("(max-width: 1100px)").matches
    ? "1fr"
    : "minmax(0, 1.8fr) minmax(19rem, 1fr)";

  const stage = document.createElement("div");
  stage.style.padding = "1rem";
  stage.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
  stage.style.borderRadius = "10px";
  stage.style.background = "var(--rowan-color-bg, #ffffff)";

  const heading = document.createElement("p");
  heading.textContent = title;
  heading.style.margin = "0 0 0.375rem 0";
  heading.style.fontWeight = "700";
  heading.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  const copy = document.createElement("p");
  copy.textContent = description;
  copy.style.margin = "0 0 1rem 0";
  copy.style.color = "var(--rowan-color-muted, #5f6d62)";
  copy.style.fontSize = "0.9rem";
  copy.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  stage.append(heading, copy);

  if (notice) {
    stage.append(createNoticeCallout(notice));
  }

  stage.append(table);

  const inspector = document.createElement("aside");
  inspector.style.display = "grid";
  inspector.style.gap = "0.75rem";
  inspector.style.alignContent = "start";

  const { rows = [], ...configWithoutRows } = config;

  inspector.append(
    createPanel("Config", toCode(configWithoutRows)),
    createPanel("Rows", toCode(rows)),
  );

  if (templateMarkup) {
    inspector.append(createPanel("Cell Template Markup", templateMarkup));
  }

  wrapper.append(stage, inspector);
  return wrapper;
}

function createComparisonCard(title, description, table) {
  const card = document.createElement("article");
  card.style.padding = "0.85rem";
  card.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
  card.style.borderRadius = "8px";
  card.style.background = "var(--rowan-color-bg, #ffffff)";

  const heading = document.createElement("p");
  heading.textContent = title;
  heading.style.margin = "0";
  heading.style.fontWeight = "700";
  heading.style.fontSize = "0.84rem";
  heading.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  const copy = document.createElement("p");
  copy.textContent = description;
  copy.style.margin = "0.4rem 0 0.85rem 0";
  copy.style.color = "var(--rowan-color-muted, #5f6d62)";
  copy.style.fontSize = "0.8rem";
  copy.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  card.append(heading, copy, table);
  return card;
}

function createFunctionComparisonLayout({
  title,
  description,
  notice,
  sourceConfig,
  controlsConfig,
}) {
  const sourceTable = document.createElement("rowan-table");
  sourceTable.config = sourceConfig;

  const controlsTable = document.createElement("rowan-table");
  controlsTable.config = controlsConfig;

  const wrapper = document.createElement("section");
  wrapper.style.display = "grid";
  wrapper.style.gap = "1rem";
  wrapper.style.alignItems = "start";
  wrapper.style.gridTemplateColumns = window.matchMedia("(max-width: 1240px)").matches
    ? "1fr"
    : "minmax(0, 1.95fr) minmax(19rem, 1fr)";

  const stage = document.createElement("div");
  stage.style.padding = "1rem";
  stage.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
  stage.style.borderRadius = "10px";
  stage.style.background = "var(--rowan-color-bg, #ffffff)";

  const heading = document.createElement("p");
  heading.textContent = title;
  heading.style.margin = "0 0 0.375rem 0";
  heading.style.fontWeight = "700";
  heading.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  const copy = document.createElement("p");
  copy.textContent = description;
  copy.style.margin = "0 0 1rem 0";
  copy.style.color = "var(--rowan-color-muted, #5f6d62)";
  copy.style.fontSize = "0.9rem";
  copy.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  const compareGrid = document.createElement("div");
  compareGrid.style.display = "grid";
  compareGrid.style.gap = "0.8rem";
  compareGrid.style.gridTemplateColumns = window.matchMedia("(max-width: 980px)").matches
    ? "1fr"
    : "1fr 1fr";

  compareGrid.append(
    createComparisonCard(
      "Source-defined callbacks",
      "Uses real function callbacks declared in this file.",
      sourceTable,
    ),
    createComparisonCard(
      "Controls-edited columns",
      "Uses the object you edit in Controls.",
      controlsTable,
    ),
  );

  stage.append(heading, copy, createNoticeCallout(notice), compareGrid);

  const inspector = document.createElement("aside");
  inspector.style.display = "grid";
  inspector.style.gap = "0.75rem";
  inspector.style.alignContent = "start";

  const { rows: _sourceRows, ...sourceWithoutRows } = sourceConfig;
  const { rows, ...controlsWithoutRows } = controlsConfig;

  inspector.append(
    createPanel("Source Config", toCode(sourceWithoutRows)),
    createPanel("Controls Config", toCode(controlsWithoutRows)),
    createPanel("Rows", toCode(rows || [])),
  );

  wrapper.append(stage, inspector);
  return wrapper;
}

export default {
  title: "Components/Data Display/Table",
  tags: ["autodocs"],
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export const ExactConfig = {
  parameters: createEventScriptParameters({
    steps: [
      "Click the Name header to trigger sorting.",
      "Toggle the first selection checkbox.",
      "Toggle the Active switch and click the Edit icon button.",
    ],
    events: ["rowan-sort", "rowan-select", "rowan-cell-change", "rowan-cell-action"],
  }),
  args: {
    caption: "Team roster",
    selectable: "multiple",
    stickyHeader: true,
    density: "md",
    rows: cloneRows(EXACT_DEFAULT_ROWS),
  },
  argTypes: {
    caption: { control: "text", description: "Caption shown above the table." },
    selectable: {
      control: "inline-radio",
      options: SELECTABLE_OPTIONS,
      description: "Selection mode.",
    },
    stickyHeader: { control: "boolean", description: "Pin table header while scrolling." },
    density: {
      control: "inline-radio",
      options: DENSITY_OPTIONS,
      description: "Vertical spacing profile.",
    },
    rows: {
      control: "object",
      description: "Editable row data for this story.",
    },
  },
  render: (args) => {
    const rows = normalizeRows(args.rows, EXACT_DEFAULT_ROWS);
    const config = {
      caption: args.caption,
      selectable: normalizeOption(args.selectable, SELECTABLE_OPTIONS, "multiple"),
      stickyHeader: Boolean(args.stickyHeader),
      density: normalizeOption(args.density, DENSITY_OPTIONS, "md"),
      rowId: "id",
      columns: EXACT_COLUMNS,
      rows,
    };

    return createStoryLayout({
      title: "Exact config mode",
      description:
        "Shows the Step 5 config-only setup, including sortable and selectable behavior.",
      config,
    });
  },
};

export const CustomSlotCell = {
  parameters: createEventScriptParameters({
    steps: [
      "Inspect the custom-cell binding payload after template clones are rendered.",
      "Double-click a table row.",
      "Focus a row and press Enter.",
      "Observe row activation payload details in Event Trace.",
    ],
    events: ["rowan-cell-bind", "rowan-row-activate"],
  }),
  args: {
    liveTone: "success",
    draftTone: "warning",
    templateMarkup: SLOT_TEMPLATE_DEFAULT,
    rows: cloneRows(SLOT_DEFAULT_ROWS),
  },
  argTypes: {
    liveTone: {
      control: "select",
      options: TONE_OPTIONS,
      description: "Tone used when status is Live.",
    },
    draftTone: {
      control: "select",
      options: TONE_OPTIONS,
      description: "Tone used for any non-Live status.",
    },
    templateMarkup: {
      control: "text",
      description: "HTML markup cloned for each custom slot cell.",
    },
    rows: {
      control: "object",
      description: "Editable row data for custom cell rendering.",
    },
  },
  render: (args) => {
    const rows = normalizeRows(args.rows, SLOT_DEFAULT_ROWS);
    const liveTone = normalizeOption(args.liveTone, TONE_OPTIONS, "success");
    const draftTone = normalizeOption(args.draftTone, TONE_OPTIONS, "warning");
    const templateMarkup = normalizeTemplateMarkup(args.templateMarkup, SLOT_TEMPLATE_DEFAULT);

    const config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Name", type: "text" },
        {
          id: "price",
          header: "Price",
          type: "custom",
          headerCell: { tooltip: "Catalog price" },
          cell: { slot: "price-cell", title: (value) => `Catalog price: ${value}` },
        },
        {
          id: "status",
          header: "Status",
          type: "chip",
          cell: { tone: (value) => (value === "Live" ? liveTone : draftTone) },
        },
      ],
      rows,
    };

    return createStoryLayout({
      title: "Custom slot cells",
      description:
        "Template slot configuration and source data are visible in the inspector panel.",
      config,
      templateMarkup,
      beforeAttach: (table) => {
        const priceTemplate = document.createElement("template");
        priceTemplate.slot = "price-cell";
        priceTemplate.innerHTML = templateMarkup;
        table.append(priceTemplate);
      },
    });
  },
};

export const Pagination = {
  parameters: createEventScriptParameters({
    steps: [
      "Click Next page.",
      "Click Previous page.",
      "Confirm page index and size changes in Event Trace.",
    ],
    events: ["rowan-page-change"],
  }),
  args: {
    caption: "Leaderboard",
    pageIndex: 0,
    pageSize: 2,
    pageTotal: 5,
    rows: cloneRows(PAGINATION_DEFAULT_ROWS),
  },
  argTypes: {
    caption: { control: "text", description: "Caption shown above the table." },
    pageIndex: { control: { type: "number", min: 0, step: 1 }, description: "Current page index." },
    pageSize: { control: { type: "number", min: 1, step: 1 }, description: "Rows per page." },
    pageTotal: {
      control: { type: "number", min: 0, step: 1 },
      description: "Total rows available.",
    },
    rows: {
      control: "object",
      description: "Editable row data for paged rendering.",
    },
  },
  render: (args) => {
    const rows = normalizeRows(args.rows, PAGINATION_DEFAULT_ROWS);
    const size = normalizeNumber(args.pageSize, 2, 1);
    const total = normalizeNumber(args.pageTotal, rows.length, 0);
    const maxIndex = Math.max(0, Math.ceil(Math.max(total, 1) / size) - 1);
    const index = Math.min(normalizeNumber(args.pageIndex, 0, 0), maxIndex);

    const config = {
      caption: args.caption,
      rowId: "id",
      page: { index, size, total },
      columns: [
        { id: "name", header: "Name", type: "text" },
        { id: "score", header: "Score", type: "number", sortable: true },
        { id: "joined", header: "Joined", type: "date" },
      ],
      rows,
    };

    return createStoryLayout({
      title: "Paged rows",
      description: "Pagination input and row data are shown beside the rendered table.",
      config,
    });
  },
};

export const ColumnsSandbox = {
  parameters: createEventScriptParameters({
    steps: [
      "Click the Score header to sort.",
      "Toggle an Active switch cell.",
      "Edit rows or columns in Controls and repeat interactions.",
    ],
    events: ["rowan-sort", "rowan-cell-change"],
  }),
  args: {
    caption: "Columns sandbox",
    selectable: "none",
    stickyHeader: false,
    density: "md",
    columns: cloneColumns(COLUMNS_SANDBOX_DEFAULT_COLUMNS),
    rows: cloneRows(COLUMNS_SANDBOX_DEFAULT_ROWS),
  },
  argTypes: {
    caption: { control: "text", description: "Caption shown above the table." },
    selectable: {
      control: "inline-radio",
      options: SELECTABLE_OPTIONS,
      description: "Selection mode.",
    },
    stickyHeader: { control: "boolean", description: "Pin table header while scrolling." },
    density: {
      control: "inline-radio",
      options: DENSITY_OPTIONS,
      description: "Vertical spacing profile.",
    },
    columns: {
      control: "object",
      description: "Full editable columns array.",
    },
    rows: {
      control: "object",
      description: "Full editable rows array.",
    },
  },
  render: (args) => {
    const config = {
      caption: args.caption,
      selectable: normalizeOption(args.selectable, SELECTABLE_OPTIONS, "none"),
      stickyHeader: Boolean(args.stickyHeader),
      density: normalizeOption(args.density, DENSITY_OPTIONS, "md"),
      rowId: "id",
      columns: normalizeColumns(args.columns, COLUMNS_SANDBOX_DEFAULT_COLUMNS),
      rows: normalizeRows(args.rows, COLUMNS_SANDBOX_DEFAULT_ROWS),
    };

    return createStoryLayout({
      title: "Columns object sandbox",
      description: "Edit the full columns and rows objects live using Storybook Controls.",
      notice:
        "Controls serialize functions as strings. Function-based fields such as cell.href callbacks will not execute when edited from Controls.",
      config,
    });
  },
};

export const FunctionColumnsComparison = {
  parameters: createEventScriptParameters({
    steps: [
      "Click Name in either table to sort.",
      "Click a name link and then toggle Active.",
      "Edit the right-side columns object and compare emitted events and behavior.",
    ],
    events: ["rowan-sort", "rowan-cell-action", "rowan-cell-change"],
  }),
  args: {
    caption: "Function comparison",
    selectable: "single",
    stickyHeader: false,
    density: "md",
    columns: cloneColumns(FUNCTION_COMPARE_CONTROLS_COLUMNS),
    rows: cloneRows(FUNCTION_COMPARE_ROWS),
  },
  argTypes: {
    caption: { control: "text", description: "Caption for both tables." },
    selectable: {
      control: "inline-radio",
      options: SELECTABLE_OPTIONS,
      description: "Selection mode for both tables.",
    },
    stickyHeader: { control: "boolean", description: "Pin table headers while scrolling." },
    density: {
      control: "inline-radio",
      options: DENSITY_OPTIONS,
      description: "Vertical spacing profile for both tables.",
    },
    columns: {
      control: "object",
      description: "Editable columns object used by the right-hand table.",
    },
    rows: {
      control: "object",
      description: "Editable rows object used by both tables.",
    },
  },
  render: (args) => {
    const rows = normalizeRows(args.rows, FUNCTION_COMPARE_ROWS);
    const selectable = normalizeOption(args.selectable, SELECTABLE_OPTIONS, "single");
    const density = normalizeOption(args.density, DENSITY_OPTIONS, "md");
    const stickyHeader = Boolean(args.stickyHeader);

    const sourceConfig = {
      caption: `${args.caption} - source`,
      rowId: "id",
      selectable,
      stickyHeader,
      density,
      columns: FUNCTION_COMPARE_SOURCE_COLUMNS,
      rows,
    };

    const controlsConfig = {
      caption: `${args.caption} - controls`,
      rowId: "id",
      selectable,
      stickyHeader,
      density,
      columns: normalizeColumns(args.columns, FUNCTION_COMPARE_CONTROLS_COLUMNS),
      rows,
    };

    return createFunctionComparisonLayout({
      title: "Function-capable columns vs Controls object",
      description:
        "Left table uses callback functions from source code. Right table uses the live object from Storybook Controls.",
      notice:
        "Function fields edited in Controls are serialized as strings, so callback-like text does not execute as JavaScript.",
      sourceConfig,
      controlsConfig,
    });
  },
};

export const VirtualizedBody = {
  parameters: createEventScriptParameters({
    steps: [
      "Scroll through the bounded table viewport.",
      "Select a visible member row.",
      "Click a sortable header to retain the same table API.",
    ],
    events: ["rowan-select", "rowan-sort"],
  }),
  args: {
    virtualItemSize: 40,
    virtualOverscan: 4,
  },
  argTypes: {
    virtualItemSize: {
      control: { type: "number", min: 1, step: 1 },
      description: "Estimated row height before a visible row is measured.",
    },
    virtualOverscan: {
      control: { type: "number", min: 0, step: 1 },
      description: "Extra mounted rows before and after the visible window.",
    },
  },
  render: (args) => {
    const table = document.createElement("rowan-table");
    table.config = {
      caption: "500 member records",
      rowId: "id",
      selectable: "multiple",
      stickyHeader: true,
      virtualized: true,
      virtualItemSize: normalizeNumber(args.virtualItemSize, 40, 1),
      virtualOverscan: normalizeNumber(args.virtualOverscan, 4, 0),
      columns: [
        { id: "name", header: "Member", sortable: true },
        { id: "team", header: "Team", type: "badge" },
        { id: "score", header: "Readiness", type: "number", align: "end", sortable: true },
      ],
      rows: cloneRows(VIRTUALIZED_ROWS),
    };
    return table;
  },
};

export const GroupedRows = {
  args: {
    selectable: "multiple",
    density: "md",
  },
  argTypes: TABLE_KNOB_ARG_TYPES,
  render: ({ selectable, density }) => {
    const table = document.createElement("rowan-table");
    table.config = {
      caption: "Members grouped by team",
      rowId: "id",
      selectable,
      density,
      groupBy: { id: "team", subtotals: true },
      columns: [
        { id: "name", header: "Member", sticky: "start", minWidth: "10rem" },
        { id: "team", header: "Team" },
        { id: "score", header: "Score", type: "number", align: "end" },
      ],
      rows: [
        { id: "1", name: "Ada Lovelace", team: "Ops", score: 12 },
        { id: "2", name: "Alan Turing", team: "Platform", score: 9 },
        { id: "3", name: "Grace Hopper", team: "Ops", score: 7 },
        { id: "4", name: "Katherine Johnson", team: "Platform", score: 15 },
      ],
    };
    return table;
  },
};

export const InteractiveCells = {
  parameters: createEventScriptParameters({
    steps: [
      "Double-click a name cell. The row activates.",
      "Double-click Edit. That is an interactive cell: rowan-cell-action fires, not rowan-row-activate.",
    ],
    events: ["rowan-row-activate", "rowan-cell-action"],
  }),
  args: {
    selectable: "none",
    density: "md",
  },
  argTypes: TABLE_KNOB_ARG_TYPES,
  render: ({ selectable, density }) => {
    const table = document.createElement("rowan-table");
    table.config = {
      caption: "Interactive cells do not activate the row",
      rowId: "id",
      selectable,
      density,
      columns: [
        { id: "name", header: "Member", sortable: true },
        {
          id: "edit",
          header: "",
          type: "icon-button",
          cell: { label: "Edit", icon: "edit" },
          width: "3rem",
        },
      ],
      rows: [
        { id: "1", name: "Ada Lovelace" },
        { id: "2", name: "Alan Turing" },
      ],
    };
    return table;
  },
};

export const BulletCells = {
  args: {
    selectable: "none",
    density: "md",
  },
  argTypes: TABLE_KNOB_ARG_TYPES,
  render: ({ selectable, density }) => {
    const ranges = [
      { from: 0, to: 50, label: "Low", tone: "danger" },
      { from: 50, to: 80, label: "Fair", tone: "warning" },
      { from: 80, to: 100, label: "Good", tone: "success" },
    ];
    const table = document.createElement("rowan-table");
    table.config = {
      caption: "Yard fill versus target",
      rowId: "id",
      selectable,
      density,
      columns: [
        { id: "name", header: "Yard", sticky: "start" },
        { id: "fill", header: "Fill", type: "bullet" },
      ],
      rows: [
        {
          id: "north",
          name: "North",
          fill: { value: 82, target: 90, ranges },
        },
        {
          id: "south",
          name: "South",
          fill: { value: 64, target: 90, ranges },
        },
        {
          id: "east",
          name: "East",
          fill: { value: 91, target: 90, ranges },
        },
      ],
    };
    return table;
  },
};

export const PinnedColumns = {
  args: {
    selectable: "multiple",
    density: "md",
  },
  argTypes: TABLE_KNOB_ARG_TYPES,
  render: ({ selectable, density }) => {
    const table = document.createElement("rowan-table");
    table.style.maxInlineSize = "36rem";
    table.config = {
      caption: "Pinned name and status while the middle columns scroll",
      rowId: "id",
      selectable,
      density,
      stickyHeader: true,
      columns: [
        { id: "name", header: "Member", sticky: "start", minWidth: "10rem", sortable: true },
        { id: "team", header: "Team", minWidth: "8rem" },
        { id: "site", header: "Site", minWidth: "8rem" },
        { id: "shift", header: "Shift", minWidth: "8rem" },
        { id: "status", header: "Status", sticky: "end", minWidth: "7rem", type: "badge" },
      ],
      rows: [
        {
          id: "1",
          name: "Ada Lovelace",
          team: "Ops",
          site: "East",
          shift: "Days",
          status: "Watch",
        },
        {
          id: "2",
          name: "Alan Turing",
          team: "Platform",
          site: "West",
          shift: "Nights",
          status: "Ready",
        },
        {
          id: "3",
          name: "Grace Hopper",
          team: "Ops",
          site: "North",
          shift: "Days",
          status: "Alert",
        },
      ],
    };
    return table;
  },
};

export const ColumnResizing = {
  render: () => {
    return `
      <div style="padding: 1rem;">
        <rowan-table
          resizable-columns
          density="md"
        ></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("rowan-table");
        table.config = {
          columns: [
            { id: "name", header: "Name", type: "text", width: "150px" },
            { id: "role", header: "Role", type: "badge", minWidth: "100px" },
            { id: "email", header: "Email", type: "text" },
            { id: "joined", header: "Joined", type: "date" },
          ],
          rows: [
            { id: "1", name: "Ada Lovelace", role: "Admin", email: "ada@example.com", joined: "2024-01-15" },
            { id: "2", name: "Alan Turing", role: "Editor", email: "alan@example.com", joined: "2024-02-20" },
            { id: "3", name: "Grace Hopper", role: "Viewer", email: "grace@example.com", joined: "2024-03-10" },
          ],
        };

        table.addEventListener("rowan-column-resize", (event) => {
          console.log("Column resized:", event.detail);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Columns can be resized by dragging the resize handles on header edges. Double-click a handle to auto-fit. Use keyboard (Arrow keys) on focused handle to resize incrementally. Shift+Arrow for larger steps.",
      },
    },
  },
};

export const ColumnReordering = {
  render: () => {
    return `
      <div style="padding: 1rem;">
        <rowan-table
          reorderable-columns
          density="md"
        ></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("rowan-table");
        table.config = {
          columns: [
            { id: "name", header: "Name", type: "text" },
            { id: "role", header: "Role", type: "badge" },
            { id: "email", header: "Email", type: "text" },
            { id: "joined", header: "Joined", type: "date" },
          ],
          rows: [
            { id: "1", name: "Ada Lovelace", role: "Admin", email: "ada@example.com", joined: "2024-01-15" },
            { id: "2", name: "Alan Turing", role: "Editor", email: "alan@example.com", joined: "2024-02-20" },
            { id: "3", name: "Grace Hopper", role: "Viewer", email: "grace@example.com", joined: "2024-03-10" },
          ],
        };

        table.addEventListener("rowan-column-reorder", (event) => {
          console.log("Column reordered:", event.detail);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Columns can be reordered by dragging headers. Keyboard users can use Alt+Arrow Left/Right to move columns. Frozen/pinned columns cannot be reordered.",
      },
    },
  },
};

export const ResizableAndReorderable = {
  render: () => {
    return `
      <div style="padding: 1rem;">
        <rowan-table
          resizable-columns
          reorderable-columns
          density="md"
        ></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("rowan-table");
        table.config = {
          columns: [
            { id: "name", header: "Name", type: "text", width: "150px" },
            { id: "role", header: "Role", type: "badge" },
            { id: "email", header: "Email", type: "text" },
            { id: "active", header: "Active", type: "switch", align: "center" },
            { id: "quota", header: "Quota", type: "progress" },
          ],
          rows: [
            { id: "1", name: "Ada", role: "Admin", email: "ada@example.com", active: true, quota: 85 },
            { id: "2", name: "Alan", role: "Editor", email: "alan@example.com", active: false, quota: 45 },
            { id: "3", name: "Grace", role: "Viewer", email: "grace@example.com", active: true, quota: 92 },
          ],
        };

        table.addEventListener("rowan-column-resize", (event) => {
          console.log("Column resized:", event.detail);
        });

        table.addEventListener("rowan-column-reorder", (event) => {
          console.log("Column reordered:", event.detail);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Both resizing and reordering can be enabled simultaneously. This provides maximum flexibility for users to customize their table view.",
      },
    },
  },
};

export const InlineEditing = {
  render: () => {
    return `
      <div style="padding: 1rem;">
        <rowan-table density="md"></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("rowan-table");
        table.config = {
          columns: [
            { id: "name", header: "Name", editable: true },
            { id: "age", header: "Age", type: "number", editable: true, editor: { type: "number", min: 0, max: 120 } },
            { id: "email", header: "Email", editable: true },
            { id: "role", header: "Role", type: "badge", editable: false }
          ],
          rows: [
            { id: "1", name: "Alice Johnson", age: 28, email: "alice@example.com", role: "Engineer" },
            { id: "2", name: "Bob Smith", age: 34, email: "bob@example.com", role: "Designer" },
            { id: "3", name: "Carol White", age: 42, email: "carol@example.com", role: "Manager" },
            { id: "4", name: "David Brown", age: 31, email: "david@example.com", role: "Developer" }
          ]
        };

        table.addEventListener("rowan-edit-start", (e) => {
          console.log("Edit started:", e.detail);
        });

        table.addEventListener("rowan-edit-commit", (e) => {
          console.log("Edit committed:", e.detail);
        });

        table.addEventListener("rowan-edit-cancel", (e) => {
          console.log("Edit cancelled:", e.detail);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Editable columns can be edited inline. Click a cell, press Enter or F2 to start editing. Press Escape to cancel, Enter to commit and move down, Tab to commit and move right. Events allow server persistence and rollback on failure.",
      },
    },
  },
};

export const InlineEditingPhase2 = {
  render: () => {
    return `
      <div style="padding: 1rem;">
        <rowan-table density="md"></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("rowan-table");
        table.config = {
          columns: [
            { id: "name", header: "Name", editable: true },
            { id: "age", header: "Age", type: "number", editable: true, editor: { type: "number", min: 0, max: 120 } },
            { 
              id: "status", 
              header: "Status", 
              editable: true,
              editor: {
                type: "select",
                options: [
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "pending", label: "Pending" }
                ]
              }
            },
            { id: "dob", header: "Date of Birth", editable: true, editor: { type: "date" } },
            { id: "verified", header: "Verified", editable: true, editor: { type: "checkbox" } },
            { 
              id: "custom", 
              header: "Custom", 
              editable: true,
              editor: {
                type: "custom",
                render: (context) => {
                  const input = document.createElement("input");
                  input.value = context.value || "";
                  input.style.border = "2px solid blue";
                  input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                      context.commit();
                    } else if (e.key === "Escape") {
                      context.cancel();
                    }
                  });
                  return input;
                }
              }
            }
          ],
          rows: [
            { id: "1", name: "Alice Johnson", age: 28, status: "active", dob: "1995-03-15", verified: true, custom: "Custom 1" },
            { id: "2", name: "Bob Smith", age: 34, status: "inactive", dob: "1989-07-22", verified: false, custom: "Custom 2" },
            { id: "3", name: "Carol White", age: 42, status: "pending", dob: "1981-11-08", verified: true, custom: "Custom 3" }
          ]
        };

        table.addEventListener("rowan-edit-start", (e) => {
          console.log("Edit started:", e.detail);
        });

        table.addEventListener("rowan-edit-commit", (e) => {
          console.log("Edit committed:", e.detail);
        });

        table.addEventListener("rowan-edit-cancel", (e) => {
          console.log("Edit canceled:", e.detail);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Phase 2 adds select, date, checkbox, and custom editor types. Each editor is lazily loaded on first use.",
      },
    },
  },
};

export const RowEditMode = {
  render: () => {
    return `
      <div style="padding: 1rem;">
        <rowan-table density="md" edit-mode="row"></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("rowan-table");
        table.config = {
          columns: [
            { id: "name", header: "Name", editable: true },
            { id: "email", header: "Email", editable: true },
            { id: "age", header: "Age", type: "number", editable: true, editor: { type: "number", min: 0, max: 120 } },
            { id: "role", header: "Role", type: "badge", editable: false }
          ],
          rows: [
            { id: "1", name: "Alice Johnson", email: "alice@example.com", age: 28, role: "Engineer" },
            { id: "2", name: "Bob Smith", email: "bob@example.com", age: 34, role: "Designer" },
            { id: "3", name: "Carol White", email: "carol@example.com", age: 42, role: "Manager" }
          ]
        };

        table.addEventListener("rowan-row-edit-commit", (e) => {
          console.log("Row edit committed:", e.detail);
        });

        table.addEventListener("rowan-row-edit-cancel", (e) => {
          console.log("Row edit canceled:", e.detail);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Row edit mode (edit-mode=\"row\") allows editing all editable cells in a row at once. Press Enter/F2 to start editing, Tab to navigate between cells, Enter to commit all changes, and Escape to cancel.",
      },
    },
  },
};

export const InlineEditingValidation = {
  render: () => {
    return `
      <div style="padding: 1rem;">
        <rowan-table id="validation-cell" density="md" caption="Cell validation"></rowan-table>
        <rowan-table id="validation-row" density="md" edit-mode="row" caption="Row validation"></rowan-table>
      </div>
      <script type="module">
        const cellTable = document.querySelector("#validation-cell");
        cellTable.config = {
          columns: [
            { id: "name", header: "Name", editable: true, required: true },
            {
              id: "email",
              header: "Email",
              editable: true,
              validate: (value) => (String(value).includes("@") ? true : "Enter an email address"),
            },
          ],
          rows: [{ id: "1", name: "Alice Johnson", email: "alice@example.com" }],
        };
        cellTable.addEventListener("rowan-edit-validate", (event) => {
          console.log("rowan-edit-validate", event.detail);
        });
        cellTable.addEventListener("rowan-edit-commit", (event) => {
          console.log("rowan-edit-commit", event.detail);
        });

        const rowTable = document.querySelector("#validation-row");
        rowTable.config = {
          columns: [
            { id: "name", header: "Name", editable: true, required: true },
            {
              id: "age",
              header: "Age",
              type: "number",
              editable: true,
              validate: (value) => (Number(value) >= 18 ? true : "Must be 18 or older"),
            },
          ],
          rows: [{ id: "1", name: "Alice Johnson", age: 28 }],
        };
        rowTable.addEventListener("rowan-edit-validate", (event) => {
          console.log("rowan-edit-validate", event.detail);
        });
        rowTable.addEventListener("rowan-row-edit-commit", (event) => {
          console.log("rowan-row-edit-commit", event.detail);
        });
        rowTable.addEventListener("rowan-row-edit-cancel", (event) => {
          console.log("rowan-row-edit-cancel", event.detail);
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Phase 3 validation. column.required rejects blank values. column.validate(value, row) returns true or an error message. rowan-edit-validate fires before commit and is cancelable; preventDefault keeps the editor open with aria-invalid and an aria-describedby error. Row mode (edit-mode=\"row\") does not emit rowan-row-edit-commit until every cell is valid. Escape still cancels via rowan-row-edit-cancel.",
      },
    },
  },
};

export const ServerData = {
  render: () => {
    return `
      <div style="padding: 1rem; display: grid; gap: 0.75rem;">
        <label>Filter name <input id="server-filter" type="search" value="" /></label>
        <label><input id="server-fail" type="checkbox" /> Fail the next request</label>
        <p id="server-events"></p>
        <rowan-table id="server-table" data-mode="server" density="md" caption="Directory"></rowan-table>
        <p>data-mode "client" keeps paging and sorting on local rows. data-mode "server" calls dataSource.</p>
      </div>
      <script type="module">
        const SERVER_ROWS = [
          { id: "u-1", name: "Ada Lovelace", role: "Admin", city: "London" },
          { id: "u-2", name: "Alan Turing", role: "Editor", city: "Manchester" },
          { id: "u-3", name: "Grace Hopper", role: "Admin", city: "New York" },
          { id: "u-4", name: "Katherine Johnson", role: "Viewer", city: "Hampton" },
          { id: "u-5", name: "Margaret Hamilton", role: "Editor", city: "Boston" },
          { id: "u-6", name: "Radia Perlman", role: "Viewer", city: "Portsmouth" },
          { id: "u-7", name: "Tim Berners-Lee", role: "Admin", city: "Geneva" },
          { id: "u-8", name: "Barbara Liskov", role: "Editor", city: "Los Angeles" },
          { id: "u-9", name: "Edsger Dijkstra", role: "Viewer", city: "Rotterdam" },
          { id: "u-10", name: "Donald Knuth", role: "Admin", city: "Milwaukee" },
          { id: "u-11", name: "Frances Allen", role: "Editor", city: "Peru" },
          { id: "u-12", name: "John McCarthy", role: "Viewer", city: "Boston" },
        ];
        const table = document.querySelector("#server-table");
        const events = document.querySelector("#server-events");
        const note = (text) => { events.textContent = text; };
        table.config = {
          columns: [
            { id: "name", header: "Name", sortable: true, editable: true },
            { id: "role", header: "Role", type: "badge", sortable: true },
            { id: "city", header: "City", sortable: true },
          ],
          page: { index: 0, size: 4 },
        };
        table.dataSource = {
          debounce: 200,
          async getRows({ page, pageSize, sort, filters, signal }) {
            await new Promise((resolve, reject) => {
              const timer = setTimeout(resolve, 350);
              signal.addEventListener("abort", () => {
                clearTimeout(timer);
                reject(new DOMException("Aborted", "AbortError"));
              });
            });
            if (document.querySelector("#server-fail").checked) {
              document.querySelector("#server-fail").checked = false;
              throw new Error("Directory unavailable");
            }
            let rows = SERVER_ROWS.slice();
            for (const filter of filters) {
              const needle = filter.value.trim().toLowerCase();
              if (!needle) continue;
              rows = rows.filter((row) => String(row[filter.id] ?? "").toLowerCase().includes(needle));
            }
            if (sort) {
              const direction = sort.dir === "desc" ? -1 : 1;
              rows.sort((left, right) => String(left[sort.id]).localeCompare(String(right[sort.id])) * direction);
            }
            const start = page * pageSize;
            return { rows: rows.slice(start, start + pageSize), total: rows.length };
          },
        };
        document.querySelector("#server-filter").addEventListener("input", (event) => {
          table.filters = [{ id: "name", value: event.target.value }];
        });
        table.addEventListener("rowan-data-request", (event) => note("rowan-data-request " + JSON.stringify(event.detail)));
        table.addEventListener("rowan-data-load", (event) => note("rowan-data-load " + event.detail.total));
        table.addEventListener("rowan-data-error", (event) => note("rowan-data-error " + event.detail.error.message));
        table.addEventListener("rowan-edit-commit", (event) => note("rowan-edit-commit " + event.detail.value));
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Server mode (data-mode=\"server\") loads pages from dataSource.getRows with simulated latency. Sort headers, the pager, and the debounced name filter call the source. Check \"Fail the next request\" to show the error state and Retry. rowan-data-request, rowan-data-load, and rowan-data-error are announced above the grid. Client mode (\"client\") is unchanged. Selection ids are kept across pages; select-all applies to the current page. Inline rowan-edit-commit still fires and the app persists it.",
      },
    },
  },
};

export const ClipboardAndExport = {
  render: () => {
    return `
      <div style="padding: 1rem; display: grid; gap: 0.75rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <button type="button" id="copy-rows">copyToClipboard</button>
          <button type="button" id="copy-headers">copyToClipboard includeHeaders</button>
          <button type="button" id="export-csv">exportCsv</button>
          <button type="button" id="export-page">exportCsv scope page</button>
          <button type="button" id="export-selected">exportCsv scope selected</button>
          <button type="button" id="export-xlsx">exportExcel</button>
          <button type="button" id="export-raw">exportExcel formatValues false</button>
        </div>
        <p id="export-events"></p>
        <rowan-table id="export-table" selectable="multiple" density="md" caption="Orders"></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("#export-table");
        const events = document.querySelector("#export-events");
        const note = (text) => { events.textContent = text; };
        table.config = {
          columns: [
            { id: "order", header: "Order", type: "number" },
            { id: "customer", header: "Customer" },
            { id: "note", header: "Note", format: (value) => String(value).trim() },
            { id: "total", header: "Total", type: "number", format: (value) => "$" + Number(value).toFixed(2) },
            { id: "paid", header: "Paid", type: "checkbox" },
            { id: "shipped", header: "Shipped", type: "date" },
            { id: "internal", header: "Internal", hidden: true },
          ],
          rows: [
            { id: "o-1", order: 1042, customer: "Northwind Traders", note: "Net 30", total: 1280, paid: true, shipped: "2026-03-02", internal: "skip" },
            { id: "o-2", order: 1043, customer: "Ada Lovelace", note: "Rush, dock 4", total: 640.5, paid: false, shipped: "2026-03-18", internal: "skip" },
            { id: "o-3", order: 1044, customer: "=SUM(A1)", note: "Check the formula text", total: 90, paid: true, shipped: "2026-04-01", internal: "skip" },
            { id: "o-4", order: 1045, customer: "Grace Hopper", note: "Hold", total: 2100, paid: false, shipped: "2026-04-09", internal: "skip" },
          ],
          rowId: "id",
          page: { index: 0, size: 3 },
        };
        table.selected = ["o-2", "o-4"];
        document.querySelector("#copy-rows").addEventListener("click", () => table.copyToClipboard());
        document.querySelector("#copy-headers").addEventListener("click", () => table.copyToClipboard({ includeHeaders: true, guardFormulas: true }));
        document.querySelector("#export-csv").addEventListener("click", () => table.exportCsv({ filename: "orders.csv", scope: "all", columns: ["customer", "note", "total"] }));
        document.querySelector("#export-page").addEventListener("click", () => table.exportCsv({ filename: "page.csv", scope: "page", includeHeaders: true }));
        document.querySelector("#export-selected").addEventListener("click", () => table.exportCsv({ filename: "selected.csv", scope: "selected", guardFormulas: false }));
        document.querySelector("#export-xlsx").addEventListener("click", () => table.exportExcel({ filename: "orders.xlsx", scope: "all" }));
        document.querySelector("#export-raw").addEventListener("click", () => table.exportExcel({ filename: "orders-raw.xlsx", scope: "all", formatValues: false, getRows: async () => table.rows }));
        table.addEventListener("rowan-copy", (event) => note("rowan-copy " + event.detail.scope + " " + event.detail.rows.length));
        table.addEventListener("rowan-export", (event) => note("rowan-export " + event.detail.format + " " + event.detail.filename));
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Ctrl/Cmd+C copies the selected rows, or the focused cell when nothing is selected, as TSV and an HTML table. copyToClipboard, exportCsv, and exportExcel accept includeHeaders, columns, scope (all, selected, page, or cell), formatValues, guardFormulas, filename, and getRows. Hidden columns stay out unless named. rowan-copy and rowan-export are cancelable.",
      },
    },
  },
};

export const PasteCells = {
  render: () => {
    return `
      <div style="padding: 1rem; display: grid; gap: 0.75rem;">
        <label>TSV <textarea id="paste-text" rows="4">Ada	12	Admin	true	2026-04-02
Ken	4	Editor	false	2026-05-01</textarea></label>
        <button type="button" id="paste-apply">pasteText</button>
        <p id="paste-events"></p>
        <rowan-table id="paste-table" selectable="multiple" density="md" caption="Roster"></rowan-table>
      </div>
      <script type="module">
        const table = document.querySelector("#paste-table");
        const events = document.querySelector("#paste-events");
        table.config = {
          columns: [
            { id: "name", header: "Name", editable: true },
            { id: "score", header: "Score", type: "number", editable: true, required: true },
            { id: "role", header: "Role", type: "select", editable: true, editor: { type: "select", options: [{ value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }] } },
            { id: "active", header: "Active", type: "checkbox", editable: true },
            { id: "joined", header: "Joined", type: "date", editable: true },
            { id: "note", header: "Note" },
            { id: "secret", header: "Secret", hidden: true, editable: true },
          ],
          rows: [
            { id: "p-1", name: "Grace", score: 10, role: "editor", active: false, joined: "2026-01-01", note: "keep", secret: "x" },
            { id: "p-2", name: "Alan", score: 8, role: "admin", active: true, joined: "2026-02-01", note: "keep", secret: "y" },
            { id: "p-3", name: "Radia", score: 9, role: "editor", active: false, joined: "2026-03-01", note: "keep", secret: "z" },
          ],
          rowId: "id",
          page: { index: 0, size: 2 },
        };
        const focus = () => {
          const cell = table.renderRoot.querySelector('td[data-column-id="name"]');
          cell.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        };
        document.querySelector("#paste-apply").addEventListener("click", async () => {
          focus();
          await table.pasteText(document.querySelector("#paste-text").value);
        });
        table.addEventListener("rowan-paste", (event) => {
          events.textContent = "rowan-paste " + event.detail.targets.length;
        });
        table.addEventListener("rowan-paste-result", (event) => {
          events.textContent = "rowan-paste-result applied " + event.detail.applied.length + " rejected " + event.detail.rejected.length;
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "pasteText(text) and Ctrl/Cmd+V write TSV onto the focused editable cell. Number, date, checkbox, and select columns are parsed. required and validate run, then rowan-edit-validate and rowan-edit-commit. rowan-paste can cancel or edit targets. rowan-paste-result lists applied and rejected cells. Hidden and non-editable columns are skipped. The page size is 2, so a third row is ignored. Server mode pastes only loaded rows.",
      },
    },
  },
};

export const CellEditChrome = {
  name: "Cell edit chrome",
  parameters: createEventScriptParameters({
    steps: ["Expand a team group. rowan-group-toggle reports that group."],
    events: ["rowan-group-toggle", "rowan-edit-start", "rowan-edit-commit"],
  }),
  render: () => {
    const table = document.createElement("rowan-table");
    table.locale = "en-US";
    table.captionVisuallyHidden = true;
    table.editMode = "cell";
    table.config = {
      caption: "Members grouped by team",
      rowId: "id",
      groupBy: { id: "team" },
      columns: [
        { id: "name", header: "Member", editable: true },
        { id: "team", header: "Team" },
      ],
      rows: [
        { id: "1", name: "Ada Lovelace", team: "Ops" },
        { id: "2", name: "Grace Hopper", team: "Ops" },
      ],
    };
    const toolbar = document.createElement("div");
    toolbar.slot = "toolbar";
    toolbar.textContent = "Member tools";
    const caption = document.createElement("span");
    caption.slot = "caption";
    caption.textContent = "Members grouped by team";
    const empty = document.createElement("p");
    empty.slot = "empty";
    empty.textContent = "No members match this view.";
    const footer = document.createElement("span");
    footer.slot = "footer";
    footer.textContent = "2 members";
    table.append(toolbar, caption, empty, footer);
    return table;
  },
};

export const Loading = {
  name: "Loading",
  render: () => {
    const table = document.createElement("rowan-table");
    table.loading = true;
    table.locale = "en-US";
    table.config = {
      caption: "Members",
      columns: [{ id: "name", header: "Member" }],
      rows: [],
    };
    return table;
  },
};
