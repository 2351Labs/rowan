import "./table.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const SELECTABLE_OPTIONS = ["none", "single", "multiple"];
const DENSITY_OPTIONS = ["sm", "md", "lg"];
const TONE_OPTIONS = ["info", "success", "warning", "danger"];

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
  title: "Components/Table",
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
      "Double-click a table row.",
      "Focus a row and press Enter.",
      "Observe row activation payload details in Event Trace.",
    ],
    events: ["rowan-row-activate"],
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
          cell: { slot: "price-cell" },
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
