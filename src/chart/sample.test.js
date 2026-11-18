import { expect } from "@esm-bundle/chai";
import { bucketIndexes } from "./sample.js";

describe("large series sampler", () => {
  it("keeps a spike that a stride would skip", () => {
    const count = 400;
    const values = Array.from({ length: count }, (_, index) => 10 + (index % 5));
    values[237] = 500;
    const indexes = bucketIndexes([values], 0, count - 1, 32);
    expect(indexes).to.include(237);
    expect(indexes[0]).to.equal(0);
    expect(indexes.at(-1)).to.equal(count - 1);
    expect(indexes.length).to.be.below(80);
  });
});
