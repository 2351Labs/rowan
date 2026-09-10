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
});
