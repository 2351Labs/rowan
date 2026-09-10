import { expect } from "@esm-bundle/chai";
import "./card.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-card", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders named slots for composition", async () => {
    const card = document.createElement("rowan-card");

    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "Camp Notes";

    const footer = document.createElement("span");
    footer.slot = "footer";
    footer.textContent = "Updated today";

    card.append(title, footer);
    document.body.append(card);
    await nextMicrotask();

    const titleSlot = card.shadowRoot.querySelector('slot[name="title"]');
    const footerSlot = card.shadowRoot.querySelector('slot[name="footer"]');

    expect(titleSlot.assignedElements().length).to.equal(1);
    expect(footerSlot.assignedElements().length).to.equal(1);
  });
});
