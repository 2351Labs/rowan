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
});
