import { expect } from "@esm-bundle/chai";
import "../form-field/form-field.js";
import "../text-field/text-field.js";
import "./form-layout.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const nextTask = () => new Promise((resolve) => setTimeout(resolve));

async function settleResponsiveLayout() {
  await nextMicrotask();
  await nextTask();
  await nextFrame();
}

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

    layout.style.inlineSize = "54rem";
    await nextFrame();
    await nextFrame();
    expect(field.hasAttribute("data-rowan-form-layout-stacked")).to.equal(false);
  });

  it("resizes start-aligned grids and their spans before controls overflow", async () => {
    const layout = document.createElement("rowan-form-layout");
    layout.style.inlineSize = "54rem";
    layout.columns = 2;
    layout.setAttribute("label-position", " START ");

    const project = document.createElement("rowan-form-field");
    project.label = "Project name";
    const projectInput = document.createElement("rowan-text-field");
    project.append(projectInput);

    const owner = document.createElement("rowan-form-field");
    owner.label = "Owner email";
    owner.append(document.createElement("rowan-text-field"));

    const budget = document.createElement("rowan-form-field");
    budget.setAttribute("span", "2");
    budget.append(document.createElement("rowan-text-field"));

    layout.append(project, owner, budget);
    document.body.append(layout);
    await settleResponsiveLayout();

    const grid = layout.shadowRoot.querySelector(".layout");
    const input = projectInput.shadowRoot.querySelector("input");

    expect(layout.labelPosition).to.equal("start");
    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(2);
    expect(budget.style.getPropertyValue("--rowan-form-layout-item-span")).to.equal("2");
    expect(project.hasAttribute("data-rowan-form-layout-stacked")).to.equal(false);

    layout.style.inlineSize = "48rem";
    await settleResponsiveLayout();

    const layoutBox = layout.getBoundingClientRect();
    const inputBox = input.getBoundingClientRect();

    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(1);
    expect(project.hasAttribute("data-rowan-form-layout-stacked")).to.equal(true);
    expect(budget.style.getPropertyValue("--rowan-form-layout-item-span")).to.equal("1");
    expect(inputBox.right <= layoutBox.right).to.equal(true);

    layout.style.inlineSize = "54rem";
    await settleResponsiveLayout();

    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(2);
    expect(project.hasAttribute("data-rowan-form-layout-stacked")).to.equal(false);
    expect(budget.style.getPropertyValue("--rowan-form-layout-item-span")).to.equal("2");
  });

  it("recalculates responsive columns when its stylesheet loads", async () => {
    const layout = document.createElement("rowan-form-layout");
    layout.style.inlineSize = "54rem";
    layout.columns = 2;
    layout.labelPosition = "start";
    layout.append(document.createElement("rowan-form-field"));
    document.body.append(layout);
    await settleResponsiveLayout();

    const grid = layout.shadowRoot.querySelector(".layout");
    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(2);

    layout.style.inlineSize = "48rem";
    layout.shadowRoot.querySelector('link[rel="stylesheet"]').dispatchEvent(new Event("load"));

    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(1);
  });

  it("uses a resolved percentage gap when selecting responsive columns", async () => {
    const layout = document.createElement("rowan-form-layout");
    layout.style.inlineSize = "48rem";
    layout.columns = 2;
    layout.gap = "10%";
    layout.labelPosition = "start";
    layout.labelWidth = "8rem";

    const project = document.createElement("rowan-form-field");
    project.label = "Project name";
    project.append(document.createElement("rowan-text-field"));
    const owner = document.createElement("rowan-form-field");
    owner.label = "Owner email";
    owner.append(document.createElement("rowan-text-field"));

    layout.append(project, owner);
    document.body.append(layout);
    await settleResponsiveLayout();

    const grid = layout.shadowRoot.querySelector(".layout");
    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(1);
    expect(project.hasAttribute("data-rowan-form-layout-stacked")).to.equal(true);
  });

  it("responds when inherited sizing tokens change after connection", async () => {
    const layout = document.createElement("rowan-form-layout");
    layout.style.inlineSize = "54rem";
    layout.columns = 2;
    layout.labelPosition = "start";
    layout.labelWidth = "8rem";
    layout.append(document.createElement("rowan-form-field"));
    document.body.append(layout);
    await settleResponsiveLayout();

    const grid = layout.shadowRoot.querySelector(".layout");
    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(2);

    layout.style.setProperty("--rowan-form-layout-label-width", "16rem");
    await settleResponsiveLayout();

    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(1);
  });

  it("uses the logical inline axis in vertical writing modes", async () => {
    const layout = document.createElement("rowan-form-layout");
    layout.style.blockSize = "20rem";
    layout.style.inlineSize = "48rem";
    layout.style.writingMode = "vertical-rl";
    layout.columns = 2;
    layout.labelPosition = "start";
    layout.labelWidth = "10rem";
    layout.append(document.createElement("rowan-form-field"));
    document.body.append(layout);
    await settleResponsiveLayout();

    const grid = layout.shadowRoot.querySelector(".layout");
    expect(getComputedStyle(grid).gridTemplateColumns.split(/\s+/)).to.have.length(1);
    expect(grid.scrollHeight <= grid.clientHeight).to.equal(true);
  });
});
