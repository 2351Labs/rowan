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
});
