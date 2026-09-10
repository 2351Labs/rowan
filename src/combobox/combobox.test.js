import { expect } from "@esm-bundle/chai";
import "./combobox.js";

const nextMicrotask = () => Promise.resolve();

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

  it("renders datalist options from property", async () => {
    const el = document.createElement("rowan-combobox");
    el.options = ["A", "B", "C"];
    document.body.append(el);
    await nextMicrotask();

    expect(el.shadowRoot.querySelectorAll("datalist option").length).to.equal(3);
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

    expect(el.internals.role).to.equal("combobox");
    expect(el.internals.ariaAutoComplete).to.equal("list");
    expect(el.internals.ariaExpanded).to.equal("false");
    expect(el.internals.ariaRequired).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("true");
    expect(el.internals.ariaLabel).to.equal("City");

    el.value = "Seattle";
    await nextMicrotask();

    expect(el.internals.ariaInvalid).to.equal("false");
  });
});
