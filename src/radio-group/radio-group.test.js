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
});
