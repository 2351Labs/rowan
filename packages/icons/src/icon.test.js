import { expect } from "@esm-bundle/chai";
import { ArrowRight } from "@rowan-ui/icons/icons/arrow-right";
import { createIcon } from "./icon.js";

const CHECK_ICON = {
  name: "check",
  nodes: [["path", { d: "m5 12 4 4L19 6" }]],
};

describe("@rowan-ui/icons", () => {
  it("creates decorative icons by default", () => {
    const icon = createIcon(CHECK_ICON);

    expect(icon.localName).to.equal("svg");
    expect(icon.getAttribute("aria-hidden")).to.equal("true");
    expect(icon.hasAttribute("role")).to.equal(false);
    expect(icon.getAttribute("focusable")).to.equal("false");
    expect(icon.getAttribute("data-icon")).to.equal("check");
    expect(icon.querySelector("path")?.getAttribute("d")).to.equal("m5 12 4 4L19 6");
  });

  it("gives meaningful icons an explicit accessible name", () => {
    const icon = createIcon(CHECK_ICON, {
      className: "confirmation-icon",
      label: "Completed",
      size: 24,
      strokeWidth: 1.5,
    });

    expect(icon.getAttribute("aria-hidden")).to.equal(null);
    expect(icon.getAttribute("role")).to.equal("img");
    expect(icon.getAttribute("aria-label")).to.equal("Completed");
    expect(icon.getAttribute("class")).to.equal("confirmation-icon");
    expect(icon.getAttribute("width")).to.equal("24");
    expect(icon.getAttribute("height")).to.equal("24");
    expect(icon.getAttribute("stroke-width")).to.equal("1.5");
  });

  it("supports one-icon public imports without a runtime registry", () => {
    const icon = ArrowRight({ label: "Continue", size: "1.25rem" });

    expect(icon.getAttribute("data-icon")).to.equal("arrow-right");
    expect(icon.getAttribute("aria-label")).to.equal("Continue");
    expect(icon.getAttribute("width")).to.equal("1.25rem");
    expect(icon.querySelectorAll("path")).to.have.length.greaterThan(0);
  });

  it("rejects invalid icon definitions", () => {
    expect(() => createIcon(/** @type {any} */ (null))).to.throw(TypeError);
    expect(() => createIcon(/** @type {any} */ ({ name: "" }))).to.throw(TypeError);
  });
});