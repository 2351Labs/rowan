import { expect } from "@esm-bundle/chai";
import "./select.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-select", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value property and attribute", async () => {
    const el = document.createElement("rowan-select");
    document.body.append(el);
    await nextMicrotask();

    el.value = "north";
    expect(el.getAttribute("value")).to.equal("north");

    el.setAttribute("value", "south");
    expect(el.value).to.equal("south");
  });

  it("renders options from property", async () => {
    const el = document.createElement("rowan-select");
    el.options = [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ];
    el.value = "b";
    document.body.append(el);
    await nextMicrotask();

    const options = el.shadowRoot.querySelectorAll("option");
    expect(options.length).to.equal(2);
    expect(el.shadowRoot.querySelector("select").value).to.equal("b");
  });

  it("emits rowan-change when user changes selected value", async () => {
    const el = document.createElement("rowan-select");
    el.options = [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ];
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const select = el.shadowRoot.querySelector("select");
    select.value = "b";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const el = document.createElement("rowan-select");
    document.body.append(el);
    await nextMicrotask();

    let eventCount = 0;
    el.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    el.value = "programmatic";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-select");

    el.name = "region";
    el.options = [
      { value: "na", label: "North America" },
      { value: "eu", label: "Europe" },
    ];
    el.value = "eu";

    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("region")).to.equal("eu");
  });

  it("reports invalid when required and empty", async () => {
    const el = document.createElement("rowan-select");
    el.required = true;
    el.options = [{ value: "na", label: "North America" }];
    document.body.append(el);
    await nextMicrotask();

    expect(el.checkValidity()).to.equal(false);

    el.value = "na";
    await nextMicrotask();

    expect(el.checkValidity()).to.equal(true);
  });

  it("resets to default value", async () => {
    const form = document.createElement("form");
    const el = document.createElement("rowan-select");

    el.name = "region";
    el.options = [
      { value: "na", label: "North America" },
      { value: "eu", label: "Europe" },
    ];
    el.setAttribute("value", "na");

    form.append(el);
    document.body.append(form);
    await nextMicrotask();

    el.value = "eu";
    form.reset();

    expect(el.value).to.equal("na");
  });

  it("syncs host a11y states for required select", async () => {
    const el = document.createElement("rowan-select");
    el.required = true;
    el.label = "Region";
    el.options = [
      { value: "na", label: "North America" },
      { value: "eu", label: "Europe" },
    ];

    document.body.append(el);
    await nextMicrotask();

    expect(el.internals.role).to.equal("combobox");
    expect(el.internals.ariaRequired).to.equal("true");
    expect(el.internals.ariaInvalid).to.equal("true");
    expect(el.internals.ariaLabel).to.equal("Region");

    el.value = "eu";
    await nextMicrotask();

    expect(el.internals.ariaInvalid).to.equal("false");
  });
});
