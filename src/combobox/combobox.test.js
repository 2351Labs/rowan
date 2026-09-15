import { expect } from "@esm-bundle/chai";
import "./combobox.js";

const nextMicrotask = () => Promise.resolve();

function keydown(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-combobox", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value property and attribute", async () => {
    const el = document.createElement("rowan-combobox");
    document.body.append(el);
    await nextMicrotask();

    el.value = "Seattle";
    expect(el.getAttribute("value")).to.equal("Seattle");

    el.setAttribute("value", "Portland");
    expect(el.value).to.equal("Portland");
  });

  it("renders listbox options from property", async () => {
    const el = document.createElement("rowan-combobox");
    el.options = ["A", "B", "C"];
    document.body.append(el);
    await nextMicrotask();
    await nextMicrotask();

    expect(el.shadowRoot.querySelectorAll('[role="listbox"] rowan-option').length).to.equal(3);
  });

  it("opens from ArrowDown and tracks the active option with aria-activedescendant", async () => {
    const el = document.createElement("rowan-combobox");
    el.options = ["Seattle", "Portland", "Boise"];
    document.body.append(el);
    await nextMicrotask();
    await nextMicrotask();

    const input = el.shadowRoot.querySelector("input");
    input.focus();
    keydown(input, "ArrowDown");
    await nextMicrotask();
    await nextMicrotask();

    expect(el.open).to.equal(true);
    expect(input.getAttribute("aria-expanded")).to.equal("true");

    const first = el.shadowRoot.querySelectorAll("rowan-option")[0];
    expect(input.getAttribute("aria-activedescendant")).to.equal(first.id);
    // Focus stays in the input; the popup is tracked by active descendant.
    expect(el.shadowRoot.activeElement).to.equal(input);

    keydown(input, "ArrowDown");
    await nextMicrotask();
    await nextMicrotask();

    const second = el.shadowRoot.querySelectorAll("rowan-option")[1];
    expect(input.getAttribute("aria-activedescendant")).to.equal(second.id);
  });

  it("commits the active option on Enter and emits one change", async () => {
    const el = document.createElement("rowan-combobox");
    el.options = ["Seattle", "Portland"];
    document.body.append(el);
    await nextMicrotask();
    await nextMicrotask();

    const changes = [];
    el.addEventListener("rowan-change", (event) => changes.push(event.detail.value));

    const input = el.shadowRoot.querySelector("input");
    input.focus();
    keydown(input, "ArrowDown");
    await nextMicrotask();
    keydown(input, "ArrowDown");
    await nextMicrotask();
    keydown(input, "Enter");
    await nextMicrotask();
    await nextMicrotask();

    expect(el.value).to.equal("Portland");
    expect(el.open).to.equal(false);
    expect(changes).to.deep.equal(["Portland"]);

    // A trailing native change for the same value must not emit again.
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await nextMicrotask();
    expect(changes).to.deep.equal(["Portland"]);
  });

  it("closes on Escape without committing the active option", async () => {
    const el = document.createElement("rowan-combobox");
    el.options = ["Seattle", "Portland"];
    document.body.append(el);
    await nextMicrotask();
    await nextMicrotask();

    const input = el.shadowRoot.querySelector("input");
    input.focus();
    keydown(input, "ArrowDown");
    await nextMicrotask();
    keydown(input, "Escape");
    await nextMicrotask();
    await nextMicrotask();

    expect(el.open).to.equal(false);
    expect(el.value).to.equal("");
  });

  it("filters options as the user types and skips disabled options", async () => {
    const el = document.createElement("rowan-combobox");
    el.options = ["Seattle", { value: "Portland", disabled: true }, "Sacramento"];
    document.body.append(el);
    await nextMicrotask();
    await nextMicrotask();

    const input = el.shadowRoot.querySelector("input");
    input.focus();
    input.value = "s";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await nextMicrotask();
    await nextMicrotask();

    const labels = [...el.shadowRoot.querySelectorAll("rowan-option")].map(
      (option) => option.value,
    );
    expect(labels).to.deep.equal(["Seattle", "Sacramento"]);

    const [first, second] = el.shadowRoot.querySelectorAll("rowan-option");
    expect(input.getAttribute("aria-activedescendant")).to.equal(first.id);

    // Portland is filtered out, and a disabled option would be skipped anyway.
    keydown(input, "ArrowDown");
    await nextMicrotask();
    await nextMicrotask();

    expect(input.getAttribute("aria-activedescendant")).to.equal(second.id);
  });

  it("emits rowan-change when user commits a value", async () => {
    const el = document.createElement("rowan-combobox");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = el.shadowRoot.querySelector('input[type="text"]');
    input.value = "Bend";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const el = document.createElement("rowan-combobox");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    el.value = "Programmatic";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-combobox");

    el.name = "city";
    el.value = "Seattle";

    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("city")).to.equal("Seattle");
  });

  it("reports invalid when required and empty", async () => {
    const el = document.createElement("rowan-combobox");
    el.required = true;
    document.body.append(el);
    await nextMicrotask();

    expect(el.checkValidity()).to.equal(false);

    el.value = "Seattle";
    await nextMicrotask();

    expect(el.checkValidity()).to.equal(true);
  });

  it("resets to default value", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-combobox");

    el.setAttribute("value", "Salem");
    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    el.value = "Bend";
    form.reset();

    expect(el.value).to.equal("Salem");
  });

  it("syncs host a11y states for combobox defaults", async () => {
    const el = document.createElement("rowan-combobox");
    el.required = true;
    el.label = "City";
    el.options = ["Seattle", "Portland"];
    document.body.append(el);
    await nextMicrotask();

    // The datalist popup is browser-owned, so the host must not claim a combobox role it
    // cannot report expansion state for.
    expect(el.internals.role).to.equal(null);
    expect(el.internals.ariaExpanded).to.equal(null);
    expect(el.internals.ariaRequired).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("true");
    expect(el.internals.ariaLabel).to.equal("City");

    el.value = "Seattle";
    await nextMicrotask();

    expect(el.internals.ariaInvalid).to.equal("false");
  });
});
