import { expect } from "@esm-bundle/chai";

import "./side-nav.js";
import "../side-nav-section/side-nav-section.js";

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

  it("adopts a declared active item and ignores clicks on disabled items", async () => {
    const nav = document.createElement("rowan-side-nav");
    const overview = document.createElement("rowan-side-nav-item");
    overview.value = "overview";
    overview.active = true;
    const settings = document.createElement("rowan-side-nav-item");
    settings.value = "settings";
    settings.disabled = true;
    nav.append(overview, settings);
    document.body.append(nav);
    await nextMicrotask();
    await nextMicrotask();

    const events = [];
    nav.addEventListener("rowan-change", (event) => events.push(event));
    settings.shadowRoot.querySelector("a").click();
    await nextMicrotask();

    expect(nav.value).to.equal("overview");
    expect(nav.activeItem === overview).to.equal(true);
    expect(overview.active).to.equal(true);
    expect(settings.active).to.equal(false);
    expect(events).to.have.length(0);
  });

  it("keeps one activation listener after reconnecting", async () => {
    const { nav, activity } = await renderSideNav();
    nav.remove();
    document.body.append(nav);
    await nextMicrotask();
    await nextMicrotask();

    const events = [];
    nav.addEventListener("rowan-change", (event) => events.push(event));
    activity.shadowRoot.querySelector("a").click();
    await nextMicrotask();

    expect(nav.value).to.equal("activity");
    expect(events).to.have.length(1);
    expect(events[0].detail.value).to.equal("activity");
  });

  it("clears selection when value is set to an empty string", async () => {
    const { nav, overview } = await renderSideNav();
    nav.value = "overview";
    await nextMicrotask();
    expect(nav.activeItem).to.equal(overview);

    nav.value = "";
    await nextMicrotask();

    expect(nav.value).to.equal("");
    expect(nav.activeItem).to.equal(null);
    expect(overview.active).to.equal(false);
  });

  it("does not adopt a declared active item when value is explicitly empty", async () => {
    const nav = document.createElement("rowan-side-nav");
    nav.setAttribute("value", "");
    const overview = document.createElement("rowan-side-nav-item");
    overview.value = "overview";
    overview.active = true;
    overview.textContent = "Overview";
    nav.append(overview);
    document.body.append(nav);
    await nextMicrotask();
    await nextMicrotask();

    expect(nav.value).to.equal("");
    expect(nav.activeItem).to.equal(null);
    expect(overview.active).to.equal(false);
  });

  it("selects one item across sections and keeps keyboard sequence", async () => {
    const nav = document.createElement("rowan-side-nav");
    nav.label = "Products";

    const invexus = document.createElement("rowan-side-nav-section");
    invexus.label = "Invexus";
    const overview = document.createElement("rowan-side-nav-item");
    overview.value = "overview";
    overview.textContent = "Overview";
    const jobs = document.createElement("rowan-side-nav-item");
    jobs.value = "jobs";
    jobs.textContent = "Jobs";
    invexus.append(overview, jobs);

    const ptms = document.createElement("rowan-side-nav-section");
    ptms.label = "PTMS";
    const routes = document.createElement("rowan-side-nav-item");
    routes.value = "routes";
    routes.textContent = "Routes";
    ptms.append(routes);

    nav.append(invexus, ptms);
    document.body.append(nav);
    await nextMicrotask();
    await nextMicrotask();

    nav.value = "jobs";
    await nextMicrotask();
    expect(nav.activeItem).to.equal(jobs);
    expect(overview.active).to.equal(false);
    expect(routes.active).to.equal(false);
    expect(invexus.shadowRoot.querySelector(".label").textContent).to.equal("Invexus");

    jobs.focus();
    keydown(jobs, "ArrowDown");
    expect(routes.shadowRoot.activeElement).to.equal(routes.shadowRoot.querySelector("a"));
  });

  it("blocks in-app href navigation when rowan-change is cancelled", async () => {
    const { nav, activity } = await renderSideNav();
    activity.href = "#activity";
    await nextMicrotask();

    nav.addEventListener("rowan-change", (event) => event.preventDefault());
    const click = new MouseEvent("click", { bubbles: true, composed: true, cancelable: true });
    activity.shadowRoot.querySelector("a").dispatchEvent(click);
    await nextMicrotask();

    expect(nav.value).to.equal("activity");
    expect(click.defaultPrevented).to.equal(true);
  });

  it("still lets SPA listeners cancel navigation when the current href is activated again", async () => {
    const { nav, activity } = await renderSideNav();
    activity.href = "#activity";
    nav.value = "activity";
    await nextMicrotask();

    nav.addEventListener("rowan-change", (event) => event.preventDefault());
    const click = new MouseEvent("click", { bubbles: true, composed: true, cancelable: true });
    activity.shadowRoot.querySelector("a").dispatchEvent(click);
    await nextMicrotask();

    expect(nav.value).to.equal("activity");
    expect(click.defaultPrevented).to.equal(true);
  });

  it("does not treat a javascript href as an in-app destination", async () => {
    const { nav, activity } = await renderSideNav();
    activity.href = "javascript:alert(1)";
    await nextMicrotask();

    const events = [];
    nav.addEventListener("rowan-change", (event) => {
      events.push(event);
      event.preventDefault();
    });
    const click = new MouseEvent("click", { bubbles: true, composed: true, cancelable: true });
    activity.shadowRoot.querySelector("a").dispatchEvent(click);
    await nextMicrotask();

    expect(events[0].detail.href).to.equal(null);
    expect(events[0].cancelable).to.equal(false);
    expect(activity.shadowRoot.querySelector("a").getAttribute("href")).to.equal(null);
  });
});
