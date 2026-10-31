import { button, field, h } from "../dom.js";
import { bindForm } from "../forms.js";
import { clearSettings, loadSettings, saveSettings } from "../settings-store.js";
import { clearStoredTheme, getTheme, setTheme } from "../theme.js";

export function renderSettings(outlet, ctx) {
  const settings = loadSettings();
  const page = h("div", { class: "page", "data-page": "settings", "data-ready": "true" });
  page.append(
    h(
      "header",
      { class: "page-header" },
      h(
        "div",
        {},
        h("h1", { tabindex: "-1", text: "Settings" }),
        h("p", {
          class: "lede",
          text: "Workspace preferences stay in this browser. Sample orders reset when you refresh, or from the danger zone below.",
        }),
      ),
    ),
  );

  const form = h("form", { id: "settings-form", class: "stack" });
  const summary = h("rowan-validation-summary", {
    "for-form": "settings-form",
    heading: "Check the workspace settings",
  });

  const workspace = h("rowan-text-field", {
    id: "settings-workspace",
    name: "workspace",
    label: "Workspace",
    required: true,
    value: settings.workspace,
  });
  const email = h("rowan-text-field", {
    id: "settings-email",
    name: "supportEmail",
    type: "email",
    label: "Support email",
    required: true,
    value: settings.supportEmail,
    autocomplete: "email",
  });
  const timezone = h("rowan-select", {
    id: "settings-timezone",
    name: "timezone",
    label: "Timezone",
    required: true,
  });
  timezone.options = [
    { value: "America/Los_Angeles", label: "Pacific" },
    { value: "America/Denver", label: "Mountain" },
    { value: "America/Chicago", label: "Central" },
    { value: "America/New_York", label: "Eastern" },
  ];
  timezone.value = settings.timezone;
  const currency = h("rowan-select", {
    id: "settings-currency",
    name: "currency",
    label: "Currency",
    required: true,
  });
  currency.options = ["USD", "CAD", "EUR"];
  currency.value = settings.currency;
  const week = h("rowan-select", {
    id: "settings-week",
    name: "weekStart",
    label: "Week starts",
    required: true,
  });
  week.options = [
    { value: "monday", label: "Monday" },
    { value: "sunday", label: "Sunday" },
  ];
  week.value = settings.weekStart;
  const warehouse = h("rowan-select", {
    id: "settings-warehouse",
    name: "warehouse",
    label: "Default warehouse",
  });
  warehouse.options = [
    { value: "seattle", label: "Seattle" },
    { value: "chicago", label: "Chicago" },
    { value: "atlanta", label: "Atlanta" },
  ];
  warehouse.value = settings.warehouse;

  const identity = h("rowan-card");
  identity.append(h("span", { slot: "title", text: "Workspace" }));
  const identityLayout = h("rowan-form-layout", { columns: "2" });
  identityLayout.append(
    field("Workspace name", workspace, { required: true }),
    field("Support email", email, { required: true }),
    field("Timezone", timezone, { required: true }),
    field("Currency", currency, { required: true }),
    field("Week starts", week, { required: true }),
    field("Default warehouse", warehouse),
  );
  identity.append(identityLayout);

  const notify = h("rowan-card");
  notify.append(h("span", { slot: "title", text: "Notifications" }));
  const switches = h("div", { class: "switch-list" });
  const digest = switchFor("digest", "Weekly digest", settings.digest);
  const desktop = switchFor("desktopAlerts", "Desktop alerts", settings.desktopAlerts);
  const lowStock = switchFor("lowStock", "Low-stock warnings", settings.lowStock);
  const archived = h("rowan-checkbox", { id: "settings-archived", name: "includeArchived" });
  archived.checked = settings.includeArchived;
  archived.textContent = "Include cancelled orders in exports";
  switches.append(digest, desktop, lowStock, field("Exports", archived));
  notify.append(switches);

  const appearanceCard = h("rowan-card");
  appearanceCard.append(h("span", { slot: "title", text: "Appearance" }));
  const appearance = h("rowan-segmented-control", {
    id: "settings-theme",
    name: "theme",
    label: "Theme",
  });
  appearance.options = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];
  appearance.value = getTheme();
  const density = h("rowan-segmented-control", {
    id: "settings-density",
    name: "density",
    label: "Table density",
    size: "sm",
  });
  density.options = [
    { value: "sm", label: "Compact" },
    { value: "md", label: "Comfortable" },
    { value: "lg", label: "Roomy" },
  ];
  density.value = settings.density;
  const threshold = h("rowan-slider", {
    id: "settings-threshold",
    name: "stockThreshold",
    label: "Low-stock threshold",
    min: "0",
    max: "80",
    step: "1",
    value: String(settings.stockThreshold),
  });
  const appearanceLayout = h("rowan-form-layout", { columns: "1" });
  appearanceLayout.append(
    field("Theme", appearance, { hint: "Swaps the light and dark token sheets." }),
    field("Table density", density, { hint: "Used the next time you open Orders or Customers." }),
    field("Low-stock threshold", threshold, { hint: "Units on hand before a warning." }),
  );
  appearanceCard.append(appearanceLayout);

  const brand = h("rowan-card");
  brand.append(h("span", { slot: "title", text: "Packing slip mark" }));
  const drop = h("rowan-dropzone", {
    label: "Drop a logo",
    description: "PNG or SVG. Nothing is uploaded.",
    accept: "image/png,image/svg+xml",
  });
  brand.append(drop, h("p", { class: "quiet", id: "logo-status", text: "No file selected." }));

  const danger = h("rowan-card");
  danger.append(
    h("span", { slot: "title", text: "Reset sample data" }),
    h("p", { text: "Clears saved settings and reloads the generated orders." }),
    button("Reset demo", { type: "button", variant: "danger", id: "reset-demo" }),
  );

  form.append(summary, identity, notify, appearanceCard, brand, danger);
  form.append(h("div", { class: "form-actions" }, button("Save settings", { type: "submit" })));
  page.append(form);

  const confirm = h("rowan-confirm-dialog", {
    label: "Reset the sample workspace?",
    "confirm-label": "Reset",
    "cancel-label": "Keep data",
    "confirm-variant": "danger",
  });
  confirm.append(
    h("p", { text: "Saved settings, theme choice, and in-memory edits will be discarded." }),
  );
  page.append(confirm);
  outlet.append(page);

  let applyingTheme = false;
  appearance.addEventListener("rowan-change", () => {
    if (applyingTheme) return;
    setTheme(appearance.value);
  });
  window.addEventListener(
    "rowan-admin-theme",
    () => {
      if (appearance.value === getTheme()) return;
      applyingTheme = true;
      appearance.value = getTheme();
      applyingTheme = false;
    },
    { signal: ctx.signal },
  );

  drop.addEventListener("rowan-files-add", (event) => {
    const file = event.detail?.files?.[0];
    const status = page.querySelector("#logo-status");
    if (!file) {
      status.textContent = "That file type was not accepted.";
      return;
    }
    status.textContent = `${file.name} selected. The starter does not upload it.`;
    ctx.toaster.show({ title: "Logo selected", message: file.name, tone: "info" });
  });

  bindForm(form, {
    summary,
    onValid(values) {
      saveSettings({
        ...values,
        digest: digest.checked,
        desktopAlerts: desktop.checked,
        lowStock: lowStock.checked,
        includeArchived: archived.checked,
        density: density.value,
        stockThreshold: Number(threshold.value),
        theme: appearance.value,
      });
      ctx.toaster.show({ title: "Settings saved", message: values.workspace, tone: "success" });
    },
  });

  page.querySelector("#reset-demo").addEventListener("rowan-click", () => confirm.show());
  confirm.addEventListener("rowan-confirm", () => {
    clearSettings();
    clearStoredTheme();
    window.location.reload();
  });
}

function switchFor(name, label, checked) {
  const control = h("rowan-switch", { id: `settings-${name}`, name, label });
  control.checked = checked;
  control.textContent = label;
  return control;
}
