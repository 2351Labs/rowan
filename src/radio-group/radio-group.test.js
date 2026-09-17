import { expect } from "@esm-bundle/chai";
import "./radio-group.js";
import "../radio/radio.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-radio-group", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("checks the matching radio from value", async () => {
    const group = document.createElement("rowan-radio-group");
    group.value = "b";

    const a = document.createElement("rowan-radio");
    a.value = "a";
    const b = document.createElement("rowan-radio");
    b.value = "b";

    group.append(a, b);
    document.body.append(group);
    await nextMicrotask();

    expect(a.checked).to.equal(false);
    expect(b.checked).to.equal(true);
  });

  it("configures radios added after the group connects", async () => {
    const group = document.createElement("rowan-radio-group");
    group.name = "region";
    group.value = "north";
    group.required = true;

    const south = document.createElement("rowan-radio");
    south.value = "south";
    group.append(south);
    document.body.append(group);
    await nextMicrotask();

    const north = document.createElement("rowan-radio");
    north.value = "north";
    group.append(north);
    await nextMicrotask();
    await nextMicrotask();

    expect(north.name).to.equal("region");
    expect(north.checked).to.equal(true);
    expect(south.checked).to.equal(false);
  });

  it("propagates a child selection once and keeps parent-driven updates silent", async () => {
    const group = document.createElement("rowan-radio-group");
    group.name = "region";
    group.disabled = true;
    group.required = true;

    const north = document.createElement("rowan-radio");
    north.value = "north";
    const south = document.createElement("rowan-radio");
    south.value = "south";

    group.append(north, south);
    document.body.append(group);
    await nextMicrotask();

    expect(north.disabled).to.equal(true);
    expect(south.disabled).to.equal(true);
    expect(north.required).to.equal(true);
    expect(south.required).to.equal(false);

    group.disabled = false;
    await nextMicrotask();
    await nextMicrotask();
    expect(south.shadowRoot.querySelector("input").disabled).to.equal(false);

    const changes = [];
    const childChanges = [];
    group.addEventListener("rowan-change", (event) => changes.push(event));
    south.addEventListener("rowan-change", (event) => childChanges.push(event.detail));
    south.shadowRoot.querySelector("input").click();
    await nextMicrotask();

    expect(group.value).to.equal("south");
    expect(south.checked).to.equal(true);
    expect(north.checked).to.equal(false);
    expect(changes).to.have.length(1);
    expect(changes[0].detail.value).to.equal("south");
    expect(changes[0].detail.radio === south).to.equal(true);
    expect(changes[0].bubbles).to.equal(true);
    expect(changes[0].composed).to.equal(true);
    expect(childChanges).to.deep.equal([{ checked: true, value: "south" }]);

    group.value = "north";
    await nextMicrotask();

    expect(north.checked).to.equal(true);
    expect(changes).to.have.length(1);
  });

  it("keeps one controller selection event after reconnecting", async () => {
    const group = document.createElement("rowan-radio-group");
    const north = document.createElement("rowan-radio");
    north.value = "north";
    north.checked = true;
    const south = document.createElement("rowan-radio");
    south.value = "south";
    group.append(north, south);
    document.body.append(group);
    await nextMicrotask();
    await nextMicrotask();
    expect(group.value).to.equal("north");

    group.remove();
    document.body.append(group);

    const changes = [];
    group.addEventListener("rowan-change", (event) => changes.push(event));
    south.shadowRoot.querySelector("input").click();
    await nextMicrotask();

    expect(group.value).to.equal("south");
    expect(changes).to.have.length(1);
    expect(changes[0].detail.radio === south).to.equal(true);
  });

  it("satisfies required when a later radio is selected", async () => {
    const form = document.createElement("form");
    const group = document.createElement("rowan-radio-group");
    group.name = "region";
    group.required = true;

    const north = document.createElement("rowan-radio");
    north.value = "north";
    const south = document.createElement("rowan-radio");
    south.value = "south";

    group.append(north, south);
    form.append(group);
    document.body.append(form);
    await nextMicrotask();

    expect(north.required).to.equal(true);
    expect(south.required).to.equal(false);
    expect(north.checkValidity()).to.equal(false);
    expect(form.checkValidity()).to.equal(false);

    south.shadowRoot.querySelector("input").click();
    await nextMicrotask();

    expect(group.value).to.equal("south");
    expect(south.checked).to.equal(true);
    expect(north.checked).to.equal(false);
    expect(north.checkValidity()).to.equal(true);
    expect(south.checkValidity()).to.equal(true);
    expect(form.checkValidity()).to.equal(true);
    expect(north.internals.ariaInvalid).to.equal("false");
  });

  it("satisfies required for unnamed radios in a group", async () => {
    const form = document.createElement("form");
    const group = document.createElement("rowan-radio-group");
    group.required = true;

    const north = document.createElement("rowan-radio");
    north.value = "north";
    const south = document.createElement("rowan-radio");
    south.value = "south";

    group.append(north, south);
    form.append(group);
    document.body.append(form);
    await nextMicrotask();

    expect(north.checkValidity()).to.equal(false);

    south.shadowRoot.querySelector("input").click();
    await nextMicrotask();

    expect(group.value).to.equal("south");
    expect(north.checkValidity()).to.equal(true);
    expect(form.checkValidity()).to.equal(true);
  });

  it("does not treat a nested group selection as its own", async () => {
    const outer = document.createElement("rowan-radio-group");
    const outerRadio = document.createElement("rowan-radio");
    outerRadio.value = "outer";
    outerRadio.checked = true;
    const inner = document.createElement("rowan-radio-group");
    const first = document.createElement("rowan-radio");
    first.value = "first";
    first.checked = true;
    const second = document.createElement("rowan-radio");
    second.value = "second";
    inner.append(first, second);
    outer.append(outerRadio, inner);
    document.body.append(outer);
    await nextMicrotask();
    await nextMicrotask();

    second.shadowRoot.querySelector("input").click();
    await nextMicrotask();

    expect(outer.value).to.equal("outer");
    expect(outerRadio.checked).to.equal(true);
    expect(inner.value).to.equal("second");
    expect(second.checked).to.equal(true);
  });

  it("submits the selected value once through FACE", async () => {
    const form = document.createElement("form");
    const group = document.createElement("rowan-radio-group");
    group.name = "region";
    group.required = true;

    const north = document.createElement("rowan-radio");
    north.value = "north";
    const south = document.createElement("rowan-radio");
    south.value = "south";
    group.append(north, south);
    form.append(group);
    document.body.append(form);
    await nextMicrotask();

    expect(group.checkValidity()).to.equal(false);
    expect(new FormData(form).getAll("region")).to.deep.equal([]);

    south.shadowRoot.querySelector("input").click();
    await nextMicrotask();

    expect(group.value).to.equal("south");
    expect(group.checkValidity()).to.equal(true);
    expect(form.checkValidity()).to.equal(true);
    expect(new FormData(form).getAll("region")).to.deep.equal(["south"]);
    expect(group.internals.ariaInvalid).to.equal("false");
  });

  it("resets to the default value without emitting", async () => {
    const form = document.createElement("form");
    const group = document.createElement("rowan-radio-group");
    group.name = "region";
    group.value = "north";

    const north = document.createElement("rowan-radio");
    north.value = "north";
    const south = document.createElement("rowan-radio");
    south.value = "south";
    group.append(north, south);
    form.append(group);
    document.body.append(form);
    await nextMicrotask();

    const changes = [];
    group.addEventListener("rowan-change", (event) => changes.push(event));

    south.shadowRoot.querySelector("input").click();
    await nextMicrotask();
    expect(group.value).to.equal("south");
    expect(changes).to.have.length(1);

    form.reset();
    await nextMicrotask();

    expect(group.value).to.equal("north");
    expect(north.checked).to.equal(true);
    expect(south.checked).to.equal(false);
    expect(new FormData(form).get("region")).to.equal("north");
    expect(changes).to.have.length(1);
  });

  it("lets named radios submit when the group has no name", async () => {
    const form = document.createElement("form");
    const group = document.createElement("rowan-radio-group");
    const north = document.createElement("rowan-radio");
    north.name = "region";
    north.value = "north";
    north.checked = true;
    group.append(north);
    form.append(group);
    document.body.append(form);
    await nextMicrotask();

    expect(new FormData(form).getAll("region")).to.deep.equal(["north"]);
  });
});
