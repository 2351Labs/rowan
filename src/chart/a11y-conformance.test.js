import { expect } from "@esm-bundle/chai";
import { CHARTS, applyChartState } from "../../test/chart-a11y/catalog.mjs";
import { auditMounted, settle } from "../../test/chart-a11y/measure.mjs";
import { contrastRatio, parseCssColor, scoreChart } from "../../test/chart-a11y/score.mjs";

const PAGE_STATES = ["default", "interactive", "hidden-series", "dark"];
const themeLinks = [];

async function loadTheme() {
  const hrefs = [
    new URL("../../src/tokens/tokens.css", import.meta.url).href,
    new URL("../../src/tokens/themes/light.css", import.meta.url).href,
    new URL("../../src/tokens/themes/dark.css", import.meta.url).href,
  ];
  await Promise.all(
    hrefs.map((href) => {
      if ([...document.querySelectorAll("link[rel='stylesheet']")].some((link) => link.href === href)) {
        return undefined;
      }
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = href;
      stylesheet.dataset.rowanChartA11y = "true";
      document.head.append(stylesheet);
      themeLinks.push(stylesheet);
      if (stylesheet.sheet) return undefined;
      return new Promise((resolve, reject) => {
        stylesheet.addEventListener("load", resolve, { once: true });
        stylesheet.addEventListener("error", reject, { once: true });
      });
    }),
  );
}

describe("chart accessibility conformance", function () {
  before(async () => {
    await loadTheme();
  });

  after(() => {
    for (const link of themeLinks) link.remove();
    themeLinks.length = 0;
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.removeAttribute("data-theme");
  });

  it("computes black on white as 21:1", () => {
    const ratio = contrastRatio(parseCssColor("#000000"), parseCssColor("#ffffff"));
    expect(ratio).to.be.closeTo(21, 0.05);
  });

  for (const spec of CHARTS) {
    it(`${spec.tag} keeps the fixture table, keyboard path, focus, and axe clean`, async function () {
      this.timeout(90000);
      const states = {};
      for (const stateName of PAGE_STATES) {
        if (stateName === "dark") document.documentElement.dataset.theme = "dark";
        else document.documentElement.removeAttribute("data-theme");
        const chart = spec.create();
        applyChartState(chart, spec, stateName);
        document.body.append(chart);
        await settle(chart);
        states[stateName] = await auditMounted(chart, spec);
        chart.remove();
      }

      for (const stateName of PAGE_STATES) {
        const probe = states[stateName];
        const unexpected = probe.axe.violations.filter((violation) => violation.id !== "target-size");
        expect(unexpected, `${stateName} ${JSON.stringify(unexpected)}`).to.deep.equal([]);
        expect(probe.table.missing, `${stateName} missing ${probe.table.missing.join(", ")}`).to.deep.equal(
          [],
        );
        expect(probe.table.caption, stateName).to.not.equal("");
      }

      const scored = scoreChart({ ...spec, states });
      for (const id of ["1.1.1", "1.3.1", "2.1.1", "2.4.7", "4.1.2"]) {
        const criterion = scored.criteria.find((item) => item.id === id);
        expect(criterion.status, `${id} ${criterion.remarks}`).to.equal("Supports");
      }
      for (const id of ["1.4.1", "1.4.3", "1.4.11"]) {
        const criterion = scored.criteria.find((item) => item.id === id);
        expect(criterion.status, `${id} ${criterion.remarks}`).to.not.equal("Does not support");
      }

      const focus = (states.interactive || states.default).keyboard.focus;
      expect(focus.visible, JSON.stringify(focus)).to.equal(true);
      if (Number.isFinite(focus.ratio)) expect(focus.ratio).to.be.at.least(3);
      expect(states["hidden-series"].hidden.attribute).to.equal(spec.hideId);
      if (["sparkline", "column-sparkline", "bullet-chart", "gauge-chart"].includes(spec.id)) {
        expect(states["hidden-series"].hidden.hiddenMarks, spec.id).to.be.above(0);
      }
    });
  }
});
