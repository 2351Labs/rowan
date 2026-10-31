import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import { RowanKpiCard } from "@rowan-ui/core/react/kpi-card";
import { RowanTable } from "@rowan-ui/core/react/table";
import { RowanTrendChart } from "@rowan-ui/core/react/trend-chart";
import { createRoot } from "react-dom/client";

import { LABELS, SERIES, TABLE_CONFIG } from "./sample.js";
import "./styles.css";

const cards = [
  { label: "Open orders", value: 42, delta: 4, tone: "info" },
  { label: "On time", value: "96%", delta: 2, tone: "success" },
  { label: "Exceptions", value: 3, delta: -1, tone: "warning" },
];

function App() {
  return (
    <main className="page">
      <header>
        <h1>Week of 27 Oct</h1>
        <p className="lede">A small Rowan dashboard. The figures are local sample data.</p>
      </header>
      <section className="kpis" aria-label="Key figures">
        {cards.map((card) => (
          <RowanKpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            delta={card.delta}
            deltaLabel="vs last week"
            tone={card.tone}
          />
        ))}
      </section>
      <section className="panel">
        <h2>Orders</h2>
        <RowanTrendChart
          label="Orders this week"
          description="Orders booked each day. Sample data, not a live feed."
          labels={LABELS}
          series={SERIES}
        />
      </section>
      <section className="panel">
        <h2>Recent orders</h2>
        <RowanTable caption="Recent orders" config={TABLE_CONFIG} />
      </section>
    </main>
  );
}

createRoot(document.querySelector("#app")).render(<App />);
