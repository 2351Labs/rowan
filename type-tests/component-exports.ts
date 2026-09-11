import { RowanAccordion } from "@rowan-ui/core/accordion";
import { RowanAlert } from "@rowan-ui/core/alert";
import { RowanAvatar } from "@rowan-ui/core/avatar";
import { RowanBadge } from "@rowan-ui/core/badge";
import { RowanBreadcrumb } from "@rowan-ui/core/breadcrumb";
import { RowanBulkActionsBar } from "@rowan-ui/core/bulk-actions-bar";
import { RowanButton } from "@rowan-ui/core/button";
import { RowanCalendar } from "@rowan-ui/core/calendar";
import { RowanCard } from "@rowan-ui/core/card";
import { RowanCheckbox } from "@rowan-ui/core/checkbox";
import { RowanChip } from "@rowan-ui/core/chip";
import { RowanCombobox } from "@rowan-ui/core/combobox";
import { RowanCommandItem } from "@rowan-ui/core/command-item";
import { RowanCommandPalette } from "@rowan-ui/core/command-palette";
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
import { RowanFormWizard } from "@rowan-ui/core/form-wizard";
import { RowanIconButton } from "@rowan-ui/core/icon-button";
import { RowanLink } from "@rowan-ui/core/link";
import { RowanMenu } from "@rowan-ui/core/menu";
import { RowanMenuItem } from "@rowan-ui/core/menu-item";
import { RowanNumberField } from "@rowan-ui/core/number-field";
import { RowanPagination } from "@rowan-ui/core/pagination";
import { RowanPopover } from "@rowan-ui/core/popover";
import { RowanProgress } from "@rowan-ui/core/progress";
import { RowanRadio } from "@rowan-ui/core/radio";
import { RowanRadioGroup } from "@rowan-ui/core/radio-group";
import { RowanRowDetailsPanel } from "@rowan-ui/core/row-details-panel";
import { RowanSelect } from "@rowan-ui/core/select";
import { RowanSkeleton } from "@rowan-ui/core/skeleton";
import { RowanSpinner } from "@rowan-ui/core/spinner";
import { RowanStepper } from "@rowan-ui/core/stepper";
import { RowanSwitch } from "@rowan-ui/core/switch";
import { RowanTab } from "@rowan-ui/core/tab";
import { RowanTabPanel } from "@rowan-ui/core/tab-panel";
import { RowanTable } from "@rowan-ui/core/table";
import { RowanTableToolbar } from "@rowan-ui/core/table-toolbar";
import { RowanTabs } from "@rowan-ui/core/tabs";
import { RowanTextField } from "@rowan-ui/core/text-field";
import { RowanTextarea } from "@rowan-ui/core/textarea";
import { RowanTimePicker } from "@rowan-ui/core/time-picker";
import { RowanToast } from "@rowan-ui/core/toast";
import { RowanToaster } from "@rowan-ui/core/toaster";
import { RowanTooltip } from "@rowan-ui/core/tooltip";
import { RowanTree } from "@rowan-ui/core/tree";
import { RowanTreeItem } from "@rowan-ui/core/tree-item";
import { RowanValidationSummary } from "@rowan-ui/core/validation-summary";

const accordion: RowanAccordion = document.createElement("rowan-accordion");
const alert: RowanAlert = document.createElement("rowan-alert");
const avatar: RowanAvatar = document.createElement("rowan-avatar");
const badge: RowanBadge = document.createElement("rowan-badge");
const breadcrumb: RowanBreadcrumb = document.createElement("rowan-breadcrumb");
const bulkActionsBar: RowanBulkActionsBar = document.createElement("rowan-bulk-actions-bar");
const button: RowanButton = document.createElement("rowan-button");
const calendar: RowanCalendar = document.createElement("rowan-calendar");
const card: RowanCard = document.createElement("rowan-card");
const checkbox: RowanCheckbox = document.createElement("rowan-checkbox");
const chip: RowanChip = document.createElement("rowan-chip");
const combobox: RowanCombobox = document.createElement("rowan-combobox");
const commandItem: RowanCommandItem = document.createElement("rowan-command-item");
const commandPalette: RowanCommandPalette = document.createElement("rowan-command-palette");
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
const formWizard: RowanFormWizard = document.createElement("rowan-form-wizard");
const iconButton: RowanIconButton = document.createElement("rowan-icon-button");
const link: RowanLink = document.createElement("rowan-link");
const menu: RowanMenu = document.createElement("rowan-menu");
const menuItem: RowanMenuItem = document.createElement("rowan-menu-item");
const numberField: RowanNumberField = document.createElement("rowan-number-field");
const pagination: RowanPagination = document.createElement("rowan-pagination");
const popover: RowanPopover = document.createElement("rowan-popover");
const progress: RowanProgress = document.createElement("rowan-progress");
const radio: RowanRadio = document.createElement("rowan-radio");
const radioGroup: RowanRadioGroup = document.createElement("rowan-radio-group");
const rowDetailsPanel: RowanRowDetailsPanel = document.createElement("rowan-row-details-panel");
const select: RowanSelect = document.createElement("rowan-select");
const skeleton: RowanSkeleton = document.createElement("rowan-skeleton");
const spinner: RowanSpinner = document.createElement("rowan-spinner");
const stepper: RowanStepper = document.createElement("rowan-stepper");
const switchControl: RowanSwitch = document.createElement("rowan-switch");
const tab: RowanTab = document.createElement("rowan-tab");
const tabPanel: RowanTabPanel = document.createElement("rowan-tab-panel");
const table: RowanTable = document.createElement("rowan-table");
const tableToolbar: RowanTableToolbar = document.createElement("rowan-table-toolbar");
const tabs: RowanTabs = document.createElement("rowan-tabs");
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

void [
  accordion,
  alert,
  avatar,
  badge,
  breadcrumb,
  bulkActionsBar,
  button,
  calendar,
  card,
  checkbox,
  chip,
  combobox,
  commandItem,
  commandPalette,
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
  formWizard,
  iconButton,
  link,
  menu,
  menuItem,
  numberField,
  pagination,
  popover,
  progress,
  radio,
  radioGroup,
  rowDetailsPanel,
  select,
  skeleton,
  spinner,
  stepper,
  switchControl,
  tab,
  tabPanel,
  table,
  tableToolbar,
  tabs,
  textField,
  textarea,
  timePicker,
  toast,
  toaster,
  tooltip,
  tree,
  treeItem,
  validationSummary,
];
