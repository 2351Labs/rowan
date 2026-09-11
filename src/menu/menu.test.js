import { expect } from "@esm-bundle/chai";
import "./menu.js";
import "../menu-item/menu-item.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-menu", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("emits rowan-change when menu item is clicked", async () => {
    const menu = document.createElement("rowan-menu");
    const item = document.createElement("rowan-menu-item");
    item.value = "edit";
    item.textContent = "Edit";
    menu.append(item);
    document.body.append(menu);
    await nextMicrotask();

    let detail = null;
    menu.addEventListener("rowan-change", (event) => {
      detail = event.detail;
    });

    item.shadowRoot.querySelector("button").click();
    expect(detail.value).to.equal("edit");
  });

  it("keeps one selection listener after reconnecting", async () => {
    const menu = document.createElement("rowan-menu");
    const item = document.createElement("rowan-menu-item");
    item.value = "edit";
    item.textContent = "Edit";
    menu.append(item);
    document.body.append(menu);
    await nextMicrotask();

    let eventCount = 0;
    menu.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    menu.remove();
    document.body.append(menu);
    await nextMicrotask();

    item.shadowRoot.querySelector("button").click();
    expect(eventCount).to.equal(1);
  });
});
