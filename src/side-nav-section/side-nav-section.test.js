import { expect } from "@esm-bundle/chai";

import "./side-nav-section.js";
import "../side-nav/side-nav.js";
import "../side-nav-item/side-nav-item.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-side-nav-section", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes a labeled group without becoming a nested navigation landmark", async () => {
    const section = document.createElement("rowan-side-nav-section");
    section.label = "Invexus";
    document.body.append(section);
    await nextMicrotask();

    expect(section.internals.role).to.equal("group");
    expect(section.shadowRoot.querySelector("nav")).to.equal(null);
    expect(section.shadowRoot.querySelector(".label").textContent).to.equal("Invexus");
    expect(section.shadowRoot.querySelector(".label").hidden).to.equal(false);
    expect(section.shadowRoot.querySelector(".trigger").hidden).to.equal(true);
    expect(section.internals.ariaLabel).to.equal("Invexus");
  });

  it("toggles a collapsible group from the user without changing nav value", async () => {
    const nav = document.createElement("rowan-side-nav");
    nav.label = "Products";
    nav.value = "jobs";

    const section = document.createElement("rowan-side-nav-section");
    section.label = "Invexus";
    section.collapsible = true;

    const overview = document.createElement("rowan-side-nav-item");
    overview.value = "overview";
    overview.textContent = "Overview";
    const jobs = document.createElement("rowan-side-nav-item");
    jobs.value = "jobs";
    jobs.textContent = "Jobs";
    section.append(overview, jobs);
    nav.append(section);
    document.body.append(nav);
    await nextMicrotask();
    await nextMicrotask();

    const toggles = [];
    const changes = [];
    section.addEventListener("rowan-toggle", (event) => toggles.push(event.detail));
    nav.addEventListener("rowan-change", (event) => changes.push(event.detail));

    const trigger = section.shadowRoot.querySelector(".trigger");
    expect(section.collapsed).to.equal(false);
    expect(trigger.hidden).to.equal(false);
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    expect(section.shadowRoot.querySelector(".items").hidden).to.equal(false);

    trigger.click();
    await nextMicrotask();
    await nextMicrotask();

    expect(section.collapsed).to.equal(true);
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(section.shadowRoot.querySelector(".items").hidden).to.equal(true);
    expect(toggles).to.deep.equal([{ collapsed: true, expanded: false }]);
    expect(nav.value).to.equal("jobs");
    expect(changes).to.deep.equal([]);

    section.collapsed = false;
    await nextMicrotask();
    expect(toggles).to.have.length(1);
    expect(section.shadowRoot.querySelector(".items").hidden).to.equal(false);
  });

  it("opens a collapsed section when the nav value matches a child", async () => {
    const nav = document.createElement("rowan-side-nav");
    const section = document.createElement("rowan-side-nav-section");
    section.label = "Invexus";
    section.collapsible = true;
    section.collapsed = true;
    const jobs = document.createElement("rowan-side-nav-item");
    jobs.value = "jobs";
    jobs.textContent = "Jobs";
    section.append(jobs);
    nav.append(section);
    document.body.append(nav);
    await nextMicrotask();
    await nextMicrotask();

    expect(section.collapsed).to.equal(true);
    nav.value = "jobs";
    await nextMicrotask();
    await nextMicrotask();
    expect(section.collapsed).to.equal(false);
    expect(jobs.active).to.equal(true);
  });
});
