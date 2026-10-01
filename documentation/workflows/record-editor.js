import "../../src/button/button.js";
import "../../src/confirm-dialog/confirm-dialog.js";
import "../../src/form-field/form-field.js";
import "../../src/form-layout/form-layout.js";
import "../../src/select/select.js";
import "../../src/text-field/text-field.js";
import "../../src/textarea/textarea.js";
import "../../src/validation-summary/validation-summary.js";

const DEFAULT_RECORD = {
  name: "Partner delivery webhook",
  owner: "Integrations",
  status: "Review",
  description: "Routes delivery updates to the partner operations workspace.",
};

const STATUS_OPTIONS = ["Draft", "Review", "Active", "Archived"];

let recordEditorInstance = 0;

function cloneRecord(record) {
  return {
    ...DEFAULT_RECORD,
    ...(record && typeof record === "object" ? record : {}),
  };
}

function recordsMatch(left, right) {
  return Object.keys(DEFAULT_RECORD).every((key) => left[key] === right[key]);
}

function readFieldValue(event, field) {
  const value = event.detail?.value;
  return value == null ? String(field.value ?? "") : String(value);
}

function createField({ id, label, hint, name, value, control, span }) {
  const field = document.createElement("rowan-form-field");
  field.label = label;
  field.hint = hint;
  if (span) field.setAttribute("span", String(span));

  control.id = id;
  control.name = name;
  control.value = value;
  field.append(control);
  return { field, control };
}

/**
 * Creates the documentation record-editor composition.
 * Draft data, persistence, and route transitions remain in the host callbacks.
 *
 * @param {{
 *   record?: { name?: string, owner?: string, status?: string, description?: string },
 *   onSave?: (detail: { record: { name: string, owner: string, status: string, description: string } }) => unknown | Promise<unknown>,
 *   onRoute?: (detail: { type: "back", record: { name: string, owner: string, status: string, description: string } }) => void,
 * }} [options]
 */
export function createRecordEditor(options = {}) {
  recordEditorInstance += 1;

  const onSave = typeof options.onSave === "function" ? options.onSave : null;
  const onRoute = typeof options.onRoute === "function" ? options.onRoute : null;
  const instanceId = `docs-record-editor-${recordEditorInstance}`;
  const formId = `${instanceId}-form`;
  let persistedRecord = cloneRecord(options.record);
  let draftRecord = cloneRecord(persistedRecord);
  let saving = false;

  const root = document.createElement("section");
  root.className = "workflow-recipe record-editor";
  root.dataset.workflow = "record-editor";

  const summary = document.createElement("p");
  summary.className = "workflow-recipe-summary";
  summary.setAttribute("aria-live", "polite");

  const form = document.createElement("form");
  form.id = formId;
  form.noValidate = true;

  const validationSummary = document.createElement("rowan-validation-summary");
  validationSummary.forForm = formId;
  validationSummary.heading = "Resolve the fields below before saving";

  const layout = document.createElement("rowan-form-layout");
  layout.columns = 2;
  layout.labelPosition = "top";

  const name = document.createElement("rowan-text-field");
  name.required = true;
  const nameField = createField({
    id: `${instanceId}-name`,
    label: "Resource name",
    hint: "Shown in inventory and activity views.",
    name: "name",
    value: draftRecord.name,
    control: name,
  });

  const owner = document.createElement("rowan-text-field");
  owner.required = true;
  const ownerField = createField({
    id: `${instanceId}-owner`,
    label: "Owner",
    hint: "The team responsible for this resource.",
    name: "owner",
    value: draftRecord.owner,
    control: owner,
  });

  const status = document.createElement("rowan-select");
  status.required = true;
  status.options = STATUS_OPTIONS;
  const statusField = createField({
    id: `${instanceId}-status`,
    label: "Status",
    hint: "Choose the current operational state.",
    name: "status",
    value: draftRecord.status,
    control: status,
  });

  const description = document.createElement("rowan-textarea");
  description.required = true;
  const descriptionField = createField({
    id: `${instanceId}-description`,
    label: "Description",
    hint: "Explain the resource purpose and expected behavior.",
    name: "description",
    value: draftRecord.description,
    control: description,
    span: 2,
  });

  const actions = document.createElement("div");
  actions.className = "workflow-recipe-actions";

  const back = document.createElement("rowan-button");
  back.variant = "ghost";
  back.textContent = "Back to resources";

  const save = document.createElement("rowan-button");
  save.type = "submit";
  save.textContent = "Save changes";

  actions.append(back, save);
  layout.append(nameField.field, ownerField.field, statusField.field, descriptionField.field);
  form.append(validationSummary, layout, actions);

  const discardDialog = document.createElement("rowan-confirm-dialog");
  discardDialog.label = "Discard unsaved changes?";
  discardDialog.confirmLabel = "Discard changes";
  discardDialog.confirmVariant = "danger";
  discardDialog.textContent = "Your draft has not been saved. Leaving this editor will discard it.";

  const controls = [name, owner, status, description];

  const isDirty = () => !recordsMatch(draftRecord, persistedRecord);

  const setSaving = (nextValue) => {
    saving = Boolean(nextValue);
    save.loading = saving;
    back.disabled = saving;
    controls.forEach((control) => {
      control.disabled = saving;
    });
  };

  const updateSummary = (message = "") => {
    if (message) {
      summary.textContent = message;
    } else if (saving) {
      summary.textContent = "Saving changes through the application.";
    } else if (isDirty()) {
      summary.textContent = "Unsaved changes.";
    } else {
      summary.textContent = "All changes are saved.";
    }
  };

  const syncDraft = (key, event, field) => {
    draftRecord = { ...draftRecord, [key]: readFieldValue(event, field) };
    validationSummary.errors = [];
    updateSummary();
  };

  name.addEventListener("rowan-change", (event) => syncDraft("name", event, name));
  owner.addEventListener("rowan-change", (event) => syncDraft("owner", event, owner));
  status.addEventListener("rowan-change", (event) => syncDraft("status", event, status));
  description.addEventListener("rowan-change", (event) =>
    syncDraft("description", event, description),
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (saving) return;

    const errors = validationSummary.collectFromForm();
    if (errors.length > 0) {
      updateSummary("Resolve the validation issues before saving.");
      return;
    }

    const record = cloneRecord(draftRecord);
    setSaving(true);
    updateSummary();

    try {
      await onSave?.({ record });
      persistedRecord = cloneRecord(record);
      draftRecord = cloneRecord(record);
      updateSummary("Changes saved.");
    } catch (error) {
      updateSummary("The application could not save these changes.");
    } finally {
      setSaving(false);
    }
  });

  const routeBack = () => {
    onRoute?.({ type: "back", record: cloneRecord(draftRecord) });
  };

  back.addEventListener("rowan-click", () => {
    if (saving) return;
    if (isDirty()) {
      discardDialog.open = true;
      return;
    }

    routeBack();
  });

  discardDialog.addEventListener("rowan-confirm", () => {
    draftRecord = cloneRecord(persistedRecord);
    name.value = draftRecord.name;
    owner.value = draftRecord.owner;
    status.value = draftRecord.status;
    description.value = draftRecord.description;
    validationSummary.errors = [];
    updateSummary();
    routeBack();
  });

  root.append(summary, form, discardDialog);
  updateSummary();
  return root;
}
