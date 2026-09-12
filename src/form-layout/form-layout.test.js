import { expect } from "@esm-bundle/chai";
import "../form-field/form-field.js";
import "./form-layout.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

describe("rowan-form-layout", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects bounded column counts", async () => {
    const element = document.createElement("rowan-form-layout");
    document.body.append(element);
    await nextMicrotask();

    element.columns = 4;
    expect(element.getAttribute("columns")).to.equal("4");
    expect(element.columns).to.equal(4);

    element.setAttribute("columns", "32");
    expect(element.columns).to.equal(12);
  });

  it("applies a direct child span and restores its previous inline value", async () => {
    const layout = document.createElement("rowan-form-layout");
    const field = document.createElement("rowan-form-field");
    field.style.setProperty("--rowan-form-layout-item-span", "3");
    field.setAttribute("span", "2");
    layout.columns = 3;
    layout.append(field);
    document.body.append(layout);
    await nextMicrotask();

    expect(field.style.getPropertyValue("--rowan-form-layout-item-span")).to.equal("2");

    field.removeAttribute("span");
    await nextMicrotask();
    expect(field.style.getPropertyValue("--rowan-form-layout-item-span")).to.equal("3");
  });

  it("clamps direct child spans to the configured column count", async () => {
    const layout = document.createElement("rowan-form-layout");
    const field = document.createElement("rowan-form-field");
    layout.columns = 2;
    field.setAttribute("span", "4");
    layout.append(field);
    document.body.append(layout);
    await nextMicrotask();

    expect(field.style.getPropertyValue("--rowan-form-layout-item-span")).to.equal("2");
  });

  it("coordinates start-positioned field labels through inherited layout values", async () => {
    const layout = document.createElement("rowan-form-layout");
    const field = document.createElement("rowan-form-field");
    layout.labelPosition = "start";
    layout.labelAlign = "end";
    layout.labelWidth = "12rem";
    layout.append(field);
    document.body.append(layout);
    await nextMicrotask();

    expect(layout.style.getPropertyValue("--rowan-form-layout-field-areas")).to.equal(
      '"label control" ". support"',
    );
    expect(layout.style.getPropertyValue("--rowan-form-layout-field-columns")).to.equal(
      "minmax(var(--rowan-form-layout-label-width, 10rem), 0.45fr) minmax(0, 1fr)",
    );
    expect(layout.style.getPropertyValue("--rowan-form-layout-label-width")).to.equal("12rem");
    expect(layout.style.getPropertyValue("--rowan-form-field-label-align")).to.equal("end");
    expect(field.shadowRoot.querySelector(".field").style.gridTemplateAreas).to.equal("");
  });

  it("stacks coordinated field labels in a narrow layout container", async () => {
    const layout = document.createElement("rowan-form-layout");
    const field = document.createElement("rowan-form-field");
    layout.style.inlineSize = "20rem";
    layout.labelPosition = "start";
    layout.append(field);
    document.body.append(layout);
    await nextMicrotask();
    await nextFrame();
    await nextFrame();

    expect(field.hasAttribute("data-rowan-form-layout-stacked")).to.equal(true);
    expect(getComputedStyle(field.shadowRoot.querySelector(".field")).gridTemplateAreas).to.equal(
      '"label" "control" "support"',
    );

    layout.style.inlineSize = "50rem";
    await nextFrame();
    await nextFrame();
    expect(field.hasAttribute("data-rowan-form-layout-stacked")).to.equal(false);
  });
});
