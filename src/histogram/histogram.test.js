import { expect } from "@esm-bundle/chai";
import { createHistogramData } from "./histogram.js";
import "../bar-chart/bar-chart.js";

const nextMicrotask = () => Promise.resolve();

describe("createHistogramData", () => {
  it("omits nulls and bins equal-width counts for the bar chart", async () => {
    const data = createHistogramData({
      values: [1, 2, 2, null, 9],
      bins: 2,
    });

    expect(data.labels).to.have.length(2);
    expect(data.series[0].values.reduce((sum, value) => sum + value, 0)).to.equal(4);
    expect(data.series[0].id).to.equal("count");

    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Fill samples";
    chart.labels = data.labels;
    chart.series = data.series;
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Count");
    chart.remove();
  });

  it("uses explicit edges and last-bin inclusion", () => {
    const data = createHistogramData({
      values: [0, 5, 10],
      bins: [0, 5, 10],
      id: "n",
      label: "N",
    });
    expect(data.labels).to.deep.equal(["0–5", "5–10"]);
    expect(data.series[0].values).to.deep.equal([1, 2]);
    expect(data.series[0].id).to.equal("n");
    expect(data.series[0].label).to.equal("N");
  });

  it("treats whitespace samples and explicit edges as no-data", () => {
    const data = createHistogramData({
      values: [" ", 0, 5, "10"],
      bins: [" ", 0, 5, 10],
    });

    expect(data.labels).to.deep.equal(["0–5", "5–10"]);
    expect(data.series[0].values).to.deep.equal([1, 2]);
  });
});
