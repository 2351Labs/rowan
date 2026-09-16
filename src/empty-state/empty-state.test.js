import { expect } from "@esm-bundle/chai";
import "./empty-state.js";

const nextMicrotask = () => Promise.resolve();

async function waitForStyles(element) {
  const stylesheet = element.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (stylesheet.sheet) return;

  await new Promise((resolve, reject) => {
    stylesheet.addEventListener("load", resolve, { once: true });
    stylesheet.addEventListener("error", reject, { once: true });
  });
}

describe("rowan-empty-state", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders container and slots", async () => {
    const el = document.createElement("rowan-empty-state");
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelector(".container")).to.not.equal(null);
    expect(el.shadowRoot.querySelector("slot[name='title']")).to.not.equal(null);
  });

  it("projects icon, title, description, and action content into separate regions", async () => {
    const el = document.createElement("rowan-empty-state");
    const icon = document.createElement("span");
    icon.slot = "icon";
    const title = document.createElement("strong");
    title.slot = "title";
    const description = document.createElement("p");
    const action = document.createElement("button");
    action.slot = "actions";
    el.append(icon, title, description, action);
    document.body.append(el);
    await nextMicrotask();

    const iconSlot = el.shadowRoot.querySelector('slot[name="icon"]');
    const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
    const bodySlot = el.shadowRoot.querySelector(".body > slot");
    const actionsSlot = el.shadowRoot.querySelector('slot[name="actions"]');
    expect(iconSlot.assignedElements()[0] === icon).to.equal(true);
    expect(titleSlot.assignedElements()[0] === title).to.equal(true);
    expect(bodySlot.assignedElements()[0] === description).to.equal(true);
    expect(actionsSlot.assignedElements()[0] === action).to.equal(true);
    expect(el.shadowRoot.querySelector("h2").getAttribute("part")).to.equal("title");
  });

  it("exposes every documented styling part", async () => {
    const el = document.createElement("rowan-empty-state");
    document.body.append(el);
    await nextMicrotask();

    const parts = Array.from(el.shadowRoot.querySelectorAll("[part]"), (element) =>
      element.getAttribute("part"),
    );
    expect(parts).to.deep.equal(["container", "icon", "title", "body", "actions"]);
  });

  it("does not render while its host is hidden", async () => {
    const el = document.createElement("rowan-empty-state");
    document.body.append(el);
    await nextMicrotask();
    await waitForStyles(el);

    el.hidden = true;

    expect(getComputedStyle(el).display).to.equal("none");
  });
});
