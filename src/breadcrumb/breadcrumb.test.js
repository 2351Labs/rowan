import { expect } from "@esm-bundle/chai";
import "./breadcrumb.js";

const nextMicrotask = () => Promise.resolve();

async function waitForStyles(element) {
  const stylesheet = element.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (stylesheet.sheet) return;

  await new Promise((resolve, reject) => {
    stylesheet.addEventListener("load", resolve, { once: true });
    stylesheet.addEventListener("error", reject, { once: true });
  });
}

describe("rowan-breadcrumb", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders nav wrapper", async () => {
    const breadcrumb = document.createElement("rowan-breadcrumb");
    document.body.append(breadcrumb);
    await nextMicrotask();

    expect(breadcrumb.shadowRoot.querySelector("nav")).to.exist;
  });

  it("labels its navigation landmark and projects authored breadcrumb items", async () => {
    const breadcrumb = document.createElement("rowan-breadcrumb");
    const parent = document.createElement("a");
    parent.href = "/projects";
    parent.textContent = "Projects";
    const current = document.createElement("span");
    current.setAttribute("aria-current", "page");
    current.textContent = "Rowan";
    breadcrumb.append(parent, current);
    document.body.append(breadcrumb);
    await nextMicrotask();

    const nav = breadcrumb.shadowRoot.querySelector("nav");
    const slot = nav.querySelector("slot");
    const assigned = slot.assignedElements();
    expect(nav.getAttribute("aria-label")).to.equal("Breadcrumb");
    expect(nav.getAttribute("part")).to.equal("nav");
    expect(assigned).to.have.length(2);
    expect(assigned[0] === parent).to.equal(true);
    expect(assigned[1] === current).to.equal(true);
    expect(current.getAttribute("aria-current")).to.equal("page");
  });

  it("does not render while its host is hidden", async () => {
    const breadcrumb = document.createElement("rowan-breadcrumb");
    document.body.append(breadcrumb);
    await nextMicrotask();
    await waitForStyles(breadcrumb);

    breadcrumb.hidden = true;

    expect(getComputedStyle(breadcrumb).display).to.equal("none");
  });

  it("retains one navigation landmark after reconnecting", async () => {
    const breadcrumb = document.createElement("rowan-breadcrumb");
    document.body.append(breadcrumb);
    await nextMicrotask();
    const nav = breadcrumb.shadowRoot.querySelector("nav");

    breadcrumb.remove();
    document.body.append(breadcrumb);
    await nextMicrotask();

    expect(breadcrumb.shadowRoot.querySelectorAll("nav")).to.have.length(1);
    expect(breadcrumb.shadowRoot.querySelector("nav") === nav).to.equal(true);
  });
});
