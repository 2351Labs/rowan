import { addOrder, queryOrders, refreshCustomerStats } from "../api.js";
import { button, field, h, icon } from "../dom.js";
import { bindForm } from "../forms.js";
import { money } from "../format.js";
import { CHANNELS, ORDER_STATUSES, labelFor, toneFor } from "../labels.js";
import { loadSettings } from "../settings-store.js";
import { mountServerTable } from "../tables.js";

export function renderOrders(outlet, ctx) {
  const { store, navigate, toaster } = ctx;
  const settings = loadSettings();
  const page = h("div", { class: "page", "data-page": "orders", "data-ready": "true" });
  const header = h("header", { class: "page-header" });
  const intro = h("div");
  intro.append(
    h("h1", { tabindex: "-1", text: "Orders" }),
    h("p", {
      class: "lede",
      text: "Paged from a local service with latency. Sort, filter, resize, and reorder columns. Double-click a row or use the order link. Edit status, assignee, or note in the cell.",
    }),
  );
  const create = button("New order", { variant: "primary", type: "button" });
  create.prepend(icon("plus", "prefix"));
  header.append(intro, create);

  const dialog = h("rowan-dialog");
  dialog.append(h("span", { slot: "title", text: "New order" }));
  const form = h("form", { id: "new-order", class: "dialog-form" });
  const summary = h("rowan-validation-summary", {
    "for-form": "new-order",
    heading: "Check the new order",
    hidden: true,
  });
  const customer = h("rowan-select", {
    id: "new-order-customer",
    name: "customerId",
    label: "Account",
    required: true,
    placeholder: "Choose an account",
  });
  customer.options = store.customers.map((entry) => ({ value: entry.id, label: entry.name }));
  const channel = h("rowan-select", {
    id: "new-order-channel",
    name: "channel",
    label: "Channel",
    required: true,
  });
  channel.options = CHANNELS;
  channel.value = "Wholesale";
  const total = h("rowan-number-field", {
    id: "new-order-total",
    name: "total",
    label: "Total",
    min: "1",
    step: "0.01",
    required: true,
    value: "480",
  });
  const note = h("rowan-textarea", {
    id: "new-order-note",
    name: "note",
    label: "Note",
    rows: "3",
    placeholder: "Dock, gift wrap, hold",
  });
  const layout = h("rowan-form-layout", { columns: "1" });
  layout.append(
    field("Account", customer, { required: true }),
    field("Channel", channel, { required: true }),
    field("Total", total, { required: true, hint: "USD" }),
    field("Note", note),
  );
  const formActions = h("div", { class: "form-actions" });
  const cancel = button("Cancel", { type: "button", variant: "ghost" });
  const submit = button("Create order", { type: "submit", variant: "primary" });
  formActions.append(cancel, submit);
  form.append(summary, layout, formActions);
  dialog.append(form);

  page.append(header);
  const ordersTable = mountServerTable(page, {
    id: "orders-table",
    caption: "Orders",
    columns: orderColumns(),
    density: settings.density,
    searchLabel: "Search orders",
    searchPlaceholder: "Order, account, city, assignee",
    statusOptions: ORDER_STATUSES,
    filterFields: [
      { id: "customer", label: "Account", type: "text" },
      { id: "city", label: "City", type: "text" },
      {
        id: "status",
        label: "Status",
        type: "select",
        options: ORDER_STATUSES,
      },
      { id: "channel", label: "Channel", type: "select", options: CHANNELS },
      { id: "total", label: "Total", type: "number" },
      { id: "placed", label: "Placed", type: "date" },
    ],
    query: async (request) => {
      const result = await queryOrders(store, request, { fail: request.fail });
      if (request.purpose === "export" && !loadSettings().includeArchived) {
        const rows = result.rows.filter((row) => row.status !== "cancelled");
        return { rows, total: rows.length };
      }
      return result;
    },
    filename: "lumen-orders.csv",
    emptyTitle: "No orders match",
    emptyMessage: "Clear the search or filters to see the sample book.",
    toast: (input) => toaster.show(input),
    bulkLabel: "Selected orders",
    bulkActions: [{ id: "ship", label: "Mark shipped" }],
    onActivate(row) {
      navigate(`#/orders/${row.id}`);
    },
    onEdit(detail) {
      const order = store.orders.find((entry) => entry.id === detail.rowId);
      if (!order) return;
      order[detail.columnId] = detail.value;
      if (detail.columnId === "status") refreshCustomerStats(store, order.customerId);
      ctx.shell?.refreshChrome?.();
    },
    onBulk(action, selected, helpers) {
      if (action !== "ship") return;
      for (const id of selected) {
        const order = store.orders.find((entry) => entry.id === id);
        if (!order || order.status === "cancelled") continue;
        order.status = "shipped";
        refreshCustomerStats(store, order.customerId);
      }
      helpers.clear();
      helpers.reload();
      toaster.show({
        title: "Marked shipped",
        message: `${selected.length} selected orders updated in the sample store.`,
        tone: "success",
      });
      ctx.shell?.refreshChrome?.();
    },
  });

  page.append(dialog);
  outlet.append(page);

  create.addEventListener("rowan-click", () => {
    dialog.show();
  });
  cancel.addEventListener("rowan-click", () => dialog.hide());
  bindForm(form, {
    summary,
    onValid(values) {
      const order = addOrder(store, values);
      dialog.hide();
      form.reset();
      channel.value = "Wholesale";
      total.value = "480";
      ordersTable.reload();
      toaster.show({
        title: "Order created",
        message: `#${order.number} for ${order.customer}`,
        tone: "success",
      });
      ctx.shell?.refreshChrome?.();
    },
  });
}

function orderColumns() {
  return [
    {
      id: "number",
      header: "Order",
      sortable: true,
      width: "7rem",
      cell: {
        type: "link",
        href: (_value, row) => `#/orders/${row.id}`,
        label: (value) => `#${value}`,
      },
    },
    {
      id: "customer",
      header: "Account",
      sortable: true,
      width: "14rem",
      cell: {
        type: "link",
        href: (_value, row) => `#/customers/${row.customerId}`,
      },
    },
    { id: "placed", header: "Placed", type: "date", sortable: true, width: "8rem" },
    {
      id: "channel",
      header: "Channel",
      sortable: true,
      width: "8rem",
      cell: { type: "badge", tone: "info" },
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      width: "8.5rem",
      editable: true,
      editor: {
        type: "select",
        options: ORDER_STATUSES.map((status) => ({ value: status.value, label: status.label })),
      },
      cell: {
        type: "badge",
        tone: (value) => toneFor(ORDER_STATUSES, value),
        label: (value) => labelFor(ORDER_STATUSES, value),
      },
    },
    { id: "items", header: "Items", type: "number", sortable: true, align: "end", width: "6rem" },
    {
      id: "total",
      header: "Total",
      sortable: true,
      align: "end",
      width: "8rem",
      format: (value) => money(value),
    },
    {
      id: "assignee",
      header: "Assignee",
      sortable: true,
      width: "10rem",
      editable: true,
      required: true,
    },
    { id: "city", header: "City", sortable: true, width: "9rem" },
    {
      id: "priority",
      header: "Priority",
      sortable: true,
      width: "7rem",
      cell: {
        type: "badge",
        tone: (value) => (value === "rush" ? "warning" : "info"),
        label: (value) => (value === "rush" ? "Rush" : "Standard"),
      },
    },
    { id: "note", header: "Note", editable: true, width: "14rem" },
  ];
}
