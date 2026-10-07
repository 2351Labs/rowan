import { expect } from "@esm-bundle/chai";

const nextMicrotask = () => Promise.resolve();

async function waitForComponentStyles(chart) {
  const styleLink = chart.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (!(styleLink instanceof HTMLLinkElement) || styleLink.sheet) return;

  await new Promise((resolve) => {
    styleLink.addEventListener("error", resolve, { once: true });
    styleLink.addEventListener("load", resolve, { once: true });
    if (styleLink.sheet) resolve();
  });
}

async function settleChartRender(chart) {
  await nextMicrotask();
  await nextMicrotask();
  await waitForComponentStyles(chart);
}

export async function assertPointControlAlignment({
  chart,
  pointSelector,
  pointKey,
  alignment = "bounds",
}) {
  for (const direction of ["ltr", "rtl"]) {
    chart.dir = direction;
    chart.style.inlineSize = "400px";
    await settleChartRender(chart);

    const controls = chart.shadowRoot.querySelector(".point-controls");
    expect(controls.getAttribute("dir")).to.equal("ltr");
    expect(getComputedStyle(controls).direction).to.equal("ltr");

    const point = chart.shadowRoot.querySelector(`${pointSelector}[data-point-key="${pointKey}"]`);
    const button = chart.shadowRoot.querySelector(`button[data-point-key="${pointKey}"]`);
    expect(point).to.exist;
    expect(button).to.exist;

    const pointBounds = point.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();
    if (alignment === "center") {
      expect(
        Math.abs(
          buttonBounds.left + buttonBounds.width / 2 - (pointBounds.left + pointBounds.width / 2),
        ),
      ).to.be.below(2);
      expect(
        Math.abs(
          buttonBounds.top + buttonBounds.height / 2 - (pointBounds.top + pointBounds.height / 2),
        ),
      ).to.be.below(2);
      continue;
    }

    expect(Math.abs(buttonBounds.left - pointBounds.left)).to.be.below(2);
    expect(Math.abs(buttonBounds.top - pointBounds.top)).to.be.below(2);
    expect(Math.abs(buttonBounds.width - pointBounds.width)).to.be.below(2);
  }
}

export async function assertPointControlLifecycle({ chart, rerender, markSelector }) {
  const first = chart.shadowRoot.querySelector("button[data-point-key]");
  expect(first).to.exist;
  const key = first.dataset.pointKey;
  first.focus();

  rerender();
  await settleChartRender(chart);

  const restored = [...chart.shadowRoot.querySelectorAll("button[data-point-key]")].find(
    (button) => button.dataset.pointKey === key,
  );
  expect(chart.shadowRoot.activeElement === restored).to.equal(true);

  const hover = chart.shadowRoot.querySelector(".hover");
  expect(hover).to.exist;
  const showHover = () => {
    const mark = chart.shadowRoot.querySelector(markSelector);
    expect(mark).to.exist;
    mark.dispatchEvent(
      new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }),
    );
  };

  showHover();
  expect(hover.hidden).to.equal(false);
  chart.remove();
  expect(hover.hidden).to.equal(true);

  document.body.append(chart);
  await settleChartRender(chart);
  showHover();
  expect(hover.hidden).to.equal(false);
  chart.remove();
  expect(hover.hidden).to.equal(true);
}

export async function assertPointControlKeyboardNavigation(chart) {
  const buttons = [...chart.shadowRoot.querySelectorAll("button[data-point-key]")];
  expect(buttons.length).to.be.at.least(2);

  const [first, second] = buttons;
  expect(first.getAttribute("aria-label")).to.be.a("string").and.not.empty;
  expect(second.getAttribute("aria-label")).to.be.a("string").and.not.empty;

  first.focus();
  first.dispatchEvent(
    new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }),
  );
  await nextMicrotask();

  expect(chart.shadowRoot.activeElement === second).to.equal(true);
}
