import { expect } from "@esm-bundle/chai";

function waitFor(check) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tick = () => {
      if (check()) {
        resolve();
        return;
      }

      attempts += 1;
      if (attempts === 60) {
        reject(new Error("Astro fixture did not finish its client initialization."));
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  });
}

describe("Astro compatibility", () => {
  let frame = null;

  afterEach(() => {
    frame?.remove();
    frame = null;
  });

  it("runs Rowan client code after static output and preserves native element contracts", async () => {
    frame = document.createElement("iframe");
    frame.src = "/test-fixtures/astro/dist/index.html";
    document.body.append(frame);
    await new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));
    await waitFor(() => Boolean(frame.contentWindow.rowanAstroFixture));

    const documentInFrame = frame.contentDocument;
    const table = documentInFrame.querySelector("rowan-table");
    const form = documentInFrame.querySelector("form");
    const checkbox = form.querySelector("rowan-checkbox");
    const button = form.querySelector("rowan-button");

    button.shadowRoot.querySelector("button").click();
    await waitFor(() => frame.contentWindow.rowanAstroFixture.getClickCount() === 1);

    expect(table.config.rows).to.deep.equal([{ id: "1", name: "Ada" }]);
    expect(checkbox.checked).to.equal(true);
    expect(new FormData(form).get("consent")).to.equal("yes");
    expect(frame.contentWindow.rowanAstroFixture.getClickCount()).to.equal(1);
  });
});
