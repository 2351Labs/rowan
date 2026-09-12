import { expect } from "@esm-bundle/chai";
import "./multi-select-combobox.js";

const nextMicrotask = () => Promise.resolve();
const nextTask = () => new Promise((resolve) => setTimeout(resolve));

const OPTIONS = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "operations", label: "Operations" },
];

async function renderCombobox({ selected = [], required = false } = {}) {
  const combobox = document.createElement("rowan-multi-select-combobox");
  combobox.label = "Teams";
  combobox.options = OPTIONS;
  combobox.selected = selected;
  combobox.required = required;
  document.body.append(combobox);
  await nextMicrotask();
  await nextMicrotask();

  return combobox;
}

describe("rowan-multi-select-combobox", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps property-driven selected values silent and renders removable chips", async () => {
    const combobox = await renderCombobox({ selected: ["design", "engineering"] });
    let changeCount = 0;
    combobox.addEventListener("rowan-change", () => {
      changeCount += 1;
    });

    combobox.selected = ["operations"];
    await nextMicrotask();

    expect(combobox.selected).to.deep.equal(["operations"]);
    expect(combobox.hasAttribute("selected")).to.equal(false);
    expect(combobox.shadowRoot.querySelectorAll("[part~='chip']")).to.have.length(1);
    expect(changeCount).to.equal(0);
  });

  it("filters and adds selected values without leaking an internal listbox event", async () => {
    const combobox = await renderCombobox({ selected: ["design"] });
    const changes = [];
    combobox.addEventListener("rowan-change", (event) => changes.push(event.detail));

    const input = combobox.shadowRoot.querySelector("input");
    input.focus();
    input.value = "engineer";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await nextMicrotask();

    const option = combobox.shadowRoot.querySelector("rowan-option");
    option.click();
    await nextMicrotask();

    expect(combobox.selected).to.deep.equal(["design", "engineering"]);
    expect(changes).to.have.length(1);
    expect(changes[0].value).to.equal("engineering");
    expect(changes[0].selected).to.deep.equal(["design", "engineering"]);
  });

  it("removes the final chip with Backspace and emits a user change", async () => {
    const combobox = await renderCombobox({ selected: ["design", "engineering"] });
    const changes = [];
    combobox.addEventListener("rowan-change", (event) => changes.push(event.detail));

    const input = combobox.shadowRoot.querySelector("input");
    input.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "Backspace" }),
    );
    await nextMicrotask();

    expect(combobox.selected).to.deep.equal(["design"]);
    expect(changes).to.have.length(1);
    expect(changes[0].value).to.equal("engineering");
  });

  it("submits multiple values with FACE, resets selected values, and reports required validity", async () => {
    const form = document.createElement("form");
    const combobox = document.createElement("rowan-multi-select-combobox");
    combobox.name = "teams";
    combobox.options = OPTIONS;
    combobox.selected = ["design", "operations"];
    form.append(combobox);
    document.body.append(form);
    await nextMicrotask();
    await nextMicrotask();

    expect(new FormData(form).getAll("teams")).to.deep.equal(["design", "operations"]);

    combobox.selected = [];
    form.reset();
    await nextMicrotask();
    expect(combobox.selected).to.deep.equal(["design", "operations"]);

    combobox.required = true;
    combobox.selected = [];
    await nextMicrotask();
    expect(combobox.checkValidity()).to.equal(false);
  });

  it("opens from ArrowDown, forwards focus to an option, and exposes combobox a11y defaults", async () => {
    const combobox = await renderCombobox();
    const input = combobox.shadowRoot.querySelector("input");
    input.focus();
    input.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowDown" }),
    );
    await nextMicrotask();
    await nextMicrotask();
    await nextTask();

    const option = combobox.shadowRoot.querySelector("rowan-option");
    expect(combobox.open).to.equal(true);
    expect(document.activeElement === combobox).to.equal(true);
    expect(combobox.shadowRoot.activeElement === option).to.equal(true);
    expect(option.tabIndex).to.equal(0);
    expect(combobox.internals.role).to.equal("combobox");
    expect(combobox.internals.ariaAutoComplete).to.equal("list");
  });
});
