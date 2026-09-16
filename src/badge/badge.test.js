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

    element.setAttribute("tone", " SUCCESS ");
    element.setAttribute("size", " SM ");

    expect(element.tone).to.equal("success");
    expect(element.size).to.equal("sm");
    expect(element.getAttribute("tone")).to.equal("success");
    expect(element.getAttribute("size")).to.equal("sm");
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

  it("normalizes unsupported tone and size property values to documented defaults", async () => {
    const element = document.createElement("rowan-badge");
    element.tone = "loud";
    element.size = "xl";
    document.body.append(element);
    await nextMicrotask();

    expect(element.tone).to.equal("info");
    expect(element.size).to.equal("md");
    expect(element.hasAttribute("tone")).to.equal(false);
    expect(element.hasAttribute("size")).to.equal(false);

    element.setAttribute("tone", "loud");
    element.setAttribute("size", "xl");
    expect(element.tone).to.equal("info");
    expect(element.size).to.equal("md");
    expect(element.hasAttribute("tone")).to.equal(false);
    expect(element.hasAttribute("size")).to.equal(false);
  });

  it("uses unreflected default state and exposes its badge styling part", async () => {
    const element = document.createElement("rowan-badge");
    document.body.append(element);
    await nextMicrotask();

    expect(element.tone).to.equal("info");
    expect(element.size).to.equal("md");
    expect(element.hasAttribute("tone")).to.equal(false);
    expect(element.hasAttribute("size")).to.equal(false);
    expect(element.shadowRoot.querySelector(".badge").getAttribute("part")).to.equal("badge");
  });
});
