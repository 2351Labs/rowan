import { expect } from "@esm-bundle/chai";
import "./pagination.js";

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
    expect(changes).to.deep.equal([{ index: 1, size: null }]);
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
    expect(changes[0].detail).to.deep.equal({ index: 2, size: null });
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
});
