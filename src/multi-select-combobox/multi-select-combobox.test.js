import { expect } from "@esm-bundle/chai";
import "./multi-select-combobox.js";

const nextMicrotask = () => Promise.resolve();

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

  it("opens from ArrowDown and tracks the active option without moving focus", async () => {
    const combobox = await renderCombobox();
    const input = combobox.shadowRoot.querySelector("input");
    // Focusing the field opens the popup, so the highlight starts on the first option.
    input.focus();
    await nextMicrotask();
    await nextMicrotask();

    const [first, second] = combobox.shadowRoot.querySelectorAll("rowan-option");
    expect(combobox.open).to.equal(true);
    expect(input.getAttribute("aria-expanded")).to.equal("true");
    expect(combobox.shadowRoot.activeElement === input).to.equal(true);
    expect(input.getAttribute("aria-activedescendant")).to.equal(first.id);
    expect(input.getAttribute("aria-autocomplete")).to.equal("list");

    input.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowDown" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    expect(input.getAttribute("aria-activedescendant")).to.equal(second.id);
    expect(combobox.shadowRoot.activeElement === input).to.equal(true);
  });

  it("toggles the active option with Enter and keeps the popup open", async () => {
    const combobox = await renderCombobox();
    const input = combobox.shadowRoot.querySelector("input");
    const changes = [];
    combobox.addEventListener("rowan-change", (event) => changes.push(event.detail.value));

    input.focus();
    await nextMicrotask();
    await nextMicrotask();

    const activeId = input.getAttribute("aria-activedescendant");
    const activeValue = combobox.shadowRoot.getElementById(activeId).value;

    input.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "Enter" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    expect(combobox.selected).to.deep.equal([activeValue]);
    expect(changes).to.deep.equal([activeValue]);
    expect(combobox.open).to.equal(true);

    input.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "Enter" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    expect(combobox.selected).to.deep.equal([]);
    expect(changes).to.deep.equal([activeValue, activeValue]);
  });

  it("jumps to the last available option with End", async () => {
    const combobox = await renderCombobox();
    const input = combobox.shadowRoot.querySelector("input");
    input.focus();
    await nextMicrotask();
    await nextMicrotask();

    input.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "End" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    const options = [...combobox.shadowRoot.querySelectorAll("rowan-option")];
    const lastAvailable = options.filter((option) => !option.disabled).at(-1);
    expect(input.getAttribute("aria-activedescendant")).to.equal(lastAvailable.id);
  });
});
