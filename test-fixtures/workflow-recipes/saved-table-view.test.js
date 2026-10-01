import { expect } from "@esm-bundle/chai";

import { createSavedTableView } from "../../documentation/workflows/saved-table-view.js";

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

describe("saved table view documentation workflow", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  for (const viewport of [
    { name: "desktop", inlineSize: "72rem" },
    { name: "mobile", inlineSize: "22rem" },
  ]) {
    it(`keeps persistence application-owned and restore silent at ${viewport.name} size`, async () => {
      const persisted = [];
      const workflow = createSavedTableView({
        onPersist: (detail) => persisted.push(detail),
      });
      workflow.style.inlineSize = viewport.inlineSize;
      document.body.append(workflow);
      await settle();

      const table = workflow.querySelector("rowan-table");
      const toolbar = workflow.querySelector("rowan-table-toolbar");
      const filterBuilder = workflow.querySelector("rowan-filter-builder");
      const density = workflow.querySelector("rowan-select");
      const save = [...workflow.querySelectorAll("rowan-button")].find(
        (button) => button.textContent === "Save view",
      );
      const restore = [...workflow.querySelectorAll("rowan-button")].find(
        (button) => button.textContent === "Restore saved view",
      );
      let filterEvents = 0;
      let sortEvents = 0;

      filterBuilder.addEventListener("rowan-filter-change", () => {
        filterEvents += 1;
      });
      table.addEventListener("rowan-sort", () => {
        sortEvents += 1;
      });

      expect(table.rows).to.have.length(6);
      expect(table.sort).to.deep.equal({ id: "updated", dir: "desc" });
      expect(restore.disabled).to.equal(true);

      filterBuilder.dispatchEvent(
        new CustomEvent("rowan-filter-change", {
          bubbles: true,
          composed: true,
          detail: {
            filters: [{ id: "open-status", field: "status", operator: "equals", value: "Open" }],
          },
        }),
      );
      density.dispatchEvent(
        new CustomEvent("rowan-change", {
          bubbles: true,
          composed: true,
          detail: { value: "sm" },
        }),
      );
      await settle();

      const ownerColumn = toolbar.shadowRoot.querySelector('input[data-column-id="owner"]');
      ownerColumn.checked = false;
      ownerColumn.dispatchEvent(new Event("change", { bubbles: true }));
      await settle();

      expect(filterEvents).to.equal(1);
      expect(table.rows.map((row) => row.id)).to.deep.equal(["work-101", "work-103", "work-105"]);
      expect(table.density).to.equal("sm");
      expect(table.columns.find((column) => column.id === "owner")?.hidden).to.equal(true);

      clickRowanButton(save);
      await settle();
      expect(persisted).to.have.length(1);
      expect(persisted[0].view).to.deep.include({ density: "sm" });
      expect(persisted[0].view.filters).to.deep.equal([
        { id: "open-status", field: "status", operator: "equals", value: "Open" },
      ]);
      expect(persisted[0].view.visibleColumns).to.not.include("owner");
      expect(restore.disabled).to.equal(false);

      filterBuilder.filters = [];
      table.columns = table.columns.map((column) => ({ ...column, hidden: false }));
      table.density = "lg";
      table.sort = { id: "title", dir: "asc" };
      table.rows = [];
      await settle();

      const eventsBeforeRestore = { filterEvents, sortEvents };
      clickRowanButton(restore);
      await settle();

      expect(filterEvents).to.equal(eventsBeforeRestore.filterEvents);
      expect(sortEvents).to.equal(eventsBeforeRestore.sortEvents);
      expect(persisted).to.have.length(1);
      expect(table.rows.map((row) => row.id)).to.deep.equal(["work-101", "work-103", "work-105"]);
      expect(filterBuilder.filters).to.deep.equal([
        { id: "open-status", field: "status", operator: "equals", value: "Open" },
      ]);
      expect(table.density).to.equal("sm");
      expect(table.sort).to.deep.equal({ id: "updated", dir: "desc" });
      expect(table.columns.find((column) => column.id === "owner")?.hidden).to.equal(true);
    });
  }
});
