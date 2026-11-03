import { CHARTS, applyChartState } from "./catalog.mjs";
import { auditMounted, settle, stripIds } from "./measure.mjs";

const mount = document.querySelector("#mount");

window.auditCharts = async (stateName) => {
  const results = [];
  for (const spec of CHARTS) {
    mount.replaceChildren();
    const chart = spec.create();
    applyChartState(chart, spec, stateName);
    mount.append(chart);
    await settle(chart);
    results.push({
      id: spec.id,
      tag: spec.tag,
      title: spec.title,
      keyboard: spec.keyboard,
      hideId: spec.hideId,
      expectArrow: spec.expectArrow,
      expectActivate: spec.expectActivate,
      interactive: spec.interactive,
      probe: stripIds(await auditMounted(chart, spec)),
    });
    chart.remove();
  }
  mount.replaceChildren();
  return results;
};

window.mountChart = async (id, stateName) => {
  const spec = CHARTS.find((item) => item.id === id);
  mount.replaceChildren();
  const chart = spec.create();
  applyChartState(chart, spec, stateName);
  mount.append(chart);
  await settle(chart);
  return spec.tag;
};
