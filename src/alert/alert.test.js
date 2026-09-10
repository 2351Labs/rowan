import { expect } from "@esm-bundle/chai";
import "./alert.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-alert", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects tone between property and attribute", async () => {
    const alert = document.createElement("rowan-alert");
    document.body.append(alert);
    await nextMicrotask();

    alert.tone = "warning";
    expect(alert.getAttribute("tone")).to.equal("warning");

    alert.setAttribute("tone", "danger");
    expect(alert.tone).to.equal("danger");
  });

  it("emits rowan-dismiss and hides on close button click", async () => {
    const alert = document.createElement("rowan-alert");
    alert.setAttribute("dismissible", "");
    document.body.append(alert);
    await nextMicrotask();

    let dismissCount = 0;
    alert.addEventListener("rowan-dismiss", () => {
      dismissCount += 1;
    });

    const closeButton = alert.shadowRoot.querySelector('button[part="dismiss"]');
    closeButton.click();

    expect(dismissCount).to.equal(1);
    expect(alert.hasAttribute("hidden")).to.equal(true);
  });

  it("does not emit rowan-dismiss when parent toggles hidden", async () => {
    const alert = document.createElement("rowan-alert");
    alert.setAttribute("dismissible", "");
    document.body.append(alert);
    await nextMicrotask();

    let dismissCount = 0;
    alert.addEventListener("rowan-dismiss", () => {
      dismissCount += 1;
    });

    alert.hidden = true;
    await nextMicrotask();

    expect(dismissCount).to.equal(0);
  });
});
