export const label = "FAST Element";
export const scope = "Minimal FAST Element button, checkbox, and switch custom elements";
export const tableUnavailableReason =
  "FAST Element is an element authoring runtime; this harness does not substitute a third-party table component.";

const tags = {
  button: "rowan-benchmark-fast-button",
  checkbox: "rowan-benchmark-fast-checkbox",
  switch: "rowan-benchmark-fast-switch",
};

function controlsAreRendered(container) {
  return [...container.children].every((control) => control.shadowRoot?.childElementCount > 0);
}

export async function loadFoundation() {
  const { FASTElement, html } = await import("@microsoft/fast-element");

  class BenchmarkButton extends FASTElement {}
  class BenchmarkCheckbox extends FASTElement {}
  class BenchmarkSwitch extends FASTElement {}

  const definitions = [
    [tags.button, BenchmarkButton, html`<button type="button">Continue</button>`],
    [
      tags.checkbox,
      BenchmarkCheckbox,
      html`<label><input type="checkbox" checked />Receive updates</label>`,
    ],
    [
      tags.switch,
      BenchmarkSwitch,
      html`<label><input type="checkbox" role="switch" checked />Notifications</label>`,
    ],
  ];

  for (const [tag, ElementClass, template] of definitions) {
    if (!customElements.get(tag)) {
      await ElementClass.define({ name: tag, template });
    }
  }

  return {
    createControls() {
      const container = document.createElement("section");
      container.append(
        document.createElement(tags.button),
        document.createElement(tags.checkbox),
        document.createElement(tags.switch),
      );
      return container;
    },
    isRendered: controlsAreRendered,
  };
}
