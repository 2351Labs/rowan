import { expect } from "@esm-bundle/chai";
import "./status-indicator.js";

const wait = () => Promise.resolve();

describe("rowan-status-indicator", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("normalizes reflected tone and size values", async () => {
    const indicator = document.createElement("rowan-status-indicator");
    document.body.append(indicator);
    await wait();

    indicator.tone = "success";
    indicator.size = "lg";

    expect(indicator.getAttribute("tone")).to.equal("success");
    expect(indicator.getAttribute("size")).to.equal("lg");

    indicator.tone = "not-a-tone";
    indicator.size = "not-a-size";

    expect(indicator.tone).to.equal("neutral");
    expect(indicator.size).to.equal("md");
    expect(indicator.hasAttribute("tone")).to.equal(false);
    expect(indicator.hasAttribute("size")).to.equal(false);

    indicator.setAttribute("tone", " WARNING ");
    indicator.setAttribute("size", " SM ");
    expect(indicator.tone).to.equal("warning");
    expect(indicator.size).to.equal("sm");
    expect(indicator.getAttribute("tone")).to.equal("warning");
    expect(indicator.getAttribute("size")).to.equal("sm");
  });

  it("renders its label attribute as fallback content", async () => {
    const indicator = document.createElement("rowan-status-indicator");
    indicator.label = "Syncing";
    indicator.pulse = true;
    document.body.append(indicator);
    await wait();

    const fallback = indicator.shadowRoot.querySelector(".label-fallback");
    expect(fallback.textContent).to.equal("Syncing");
    expect(fallback.hidden).to.equal(false);
    expect(indicator.hasAttribute("pulse")).to.equal(true);
  });

  it("uses slotted text instead of its label fallback", async () => {
    const indicator = document.createElement("rowan-status-indicator");
    indicator.label = "Fallback";
    indicator.textContent = "Online";
    document.body.append(indicator);
    await wait();
    await wait();

    expect(indicator.shadowRoot.querySelector(".label-fallback").hidden).to.equal(true);
    expect(
      indicator.shadowRoot.querySelector("slot").assignedNodes()[0].textContent.trim(),
    ).to.equal("Online");
  });

  it("preserves an author-provided semantic role", async () => {
    const indicator = document.createElement("rowan-status-indicator");
    indicator.setAttribute("role", "img");
    indicator.setAttribute("aria-label", "Service is available");
    document.body.append(indicator);
    await wait();

    expect(indicator.getAttribute("role")).to.equal("img");
    expect(indicator.getAttribute("aria-label")).to.equal("Service is available");
  });
});
