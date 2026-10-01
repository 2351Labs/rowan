import { expect } from "@esm-bundle/chai";

import { createInvestigationQueue } from "../../documentation/workflows/investigation-queue.js";

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

describe("investigation queue documentation workflow", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  for (const viewport of [
    { name: "desktop", inlineSize: "72rem" },
    { name: "mobile", inlineSize: "22rem" },
  ]) {
    it(`keeps application-owned filtering, persistence, and routing at ${viewport.name} size`, async () => {
      const persisted = [];
      const routes = [];
      const queue = createInvestigationQueue({
        onPersist: (detail) => persisted.push(detail),
        onRoute: (detail) => routes.push(detail),
      });
      queue.style.inlineSize = viewport.inlineSize;
      document.body.append(queue);
      await settle();

      const table = queue.querySelector("rowan-table");
      const builder = queue.querySelector("rowan-filter-builder");
      const bulkActions = queue.querySelector("rowan-bulk-actions-bar");
      const details = queue.querySelector("rowan-row-details-panel");
      expect(table).to.not.equal(null);
      expect(builder).to.not.equal(null);
      expect(bulkActions).to.not.equal(null);
      expect(details).to.not.equal(null);
      expect(table.rows).to.have.length(5);

      builder.dispatchEvent(
        new CustomEvent("rowan-filter-change", {
          bubbles: true,
          composed: true,
          detail: {
            filters: [
              { id: "status", field: "status", operator: "equals", value: "Investigating" },
            ],
          },
        }),
      );
      await settle();
      expect(table.rows.map((row) => row.id)).to.deep.equal(["inc-1042", "inc-1046"]);

      table.selected = ["inc-1042"];
      await settle();
      expect(bulkActions.selectedCount).to.equal(1);
      clickRowanButton(bulkActions.shadowRoot.querySelector('[data-bulk-action="assign-triage"]'));
      await settle();

      expect(table.rows.find((row) => row.id === "inc-1042")?.owner).to.equal("Triage");
      expect(persisted).to.have.length(1);
      expect(persisted[0].action).to.equal("assign-triage");
      expect(persisted[0].selected).to.deep.equal(["inc-1042"]);

      const row = table.rows.find((item) => item.id === "inc-1042");
      table.dispatchEvent(
        new CustomEvent("rowan-row-activate", {
          bubbles: true,
          composed: true,
          detail: { row, rowId: "inc-1042" },
        }),
      );
      await settle();

      expect(details.open).to.equal(true);
      expect(routes).to.deep.equal([{ type: "inspect", rowId: "inc-1042" }]);
    });
  }
});
