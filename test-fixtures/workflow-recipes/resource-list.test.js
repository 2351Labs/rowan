import { expect } from "@esm-bundle/chai";

import { createResourceList } from "../../documentation/workflows/resource-list.js";

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

describe("resource list documentation workflow", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  for (const viewport of [
    { name: "desktop", inlineSize: "72rem" },
    { name: "mobile", inlineSize: "22rem" },
  ]) {
    it(`keeps page, routing, and retry state application-owned at ${viewport.name} size`, async () => {
      const pages = [];
      const retries = [];
      const routes = [];
      const resourceList = createResourceList({
        onPageChange: (detail) => pages.push(detail),
        onRetry: () => retries.push("retry"),
        onRoute: (detail) => routes.push(detail),
      });
      resourceList.style.inlineSize = viewport.inlineSize;
      document.body.append(resourceList);
      await settle();

      const dataState = resourceList.querySelector("rowan-data-state");
      const table = resourceList.querySelector("rowan-table");
      const toolbar = resourceList.querySelector("rowan-table-toolbar");
      const pagination = resourceList.querySelector("rowan-pagination");
      const retry = resourceList.querySelector('rowan-button[slot="actions"]');
      expect(dataState).to.not.equal(null);
      expect(table).to.not.equal(null);
      expect(toolbar).to.not.equal(null);
      expect(pagination).to.not.equal(null);
      expect(retry).to.not.equal(null);
      expect(dataState.state).to.equal("ready");
      expect(table.rows.map((row) => row.id)).to.deep.equal([
        "resource-100",
        "resource-101",
        "resource-102",
      ]);

      const region = toolbar.shadowRoot.querySelector('input[data-column-id="region"]');
      region.checked = false;
      region.dispatchEvent(new Event("change", { bubbles: true }));
      await settle();
      expect(table.columns.find((column) => column.id === "region")?.hidden).to.equal(true);

      pagination.shadowRoot.querySelector('[data-action="next"]').click();
      await settle();
      expect(pages).to.deep.equal([{ index: 1, page: 2 }]);
      expect(table.rows.map((row) => row.id)).to.deep.equal([
        "resource-103",
        "resource-104",
        "resource-105",
      ]);

      const row = table.rows[0];
      table.dispatchEvent(
        new CustomEvent("rowan-row-activate", {
          bubbles: true,
          composed: true,
          detail: { row, rowId: row.id },
        }),
      );
      expect(routes).to.deep.equal([{ type: "resource", rowId: "resource-103" }]);

      dataState.state = "error";
      await settle();
      expect(dataState.state).to.equal("error");
      clickRowanButton(retry);
      await settle();
      expect(retries).to.deep.equal(["retry"]);
      expect(dataState.state).to.equal("ready");
      expect(table.rows.map((row) => row.id)).to.deep.equal([
        "resource-100",
        "resource-101",
        "resource-102",
      ]);
    });
  }
});
