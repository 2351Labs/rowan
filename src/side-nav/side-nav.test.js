import { expect } from "@esm-bundle/chai";

import "./side-nav.js";

const nextMicrotask = () => Promise.resolve();

async function renderSideNav() {
  const nav = document.createElement("rowan-side-nav");
  nav.label = "Workspace";

  const overview = document.createElement("rowan-side-nav-item");
  overview.value = "overview";
  overview.textContent = "Overview";

  const activity = document.createElement("rowan-side-nav-item");
  activity.value = "activity";
  activity.textContent = "Activity";

  const settings = document.createElement("rowan-side-nav-item");
  settings.value = "settings";
  settings.disabled = true;
  settings.textContent = "Settings";

  nav.append(overview, activity, settings);
  document.body.append(nav);
  await nextMicrotask();
  await nextMicrotask();

  return { nav, overview, activity, settings };
}

function keydown(item, key) {
  item.shadowRoot
    .querySelector("a")
    .dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-side-nav", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps property-driven activation silent and emits one composed change for keyboard activation", async () => {
    const { nav, overview, activity } = await renderSideNav();
    const events = [];
    nav.addEventListener("rowan-change", (event) => {
      events.push({ detail: event.detail, bubbles: event.bubbles, composed: event.composed });
    });

    nav.value = "activity";
    await nextMicrotask();

    expect(nav.activeItem).to.equal(activity);
    expect(activity.active).to.equal(true);
    expect(events).to.deep.equal([]);
    expect(nav.shadowRoot.querySelector("nav").getAttribute("aria-label")).to.equal("Workspace");

    activity.focus();
    keydown(activity, "ArrowUp");
    expect(overview.shadowRoot.activeElement).to.equal(overview.shadowRoot.querySelector("a"));

    keydown(overview, "Enter");
    await nextMicrotask();

    expect(nav.value).to.equal("overview");
    expect(nav.activeItem).to.equal(overview);
    expect(events).to.have.length(1);
    expect(events[0].detail).to.include({
      value: "overview",
      previousValue: "activity",
      item: overview,
    });
    expect(events[0]).to.include({ bubbles: true, composed: true });
  });

  it("skips disabled items and releases managed tab stops after removal", async () => {
    const { nav, overview, activity, settings } = await renderSideNav();

    expect(overview.shadowRoot.querySelector("a").tabIndex).to.equal(0);
    expect(activity.shadowRoot.querySelector("a").tabIndex).to.equal(-1);
    expect(settings.shadowRoot.querySelector("a").tabIndex).to.equal(-1);

    overview.focus();
    keydown(overview, "ArrowDown");
    expect(activity.shadowRoot.activeElement).to.equal(activity.shadowRoot.querySelector("a"));

    activity.remove();
    document.body.append(activity);
    await nextMicrotask();
    await nextMicrotask();

    expect(activity.shadowRoot.querySelector("a").tabIndex).to.equal(0);
    expect(nav.activeItem).to.equal(null);
  });
});
