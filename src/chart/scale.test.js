import { expect } from "@esm-bundle/chai";
import {
  expandDomainForInset,
  niceLinearDomain,
  roundTick,
  scaleCoordinate,
  zeroBaselineDomain,
} from "./scale.js";

describe("nice linear scale", () => {
  it("pads a two-point extent onto a 1-2-5 step", () => {
    const x = niceLinearDomain([12, 18]);
    const y = niceLinearDomain([64, 72], { padRatio: 0.12 });

    expect(x).to.deep.equal({ min: 10, max: 20, ticks: [10, 15, 20] });
    expect(y).to.deep.equal({ min: 60, max: 75, ticks: [60, 65, 70, 75] });
    expect((12 - x.min) / (x.max - x.min)).to.be.within(0.05, 0.95);
    expect((18 - x.min) / (x.max - x.min)).to.be.within(0.05, 0.95);
    expect((64 - y.min) / (y.max - y.min)).to.be.within(0.05, 0.95);
    expect((72 - y.min) / (y.max - y.min)).to.be.within(0.05, 0.95);
  });

  it("pads a single value and keeps an empty domain usable", () => {
    expect(niceLinearDomain([])).to.deep.equal({ min: 0, max: 1, ticks: [0, 0.5, 1] });
    const flat = niceLinearDomain([10, 10]);
    expect(flat.min).to.be.below(10);
    expect(flat.max).to.be.above(10);
    expect(flat.ticks[0]).to.equal(flat.min);
    expect(flat.ticks.at(-1)).to.equal(flat.max);
  });

  it("covers negatives and keeps tick text free of binary noise", () => {
    const domain = niceLinearDomain([-8, 3]);
    expect(domain.min).to.be.at.most(-8);
    expect(domain.max).to.be.at.least(3);
    expect(domain.ticks).to.include(0);
    expect(
      domain.ticks.every((tick) => Number.isInteger(tick * 2) || Number.isInteger(tick)),
    ).to.equal(true);
    expect(roundTick(0.30000000000000004, 0.1)).to.equal(0.3);
    expect(niceLinearDomain([0.1, 0.3]).ticks).to.deep.equal([0, 0.2, 0.4]);
  });

  it("grows the domain until a bubble radius fits inside the plot", () => {
    const tight = { min: 12, max: 18, ticks: [12, 15, 18] };
    const expanded = expandDomainForInset(tight, 12, 18, 0.2);
    expect(expanded.min).to.be.below(12);
    expect(expanded.max).to.be.above(18);
    const span = expanded.max - expanded.min;
    expect((12 - expanded.min) / span).to.be.at.least(0.2);
    expect((expanded.max - 18) / span).to.be.at.least(0.2);
  });

  it("keeps a zero baseline and lifts the top past the data max", () => {
    const domain = zeroBaselineDomain({ min: 0, max: 240 });
    expect(domain.min).to.equal(0);
    expect(domain.max).to.be.above(240);
    expect(domain.ticks[0]).to.equal(0);
    expect(domain.ticks.at(-1)).to.equal(domain.max);
    expect(domain.ticks).to.include(0);
  });

  it("maps the domain max to the top of the plot", () => {
    const domain = { min: 60, max: 75 };
    expect(scaleCoordinate(75, domain, 18, 354, "y")).to.equal(18);
    expect(scaleCoordinate(60, domain, 18, 354, "y")).to.equal(372);
    expect(scaleCoordinate(10, { min: 10, max: 20 }, 48, 934, "x")).to.equal(48);
    expect(scaleCoordinate(20, { min: 10, max: 20 }, 48, 934, "x")).to.equal(982);
  });
});
