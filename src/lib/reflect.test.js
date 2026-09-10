import { expect } from "@esm-bundle/chai";
import {
  readBooleanAttribute,
  readNumberAttribute,
  readStringAttribute,
  reflectBooleanAttribute,
  reflectNumberAttribute,
  reflectStringAttribute,
} from "./reflect.js";

describe("reflect helpers", () => {
  it("reflects boolean attributes by presence", () => {
    const element = document.createElement("div");

    reflectBooleanAttribute(element, "disabled", true);
    expect(element.hasAttribute("disabled")).to.equal(true);
    expect(readBooleanAttribute(element, "disabled")).to.equal(true);

    reflectBooleanAttribute(element, "disabled", false);
    expect(element.hasAttribute("disabled")).to.equal(false);
    expect(readBooleanAttribute(element, "disabled")).to.equal(false);
  });

  it("reflects string attributes and removes empty values", () => {
    const element = document.createElement("div");

    reflectStringAttribute(element, "label", "Forest");
    expect(element.getAttribute("label")).to.equal("Forest");
    expect(readStringAttribute(element, "label", "fallback")).to.equal("Forest");

    reflectStringAttribute(element, "label", "");
    expect(element.hasAttribute("label")).to.equal(false);
    expect(readStringAttribute(element, "label", "fallback")).to.equal("fallback");
  });

  it("reflects number attributes and uses fallback for invalid values", () => {
    const element = document.createElement("div");

    reflectNumberAttribute(element, "count", 7);
    expect(element.getAttribute("count")).to.equal("7");
    expect(readNumberAttribute(element, "count", 0)).to.equal(7);

    element.setAttribute("count", "not-a-number");
    expect(readNumberAttribute(element, "count", 3)).to.equal(3);

    reflectNumberAttribute(element, "count", Number.NaN);
    expect(element.hasAttribute("count")).to.equal(false);
  });
});
