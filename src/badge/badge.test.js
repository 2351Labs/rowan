import { expect } from "@esm-bundle/chai";
import "./badge.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-badge", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects tone and size attributes", async () => {
    const element = document.createElement("rowan-badge");
    document.body.append(element);
    await nextMicrotask();

    element.tone = "warning";
    element.size = "lg";

    expect(element.getAttribute("tone")).to.equal("warning");
    expect(element.getAttribute("size")).to.equal("lg");

    element.setAttribute("tone", "success");
    element.setAttribute("size", "sm");

    expect(element.tone).to.equal("success");
    expect(element.size).to.equal("sm");
  });

  it("renders slotted text content", async () => {
    const element = document.createElement("rowan-badge");
    element.textContent = "Admin";
    document.body.append(element);
    await nextMicrotask();

    const slot = element.shadowRoot.querySelector("slot");
    const assignedText = slot
      .assignedNodes()
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();

    expect(assignedText).to.equal("Admin");
  });
});
