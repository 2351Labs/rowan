import { signedPercentPoints } from "./format.js";

export function addDays(iso, days) {
  const [year, month, date] = iso.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

export function inRange(iso, start, end) {
  if (start && iso < start) return false;
  if (end && iso > end) return false;
  return true;
}

function weekStart(iso) {
  const [year, month, date] = iso.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  const day = utc.getUTCDay();
  const shift = day === 0 ? -6 : 1 - day;
  utc.setUTCDate(utc.getUTCDate() + shift);
  return utc.toISOString().slice(0, 10);
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function rangeEnd(orders, end) {
  if (end) return end;
  return orders.reduce(
    (latest, order) => (order.placed > latest ? order.placed : latest),
    "2026-07-13",
  );
}

export function summarize(orders, { start = "", end = "" } = {}) {
  const scoped = orders.filter((order) => inRange(order.placed, start, end));
  const active = scoped.filter((order) => order.status !== "cancelled");
  const revenue = sum(active.map((order) => order.total));
  const count = active.length;
  const aov = count ? revenue / count : 0;
  const fulfilled = active.filter(
    (order) => order.status === "shipped" || order.status === "delivered",
  ).length;
  const rate = count ? fulfilled / count : 0;
  const weeks = weekSeries(active, start, end || rangeEnd(active, end));
  const deltas = periodDelta(active, end || "2026-10-31");
  const channels = ["Wholesale", "Web", "Showroom"].map((label) => ({
    label,
    orders: active.filter((order) => order.channel === label).length,
    revenue: sum(active.filter((order) => order.channel === label).map((order) => order.total)),
  }));
  const statuses = ["paid", "packed", "shipped", "delivered", "hold"].map((status) => ({
    status,
    count: active.filter((order) => order.status === status).length,
  }));

  return {
    revenue,
    count,
    aov,
    rate,
    weeks,
    deltas,
    channels,
    statuses,
    categories: categoryMix(active),
    active,
    empty: active.length === 0,
  };
}

function weekSeries(orders, start, end) {
  const first = start ? weekStart(start) : weekStart("2026-07-13");
  const last = weekStart(end || "2026-10-31");
  const buckets = [];
  for (let cursor = first; cursor <= last; cursor = addDays(cursor, 7)) {
    buckets.push({
      start: cursor,
      wholesale: 0,
      web: 0,
      showroom: 0,
      units: 0,
      revenue: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    const key = weekStart(order.placed);
    const bucket = buckets.find((entry) => entry.start === key);
    if (!bucket) continue;
    bucket.orders += 1;
    bucket.units += order.items;
    bucket.revenue += order.total;
    if (order.channel === "Wholesale") bucket.wholesale += order.total;
    else if (order.channel === "Web") bucket.web += order.total;
    else bucket.showroom += order.total;
  }

  return buckets;
}

function periodDelta(orders, end) {
  const recentStart = addDays(end, -27);
  const priorEnd = addDays(recentStart, -1);
  const priorStart = addDays(priorEnd, -27);
  const recent = orders.filter((order) => order.placed >= recentStart && order.placed <= end);
  const prior = orders.filter((order) => order.placed >= priorStart && order.placed <= priorEnd);
  const recentRevenue = sum(recent.map((order) => order.total));
  const priorRevenue = sum(prior.map((order) => order.total));
  const recentAov = recent.length ? recentRevenue / recent.length : 0;
  const priorAov = prior.length ? priorRevenue / prior.length : 0;
  const recentRate = ratio(recent);
  const priorRate = ratio(prior);

  return {
    revenue: signedPercentPoints(recentRevenue, priorRevenue),
    count: signedPercentPoints(recent.length, prior.length),
    aov: signedPercentPoints(recentAov, priorAov),
    rate: signedPercentPoints(recentRate, priorRate),
  };
}

function ratio(orders) {
  if (orders.length === 0) return 0;
  const fulfilled = orders.filter(
    (order) => order.status === "shipped" || order.status === "delivered",
  ).length;
  return fulfilled / orders.length;
}

function categoryMix(orders) {
  const totals = new Map([
    ["Furniture", 0],
    ["Lighting", 0],
    ["Textiles", 0],
    ["Outdoor", 0],
  ]);

  for (const order of orders) {
    for (const line of order.lines) {
      totals.set(line.category, (totals.get(line.category) || 0) + line.qty * line.price);
    }
  }

  return [...totals.entries()].map(([label, value]) => ({ label, value }));
}

export const WINDOW_START = "2026-07-13";
export const WINDOW_END = "2026-10-31";
