import { expect } from "@esm-bundle/chai";
import "./carousel.js";

const nextMicrotask = () => Promise.resolve();

function createCarousel({ activeIndex = 0 } = {}) {
  const carousel = document.createElement("rowan-carousel");
  carousel.activeIndex = activeIndex;

  for (const label of ["First", "Second", "Third"]) {
    const panel = document.createElement("article");
    panel.textContent = `${label} panel`;
    carousel.append(panel);
  }

  document.body.append(carousel);
  return carousel;
}

describe("rowan-carousel", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects a zero-based active index and only exposes its active panel", async () => {
    const carousel = createCarousel({ activeIndex: 1 });
    await nextMicrotask();

    const panels = Array.from(carousel.children);
    const status = carousel.shadowRoot.querySelector("[part='status']");

    expect(carousel.activeIndex).to.equal(1);
    expect(carousel.getAttribute("active-index")).to.equal("1");
    expect(panels.map((panel) => panel.hidden)).to.deep.equal([true, false, true]);
    expect(status.textContent).to.equal("Panel 2 of 3");

    carousel.activeIndex = 0;
    await nextMicrotask();

    expect(carousel.hasAttribute("active-index")).to.equal(false);
    expect(panels.map((panel) => panel.hidden)).to.deep.equal([false, true, true]);
  });

  it("emits only user-originated active index changes without panel data", async () => {
    const carousel = createCarousel();
    await nextMicrotask();

    const changes = [];
    const bubbledChanges = [];
    carousel.addEventListener("rowan-change", (event) => changes.push(event.detail));
    document.body.addEventListener("rowan-change", (event) => bubbledChanges.push(event));

    carousel.next();
    await nextMicrotask();
    expect(carousel.activeIndex).to.equal(1);
    expect(changes).to.deep.equal([]);

    carousel.shadowRoot.querySelector('[data-action="next"]').click();
    await nextMicrotask();

    expect(carousel.activeIndex).to.equal(2);
    expect(changes).to.deep.equal([{ activeIndex: 2, previousIndex: 1 }]);
    expect(bubbledChanges).to.have.length(1);
    expect(bubbledChanges[0].bubbles).to.equal(true);
    expect(bubbledChanges[0].composed).to.equal(true);
    expect(bubbledChanges[0].detail).to.deep.equal({ activeIndex: 2, previousIndex: 1 });
  });

  it("supports keyboard movement and disables controls at sequence boundaries", async () => {
    const carousel = createCarousel({ activeIndex: 1 });
    await nextMicrotask();

    const viewport = carousel.shadowRoot.querySelector("[part='viewport']");
    const previous = carousel.shadowRoot.querySelector('[data-action="previous"]');
    const next = carousel.shadowRoot.querySelector('[data-action="next"]');

    viewport.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "End" }));
    await nextMicrotask();

    expect(carousel.activeIndex).to.equal(2);
    expect(next.disabled).to.equal(true);
    expect(previous.disabled).to.equal(false);

    viewport.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Home" }));
    await nextMicrotask();

    expect(carousel.activeIndex).to.equal(0);
    expect(previous.disabled).to.equal(true);
    expect(next.disabled).to.equal(false);
  });

  it("ignores action-like controls supplied inside a slotted panel", async () => {
    const carousel = createCarousel({ activeIndex: 1 });
    const panelButton = document.createElement("button");
    panelButton.dataset.action = "next";
    carousel.children[1].append(panelButton);
    await nextMicrotask();

    const changes = [];
    carousel.addEventListener("rowan-change", (event) => changes.push(event.detail));
    panelButton.click();
    await nextMicrotask();

    expect(carousel.activeIndex).to.equal(1);
    expect(changes).to.deep.equal([]);
  });

  it("clamps active index when slotted panels are removed", async () => {
    const carousel = createCarousel({ activeIndex: 2 });
    await nextMicrotask();

    carousel.lastElementChild.remove();
    await nextMicrotask();
    await nextMicrotask();

    expect(carousel.activeIndex).to.equal(1);
    expect(carousel.getAttribute("active-index")).to.equal("1");
    expect(carousel.shadowRoot.querySelector("[part='status']").textContent).to.equal(
      "Panel 2 of 2",
    );
  });
});
