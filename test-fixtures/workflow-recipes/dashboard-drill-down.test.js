import { expect } from "@esm-bundle/chai";

import { createDashboardDrillDown } from "../../documentation/workflows/dashboard-drill-down.js";

const nextMicrotask = () => Promise.resolve();

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

function clickRowanButton(button) {
  const nativeButton = button?.shadowRoot?.querySelector("button");
  expect(nativeButton).to.not.equal(null);
  nativeButton.click();
}

describe("dashboard drill-down documentation workflow", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  for (const viewport of [
    { name: "desktop", inlineSize: "72rem" },
    { name: "mobile", inlineSize: "22rem" },
  ]) {
    it(`keeps the drill-down filter session application-owned at ${viewport.name} size`, async () => {
      const sessions = [];
      const routes = [];
      const dashboard = createDashboardDrillDown({
        onSessionChange: (detail) => sessions.push(detail),
        onRoute: (detail) => routes.push(detail),
      });
      dashboard.style.inlineSize = viewport.inlineSize;
      document.body.append(dashboard);
      await settle();

      const kpis = dashboard.querySelectorAll("rowan-kpi-card");
      const meta = dashboard.querySelectorAll("rowan-source-meta");
      const chart = dashboard.querySelector("rowan-bar-chart");
      const table = dashboard.querySelector("rowan-table");
      const clear = [...dashboard.querySelectorAll("rowan-button")].find(
        (button) => button.textContent === "Clear filters",
      );

      expect(kpis.length).to.equal(2);
      expect(meta.length).to.equal(4);
      expect(chart.interactive).to.equal(true);
      expect(table.rows).to.have.length(8);
      expect(clear).to.not.equal(undefined);
      expect(clear.disabled).to.equal(true);

      chart.dispatchEvent(
        new CustomEvent("rowan-point-activate", {
          bubbles: true,
          composed: true,
          detail: { label: "Tue" },
        }),
      );
      await settle();
      expect(table.rows.map((row) => row.id)).to.deep.equal(["tue-north", "tue-south"]);
      expect(sessions).to.deep.equal([{ filters: { day: "Tue" } }]);
      expect(clear.disabled).to.equal(false);

      const selectedRow = table.rows[0];
      table.dispatchEvent(
        new CustomEvent("rowan-select", {
          bubbles: true,
          composed: true,
          detail: { selectedRows: [selectedRow] },
        }),
      );
      await settle();
      expect(table.rows.map((row) => row.id)).to.deep.equal(["tue-north"]);
      expect(sessions).to.deep.equal([
        { filters: { day: "Tue" } },
        { filters: { day: "Tue", yard: "North" } },
      ]);

      table.dispatchEvent(
        new CustomEvent("rowan-row-activate", {
          bubbles: true,
          composed: true,
          detail: { row: table.rows[0], rowId: "tue-north" },
        }),
      );
      expect(routes).to.deep.equal([{ type: "shipment", rowId: "tue-north" }]);

      clickRowanButton(clear);
      await settle();
      expect(table.rows).to.have.length(8);
      expect(sessions).to.deep.equal([
        { filters: { day: "Tue" } },
        { filters: { day: "Tue", yard: "North" } },
        { filters: {} },
      ]);
      expect(clear.disabled).to.equal(true);
    });
  }
});
