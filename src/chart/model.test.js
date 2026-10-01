import { expect } from "@esm-bundle/chai";
import {
  areaBandPath,
  areaLinePath,
  categoricalBarRect,
  categoricalBaseline,
  categoricalPointX,
  categoricalValueY,
  finiteOrNull,
  normalizeChartSeries,
  resolveChartLabels,
  stackedAreaStacks,
  stackedBarCategoryTotal,
  stackedBarPlotDomain,
} from "./model.js";

describe("chart model cartesian helpers", () => {
  it("treats blank numeric strings as no-data and keeps zero", () => {
    expect(finiteOrNull(" ")).to.equal(null);
    expect(finiteOrNull("\t")).to.equal(null);
    expect(finiteOrNull("")).to.equal(null);
    expect(finiteOrNull("0")).to.equal(0);
    expect(finiteOrNull(0)).to.equal(0);
    expect(finiteOrNull("  2  ")).to.equal(2);
    expect(
      normalizeChartSeries([{ id: "a", values: [" ", "", 0, "3"] }])[0].values.map(
        (point) => point.value,
      ),
    ).to.deep.equal([null, null, 0, 3]);
  });

  it("allows hosts to localize generated point labels without replacing authored labels", () => {
    const series = normalizeChartSeries([
      {
        id: "queue",
        values: [4, { label: "Point 1", value: 8 }, null],
      },
    ]);

    expect(resolveChartLabels(series, [], (index) => `Punkt ${index + 1}`)).to.deep.equal([
      "Punkt 1",
      "Point 1",
      "Punkt 3",
    ]);
    expect(
      resolveChartLabels(series, ["Configured label"], (index) => `Punkt ${index + 1}`),
    ).to.deep.equal(["Configured label", "Point 1", "Punkt 3"]);
  });

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

  it("spans stacked-area x from plot edge to edge", () => {
    expect(categoricalPointX(0, 3, plot)).to.equal(plot.left);
    expect(categoricalPointX(2, 3, plot)).to.equal(plot.left + plot.width);
    expect(categoricalPointX(0, 1, plot)).to.equal(plot.left + plot.width / 2);
  });

  it("stacks area bands and breaks the fill on a gap", () => {
    const series = [
      {
        id: "a",
        label: "A",
        color: "",
        values: [
          { value: 4, label: "Mon" },
          { value: null, label: "Tue" },
          { value: 2, label: "Wed" },
        ],
      },
      {
        id: "b",
        label: "B",
        color: "",
        values: [
          { value: 1, label: "Mon" },
          { value: 3, label: "Tue" },
          { value: -1, label: "Wed" },
        ],
      },
    ];
    const stacks = stackedAreaStacks(series, "absolute");
    expect(stacks).to.deep.equal([
      { index: 0, seriesIndex: 0, from: 0, to: 4, value: 4, plotValue: 4 },
      { index: 0, seriesIndex: 1, from: 4, to: 5, value: 1, plotValue: 1 },
      { index: 1, seriesIndex: 1, from: 0, to: 3, value: 3, plotValue: 3 },
      { index: 2, seriesIndex: 0, from: 0, to: 2, value: 2, plotValue: 2 },
    ]);

    const domain = stackedBarPlotDomain(series, "absolute");
    const points = stacks
      .filter((stack) => stack.seriesIndex === 0)
      .map((stack) => ({
        index: stack.index,
        x: categoricalPointX(stack.index, 3, plot),
        yTop: categoricalValueY(stack.to, domain, plot),
        yBottom: categoricalValueY(stack.from, domain, plot),
      }));
    const band = areaBandPath(points);
    expect(band).to.include("Z");
    expect(
      areaLinePath(points)
        .split(" ")
        .map((part) => part[0]),
    ).to.deep.equal(["M", "M"]);
  });
});
