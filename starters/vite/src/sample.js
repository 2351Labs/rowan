export const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const SERIES = [
  { id: "orders", label: "Orders", values: [12, 18, 15, 22, 19, 14] },
];

export const TABLE_CONFIG = {
  rowId: "id",
  columns: [
    { id: "order", header: "Order", sortable: true },
    { id: "account", header: "Account", sortable: true },
    { id: "status", header: "Status", type: "badge" },
    { id: "total", header: "Total", type: "number", align: "end", sortable: true },
  ],
  rows: [
    { id: "ord-4801", order: "4801", account: "Northwind", status: "Packing", total: 1840 },
    { id: "ord-4802", order: "4802", account: "Contoso", status: "Shipped", total: 960 },
    { id: "ord-4803", order: "4803", account: "Fabrikam", status: "Hold", total: 420 },
    { id: "ord-4804", order: "4804", account: "Adventure", status: "Packing", total: 2310 },
    { id: "ord-4805", order: "4805", account: "Wide World", status: "Shipped", total: 705 },
  ],
};
