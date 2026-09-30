import { expect } from "@esm-bundle/chai";
import {
  categoricalBarRect,
  categoricalBaseline,
  stackedBarCategoryTotal,
  stackedBarPlotDomain,
} from "./model.js";

describe("chart model cartesian helpers", () => {
  const plot = { left: 18, top: 18, width: 964, height: 354 };

  it("matches vertical grouped bars from zero", () => {
    const rect = categoricalBarRect({
      orientation: "vertical",
      from: 0,
      to: 4,
      domain: { min: 0, max: 8 },
      groupStart: 18,
      offset: 53.555,
      thickness: 107.111,
      plot,
    });
    expect(rect.y).to.equal(18 + ((8 - 4) / 8) * 354);
    expect(rect.height).to.equal(((4 - 0) / 8) * 354);
  });

  it("keeps normalized stacked domain at 0–100", () => {
    const series = [
      { id: "a", label: "A", values: [{ value: 4, label: "Mon" }], color: "" },
      { id: "b", label: "B", values: [{ value: 1, label: "Mon" }], color: "" },
    ];
    expect(stackedBarCategoryTotal(series, 0)).to.equal(5);
    expect(stackedBarPlotDomain(series, "normalized")).to.deep.equal({ min: 0, max: 100 });
    expect(stackedBarPlotDomain(series, "absolute").max).to.equal(5);
  });

  it("draws a vertical zero line for horizontal orientation", () => {
    const line = categoricalBaseline("horizontal", { min: 0, max: 8 }, plot);
    expect(line.x1).to.equal(line.x2);
    expect(line.y1).to.equal(plot.top);
    expect(line.y2).to.equal(plot.top + plot.height);
  });
});
