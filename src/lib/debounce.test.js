import { expect } from "@esm-bundle/chai";

import { debounce } from "./debounce.js";

describe("debounce", () => {
  it("runs the latest call after the wait and drops the earlier ones", async () => {
    const calls = [];
    const debounced = debounce((value) => {
      calls.push(value);
    }, 20);

    debounced("first");
    debounced("second");
    expect(calls).to.deep.equal([]);

    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(calls).to.deep.equal(["second"]);

    debounced("third");
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(calls).to.deep.equal(["second", "third"]);
  });
});
