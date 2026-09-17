import { expect } from "@esm-bundle/chai";
import "./pagination.js";
import "../table/table.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-pagination", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("disables previous button on first page", async () => {
    const el = document.createElement("rowan-pagination");
    el.page = 1;
    el.totalPages = 3;
    document.body.append(el);
    await nextMicrotask();

    const prev = el.shadowRoot.querySelector('button[data-action="prev"]');
    expect(prev.disabled).to.equal(true);
  });

  it("normalizes rendered state before emitting a user page change", async () => {
    const el = document.createElement("rowan-pagination");
    el.page = 5;
    el.totalPages = 5;
    document.body.append(el);
    await nextMicrotask();

    el.totalPages = 2;
    await nextMicrotask();

    const status = el.shadowRoot.querySelector(".status");
    const prev = el.shadowRoot.querySelector('button[data-action="prev"]');
    const next = el.shadowRoot.querySelector('button[data-action="next"]');
    const changes = [];
    el.addEventListener("rowan-page-change", (event) => changes.push(event.detail));

    expect(el.page).to.equal(2);
    expect(status.textContent).to.equal("Page 2 of 2");
    expect(next.disabled).to.equal(true);

    prev.click();
    await nextMicrotask();

    expect(el.page).to.equal(1);
    expect(status.textContent).to.equal("Page 1 of 2");
    expect(changes).to.deep.equal([{ index: 0, page: 1, size: null }]);
  });

  it("bounds next-page activation and emits only for a user-visible transition", async () => {
    const el = document.createElement("rowan-pagination");
    el.page = 0;
    el.totalPages = 2;
    document.body.append(el);
    await nextMicrotask();

    const changes = [];
    el.addEventListener("rowan-page-change", (event) => changes.push(event));

    const next = el.shadowRoot.querySelector('button[data-action="next"]');
    expect(el.page).to.equal(1);
    expect(el.getAttribute("page")).to.equal("1");
    expect(next.disabled).to.equal(false);

    next.click();
    await nextMicrotask();
    next.click();
    await nextMicrotask();

    expect(el.page).to.equal(2);
    expect(next.disabled).to.equal(true);
    expect(changes).to.have.length(1);
    expect(changes[0].detail).to.deep.equal({ index: 1, page: 2, size: null });
    expect(changes[0].bubbles).to.equal(true);
    expect(changes[0].composed).to.equal(true);
  });

  it("normalizes invalid numeric properties to a single disabled page", async () => {
    const el = document.createElement("rowan-pagination");
    el.page = Number.NaN;
    el.totalPages = -4;
    document.body.append(el);
    await nextMicrotask();

    expect(el.page).to.equal(1);
    expect(el.totalPages).to.equal(1);
    expect(el.shadowRoot.querySelector(".status").textContent).to.equal("Page 1 of 1");
    expect(el.shadowRoot.querySelector('[data-action="prev"]').disabled).to.equal(true);
    expect(el.shadowRoot.querySelector('[data-action="next"]').disabled).to.equal(true);
  });

  it("shares a 0-based index with rowan-table", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      page: { index: 0, size: 2, total: 3 },
      columns: [{ id: "name", header: "Name", type: "text" }],
      rows: [
        { id: "1", name: "Ada" },
        { id: "2", name: "Alan" },
        { id: "3", name: "Grace" },
      ],
    };
    const pagination = document.createElement("rowan-pagination");
    pagination.totalPages = 2;
    document.body.append(table, pagination);
    await nextMicrotask();

    pagination.addEventListener("rowan-page-change", (event) => {
      table.page = { ...table.page, index: event.detail.index };
    });

    pagination.shadowRoot.querySelector('[data-action="next"]').click();
    await nextMicrotask();

    expect(pagination.page).to.equal(2);
    expect(table.page.index).to.equal(1);
    expect(table.shadowRoot.querySelectorAll("tbody tr[data-row-id]").length).to.equal(1);
  });
});
