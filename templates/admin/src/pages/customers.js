import { queryCustomers } from "../api.js";
import { money } from "../format.js";
import { CUSTOMER_STATUSES, PLANS, REGIONS, labelFor, toneFor } from "../labels.js";
import { loadSettings } from "../settings-store.js";
import { h } from "../dom.js";
import { mountServerTable } from "../tables.js";

export function renderCustomers(outlet, ctx) {
  const settings = loadSettings();
  const page = h("div", { class: "page", "data-page": "customers", "data-ready": "true" });
  const header = h("header", { class: "page-header" });
  header.append(
    h(
      "div",
      {},
      h("h1", { tabindex: "-1", text: "Customers" }),
      h("p", {
        class: "lede",
        text: "Accounts are loaded from the same local service as orders. Edit email or status in the cell. Lifetime value excludes cancelled orders.",
      }),
    ),
  );

  page.append(header);
  mountServerTable(page, {
    id: "customers-table",
    caption: "Customers",
    columns: customerColumns(),
    density: settings.density,
    searchLabel: "Search customers",
    searchPlaceholder: "Name, contact, email, city",
    statusOptions: CUSTOMER_STATUSES,
    filterFields: [
      { id: "name", label: "Account", type: "text" },
      { id: "email", label: "Email", type: "text" },
      { id: "city", label: "City", type: "text" },
      { id: "region", label: "Region", type: "select", options: REGIONS },
      { id: "plan", label: "Plan", type: "select", options: PLANS },
      { id: "status", label: "Status", type: "select", options: CUSTOMER_STATUSES },
      { id: "lifetime", label: "Lifetime value", type: "number" },
    ],
    query: (request) => queryCustomers(ctx.store, request, { fail: request.fail }),
    filename: "lumen-customers.csv",
    emptyTitle: "No accounts match",
    emptyMessage: "Clear the search or filters to see every sample account.",
    toast: (input) => ctx.toaster.show(input),
    bulkLabel: "Selected accounts",
    bulkActions: [{ id: "active", label: "Mark active" }],
    onActivate(row) {
      ctx.navigate(`#/customers/${row.id}`);
    },
    onEdit(detail) {
      const customer = ctx.store.customers.find((entry) => entry.id === detail.rowId);
      if (!customer) return;
      customer[detail.columnId] = detail.value;
      if (detail.columnId === "name") {
        for (const order of ctx.store.orders) {
          if (order.customerId === customer.id) order.customer = detail.value;
        }
      }
    },
    onBulk(action, selected, helpers) {
      if (action !== "active") return;
      for (const id of selected) {
        const customer = ctx.store.customers.find((entry) => entry.id === id);
        if (customer) customer.status = "active";
      }
      helpers.clear();
      helpers.reload();
      ctx.toaster.show({
        title: "Accounts updated",
        message: `${selected.length} selected accounts marked active.`,
        tone: "success",
      });
    },
  });

  outlet.append(page);
}

function customerColumns() {
  return [
    {
      id: "name",
      header: "Account",
      sortable: true,
      width: "14rem",
      editable: true,
      required: true,
      cell: {
        type: "link",
        href: (_value, row) => `#/customers/${row.id}`,
      },
    },
    {
      id: "contact",
      header: "Buyer",
      sortable: true,
      width: "10rem",
      editable: true,
      required: true,
    },
    {
      id: "email",
      header: "Email",
      sortable: true,
      width: "16rem",
      editable: true,
      validate: (value) => (String(value).includes("@") ? true : "Enter an email address"),
    },
    { id: "city", header: "City", sortable: true, width: "9rem" },
    { id: "region", header: "Region", sortable: true, width: "7rem" },
    {
      id: "plan",
      header: "Plan",
      sortable: true,
      width: "8rem",
      cell: { type: "badge", tone: "info" },
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      width: "8rem",
      editable: true,
      editor: {
        type: "select",
        options: CUSTOMER_STATUSES.map((status) => ({ value: status.value, label: status.label })),
      },
      cell: {
        type: "badge",
        tone: (value) => toneFor(CUSTOMER_STATUSES, value),
        label: (value) => labelFor(CUSTOMER_STATUSES, value),
      },
    },
    { id: "since", header: "Customer since", type: "date", sortable: true, width: "9rem" },
    {
      id: "orders",
      header: "Orders",
      type: "number",
      sortable: true,
      align: "end",
      width: "6rem",
      headerCell: { tooltip: "All orders, including cancelled" },
    },
    {
      id: "lifetime",
      header: "Lifetime",
      sortable: true,
      align: "end",
      width: "8rem",
      format: (value) => money(value),
      headerCell: { tooltip: "Excludes cancelled orders" },
    },
  ];
}
