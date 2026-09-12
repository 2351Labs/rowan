import { expect } from "@esm-bundle/chai";
import "./option.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-option", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects its primitive state and supplies option semantics", async () => {
    const option = document.createElement("rowan-option");
    option.value = "design";
    option.label = "Design";
    option.selected = true;
    document.body.append(option);
    await nextMicrotask();

    expect(option.getAttribute("value")).to.equal("design");
    expect(option.getAttribute("label")).to.equal("Design");
    expect(option.hasAttribute("selected")).to.equal(true);
    expect(option.internals.role).to.equal("option");
    expect(option.internals.ariaSelected).to.equal("true");
  });

  it("renders a label attribute when no label is slotted", async () => {
    const option = document.createElement("rowan-option");
    option.label = "Engineering";
    document.body.append(option);
    await nextMicrotask();

    expect(option.shadowRoot.querySelector(".label-fallback").textContent).to.equal("Engineering");
    expect(option.shadowRoot.querySelector(".label-fallback").hidden).to.equal(false);
  });
});
