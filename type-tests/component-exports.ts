import { RowanAccordion } from "@rowan-ui/core/accordion";
import { RowanAlert } from "@rowan-ui/core/alert";
import { RowanAppLayout } from "@rowan-ui/core/app-layout";
import { RowanAvatar } from "@rowan-ui/core/avatar";
import { RowanBadge } from "@rowan-ui/core/badge";
import { RowanBreadcrumb } from "@rowan-ui/core/breadcrumb";
import { RowanBulkActionsBar } from "@rowan-ui/core/bulk-actions-bar";
import { RowanButton } from "@rowan-ui/core/button";
import { RowanCalendar } from "@rowan-ui/core/calendar";
import { RowanCarousel } from "@rowan-ui/core/carousel";
import { RowanCard } from "@rowan-ui/core/card";
import { RowanCheckbox } from "@rowan-ui/core/checkbox";
import { RowanChip } from "@rowan-ui/core/chip";
import { RowanCombobox, type RowanComboboxOption } from "@rowan-ui/core/combobox";
import { RowanCommandItem } from "@rowan-ui/core/command-item";
import { RowanCommandPalette } from "@rowan-ui/core/command-palette";
import { RowanConfirmDialog } from "@rowan-ui/core/confirm-dialog";
import { RowanContextMenu } from "@rowan-ui/core/context-menu";
import { RowanDatePicker } from "@rowan-ui/core/date-picker";
import { RowanDateRangePicker } from "@rowan-ui/core/date-range-picker";
import { RowanDialog } from "@rowan-ui/core/dialog";
import { RowanDivider } from "@rowan-ui/core/divider";
import { RowanDrawer } from "@rowan-ui/core/drawer";
import { RowanDropdown } from "@rowan-ui/core/dropdown";
import { RowanDropzone } from "@rowan-ui/core/dropzone";
import { RowanEmptyState } from "@rowan-ui/core/empty-state";
import { RowanFileItem } from "@rowan-ui/core/file-item";
import { RowanFileUpload } from "@rowan-ui/core/file-upload";
import { RowanFilterBuilder } from "@rowan-ui/core/filter-builder";
import { RowanFormField } from "@rowan-ui/core/form-field";
import { RowanFormLayout } from "@rowan-ui/core/form-layout";
import { RowanFormWizard } from "@rowan-ui/core/form-wizard";
import { RowanIconButton } from "@rowan-ui/core/icon-button";
import { RowanLink } from "@rowan-ui/core/link";
import { RowanListbox } from "@rowan-ui/core/listbox";
import { RowanMenu } from "@rowan-ui/core/menu";
import { RowanMenuItem } from "@rowan-ui/core/menu-item";
import {
  RowanMultiSelectCombobox,
  type RowanMultiSelectComboboxOption,
} from "@rowan-ui/core/multi-select-combobox";
import { RowanNumberField } from "@rowan-ui/core/number-field";
import { RowanOption } from "@rowan-ui/core/option";
import { RowanPagination } from "@rowan-ui/core/pagination";
import { RowanPopover } from "@rowan-ui/core/popover";
import { RowanProgress } from "@rowan-ui/core/progress";
import { RowanRadio } from "@rowan-ui/core/radio";
import { RowanRadioGroup } from "@rowan-ui/core/radio-group";
import { RowanRating } from "@rowan-ui/core/rating";
import { RowanRichTextEditor } from "@rowan-ui/core/rich-text-editor";
import { RowanRowDetailsPanel } from "@rowan-ui/core/row-details-panel";
import { RowanSelect, type RowanSelectOption } from "@rowan-ui/core/select";
import {
  RowanSegmentedControl,
  type RowanSegmentedControlOption,
} from "@rowan-ui/core/segmented-control";
import { RowanSideNav } from "@rowan-ui/core/side-nav";
import { RowanSideNavItem } from "@rowan-ui/core/side-nav-item";
import { RowanSkeleton } from "@rowan-ui/core/skeleton";
import { RowanSlider } from "@rowan-ui/core/slider";
import { RowanSpinner } from "@rowan-ui/core/spinner";
import { RowanSplitPane } from "@rowan-ui/core/split-pane";
import { RowanStatusIndicator } from "@rowan-ui/core/status-indicator";
import { RowanStepper } from "@rowan-ui/core/stepper";
import { RowanSwitch } from "@rowan-ui/core/switch";
import { RowanTab } from "@rowan-ui/core/tab";
import { RowanTabPanel } from "@rowan-ui/core/tab-panel";
import {
  RowanTable,
  type RowanTableConfig,
  type RowanTableDensity,
  type RowanTableSelectable,
} from "@rowan-ui/core/table";
import { RowanTableToolbar } from "@rowan-ui/core/table-toolbar";
import { RowanTabs } from "@rowan-ui/core/tabs";
import { RowanTrendChart } from "@rowan-ui/core/trend-chart";
import { RowanTextField } from "@rowan-ui/core/text-field";
import { RowanTextarea } from "@rowan-ui/core/textarea";
import { RowanTimePicker } from "@rowan-ui/core/time-picker";
import { RowanToast } from "@rowan-ui/core/toast";
import {
  RowanToaster,
  type RowanToastInput,
  type RowanToasterPlacement,
} from "@rowan-ui/core/toaster";
import { RowanTooltip } from "@rowan-ui/core/tooltip";
import { RowanTree } from "@rowan-ui/core/tree";
import { RowanTreeItem } from "@rowan-ui/core/tree-item";
import { RowanValidationSummary } from "@rowan-ui/core/validation-summary";
import { RowanVirtualList } from "@rowan-ui/core/virtual-list";

const accordion: RowanAccordion = document.createElement("rowan-accordion");
const alert: RowanAlert = document.createElement("rowan-alert");
const appLayout: RowanAppLayout = document.createElement("rowan-app-layout");
const avatar: RowanAvatar = document.createElement("rowan-avatar");
const badge: RowanBadge = document.createElement("rowan-badge");
const breadcrumb: RowanBreadcrumb = document.createElement("rowan-breadcrumb");
const bulkActionsBar: RowanBulkActionsBar = document.createElement("rowan-bulk-actions-bar");
const button: RowanButton = document.createElement("rowan-button");
const calendar: RowanCalendar = document.createElement("rowan-calendar");
const carousel: RowanCarousel = document.createElement("rowan-carousel");
const card: RowanCard = document.createElement("rowan-card");
const checkbox: RowanCheckbox = document.createElement("rowan-checkbox");
const chip: RowanChip = document.createElement("rowan-chip");
const combobox: RowanCombobox = document.createElement("rowan-combobox");
const commandItem: RowanCommandItem = document.createElement("rowan-command-item");
const commandPalette: RowanCommandPalette = document.createElement("rowan-command-palette");
const confirmDialog: RowanConfirmDialog = document.createElement("rowan-confirm-dialog");
const contextMenu: RowanContextMenu = document.createElement("rowan-context-menu");
const datePicker: RowanDatePicker = document.createElement("rowan-date-picker");
const dateRangePicker: RowanDateRangePicker = document.createElement("rowan-date-range-picker");
const dialog: RowanDialog = document.createElement("rowan-dialog");
const divider: RowanDivider = document.createElement("rowan-divider");
const drawer: RowanDrawer = document.createElement("rowan-drawer");
const dropdown: RowanDropdown = document.createElement("rowan-dropdown");
const dropzone: RowanDropzone = document.createElement("rowan-dropzone");
const emptyState: RowanEmptyState = document.createElement("rowan-empty-state");
const fileItem: RowanFileItem = document.createElement("rowan-file-item");
const fileUpload: RowanFileUpload = document.createElement("rowan-file-upload");
const filterBuilder: RowanFilterBuilder = document.createElement("rowan-filter-builder");
const formField: RowanFormField = document.createElement("rowan-form-field");
const formLayout: RowanFormLayout = document.createElement("rowan-form-layout");
const formWizard: RowanFormWizard = document.createElement("rowan-form-wizard");
const iconButton: RowanIconButton = document.createElement("rowan-icon-button");
const link: RowanLink = document.createElement("rowan-link");
const listbox: RowanListbox = document.createElement("rowan-listbox");
const menu: RowanMenu = document.createElement("rowan-menu");
const menuItem: RowanMenuItem = document.createElement("rowan-menu-item");
const multiSelectCombobox: RowanMultiSelectCombobox = document.createElement(
  "rowan-multi-select-combobox",
);
const numberField: RowanNumberField = document.createElement("rowan-number-field");
const option: RowanOption = document.createElement("rowan-option");
const pagination: RowanPagination = document.createElement("rowan-pagination");
const popover: RowanPopover = document.createElement("rowan-popover");
const progress: RowanProgress = document.createElement("rowan-progress");
const radio: RowanRadio = document.createElement("rowan-radio");
const radioGroup: RowanRadioGroup = document.createElement("rowan-radio-group");
const rating: RowanRating = document.createElement("rowan-rating");
const richTextEditor: RowanRichTextEditor = document.createElement("rowan-rich-text-editor");
const rowDetailsPanel: RowanRowDetailsPanel = document.createElement("rowan-row-details-panel");
const select: RowanSelect = document.createElement("rowan-select");
const segmentedControl: RowanSegmentedControl = document.createElement("rowan-segmented-control");
const sideNav: RowanSideNav = document.createElement("rowan-side-nav");
const sideNavItem: RowanSideNavItem = document.createElement("rowan-side-nav-item");
const skeleton: RowanSkeleton = document.createElement("rowan-skeleton");
const slider: RowanSlider = document.createElement("rowan-slider");
const spinner: RowanSpinner = document.createElement("rowan-spinner");
const splitPane: RowanSplitPane = document.createElement("rowan-split-pane");
const statusIndicator: RowanStatusIndicator = document.createElement("rowan-status-indicator");
const stepper: RowanStepper = document.createElement("rowan-stepper");
const switchControl: RowanSwitch = document.createElement("rowan-switch");
const tab: RowanTab = document.createElement("rowan-tab");
const tabPanel: RowanTabPanel = document.createElement("rowan-tab-panel");
const table: RowanTable = document.createElement("rowan-table");
const tableToolbar: RowanTableToolbar = document.createElement("rowan-table-toolbar");
const tabs: RowanTabs = document.createElement("rowan-tabs");
const trendChart: RowanTrendChart = document.createElement("rowan-trend-chart");
const textField: RowanTextField = document.createElement("rowan-text-field");
const textarea: RowanTextarea = document.createElement("rowan-textarea");
const timePicker: RowanTimePicker = document.createElement("rowan-time-picker");
const toast: RowanToast = document.createElement("rowan-toast");
const toaster: RowanToaster = document.createElement("rowan-toaster");
const tooltip: RowanTooltip = document.createElement("rowan-tooltip");
const tree: RowanTree = document.createElement("rowan-tree");
const treeItem: RowanTreeItem = document.createElement("rowan-tree-item");
const validationSummary: RowanValidationSummary = document.createElement(
  "rowan-validation-summary",
);
const virtualList: RowanVirtualList = document.createElement("rowan-virtual-list");

virtualList.items = [{ id: "member-1", name: "Ada" }];
virtualList.itemKey = "id";
virtualList.itemSize = 44;
virtualList.overscan = 4;
virtualList.renderItem = (item, _index, itemEl) => {
  itemEl.textContent = String(item);
};
virtualList.itemKey = null;
virtualList.renderItem = null;

table.virtualized = true;
table.virtualItemSize = 44;
table.virtualOverscan = 4;
table.config = null;
table.config = undefined;
table.sort = null;
table.page = null;
table.density = "lg";
table.selectable = "multiple";
appLayout.navigationOpen = true;
sideNav.value = "overview";
sideNavItem.active = true;
confirmDialog.confirmVariant = "danger";
contextMenu.target = button;
statusIndicator.tone = "success";
rating.value = 4;
rating.value = "";
rating.value = null;
rating.value = undefined;
carousel.activeIndex = 1;
carousel.goTo(0);
richTextEditor.value = {
  blocks: [{ type: "paragraph", children: [{ text: "Dispatch checklist" }] }],
};
richTextEditor.mode = "plain";
trendChart.config = {
  labels: ["Mon", "Tue"],
  interactive: true,
  series: [{ id: "incidents", label: "Incidents", values: [4, 8] }],
};
trendChart.config = {
  series: [{ id: "resolved", label: "Resolved", values: [null, 6] }],
};
trendChart.config = null;
trendChart.config = undefined;

const tableConfig: RowanTableConfig = {
  density: "md",
  selectable: "single",
};
const tableDensity: RowanTableDensity = "sm";
const tableSelectable: RowanTableSelectable = "none";
const multiSelectOption: RowanMultiSelectComboboxOption = {
  value: "ada",
  label: "Ada",
};
const segmentedOption: RowanSegmentedControlOption = "weekly";
const comboboxOption: RowanComboboxOption = { value: "ada", label: "Ada" };
const selectOption: RowanSelectOption = { value: "ada", label: "Ada", disabled: false };
const toastInput: RowanToastInput = {
  message: "Changes saved.",
  tone: "success",
};
const toasterPlacement: RowanToasterPlacement = "bottom-center";
const toastId: string | null = toaster.show(toastInput);
const stringToastId: string | null = toaster.show("Changes saved.");

multiSelectCombobox.options = [multiSelectOption];
multiSelectCombobox.selected = ["ada"];
segmentedControl.options = [segmentedOption];
combobox.options = [comboboxOption];
select.options = [selectOption];

// @ts-expect-error Table density supports sm, md, and lg only.
table.density = "compact";
// @ts-expect-error Table selection supports none, single, and multiple only.
table.selectable = "all";
// @ts-expect-error Table sort direction supports asc and desc only.
table.sort = { id: "name", dir: "up" };
// @ts-expect-error Table configuration uses the documented density values.
table.config = { density: "compact" };
// @ts-expect-error Virtual List item keys are strings or key functions.
virtualList.itemKey = 1;
// @ts-expect-error Virtual List renderers are functions or null.
virtualList.renderItem = "render";
// @ts-expect-error Toaster placement uses the documented placement values.
toaster.placement = "center";
// @ts-expect-error Toast tones use the documented tone values.
toaster.show({ message: "Changes saved.", tone: "urgent" });
// @ts-expect-error Toast object inputs require a message.
toaster.show({ title: "Saved" });
// @ts-expect-error Toast identifiers are strings.
toaster.dismiss(1);
// @ts-expect-error Multi-Select options are strings or documented option records.
multiSelectCombobox.options = [42];
// @ts-expect-error Multi-Select selected values are strings.
multiSelectCombobox.selected = [42];
// @ts-expect-error Segmented Control options are strings or documented option records.
segmentedControl.options = [42];
// @ts-expect-error Combobox options are strings or documented option records.
combobox.options = [42];
// @ts-expect-error Select options are strings or documented option records.
select.options = [42];
// @ts-expect-error Alert tone uses the documented tone values.
alert.tone = "notice";
// @ts-expect-error Avatar size supports sm, md, and lg only.
avatar.size = "xl";
// @ts-expect-error Badge tone uses the documented tone values.
badge.tone = "neutral";
// @ts-expect-error Badge size supports sm, md, and lg only.
badge.size = "xl";
// @ts-expect-error Button variant uses the documented variant values.
button.variant = "outline";
// @ts-expect-error Button size supports sm, md, and lg only.
button.size = "xl";
// @ts-expect-error Button type supports button, submit, and reset only.
button.type = "menu";
// @ts-expect-error Calendar selection mode supports single and range only.
calendar.selectionMode = "multiple";
// @ts-expect-error Chip tone uses the documented tone values.
chip.tone = "neutral";
// @ts-expect-error Chip size supports sm, md, and lg only.
chip.size = "xl";
// @ts-expect-error Confirm Dialog variant supports primary and danger only.
confirmDialog.confirmVariant = "secondary";
// @ts-expect-error Divider orientation supports horizontal and vertical only.
divider.orientation = "diagonal";
// @ts-expect-error Drawer side supports start and end only.
drawer.side = "left";
// @ts-expect-error File Item status uses the documented status values.
fileItem.status = "paused";
// @ts-expect-error Icon Button variant uses the documented variant values.
iconButton.variant = "outline";
// @ts-expect-error Icon Button size supports sm, md, and lg only.
iconButton.size = "xl";
// @ts-expect-error Icon Button type supports button, submit, and reset only.
iconButton.type = "menu";
// @ts-expect-error Listbox selection supports single and multiple only.
listbox.selection = "range";
// @ts-expect-error Segmented Control size supports sm, md, and lg only.
segmentedControl.size = "xl";
// @ts-expect-error Skeleton shape supports text, rect, and circle only.
skeleton.shape = "line";
// @ts-expect-error Spinner size supports sm, md, and lg only.
spinner.size = "xl";
// @ts-expect-error Status Indicator tone uses the documented tone values.
statusIndicator.tone = "pending";
// @ts-expect-error Status Indicator size supports sm, md, and lg only.
statusIndicator.size = "xl";
// @ts-expect-error Text Field type uses the documented input types.
textField.type = "number";
// @ts-expect-error Toast tone uses the documented tone values.
toast.tone = "neutral";

const virtualListItemSize: number = virtualList.itemSize;
const tableVirtualItemSize: number = table.virtualItemSize;
const tableVirtualized: boolean = table.virtualized;
const appLayoutNavigationOpen: boolean = appLayout.navigationOpen;
const sideNavValue: string = sideNav.value;
const sideNavItemActive: boolean = sideNavItem.active;
const confirmDialogOpen: boolean = confirmDialog.open;
const contextMenuLabel: string = contextMenu.label;
const statusIndicatorTone: string = statusIndicator.tone;
const ratingValue: number | "" = rating.value;
const richTextValue = richTextEditor.value;

type Assert<Condition extends true> = Condition;
type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;
type ToasterShowReturnIsExact = Assert<Equal<ReturnType<RowanToaster["show"]>, string | null>>;

void [
  accordion,
  alert,
  appLayout,
  avatar,
  badge,
  breadcrumb,
  bulkActionsBar,
  button,
  calendar,
  carousel,
  card,
  checkbox,
  chip,
  combobox,
  commandItem,
  commandPalette,
  confirmDialog,
  contextMenu,
  datePicker,
  dateRangePicker,
  dialog,
  divider,
  drawer,
  dropdown,
  dropzone,
  emptyState,
  fileItem,
  fileUpload,
  filterBuilder,
  formField,
  formLayout,
  formWizard,
  iconButton,
  link,
  listbox,
  menu,
  menuItem,
  multiSelectCombobox,
  numberField,
  option,
  pagination,
  popover,
  progress,
  radio,
  radioGroup,
  rating,
  richTextEditor,
  rowDetailsPanel,
  select,
  segmentedControl,
  sideNav,
  sideNavItem,
  skeleton,
  slider,
  spinner,
  splitPane,
  statusIndicator,
  stepper,
  switchControl,
  tab,
  tabPanel,
  table,
  tableToolbar,
  tabs,
  trendChart,
  textField,
  textarea,
  timePicker,
  toast,
  toaster,
  tooltip,
  tree,
  treeItem,
  validationSummary,
  virtualList,
  virtualListItemSize,
  tableVirtualItemSize,
  tableVirtualized,
  appLayoutNavigationOpen,
  sideNavValue,
  sideNavItemActive,
  confirmDialogOpen,
  contextMenuLabel,
  statusIndicatorTone,
  ratingValue,
  richTextValue,
  tableConfig,
  tableDensity,
  tableSelectable,
  multiSelectOption,
  segmentedOption,
  comboboxOption,
  selectOption,
  toastId,
  stringToastId,
  toasterPlacement,
  null as unknown as ToasterShowReturnIsExact,
];
