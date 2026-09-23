const COMPONENT_CATEGORY_DEFINITIONS = [
  {
    id: "actions-feedback",
    label: "Actions & Feedback",
    components: [
      "alert",
      "badge",
      "button",
      "chip",
      "empty-state",
      "icon-button",
      "link",
      "progress",
      "skeleton",
      "spinner",
      "status-indicator",
      "toast",
      "toaster",
    ],
  },
  {
    id: "forms-input",
    label: "Forms & Input",
    components: [
      "calendar",
      "checkbox",
      "color-picker",
      "combobox",
      "date-picker",
      "date-range-picker",
      "form-field",
      "form-layout",
      "listbox",
      "multi-select-combobox",
      "number-field",
      "option",
      "radio",
      "radio-group",
      "rating",
      "rich-text-editor",
      "segmented-control",
      "select",
      "slider",
      "switch",
      "text-field",
      "textarea",
      "time-picker",
      "validation-summary",
    ],
  },
  {
    id: "files-uploads",
    label: "Files & Uploads",
    components: ["dropzone", "file-item", "file-upload"],
  },
  {
    id: "overlays-menus",
    label: "Overlays & Menus",
    components: [
      "command-item",
      "command-palette",
      "confirm-dialog",
      "context-menu",
      "dialog",
      "drawer",
      "dropdown",
      "menu",
      "menu-item",
      "popover",
      "tooltip",
    ],
  },
  {
    id: "navigation-layout",
    label: "Navigation & Layout",
    components: [
      "accordion",
      "app-layout",
      "breadcrumb",
      "carousel",
      "divider",
      "pagination",
      "side-nav",
      "side-nav-item",
      "side-nav-section",
      "split-pane",
      "tab",
      "tab-panel",
      "tabs",
      "tree",
      "tree-item",
    ],
  },
  {
    id: "data-display",
    label: "Data Display",
    components: [
      "area-chart",
      "avatar",
      "bar-chart",
      "bulk-actions-bar",
      "bullet-chart",
      "card",
      "donut-chart",
      "filter-builder",
      "gauge-chart",
      "image",
      "kpi-card",
      "row-details-panel",
      "sparkline",
      "stacked-bar-chart",
      "table",
      "table-toolbar",
      "trend-chart",
      "virtual-list",
    ],
  },
  {
    id: "workflows",
    label: "Workflows",
    components: ["form-wizard", "stepper"],
  },
];

export const OTHER_COMPONENT_CATEGORY = Object.freeze({
  id: "other",
  label: "Other",
  components: Object.freeze([]),
});

export const COMPONENT_CATEGORIES = Object.freeze([
  ...COMPONENT_CATEGORY_DEFINITIONS.map((category) =>
    Object.freeze({ ...category, components: Object.freeze([...category.components]) }),
  ),
  OTHER_COMPONENT_CATEGORY,
]);

export const COMPONENT_CATEGORY_ORDER = Object.freeze(
  COMPONENT_CATEGORIES.map((category) => category.label),
);

export const STORYBOOK_ROOT_ORDER = Object.freeze([
  "Foundations",
  "Integrations",
  "Components",
  "Workflows",
]);

const categoryByComponent = new Map(
  COMPONENT_CATEGORIES.flatMap((category) =>
    category.components.map((component) => [component, category]),
  ),
);

const categoryRankByLabel = new Map(COMPONENT_CATEGORY_ORDER.map((label, index) => [label, index]));

const storybookRootRank = new Map(STORYBOOK_ROOT_ORDER.map((root, index) => [root, index]));

function compareText(left, right) {
  const normalizedLeft = String(left ?? "").toLowerCase();
  const normalizedRight = String(right ?? "").toLowerCase();

  if (normalizedLeft < normalizedRight) return -1;
  if (normalizedLeft > normalizedRight) return 1;
  return 0;
}

function getStoryPath(entry) {
  const title = Array.isArray(entry?.title) ? entry.title : String(entry?.title ?? "").split("/");

  return title.map((segment) => String(segment).trim()).filter(Boolean);
}

function getStoryKindRank(entry) {
  if (entry?.type === "docs") return 0;
  if (entry?.type === "story") return 1;
  return 2;
}

export function getComponentCategory(tagName) {
  const component = String(tagName ?? "")
    .trim()
    .replace(/^rowan-/, "");

  return categoryByComponent.get(component) || OTHER_COMPONENT_CATEGORY;
}

export function getComponentCategoryLabel(tagName) {
  return getComponentCategory(tagName).label;
}

export function createComponentNavigationSections(pages, getLabel, componentTagNames) {
  const categoryItems = new Map(COMPONENT_CATEGORIES.map((category) => [category.label, []]));
  const pageIds = new Set();

  for (const page of pages) {
    if (page?.group !== "Components") continue;

    const pageId = typeof page.id === "string" ? page.id : "";
    if (!pageId) continue;

    if (componentTagNames && !componentTagNames.has(`rowan-${pageId}`)) continue;
    if (pageIds.has(pageId)) continue;

    pageIds.add(pageId);

    const category = getComponentCategory(`rowan-${pageId}`);
    const label = String(getLabel(page) ?? pageId).trim() || pageId;
    categoryItems.get(category.label).push({ pageId, label });
  }

  return COMPONENT_CATEGORIES.map((category) => ({
    id: `components-${category.id}`,
    label: category.label,
    defaultOpen: false,
    items: categoryItems
      .get(category.label)
      .sort((left, right) => compareText(left.label, right.label)),
  })).filter((section) => section.items.length > 0);
}

export function matchesDocumentationNavigationItem(item, page, categoryLabel, query) {
  const normalizedQuery = String(query ?? "")
    .trim()
    .toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [
    item?.label,
    categoryLabel,
    page?.title,
    page?.group,
    page?.summary,
    ...(page?.tags || []),
    ...(page?.keywords || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export function compareStorybookEntries(left, right) {
  const leftPath = getStoryPath(left);
  const rightPath = getStoryPath(right);
  const leftRootRank = storybookRootRank.get(leftPath[0]) ?? STORYBOOK_ROOT_ORDER.length;
  const rightRootRank = storybookRootRank.get(rightPath[0]) ?? STORYBOOK_ROOT_ORDER.length;

  if (leftRootRank !== rightRootRank) return leftRootRank - rightRootRank;

  if (leftPath[0] === "Components" && rightPath[0] === "Components") {
    const leftCategoryRank =
      categoryRankByLabel.get(leftPath[1]) ?? COMPONENT_CATEGORY_ORDER.length;
    const rightCategoryRank =
      categoryRankByLabel.get(rightPath[1]) ?? COMPONENT_CATEGORY_ORDER.length;

    if (leftCategoryRank !== rightCategoryRank) return leftCategoryRank - rightCategoryRank;
  }

  const titleOrder = compareText(leftPath.join("/"), rightPath.join("/"));
  if (titleOrder !== 0) return titleOrder;

  const kindOrder = getStoryKindRank(left) - getStoryKindRank(right);
  if (kindOrder !== 0) return kindOrder;

  const nameOrder = compareText(left?.name, right?.name);
  if (nameOrder !== 0) return nameOrder;

  return compareText(left?.id, right?.id);
}
