export const ORDER_STATUSES = [
  { value: "paid", label: "Paid", tone: "info" },
  { value: "packed", label: "Packed", tone: "warning" },
  { value: "shipped", label: "Shipped", tone: "info" },
  { value: "delivered", label: "Delivered", tone: "success" },
  { value: "hold", label: "On hold", tone: "warning" },
  { value: "cancelled", label: "Cancelled", tone: "danger" },
];

export const CUSTOMER_STATUSES = [
  { value: "active", label: "Active", tone: "success" },
  { value: "paused", label: "Paused", tone: "warning" },
  { value: "prospect", label: "Prospect", tone: "info" },
];

export const CHANNELS = ["Wholesale", "Web", "Showroom"];
export const PLANS = ["Wholesale", "Retail", "Trade"];
export const REGIONS = ["West", "Central", "East"];

export function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label || String(value ?? "");
}

export function toneFor(options, value) {
  return options.find((option) => option.value === value)?.tone || "info";
}

export function fulfillmentStep(status) {
  if (status === "packed" || status === "hold") return 2;
  if (status === "shipped") return 3;
  if (status === "delivered") return 4;
  return 1;
}
