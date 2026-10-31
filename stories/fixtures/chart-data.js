/**
 * Shared chart data fixtures for Rowan Storybook.
 * All data is deterministic - no Math.random() without seed.
 */

// Seeded random for deterministic data generation
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// Monthly revenue data (12 months)
export const monthlyRevenue = [
  { month: "Jan", revenue: 45000, target: 50000 },
  { month: "Feb", revenue: 52000, target: 50000 },
  { month: "Mar", revenue: 48000, target: 52000 },
  { month: "Apr", revenue: 61000, target: 55000 },
  { month: "May", revenue: 58000, target: 58000 },
  { month: "Jun", revenue: 67000, target: 60000 },
  { month: "Jul", revenue: 71000, target: 65000 },
  { month: "Aug", revenue: 69000, target: 68000 },
  { month: "Sep", revenue: 73000, target: 70000 },
  { month: "Oct", revenue: 78000, target: 72000 },
  { month: "Nov", revenue: 82000, target: 75000 },
  { month: "Dec", revenue: 91000, target: 80000 },
];

// Multi-series revenue and costs (24 months)
export const revenueAndCosts = Array.from({ length: 24 }, (_, i) => {
  const month = new Date(2024, i, 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
  const trend = i * 2000;
  const seasonal = Math.sin((i / 12) * Math.PI * 2) * 5000;
  return {
    month,
    revenue: 50000 + trend + seasonal,
    costs: 30000 + trend * 0.6 + seasonal * 0.4,
    profit: 20000 + trend * 0.4 + seasonal * 0.6,
  };
});

// User metrics with sparse/missing values
export const userMetrics = [
  { date: "2024-01", users: 1200, activeUsers: 980, sessions: null },
  { date: "2024-02", users: 1350, activeUsers: 1100, sessions: 4500 },
  { date: "2024-03", users: 1480, activeUsers: null, sessions: 5100 },
  { date: "2024-04", users: 1620, activeUsers: 1380, sessions: 5800 },
  { date: "2024-05", users: null, activeUsers: 1450, sessions: 6200 },
  { date: "2024-06", users: 1890, activeUsers: 1620, sessions: 6900 },
  { date: "2024-07", users: 2010, activeUsers: 1750, sessions: 7400 },
  { date: "2024-08", users: 2150, activeUsers: 1880, sessions: null },
  { date: "2024-09", users: 2280, activeUsers: 2020, sessions: 8600 },
  { date: "2024-10", users: 2420, activeUsers: 2180, sessions: 9200 },
  { date: "2024-11", users: 2580, activeUsers: 2350, sessions: 9800 },
  { date: "2024-12", users: 2750, activeUsers: 2520, sessions: 10500 },
];

// Categorical data
export const productSales = [
  { product: "Dashboard Pro", sales: 45000, units: 450 },
  { product: "Analytics Suite", sales: 38000, units: 380 },
  { product: "Reporting Tool", sales: 31000, units: 620 },
  { product: "Data Explorer", sales: 28000, units: 560 },
  { product: "API Access", sales: 22000, units: 2200 },
  { product: "Mobile App", sales: 19000, units: 1900 },
];

// Regional sales (for stacked charts)
export const regionalSales = [
  { quarter: "Q1", north: 25000, south: 18000, east: 22000, west: 20000 },
  { quarter: "Q2", north: 28000, south: 21000, east: 24000, west: 23000 },
  { quarter: "Q3", north: 31000, south: 23000, east: 27000, west: 25000 },
  { quarter: "Q4", north: 34000, south: 26000, east: 29000, west: 28000 },
];

// Distribution data (for box plots, histograms)
export const responseTimeDistribution = [
  { range: "0-100ms", count: 450 },
  { range: "100-200ms", count: 1200 },
  { range: "200-300ms", count: 2300 },
  { range: "300-400ms", count: 1800 },
  { range: "400-500ms", count: 900 },
  { range: "500-600ms", count: 380 },
  { range: "600-700ms", count: 150 },
  { range: "700ms+", count: 80 },
];

// Funnel data
export const conversionFunnel = [
  { stage: "Visits", value: 10000, conversion: 100 },
  { stage: "Sign ups", value: 3500, conversion: 35 },
  { stage: "Trials", value: 1400, conversion: 14 },
  { stage: "Purchases", value: 420, conversion: 4.2 },
  { stage: "Renewals", value: 315, conversion: 3.15 },
];

// Gauge data
export const kpiValues = {
  serverUptime: 99.7,
  customerSat: 87,
  responseTime: 245,
  errorRate: 0.3,
  conversionRate: 4.2,
};

// Heatmap data (calendar or matrix)
export const weeklyActivity = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const rand = seededRandom(day * 100 + hour);
    const baseActivity = day >= 1 && day <= 5 ? 0.6 : 0.3; // Weekday vs weekend
    const hourFactor =
      hour >= 9 && hour <= 17 ? 1.0 : hour >= 18 && hour <= 22 ? 0.7 : 0.2;
    return Math.floor(rand() * 100 * baseActivity * hourFactor);
  }),
);

// Scatter plot data
export const customerSegments = Array.from({ length: 100 }, (_, i) => {
  const rand = seededRandom(i);
  return {
    id: i,
    spend: Math.floor(rand() * 50000) + 5000,
    frequency: Math.floor(rand() * 50) + 1,
    segment:
      i < 20 ? "Premium" : i < 50 ? "Regular" : i < 80 ? "Occasional" : "New",
  };
});

// Radar chart data (multi-dimensional)
export const productComparison = [
  {
    product: "Product A",
    performance: 85,
    reliability: 92,
    usability: 78,
    price: 65,
    support: 88,
  },
  {
    product: "Product B",
    performance: 78,
    reliability: 85,
    usability: 92,
    price: 88,
    support: 75,
  },
  {
    product: "Product C",
    performance: 92,
    reliability: 88,
    usability: 82,
    price: 58,
    support: 85,
  },
];

// Waterfall data (financial breakdown)
export const profitBreakdown = [
  { category: "Revenue", value: 500000, type: "total" },
  { category: "COGS", value: -180000, type: "decrease" },
  { category: "Gross Profit", value: 320000, type: "subtotal" },
  { category: "Marketing", value: -65000, type: "decrease" },
  { category: "Sales", value: -45000, type: "decrease" },
  { category: "R&D", value: -52000, type: "decrease" },
  { category: "Operations", value: -38000, type: "decrease" },
  { category: "Net Profit", value: 120000, type: "total" },
];

// Range/interval data
export const projectTimelines = [
  {
    project: "Website Redesign",
    start: new Date("2024-01-15"),
    end: new Date("2024-03-30"),
  },
  {
    project: "Mobile App",
    start: new Date("2024-02-01"),
    end: new Date("2024-05-15"),
  },
  {
    project: "API Integration",
    start: new Date("2024-03-10"),
    end: new Date("2024-04-20"),
  },
  {
    project: "Analytics Dashboard",
    start: new Date("2024-04-01"),
    end: new Date("2024-06-30"),
  },
];

// Combo chart data (mixed types)
export const salesAndMargin = monthlyRevenue.map((d) => ({
  ...d,
  margin: ((d.revenue - d.revenue * 0.6) / d.revenue) * 100,
  growth: 5.5,
}));

// Box plot statistical data
export const performanceStats = [
  { category: "API", min: 50, q1: 120, median: 180, q3: 280, max: 450 },
  { category: "Database", min: 20, q1: 45, median: 85, q3: 140, max: 320 },
  { category: "Frontend", min: 100, q1: 250, median: 400, q3: 620, max: 980 },
  { category: "Backend", min: 80, q1: 180, median: 320, q3: 520, max: 850 },
];

// Sparkline data (compact time series)
export const sparklineValues = {
  revenue: [45, 52, 48, 61, 58, 67, 71, 69, 73, 78, 82, 91],
  users: [12, 15, 14, 18, 19, 22, 25, 24, 27, 29, 31, 35],
  orders: [120, 145, 132, 178, 165, 192, 208, 195, 215, 228, 242, 267],
  negative: [5, 3, -2, 4, -1, 7, 2, -3, 6, 8, -2, 4],
};

// Large numbers with formatting needs
export const largeNumberMetrics = [
  { metric: "Total Users", value: 2450000, change: 12.5 },
  { metric: "Revenue", value: 12500000, change: 8.3 },
  { metric: "Transactions", value: 45600000, change: -2.1 },
  { metric: "Page Views", value: 125000000, change: 15.7 },
];

// Time series with gaps
export const incompleteTimeSeries = [
  { date: "2024-01", value: 100 },
  { date: "2024-02", value: 120 },
  { date: "2024-03", value: null }, // Gap
  { date: "2024-04", value: null }, // Gap
  { date: "2024-05", value: 145 },
  { date: "2024-06", value: 160 },
  { date: "2024-07", value: 155 },
  { date: "2024-08", value: null }, // Gap
  { date: "2024-09", value: 180 },
  { date: "2024-10", value: 195 },
];

// Negative values dataset
export const profitLossData = [
  { period: "Jan", profit: -5000 },
  { period: "Feb", profit: -2000 },
  { period: "Mar", profit: 1000 },
  { period: "Apr", profit: 3500 },
  { period: "May", profit: 2800 },
  { period: "Jun", profit: 5200 },
  { period: "Jul", profit: -1500 },
  { period: "Aug", profit: 4800 },
  { period: "Sep", profit: 6200 },
  { period: "Oct", profit: -800 },
  { period: "Nov", profit: 7500 },
  { period: "Dec", profit: 9200 },
];
