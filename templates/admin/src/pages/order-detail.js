import { findOrder, refreshCustomerStats } from "../api.js";
import { button, field, h, icon } from "../dom.js";
import { bindForm } from "../forms.js";
import { integer, money, shortDate } from "../format.js";
import { ORDER_STATUSES, REGIONS, fulfillmentStep, labelFor, toneFor } from "../labels.js";

export function renderOrderDetail(outlet, ctx) {
  const order = findOrder(ctx.store, ctx.params[0]);
  const page = h("div", { class: "page", "data-page": "order", "data-ready": "true" });

  if (!order) {
    const missing = h("rowan-empty-state");
    missing.append(
      icon("circle-alert", "icon"),
      h("span", { slot: "title", text: "Order not found" }),
      h("p", { text: "That order is not in the sample data." }),
      h("rowan-link", { slot: "actions", href: "#/orders" }, "Back to orders"),
    );
    page.append(h("h1", { tabindex: "-1", text: "Order" }), missing);
    outlet.append(page);
    return;
  }

  const customer = ctx.store.customers.find((entry) => entry.id === order.customerId);
  const header = h("header", { class: "page-header" });
  const intro = h("div", { class: "stack tight" });
  const crumb = h("rowan-breadcrumb");
  crumb.append(
    h("rowan-link", { href: "#/orders" }, "Orders"),
    h("span", { text: "/" }),
    h("span", { "aria-current": "page", text: `#${order.number}` }),
  );
  const titleRow = h("div", { class: "cluster" });
  titleRow.append(
    h("h1", { tabindex: "-1", text: `Order #${order.number}` }),
    statusBadge(order.status),
  );
  if (order.priority === "rush") {
    titleRow.append(h("rowan-badge", { tone: "warning", text: "Rush" }));
  }
  intro.append(
    crumb,
    titleRow,
    h("p", { class: "lede", text: `${order.customer} · placed ${shortDate(order.placed)}` }),
  );

  const cancel = button("Cancel order", { variant: "danger", type: "button" });
  const pack = button("Mark packed", { variant: "secondary", type: "button" });
  header.append(intro, h("div", { class: "page-actions" }, pack, cancel));
  if (order.status === "cancelled") pack.disabled = true;

  const stepper = h("rowan-stepper", { orientation: "horizontal" });
  stepper.steps = ["Paid", "Packed", "Shipped", "Delivered"];
  stepper.currentStep = fulfillmentStep(order.status);
  stepper.disabled = order.status === "cancelled";

  const tabs = h("rowan-tabs", { value: "summary" });
  tabs.append(
    h("rowan-tab", { value: "summary" }, "Summary"),
    h("rowan-tab", { value: "items" }, "Items"),
    h("rowan-tab", { value: "shipping" }, "Shipping"),
    h("rowan-tab", { value: "notes" }, "Notes"),
  );

  const summary = h("rowan-tab-panel", { value: "summary" });
  const meta = h("dl", { class: "meta-grid" });
  const progress = h("rowan-progress", {
    label: "Fulfillment",
    value: String(fulfillmentStep(order.status) * 25),
    max: "100",
  });
  summary.append(meta, progress, h("rowan-divider"));
  const account = h("p", { class: "quiet" });
  account.append(
    "Account ",
    h("rowan-link", { href: `#/customers/${order.customerId}` }, order.customer),
    customer ? ` · ${customer.email}` : "",
  );
  summary.append(account);

  const items = h("rowan-tab-panel", { value: "items" });
  const itemTable = h("rowan-table", {
    caption: "Line items",
    "caption-visually-hidden": true,
    density: "sm",
    locale: "en-US",
  });
  itemTable.editMode = "cell";
  itemTable.config = {
    rowId: "id",
    columns: [
      { id: "sku", header: "SKU", width: "8rem" },
      { id: "name", header: "Item" },
      {
        id: "category",
        header: "Category",
        width: "8rem",
        cell: { type: "badge", tone: "info" },
      },
      {
        id: "qty",
        header: "Qty",
        type: "number",
        align: "end",
        width: "6rem",
        editable: true,
        editor: { type: "number", min: 1, step: 1 },
        validate: (value) => (Number(value) >= 1 ? true : "Quantity must be at least 1"),
      },
      {
        id: "price",
        header: "Price",
        align: "end",
        width: "8rem",
        format: (value) => money(value),
      },
      {
        id: "amount",
        header: "Amount",
        align: "end",
        width: "8rem",
        format: (_value, row) => money(row.qty * row.price),
      },
    ],
    rows: order.lines,
  };
  items.append(itemTable);

  const shipping = h("rowan-tab-panel", { value: "shipping" });
  const shipForm = h("form", { id: "shipping-form", class: "stack" });
  const shipSummary = h("rowan-validation-summary", {
    "for-form": "shipping-form",
    heading: "Check the shipping address",
    hidden: true,
  });
  const recipient = textControl("ship-recipient", "recipient", order.shipping.recipient, {
    required: true,
  });
  const line1 = textControl("ship-line1", "line1", order.shipping.line1, { required: true });
  const city = textControl("ship-city", "city", order.shipping.city, { required: true });
  const region = h("rowan-select", {
    id: "ship-region",
    name: "region",
    label: "Region",
    required: true,
  });
  region.options = REGIONS;
  region.value = order.shipping.region || "West";
  const postal = textControl("ship-postal", "postal", order.shipping.postal, {
    required: true,
    pattern: "[0-9]{5}",
  });
  const phone = h("rowan-text-field", {
    id: "ship-phone",
    name: "phone",
    type: "tel",
    label: "Phone",
    value: order.shipping.phone,
    autocomplete: "tel",
  });
  const speed = h("rowan-radio-group", {
    id: "ship-speed",
    name: "speed",
    label: "Speed",
    value: order.shipping.speed,
  });
  for (const option of [
    ["ground", "Ground"],
    ["express", "Express"],
  ]) {
    const radio = h("rowan-radio", { value: option[0], name: "speed" }, option[1]);
    radio.checked = order.shipping.speed === option[0];
    speed.append(radio);
  }
  const signature = h("rowan-checkbox", {
    id: "ship-signature",
    name: "signature",
    value: "yes",
  });
  signature.checked = Boolean(order.shipping.signature);
  signature.textContent = "Signature required";
  const shipLayout = h("rowan-form-layout", { columns: "2" });
  shipLayout.append(
    field("Recipient", recipient, { required: true, span: "2" }),
    field("Street", line1, { required: true, span: "2" }),
    field("City", city, { required: true }),
    field("Region", region, { required: true }),
    field("Postal code", postal, { required: true, hint: "Five digits" }),
    field("Phone", phone),
    field("Speed", speed, { span: "2" }),
    field("Delivery", signature, { span: "2" }),
  );
  const saveShip = button("Save address", { type: "submit", variant: "primary" });
  shipForm.append(shipSummary, shipLayout, h("div", { class: "form-actions" }, saveShip));
  shipping.append(shipForm);

  const notes = h("rowan-tab-panel", { value: "notes" });
  const noteList = h("div");
  const addNote = button("Add note", { variant: "secondary", type: "button" });
  notes.append(h("div", { class: "cluster" }, addNote), noteList);

  const noteDialog = h("rowan-dialog");
  noteDialog.append(h("span", { slot: "title", text: "Add a note" }));
  const noteForm = h("form", { id: "note-form", class: "stack" });
  const noteSummary = h("rowan-validation-summary", {
    "for-form": "note-form",
    heading: "The note needs a message",
    hidden: true,
  });
  const noteBody = h("rowan-textarea", {
    id: "note-body",
    name: "body",
    label: "Note",
    required: true,
    rows: "4",
  });
  noteForm.append(
    noteSummary,
    field("Note", noteBody, { required: true }),
    h("div", { class: "form-actions" }, button("Save note", { type: "submit" })),
  );
  noteDialog.append(noteForm);

  const confirm = h("rowan-confirm-dialog", {
    label: `Cancel order #${order.number}?`,
    "confirm-label": "Cancel order",
    "cancel-label": "Keep order",
    "confirm-variant": "danger",
  });
  confirm.append(h("p", { text: "The sample record stays in the table with status Cancelled." }));

  tabs.append(summary, items, shipping, notes);
  const alerts = [];
  if (order.status === "hold") {
    alerts.push(
      h(
        "rowan-alert",
        { tone: "warning", dismissible: true },
        "This order is on hold. Confirm the address before it ships.",
      ),
    );
  }
  if (order.status === "cancelled") {
    alerts.push(
      h(
        "rowan-alert",
        { tone: "danger" },
        "This order is cancelled. Shipping changes stay on the sample record.",
      ),
    );
  }
  page.append(header, ...alerts, stepper, tabs, noteDialog, confirm);
  outlet.append(page);
  paintMeta();
  paintNotes();

  itemTable.addEventListener("rowan-edit-commit", (event) => {
    if (event.detail?.columnId !== "qty") return;
    const line = order.lines.find((entry) => entry.id === event.detail.rowId);
    if (line) line.qty = Number(event.detail.value);
    order.items = order.lines.reduce((total, line) => total + Number(line.qty), 0);
    order.total = order.lines.reduce((total, line) => total + Number(line.qty) * line.price, 0);
    refreshCustomerStats(ctx.store, order.customerId);
    paintMeta();
    itemTable.rows = order.lines.slice();
    ctx.toaster.show({ title: "Quantity updated", message: money(order.total), tone: "success" });
  });

  bindForm(shipForm, {
    summary: shipSummary,
    onValid(values) {
      order.shipping = {
        ...order.shipping,
        ...values,
        signature: Boolean(values.signature),
      };
      ctx.toaster.show({
        title: "Address saved",
        message: `${values.recipient}, ${values.city}`,
        tone: "success",
      });
    },
  });

  addNote.addEventListener("rowan-click", () => noteDialog.show());
  bindForm(noteForm, {
    summary: noteSummary,
    onValid(values) {
      order.comments.unshift({
        id: `note-${order.number}-${order.comments.length + 1}`,
        author: "Maya Chen",
        at: "2026-10-31",
        body: values.body,
      });
      order.note = values.body;
      noteBody.value = "";
      noteDialog.hide();
      paintNotes();
      ctx.toaster.show({
        title: "Note added",
        message: "Visible on this order only.",
        tone: "success",
      });
    },
  });

  pack.addEventListener("rowan-click", () => {
    if (order.status === "cancelled") return;
    order.status = "packed";
    stepper.currentStep = fulfillmentStep(order.status);
    progress.value = fulfillmentStep(order.status) * 25;
    titleRow.querySelector("rowan-badge").replaceWith(statusBadge(order.status));
    ctx.toaster.show({ title: "Marked packed", message: `#${order.number}`, tone: "success" });
  });
  cancel.addEventListener("rowan-click", () => {
    confirm.show();
  });
  confirm.addEventListener("rowan-confirm", () => {
    order.status = "cancelled";
    refreshCustomerStats(ctx.store, order.customerId);
    stepper.disabled = true;
    ctx.shell?.refreshChrome?.();
    ctx.toaster.show({ title: "Order cancelled", message: `#${order.number}`, tone: "warning" });
    ctx.navigate(`#/orders/${order.id}`);
  });

  function paintMeta() {
    meta.replaceChildren(
      pair("Total", money(order.total)),
      pair("Items", integer(order.items)),
      pair("Channel", order.channel),
      pair("Assignee", order.assignee),
      pair("Ship to", `${order.city}, ${order.region}`),
      pair("Priority", order.priority === "rush" ? "Rush" : "Standard"),
    );
  }

  function paintNotes() {
    noteList.replaceChildren();
    if (order.comments.length === 0) {
      const empty = h("rowan-empty-state");
      empty.append(
        h("span", { slot: "title", text: "No notes yet" }),
        h("p", { text: "Add a receiving or gift-wrap note." }),
      );
      noteList.append(empty);
      return;
    }
    for (const comment of order.comments) {
      const block = h("article", { class: "comment" });
      block.append(
        h("strong", { text: comment.author }),
        h("time", { datetime: comment.at, text: shortDate(comment.at) }),
        h("p", { text: comment.body }),
      );
      noteList.append(block);
    }
  }
}

function statusBadge(status) {
  return h("rowan-badge", {
    tone: toneFor(ORDER_STATUSES, status),
    text: labelFor(ORDER_STATUSES, status),
  });
}

function pair(term, value) {
  return h("div", {}, h("dt", { text: term }), h("dd", { text: value }));
}

function textControl(id, name, value, extra = {}) {
  return h("rowan-text-field", {
    id,
    name,
    label: name,
    value,
    required: extra.required || null,
    pattern: extra.pattern || null,
    autocomplete: extra.autocomplete || null,
  });
}
