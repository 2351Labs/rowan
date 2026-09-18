import { expect } from "@esm-bundle/chai";
import "./sparkline.js";

const nextMicrotask = () => Promise.resolve();

async function renderSparkline(options = {}) {
  const chart = document.createElement("rowan-sparkline");
  if (options.label !== undefined) chart.label = options.label;
  if (options.tone !== undefined) chart.tone = options.tone;
  if (options.values !== undefined) chart.values = options.values;
  if (options.labels !== undefined) chart.labels = options.labels;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-sparkline", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes a name and the series values to assistive technology", async () => {
    const chart = await renderSparkline({
      label: "Open incidents",
      values: [4, null, 8],
      labels: ["Mon", "Tue", "Wed"],
    });

    expect(chart.hasAttribute("values")).to.equal(false);
    expect(chart.internals.role).to.equal("group");
    expect(chart.internals.ariaLabel).to.equal("Open incidents");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Open incidents");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Mon4");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("TueNo data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Wed8");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("breaks the line on null values and does not animate", async () => {
    const chart = await renderSparkline({
      label: "Open incidents",
      values: [4, null, 8],
    });

    const path = chart.shadowRoot.querySelector("path.line");
    const commands = path
      .getAttribute("d")
      .split(" ")
      .map((command) => command[0]);

    expect(commands).to.deep.equal(["M", "M"]);
    expect(getComputedStyle(path).animationName).to.equal("none");
  });

  it("colors rising and falling series from the data when tone is unset", async () => {
    const rising = await renderSparkline({ values: [1, 4, 9] });
    expect(rising.tone).to.equal("success");
    expect(rising.shadowRoot.querySelector(".plot").dataset.tone).to.equal("success");

    const falling = await renderSparkline({ values: [9, 4, 1] });
    expect(falling.tone).to.equal("danger");
  });
});
