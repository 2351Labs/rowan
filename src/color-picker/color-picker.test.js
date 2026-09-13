import { expect } from "@esm-bundle/chai";

import "./color-picker.js";

const nextMicrotask = () => Promise.resolve();

async function renderPicker({ palette, value = "", required = false } = {}) {
  const picker = document.createElement("rowan-color-picker");
  picker.label = "Project color";
  picker.value = value;
  picker.required = required;
  if (palette) picker.palette = palette;
  document.body.append(picker);
  await nextMicrotask();
  await nextMicrotask();
  return picker;
}

describe("rowan-color-picker", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the approved Rowan palette and reflects normalized scalar values", async () => {
    const picker = await renderPicker({ value: "#2F6A4D80" });

    expect(picker.shadowRoot.querySelectorAll("button[data-value]")).to.have.length(11);
    expect(picker.value).to.equal("#2f6a4d80");
    expect(picker.getAttribute("value")).to.equal("#2f6a4d80");
    expect(picker.hasAttribute("palette")).to.equal(false);
  });

  it("keeps parent-driven values silent and emits one composed event for a swatch", async () => {
    const picker = await renderPicker({ value: "#10261c" });
    const changes = [];
    picker.addEventListener("rowan-change", (event) => changes.push(event));

    picker.value = "#153224";
    await nextMicrotask();
    expect(changes).to.have.length(0);

    picker.shadowRoot.querySelector("button[data-value='#1d432f']").click();
    await nextMicrotask();

    expect(picker.value).to.equal("#1d432f");
    expect(changes).to.have.length(1);
    expect(changes[0].detail).to.include({ alpha: 100, color: "#1d432f", source: "swatch" });
    expect(changes[0].bubbles).to.equal(true);
    expect(changes[0].composed).to.equal(true);
  });

  it("moves through enabled swatches with Arrow keys and restores focus", async () => {
    const palette = [
      { value: "#10261c", label: "Forest" },
      { value: "#153224", label: "Disabled", disabled: true },
      { value: "#1d432f", label: "Moss" },
    ];
    const picker = await renderPicker({ palette, value: "#10261c" });
    const first = picker.shadowRoot.querySelector("button[data-value='#10261c']");

    first.focus();
    first.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    const third = picker.shadowRoot.querySelector("button[data-value='#1d432f']");
    expect(picker.value).to.equal("#1d432f");
    expect(picker.shadowRoot.activeElement).to.equal(third);
    expect(third.tabIndex).to.equal(0);
  });

  it("commits native color and opacity input as an alpha-bearing color", async () => {
    const picker = await renderPicker({ value: "#10261c" });
    const changes = [];
    picker.addEventListener("rowan-change", (event) => changes.push(event));

    const colorInput = picker.shadowRoot.querySelector("input[type='color']");
    const alphaInput = picker.shadowRoot.querySelector("input[type='range']");
    colorInput.value = "#24543c";
    colorInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    alphaInput.value = "50";
    alphaInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    alphaInput.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(picker.value).to.equal("#24543c80");
    expect(changes).to.have.length(2);
    expect(changes.at(-1).detail).to.include({
      alpha: 50,
      color: "#24543c",
      source: "alpha-input",
    });
  });

  it("submits, restores, and validates through ElementInternals", async () => {
    const form = document.createElement("form");
    const picker = document.createElement("rowan-color-picker");
    picker.name = "brand-color";
    picker.value = "#1d432f";
    form.append(picker);
    document.body.append(form);
    await nextMicrotask();
    await nextMicrotask();

    expect(new FormData(form).get("brand-color")).to.equal("#1d432f");

    picker.value = "#b4392d";
    form.reset();
    await nextMicrotask();
    expect(picker.value).to.equal("#1d432f");

    picker.required = true;
    picker.value = "";
    await nextMicrotask();
    expect(picker.checkValidity()).to.equal(false);
  });

  it("uses ElementInternals defaults without replacing author ARIA", async () => {
    const picker = await renderPicker();
    picker.setAttribute("aria-label", "Brand color for project");
    await nextMicrotask();

    expect(picker.internals.role).to.equal("group");
    expect(picker.getAttribute("aria-label")).to.equal("Brand color for project");
    expect(picker.internals.ariaLabel).to.equal("Project color");
  });
});
