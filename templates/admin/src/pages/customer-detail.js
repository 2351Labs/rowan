import { customerOrders, findCustomer } from "../api.js";
import { button, field, h, icon } from "../dom.js";
import { bindForm } from "../forms.js";
import { money, shortDate } from "../format.js";
import { CUSTOMER_STATUSES, ORDER_STATUSES, PLANS, labelFor, toneFor } from "../labels.js";

export function renderCustomerDetail(outlet, ctx) {
  const customer = findCustomer(ctx.store, ctx.params[0]);
  const page = h("div", { class: "page", "data-page": "customer", "data-ready": "true" });

  if (!customer) {
    const missing = h("rowan-empty-state");
    missing.append(
      icon("circle-alert", "icon"),
      h("span", { slot: "title", text: "Account not found" }),
      h("p", { text: "That account is not in the sample data." }),
      h("rowan-link", { slot: "actions", href: "#/customers" }, "Back to customers"),
    );
    page.append(h("h1", { tabindex: "-1", text: "Customer" }), missing);
    outlet.append(page);
    return;
  }

  const header = h("header", { class: "page-header" });
  const intro = h("div", { class: "stack tight" });
  const crumb = h("rowan-breadcrumb");
  crumb.append(
    h("rowan-link", { href: "#/customers" }, "Customers"),
    h("span", { text: "/" }),
    h("span", { "aria-current": "page", text: customer.name }),
  );
  const title = h("div", { class: "cluster" });
  const avatar = h("rowan-avatar", { name: customer.contact, size: "md" });
  title.append(
    avatar,
    h("h1", { tabindex: "-1", text: customer.name }),
    h("rowan-badge", {
      tone: toneFor(CUSTOMER_STATUSES, customer.status),
      text: labelFor(CUSTOMER_STATUSES, customer.status),
    }),
    h("rowan-chip", { tone: "info", text: customer.plan }),
  );
  intro.append(
    crumb,
    title,
    h("p", {
      class: "lede",
      text: `${customer.contact} · ${customer.city}, ${customer.region} · customer since ${shortDate(customer.since)}`,
    }),
  );
  header.append(intro);

  const tabs = h("rowan-tabs", { value: "profile" });
  tabs.append(
    h("rowan-tab", { value: "profile" }, "Profile"),
    h("rowan-tab", { value: "orders" }, "Orders"),
    h("rowan-tab", { value: "notes" }, "Notes"),
  );

  const profile = h("rowan-tab-panel", { value: "profile" });
  const form = h("form", { id: "customer-form", class: "stack" });
  const summary = h("rowan-validation-summary", {
    "for-form": "customer-form",
    heading: "Check the account",
    hidden: true,
  });
  const name = h("rowan-text-field", {
    id: "customer-name",
    name: "name",
    label: "Account name",
    required: true,
    value: customer.name,
  });
  const contact = h("rowan-text-field", {
    id: "customer-contact",
    name: "contact",
    label: "Buyer",
    required: true,
    value: customer.contact,
  });
  const email = h("rowan-text-field", {
    id: "customer-email",
    name: "email",
    type: "email",
    label: "Email",
    required: true,
    value: customer.email,
    autocomplete: "email",
  });
  const city = h("rowan-text-field", {
    id: "customer-city",
    name: "city",
    label: "City",
    required: true,
    value: customer.city,
  });
  const plan = h("rowan-select", {
    id: "customer-plan",
    name: "plan",
    label: "Plan",
    required: true,
  });
  plan.options = PLANS;
  plan.value = customer.plan;
  const status = h("rowan-select", {
    id: "customer-status",
    name: "status",
    label: "Status",
    required: true,
  });
  status.options = CUSTOMER_STATUSES;
  status.value = customer.status;
  const layout = h("rowan-form-layout", { columns: "2" });
  layout.append(
    field("Account name", name, { required: true }),
    field("Buyer", contact, { required: true }),
    field("Email", email, { required: true, span: "2" }),
    field("City", city, { required: true }),
    field("Plan", plan, { required: true }),
    field("Status", status, { required: true }),
  );
  form.append(
    summary,
    layout,
    h("div", { class: "form-actions" }, button("Save account", { type: "submit" })),
  );
  profile.append(form);

  const ordersPanel = h("rowan-tab-panel", { value: "orders" });
  const orders = customerOrders(ctx.store, customer.id);
  const table = h("rowan-table", {
    caption: `Orders for ${customer.name}`,
    "caption-visually-hidden": true,
    density: "sm",
    locale: "en-US",
  });
  table.rowActivate = "dblclick";
  table.config = {
    rowId: "id",
    page: orders.length > 5 ? { index: 0, size: 5 } : null,
    columns: [
      {
        id: "number",
        header: "Order",
        sortable: true,
        cell: {
          type: "link",
          href: (_value, row) => `#/orders/${row.id}`,
          label: (value) => `#${value}`,
        },
      },
      { id: "placed", header: "Placed", type: "date", sortable: true },
      { id: "channel", header: "Channel", sortable: true, cell: { type: "badge", tone: "info" } },
      {
        id: "status",
        header: "Status",
        sortable: true,
        cell: {
          type: "badge",
          tone: (value) => toneFor(ORDER_STATUSES, value),
          label: (value) => labelFor(ORDER_STATUSES, value),
        },
      },
      {
        id: "total",
        header: "Total",
        align: "end",
        sortable: true,
        format: (value) => money(value),
      },
    ],
    rows: orders,
  };
  ordersPanel.append(
    h("p", {
      class: "quiet",
      text: `${customer.orders} orders · ${money(customer.lifetime)} lifetime, excluding cancelled.`,
    }),
    orders.length ? table : emptyOrders(),
  );

  const notes = h("rowan-tab-panel", { value: "notes" });
  const note = h("rowan-textarea", {
    id: "customer-notes",
    name: "notes",
    label: "Account notes",
    rows: "5",
    value: customer.notes,
  });
  const noteForm = h("form", { id: "customer-notes-form", class: "stack" });
  noteForm.append(
    field("Account notes", note, { hint: "Kept in the sample store until refresh." }),
  );
  noteForm.append(
    h(
      "div",
      { class: "form-actions" },
      button("Save notes", { type: "submit", variant: "secondary" }),
    ),
  );
  notes.append(noteForm);

  tabs.append(profile, ordersPanel, notes);
  page.append(header, tabs);
  outlet.append(page);

  bindForm(form, {
    summary,
    onValid(values) {
      const previous = customer.name;
      Object.assign(customer, values);
      avatar.name = customer.contact;
      if (previous !== customer.name) {
        for (const order of ctx.store.orders) {
          if (order.customerId === customer.id) order.customer = customer.name;
        }
      }
      title.querySelector("h1").textContent = customer.name;
      ctx.toaster.show({ title: "Account saved", message: customer.name, tone: "success" });
    },
  });
  noteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    customer.notes = note.value;
    ctx.toaster.show({ title: "Notes saved", message: customer.name, tone: "success" });
  });
  table.addEventListener("rowan-row-activate", (event) => {
    const id = event.detail?.row?.id;
    if (id) ctx.navigate(`#/orders/${id}`);
  });
}

function emptyOrders() {
  const empty = h("rowan-empty-state");
  empty.append(
    h("span", { slot: "title", text: "No orders yet" }),
    h("p", { text: "This account has no sample orders." }),
  );
  return empty;
}
