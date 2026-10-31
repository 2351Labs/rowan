export const SAMPLE_CUSTOMER_ID = "cus-1001";
export const SAMPLE_ORDER_ID = "ord-4801";

export const LOCATIONS = [
  {
    id: "wh-sea",
    label: "Seattle warehouse",
    latitude: 47.6062,
    longitude: -122.3321,
    description: "Primary west fulfillment. Same-day cutoff 2pm.",
    layerId: "warehouses",
  },
  {
    id: "wh-chi",
    label: "Chicago warehouse",
    latitude: 41.8781,
    longitude: -87.6298,
    description: "Central cross-dock for wholesale releases.",
    layerId: "warehouses",
  },
  {
    id: "wh-atl",
    label: "Atlanta warehouse",
    latitude: 33.749,
    longitude: -84.388,
    description: "East replenishment and returns.",
    layerId: "warehouses",
  },
  {
    id: "wh-ewr",
    label: "Newark dock",
    latitude: 40.7357,
    longitude: -74.1724,
    description: "Inbound teak is one day behind schedule.",
    layerId: "delayed",
  },
  {
    id: "st-pdx",
    label: "Portland showroom",
    latitude: 45.5152,
    longitude: -122.6784,
    description: "Harbor & Pine appointments, Thu–Sat.",
    layerId: "showrooms",
  },
  {
    id: "st-aus",
    label: "Austin showroom",
    latitude: 30.2672,
    longitude: -97.7431,
    description: "Sable Studio trunk show this week.",
    layerId: "showrooms",
  },
  {
    id: "st-den",
    label: "Denver showroom",
    latitude: 39.7392,
    longitude: -104.9903,
    description: "Kindling Co. floor set.",
    layerId: "showrooms",
  },
  {
    id: "st-bos",
    label: "Boston showroom",
    latitude: 42.3601,
    longitude: -71.0589,
    description: "Lark Goods weekend hours.",
    layerId: "showrooms",
  },
];

export const MAP_LAYERS = [
  { id: "warehouses", label: "Warehouses", color: "#24543c", visible: true },
  { id: "showrooms", label: "Showrooms", color: "#9b7018", visible: true },
  { id: "delayed", label: "Delayed inbound", color: "#b4392d", visible: true },
];

const COMPANIES = [
  [
    "Northwind Traders",
    "Ada Mercer",
    "ada.mercer@northwind.example",
    "Seattle",
    "West",
    "Wholesale",
  ],
  ["Harbor & Pine", "Jonah Ellis", "jonah@harborpine.example", "Portland", "West", "Retail"],
  ["Cobalt Home", "Priya Shah", "priya.shah@cobalt.example", "Chicago", "Central", "Trade"],
  ["Sable Studio", "Elena Voss", "elena@sablestudio.example", "Austin", "Central", "Retail"],
  ["Kindling Co.", "Marcus Hale", "marcus@kindling.example", "Denver", "West", "Wholesale"],
  ["Lark Goods", "Nora Quinn", "nora@larkgoods.example", "Boston", "East", "Retail"],
  ["Fieldnote", "Chris Adelayo", "chris@fieldnote.example", "Atlanta", "East", "Trade"],
  ["Marlow Supply", "Helen Cho", "helen.cho@marlow.example", "Newark", "East", "Wholesale"],
  ["Brightline", "Samira Haddad", "samira@brightline.example", "Los Angeles", "West", "Retail"],
  ["Oak & Iron", "Ben Okonkwo", "ben@oakiron.example", "Minneapolis", "Central", "Wholesale"],
  ["Paper Lantern", "Yuki Tanaka", "yuki@paperlantern.example", "San Francisco", "West", "Trade"],
  ["Westloop Atelier", "Grace Nguyen", "grace@westloop.example", "Chicago", "Central", "Retail"],
  ["Cedar Route", "Owen Blake", "owen@cedarroute.example", "Salt Lake City", "West", "Wholesale"],
  [
    "Mesa Collective",
    "Lucia Fernandez",
    "lucia@mesacollective.example",
    "Phoenix",
    "West",
    "Retail",
  ],
  ["Northglass", "Erik Lind", "erik@northglass.example", "Minneapolis", "Central", "Trade"],
  ["Hearth Supply", "Amelia Brooks", "amelia@hearth.example", "Nashville", "Central", "Wholesale"],
  ["Kinfolk Market", "Diego Alvarez", "diego@kinfolk.example", "Miami", "East", "Retail"],
  ["Stillwater", "Fatima Noor", "fatima@stillwater.example", "Detroit", "Central", "Trade"],
];

const CATALOG = [
  { sku: "LN-CH-04", name: "Oak lounge chair", category: "Furniture", price: 640 },
  { sku: "LN-TB-11", name: "Walnut side table", category: "Furniture", price: 280 },
  { sku: "LN-SF-02", name: "Linen sofa, 2-seat", category: "Furniture", price: 1840 },
  { sku: "LN-LP-08", name: "Arc floor lamp", category: "Lighting", price: 220 },
  { sku: "LN-LP-03", name: "Opal pendant", category: "Lighting", price: 145 },
  { sku: "LN-TX-19", name: "Stonewashed throw", category: "Textiles", price: 78 },
  { sku: "LN-TX-07", name: "Wool rug, 8×10", category: "Textiles", price: 960 },
  { sku: "LN-OD-12", name: "Teak bench", category: "Outdoor", price: 720 },
  { sku: "LN-OD-05", name: "Planter, large", category: "Outdoor", price: 110 },
  { sku: "LN-CH-21", name: "Dining chair", category: "Furniture", price: 260 },
];

const STATUSES = [
  "paid",
  "packed",
  "shipped",
  "delivered",
  "delivered",
  "delivered",
  "hold",
  "cancelled",
];
const CHANNELS = ["Wholesale", "Wholesale", "Web", "Web", "Showroom"];
const ASSIGNEES = ["Maya Chen", "Priya Shah", "Owen Blake", "Luis Ortega"];
const ACCOUNT = ["active", "active", "active", "paused", "prospect"];
const SPEEDS = ["ground", "ground", "express"];
const NOTES = [
  "Leave with the receiving desk.",
  "Call ahead for the dock.",
  "Gift wrap the pendants.",
  "Hold the rug for inspection.",
  "",
  "",
];

function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(random, values) {
  return values[Math.floor(random() * values.length)];
}

function addDays(iso, days) {
  const [year, month, date] = iso.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

function buildCustomers() {
  return COMPANIES.map((company, index) => {
    const [name, contact, email, city, region, plan] = company;
    return {
      id: `cus-${1001 + index}`,
      name,
      contact,
      email,
      city,
      region,
      plan,
      status: ACCOUNT[index % ACCOUNT.length],
      since: addDays("2023-03-06", index * 17),
      orders: 0,
      lifetime: 0,
      phone: `206-555-${String(100 + index).padStart(4, "0")}`,
      postal: String(98101 + index * 13),
      notes: "",
    };
  });
}

function buildLines(random) {
  const count = 1 + Math.floor(random() * 4);
  const used = new Set();
  const lines = [];

  while (lines.length < count) {
    const item = CATALOG[Math.floor(random() * CATALOG.length)];
    if (used.has(item.sku)) continue;
    used.add(item.sku);
    const qty = 1 + Math.floor(random() * 4);
    lines.push({
      id: `${item.sku}-${lines.length + 1}`,
      sku: item.sku,
      name: item.name,
      category: item.category,
      price: item.price,
      qty,
    });
  }

  return lines;
}

function buildOrders(customers, random) {
  const orders = [];

  for (let index = 0; index < 96; index += 1) {
    const customer = customers[index % customers.length];
    const lines = buildLines(random);
    const items = lines.reduce((total, line) => total + line.qty, 0);
    const total = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
    const status = STATUSES[Math.floor(random() * STATUSES.length)];
    const note = pick(random, NOTES);
    const number = 4801 + index;

    orders.push({
      id: `ord-${number}`,
      number,
      customerId: customer.id,
      customer: customer.name,
      contact: customer.contact,
      email: customer.email,
      placed: addDays("2026-07-13", Math.floor(random() * 111)),
      channel: pick(random, CHANNELS),
      status,
      items,
      total,
      assignee: pick(random, ASSIGNEES),
      note,
      city: customer.city,
      region: customer.region,
      priority: total >= 1800 ? "rush" : "standard",
      lines,
      shipping: {
        recipient: customer.contact,
        line1: `${120 + (index % 40)} Market Street`,
        city: customer.city,
        region: customer.region,
        postal: customer.postal,
        phone: customer.phone,
        speed: pick(random, SPEEDS),
        signature: status === "hold" || total >= 1800,
      },
      comments: note
        ? [
            {
              id: `note-${number}`,
              author: "Maya Chen",
              at: addDays("2026-07-13", Math.floor(random() * 111)),
              body: note,
            },
          ]
        : [],
    });
  }

  return orders.sort(
    (left, right) => right.placed.localeCompare(left.placed) || right.number - left.number,
  );
}

export function createModel() {
  const random = mulberry32(20261031);
  const customers = buildCustomers();
  const orders = buildOrders(customers, random);

  for (const customer of customers) {
    const mine = orders.filter((order) => order.customerId === customer.id);
    customer.orders = mine.length;
    customer.lifetime = mine
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.total, 0);
  }

  const hold = orders.filter((order) => order.status === "hold").length;
  const notifications = [
    {
      id: "n1",
      title: "Orders on hold",
      body: `${hold} orders are waiting on a credit check or address fix.`,
      href: "#/orders",
      tone: "warning",
      unread: true,
    },
    {
      id: "n2",
      title: "Newark dock delay",
      body: "Inbound teak is a day behind. The map marks the delayed dock.",
      href: "#/map",
      tone: "warning",
      unread: true,
    },
    {
      id: "n3",
      title: "Lighting stock",
      body: "Opal pendant is under the low-stock threshold in settings.",
      href: "#/settings",
      tone: "info",
      unread: true,
    },
    {
      id: "n4",
      title: "Week close",
      body: "Revenue through Oct 31 is on the overview.",
      href: "#/",
      tone: "success",
      unread: false,
    },
  ];

  return { customers, orders, notifications, locations: LOCATIONS, layers: MAP_LAYERS };
}
